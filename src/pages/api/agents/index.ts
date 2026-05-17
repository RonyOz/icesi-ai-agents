import type { APIRoute } from 'astro';
import { getAllAgents, createAgent } from '../../../lib/db';

function isAuthenticated(Astro: { cookies: { get: (name: string) => { value: string | undefined } | undefined } }) {
  return Astro.cookies.get('admin_session')?.value === 'icesi-admin-token';
}

export const GET: APIRoute = async (Astro) => {
  if (!isAuthenticated(Astro)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const agents = await getAllAgents();
  return new Response(JSON.stringify(agents), { headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async (Astro) => {
  if (!isAuthenticated(Astro)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const body = await Astro.request.json();
    const { slug, name, summary, description, team, video_url, video_local, cover } = body;
    if (!slug || !name || !summary) {
      return new Response(JSON.stringify({ error: 'slug, name, and summary are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    await createAgent({ slug, name, summary, description: description ?? '', team: team ?? '[]', video_url: video_url ?? null, video_local: video_local ?? null, cover: cover ?? null });
    return new Response(JSON.stringify({ ok: true }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};