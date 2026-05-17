import type { APIRoute } from 'astro';
import { getAllAgents, createAgent } from '../../../lib/db';
import { isAdmin, jsonError, jsonOk } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAdmin(cookies)) return jsonError('Unauthorized', 401);
  try {
    const agents = await getAllAgents();
    return jsonOk(agents);
  } catch (e) {
    console.error('[api/agents GET]', e);
    return jsonError('Database error', 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAdmin(cookies)) return jsonError('Unauthorized', 401);
  try {
    const body = await request.json();
    const { slug, name, summary, description, team, video_url, video_local, cover } = body;
    if (!slug || !name || !summary) {
      return jsonError('slug, name y summary son obligatorios', 400);
    }
    await createAgent({
      slug,
      name,
      summary,
      description,
      team: Array.isArray(team) ? team : [],
      video_url,
      video_local,
      cover,
    });
    return jsonOk({ ok: true }, 201);
  } catch (e) {
    console.error('[api/agents POST]', e);
    return jsonError(String(e), 500);
  }
};
