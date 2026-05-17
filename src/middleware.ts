import { defineMiddleware } from 'astro:middleware';
import { isAdmin } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith('/api/')) return next();

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isAdmin(context.cookies)) {
      return context.redirect('/admin/login');
    }
  }

  return next();
});
