'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  logout: () => void;
  isInitialized: boolean;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: null,
  logout: () => {},
  isInitialized: false,
  isLoggingOut: false,
});

export const useAuth = () => useContext(AuthContext);

// Pure Authentication Provider - only handles auth state
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Re-check auth when pathname changes (optional)
  useEffect(() => {
    if (!isInitialized) return;
    
    // Only re-check on certain route changes if needed
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
  }, [pathname, isInitialized, checkAuthState]); // Removed isAuthenticated dependency

  const handleLogout = useCallback(async () => {
    try {
      console.log('🚪 Starting logout process...');
      
      // Set logging out state
      setIsLoggingOut(true);
      
      // Immediately update state to show we're logging out
      setIsAuthenticated(false);
      setUserEmail(null);
      
      // Call the logout action
      await logoutAction();
      
      console.log('✅ Logout successful, redirecting...');
      
      // Force navigation to login
      router.replace('/auth/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Even if logout action fails, clear state and redirect
      setIsAuthenticated(false);
      setUserEmail(null);
      router.replace('/auth/login');
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  const contextValue = {
    isAuthenticated,
    userEmail,
    logout: handleLogout,
    isInitialized,
    isLoggingOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}