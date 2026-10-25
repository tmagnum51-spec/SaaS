import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const currentPath = request.nextUrl.pathname;

  // 1. Définissez ici toutes les routes qui nécessitent d'être connecté
  const protectedRoutes = ['/profile', '/dashboard', '/projets', '/a-propos'];
  const isProtectedRoute = protectedRoutes.some((route) => currentPath.startsWith(route));

  // Si c'est une route protégée et qu'il n'y a pas de token -> Redirection vers /login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Si l'utilisateur est déjà connecté et essaie d'aller sur /login -> Redirection vers /profile
  if (currentPath.startsWith('/login') && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

// 3. Indiquez au matcher toutes les routes à intercepter
export const config = {
  matcher: ['/profile/:path*', '/dashboard/:path*', '/projets/:path*','/a-propos/:path*', '/login'],
};