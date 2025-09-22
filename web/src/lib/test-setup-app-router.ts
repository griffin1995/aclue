/**
 * App Router Test Setup
 *
 * Global test setup for App Router components and server actions.
 * Configures mocks, utilities, and environment for consistent testing.
 */

import React from 'react'

// Mock Next.js App Router modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn()
  }),
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn()
}))

jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  }),
  headers: () => ({
    get: jest.fn()
  })
}))

// Mock Server Actions
jest.mock('@/app/actions/auth', () => ({
  loginAction: jest.fn(),
  registerAction: jest.fn(),
  logoutAction: jest.fn(),
  getCurrentUser: jest.fn()
}))

// Mock feature flags
jest.mock('@/lib/feature-flags', () => ({
  isAppRouterEnabled: jest.fn(() => true),
  isRouteAppRouter: jest.fn(() => true),
  isAppRouterEnabledForUser: jest.fn(() => true),
  useAppRouterFeatureFlag: jest.fn(() => ({
    isAppRouterEnabled: true,
    isRouteEnabled: true,
    isUserEnabled: true,
    shouldUseAppRouter: true,
    config: {
      appRouterEnabled: true,
      enabledRoutes: ['auth', 'products', 'marketing'],
      rolloutPercentage: 100,
      debugMode: true
    }
  }))
}))

// Mock Image component
jest.mock('next/image', () => {
  const MockedImage = ({ src, alt, ...props }: any) => {
    return React.createElement('img', { src, alt, ...props })
  }
  MockedImage.displayName = 'MockedImage'
  return MockedImage
})

// Mock Link component
jest.mock('next/link', () => {
  const MockedLink = ({ children, href, ...props }: any) => {
    return React.createElement('a', { href, ...props }, children)
  }
  MockedLink.displayName = 'MockedLink'
  return MockedLink
})

// Global test environment setup
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks()

  // Mock environment variables
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
  process.env.NEXT_PUBLIC_WEB_URL = 'http://localhost:3000'
  process.env.NEXT_PUBLIC_APP_ROUTER_ENABLED = 'true'
  process.env.NEXT_PUBLIC_APP_ROUTER_ROUTES = 'auth,products,marketing'
  process.env.NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE = '100'
  process.env.NODE_ENV = 'test'
})

afterEach(() => {
  // Clean up after each test
  jest.restoreAllMocks()
})

// Global error handling for tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Suppress console warnings for known issues in tests
const originalConsoleWarn = console.warn
console.warn = (...args: any[]) => {
  // Suppress specific warnings that are expected in tests
  if (
    (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is no longer supported')) ||
    (typeof args[0] === 'string' && args[0].includes('Warning: Function components cannot be given refs'))
  ) {
    return
  }
  originalConsoleWarn(...args)
}

// Extend Jest matchers for App Router testing
expect.extend({
  toBeServerComponent(received) {
    const isServerComponent = received && typeof received === 'object' && received.$$typeof
    return {
      message: () => `expected ${received} to be a server component`,
      pass: isServerComponent
    }
  },

  toHaveFeatureFlag(received, flagName, expectedValue) {
    const hasFlag = received?.props?.['data-feature-flag-' + flagName] === expectedValue
    return {
      message: () => `expected element to have feature flag ${flagName} with value ${expectedValue}`,
      pass: hasFlag
    }
  }
})

// Add custom matchers to TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeServerComponent(): R
      toHaveFeatureFlag(flagName: string, expectedValue: any): R
    }
  }
}