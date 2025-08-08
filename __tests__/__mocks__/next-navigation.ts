import { jest, describe, it, expect } from '@jest/globals';

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn()
}));

export const usePathname = jest.fn(() => "/");
export const useSearchParams = jest.fn(() => null);

// Add test to validate our mocks
describe('Next.js Navigation Mocks', () => {
  it('should provide mock navigation functions', () => {
    const router = useRouter();
    expect(router.push).toBeDefined();
    expect(router.replace).toBeDefined();
    expect(router.back).toBeDefined();
    expect(router.forward).toBeDefined();
    expect(router.refresh).toBeDefined();
    expect(router.prefetch).toBeDefined();
    
    expect(usePathname()).toBe('/');
    expect(useSearchParams()).toBeNull();
  });
});
