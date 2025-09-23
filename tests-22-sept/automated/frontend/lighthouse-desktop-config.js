module.exports = {
  extends: 'lighthouse:default',
  settings: {
    // Include Core Web Vitals
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],

    // Desktop testing
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },

    // Chrome launch options
    chromeFlags: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ],

    // Output options
    output: 'json',
    locale: 'en-GB',

    // Additional settings
    maxWaitForLoad: 45000,
    maxWaitForFcp: 30000,
    pauseAfterLoadMs: 1000,
    networkQuietThresholdMs: 1000,
    cpuQuietThresholdMs: 1000,

    // Skip certain audits that might be problematic
    skipAudits: [
      'is-on-https', // May fail in local development
      'uses-http2', // May not be applicable for all environments
    ],

    // Include additional audits
    additionalTraceCategories: 'loading,rail,devtools.timeline',

    // Core Web Vitals thresholds for desktop
    budgets: [{
      resourceSizes: [
        { resourceType: 'total', budget: 1600 },
        { resourceType: 'script', budget: 350 },
        { resourceType: 'image', budget: 1024 },
        { resourceType: 'stylesheet', budget: 150 },
        { resourceType: 'font', budget: 100 },
      ],
      timings: [
        { metric: 'first-contentful-paint', budget: 1200 },
        { metric: 'largest-contentful-paint', budget: 1500 },
        { metric: 'cumulative-layout-shift', budget: 0.1 },
        { metric: 'total-blocking-time', budget: 150 },
      ]
    }]
  }
};