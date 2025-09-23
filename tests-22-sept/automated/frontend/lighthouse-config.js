module.exports = {
  extends: 'lighthouse:default',
  settings: {
    // Include Core Web Vitals
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],

    // Mobile and Desktop testing
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

    // Core Web Vitals thresholds
    budgets: [{
      resourceSizes: [
        { resourceType: 'total', budget: 1600 },
        { resourceType: 'script', budget: 350 },
        { resourceType: 'image', budget: 1024 },
        { resourceType: 'stylesheet', budget: 150 },
        { resourceType: 'font', budget: 100 },
      ],
      timings: [
        { metric: 'first-contentful-paint', budget: 2000 },
        { metric: 'largest-contentful-paint', budget: 2500 },
        { metric: 'cumulative-layout-shift', budget: 0.1 },
        { metric: 'total-blocking-time', budget: 300 },
      ]
    }]
  },

  // Custom audits configuration
  audits: [
    'metrics/first-contentful-paint',
    'metrics/largest-contentful-paint',
    'metrics/cumulative-layout-shift',
    'metrics/total-blocking-time',
    'metrics/first-meaningful-paint',
    'metrics/speed-index',
    'metrics/interactive',
    'accessibility/accesskeys',
    'accessibility/aria-allowed-attr',
    'accessibility/aria-command-name',
    'accessibility/aria-hidden-body',
    'accessibility/aria-hidden-focus',
    'accessibility/aria-input-field-name',
    'accessibility/aria-meter-name',
    'accessibility/aria-progressbar-name',
    'accessibility/aria-required-attr',
    'accessibility/aria-required-children',
    'accessibility/aria-required-parent',
    'accessibility/aria-roles',
    'accessibility/aria-toggle-field-name',
    'accessibility/aria-tooltip-name',
    'accessibility/aria-treeitem-name',
    'accessibility/aria-valid-attr-value',
    'accessibility/aria-valid-attr',
    'accessibility/button-name',
    'accessibility/bypass',
    'accessibility/color-contrast',
    'accessibility/definition-list',
    'accessibility/dlitem',
    'accessibility/document-title',
    'accessibility/duplicate-id-active',
    'accessibility/duplicate-id-aria',
    'accessibility/form-field-multiple-labels',
    'accessibility/frame-title',
    'accessibility/heading-order',
    'accessibility/html-has-lang',
    'accessibility/html-lang-valid',
    'accessibility/image-alt',
    'accessibility/input-image-alt',
    'accessibility/label',
    'accessibility/landmark-one-main',
    'accessibility/link-name',
    'accessibility/list',
    'accessibility/listitem',
    'accessibility/meta-refresh',
    'accessibility/meta-viewport',
    'accessibility/object-alt',
    'accessibility/tabindex',
    'accessibility/td-headers-attr',
    'accessibility/th-has-data-cells',
    'accessibility/valid-lang',
    'accessibility/video-caption'
  ]
};