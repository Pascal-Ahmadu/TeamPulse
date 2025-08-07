'use server';

import { cookies } from 'next/headers';

const HARDCODED_CREDENTIALS = {
  email: 'admin@teampulse.dev',
  password: 'password123'
};

const AUTH_COOKIE_NAME = 'auth';

export async function authenticate(email: string, password: string): Promise<boolean> {
  console.log('🔍 Authenticating:', email);
  return email === HARDCODED_CREDENTIALS.email && password === HARDCODED_CREDENTIALS.password;
}

export async function createSession() {
  console.log('🍪 Creating session...');
  const cookieStore = cookies();
  
  // Create a session token
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  
  cookieStore.set(AUTH_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax'
  });
  
  console.log('✅ Session created with token:', sessionToken);
}

export async function destroySession() {
  console.log('🗑️ Destroying session...');
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getSession() {
  const cookieStore = cookies();
  return cookieStore.get(AUTH_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.value;
}