export default {
  // Site configuration
  site: 'http://localhost:3000',

  // Scanner configuration
  scanner: {
    // Scan all pages
    crawl: true,
    dynamicSampling: true,
    samples: 3,
    throttle: false,

    // Device settings
    device: 'desktop',

    // Parallel processing
    maxWorkers: 4,

    // Include patterns
    include: [
      '/',
      '/landingpage',
      '/discover',
      '/api/**'
    ],

    // Exclude patterns
    exclude: [
      '/api/auth/**',
      '/_next/**'
    ]
  },

  // Debug mode
  debug: false,

  // Output configuration
  outputPath: '/home/jack/Documents/aclue-preprod/tests-22-sept/automated/performance/unlighthouse',

  // Lighthouse configuration
  lighthouse: {
    options: {
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      throttling: {
        rttMs: 40,
        throughputKbps: 10 * 1024,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      },
      screenEmulation: {
        mobile: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        disabled: false
      }
    }
  },

  // Performance budgets
  budgets: {
    performance: 85,
    accessibility: 95,
    'best-practices': 90,
    seo: 90,
    pwa: 80
  },

  // Report configuration
  reporter: {
    columns: {
      performance: true,
      accessibility: true,
      'best-practices': true,
      seo: true,
      'largest-contentful-paint': true,
      'first-contentful-paint': true,
      'cumulative-layout-shift': true,
      'total-blocking-time': true,
      'speed-index': true
    }
  }
}