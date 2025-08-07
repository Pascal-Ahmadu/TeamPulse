import { NextRequest, NextResponse } from 'next/server';
import { authenticate, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  console.log('🚀 API Route called: /api/auth/login');
  
  try {
    // Check content type
    const contentType = request.headers.get('content-type');
    console.log('📝 Content-Type:', contentType);
    
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('📦 Request body received:', { email: body?.email, hasPassword: !!body?.password });
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;
    
    // Validate required fields
    if (!email || !password) {
      console.log('❌ Missing fields');
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }
    
    console.log('🔍 Attempting authentication...');
    
    // Authenticate user
    const isValid = await authenticate(email, password);
    console.log('🔐 Authentication result:', isValid);
    
    if (isValid) {
      console.log('✅ Creating session...');
      await createSession();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      });
    } else {
      console.log('❌ Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid email or password' }, 
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('💥 API Route Error:', error);
    
    // Type-safe error message extraction
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'An error occurred during authentication',
        ...(process.env.NODE_ENV === 'development' && { details: errorMessage })
      }, 
      { status: 500 }
    );
  }
}

// Ensure other HTTP methods return appropriate responses
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  );
}