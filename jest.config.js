// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',

  // Setup file for global test config
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Ignore build and dependency folders
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

  // Path alias mapping (matches tsconfig.json)
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/types$': '<rootDir>/types',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Transform using Next.js babel preset
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },

  // Code coverage settings
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
};
