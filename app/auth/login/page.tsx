'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginError {
  message: string;
  field?: keyof LoginFormData;
}

// Cookie helper functions
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<LoginError | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear field-specific errors on input
    if (error?.field === field) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email) {
      setError({ message: 'Email is required', field: 'email' });
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError({ message: 'Please enter a valid email address', field: 'email' });
      return false;
    }
    
    if (!formData.password) {
      setError({ message: 'Password is required', field: 'password' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    startTransition(async () => {
      try {
        // Simulate API delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Client-side credential check (for static export compatibility)
        const DEMO_CREDENTIALS = {
          email: 'admin@teampulse.dev',
          password: 'password123'
        };
        
        console.log('🔍 Checking credentials:', {
          inputEmail: formData.email,
          inputPassword: formData.password,
          expectedEmail: DEMO_CREDENTIALS.email,
          expectedPassword: DEMO_CREDENTIALS.password,
          emailMatch: formData.email.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase(),
          passwordMatch: formData.password === DEMO_CREDENTIALS.password
        });
        
        // Trim whitespace and compare (case-sensitive for password, case-insensitive for email)
        const emailMatch = formData.email.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase();
        const passwordMatch = formData.password === DEMO_CREDENTIALS.password;
        
        if (emailMatch && passwordMatch) {
          const token = `token_${Date.now()}`;
          
          // Store auth state in both localStorage and cookies
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_email', formData.email);
          
          // Set cookie for middleware (using 'auth_token' to match middleware)
          setCookie('auth_token', token, 7);
          
          console.log('✅ Login successful, token set in localStorage and cookie');
          
          // Force a page reload to ensure middleware picks up the new cookie
          window.location.href = '/dashboard';
          
        } else {
          setError({
            message: 'Invalid email or password'
          });
        }
        
      } catch (err) {
        console.error('💥 Login error:', err);
        setError({
          message: err instanceof Error ? err.message : 'An unexpected error occurred'
        });
      }
    });
  };

  const isFieldError = (field: keyof LoginFormData): boolean => {
    return error?.field === field;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-6 pb-6 text-center">
              {/* Brand Header inside card */}
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  <span className="font-bold">TeamPulse</span>
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Enterprise Team Sentiment Analytics Platform
                </p>
              </div>

              <div>
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Email Field */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="email" 
                    className="text-sm font-medium text-slate-700"
                  >
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="Enter your email address"
                    className={cn(
                      "h-11 transition-all duration-200",
                      "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                      isFieldError('email') && "border-red-500 focus:border-red-500 focus:ring-red-200"
                    )}
                    aria-invalid={isFieldError('email')}
                    disabled={isPending}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="password" 
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Enter your password"
                    className={cn(
                      "h-11 transition-all duration-200",
                      "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                      isFieldError('password') && "border-red-500 focus:border-red-500 focus:ring-red-200"
                    )}
                    aria-invalid={isFieldError('password')}
                    disabled={isPending}
                  />
                </div>

                {/* Error Display */}
                {error && (
                  <Alert className="border-red-200 bg-red-50 text-red-800">
                    <svg
                      className="h-4 w-4 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <AlertDescription className="text-sm">
                      {error.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className={cn(
                    "w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600",
                    "hover:from-blue-700 hover:to-indigo-700",
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200 font-medium"
                  )}
                  disabled={isPending}
                  aria-describedby={error ? "login-error" : undefined}
                >
                  {isPending ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    'Sign in to dashboard'
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="mt-0.5 h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">
                      Demo Account
                    </h4>
                    <div className="mt-2 space-y-1 text-xs text-blue-700">
                      <div className="font-mono">
                        <span className="font-medium">Email:</span> admin@teampulse.dev
                      </div>
                      <div className="font-mono">
                        <span className="font-medium">Password:</span> password123
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            © {new Date().getFullYear()} TeamPulse. Built for enterprise team analytics.
          </p>
        </div>
      </div>
    </div>
  );
}