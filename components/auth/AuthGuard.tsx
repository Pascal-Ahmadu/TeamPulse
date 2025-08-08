'use client';

import { useAuth } from './auth-provider';
import { usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const pathname = usePathname();

  // Don't guard during initialization
  if (!isInitialized) {
    return null; // AuthProvider handles loading state
  }

  const isAuthPage = pathname === '/' || 
                    pathname === '/login' || 
                    pathname.startsWith('/auth');

  // Let AuthProvider handle all routing logic
  // AuthGuard just passes children through
  return <>{children}</>;
}