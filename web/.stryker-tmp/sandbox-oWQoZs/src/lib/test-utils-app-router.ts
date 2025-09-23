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
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock feature flags for testing
export const mockFeatureFlags = stryMutAct_9fa48("11684") ? {} : (stryCov_9fa48("11684"), {
  appRouterEnabled: stryMutAct_9fa48("11685") ? false : (stryCov_9fa48("11685"), true),
  enabledRoutes: stryMutAct_9fa48("11686") ? [] : (stryCov_9fa48("11686"), [stryMutAct_9fa48("11687") ? "" : (stryCov_9fa48("11687"), 'auth'), stryMutAct_9fa48("11688") ? "" : (stryCov_9fa48("11688"), 'products'), stryMutAct_9fa48("11689") ? "" : (stryCov_9fa48("11689"), 'marketing')]),
  rolloutPercentage: 100,
  debugMode: stryMutAct_9fa48("11690") ? false : (stryCov_9fa48("11690"), true)
});

/**
 * Custom render function for App Router components
 */
interface AppRouterRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  featureFlags?: Partial<typeof mockFeatureFlags>;
  user?: {
    id: string;
    email: string;
    name: string;
  } | null;
}
export function renderAppRouterComponent(ui: ReactElement, options: AppRouterRenderOptions = {}) {
  if (stryMutAct_9fa48("11691")) {
    {}
  } else {
    stryCov_9fa48("11691");
    const {
      featureFlags = {},
      user = null,
      ...renderOptions
    } = options;

    // Mock environment variables for feature flags
    const originalEnv = process.env;
    process.env = stryMutAct_9fa48("11692") ? {} : (stryCov_9fa48("11692"), {
      ...originalEnv,
      NEXT_PUBLIC_APP_ROUTER_ENABLED: String(stryMutAct_9fa48("11693") ? featureFlags.appRouterEnabled && mockFeatureFlags.appRouterEnabled : (stryCov_9fa48("11693"), featureFlags.appRouterEnabled ?? mockFeatureFlags.appRouterEnabled)),
      NEXT_PUBLIC_APP_ROUTER_ROUTES: (stryMutAct_9fa48("11694") ? featureFlags.enabledRoutes && mockFeatureFlags.enabledRoutes : (stryCov_9fa48("11694"), featureFlags.enabledRoutes ?? mockFeatureFlags.enabledRoutes)).join(stryMutAct_9fa48("11695") ? "" : (stryCov_9fa48("11695"), ',')),
      NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE: String(stryMutAct_9fa48("11696") ? featureFlags.rolloutPercentage && mockFeatureFlags.rolloutPercentage : (stryCov_9fa48("11696"), featureFlags.rolloutPercentage ?? mockFeatureFlags.rolloutPercentage))
    });
    const result = render(ui, renderOptions);

    // Restore environment variables
    process.env = originalEnv;
    return result;
  }
}

/**
 * Mock server component data fetching
 */
export function mockServerComponentData<T>(data: T): Promise<T> {
  if (stryMutAct_9fa48("11697")) {
    {}
  } else {
    stryCov_9fa48("11697");
    return Promise.resolve(data);
  }
}

/**
 * Mock authentication context for server components
 */
export function mockAuthContext(user?: {
  id: string;
  email: string;
  name: string;
} | null) {
  if (stryMutAct_9fa48("11698")) {
    {}
  } else {
    stryCov_9fa48("11698");
    return stryMutAct_9fa48("11699") ? {} : (stryCov_9fa48("11699"), {
      user,
      isAuthenticated: stryMutAct_9fa48("11700") ? !user : (stryCov_9fa48("11700"), !(stryMutAct_9fa48("11701") ? user : (stryCov_9fa48("11701"), !user))),
      loading: stryMutAct_9fa48("11702") ? true : (stryCov_9fa48("11702"), false)
    });
  }
}

/**
 * Mock product data for testing
 */
export function mockProductData() {
  if (stryMutAct_9fa48("11703")) {
    {}
  } else {
    stryCov_9fa48("11703");
    return stryMutAct_9fa48("11704") ? {} : (stryCov_9fa48("11704"), {
      id: stryMutAct_9fa48("11705") ? "" : (stryCov_9fa48("11705"), 'test-product-1'),
      name: stryMutAct_9fa48("11706") ? "" : (stryCov_9fa48("11706"), 'Test Product'),
      description: stryMutAct_9fa48("11707") ? "" : (stryCov_9fa48("11707"), 'A test product for unit testing'),
      price: 29.99,
      currency: stryMutAct_9fa48("11708") ? "" : (stryCov_9fa48("11708"), 'GBP'),
      image_url: stryMutAct_9fa48("11709") ? "" : (stryCov_9fa48("11709"), '/test-image.jpg'),
      category: stryMutAct_9fa48("11710") ? "" : (stryCov_9fa48("11710"), 'Test Category'),
      rating: 4.5,
      affiliate_url: stryMutAct_9fa48("11711") ? "" : (stryCov_9fa48("11711"), 'https://example.com/product')
    });
  }
}

/**
 * Mock user data for testing
 */
export function mockUserData() {
  if (stryMutAct_9fa48("11712")) {
    {}
  } else {
    stryCov_9fa48("11712");
    return stryMutAct_9fa48("11713") ? {} : (stryCov_9fa48("11713"), {
      id: stryMutAct_9fa48("11714") ? "" : (stryCov_9fa48("11714"), 'test-user-1'),
      email: stryMutAct_9fa48("11715") ? "" : (stryCov_9fa48("11715"), 'test@example.com'),
      name: stryMutAct_9fa48("11716") ? "" : (stryCov_9fa48("11716"), 'Test User')
    });
  }
}

/**
 * Performance testing utilities
 */
export class PerformanceTracker {
  private startTime: number;
  private metrics: Record<string, number> = {};
  constructor() {
    if (stryMutAct_9fa48("11717")) {
      {}
    } else {
      stryCov_9fa48("11717");
      this.startTime = performance.now();
    }
  }
  mark(label: string): void {
    if (stryMutAct_9fa48("11718")) {
      {}
    } else {
      stryCov_9fa48("11718");
      this.metrics[label] = stryMutAct_9fa48("11719") ? performance.now() + this.startTime : (stryCov_9fa48("11719"), performance.now() - this.startTime);
    }
  }
  getMetrics(): Record<string, number> {
    if (stryMutAct_9fa48("11720")) {
      {}
    } else {
      stryCov_9fa48("11720");
      return stryMutAct_9fa48("11721") ? {} : (stryCov_9fa48("11721"), {
        ...this.metrics
      });
    }
  }
  getDuration(): number {
    if (stryMutAct_9fa48("11722")) {
      {}
    } else {
      stryCov_9fa48("11722");
      return stryMutAct_9fa48("11723") ? performance.now() + this.startTime : (stryCov_9fa48("11723"), performance.now() - this.startTime);
    }
  }
}

/**
 * Mock server action responses
 */
export function mockServerActionSuccess<T>(data: T) {
  if (stryMutAct_9fa48("11724")) {
    {}
  } else {
    stryCov_9fa48("11724");
    return stryMutAct_9fa48("11725") ? {} : (stryCov_9fa48("11725"), {
      success: stryMutAct_9fa48("11726") ? false : (stryCov_9fa48("11726"), true),
      data
    });
  }
}
export function mockServerActionError(error: string) {
  if (stryMutAct_9fa48("11727")) {
    {}
  } else {
    stryCov_9fa48("11727");
    return stryMutAct_9fa48("11728") ? {} : (stryCov_9fa48("11728"), {
      success: stryMutAct_9fa48("11729") ? true : (stryCov_9fa48("11729"), false),
      error
    });
  }
}

/**
 * Test helpers for App Router navigation
 */
export function mockAppRouterNavigation() {
  if (stryMutAct_9fa48("11730")) {
    {}
  } else {
    stryCov_9fa48("11730");
    const mockRouter = stryMutAct_9fa48("11731") ? {} : (stryCov_9fa48("11731"), {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn()
    });

    // Mock Next.js navigation
    jest.mock(stryMutAct_9fa48("11732") ? "" : (stryCov_9fa48("11732"), 'next/navigation'), stryMutAct_9fa48("11733") ? () => undefined : (stryCov_9fa48("11733"), () => stryMutAct_9fa48("11734") ? {} : (stryCov_9fa48("11734"), {
      useRouter: stryMutAct_9fa48("11735") ? () => undefined : (stryCov_9fa48("11735"), () => mockRouter),
      usePathname: stryMutAct_9fa48("11736") ? () => undefined : (stryCov_9fa48("11736"), () => stryMutAct_9fa48("11737") ? "" : (stryCov_9fa48("11737"), '/test-path')),
      useSearchParams: stryMutAct_9fa48("11738") ? () => undefined : (stryCov_9fa48("11738"), () => new URLSearchParams())
    })));
    return mockRouter;
  }
}

/**
 * Accessibility testing helpers
 */
export function getByLabelText(container: HTMLElement, text: string) {
  if (stryMutAct_9fa48("11739")) {
    {}
  } else {
    stryCov_9fa48("11739");
    return container.querySelector(stryMutAct_9fa48("11740") ? `` : (stryCov_9fa48("11740"), `[aria-label="${text}"]`));
  }
}
export function getByRole(container: HTMLElement, role: string) {
  if (stryMutAct_9fa48("11741")) {
    {}
  } else {
    stryCov_9fa48("11741");
    return container.querySelector(stryMutAct_9fa48("11742") ? `` : (stryCov_9fa48("11742"), `[role="${role}"]`));
  }
}

/**
 * Server component error boundary testing
 */
export function mockServerComponentError(error: Error) {
  if (stryMutAct_9fa48("11743")) {
    {}
  } else {
    stryCov_9fa48("11743");
    // Mock console.error to prevent error output in tests
    const originalConsoleError = console.error;
    console.error = jest.fn();
    return stryMutAct_9fa48("11744") ? {} : (stryCov_9fa48("11744"), {
      error,
      restore: () => {
        if (stryMutAct_9fa48("11745")) {
          {}
        } else {
          stryCov_9fa48("11745");
          console.error = originalConsoleError;
        }
      }
    });
  }
}

/**
 * Feature flag testing utilities
 */
export function withFeatureFlag<T>(flagName: keyof typeof mockFeatureFlags, value: T, testFn: () => void): void {
  if (stryMutAct_9fa48("11746")) {
    {}
  } else {
    stryCov_9fa48("11746");
    const originalValue = mockFeatureFlags[flagName];
    //  - Dynamic assignment for testing
    mockFeatureFlags[flagName] = value;
    try {
      if (stryMutAct_9fa48("11747")) {
        {}
      } else {
        stryCov_9fa48("11747");
        testFn();
      }
    } finally {
      if (stryMutAct_9fa48("11748")) {
        {}
      } else {
        stryCov_9fa48("11748");
        //  - Restore original value
        mockFeatureFlags[flagName] = originalValue;
      }
    }
  }
}

/**
 * Server component testing configuration
 */
export const serverComponentTestConfig = stryMutAct_9fa48("11749") ? {} : (stryCov_9fa48("11749"), {
  testEnvironment: stryMutAct_9fa48("11750") ? "" : (stryCov_9fa48("11750"), 'jsdom'),
  setupFilesAfterEnv: stryMutAct_9fa48("11751") ? [] : (stryCov_9fa48("11751"), [stryMutAct_9fa48("11752") ? "" : (stryCov_9fa48("11752"), '<rootDir>/src/lib/test-setup-app-router.ts')]),
  moduleNameMapping: stryMutAct_9fa48("11753") ? {} : (stryCov_9fa48("11753"), {
    '^@/(.*)$': stryMutAct_9fa48("11754") ? "" : (stryCov_9fa48("11754"), '<rootDir>/src/$1')
  }),
  testMatch: stryMutAct_9fa48("11755") ? [] : (stryCov_9fa48("11755"), [stryMutAct_9fa48("11756") ? "" : (stryCov_9fa48("11756"), '**/__tests__/**/*.app-router.(ts|tsx)'), stryMutAct_9fa48("11757") ? "" : (stryCov_9fa48("11757"), '**/*.(test|spec).app-router.(ts|tsx)')])
});