/**
 * aclue End-to-End Testing Configuration
 * 
 * Comprehensive Playwright configuration for e2e testing of the aclue web application.
 * Configured for cross-browser testing, mobile simulation, and CI/CD integration
 * with proper test isolation and reporting.
 * 
 * Testing Strategy:
 * - Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
 * - Mobile and tablet device simulation
 * - Authentication flows and session management
 * - Critical user journeys and business workflows
 * - Visual regression testing with screenshots
 * - Performance testing and lighthouse audits
 * 
 * Test Environment:
 * - Local development server testing
 * - Staging environment validation
 * - Production smoke testing
 * - Continuous integration pipeline support
 * 
 * Reference Documentation:
 * Based on Playwright best practices for Next.js applications and
 * enterprise e2e testing patterns for reliable automation.
 */
// @ts-nocheck


import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Test directory and file patterns
  testDir: './e2e',
  
  // Test file patterns
  testMatch: [
    '**/*.e2e.ts',
    '**/*.spec.ts',
    '**/tests/**/*.ts',
  ],

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    // Add line reporter for CI
    process.env.CI ? ['line'] : ['list'],
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    // Record video on failure
    video: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Global test timeout
    actionTimeout: 30_000,
    navigationTimeout: 30_000,
    
    // Ignore HTTPS errors for development
    ignoreHTTPSErrors: true,
    
    // Locale for testing
    locale: 'en-GB',
    
    // Timezone for testing
    timezoneId: 'Europe/London',
    
    // Accept downloads
    acceptDownloads: true,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Additional Chrome flags for testing
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
          ],
        },
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },

    // Test against mobile viewports
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        // Enable location for mobile testing
        geolocation: { longitude: -0.118092, latitude: 51.509865 }, // London
        permissions: ['geolocation'],
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
      },
    },

    // Test against branded browsers
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },

    // Tablet testing
    {
      name: 'iPad',
      use: {
        ...devices['iPad Pro'],
      },
    },

    // High DPI testing
    {
      name: 'High DPI',
      use: {
        ...devices['Desktop Chrome HiDPI'],
      },
    },
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./e2e/global-setup.ts'),
  globalTeardown: require.resolve('./e2e/global-teardown.ts'),

  // Test output directory
  outputDir: 'test-results/playwright',

  // Expect configuration
  expect: {
    // Maximum time expect() should wait for the condition to be met
    timeout: 10_000,
    
    // Threshold for pixel comparison
    threshold: 0.2,
    
    // Screenshot comparison options
    toHaveScreenshot: {
      threshold: 0.2,
      mode: 'actual',
    },
    
    // Visual comparison tolerance
    toMatchSnapshot: {
      threshold: 0.3,
    },
  },

  // Web server configuration for development testing
  webServer: process.env.CI
    ? undefined // In CI, assume server is already running
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000, // 2 minutes to start dev server
        env: {
          NODE_ENV: 'test',
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
        },
      },

  // Test metadata
  metadata: {
    'test-type': 'e2e',
    'application': 'aclue-web',
    'environment': process.env.TEST_ENV || 'development',
  },
});