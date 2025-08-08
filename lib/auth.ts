// lib/auth.ts - Debug version with manual cookie setting
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const HARDCODED_CREDENTIALS = {
  email: 'admin@teampulse.dev',
  password: 'password123'
};

const AUTH_COOKIE_NAME = 'auth_session';
const USER_COOKIE_NAME = 'user_data';

export async function authenticate(email: string, password: string): Promise<boolean> {
  console.log('🔍 Authenticating:', email);
  const isValid = email === HARDCODED_CREDENTIALS.email && password === HARDCODED_CREDENTIALS.password;
  console.log('🔍 Authentication result:', isValid);
  return isValid;
}

export async function createSession(email: string) {
  console.log('🍪 Creating session for:', email);
  
  try {
    // Try both approaches for Next.js compatibility
    let cookieStore;
    try {
      cookieStore = await cookies(); // Next.js 14+
      console.log('✅ Using async cookies()');
    } catch {
      cookieStore = cookies(); // Next.js 13
      console.log('✅ Using sync cookies()');
    }
    
    // Create a secure session token
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('🔐 Generated session token:', sessionToken);
    
    // Set auth session cookie with explicit settings
    console.log('🍪 Setting auth_session cookie...');
    cookieStore.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: false, // Set to false for development
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax'
    });
    
    // Set user data cookie
    console.log('🍪 Setting user_data cookie...');
    const userData = JSON.stringify({ email });
    cookieStore.set({
      name: USER_COOKIE_NAME,
      value: userData,
      httpOnly: false, // Allow client-side access for UI
      secure: false, // Set to false for development
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax'
    });
    
    console.log('✅ Cookies set successfully');
    
    // Verify cookies were set
    console.log('🔍 Verifying cookies...');
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    const userCookie = cookieStore.get(USER_COOKIE_NAME);
    console.log('🔍 Cookie verification:', {
      authCookieExists: !!authCookie,
      authCookieValue: authCookie?.value,
      userCookieExists: !!userCookie,
      userCookieValue: userCookie?.value
    });
    
    // Also try to read all cookies
    const allCookies = cookieStore.getAll();
    console.log('🔍 All cookies after setting:', allCookies.map(c => ({ name: c.name, value: c.value })));
    
  } catch (error) {
    console.error('❌ Error creating session:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
}

export async function destroySession() {
  console.log('🗑️ Destroying session...');
  try {
    let cookieStore;
    try {
      cookieStore = await cookies();
    } catch {
      cookieStore = cookies();
    }
    
    cookieStore.delete(AUTH_COOKIE_NAME);
    cookieStore.delete(USER_COOKIE_NAME);
    console.log('✅ Session destroyed');
  } catch (error) {
    console.error('❌ Error destroying session:', error);
  }
}

export async function getSession() {
  try {
    let cookieStore;
    try {
      cookieStore = await cookies();
    } catch {
      cookieStore = cookies();
    }
    
    const session = cookieStore.get(AUTH_COOKIE_NAME);
    console.log('🔍 getSession result:', { exists: !!session, value: session?.value });
    return session;
  } catch (error) {
    console.error('❌ Error getting session:', error);
    return null;
  }
}

export async function getUserData() {
  try {
    let cookieStore;
    try {
      cookieStore = await cookies();
    } catch {
      cookieStore = cookies();
    }
    
    const userCookie = cookieStore.get(USER_COOKIE_NAME);
    if (!userCookie?.value) return null;
    
    return JSON.parse(userCookie.value);
  } catch (error) {
    console.error('❌ Error getting user data:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession();
    const result = !!session?.value;
    console.log('🔍 isAuthenticated check:', { hasSession: result, sessionValue: session?.value });
    return result;
  } catch (error) {
    console.error('❌ Error checking authentication:', error);
    return false;
  }
}

// Server action for login - Enhanced debugging
export async function loginAction(prevState: any, formData: FormData) {
  console.log('🚀 =================================');
  console.log('🚀 LOGIN ACTION STARTED');
  console.log('🚀 =================================');
  
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('📝 Login attempt:', { email, password: password ? '[HIDDEN]' : 'MISSING' });

    if (!email || !password) {
      console.log('❌ Missing credentials');
      return { error: 'Email and password are required' };
    }

    console.log('🔐 Calling authenticate...');
    const isValid = await authenticate(email, password);
    
    if (isValid) {
      console.log('✅ Authentication successful, creating session...');
      
      await createSession(email);
      
      console.log('🔄 About to redirect to dashboard...');
      
      // Add a small delay to ensure cookies are fully set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      redirect('/dashboard');
    } else {
      console.log('❌ Authentication failed - invalid credentials');
      return { error: 'Invalid email or password' };
    }
  } catch (error) {
    console.error('❌ LOGIN ACTION ERROR:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error constructor:', error?.constructor?.name);
    
    // Check if it's a Next.js redirect error
    if (error && typeof error === 'object' && 'digest' in error) {
      console.log('🔄 Redirect error detected, re-throwing...');
      throw error;
    }
    
    return { error: 'An unexpected error occurred. Please try again.' };
  } finally {
    console.log('🚀 =================================');
    console.log('🚀 LOGIN ACTION FINISHED');
    console.log('🚀 =================================');
  }
}

// Server action for logout
export async function logoutAction() {
  console.log('🚪 Logout action started');
  try {
    await destroySession();
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('❌ Logout error:', error);
  }
}

// Middleware helper for protected routes
export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/auth/login');
  }
}

// Helper to get user data in server components
export async function getCurrentUser() {
  const authenticated = await isAuthenticated();
  if (!authenticated) return null;
  
  return await getUserData();
}