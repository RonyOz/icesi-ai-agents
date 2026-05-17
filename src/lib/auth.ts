import type { AstroCookies } from 'astro';

export const SESSION_COOKIE = 'admin_session';
export const SESSION_TOKEN = 'icesi-admin-token';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function isAdmin(cookies: AstroCookies): boolean {
  return cookies.get(SESSION_COOKIE)?.value === SESSION_TOKEN;
}

export function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function jsonOk(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
