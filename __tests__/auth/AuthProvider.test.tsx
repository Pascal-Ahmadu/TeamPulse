import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, beforeAll, jest } from '@jest/globals'; 
import AuthProvider from '@/components/auth/auth-provider';

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: mockReplace,
};

const mockUsePathname = jest.fn(() => '/dashboard');

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockUsePathname(),
}));

// Mock auth module
jest.mock('@/lib/auth', () => ({
  logoutAction: jest.fn(() => Promise.resolve())
}));

// Mock Sidebar component
jest.mock('@/components/layout/sidebar', () => {
  return function MockSidebar({ onLogout }: { onLogout: () => void }) {
    return (
      <div data-testid="sidebar">
        <button 
          data-testid="logout-button" 
          onClick={onLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    );
  };
});

// Mock fetch API
const mockFetch = jest.fn().mockImplementation(() => 
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: () => Promise.resolve({ authenticated: false }),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    clone: function() { return this; },
    body: null,
    bodyUsed: false,
    redirected: false,
    type: 'basic' as ResponseType,
    url: ''
  } as Response)
) as jest.MockedFunction<typeof fetch>;

beforeAll(() => {
  global.fetch = mockFetch;
});

// Helper to create mock responses
function createMockResponse(data: { authenticated: boolean; user?: { email: string } }) {
  return Promise.resolve({
    ok: data.authenticated,
    status: data.authenticated ? 200 : 401,
    statusText: data.authenticated ? 'OK' : 'Unauthorized',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    clone: function() { return this; },
    body: null,
    bodyUsed: false,
    redirected: false,
    type: 'basic' as ResponseType,
    url: ''
  } as Response);
}

// Import the mocked module
import * as auth from '@/lib/auth';

describe('AuthProvider', () => {
  beforeEach(() => {
    // Reset mocks
    mockPush.mockClear();
    mockUsePathname.mockReturnValue('/dashboard');
    mockFetch.mockClear();
    jest.spyOn(auth, 'logoutAction').mockImplementation(() => Promise.resolve());
  });

  it('renders children when authenticated', async () => {
    // Mock authenticated state
    mockFetch.mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ 
        authenticated: true,
        user: { email: 'test@example.com' }
      }),
    } as Response));

    mockUsePathname.mockReturnValue('/dashboard');

    render(
      <AuthProvider>
        <div data-testid="child">Protected Content</div>
      </AuthProvider>
    );

    // Wait for initialization to complete
    await waitFor(() => {
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  it('shows loading spinner during initialization', () => {
    // Delay API response to show loading state
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(
      <AuthProvider>
        <div data-testid="child">Protected Content</div>
      </AuthProvider>
    );

    expect(screen.getByText('Initializing authentication...')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated on protected route', async () => {
    // Mock unauthenticated state
    mockFetch.mockImplementation(() => Promise.resolve({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ authenticated: false }),
    } as Response));

    mockUsePathname.mockReturnValue('/dashboard');

    render(
      <AuthProvider>
        <div data-testid="child">Protected Content</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('redirects to dashboard when authenticated on auth page', async () => {
    // Mock authenticated state
    mockFetch.mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({
        authenticated: true,
        user: { email: 'test@example.com' }
      }),
    } as Response));

    mockUsePathname.mockReturnValue('/auth/login');

    render(
      <AuthProvider>
        <div data-testid="child">Auth Content</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('renders auth pages without sidebar when on auth route', async () => {
    // Mock unauthenticated state
    mockFetch.mockImplementation(() => Promise.resolve({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ authenticated: false }),
    } as Response));

    mockUsePathname.mockReturnValue('/auth/login');

    render(
      <AuthProvider>
        <div data-testid="auth-content">Login Page</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-content')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('handles logout correctly', async () => {
    // Mock authenticated state
    mockFetch.mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({
        authenticated: true,
        user: { email: 'test@example.com' }
      }),
    } as Response));

    mockUsePathname.mockReturnValue('/dashboard');

    render(
      <AuthProvider>
        <div data-testid="child">Protected Content</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    const logoutButton = screen.getByTestId('logout-button');
    await userEvent.click(logoutButton);

    // Verify logout action and redirect
    expect(auth.logoutAction).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('shows redirect spinner when unauthenticated user is on protected page', async () => {
    // Mock unauthenticated state
    mockFetch.mockImplementation(() => Promise.resolve({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: () => Promise.resolve({ authenticated: false }),
    } as Response));

    mockUsePathname.mockReturnValue('/teams');

    render(
      <AuthProvider>
        <div data-testid="child">Protected Content</div>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });
});