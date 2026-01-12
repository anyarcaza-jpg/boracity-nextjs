// Middleware para autenticación y protección de rutas
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Rutas que requieren autenticación
  const isAdminRoute = pathname.startsWith('/admin');

  // Si intenta acceder a /admin sin estar logueado
  if (isAdminRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si está en /login pero ya está logueado, redirigir a /admin
  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ],
};