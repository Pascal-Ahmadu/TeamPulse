import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Keep cookie names in one place so no mismatch happens
const AUTH_COOKIE_NAME = 'auth_session'; 
const USER_COOKIE_NAME = 'user_data';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Check for the same cookie name that createSession() sets
  const authToken =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ||
    request.cookies.get('auth')?.value; // fallback if needed

  const isLoggedIn = !!authToken;
  const isAuthPage = pathname.startsWith('/auth') || pathname === '/login';
  const isApiRoute = pathname.startsWith('/api');
  const isPublicFile =
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico');
  const isRootPage = pathname === '/';

  // Debug logging (only in dev)
  if (process.env.NODE_ENV === 'development' && !isPublicFile) {
    console.log('🛡️ Middleware:', {
      pathname,
      isLoggedIn,
      isAuthPage,
      isApiRoute,
      hasAuthToken: !!authToken,
      cookieNames: request.cookies.getAll().map((c) => c.name),
    });
  }

  // Skip checks for API, public files, Next internals, or root
  if (isApiRoute || isPublicFile || isRootPage) {
    return NextResponse.next();
  }

  // Logout handling
  if (pathname === '/auth/logout') {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    response.cookies.delete(USER_COOKIE_NAME);
    return response;
  }

  // Redirect unauthenticated users from protected pages
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg)$).*)',
  ],
};
