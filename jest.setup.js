import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => require('./__tests__/__mocks__/next-navigation'));

// Setup global fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);
