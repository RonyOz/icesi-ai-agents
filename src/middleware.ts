import { defineMiddleware } from 'astro:middleware';

const SESSION_TOKEN = 'icesi-admin-token';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith('/api/')) {
    return next();
  }

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = context.cookies.get('admin_session')?.value;
    if (session !== SESSION_TOKEN) {
      return context.redirect('/admin/login');
    }
  }

  return next();
});