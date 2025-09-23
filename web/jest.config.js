/**
 * aclue Frontend Jest Configuration
 * 
 * Comprehensive Jest configuration for React component testing, integration testing,
 * and unit testing of the aclue web application. Configured for Next.js with TypeScript,
 * React Testing Library, and proper mock handling.
 * 
 * Testing Architecture:
 * - Component unit testing with React Testing Library
 * - Integration testing with mocked API calls
 * - Custom hook testing with renderHook utilities
 * - Snapshot testing for UI regression detection
 * - Coverage reporting with detailed metrics
 * 
 * Reference Documentation:
 * Based on Next.js testing patterns from docs/nextjs.txt and React testing
 * best practices for enterprise component validation.
 */

const nextJest = require('next/jest');

// Create Jest configuration for Next.js
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Enhanced Jest configuration for comprehensive testing
const customJestConfig = {
  // Test environment for DOM testing
  testEnvironment: 'jest-environment-jsdom',
  
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module path mapping for imports
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
    
    // Handle image imports
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
    '!src/pages/api/**',
    '!**/node_modules/**',
    '!**/.next/**',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/types/**',
  ],
  
  // Coverage thresholds for quality gates
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75, 
      lines: 80,
      statements: 80,
    },
    // Specific thresholds for critical components
    './src/components/auth/': {
      branches: 80,
      functions: 80,
      lines: 90,
      statements: 90,
    },
    './src/components/swipe/': {
      branches: 75,
      functions: 75,
      lines: 85,
      statements: 85,
    },
  },
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Test timeout (in milliseconds)
  testTimeout: 30000,
  
  // Transform configuration (use Next.js built-in transform)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
    customExportConditions: [''],
  },
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/out/',
    '<rootDir>/coverage/',
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Reset modules between tests
  resetModules: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output for debugging
  verbose: process.env.NODE_ENV === 'development',
  
  // Watch plugins for development (removed due to version conflicts)
  // watchPlugins: [
  //   'jest-watch-typeahead/filename',
  //   'jest-watch-typeahead/testname',
  // ],
  
  // Error handling
  errorOnDeprecated: true,
  
  // Performance monitoring
  maxWorkers: process.env.CI ? 2 : '50%',
  
  // Cache configuration
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
};

// Export configuration with Next.js optimizations
module.exports = createJestConfig(customJestConfig);