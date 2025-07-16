/**
 * Cloudflare Pages Configuration for prznt
 * 
 * This configuration optimizes Next.js for Cloudflare Pages deployment
 * with SSR support using @cloudflare/next-on-pages adapter.
 */

/** @type {import('@cloudflare/next-on-pages').Config} */
module.exports = {
  // Skip building certain pages that don't work well with edge runtime
  skipBuild: [
    // Skip service worker and manifest
    '/sw.js',
    '/manifest.json',
  ],
  
  // Configuration for static assets
  staticAssets: {
    // Include all assets from public directory
    include: [
      '/logo.png',
      '/favicon.ico',
      '/images/**/*',
      '/uploads/**/*',
      '/manifest.json',
      '/sw.js',
    ],
  },
  
  // Environment variables to expose
  environment: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE,
  },
  
  // Compatibility settings
  compatibility: {
    // Enable modern JavaScript features
    date: '2023-10-01',
    flags: ['nodejs_compat'],
  },
};