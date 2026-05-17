import { createClient } from '@libsql/client';
import { nanoid } from 'nanoid';

let _client: ReturnType<typeof createClient> | null = null;

function getDb() {
  if (!_client) {
    _client = createClient({
      url: import.meta.env.TURSO_DATABASE_URL,
      authToken: import.meta.env.TURSO_AUTH_TOKEN,
    });
  }
  return _client;
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  area: string | null;
  encargado: string | null;
  video_url: string | null;
  cover: string | null;
  updated_at: string | null;
}

export interface AgentInput {
  slug: string;
  name: string;
  summary: string;
  description?: string;
  area?: string | null;
  encargado?: string | null;
  video_url?: string | null;
  cover?: string | null;
}

const SELECT_COLS =
  'id, slug, name, summary, description, area, encargado, video_url, cover, updated_at';

function rowToAgent(row: Record<string, unknown>): Agent {
  return {
    id: String(row.id ?? ''),
    slug: String(row.slug ?? ''),
    name: String(row.name ?? ''),
    summary: String(row.summary ?? ''),
    description: String(row.description ?? ''),
    area: (row.area as string | null) ?? null,
    encargado: (row.encargado as string | null) ?? null,
    video_url: (row.video_url as string | null) ?? null,
    cover: (row.cover as string | null) ?? null,
    updated_at: (row.updated_at as string | null) ?? null,
  };
}

export async function getAllAgents(): Promise<Agent[]> {
  const db = getDb();
  const result = await db.execute(`SELECT ${SELECT_COLS} FROM agents ORDER BY name`);
  return result.rows.map((r) => rowToAgent(r as Record<string, unknown>));
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT ${SELECT_COLS} FROM agents WHERE slug = ?`,
    args: [slug],
  });
  const row = result.rows[0];
  return row ? rowToAgent(row as Record<string, unknown>) : null;
}

export async function createAgent(input: AgentInput): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO agents (id, slug, name, summary, description, area, encargado, video_url, cover)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      nanoid(),
      input.slug,
      input.name,
      input.summary,
      input.description ?? '',
      input.area ?? null,
      input.encargado ?? null,
      input.video_url ?? null,
      input.cover ?? null,
    ],
  });
}

export async function updateAgent(
  slug: string,
  patch: Partial<Omit<AgentInput, 'slug'>>,
): Promise<void> {
  const db = getDb();
  const fields: string[] = [];
  const args: (string | null)[] = [];

  if (patch.name !== undefined) { fields.push('name = ?'); args.push(patch.name); }
  if (patch.summary !== undefined) { fields.push('summary = ?'); args.push(patch.summary); }
  if (patch.description !== undefined) { fields.push('description = ?'); args.push(patch.description); }
  if (patch.area !== undefined) { fields.push('area = ?'); args.push(patch.area); }
  if (patch.encargado !== undefined) { fields.push('encargado = ?'); args.push(patch.encargado); }
  if (patch.video_url !== undefined) { fields.push('video_url = ?'); args.push(patch.video_url); }
  if (patch.cover !== undefined) { fields.push('cover = ?'); args.push(patch.cover); }

  if (fields.length === 0) return;
  args.push(slug);

  await db.execute({
    sql: `UPDATE agents SET ${fields.join(', ')} WHERE slug = ?`,
    args,
  });
}

export async function deleteAgent(slug: string): Promise<void> {
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM agents WHERE slug = ?', args: [slug] });
}
