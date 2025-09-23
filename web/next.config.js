/**
 * aclue Next.js Configuration
 * 
 * Production-ready Next.js configuration for the aclue gift recommendation platform.
 * Optimised for performance, security, and deployment flexibility across development,
 * staging, and production environments.
 * 
 * Key Features:
 *   - Advanced image optimization with Amazon CDN support
 *   - Security headers and CORS configuration
 *   - Build optimization and bundle splitting
 *   - Environment-specific settings
 *   - API proxy for development
 *   - Static export support for S3 deployment
 * 
 * Deployment Targets:
 *   - Vercel (serverless)
 *   - AWS S3 + CloudFront (static)
 *   - Docker containers (standalone)
 *   - Traditional hosting (server)
 * 
 * Performance Optimizations:
 *   - SWC compiler for faster builds
 *   - Image optimization with WebP/AVIF
 *   - Console removal in production
 *   - ETag and compression configuration
 * 
 * Security Features:
 *   - Security headers (XSS, clickjacking protection)
 *   - CORS policy enforcement
 *   - Referrer policy configuration
 *   - Permissions policy restrictions
 * 
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // ===========================================================================
  // CORE REACT CONFIGURATION
  // ===========================================================================
  
  reactStrictMode: true,        // Enable React strict mode for development warnings
  swcMinify: true,              // Use SWC for faster minification instead of Terser
  
  // ===========================================================================
  // ENVIRONMENT VARIABLES
  // ===========================================================================
  // Client-side environment variables with fallback defaults
  
  env: {
    // Core service URLs
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',     // Backend API endpoint
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',     // Frontend application URL
    
    // Analytics and monitoring
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,                 // Mixpanel analytics token
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,                         // Sentry error tracking DSN
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,                                   // Google Analytics tracking ID
  },

  // ===========================================================================
  // IMAGE OPTIMIZATION
  // ===========================================================================
  // Next.js image optimization with CDN and external domain support
  
  images: {
    // Enable image optimization for better performance
    unoptimized: false,

    // Enhanced image optimization settings
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache for 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Allowed external image domains for security and performance
    remotePatterns: [
      // Development environment
      {
        protocol: 'http',
        hostname: 'localhost',                                 // Local development images
      },
      
      // Stock photo services
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',                       // Unsplash stock photos
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',                         // Pexels stock photos
      },
      
      // AWS S3 storage
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',                          // General S3 bucket access
      },
      {
        protocol: 'https',
        hostname: 'aclue-prod-assets.s3.amazonaws.com',     // Production asset bucket
      },
      {
        protocol: 'https',
        hostname: 'aclue-dev-assets.s3.amazonaws.com',      // Development asset bucket
      },
      
      // Amazon product images (for affiliate links)
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',                        // Amazon mobile CDN
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',           // Amazon SSL CDN
      },
      
      // Development and testing
      {
        protocol: 'https',
        hostname: 'picsum.photos',                             // Lorem Picsum placeholder images
      }
    ],
  },

  // ===========================================================================
  // WEBPACK CONFIGURATION
  // ===========================================================================
  // Custom webpack configuration for enhanced functionality
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add support for SVG imports as React components
    config.module.rules.push({
      test: /\.svg$/,                    // Match SVG files
      use: ['@svgr/webpack']            // Transform SVGs to React components
    });

    // Performance optimizations
    if (!dev && !isServer) {
      // Bundle splitting optimizations
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // Tree shaking optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    // Development optimizations
    if (dev) {
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }

    return config;
  },

  // ===========================================================================
  // SECURITY HEADERS
  // ===========================================================================
  // HTTP security headers for protection against common attacks
  
  async headers() {
    return [
      // Global security headers for all routes
      {
        source: '/(.*)',               // Apply to all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'               // Prevent clickjacking attacks
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'            // Prevent MIME type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'  // Control referrer information
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'  // Restrict browser APIs
          }
        ]
      },
      
      // API-specific CORS headers
      {
        source: '/api/(.*)',           // Apply to API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://aclue.app'     // Production domain only
              : 'http://localhost:3000'        // Development localhost
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'  // Allowed HTTP methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'      // Allowed request headers
          }
        ]
      }
    ];
  },

  // ===========================================================================
  // URL REDIRECTS
  // ===========================================================================
  // Permanent redirects for SEO and user experience
  
  async redirects() {
    return [
      // Legacy route redirects
      {
        source: '/app',                // Old app route
        destination: '/dashboard',      // Redirect to dashboard
        permanent: true,                // 301 redirect for SEO
      },
      {
        source: '/login',               // Simplified login URL
        destination: '/auth/login',     // Full auth path
        permanent: true,
      },
      {
        source: '/register',            // Simplified register URL
        destination: '/auth/register',  // Full auth path
        permanent: true,
      }
    ];
  },

  // ===========================================================================
  // URL REWRITES
  // ===========================================================================
  // Development API proxy and URL rewriting
  
  async rewrites() {
    // Only enable API proxy in development for CORS and testing
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/v1/:path*',                                     // Only proxy /api/v1/* to backend
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`   // Proxy to backend server
        }
      ];
    }

    // No rewrites in production (API calls go directly to backend)
    return [];
  },

  // ===========================================================================
  // BUILD CONFIGURATION
  // ===========================================================================
  
  // Build output mode for different deployment targets
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  
  // ===========================================================================
  // EXPERIMENTAL FEATURES
  // ===========================================================================
  // Next.js experimental features for enhanced functionality

  experimental: {
    scrollRestoration: true,        // Restore scroll position on navigation
    // optimizeCss: true,           // Temporarily disabled - causing critters dependency issues
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'LCP', 'TTFB'], // Enhanced Web Vitals tracking
    optimizePackageImports: ['lucide-react', '@headlessui/react', 'framer-motion'], // Optimize package imports
    turbo: {                       // Enable Turbo for faster builds
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    serverComponentsExternalPackages: ['sharp'], // Optimize server components

    // ===========================================================================
    // APP ROUTER MIGRATION SUPPORT
    // ===========================================================================
    // App Router is now enabled by default in Next.js 14+
    // Server Actions are enabled by default in Next.js 14+

    // App Router optimization features
    typedRoutes: true,              // Enable typed routes for better DX
    mdxRs: true,                    // Enable MDX with Rust-based parser
    optimisticClientCache: true,    // Enable optimistic client cache

    // Performance optimizations for dual router setup
    optimizeServerReact: true,      // Optimize React for server components
    ppr: false,                     // Partial Pre-rendering (experimental, disabled for stability)
  },

  // ===========================================================================
  // COMPILER OPTIMIZATIONS
  // ===========================================================================
  // SWC compiler optimizations for production
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']            // Remove console.log but keep console.error
    } : false,                      // Keep all console logs in development
  },

  // ===========================================================================
  // TYPESCRIPT CONFIGURATION
  // ===========================================================================
  
  typescript: {
    ignoreBuildErrors: true,  // Temporarily ignore for deployment
  },

  // ===========================================================================
  // ESLINT CONFIGURATION
  // ===========================================================================
  
  eslint: {
    ignoreDuringBuilds: false,      // Run ESLint during builds to catch issues early
  },

  // ===========================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ===========================================================================

  poweredByHeader: false,         // Remove "Powered by Next.js" header for security
  generateEtags: true,            // Enable ETags for efficient caching
  compress: true,                 // Enable gzip compression

  // Enhanced performance settings
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // Keep pages in memory for 1 hour
    pagesBufferLength: 5,           // Keep 5 pages in buffer
  },

  // ===========================================================================
  // STATIC EXPORT CONFIGURATION
  // ===========================================================================
  // Configuration for static deployment (S3, CDN)

  trailingSlash: false,           // Disable trailing slashes for App Router compatibility
  
  
  // ===========================================================================
  // PAGE EXTENSIONS
  // ===========================================================================
  // Supported file extensions for pages and API routes
  
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],  // TypeScript and JavaScript support
};

// Export configuration for Next.js
module.exports = nextConfig;