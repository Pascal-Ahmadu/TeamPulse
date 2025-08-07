import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth token in cookies - match the cookie name your app uses
  const authToken = request.cookies.get('auth_token')?.value || request.cookies.get('auth')?.value;
  
  const isLoggedIn = !!authToken;
  const isAuthPage = pathname.startsWith('/auth') || pathname === '/login';
  const isApiRoute = pathname.startsWith('/api');
  const isPublicFile = pathname.startsWith('/_next') || pathname.includes('.');
  const isRootPage = pathname === '/';

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development' && !isPublicFile) {
    console.log('🛡️ Middleware:', {
      pathname,
      isLoggedIn,
      isAuthPage,
      isApiRoute,
      hasAuthToken: !!authToken,
      cookieNames: request.cookies.getAll().map(c => c.name)
    });
  }

  // Don't process API routes, public files, Next.js internals, or root page
  if (isApiRoute || isPublicFile || isRootPage) {
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};