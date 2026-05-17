import type { APIRoute } from 'astro';
import { getAgentBySlug, updateAgent, deleteAgent } from '../../../lib/db';

function isAuthenticated(Astro: { cookies: { get: (name: string) => { value: string | undefined } | undefined } }) {
  return Astro.cookies.get('admin_session')?.value === 'icesi-admin-token';
}

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!isAuthenticated({ cookies })) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  const slug = params.slug!;
  const agent = await getAgentBySlug(slug);
  if (!agent) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify(agent), { headers: { 'Content-Type': 'application/json' } });
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  if (!isAuthenticated({ cookies })) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const slug = params.slug!;
    const body = await request.json();
    await updateAgent(slug, body);
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!isAuthenticated({ cookies })) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const slug = params.slug!;
    await deleteAgent(slug);
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};