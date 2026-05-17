import type { APIRoute } from 'astro';
import { SESSION_COOKIE, jsonOk } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return jsonOk({ ok: true });
};
