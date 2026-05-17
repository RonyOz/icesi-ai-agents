import type { APIRoute } from 'astro';
import { getAgentBySlug, updateAgent, deleteAgent } from '../../../lib/db';
import { isAdmin, jsonError, jsonOk } from '../../../lib/auth';

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!isAdmin(cookies)) return jsonError('Unauthorized', 401);
  const agent = await getAgentBySlug(params.slug!);
  if (!agent) return jsonError('Not found', 404);
  return jsonOk(agent);
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  if (!isAdmin(cookies)) return jsonError('Unauthorized', 401);
  try {
    const body = await request.json();
    await updateAgent(params.slug!, body);
    return jsonOk({ ok: true });
  } catch (e) {
    console.error('[api/agents PUT]', e);
    return jsonError(String(e), 500);
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!isAdmin(cookies)) return jsonError('Unauthorized', 401);
  try {
    await deleteAgent(params.slug!);
    return jsonOk({ ok: true });
  } catch (e) {
    console.error('[api/agents DELETE]', e);
    return jsonError(String(e), 500);
  }
};
