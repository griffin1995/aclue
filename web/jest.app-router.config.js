/**
 * Jest Configuration for App Router Testing
 *
 * Specialized Jest configuration for testing App Router components,
 * server actions, and App Router specific functionality.
 */

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Custom Jest configuration for App Router
const customJestConfig = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/lib/test-setup-app-router.ts'],

  // Module path mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Test patterns specific to App Router
  testMatch: [
    '**/__tests__/**/*.app-router.(ts|tsx)',
    '**/*.(test|spec).app-router.(ts|tsx)',
    '**/src/app/**/*.(test|spec).(ts|tsx)',
    '**/src/components/server/**/*.(test|spec).(ts|tsx)',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/app/**/*.{js,jsx,ts,tsx}',
    'src/components/server/**/*.{js,jsx,ts,tsx}',
    'src/lib/feature-flags.ts',
    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/error.tsx',
    '!src/app/**/not-found.tsx',
    '!**/*.d.ts',
  ],

  // Coverage thresholds for App Router components
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    'src/app/actions/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/components/server/': {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },

  // Test environment variables
  testEnvironmentOptions: {
    customExportConditions: [''],
  },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/performance-reports/',
  ],

  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/'],

  // Globals for server components testing
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },

  // Verbose output for debugging
  verbose: true,

  // Maximum worker processes for parallel testing
  maxWorkers: '50%',

  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache-app-router',

  // Display name for this configuration
  displayName: {
    name: 'APP-ROUTER',
    color: 'blue',
  },
}

// Create the Jest config
module.exports = createJestConfig(customJestConfig)