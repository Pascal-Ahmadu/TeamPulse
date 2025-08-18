import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, beforeAll, jest } from '@jest/globals'; 
import AuthProvider, { useAuth } from '@/components/auth/auth-provider';

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

// Test component to access auth context
function TestComponent() {
  const { isAuthenticated, userEmail, isInitialized, logout } = useAuth();
  
  if (!isInitialized) {
    return <div>Loading auth...</div>;
  }
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not-authenticated'}
      </div>
      <div data-testid="user-email">{userEmail || 'no-email'}</div>
      <button data-testid="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

// Import the mocked module
import * as auth from '@/lib/auth';

describe('AuthProvider', () => {
  beforeEach(() => {
    // Reset mocks
    mockPush.mockClear();
    mockReplace.mockClear();
    mockUsePathname.mockReturnValue('/dashboard');
    mockFetch.mockClear();
    jest.spyOn(auth, 'logoutAction').mockImplementation(() => Promise.resolve());
  });

  it('provides authenticated state when user is authenticated', async () => {
    // Mock authenticated state
    mockFetch.mockImplementation(() => createMockResponse({
      authenticated: true,
      user: { email: 'test@example.com' }
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initialization to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });

  it('shows loading state during initialization', async () => {
    // Delay API response to show loading state
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading auth...')).toBeInTheDocument();
  });

  it('provides unauthenticated state when user is not authenticated', async () => {
    // Mock unauthenticated state
    mockFetch.mockImplementation(() => createMockResponse({
      authenticated: false
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('no-email');
  });

  it('handles logout correctly', async () => {
    // Mock authenticated state
    mockFetch.mockImplementation(() => createMockResponse({
      authenticated: true,
      user: { email: 'test@example.com' }
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    const logoutButton = screen.getByTestId('logout-button');
    await userEvent.click(logoutButton);

    // Verify logout action was called
    expect(auth.logoutAction).toHaveBeenCalled();
    
    // Verify state was cleared
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    });

    // Verify redirect to login
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('re-checks auth state when pathname changes', async () => {
    // Start with authenticated state
    mockFetch.mockImplementation(() => createMockResponse({
      authenticated: true,
      user: { email: 'test@example.com' }
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    });

    // Clear previous calls
    mockFetch.mockClear();

    // Mock a different response for the path change check
    mockFetch.mockImplementation(() => createMockResponse({
      authenticated: false
    }));

    // Simulate path change
    act(() => {
      mockUsePathname.mockReturnValue('/profile');
    });

    // Trigger a re-render to simulate the pathname change
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the auth re-check
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it('handles auth check errors gracefully', async () => {
    // Mock fetch to throw an error
    mockFetch.mockImplementation(() => Promise.reject(new Error('Network error')));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    });

    expect(screen.getByTestId('user-email')).toHaveTextContent('no-email');
  });
});