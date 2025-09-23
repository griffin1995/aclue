// Unlighthouse Configuration - Complete site-wide performance and SEO scanning
// Crawls entire Next.js application with parallel Lighthouse auditing

export default {
  // Site configuration
  site: 'https://aclue.app',

  // Scanner configuration
  scanner: {
    // Number of concurrent workers
    device: 'desktop',
    throttle: false,

    // Crawler settings
    crawler: {
      // Maximum routes to scan
      maxRoutes: 1000,

      // Include/exclude patterns
      include: [
        '/*',
        '/landingpage',
        '/discover',
        '/api/*',
        '/auth/*',
        '/products/*',
        '/recommendations/*',
        '/profile/*',
        '/settings/*',
        '/wishlist/*',
        '/about',
        '/contact',
        '/privacy',
        '/terms'
      ],

      exclude: [
        '/admin/*',
        '/_next/*',
        '/static/*',
        '*.js',
        '*.css',
        '*.png',
        '*.jpg',
        '*.jpeg',
        '*.gif',
        '*.svg',
        '*.ico',
        '*.woff',
        '*.woff2',
        '*.ttf',
        '*.eot'
      ],

      // Dynamic route discovery
      dynamicRoutes: [
        '/products/[id]',
        '/recommendations/[category]',
        '/wishlist/[id]'
      ],

      // Sitemap
      sitemap: '/sitemap.xml',

      // Robots.txt
      robotsTxt: true,

      // User agent
      userAgent: 'Unlighthouse/1.0 (Aclue Automated Testing)',

      // Request headers
      headers: {
        'Accept-Language': 'en-GB,en;q=0.9'
      },

      // Viewport
      viewport: {
        width: 1920,
        height: 1080
      },

      // Wait for network idle
      waitForIdle: true,

      // Maximum crawl depth
      maxDepth: 10,

      // Follow redirects
      followRedirects: true,

      // Ignore SSL errors
      ignoreHTTPSErrors: false
    }
  },

  // Lighthouse configuration
  lighthouse: {
    // Categories to audit
    categories: {
      performance: true,
      accessibility: true,
      'best-practices': true,
      seo: true,
      pwa: true
    },

    // Lighthouse flags
    flags: {
      // Output format
      output: ['html', 'json'],

      // Chrome flags
      chromeFlags: [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-zygote'
      ],

      // Throttling
      throttlingMethod: 'simulate',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
      },

      // Emulated form factor
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        disabled: false
      },

      // Quiet mode
      quiet: false,

      // Maximum wait time
      maxWaitForFcp: 30000,
      maxWaitForLoad: 45000,

      // Gather mode
      gatherMode: false,

      // Audit mode
      auditMode: false,

      // Only categories
      onlyCategories: null,

      // Only audits
      onlyAudits: null,

      // Skip audits
      skipAudits: null,

      // Budget path
      budgetPath: '/home/jack/Documents/aclue-preprod/tests-22-sept/automated/performance/budget.json',

      // Extra headers
      extraHeaders: {
        'Accept-Language': 'en-GB,en;q=0.9'
      }
    },

    // Custom audits
    customAudits: [
      {
        id: 'nextjs-image-optimization',
        title: 'Next.js Image Optimization',
        description: 'Checks if Next.js Image component is used for optimal image loading'
      },
      {
        id: 'api-response-time',
        title: 'API Response Time',
        description: 'Measures FastAPI backend response times'
      },
      {
        id: 'supabase-query-performance',
        title: 'Supabase Query Performance',
        description: 'Analyzes database query performance'
      }
    ]
  },

  // CI configuration
  ci: {
    // Build token
    buildToken: process.env.UNLIGHTHOUSE_BUILD_TOKEN,

    // Assert configuration
    assert: {
      // Minimum scores
      performance: 90,
      accessibility: 95,
      'best-practices': 90,
      seo: 90,
      pwa: 80,

      // Budget assertions
      budget: {
        'first-contentful-paint': 1800,
        'largest-contentful-paint': 2500,
        'first-meaningful-paint': 1800,
        'speed-index': 3400,
        'total-blocking-time': 150,
        'max-potential-fid': 130,
        'cumulative-layout-shift': 0.1,
        'server-response-time': 600,
        'interactive': 3800,
        'mainthread-work-breakdown': 2000,
        'bootup-time': 3000,
        'uses-rel-preconnect': 300,
        'font-display': 0,
        'diagnostics': 0,
        'network-requests': 70,
        'network-rtt': 0,
        'network-server-latency': 0,
        'main-thread-tasks': 2000,
        'metrics': 0,
        'resource-summary': 0
      }
    },

    // Upload configuration
    upload: {
      target: 'temporary-public-storage',
      apiEndpoint: process.env.UNLIGHTHOUSE_API_ENDPOINT,
      apiKey: process.env.UNLIGHTHOUSE_API_KEY
    }
  },

  // Output configuration
  output: {
    // Output directory
    dir: '/home/jack/Documents/aclue-preprod/tests-22-sept/automated/reports/unlighthouse',

    // Report formats
    formats: ['html', 'json', 'csv'],

    // Open report after completion
    open: false,

    // Report filename
    filename: 'unlighthouse-report',

    // Include raw Lighthouse results
    includeRaw: true,

    // Group by pattern
    groupBy: 'pathname'
  },

  // Hooks
  hooks: {
    // Before site scan
    'site:beforeScan': async (site) => {
      console.log('Starting Unlighthouse scan for:', site)
    },

    // After site scan
    'site:afterScan': async (site, reports) => {
      console.log('Completed scan. Total pages:', reports.length)
    },

    // Before page scan
    'page:beforeScan': async (page) => {
      // Custom page setup (e.g., authentication)
      if (page.url.includes('/auth')) {
        await page.evaluate(() => {
          localStorage.setItem('token', 'test-jwt-token')
        })
      }
    },

    // After page scan
    'page:afterScan': async (page, report) => {
      console.log(`Scanned: ${page.url} - Score: ${report.score}`)
    }
  },

  // Debug mode
  debug: false,

  // Sampling (scan percentage of pages)
  sampling: 1.0,

  // Cache
  cache: true,

  // Puppeteer options
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  },

  // Discovery configuration
  discovery: {
    // Discover routes from
    from: [
      'sitemap',
      'crawl',
      'routes-manifest'
    ],

    // Route patterns
    patterns: [
      '/**',
      '/api/**'
    ]
  },

  // Server configuration for local testing
  server: {
    host: 'localhost',
    port: 3000,
    https: false
  }
}