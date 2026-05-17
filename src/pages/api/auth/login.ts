import type { APIRoute } from 'astro';
import { SESSION_COOKIE, SESSION_TOKEN, SESSION_MAX_AGE, jsonError, jsonOk } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return jsonError('Invalid request', 400);
  }

  if (typeof password !== 'string' || password !== import.meta.env.ADMIN_PASSWORD) {
    return jsonError('Invalid password', 401);
  }

  cookies.set(SESSION_COOKIE, SESSION_TOKEN, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: SESSION_MAX_AGE,
  });

  return jsonOk({ ok: true });
};
