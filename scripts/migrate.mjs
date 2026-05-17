import { createClient } from '@libsql/client';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseMdxFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const raw = match[1];
  const result = {};
  const lines = raw.split('\n');
  let currentKey = null;
  let currentValue = '';
  let inArray = false;
  const arrayItems = [];

  for (const line of lines) {
    if (inArray) {
      if (line.match(/^\s*\]/)) {
        result[currentKey] = arrayItems;
        inArray = false;
        currentKey = null;
        arrayItems.length = 0;
      } else {
        const itemMatch = line.match(/^\s*-\s*"?([^"]*)"?/);
        if (itemMatch) arrayItems.push(itemMatch[1].trim());
      }
      continue;
    }
    const kvMatch = line.match(/^(\w+(?:Url|Local|Cover)?):\s*(.*)/);
    if (kvMatch) {
      if (currentKey) result[currentKey] = currentValue.trim();
      currentKey = kvMatch[1];
      let val = kvMatch[2].trim();
      if (val === '' || val === '""' || val === "''") {
        currentValue = '';
      } else if (val === '[]') {
        result[currentKey] = [];
        currentKey = null;
      } else if (val.startsWith('[')) {
        inArray = true;
        arrayItems.length = 0;
        const itemMatch = val.match(/^\[\s*(.*?)\s*\]$/);
        if (itemMatch && itemMatch[1]) {
          const innerItems = itemMatch[1].split(',').map(s => {
            const m = s.trim().match(/^"?([^"]*)"?$/);
            return m ? m[1].trim() : s.trim();
          });
          result[currentKey] = innerItems;
          currentKey = null;
        } else {
          result[currentKey] = [];
        }
      } else {
        const strMatch = val.match(/^"?([^"]*)"?$/);
        currentValue = strMatch ? strMatch[1] : val;
      }
    }
  }
  if (currentKey) result[currentKey] = currentValue.trim();
  return result;
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

console.log('Creating table...');
await db.execute(`
  CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    team TEXT DEFAULT '[]',
    video_url TEXT,
    video_local TEXT,
    cover TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

const agentsDir = join(__dirname, '../src/content/agents');
const files = readdirSync(agentsDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

console.log(`Found ${files.length} MDX files to migrate`);

for (const file of files) {
  const slug = file.replace(/\.(md|mdx)$/, '');
  const content = readFileSync(join(agentsDir, file), 'utf-8');
  const fm = parseMdxFrontmatter(content);

  const id = slug + '-' + Date.now();
  await db.execute({
    sql: `INSERT OR REPLACE INTO agents (id, slug, name, summary, description, team, video_url, video_local, cover)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      slug,
      fm.name || slug,
      fm.summary || '',
      fm.description || '',
      JSON.stringify(fm.team || []),
      fm.videoUrl || null,
      fm.videoLocal || null,
      fm.cover || null,
    ],
  });
  console.log(`  Migrated: ${slug}`);
}

console.log('Migration complete!');
const result = await db.execute('SELECT COUNT(*) as count FROM agents');
console.log(`Total agents in DB: ${result.rows[0].count}`);
