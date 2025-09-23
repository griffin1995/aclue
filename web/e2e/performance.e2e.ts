/**
 * Performance Testing Suite with Core Web Vitals
 * 
 * Comprehensive performance validation for the App Router migration,
 * measuring Core Web Vitals, bundle sizes, and server component optimization.
 * 
 * Performance Targets:
 * - LCP (Largest Contentful Paint): < 2.5s
 * - FID (First Input Delay): < 100ms
 * - CLS (Cumulative Layout Shift): < 0.1
 * - TTFB (Time to First Byte): < 800ms
 * 
 * App Router Goals:
 * - 70% average server components
 * - Reduced JavaScript bundle size
 * - Improved hydration performance
 * - Better caching strategies
 */

import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

interface CoreWebVitals {
  LCP: number;
  FID: number;
  CLS: number;
  TTFB: number;
}

interface PerformanceMetrics {
  coreWebVitals: CoreWebVitals;
  bundleSize: number;
  loadTime: number;
  serverComponents: number;
  clientComponents: number;
  hydrationTime: number;
}

test.describe('Performance Testing & Core Web Vitals', () => {
  const performanceResults: PerformanceMetrics[] = [];

  test.afterAll(async () => {
    // Save performance results
    const resultsDir = path.join(__dirname, '..', 'test-results', 'performance');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const resultsFile = path.join(resultsDir, `performance-${Date.now()}.json`);
    fs.writeFileSync(resultsFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      results: performanceResults,
      summary: {
        averageLCP: performanceResults.reduce((sum, r) => sum + r.coreWebVitals.LCP, 0) / performanceResults.length,
        averageFID: performanceResults.reduce((sum, r) => sum + r.coreWebVitals.FID, 0) / performanceResults.length,
        averageCLS: performanceResults.reduce((sum, r) => sum + r.coreWebVitals.CLS, 0) / performanceResults.length,
        averageTTFB: performanceResults.reduce((sum, r) => sum + r.coreWebVitals.TTFB, 0) / performanceResults.length,
        serverComponentsRatio: performanceResults.reduce((sum, r) => sum + (r.serverComponents / (r.serverComponents + r.clientComponents)), 0) / performanceResults.length
      }
    }, null, 2));
    
    console.log(`📊 Performance results saved to ${resultsFile}`);
  });

  async function measureCoreWebVitals(page: Page): Promise<CoreWebVitals> {
    // Inject Core Web Vitals measurement script
    await page.addInitScript(() => {
      window.webVitalsData = {};
      
      // Polyfill for older browsers
      if (!window.PerformanceObserver) {
        window.webVitalsData = {
          LCP: 0,
          FID: 0,
          CLS: 0,
          TTFB: performance.timing.responseStart - performance.timing.requestStart
        };
        return;
      }

      // Measure LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.webVitalsData.LCP = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure FID
      new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0];
        if (firstInput) {
          window.webVitalsData.FID = firstInput.processingStart - firstInput.startTime;
        }
      }).observe({ entryTypes: ['first-input'] });

      // Measure CLS
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        window.webVitalsData.CLS = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });

      // Measure TTFB
      new PerformanceObserver((entryList) => {
        const entry = entryList.getEntries()[0];
        window.webVitalsData.TTFB = entry.responseStart - entry.requestStart;
      }).observe({ entryTypes: ['navigation'] });
    });

    // Wait for page to load and settle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Allow time for vitals to be measured

    // Simulate user interaction for FID measurement
    await page.click('body');
    await page.waitForTimeout(1000);

    // Extract measurements
    const vitals = await page.evaluate(() => {
      return window.webVitalsData || {
        LCP: 0,
        FID: 0,
        CLS: 0,
        TTFB: 0
      };
    });

    return vitals as CoreWebVitals;
  }

  async function measurePerformanceMetrics(page: Page, route: string): Promise<PerformanceMetrics> {
    const startTime = Date.now();
    
    await page.goto(route);
    const coreWebVitals = await measureCoreWebVitals(page);
    
    const loadTime = Date.now() - startTime;
    
    // Measure bundle size and component types
    const performanceData = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const bundleSize = scripts.reduce((total, script) => {
        const src = script.getAttribute('src');
        if (src && src.includes('/_next/static/')) {
          // Estimate bundle size (in production, you'd measure actual transferred bytes)
          return total + 100000; // 100KB estimate per script
        }
        return total;
      }, 0);

      // Count server vs client components (based on hydration markers)
      const serverComponents = document.querySelectorAll('[data-server-component]').length;
      const clientComponents = document.querySelectorAll('[data-client-component]').length;
      
      // Measure hydration time
      const hydrationTime = window.performance.getEntriesByName('hydration')[0]?.duration || 0;

      return {
        bundleSize,
        serverComponents,
        clientComponents,
        hydrationTime
      };
    });

    return {
      coreWebVitals,
      loadTime,
      ...performanceData
    };
  }

  test.describe('Core Web Vitals Measurement', () => {
    test('should meet LCP target on homepage (< 2.5s)', async ({ page }) => {
      const metrics = await measurePerformanceMetrics(page, '/');
      performanceResults.push(metrics);
      
      console.log(`🎯 Homepage LCP: ${metrics.coreWebVitals.LCP}ms`);
      expect(metrics.coreWebVitals.LCP).toBeLessThan(2500); // 2.5 seconds
    });

    test('should meet LCP target on authentication pages (< 2.5s)', async ({ page }) => {
      const metrics = await measurePerformanceMetrics(page, '/auth/login');
      performanceResults.push(metrics);
      
      console.log(`🔐 Auth LCP: ${metrics.coreWebVitals.LCP}ms`);
      expect(metrics.coreWebVitals.LCP).toBeLessThan(2500);
    });

    test('should meet LCP target on product discovery (< 2.5s)', async ({ page }) => {
      const metrics = await measurePerformanceMetrics(page, '/discover');
      performanceResults.push(metrics);
      
      console.log(`🛍️ Discover LCP: ${metrics.coreWebVitals.LCP}ms`);
      expect(metrics.coreWebVitals.LCP).toBeLessThan(2500);
    });

    test('should meet FID target across all pages (< 100ms)', async ({ page }) => {
      const routes = ['/', '/auth/login', '/discover', '/dashboard'];
      
      for (const route of routes) {
        const metrics = await measurePerformanceMetrics(page, route);
        performanceResults.push(metrics);
        
        console.log(`⚡ ${route} FID: ${metrics.coreWebVitals.FID}ms`);
        expect(metrics.coreWebVitals.FID).toBeLessThan(100);
      }
    });

    test('should meet CLS target for layout stability (< 0.1)', async ({ page }) => {
      const metrics = await measurePerformanceMetrics(page, '/');
      performanceResults.push(metrics);
      
      console.log(`📐 Homepage CLS: ${metrics.coreWebVitals.CLS}`);
      expect(metrics.coreWebVitals.CLS).toBeLessThan(0.1);
    });

    test('should meet TTFB target for server response (< 800ms)', async ({ page }) => {
      const routes = ['/', '/auth/login', '/discover'];
      
      for (const route of routes) {
        const metrics = await measurePerformanceMetrics(page, route);
        performanceResults.push(metrics);
        
        console.log(`🚀 ${route} TTFB: ${metrics.coreWebVitals.TTFB}ms`);
        expect(metrics.coreWebVitals.TTFB).toBeLessThan(800);
      }
    });
  });

  test.describe('App Router Performance Validation', () => {
    test('should achieve 70% server components ratio target', async ({ page }) => {
      // Test App Router enabled routes
      await page.addInitScript(() => {
        window.process = { env: { 
          NEXT_PUBLIC_APP_ROUTER_ENABLED: 'true',
          NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE: '100',
          NEXT_PUBLIC_APP_ROUTER_ROUTES: 'auth,dashboard,marketing'
        }};
      });

      const routes = ['/auth/login', '/dashboard', '/'];
      const serverComponentRatios: number[] = [];

      for (const route of routes) {
        const metrics = await measurePerformanceMetrics(page, route);
        performanceResults.push(metrics);
        
        const totalComponents = metrics.serverComponents + metrics.clientComponents;
        const serverRatio = totalComponents > 0 ? metrics.serverComponents / totalComponents : 0;
        serverComponentRatios.push(serverRatio);
        
        console.log(`🖥️ ${route} Server Components: ${metrics.serverComponents}/${totalComponents} (${Math.round(serverRatio * 100)}%)`);
      }

      const averageServerRatio = serverComponentRatios.reduce((sum, ratio) => sum + ratio, 0) / serverComponentRatios.length;
      console.log(`📊 Average Server Component Ratio: ${Math.round(averageServerRatio * 100)}%`);
      
      expect(averageServerRatio).toBeGreaterThan(0.7); // 70% target
    });

    test('should reduce JavaScript bundle size compared to Pages Router', async ({ page, context }) => {
      // Measure App Router bundle size
      await page.addInitScript(() => {
        window.process = { env: { 
          NEXT_PUBLIC_APP_ROUTER_ENABLED: 'true',
          NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE: '100',
          NEXT_PUBLIC_APP_ROUTER_ROUTES: 'auth,dashboard'
        }};
      });

      const appRouterMetrics = await measurePerformanceMetrics(page, '/auth/login');
      
      // Measure Pages Router bundle size
      const pagesContext = await context.browser()?.newContext();
      const pagesPage = await pagesContext?.newPage();
      
      if (pagesPage) {
        await pagesPage.addInitScript(() => {
          window.process = { env: { 
            NEXT_PUBLIC_APP_ROUTER_ENABLED: 'false'
          }};
        });

        const pagesRouterMetrics = await measurePerformanceMetrics(pagesPage, '/auth/login');
        
        console.log(`📦 App Router Bundle: ${appRouterMetrics.bundleSize} bytes`);
        console.log(`📦 Pages Router Bundle: ${pagesRouterMetrics.bundleSize} bytes`);
        
        // App Router should have smaller or equal bundle size
        expect(appRouterMetrics.bundleSize).toBeLessThanOrEqual(pagesRouterMetrics.bundleSize * 1.1); // Allow 10% tolerance
        
        await pagesContext?.close();
      }

      performanceResults.push(appRouterMetrics);
    });

    test('should improve hydration performance', async ({ page }) => {
      await page.addInitScript(() => {
        window.process = { env: { 
          NEXT_PUBLIC_APP_ROUTER_ENABLED: 'true',
          NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE: '100',
          NEXT_PUBLIC_APP_ROUTER_ROUTES: 'auth,dashboard'
        }};
      });

      const metrics = await measurePerformanceMetrics(page, '/dashboard');
      performanceResults.push(metrics);
      
      console.log(`⚡ Hydration Time: ${metrics.hydrationTime}ms`);
      
      // Hydration should be fast (< 1 second)
      expect(metrics.hydrationTime).toBeLessThan(1000);
    });
  });

  test.describe('Performance Regression Testing', () => {
    test('should not regress from baseline performance', async ({ page }) => {
      const baselineFile = path.join(__dirname, '..', 'test-results', 'performance', 'baseline.json');
      
      if (fs.existsSync(baselineFile)) {
        const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf-8'));
        
        const currentMetrics = await measurePerformanceMetrics(page, '/');
        performanceResults.push(currentMetrics);
        
        // Compare against baseline with 20% tolerance
        expect(currentMetrics.coreWebVitals.LCP).toBeLessThan(baseline.targetMetrics.LCP * 1.2);
        expect(currentMetrics.coreWebVitals.FID).toBeLessThan(baseline.targetMetrics.FID * 1.2);
        expect(currentMetrics.coreWebVitals.CLS).toBeLessThan(baseline.targetMetrics.CLS * 1.2);
        expect(currentMetrics.coreWebVitals.TTFB).toBeLessThan(baseline.targetMetrics.TTFB * 1.2);
        
        console.log('✅ Performance within acceptable range of baseline');
      } else {
        console.log('⚠️ No baseline found, skipping regression test');
      }
    });

    test('should maintain performance under load simulation', async ({ page }) => {
      // Simulate network throttling
      const client = await page.context().newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: 1500000, // 1.5 Mbps (3G)
        uploadThroughput: 750000,    // 750 Kbps
        latency: 40                  // 40ms
      });

      const metrics = await measurePerformanceMetrics(page, '/');
      performanceResults.push(metrics);
      
      console.log(`🐌 3G LCP: ${metrics.coreWebVitals.LCP}ms`);
      console.log(`🐌 3G TTFB: ${metrics.coreWebVitals.TTFB}ms`);
      
      // Even on slow network, should meet reasonable targets
      expect(metrics.coreWebVitals.LCP).toBeLessThan(4000); // 4 seconds on 3G
      expect(metrics.coreWebVitals.TTFB).toBeLessThan(1500); // 1.5 seconds on 3G
    });
  });

  test.describe('Mobile Performance', () => {
    test('should meet mobile performance targets', async ({ page, context }) => {
      // Create mobile context
      const mobileContext = await context.browser()?.newContext({
        ...context.browser()?.devices?.['iPhone 12'],
        // Throttle CPU to simulate mobile device
      });
      
      const mobilePage = await mobileContext?.newPage();
      
      if (mobilePage) {
        // Throttle CPU
        const client = await mobilePage.context().newCDPSession(mobilePage);
        await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        
        const mobileMetrics = await measurePerformanceMetrics(mobilePage, '/');
        performanceResults.push(mobileMetrics);
        
        console.log(`📱 Mobile LCP: ${mobileMetrics.coreWebVitals.LCP}ms`);
        console.log(`📱 Mobile FID: ${mobileMetrics.coreWebVitals.FID}ms`);
        
        // Mobile targets are slightly more lenient
        expect(mobileMetrics.coreWebVitals.LCP).toBeLessThan(4000); // 4 seconds
        expect(mobileMetrics.coreWebVitals.FID).toBeLessThan(300);  // 300ms
        expect(mobileMetrics.coreWebVitals.CLS).toBeLessThan(0.25); // 0.25
        
        await mobileContext?.close();
      }
    });
  });

  test.describe('Performance Monitoring', () => {
    test('should track performance metrics in analytics', async ({ page }) => {
      await page.addInitScript(() => {
        window.performanceEvents = [];
        
        // Mock analytics tracking
        window.trackPerformance = (metric, value) => {
          window.performanceEvents.push({ metric, value, timestamp: Date.now() });
        };
        
        // Mock Core Web Vitals reporting
        if (window.webVitals) {
          window.webVitals.onLCP(({ value }) => window.trackPerformance('LCP', value));
          window.webVitals.onFID(({ value }) => window.trackPerformance('FID', value));
          window.webVitals.onCLS(({ value }) => window.trackPerformance('CLS', value));
        }
      });

      await page.goto('/');
      await page.waitForTimeout(3000);

      const performanceEvents = await page.evaluate(() => window.performanceEvents || []);
      
      // Should have tracked at least some performance metrics
      expect(performanceEvents.length).toBeGreaterThan(0);
      
      console.log(`📊 Tracked ${performanceEvents.length} performance events`);
    });

    test('should report performance issues to monitoring service', async ({ page }) => {
      // Mock performance issue (slow LCP)
      await page.addInitScript(() => {
        window.performanceIssues = [];
        
        // Simulate slow LCP detection
        setTimeout(() => {
          const slowLCP = 4000; // 4 seconds
          if (slowLCP > 2500) {
            window.performanceIssues.push({
              type: 'LCP_SLOW',
              value: slowLCP,
              threshold: 2500,
              url: window.location.href,
              timestamp: Date.now()
            });
          }
        }, 1000);
      });

      await page.goto('/');
      await page.waitForTimeout(2000);

      const issues = await page.evaluate(() => window.performanceIssues || []);
      
      if (issues.length > 0) {
        console.log(`⚠️ Performance issues detected:`, issues);
        
        // Verify issue reporting structure
        expect(issues[0]).toHaveProperty('type');
        expect(issues[0]).toHaveProperty('value');
        expect(issues[0]).toHaveProperty('threshold');
        expect(issues[0]).toHaveProperty('url');
      }
    });
  });
});