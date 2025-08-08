'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import { logoutAction } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  logout: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: null,
  logout: () => {},
  isInitialized: false,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAuthState = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      setUserEmail(data.user?.email || null);
      return data.authenticated;
    } catch (err) {
      console.error('❌ Auth check failed', err);
      setIsAuthenticated(false);
      setUserEmail(null);
      return false;
    }
  }, []);

  // Initialize authentication
  useEffect(() => {
    (async () => {
      await checkAuthState();
      setIsInitialized(true);
    })();
  }, [checkAuthState]);

  // Re-check when pathname changes
  useEffect(() => {
    if (!isInitialized) return;
    (async () => {
      const wasAuthenticated = isAuthenticated;
      const nowAuthenticated = await checkAuthState();
      console.log('🔄 Path changed - auth check:', {
        pathname,
        wasAuthenticated,
        nowAuthenticated,
        changed: wasAuthenticated !== nowAuthenticated
      });
    })();
  }, [pathname, isInitialized]);

  // Handle redirects
  useEffect(() => {
  if (!isInitialized) return;

  if (pathname === '/') {
    router.replace('/auth/login');
  }
}, [pathname, isInitialized, router]);


  const handleLogout = useCallback(async () => {
    try {
      setIsAuthenticated(false);
      setUserEmail(null);
      await logoutAction();
      router.push('/auth/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      router.push('/auth/login');
    }
  }, [router]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Initializing authentication...</span>
        </div>
      </div>
    );
  }

  const isAuthPage =
    pathname === '/' ||
    pathname === '/login' ||
    pathname.startsWith('/auth');

  const contextValue = {
    isAuthenticated,
    userEmail,
    logout: handleLogout,
    isInitialized
  };

  if (isAuthPage) {
    return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthContext.Provider value={contextValue}>
        <div className="flex h-screen items-center justify-center bg-gray-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Redirecting to login...</span>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  );
}
