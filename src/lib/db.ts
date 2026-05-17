import { createClient } from '@libsql/client';

let _client: ReturnType<typeof createClient> | null = null;

export function getDb() {
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
  team: string;
  video_url: string | null;
  video_local: string | null;
  cover: string | null;
  updated_at: string | null;
}

export async function getAllAgents(): Promise<Agent[]> {
  const db = getDb();
  const result = await db.execute(
    'SELECT id, slug, name, summary, description, team, video_url, video_local, cover, updated_at FROM agents ORDER BY name'
  );
  return result.rows as Agent[];
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT id, slug, name, summary, description, team, video_url, video_local, cover, updated_at FROM agents WHERE slug = ?',
    args: [slug],
  });
  return (result.rows[0] as Agent) ?? null;
}

export async function createAgent(agent: Omit<Agent, 'id' | 'updated_at'>): Promise<void> {
  const db = getDb();
  const { nanoid } = await import('nanoid');
  const id = nanoid();
  await db.execute({
    sql: `INSERT INTO agents (id, slug, name, summary, description, team, video_url, video_local, cover)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, agent.slug, agent.name, agent.summary, agent.description, agent.team, agent.video_url, agent.video_local, agent.cover],
  });
}

export async function updateAgent(slug: string, agent: Partial<Omit<Agent, 'id' | 'updated_at' | 'slug'>>): Promise<void> {
  const db = getDb();
  const fields: string[] = [];
  const args: (string | null)[] = [];

  if (agent.name !== undefined) { fields.push('name = ?'); args.push(agent.name); }
  if (agent.summary !== undefined) { fields.push('summary = ?'); args.push(agent.summary); }
  if (agent.description !== undefined) { fields.push('description = ?'); args.push(agent.description); }
  if (agent.team !== undefined) { fields.push('team = ?'); args.push(agent.team); }
  if (agent.video_url !== undefined) { fields.push('video_url = ?'); args.push(agent.video_url); }
  if (agent.video_local !== undefined) { fields.push('video_local = ?'); args.push(agent.video_local); }
  if (agent.cover !== undefined) { fields.push('cover = ?'); args.push(agent.cover); }

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