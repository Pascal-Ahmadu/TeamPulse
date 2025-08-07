'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status from localStorage
    const authToken = localStorage.getItem('auth_token');
    const isAuthPage = pathname.startsWith('/auth') || pathname === '/login';
    
    if (!authToken && !isAuthPage) {
      // Not authenticated and not on auth page - redirect to login
      router.push('/auth/login');
    } else if (authToken && isAuthPage) {
      // Authenticated but on auth page - redirect to dashboard
      router.push('/dashboard');
    } else {
      // Valid state
      setIsAuthenticated(!!authToken);
    }
    
    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}