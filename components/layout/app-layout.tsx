'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import Sidebar from '@/components/layout/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized, logout, isLoggingOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Handle redirects - remove the duplicate auth checking
  useEffect(() => {
    if (!isInitialized) return;

    const isAuthPage = pathname === '/' || pathname === '/login' || pathname.startsWith('/auth');

    // Redirect root to login
    if (pathname === '/') {
      router.replace('/auth/login');
      return;
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthPage) {
      router.push('/dashboard');
      return;
    }

    // Redirect unauthenticated users to login from protected pages
    if (!isAuthenticated && !isAuthPage) {
      router.push('/auth/login');
      return;
    }
  }, [pathname, isInitialized, isAuthenticated, router]);

  // Show loading state during initialization or logout
  if (!isInitialized || isLoggingOut) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">
            {isLoggingOut ? 'Logging out...' : 'Initializing authentication...'}
          </span>
        </div>
      </div>
    );
  }

  const isAuthPage = pathname === '/' || pathname === '/login' || pathname.startsWith('/auth');

  // Auth pages get clean layout (no sidebar)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Show loading during redirect for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Redirecting to login...</span>
        </div>
      </div>
    );
  }

  // Protected pages get full layout with sidebar
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={logout} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}