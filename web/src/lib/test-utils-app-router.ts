/**
 * Test Utilities for App Router Components
 *
 * This file provides testing utilities specifically designed for App Router components.
 * Includes server component testing, feature flag mocking, and performance testing helpers.
 *
 * Features:
 * - Server component test utilities
 * - Feature flag mocking
 * - App Router navigation mocking
 * - Performance testing helpers
 */

import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock feature flags for testing
export const mockFeatureFlags = {
  appRouterEnabled: true,
  enabledRoutes: ['auth', 'products', 'marketing'],
  rolloutPercentage: 100,
  debugMode: true
}

/**
 * Custom render function for App Router components
 */
interface AppRouterRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  featureFlags?: Partial<typeof mockFeatureFlags>
  user?: {
    id: string
    email: string
    name: string
  } | null
}

export function renderAppRouterComponent(
  ui: ReactElement,
  options: AppRouterRenderOptions = {}
) {
  const { featureFlags = {}, user = null, ...renderOptions } = options

  // Mock environment variables for feature flags
  const originalEnv = process.env
  process.env = {
    ...originalEnv,
    NEXT_PUBLIC_APP_ROUTER_ENABLED: String(featureFlags.appRouterEnabled ?? mockFeatureFlags.appRouterEnabled),
    NEXT_PUBLIC_APP_ROUTER_ROUTES: (featureFlags.enabledRoutes ?? mockFeatureFlags.enabledRoutes).join(','),
    NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE: String(featureFlags.rolloutPercentage ?? mockFeatureFlags.rolloutPercentage)
  }

  const result = render(ui, renderOptions)

  // Restore environment variables
  process.env = originalEnv

  return result
}

/**
 * Mock server component data fetching
 */
export function mockServerComponentData<T>(data: T): Promise<T> {
  return Promise.resolve(data)
}

/**
 * Mock authentication context for server components
 */
export function mockAuthContext(user?: {
  id: string
  email: string
  name: string
} | null) {
  return {
    user,
    isAuthenticated: !!user,
    loading: false
  }
}

/**
 * Mock product data for testing
 */
export function mockProductData() {
  return {
    id: 'test-product-1',
    name: 'Test Product',
    description: 'A test product for unit testing',
    price: 29.99,
    currency: 'GBP',
    image_url: '/test-image.jpg',
    category: 'Test Category',
    rating: 4.5,
    affiliate_url: 'https://example.com/product'
  }
}

/**
 * Mock user data for testing
 */
export function mockUserData() {
  return {
    id: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User'
  }
}

/**
 * Performance testing utilities
 */
export class PerformanceTracker {
  private startTime: number
  private metrics: Record<string, number> = {}

  constructor() {
    this.startTime = performance.now()
  }

  mark(label: string): void {
    this.metrics[label] = performance.now() - this.startTime
  }

  getMetrics(): Record<string, number> {
    return { ...this.metrics }
  }

  getDuration(): number {
    return performance.now() - this.startTime
  }
}

/**
 * Mock server action responses
 */
export function mockServerActionSuccess<T>(data: T) {
  return {
    success: true,
    data
  }
}

export function mockServerActionError(error: string) {
  return {
    success: false,
    error
  }
}

/**
 * Test helpers for App Router navigation
 */
export function mockAppRouterNavigation() {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn()
  }

  // Mock Next.js navigation
  jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/test-path',
    useSearchParams: () => new URLSearchParams()
  }))

  return mockRouter
}

/**
 * Accessibility testing helpers
 */
export function getByLabelText(container: HTMLElement, text: string) {
  return container.querySelector(`[aria-label="${text}"]`)
}

export function getByRole(container: HTMLElement, role: string) {
  return container.querySelector(`[role="${role}"]`)
}

/**
 * Server component error boundary testing
 */
export function mockServerComponentError(error: Error) {
  // Mock console.error to prevent error output in tests
  const originalConsoleError = console.error
  console.error = jest.fn()

  return {
    error,
    restore: () => {
      console.error = originalConsoleError
    }
  }
}

/**
 * Feature flag testing utilities
 */
export function withFeatureFlag<T>(
  flagName: keyof typeof mockFeatureFlags,
  value: T,
  testFn: () => void
): void {
  const originalValue = mockFeatureFlags[flagName]
  // @ts-ignore - Dynamic assignment for testing
  mockFeatureFlags[flagName] = value

  try {
    testFn()
  } finally {
    // @ts-ignore - Restore original value
    mockFeatureFlags[flagName] = originalValue
  }
}

/**
 * Server component testing configuration
 */
export const serverComponentTestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/lib/test-setup-app-router.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '**/__tests__/**/*.app-router.(ts|tsx)',
    '**/*.(test|spec).app-router.(ts|tsx)'
  ]
}