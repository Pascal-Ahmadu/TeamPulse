'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle authentication check
  useEffect(() => {
    if (!mounted) return;

    const authToken = localStorage.getItem('auth_token');
    const isAuth = !!authToken;
    
    console.log('🔍 Auth Check:', {
      pathname,
      hasToken: !!authToken,
      isAuth,
      mounted
    });

    setIsAuthenticated(isAuth);
  }, [mounted]);

  // Handle routing separately to avoid loops
  useEffect(() => {
    if (!mounted || isRedirecting) return;

    const authToken = localStorage.getItem('auth_token');
    const isAuth = !!authToken;
    const isAuthPage = pathname?.startsWith('/auth') || pathname === '/login';

    console.log('🔍 Routing Check:', {
      pathname,
      isAuth,
      isAuthPage,
      shouldRedirectToDashboard: isAuth && isAuthPage,
      shouldRedirectToLogin: !isAuth && !isAuthPage && pathname !== '/'
    });

    if (isAuth && isAuthPage) {
      console.log('✅ Authenticated user on auth page, redirecting to dashboard');
      setIsRedirecting(true);
      router.push('/dashboard');
    } else if (!isAuth && !isAuthPage) {
      console.log('🔒 Unauthenticated user on protected page, redirecting to login');
      setIsRedirecting(true);
      router.push('/auth/login');
    }
  }, [mounted, pathname, router, isRedirecting]);

  // Clear redirecting state when pathname changes successfully
  useEffect(() => {
    if (isRedirecting) {
      const timer = setTimeout(() => {
        setIsRedirecting(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname, isRedirecting]);

const handleLogout = () => {
  // Clear localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_email');
  
  // Clear cookies (using the same setCookie function from your login page)
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Reset all auth state
  setIsAuthenticated(false);
  setIsRedirecting(false);
  
  // Force full page reload to ensure middleware sees the cleared auth state
  window.location.href = '/auth/login';
};

  // Show loading during hydration or redirecting
  if (!mounted || isRedirecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAuthPage = pathname?.startsWith('/auth') || pathname === '/login';
  
  // Render based on current state
  if (isAuthPage) {
    // Auth pages - no sidebar
    return (
      <AuthContext.Provider value={{ isAuthenticated, logout: handleLogout }}>
        {children}
      </AuthContext.Provider>
    );
  } else if (isAuthenticated) {
    // Protected pages with authentication - show sidebar
    return (
      <AuthContext.Provider value={{ isAuthenticated, logout: handleLogout }}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </AuthContext.Provider>
    );
  } else {
    // Unauthenticated on protected page - show loading while redirecting
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
}