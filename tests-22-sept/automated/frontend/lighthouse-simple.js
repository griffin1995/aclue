module.exports = {
  extends: 'lighthouse:default',
  settings: {
    // Include Core Web Vitals
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],

    // Mobile testing
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 360,
      height: 640,
      deviceScaleFactor: 2.625,
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
      '--disable-setuid-sandbox',
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
    ]
  }
};