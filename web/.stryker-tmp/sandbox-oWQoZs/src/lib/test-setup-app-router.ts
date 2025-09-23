/**
 * App Router Test Setup
 *
 * Global test setup for App Router components and server actions.
 * Configures mocks, utilities, and environment for consistent testing.
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
import React from 'react';

// Mock Next.js App Router modules
jest.mock(stryMutAct_9fa48("11580") ? "" : (stryCov_9fa48("11580"), 'next/navigation'), stryMutAct_9fa48("11581") ? () => undefined : (stryCov_9fa48("11581"), () => stryMutAct_9fa48("11582") ? {} : (stryCov_9fa48("11582"), {
  useRouter: stryMutAct_9fa48("11583") ? () => undefined : (stryCov_9fa48("11583"), () => stryMutAct_9fa48("11584") ? {} : (stryCov_9fa48("11584"), {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn()
  })),
  usePathname: stryMutAct_9fa48("11585") ? () => undefined : (stryCov_9fa48("11585"), () => stryMutAct_9fa48("11586") ? "" : (stryCov_9fa48("11586"), '/test-path')),
  useSearchParams: stryMutAct_9fa48("11587") ? () => undefined : (stryCov_9fa48("11587"), () => new URLSearchParams()),
  redirect: jest.fn()
})));
jest.mock(stryMutAct_9fa48("11588") ? "" : (stryCov_9fa48("11588"), 'next/headers'), stryMutAct_9fa48("11589") ? () => undefined : (stryCov_9fa48("11589"), () => stryMutAct_9fa48("11590") ? {} : (stryCov_9fa48("11590"), {
  cookies: stryMutAct_9fa48("11591") ? () => undefined : (stryCov_9fa48("11591"), () => stryMutAct_9fa48("11592") ? {} : (stryCov_9fa48("11592"), {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  })),
  headers: stryMutAct_9fa48("11593") ? () => undefined : (stryCov_9fa48("11593"), () => stryMutAct_9fa48("11594") ? {} : (stryCov_9fa48("11594"), {
    get: jest.fn()
  }))
})));

// Mock Server Actions
jest.mock(stryMutAct_9fa48("11595") ? "" : (stryCov_9fa48("11595"), '@/app/actions/auth'), stryMutAct_9fa48("11596") ? () => undefined : (stryCov_9fa48("11596"), () => stryMutAct_9fa48("11597") ? {} : (stryCov_9fa48("11597"), {
  loginAction: jest.fn(),
  registerAction: jest.fn(),
  logoutAction: jest.fn(),
  getCurrentUser: jest.fn()
})));

// Mock feature flags
jest.mock(stryMutAct_9fa48("11598") ? "" : (stryCov_9fa48("11598"), '@/lib/feature-flags'), stryMutAct_9fa48("11599") ? () => undefined : (stryCov_9fa48("11599"), () => stryMutAct_9fa48("11600") ? {} : (stryCov_9fa48("11600"), {
  isAppRouterEnabled: jest.fn(stryMutAct_9fa48("11601") ? () => undefined : (stryCov_9fa48("11601"), () => stryMutAct_9fa48("11602") ? false : (stryCov_9fa48("11602"), true))),
  isRouteAppRouter: jest.fn(stryMutAct_9fa48("11603") ? () => undefined : (stryCov_9fa48("11603"), () => stryMutAct_9fa48("11604") ? false : (stryCov_9fa48("11604"), true))),
  isAppRouterEnabledForUser: jest.fn(stryMutAct_9fa48("11605") ? () => undefined : (stryCov_9fa48("11605"), () => stryMutAct_9fa48("11606") ? false : (stryCov_9fa48("11606"), true))),
  useAppRouterFeatureFlag: jest.fn(stryMutAct_9fa48("11607") ? () => undefined : (stryCov_9fa48("11607"), () => stryMutAct_9fa48("11608") ? {} : (stryCov_9fa48("11608"), {
    isAppRouterEnabled: stryMutAct_9fa48("11609") ? false : (stryCov_9fa48("11609"), true),
    isRouteEnabled: stryMutAct_9fa48("11610") ? false : (stryCov_9fa48("11610"), true),
    isUserEnabled: stryMutAct_9fa48("11611") ? false : (stryCov_9fa48("11611"), true),
    shouldUseAppRouter: stryMutAct_9fa48("11612") ? false : (stryCov_9fa48("11612"), true),
    config: stryMutAct_9fa48("11613") ? {} : (stryCov_9fa48("11613"), {
      appRouterEnabled: stryMutAct_9fa48("11614") ? false : (stryCov_9fa48("11614"), true),
      enabledRoutes: stryMutAct_9fa48("11615") ? [] : (stryCov_9fa48("11615"), [stryMutAct_9fa48("11616") ? "" : (stryCov_9fa48("11616"), 'auth'), stryMutAct_9fa48("11617") ? "" : (stryCov_9fa48("11617"), 'products'), stryMutAct_9fa48("11618") ? "" : (stryCov_9fa48("11618"), 'marketing')]),
      rolloutPercentage: 100,
      debugMode: stryMutAct_9fa48("11619") ? false : (stryCov_9fa48("11619"), true)
    })
  })))
})));

// Mock Image component
jest.mock(stryMutAct_9fa48("11620") ? "" : (stryCov_9fa48("11620"), 'next/image'), () => {
  if (stryMutAct_9fa48("11621")) {
    {}
  } else {
    stryCov_9fa48("11621");
    const MockedImage = ({
      src,
      alt,
      ...props
    }: any) => {
      if (stryMutAct_9fa48("11622")) {
        {}
      } else {
        stryCov_9fa48("11622");
        return React.createElement(stryMutAct_9fa48("11623") ? "" : (stryCov_9fa48("11623"), 'img'), stryMutAct_9fa48("11624") ? {} : (stryCov_9fa48("11624"), {
          src,
          alt,
          ...props
        }));
      }
    };
    MockedImage.displayName = stryMutAct_9fa48("11625") ? "" : (stryCov_9fa48("11625"), 'MockedImage');
    return MockedImage;
  }
});

// Mock Link component
jest.mock(stryMutAct_9fa48("11626") ? "" : (stryCov_9fa48("11626"), 'next/link'), () => {
  if (stryMutAct_9fa48("11627")) {
    {}
  } else {
    stryCov_9fa48("11627");
    const MockedLink = ({
      children,
      href,
      ...props
    }: any) => {
      if (stryMutAct_9fa48("11628")) {
        {}
      } else {
        stryCov_9fa48("11628");
        return React.createElement(stryMutAct_9fa48("11629") ? "" : (stryCov_9fa48("11629"), 'a'), stryMutAct_9fa48("11630") ? {} : (stryCov_9fa48("11630"), {
          href,
          ...props
        }), children);
      }
    };
    MockedLink.displayName = stryMutAct_9fa48("11631") ? "" : (stryCov_9fa48("11631"), 'MockedLink');
    return MockedLink;
  }
});

// Global test environment setup
beforeEach(() => {
  if (stryMutAct_9fa48("11632")) {
    {}
  } else {
    stryCov_9fa48("11632");
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock environment variables
    process.env.NEXT_PUBLIC_API_URL = stryMutAct_9fa48("11633") ? "" : (stryCov_9fa48("11633"), 'http://localhost:8000');
    process.env.NEXT_PUBLIC_WEB_URL = stryMutAct_9fa48("11634") ? "" : (stryCov_9fa48("11634"), 'http://localhost:3000');
    process.env.NEXT_PUBLIC_APP_ROUTER_ENABLED = stryMutAct_9fa48("11635") ? "" : (stryCov_9fa48("11635"), 'true');
    process.env.NEXT_PUBLIC_APP_ROUTER_ROUTES = stryMutAct_9fa48("11636") ? "" : (stryCov_9fa48("11636"), 'auth,products,marketing');
    process.env.NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE = stryMutAct_9fa48("11637") ? "" : (stryCov_9fa48("11637"), '100');
    process.env.NODE_ENV = stryMutAct_9fa48("11638") ? "" : (stryCov_9fa48("11638"), 'test');
  }
});
afterEach(() => {
  if (stryMutAct_9fa48("11639")) {
    {}
  } else {
    stryCov_9fa48("11639");
    // Clean up after each test
    jest.restoreAllMocks();
  }
});

// Global error handling for tests
process.on(stryMutAct_9fa48("11640") ? "" : (stryCov_9fa48("11640"), 'unhandledRejection'), (reason, promise) => {
  if (stryMutAct_9fa48("11641")) {
    {}
  } else {
    stryCov_9fa48("11641");
    console.error(stryMutAct_9fa48("11642") ? "" : (stryCov_9fa48("11642"), 'Unhandled Rejection at:'), promise, stryMutAct_9fa48("11643") ? "" : (stryCov_9fa48("11643"), 'reason:'), reason);
  }
});

// Suppress console warnings for known issues in tests
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  if (stryMutAct_9fa48("11644")) {
    {}
  } else {
    stryCov_9fa48("11644");
    // Suppress specific warnings that are expected in tests
    if (stryMutAct_9fa48("11647") ? typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is no longer supported') && typeof args[0] === 'string' && args[0].includes('Warning: Function components cannot be given refs') : stryMutAct_9fa48("11646") ? false : stryMutAct_9fa48("11645") ? true : (stryCov_9fa48("11645", "11646", "11647"), (stryMutAct_9fa48("11649") ? typeof args[0] === 'string' || args[0].includes('Warning: ReactDOM.render is no longer supported') : stryMutAct_9fa48("11648") ? false : (stryCov_9fa48("11648", "11649"), (stryMutAct_9fa48("11651") ? typeof args[0] !== 'string' : stryMutAct_9fa48("11650") ? true : (stryCov_9fa48("11650", "11651"), typeof args[0] === (stryMutAct_9fa48("11652") ? "" : (stryCov_9fa48("11652"), 'string')))) && args[0].includes(stryMutAct_9fa48("11653") ? "" : (stryCov_9fa48("11653"), 'Warning: ReactDOM.render is no longer supported')))) || (stryMutAct_9fa48("11655") ? typeof args[0] === 'string' || args[0].includes('Warning: Function components cannot be given refs') : stryMutAct_9fa48("11654") ? false : (stryCov_9fa48("11654", "11655"), (stryMutAct_9fa48("11657") ? typeof args[0] !== 'string' : stryMutAct_9fa48("11656") ? true : (stryCov_9fa48("11656", "11657"), typeof args[0] === (stryMutAct_9fa48("11658") ? "" : (stryCov_9fa48("11658"), 'string')))) && args[0].includes(stryMutAct_9fa48("11659") ? "" : (stryCov_9fa48("11659"), 'Warning: Function components cannot be given refs')))))) {
      if (stryMutAct_9fa48("11660")) {
        {}
      } else {
        stryCov_9fa48("11660");
        return;
      }
    }
    originalConsoleWarn(...args);
  }
};

// Extend Jest matchers for App Router testing
expect.extend(stryMutAct_9fa48("11661") ? {} : (stryCov_9fa48("11661"), {
  toBeServerComponent(received) {
    if (stryMutAct_9fa48("11662")) {
      {}
    } else {
      stryCov_9fa48("11662");
      const isServerComponent = stryMutAct_9fa48("11665") ? received && typeof received === 'object' || received.$$typeof : stryMutAct_9fa48("11664") ? false : stryMutAct_9fa48("11663") ? true : (stryCov_9fa48("11663", "11664", "11665"), (stryMutAct_9fa48("11667") ? received || typeof received === 'object' : stryMutAct_9fa48("11666") ? true : (stryCov_9fa48("11666", "11667"), received && (stryMutAct_9fa48("11669") ? typeof received !== 'object' : stryMutAct_9fa48("11668") ? true : (stryCov_9fa48("11668", "11669"), typeof received === (stryMutAct_9fa48("11670") ? "" : (stryCov_9fa48("11670"), 'object')))))) && received.$$typeof);
      return stryMutAct_9fa48("11671") ? {} : (stryCov_9fa48("11671"), {
        message: stryMutAct_9fa48("11672") ? () => undefined : (stryCov_9fa48("11672"), () => stryMutAct_9fa48("11673") ? `` : (stryCov_9fa48("11673"), `expected ${received} to be a server component`)),
        pass: isServerComponent
      });
    }
  },
  toHaveFeatureFlag(received, flagName, expectedValue) {
    if (stryMutAct_9fa48("11674")) {
      {}
    } else {
      stryCov_9fa48("11674");
      const hasFlag = stryMutAct_9fa48("11677") ? received?.props?.['data-feature-flag-' + flagName] !== expectedValue : stryMutAct_9fa48("11676") ? false : stryMutAct_9fa48("11675") ? true : (stryCov_9fa48("11675", "11676", "11677"), (stryMutAct_9fa48("11679") ? received.props?.['data-feature-flag-' + flagName] : stryMutAct_9fa48("11678") ? received?.props['data-feature-flag-' + flagName] : (stryCov_9fa48("11678", "11679"), received?.props?.[(stryMutAct_9fa48("11680") ? "" : (stryCov_9fa48("11680"), 'data-feature-flag-')) + flagName])) === expectedValue);
      return stryMutAct_9fa48("11681") ? {} : (stryCov_9fa48("11681"), {
        message: stryMutAct_9fa48("11682") ? () => undefined : (stryCov_9fa48("11682"), () => stryMutAct_9fa48("11683") ? `` : (stryCov_9fa48("11683"), `expected element to have feature flag ${flagName} with value ${expectedValue}`)),
        pass: hasFlag
      });
    }
  }
}));

// Add custom matchers to TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeServerComponent(): R;
      toHaveFeatureFlag(flagName: string, expectedValue: any): R;
    }
  }
}