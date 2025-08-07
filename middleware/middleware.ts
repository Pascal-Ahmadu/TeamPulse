import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('auth');
  const isAuthPage = pathname.startsWith('/auth') || pathname === '/login';
  const isApiRoute = pathname.startsWith('/api');
  const isPublicFile = pathname.startsWith('/_next') || pathname.includes('.');

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development' && !isPublicFile) {
    console.log('🛡️ Middleware:', {
      pathname,
      isLoggedIn: !!isLoggedIn,
      isAuthPage,
      isApiRoute
    });
  }

  // Don't process API routes, public files, or Next.js internals
  if (isApiRoute || isPublicFile) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login (except if already on auth pages)
  if (!isLoggedIn && !isAuthPage) {
    console.log('🔒 Redirecting to login:', pathname);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthPage) {
    console.log('✅ Already logged in, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Exclude API routes, static files, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};