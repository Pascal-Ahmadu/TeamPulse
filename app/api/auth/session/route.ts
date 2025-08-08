import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const authSession = cookies().get('auth_session')?.value;
  const userCookie = cookies().get('user_data')?.value;

  if (!authSession) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  let user = null;
  try {
    if (userCookie) {
      user = JSON.parse(decodeURIComponent(userCookie));
    }
  } catch {
    user = null;
  }

  return NextResponse.json({ authenticated: true, user });
}
