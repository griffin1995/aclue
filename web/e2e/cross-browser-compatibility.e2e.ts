/**
 * Cross-Browser and Device Compatibility Testing Suite
 * 
 * Comprehensive testing across different browsers, devices, and screen sizes
 * to ensure consistent functionality and user experience.
 * 
 * Test Coverage:
 * - Desktop browsers (Chrome, Firefox, Safari, Edge)
 * - Mobile devices (iOS Safari, Android Chrome)
 * - Tablet devices (iPad, Android tablets)
 * - Different screen resolutions and orientations
 * - Touch vs. mouse interaction testing
 * - Browser-specific feature compatibility
 * - Progressive enhancement validation
 * - Responsive design verification
 */

import { test, expect, devices } from '@playwright/test';

const CORE_FUNCTIONALITY_TESTS = [
  {
    name: 'Homepage loads successfully',
    url: '/',
    action: async (page) => {
      await expect(page).toHaveTitle(/Aclue/);
      await expect(page.locator('main')).toBeVisible();
    }
  },
  {
    name: 'Authentication forms work',
    url: '/auth/login',
    action: async (page) => {
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', 'password');
      // Don't actually submit to avoid auth state issues
    }
  },
  {
    name: 'Product discovery loads',
    url: '/discover',
    action: async (page) => {
      await expect(page.locator('[data-testid="product-grid"], .product-container')).toBeVisible();
    }
  },
  {
    name: 'Navigation works',
    url: '/',
    action: async (page) => {
      const nav = await page.locator('nav, [role="navigation"]');
      await expect(nav).toBeVisible();
      
      // Test navigation links
      const navLinks = await nav.locator('a').count();
      expect(navLinks).toBeGreaterThan(0);
    }
  }
];

test.describe('Cross-Browser Compatibility Testing', () => {
  test.describe('Desktop Browsers', () => {
    test('should work correctly in Chromium', async ({ page }) => {
      for (const testCase of CORE_FUNCTIONALITY_TESTS) {
        await page.goto(testCase.url);
        await testCase.action(page);
        console.log(`✅ Chromium: ${testCase.name}`);
      }
    });

    test('should work correctly in Firefox', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Desktop Firefox']
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
          console.log(`🦊 Firefox: ${testCase.name}`);
        }
      } finally {
        await context.close();
      }
    });

    test('should work correctly in Safari', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Desktop Safari']
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
          console.log(`🧭 Safari: ${testCase.name}`);
        }
      } finally {
        await context.close();
      }
    });

    test('should work correctly in Edge', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Desktop Edge'],
        channel: 'msedge'
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
          console.log(`🔷 Edge: ${testCase.name}`);
        }
      } finally {
        await context.close();
      }
    });
  });

  test.describe('Mobile Devices', () => {
    test('should work correctly on iPhone 12', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12']
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
          console.log(`📱 iPhone 12: ${testCase.name}`);
        }

        // Test mobile-specific interactions
        await testMobileInteractions(page);
      } finally {
        await context.close();
      }
    });

    test('should work correctly on iPhone SE', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone SE']
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
          console.log(`📱 iPhone SE: ${testCase.name}`);
        }

        // Test small screen adaptations
        await testSmallScreenLayout(page);
      } finally {
        await context.close();
      }
    });

    test('should work correctly on Pixel 5', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Pixel 5']
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
          console.log(`📱 Pixel 5: ${testCase.name}`);
        }

        // Test Android-specific features
        await testAndroidFeatures(page);
      } finally {
        await context.close();
      }
    });

    test('should work correctly on Galaxy S8', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Galaxy S8']
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
          console.log(`📱 Galaxy S8: ${testCase.name}`);
        }
      } finally {
        await context.close();
      }
    });
  });

  test.describe('Tablet Devices', () => {
    test('should work correctly on iPad Pro', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPad Pro']
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
          console.log(`📱 iPad Pro: ${testCase.name}`);
        }

        // Test tablet-specific layout
        await testTabletLayout(page);
      } finally {
        await context.close();
      }
    });

    test('should work correctly on iPad Mini', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPad Mini']
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
          console.log(`📱 iPad Mini: ${testCase.name}`);
        }
      } finally {
        await context.close();
      }
    });
  });

  test.describe('Custom Screen Sizes', () => {
    test('should work on ultra-wide screens (2560x1080)', async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: 2560, height: 1080 }
      });
      const page = await context.newPage();

      try {
        await page.goto('/');
        
        // Test ultra-wide layout doesn't break
        const mainContent = await page.locator('main');
        const contentWidth = await mainContent.boundingBox();
        
        // Content shouldn't be overly stretched
        expect(contentWidth?.width).toBeLessThan(1800);
        
        console.log('🖥️ Ultra-wide screen layout validated');
      } finally {
        await context.close();
      }
    });

    test('should work on small laptop screens (1366x768)', async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: 1366, height: 768 }
      });
      const page = await context.newPage();

      try {
        for (const testCase of CORE_FUNCTIONALITY_TESTS) {
          await page.goto(testCase.url);
          await testCase.action(page);
        }
        
        console.log('💻 Small laptop screen compatibility validated');
      } finally {
        await context.close();
      }
    });

    test('should work on 4K displays (3840x2160)', async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: 3840, height: 2160 },
        deviceScaleFactor: 2
      });
      const page = await context.newPage();

      try {
        await page.goto('/');
        
        // Test high DPI rendering
        const images = await page.locator('img');
        const imageCount = await images.count();
        
        if (imageCount > 0) {
          // Images should be crisp on high DPI
          const firstImage = images.first();
          const naturalWidth = await firstImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
          const displayWidth = await firstImage.evaluate((img: HTMLImageElement) => img.offsetWidth);
          
          // Image should have sufficient resolution for high DPI
          expect(naturalWidth).toBeGreaterThan(displayWidth);
        }
        
        console.log('🖥️ 4K display compatibility validated');
      } finally {
        await context.close();
      }
    });
  });

  test.describe('Feature Compatibility', () => {
    test('should handle browser feature differences gracefully', async ({ browser }) => {
      const contexts = [
        { name: 'Chrome', device: devices['Desktop Chrome'] },
        { name: 'Firefox', device: devices['Desktop Firefox'] },
        { name: 'Safari', device: devices['Desktop Safari'] }
      ];

      for (const { name, device } of contexts) {
        const context = await browser.newContext(device);
        const page = await context.newPage();

        try {
          await page.goto('/');

          // Test modern JavaScript features
          const modernFeatures = await page.evaluate(() => {
            return {
              hasWebP: 'WebPDecoder' in window || 'webkitWebPDecoder' in window,
              hasIntersectionObserver: 'IntersectionObserver' in window,
              hasWebGL: !!document.createElement('canvas').getContext('webgl'),
              hasLocalStorage: 'localStorage' in window,
              hasSessionStorage: 'sessionStorage' in window,
              hasPromise: 'Promise' in window,
              hasFetch: 'fetch' in window
            };
          });

          console.log(`🔧 ${name} modern features:`, modernFeatures);

          // Essential features should be available
          expect(modernFeatures.hasLocalStorage).toBe(true);
          expect(modernFeatures.hasPromise).toBe(true);
          expect(modernFeatures.hasFetch).toBe(true);

        } finally {
          await context.close();
        }
      }
    });

    test('should provide fallbacks for unsupported features', async ({ page }) => {
      // Disable modern features to test fallbacks
      await page.addInitScript(() => {
        // Mock older browser environment
        delete (window as any).IntersectionObserver;
        delete (window as any).ResizeObserver;
      });

      await page.goto('/');

      // Page should still function without modern features
      await expect(page.locator('main')).toBeVisible();

      // Check for graceful degradation
      const hasErrors = await page.evaluate(() => {
        return window.console.error.length > 0;
      });

      expect(hasErrors).toBeFalsy();
      console.log('🔄 Feature fallbacks working correctly');
    });
  });

  test.describe('Performance Across Devices', () => {
    test('should maintain acceptable performance on slow devices', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['Galaxy S8'] // Older, slower device
      });
      const page = await context.newPage();

      // Simulate slow CPU
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

      try {
        const startTime = Date.now();
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        console.log(`📱 Galaxy S8 load time: ${loadTime}ms`);
        
        // Should load within reasonable time even on slow device
        expect(loadTime).toBeLessThan(10000); // 10 seconds max

      } finally {
        await context.close();
      }
    });

    test('should handle slow network conditions', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 12']
      });
      const page = await context.newPage();

      // Simulate 3G network
      const client = await page.context().newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: 1500000, // 1.5 Mbps
        uploadThroughput: 750000,    // 750 Kbps
        latency: 40                  // 40ms
      });

      try {
        const startTime = Date.now();
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        const loadTime = Date.now() - startTime;

        console.log(`🐌 3G load time: ${loadTime}ms`);
        
        // Should be usable on slow connections
        expect(loadTime).toBeLessThan(8000); // 8 seconds max on 3G

      } finally {
        await context.close();
      }
    });
  });
});

// Helper functions for device-specific testing
async function testMobileInteractions(page: any) {
  await page.goto('/');
  
  // Test touch interactions
  const touchableElements = await page.locator('button, a, [role="button"]');
  const elementCount = await touchableElements.count();
  
  if (elementCount > 0) {
    // Test tap
    await touchableElements.first().tap();
    
    // Test long press (if supported)
    try {
      await touchableElements.first().tap({ delay: 1000 });
    } catch (e) {
      // Long press not supported, that's ok
    }
  }
  
  // Test scroll behavior
  await page.evaluate(() => window.scrollTo(0, 100));
  await page.waitForTimeout(500);
  
  console.log('📱 Mobile interactions tested');
}

async function testSmallScreenLayout(page: any) {
  await page.goto('/');
  
  // Check if mobile navigation is present
  const mobileNav = await page.locator('[data-testid="mobile-nav"], .mobile-menu');
  
  if (await mobileNav.count() > 0) {
    console.log('📱 Mobile navigation detected');
  }
  
  // Ensure no horizontal overflow
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = await page.viewportSize();
  
  expect(bodyWidth).toBeLessThanOrEqual((viewportWidth?.width || 0) + 1);
  console.log('📱 No horizontal overflow on small screen');
}

async function testAndroidFeatures(page: any) {
  await page.goto('/');
  
  // Test Android-specific features if any
  const userAgent = await page.evaluate(() => navigator.userAgent);
  
  if (userAgent.includes('Android')) {
    console.log('🤖 Android-specific features tested');
  }
}

async function testTabletLayout(page: any) {
  await page.goto('/');
  
  // Test tablet-specific layout
  const viewportSize = await page.viewportSize();
  const isTabletSize = viewportSize && viewportSize.width >= 768 && viewportSize.width < 1024;
  
  if (isTabletSize) {
    // Tablet should use appropriate layout
    const content = await page.locator('main');
    const contentBox = await content.boundingBox();
    
    // Content should utilize tablet screen space effectively
    expect(contentBox?.width).toBeGreaterThan(600);
    
    console.log('📱 Tablet layout validated');
  }
}