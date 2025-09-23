/**
 * aclue Application Configuration
 * 
 * Centralised configuration management for the entire aclue application.
 * Provides environment-specific settings, API endpoints, feature flags,
 * and business logic constants.
 * 
 * Configuration Categories:
 *   - Environment: API URLs, deployment settings, analytics keys
 *   - API Endpoints: Complete REST API endpoint definitions
 *   - Application: UI settings, validation rules, error messages
 *   - Amazon Associates: Affiliate program configuration and utilities
 *   - Theme: Design system constants and styling
 * 
 * Environment Variables:
 *   - All sensitive data loaded from environment variables
 *   - Fallback defaults for development
 *   - Production vs development feature toggles
 * 
 * Usage:
 *   import { config, endpoints, appConfig } from '@/config';
 *   const apiUrl = config.apiUrl;
 *   const loginEndpoint = endpoints.auth.login;
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { EnvironmentConfig } from '@/types';

// ==============================================================================
// ENVIRONMENT CONFIGURATION
// ==============================================================================
// Runtime environment settings loaded from environment variables

/**
 * Core environment configuration for API communication and external services.
 * 
 * Automatically adapts between development and production environments
 * based on NODE_ENV and environment variable availability.
 */
export const config = stryMutAct_9fa48("8300") ? {} : (stryCov_9fa48("8300"), {
  // Core service URLs
  apiUrl: stryMutAct_9fa48("8303") ? process.env.NEXT_PUBLIC_API_URL && 'https://aclue-backend-production.up.railway.app' : stryMutAct_9fa48("8302") ? false : stryMutAct_9fa48("8301") ? true : (stryCov_9fa48("8301", "8302", "8303"), process.env.NEXT_PUBLIC_API_URL || (stryMutAct_9fa48("8304") ? "" : (stryCov_9fa48("8304"), 'https://aclue-backend-production.up.railway.app'))),
  // Backend API base URL
  webUrl: stryMutAct_9fa48("8307") ? process.env.NEXT_PUBLIC_WEB_URL && 'http://localhost:3000' : stryMutAct_9fa48("8306") ? false : stryMutAct_9fa48("8305") ? true : (stryCov_9fa48("8305", "8306", "8307"), process.env.NEXT_PUBLIC_WEB_URL || (stryMutAct_9fa48("8308") ? "" : (stryCov_9fa48("8308"), 'http://localhost:3000'))),
  // Frontend application URL

  // Analytics and monitoring service keys
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  // Mixpanel analytics (optional)
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Sentry error tracking (optional)
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  // Google Analytics ID (optional)
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  // PostHog analytics key
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  // PostHog service host

  // Environment detection
  isProduction: stryMutAct_9fa48("8311") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("8310") ? false : stryMutAct_9fa48("8309") ? true : (stryCov_9fa48("8309", "8310", "8311"), process.env.NODE_ENV === (stryMutAct_9fa48("8312") ? "" : (stryCov_9fa48("8312"), 'production'))),
  // Production environment flag
  isDevelopment: stryMutAct_9fa48("8315") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("8314") ? false : stryMutAct_9fa48("8313") ? true : (stryCov_9fa48("8313", "8314", "8315"), process.env.NODE_ENV === (stryMutAct_9fa48("8316") ? "" : (stryCov_9fa48("8316"), 'development'))),
  // Development environment flag
  version: stryMutAct_9fa48("8319") ? process.env.npm_package_version && '1.0.0' : stryMutAct_9fa48("8318") ? false : stryMutAct_9fa48("8317") ? true : (stryCov_9fa48("8317", "8318", "8319"), process.env.npm_package_version || (stryMutAct_9fa48("8320") ? "" : (stryCov_9fa48("8320"), '1.0.0'))),
  // Application version

  // Amazon Associates affiliate program configuration
  amazonAssociateTag: stryMutAct_9fa48("8323") ? process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG && 'aclue-21' : stryMutAct_9fa48("8322") ? false : stryMutAct_9fa48("8321") ? true : (stryCov_9fa48("8321", "8322", "8323"), process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG || (stryMutAct_9fa48("8324") ? "" : (stryCov_9fa48("8324"), 'aclue-21'))),
  // Approved associate tag
  amazonRegion: stryMutAct_9fa48("8327") ? process.env.NEXT_PUBLIC_AMAZON_REGION && 'uk' : stryMutAct_9fa48("8326") ? false : stryMutAct_9fa48("8325") ? true : (stryCov_9fa48("8325", "8326", "8327"), process.env.NEXT_PUBLIC_AMAZON_REGION || (stryMutAct_9fa48("8328") ? "" : (stryCov_9fa48("8328"), 'uk'))),
  // Target market region
  amazonApiKey: process.env.NEXT_PUBLIC_AMAZON_API_KEY,
  // Product Advertising API key
  amazonSecretKey: process.env.NEXT_PUBLIC_AMAZON_SECRET_KEY // API secret key
});

// ==============================================================================
// API ENDPOINTS
// ==============================================================================
// Complete REST API endpoint definitions for all backend services

/**
 * Comprehensive API endpoint configuration.
 * 
 * Organises all backend API endpoints by functional area for easy
 * maintenance and consistent usage across the application.
 * 
 * Pattern:
 *   - Static endpoints: Direct string paths
 *   - Dynamic endpoints: Functions that accept parameters
 *   - Consistent naming: Resource-based organisation
 */
export const endpoints = stryMutAct_9fa48("8329") ? {} : (stryCov_9fa48("8329"), {
  // ===========================================================================
  // AUTHENTICATION ENDPOINTS
  // ===========================================================================
  // User authentication and session management
  auth: stryMutAct_9fa48("8330") ? {} : (stryCov_9fa48("8330"), {
    login: stryMutAct_9fa48("8331") ? "" : (stryCov_9fa48("8331"), '/api/v1/auth/login'),
    // POST: Authenticate user with email/password
    register: stryMutAct_9fa48("8332") ? "" : (stryCov_9fa48("8332"), '/api/v1/auth/register'),
    // POST: Create new user account
    refresh: stryMutAct_9fa48("8333") ? "" : (stryCov_9fa48("8333"), '/api/v1/auth/refresh'),
    // POST: Refresh expired access token
    logout: stryMutAct_9fa48("8334") ? "" : (stryCov_9fa48("8334"), '/api/v1/auth/logout'),
    // POST: End user session
    me: stryMutAct_9fa48("8335") ? "" : (stryCov_9fa48("8335"), '/api/v1/auth/me'),
    // GET: Get current user profile
    forgotPassword: stryMutAct_9fa48("8336") ? "" : (stryCov_9fa48("8336"), '/api/v1/auth/forgot-password'),
    // POST: Request password reset
    resetPassword: stryMutAct_9fa48("8337") ? "" : (stryCov_9fa48("8337"), '/api/v1/auth/reset-password'),
    // POST: Reset password with token
    verifyEmail: stryMutAct_9fa48("8338") ? "" : (stryCov_9fa48("8338"), '/api/v1/auth/verify-email') // POST: Verify email address
  }),
  // ===========================================================================
  // USER MANAGEMENT ENDPOINTS
  // ===========================================================================
  // User profile and preference management
  users: stryMutAct_9fa48("8339") ? {} : (stryCov_9fa48("8339"), {
    profile: stryMutAct_9fa48("8340") ? "" : (stryCov_9fa48("8340"), '/api/v1/users/me'),
    // GET: Get user profile
    updateProfile: stryMutAct_9fa48("8341") ? "" : (stryCov_9fa48("8341"), '/api/v1/users/me'),
    // PUT: Update user profile
    preferences: stryMutAct_9fa48("8342") ? "" : (stryCov_9fa48("8342"), '/api/v1/users/me/preferences'),
    // GET/PUT: User preferences
    statistics: stryMutAct_9fa48("8343") ? "" : (stryCov_9fa48("8343"), '/api/v1/users/me/statistics'),
    // GET: User activity statistics
    deleteAccount: stryMutAct_9fa48("8344") ? "" : (stryCov_9fa48("8344"), '/api/v1/users/me') // DELETE: Permanently delete account
  }),
  // ===========================================================================
  // PRODUCT CATALOG ENDPOINTS
  // ===========================================================================
  // Product search, filtering, and retrieval
  products: stryMutAct_9fa48("8345") ? {} : (stryCov_9fa48("8345"), {
    list: stryMutAct_9fa48("8346") ? "" : (stryCov_9fa48("8346"), '/api/v1/products'),
    // GET: List products with filters
    search: stryMutAct_9fa48("8347") ? "" : (stryCov_9fa48("8347"), '/api/v1/products/search'),
    // POST: Search products by query
    categories: stryMutAct_9fa48("8348") ? "" : (stryCov_9fa48("8348"), '/api/v1/products/categories'),
    // GET: Get product categories
    featured: stryMutAct_9fa48("8349") ? "" : (stryCov_9fa48("8349"), '/api/v1/products/featured'),
    // GET: Get featured products
    trending: stryMutAct_9fa48("8350") ? "" : (stryCov_9fa48("8350"), '/api/v1/products/trending'),
    // GET: Get trending products
    byCategory: stryMutAct_9fa48("8351") ? () => undefined : (stryCov_9fa48("8351"), (categoryId: string) => stryMutAct_9fa48("8352") ? `` : (stryCov_9fa48("8352"), `/api/v1/products/category/${categoryId}`)),
    // GET: Products by category
    byId: stryMutAct_9fa48("8353") ? () => undefined : (stryCov_9fa48("8353"), (id: string) => stryMutAct_9fa48("8354") ? `` : (stryCov_9fa48("8354"), `/api/v1/products/${id}`)),
    // GET: Single product details
    recommendations: stryMutAct_9fa48("8355") ? "" : (stryCov_9fa48("8355"), '/api/v1/products/recommendations') // GET: Product recommendations
  }),
  // ===========================================================================
  // SWIPE INTERACTION ENDPOINTS
  // ===========================================================================
  // User preference collection through swipe gestures
  swipes: stryMutAct_9fa48("8356") ? {} : (stryCov_9fa48("8356"), {
    sessions: stryMutAct_9fa48("8357") ? "" : (stryCov_9fa48("8357"), '/api/v1/swipes/sessions'),
    // GET: List user's swipe sessions
    createSession: stryMutAct_9fa48("8358") ? "" : (stryCov_9fa48("8358"), '/api/v1/swipes/sessions'),
    // POST: Start new swipe session
    currentSession: stryMutAct_9fa48("8359") ? "" : (stryCov_9fa48("8359"), '/api/v1/swipes/sessions/current'),
    // GET: Get active session
    interactions: stryMutAct_9fa48("8360") ? () => undefined : (stryCov_9fa48("8360"), (sessionId: string) => stryMutAct_9fa48("8361") ? `` : (stryCov_9fa48("8361"), `/api/v1/swipes/sessions/${sessionId}/interactions`)),
    // POST: Record swipe interaction
    analytics: stryMutAct_9fa48("8362") ? "" : (stryCov_9fa48("8362"), '/api/v1/swipes/analytics') // GET: Swipe analytics data
  }),
  // ===========================================================================
  // AI RECOMMENDATION ENDPOINTS
  // ===========================================================================
  // Machine learning powered product recommendations
  recommendations: stryMutAct_9fa48("8363") ? {} : (stryCov_9fa48("8363"), {
    generate: stryMutAct_9fa48("8364") ? "" : (stryCov_9fa48("8364"), '/api/v1/recommendations/generate'),
    // POST: Generate new recommendations
    list: stryMutAct_9fa48("8365") ? "" : (stryCov_9fa48("8365"), '/api/v1/recommendations'),
    // GET: Get user's recommendations
    byId: stryMutAct_9fa48("8366") ? () => undefined : (stryCov_9fa48("8366"), (id: string) => stryMutAct_9fa48("8367") ? `` : (stryCov_9fa48("8367"), `/api/v1/recommendations/${id}`)),
    // GET: Single recommendation details
    feedback: stryMutAct_9fa48("8368") ? () => undefined : (stryCov_9fa48("8368"), (id: string) => stryMutAct_9fa48("8369") ? `` : (stryCov_9fa48("8369"), `/api/v1/recommendations/${id}/feedback`)),
    // POST: Provide recommendation feedback
    refresh: stryMutAct_9fa48("8370") ? "" : (stryCov_9fa48("8370"), '/api/v1/recommendations/refresh') // POST: Refresh recommendation list
  }),
  // ===========================================================================
  // GIFT LINK SHARING ENDPOINTS
  // ===========================================================================
  // Social sharing and gift link management
  giftLinks: stryMutAct_9fa48("8371") ? {} : (stryCov_9fa48("8371"), {
    create: stryMutAct_9fa48("8372") ? "" : (stryCov_9fa48("8372"), '/api/v1/gift-links'),
    // POST: Create shareable gift link
    list: stryMutAct_9fa48("8373") ? "" : (stryCov_9fa48("8373"), '/api/v1/gift-links'),
    // GET: List user's gift links
    byId: stryMutAct_9fa48("8374") ? () => undefined : (stryCov_9fa48("8374"), (id: string) => stryMutAct_9fa48("8375") ? `` : (stryCov_9fa48("8375"), `/api/v1/gift-links/${id}`)),
    // GET: Gift link details
    byToken: stryMutAct_9fa48("8376") ? () => undefined : (stryCov_9fa48("8376"), (token: string) => stryMutAct_9fa48("8377") ? `` : (stryCov_9fa48("8377"), `/api/v1/gift-links/share/${token}`)),
    // GET: Public gift link access
    delete: stryMutAct_9fa48("8378") ? () => undefined : (stryCov_9fa48("8378"), (id: string) => stryMutAct_9fa48("8379") ? `` : (stryCov_9fa48("8379"), `/api/v1/gift-links/${id}`)),
    // DELETE: Remove gift link
    analytics: stryMutAct_9fa48("8380") ? () => undefined : (stryCov_9fa48("8380"), (id: string) => stryMutAct_9fa48("8381") ? `` : (stryCov_9fa48("8381"), `/api/v1/gift-links/${id}/analytics`)) // GET: Gift link analytics
  }),
  // ===========================================================================
  // ANALYTICS AND TRACKING ENDPOINTS
  // ===========================================================================
  // User behavior tracking and business analytics
  analytics: stryMutAct_9fa48("8382") ? {} : (stryCov_9fa48("8382"), {
    track: stryMutAct_9fa48("8383") ? "" : (stryCov_9fa48("8383"), '/api/v1/analytics/track'),
    // POST: Track user events
    events: stryMutAct_9fa48("8384") ? "" : (stryCov_9fa48("8384"), '/api/v1/analytics/events'),
    // GET: Query analytics events
    dashboard: stryMutAct_9fa48("8385") ? "" : (stryCov_9fa48("8385"), '/api/v1/analytics/dashboard') // GET: Analytics dashboard data
  }),
  // ===========================================================================
  // SYSTEM HEALTH ENDPOINTS
  // ===========================================================================
  // Service monitoring and health checks
  health: stryMutAct_9fa48("8386") ? "" : (stryCov_9fa48("8386"), '/health') // GET: System health status
});

// ==============================================================================
// APPLICATION CONFIGURATION
// ==============================================================================
// Business logic, UI settings, and application constants

/**
 * Comprehensive application configuration containing all business rules,
 * UI settings, validation patterns, and feature flags.
 * 
 * Used throughout the application for consistent behavior and easy
 * maintenance of business logic.
 */
export const appConfig = stryMutAct_9fa48("8387") ? {} : (stryCov_9fa48("8387"), {
  // ===========================================================================
  // BRAND AND MESSAGING
  // ===========================================================================
  name: stryMutAct_9fa48("8388") ? "" : (stryCov_9fa48("8388"), 'aclue'),
  // Application name
  description: stryMutAct_9fa48("8389") ? "" : (stryCov_9fa48("8389"), 'A data-led insight layer that transforms how gifts are chosen'),
  // SEO description
  tagline: stryMutAct_9fa48("8390") ? "" : (stryCov_9fa48("8390"), 'A data-led insight layer that transforms how gifts are chosen'),
  // Marketing tagline

  // Swipe settings
  swipe: stryMutAct_9fa48("8391") ? {} : (stryCov_9fa48("8391"), {
    maxSwipesPerSession: 50,
    sessionTimeout: stryMutAct_9fa48("8392") ? 30 * 60 / 1000 : (stryCov_9fa48("8392"), (stryMutAct_9fa48("8393") ? 30 / 60 : (stryCov_9fa48("8393"), 30 * 60)) * 1000),
    // 30 minutes
    cardPreloadCount: 5,
    animationDuration: 300,
    velocityThreshold: 0.5,
    distanceThreshold: 100
  }),
  // Pagination
  pagination: stryMutAct_9fa48("8394") ? {} : (stryCov_9fa48("8394"), {
    defaultPageSize: 20,
    maxPageSize: 100
  }),
  // Image settings
  images: stryMutAct_9fa48("8395") ? {} : (stryCov_9fa48("8395"), {
    defaultProductImage: stryMutAct_9fa48("8396") ? "" : (stryCov_9fa48("8396"), '/images/placeholder-product.png'),
    defaultUserAvatar: stryMutAct_9fa48("8397") ? "" : (stryCov_9fa48("8397"), '/images/default-avatar.png'),
    defaultCategoryIcon: stryMutAct_9fa48("8398") ? "" : (stryCov_9fa48("8398"), '/images/category-default.svg'),
    cloudinaryBaseUrl: stryMutAct_9fa48("8399") ? "" : (stryCov_9fa48("8399"), 'https://res.cloudinary.com/aclue')
  }),
  // Animation settings
  animations: stryMutAct_9fa48("8400") ? {} : (stryCov_9fa48("8400"), {
    defaultDuration: 300,
    defaultEasing: stryMutAct_9fa48("8401") ? "" : (stryCov_9fa48("8401"), 'cubic-bezier(0.4, 0, 0.2, 1)'),
    pageTransition: 200
  }),
  // Toast notifications
  toast: stryMutAct_9fa48("8402") ? {} : (stryCov_9fa48("8402"), {
    defaultDuration: 5000,
    position: 'top-right' as const
  }),
  // Local storage keys
  storage: stryMutAct_9fa48("8403") ? {} : (stryCov_9fa48("8403"), {
    authToken: stryMutAct_9fa48("8404") ? "" : (stryCov_9fa48("8404"), 'aclue_auth_token'),
    refreshToken: stryMutAct_9fa48("8405") ? "" : (stryCov_9fa48("8405"), 'aclue_refresh_token'),
    user: stryMutAct_9fa48("8406") ? "" : (stryCov_9fa48("8406"), 'aclue_user'),
    preferences: stryMutAct_9fa48("8407") ? "" : (stryCov_9fa48("8407"), 'aclue_preferences'),
    recentSearches: stryMutAct_9fa48("8408") ? "" : (stryCov_9fa48("8408"), 'aclue_recent_searches'),
    viewedProducts: stryMutAct_9fa48("8409") ? "" : (stryCov_9fa48("8409"), 'aclue_viewed_products'),
    onboardingCompleted: stryMutAct_9fa48("8410") ? "" : (stryCov_9fa48("8410"), 'aclue_onboarding_completed'),
    theme: stryMutAct_9fa48("8411") ? "" : (stryCov_9fa48("8411"), 'aclue_theme')
  }),
  // Feature flags
  features: stryMutAct_9fa48("8412") ? {} : (stryCov_9fa48("8412"), {
    socialLogin: stryMutAct_9fa48("8413") ? false : (stryCov_9fa48("8413"), true),
    pushNotifications: stryMutAct_9fa48("8414") ? false : (stryCov_9fa48("8414"), true),
    darkMode: stryMutAct_9fa48("8415") ? false : (stryCov_9fa48("8415"), true),
    analytics: stryMutAct_9fa48("8416") ? false : (stryCov_9fa48("8416"), true),
    affiliateLinks: stryMutAct_9fa48("8417") ? false : (stryCov_9fa48("8417"), true),
    affiliateTracking: stryMutAct_9fa48("8418") ? false : (stryCov_9fa48("8418"), true),
    beta: stryMutAct_9fa48("8419") ? {} : (stryCov_9fa48("8419"), {
      voiceSearch: stryMutAct_9fa48("8420") ? true : (stryCov_9fa48("8420"), false),
      arFeatures: stryMutAct_9fa48("8421") ? true : (stryCov_9fa48("8421"), false),
      chatbot: stryMutAct_9fa48("8422") ? true : (stryCov_9fa48("8422"), false),
      amazonApiIntegration: stryMutAct_9fa48("8423") ? true : (stryCov_9fa48("8423"), false)
    })
  }),
  // External URLs
  urls: stryMutAct_9fa48("8424") ? {} : (stryCov_9fa48("8424"), {
    privacyPolicy: stryMutAct_9fa48("8425") ? "" : (stryCov_9fa48("8425"), '/privacy'),
    termsOfService: stryMutAct_9fa48("8426") ? "" : (stryCov_9fa48("8426"), '/terms'),
    contactUs: stryMutAct_9fa48("8427") ? "" : (stryCov_9fa48("8427"), '/contact'),
    help: stryMutAct_9fa48("8428") ? "" : (stryCov_9fa48("8428"), '/help'),
    blog: stryMutAct_9fa48("8429") ? "" : (stryCov_9fa48("8429"), '/blog'),
    careers: stryMutAct_9fa48("8430") ? "" : (stryCov_9fa48("8430"), '/careers'),
    pressKit: stryMutAct_9fa48("8431") ? "" : (stryCov_9fa48("8431"), '/press'),
    apiDocs: stryMutAct_9fa48("8432") ? `` : (stryCov_9fa48("8432"), `${config.apiUrl}/docs`),
    affiliateDisclosure: stryMutAct_9fa48("8433") ? "" : (stryCov_9fa48("8433"), '/affiliate-disclosure'),
    cookiePolicy: stryMutAct_9fa48("8434") ? "" : (stryCov_9fa48("8434"), '/cookie-policy')
  }),
  // Social media
  social: stryMutAct_9fa48("8435") ? {} : (stryCov_9fa48("8435"), {
    twitter: stryMutAct_9fa48("8436") ? "" : (stryCov_9fa48("8436"), 'https://twitter.com/aclue'),
    facebook: stryMutAct_9fa48("8437") ? "" : (stryCov_9fa48("8437"), 'https://facebook.com/aclue'),
    instagram: stryMutAct_9fa48("8438") ? "" : (stryCov_9fa48("8438"), 'https://instagram.com/aclue'),
    linkedin: stryMutAct_9fa48("8439") ? "" : (stryCov_9fa48("8439"), 'https://linkedin.com/company/aclue'),
    youtube: stryMutAct_9fa48("8440") ? "" : (stryCov_9fa48("8440"), 'https://youtube.com/c/aclue')
  }),
  // Contact information
  contact: stryMutAct_9fa48("8441") ? {} : (stryCov_9fa48("8441"), {
    email: stryMutAct_9fa48("8442") ? "" : (stryCov_9fa48("8442"), 'hello@aclue.app'),
    support: stryMutAct_9fa48("8443") ? "" : (stryCov_9fa48("8443"), 'support@aclue.app'),
    press: stryMutAct_9fa48("8444") ? "" : (stryCov_9fa48("8444"), 'press@aclue.app'),
    partnerships: stryMutAct_9fa48("8445") ? "" : (stryCov_9fa48("8445"), 'partnerships@aclue.app')
  }),
  // App store links
  appStore: stryMutAct_9fa48("8446") ? {} : (stryCov_9fa48("8446"), {
    ios: stryMutAct_9fa48("8447") ? "" : (stryCov_9fa48("8447"), 'https://apps.apple.com/app/aclue'),
    android: stryMutAct_9fa48("8448") ? "" : (stryCov_9fa48("8448"), 'https://play.google.com/store/apps/details?id=com.aclue.app')
  }),
  // Subscription tiers
  subscriptionTiers: stryMutAct_9fa48("8449") ? {} : (stryCov_9fa48("8449"), {
    free: stryMutAct_9fa48("8450") ? {} : (stryCov_9fa48("8450"), {
      name: stryMutAct_9fa48("8451") ? "" : (stryCov_9fa48("8451"), 'Free'),
      price: 0,
      features: stryMutAct_9fa48("8452") ? [] : (stryCov_9fa48("8452"), [stryMutAct_9fa48("8453") ? "" : (stryCov_9fa48("8453"), 'Basic recommendations'), stryMutAct_9fa48("8454") ? "" : (stryCov_9fa48("8454"), 'Limited swipes per day'), stryMutAct_9fa48("8455") ? "" : (stryCov_9fa48("8455"), 'Email support'), stryMutAct_9fa48("8456") ? "" : (stryCov_9fa48("8456"), 'Basic analytics')])
    }),
    premium: stryMutAct_9fa48("8457") ? {} : (stryCov_9fa48("8457"), {
      name: stryMutAct_9fa48("8458") ? "" : (stryCov_9fa48("8458"), 'Premium'),
      price: 9.99,
      features: stryMutAct_9fa48("8459") ? [] : (stryCov_9fa48("8459"), [stryMutAct_9fa48("8460") ? "" : (stryCov_9fa48("8460"), 'Unlimited swipes'), stryMutAct_9fa48("8461") ? "" : (stryCov_9fa48("8461"), 'Advanced AI recommendations'), stryMutAct_9fa48("8462") ? "" : (stryCov_9fa48("8462"), 'Priority support'), stryMutAct_9fa48("8463") ? "" : (stryCov_9fa48("8463"), 'Advanced analytics'), stryMutAct_9fa48("8464") ? "" : (stryCov_9fa48("8464"), 'Gift link customization'), stryMutAct_9fa48("8465") ? "" : (stryCov_9fa48("8465"), 'Export features')])
    }),
    enterprise: stryMutAct_9fa48("8466") ? {} : (stryCov_9fa48("8466"), {
      name: stryMutAct_9fa48("8467") ? "" : (stryCov_9fa48("8467"), 'Enterprise'),
      price: 29.99,
      features: stryMutAct_9fa48("8468") ? [] : (stryCov_9fa48("8468"), [stryMutAct_9fa48("8469") ? "" : (stryCov_9fa48("8469"), 'All Premium features'), stryMutAct_9fa48("8470") ? "" : (stryCov_9fa48("8470"), 'Team collaboration'), stryMutAct_9fa48("8471") ? "" : (stryCov_9fa48("8471"), 'Bulk gift management'), stryMutAct_9fa48("8472") ? "" : (stryCov_9fa48("8472"), 'Custom branding'), stryMutAct_9fa48("8473") ? "" : (stryCov_9fa48("8473"), 'API access'), stryMutAct_9fa48("8474") ? "" : (stryCov_9fa48("8474"), 'Dedicated support')])
    })
  }),
  // Validation rules
  validation: stryMutAct_9fa48("8475") ? {} : (stryCov_9fa48("8475"), {
    password: stryMutAct_9fa48("8476") ? {} : (stryCov_9fa48("8476"), {
      minLength: 8,
      requireUppercase: stryMutAct_9fa48("8477") ? false : (stryCov_9fa48("8477"), true),
      requireLowercase: stryMutAct_9fa48("8478") ? false : (stryCov_9fa48("8478"), true),
      requireNumbers: stryMutAct_9fa48("8479") ? false : (stryCov_9fa48("8479"), true),
      requireSpecialChars: stryMutAct_9fa48("8480") ? false : (stryCov_9fa48("8480"), true)
    }),
    email: stryMutAct_9fa48("8481") ? {} : (stryCov_9fa48("8481"), {
      pattern: stryMutAct_9fa48("8489") ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[^A-Z]{2,}$/i : stryMutAct_9fa48("8488") ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]$/i : stryMutAct_9fa48("8487") ? /^[A-Z0-9._%+-]+@[^A-Z0-9.-]+\.[A-Z]{2,}$/i : stryMutAct_9fa48("8486") ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]\.[A-Z]{2,}$/i : stryMutAct_9fa48("8485") ? /^[^A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i : stryMutAct_9fa48("8484") ? /^[A-Z0-9._%+-]@[A-Z0-9.-]+\.[A-Z]{2,}$/i : stryMutAct_9fa48("8483") ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i : stryMutAct_9fa48("8482") ? /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i : (stryCov_9fa48("8482", "8483", "8484", "8485", "8486", "8487", "8488", "8489"), /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)
    }),
    name: stryMutAct_9fa48("8490") ? {} : (stryCov_9fa48("8490"), {
      minLength: 2,
      maxLength: 50,
      pattern: stryMutAct_9fa48("8495") ? /^[a-zA-Z\S'.-]+$/ : stryMutAct_9fa48("8494") ? /^[^a-zA-Z\s'.-]+$/ : stryMutAct_9fa48("8493") ? /^[a-zA-Z\s'.-]$/ : stryMutAct_9fa48("8492") ? /^[a-zA-Z\s'.-]+/ : stryMutAct_9fa48("8491") ? /[a-zA-Z\s'.-]+$/ : (stryCov_9fa48("8491", "8492", "8493", "8494", "8495"), /^[a-zA-Z\s'.-]+$/)
    })
  }),
  // Error messages
  errors: stryMutAct_9fa48("8496") ? {} : (stryCov_9fa48("8496"), {
    network: stryMutAct_9fa48("8497") ? "" : (stryCov_9fa48("8497"), 'Network error. Please check your connection and try again.'),
    server: stryMutAct_9fa48("8498") ? "" : (stryCov_9fa48("8498"), 'Server error. Please try again later.'),
    unauthorized: stryMutAct_9fa48("8499") ? "" : (stryCov_9fa48("8499"), 'Please log in to continue.'),
    forbidden: stryMutAct_9fa48("8500") ? "" : (stryCov_9fa48("8500"), 'You do not have permission to access this resource.'),
    notFound: stryMutAct_9fa48("8501") ? "" : (stryCov_9fa48("8501"), 'The requested resource was not found.'),
    validation: stryMutAct_9fa48("8502") ? "" : (stryCov_9fa48("8502"), 'Please check your input and try again.'),
    unknown: stryMutAct_9fa48("8503") ? "" : (stryCov_9fa48("8503"), 'An unexpected error occurred. Please try again.')
  }),
  // Success messages
  success: stryMutAct_9fa48("8504") ? {} : (stryCov_9fa48("8504"), {
    login: stryMutAct_9fa48("8505") ? "" : (stryCov_9fa48("8505"), 'Welcome back!'),
    register: stryMutAct_9fa48("8506") ? "" : (stryCov_9fa48("8506"), 'Account created successfully!'),
    logout: stryMutAct_9fa48("8507") ? "" : (stryCov_9fa48("8507"), 'Logged out successfully.'),
    profileUpdated: stryMutAct_9fa48("8508") ? "" : (stryCov_9fa48("8508"), 'Profile updated successfully.'),
    preferencesUpdated: stryMutAct_9fa48("8509") ? "" : (stryCov_9fa48("8509"), 'Preferences updated successfully.'),
    giftLinkCreated: stryMutAct_9fa48("8510") ? "" : (stryCov_9fa48("8510"), 'Gift link created successfully!'),
    giftLinkShared: stryMutAct_9fa48("8511") ? "" : (stryCov_9fa48("8511"), 'Gift link shared successfully!'),
    affiliateLinkGenerated: stryMutAct_9fa48("8512") ? "" : (stryCov_9fa48("8512"), 'Affiliate link generated successfully!')
  })
});

// Amazon Associates Configuration
export const amazonConfig = stryMutAct_9fa48("8513") ? {} : (stryCov_9fa48("8513"), {
  // UK Amazon Associates Configuration
  uk: stryMutAct_9fa48("8514") ? {} : (stryCov_9fa48("8514"), {
    associateTag: stryMutAct_9fa48("8515") ? "" : (stryCov_9fa48("8515"), 'aclue-21'),
    baseUrl: stryMutAct_9fa48("8516") ? "" : (stryCov_9fa48("8516"), 'https://amazon.co.uk'),
    apiHost: stryMutAct_9fa48("8517") ? "" : (stryCov_9fa48("8517"), 'webservices.amazon.co.uk'),
    marketplace: stryMutAct_9fa48("8518") ? "" : (stryCov_9fa48("8518"), 'A1F83G8C2ARO7P'),
    region: stryMutAct_9fa48("8519") ? "" : (stryCov_9fa48("8519"), 'eu-west-1'),
    currency: stryMutAct_9fa48("8520") ? "" : (stryCov_9fa48("8520"), 'GBP'),
    language: stryMutAct_9fa48("8521") ? "" : (stryCov_9fa48("8521"), 'en_GB')
  }),
  // Commission rates by category (approximate)
  commissionRates: stryMutAct_9fa48("8522") ? {} : (stryCov_9fa48("8522"), {
    electronics: 0.01,
    // 1%
    fashion: 0.04,
    // 4%
    homeAndGarden: 0.03,
    // 3%
    sportsAndOutdoors: 0.03,
    // 3%
    books: 0.045,
    // 4.5%
    toys: 0.03,
    // 3%
    beautyAndPersonalCare: 0.04,
    // 4%
    automotive: 0.045,
    // 4.5%
    industrial: 0.045,
    // 4.5%
    outdoorAndGarden: 0.03,
    // 3%
    default: 0.02 // 2%
  }),
  // Product categories for recommendations
  productCategories: stryMutAct_9fa48("8523") ? {} : (stryCov_9fa48("8523"), {
    'All': stryMutAct_9fa48("8524") ? "" : (stryCov_9fa48("8524"), 'All'),
    'Electronics': stryMutAct_9fa48("8525") ? "" : (stryCov_9fa48("8525"), 'Electronics'),
    'Fashion': stryMutAct_9fa48("8526") ? "" : (stryCov_9fa48("8526"), 'Fashion'),
    'Home & Garden': stryMutAct_9fa48("8527") ? "" : (stryCov_9fa48("8527"), 'Garden'),
    'Sports & Outdoors': stryMutAct_9fa48("8528") ? "" : (stryCov_9fa48("8528"), 'SportingGoods'),
    'Books': stryMutAct_9fa48("8529") ? "" : (stryCov_9fa48("8529"), 'Books'),
    'Toys & Games': stryMutAct_9fa48("8530") ? "" : (stryCov_9fa48("8530"), 'Toys'),
    'Beauty & Personal Care': stryMutAct_9fa48("8531") ? "" : (stryCov_9fa48("8531"), 'Beauty'),
    'Automotive': stryMutAct_9fa48("8532") ? "" : (stryCov_9fa48("8532"), 'Automotive'),
    'Health & Household': stryMutAct_9fa48("8533") ? "" : (stryCov_9fa48("8533"), 'HealthPersonalCare'),
    'Tools & Home Improvement': stryMutAct_9fa48("8534") ? "" : (stryCov_9fa48("8534"), 'Tools'),
    'Video Games': stryMutAct_9fa48("8535") ? "" : (stryCov_9fa48("8535"), 'VideoGames'),
    'Office Products': stryMutAct_9fa48("8536") ? "" : (stryCov_9fa48("8536"), 'OfficeProducts'),
    'Kitchen & Dining': stryMutAct_9fa48("8537") ? "" : (stryCov_9fa48("8537"), 'Kitchen'),
    'Baby': stryMutAct_9fa48("8538") ? "" : (stryCov_9fa48("8538"), 'Baby'),
    'Pet Supplies': stryMutAct_9fa48("8539") ? "" : (stryCov_9fa48("8539"), 'PetSupplies'),
    'Industrial & Scientific': stryMutAct_9fa48("8540") ? "" : (stryCov_9fa48("8540"), 'Industrial'),
    'Handmade': stryMutAct_9fa48("8541") ? "" : (stryCov_9fa48("8541"), 'Handmade'),
    'Arts, Crafts & Sewing': stryMutAct_9fa48("8542") ? "" : (stryCov_9fa48("8542"), 'ArtsAndCrafts'),
    'Musical Instruments': stryMutAct_9fa48("8543") ? "" : (stryCov_9fa48("8543"), 'MusicalInstruments')
  }),
  // API Configuration
  api: stryMutAct_9fa48("8544") ? {} : (stryCov_9fa48("8544"), {
    version: stryMutAct_9fa48("8545") ? "" : (stryCov_9fa48("8545"), '5.0'),
    requestsPerSecond: 1,
    timeoutMs: 5000,
    retryAttempts: 3,
    retryDelayMs: 1000
  }),
  // Tracking and Analytics
  tracking: stryMutAct_9fa48("8546") ? {} : (stryCov_9fa48("8546"), {
    enableConversionTracking: stryMutAct_9fa48("8547") ? false : (stryCov_9fa48("8547"), true),
    enableClickTracking: stryMutAct_9fa48("8548") ? false : (stryCov_9fa48("8548"), true),
    enableImpressionTracking: stryMutAct_9fa48("8549") ? false : (stryCov_9fa48("8549"), true),
    sessionTimeoutMinutes: 30,
    attributionWindowDays: 30
  })
});

// Affiliate Link Generation Utilities
export class AffiliateLinksService {
  /**
   * Generates an Amazon affiliate link with proper tracking
   */
  static generateAffiliateLink(productUrl: string, options: {
    associateTag?: string;
    ref?: string;
    campaign?: string;
    medium?: string;
    source?: string;
  } = {}): string {
    if (stryMutAct_9fa48("8550")) {
      {}
    } else {
      stryCov_9fa48("8550");
      try {
        if (stryMutAct_9fa48("8551")) {
          {}
        } else {
          stryCov_9fa48("8551");
          const url = new URL(productUrl);

          // Ensure we're using the correct Amazon domain
          if (stryMutAct_9fa48("8554") ? false : stryMutAct_9fa48("8553") ? true : stryMutAct_9fa48("8552") ? url.hostname.includes('amazon.co.uk') : (stryCov_9fa48("8552", "8553", "8554"), !url.hostname.includes(stryMutAct_9fa48("8555") ? "" : (stryCov_9fa48("8555"), 'amazon.co.uk')))) {
            if (stryMutAct_9fa48("8556")) {
              {}
            } else {
              stryCov_9fa48("8556");
              // Convert to UK domain if needed
              url.hostname = stryMutAct_9fa48("8557") ? "" : (stryCov_9fa48("8557"), 'amazon.co.uk');
            }
          }

          // Add associate tag
          url.searchParams.set(stryMutAct_9fa48("8558") ? "" : (stryCov_9fa48("8558"), 'tag'), stryMutAct_9fa48("8561") ? options.associateTag && amazonConfig.uk.associateTag : stryMutAct_9fa48("8560") ? false : stryMutAct_9fa48("8559") ? true : (stryCov_9fa48("8559", "8560", "8561"), options.associateTag || amazonConfig.uk.associateTag));

          // Add tracking parameters
          if (stryMutAct_9fa48("8563") ? false : stryMutAct_9fa48("8562") ? true : (stryCov_9fa48("8562", "8563"), options.ref)) {
            if (stryMutAct_9fa48("8564")) {
              {}
            } else {
              stryCov_9fa48("8564");
              url.searchParams.set(stryMutAct_9fa48("8565") ? "" : (stryCov_9fa48("8565"), 'ref_'), options.ref);
            }
          }
          if (stryMutAct_9fa48("8567") ? false : stryMutAct_9fa48("8566") ? true : (stryCov_9fa48("8566", "8567"), options.campaign)) {
            if (stryMutAct_9fa48("8568")) {
              {}
            } else {
              stryCov_9fa48("8568");
              url.searchParams.set(stryMutAct_9fa48("8569") ? "" : (stryCov_9fa48("8569"), 'campaign'), options.campaign);
            }
          }
          if (stryMutAct_9fa48("8571") ? false : stryMutAct_9fa48("8570") ? true : (stryCov_9fa48("8570", "8571"), options.medium)) {
            if (stryMutAct_9fa48("8572")) {
              {}
            } else {
              stryCov_9fa48("8572");
              url.searchParams.set(stryMutAct_9fa48("8573") ? "" : (stryCov_9fa48("8573"), 'medium'), options.medium);
            }
          }
          if (stryMutAct_9fa48("8575") ? false : stryMutAct_9fa48("8574") ? true : (stryCov_9fa48("8574", "8575"), options.source)) {
            if (stryMutAct_9fa48("8576")) {
              {}
            } else {
              stryCov_9fa48("8576");
              url.searchParams.set(stryMutAct_9fa48("8577") ? "" : (stryCov_9fa48("8577"), 'source'), options.source);
            }
          }

          // Add timestamp for tracking
          url.searchParams.set(stryMutAct_9fa48("8578") ? "" : (stryCov_9fa48("8578"), 'timestamp'), Date.now().toString());
          return url.toString();
        }
      } catch (error) {
        if (stryMutAct_9fa48("8579")) {
          {}
        } else {
          stryCov_9fa48("8579");
          console.error(stryMutAct_9fa48("8580") ? "" : (stryCov_9fa48("8580"), 'Error generating affiliate link:'), error);
          return productUrl; // Return original URL if generation fails
        }
      }
    }
  }

  /**
   * Generates an Amazon search link with affiliate tracking
   */
  static generateSearchLink(searchTerm: string, category?: string, options: {
    associateTag?: string;
    ref?: string;
  } = {}): string {
    if (stryMutAct_9fa48("8581")) {
      {}
    } else {
      stryCov_9fa48("8581");
      const baseUrl = stryMutAct_9fa48("8582") ? "" : (stryCov_9fa48("8582"), 'https://amazon.co.uk/s');
      const url = new URL(baseUrl);
      url.searchParams.set(stryMutAct_9fa48("8583") ? "" : (stryCov_9fa48("8583"), 'k'), searchTerm);
      url.searchParams.set(stryMutAct_9fa48("8584") ? "" : (stryCov_9fa48("8584"), 'tag'), stryMutAct_9fa48("8587") ? options.associateTag && amazonConfig.uk.associateTag : stryMutAct_9fa48("8586") ? false : stryMutAct_9fa48("8585") ? true : (stryCov_9fa48("8585", "8586", "8587"), options.associateTag || amazonConfig.uk.associateTag));
      if (stryMutAct_9fa48("8590") ? category || amazonConfig.productCategories[category as keyof typeof amazonConfig.productCategories] : stryMutAct_9fa48("8589") ? false : stryMutAct_9fa48("8588") ? true : (stryCov_9fa48("8588", "8589", "8590"), category && amazonConfig.productCategories[category as keyof typeof amazonConfig.productCategories])) {
        if (stryMutAct_9fa48("8591")) {
          {}
        } else {
          stryCov_9fa48("8591");
          url.searchParams.set(stryMutAct_9fa48("8592") ? "" : (stryCov_9fa48("8592"), 'i'), amazonConfig.productCategories[category as keyof typeof amazonConfig.productCategories]);
        }
      }
      if (stryMutAct_9fa48("8594") ? false : stryMutAct_9fa48("8593") ? true : (stryCov_9fa48("8593", "8594"), options.ref)) {
        if (stryMutAct_9fa48("8595")) {
          {}
        } else {
          stryCov_9fa48("8595");
          url.searchParams.set(stryMutAct_9fa48("8596") ? "" : (stryCov_9fa48("8596"), 'ref'), options.ref);
        }
      }
      return url.toString();
    }
  }

  /**
   * Extracts ASIN from Amazon product URL
   */
  static extractASIN(productUrl: string): string | null {
    if (stryMutAct_9fa48("8597")) {
      {}
    } else {
      stryCov_9fa48("8597");
      try {
        if (stryMutAct_9fa48("8598")) {
          {}
        } else {
          stryCov_9fa48("8598");
          // Common ASIN patterns in Amazon URLs
          const asinPatterns = stryMutAct_9fa48("8599") ? [] : (stryCov_9fa48("8599"), [stryMutAct_9fa48("8601") ? /\/dp\/([^A-Z0-9]{10})/ : stryMutAct_9fa48("8600") ? /\/dp\/([A-Z0-9])/ : (stryCov_9fa48("8600", "8601"), /\/dp\/([A-Z0-9]{10})/), stryMutAct_9fa48("8603") ? /\/gp\/product\/([^A-Z0-9]{10})/ : stryMutAct_9fa48("8602") ? /\/gp\/product\/([A-Z0-9])/ : (stryCov_9fa48("8602", "8603"), /\/gp\/product\/([A-Z0-9]{10})/), stryMutAct_9fa48("8605") ? /\/product\/([^A-Z0-9]{10})/ : stryMutAct_9fa48("8604") ? /\/product\/([A-Z0-9])/ : (stryCov_9fa48("8604", "8605"), /\/product\/([A-Z0-9]{10})/), stryMutAct_9fa48("8607") ? /\/ASIN\/([^A-Z0-9]{10})/ : stryMutAct_9fa48("8606") ? /\/ASIN\/([A-Z0-9])/ : (stryCov_9fa48("8606", "8607"), /\/ASIN\/([A-Z0-9]{10})/), stryMutAct_9fa48("8609") ? /asin=([^A-Z0-9]{10})/i : stryMutAct_9fa48("8608") ? /asin=([A-Z0-9])/i : (stryCov_9fa48("8608", "8609"), /asin=([A-Z0-9]{10})/i)]);
          for (const pattern of asinPatterns) {
            if (stryMutAct_9fa48("8610")) {
              {}
            } else {
              stryCov_9fa48("8610");
              const match = productUrl.match(pattern);
              if (stryMutAct_9fa48("8613") ? match || match[1] : stryMutAct_9fa48("8612") ? false : stryMutAct_9fa48("8611") ? true : (stryCov_9fa48("8611", "8612", "8613"), match && match[1])) {
                if (stryMutAct_9fa48("8614")) {
                  {}
                } else {
                  stryCov_9fa48("8614");
                  return match[1];
                }
              }
            }
          }
          return null;
        }
      } catch (error) {
        if (stryMutAct_9fa48("8615")) {
          {}
        } else {
          stryCov_9fa48("8615");
          console.error(stryMutAct_9fa48("8616") ? "" : (stryCov_9fa48("8616"), 'Error extracting ASIN:'), error);
          return null;
        }
      }
    }
  }

  /**
   * Validates if a URL is a valid Amazon product URL
   */
  static isValidAmazonUrl(url: string): boolean {
    if (stryMutAct_9fa48("8617")) {
      {}
    } else {
      stryCov_9fa48("8617");
      try {
        if (stryMutAct_9fa48("8618")) {
          {}
        } else {
          stryCov_9fa48("8618");
          const urlObj = new URL(url);
          const validDomains = stryMutAct_9fa48("8619") ? [] : (stryCov_9fa48("8619"), [stryMutAct_9fa48("8620") ? "" : (stryCov_9fa48("8620"), 'amazon.co.uk'), stryMutAct_9fa48("8621") ? "" : (stryCov_9fa48("8621"), 'amazon.com'), stryMutAct_9fa48("8622") ? "" : (stryCov_9fa48("8622"), 'amazon.de'), stryMutAct_9fa48("8623") ? "" : (stryCov_9fa48("8623"), 'amazon.fr'), stryMutAct_9fa48("8624") ? "" : (stryCov_9fa48("8624"), 'amazon.it'), stryMutAct_9fa48("8625") ? "" : (stryCov_9fa48("8625"), 'amazon.es'), stryMutAct_9fa48("8626") ? "" : (stryCov_9fa48("8626"), 'amazon.ca'), stryMutAct_9fa48("8627") ? "" : (stryCov_9fa48("8627"), 'amazon.com.au'), stryMutAct_9fa48("8628") ? "" : (stryCov_9fa48("8628"), 'amazon.co.jp')]);
          return stryMutAct_9fa48("8629") ? validDomains.every(domain => urlObj.hostname.includes(domain)) : (stryCov_9fa48("8629"), validDomains.some(stryMutAct_9fa48("8630") ? () => undefined : (stryCov_9fa48("8630"), domain => urlObj.hostname.includes(domain))));
        }
      } catch (error) {
        if (stryMutAct_9fa48("8631")) {
          {}
        } else {
          stryCov_9fa48("8631");
          return stryMutAct_9fa48("8632") ? true : (stryCov_9fa48("8632"), false);
        }
      }
    }
  }

  /**
   * Gets commission rate for a given product category
   */
  static getCommissionRate(category: string): number {
    if (stryMutAct_9fa48("8633")) {
      {}
    } else {
      stryCov_9fa48("8633");
      const normalizedCategory = stryMutAct_9fa48("8634") ? category.toUpperCase().replace(/\s+/g, '') : (stryCov_9fa48("8634"), category.toLowerCase().replace(stryMutAct_9fa48("8636") ? /\S+/g : stryMutAct_9fa48("8635") ? /\s/g : (stryCov_9fa48("8635", "8636"), /\s+/g), stryMutAct_9fa48("8637") ? "Stryker was here!" : (stryCov_9fa48("8637"), '')));

      // Map to commission rates
      const categoryMappings: Record<string, keyof typeof amazonConfig.commissionRates> = stryMutAct_9fa48("8638") ? {} : (stryCov_9fa48("8638"), {
        'electronics': stryMutAct_9fa48("8639") ? "" : (stryCov_9fa48("8639"), 'electronics'),
        'fashion': stryMutAct_9fa48("8640") ? "" : (stryCov_9fa48("8640"), 'fashion'),
        'clothing': stryMutAct_9fa48("8641") ? "" : (stryCov_9fa48("8641"), 'fashion'),
        'homeandgarden': stryMutAct_9fa48("8642") ? "" : (stryCov_9fa48("8642"), 'homeAndGarden'),
        'home': stryMutAct_9fa48("8643") ? "" : (stryCov_9fa48("8643"), 'homeAndGarden'),
        'garden': stryMutAct_9fa48("8644") ? "" : (stryCov_9fa48("8644"), 'homeAndGarden'),
        'sportsandoutdoors': stryMutAct_9fa48("8645") ? "" : (stryCov_9fa48("8645"), 'sportsAndOutdoors'),
        'sports': stryMutAct_9fa48("8646") ? "" : (stryCov_9fa48("8646"), 'sportsAndOutdoors'),
        'books': stryMutAct_9fa48("8647") ? "" : (stryCov_9fa48("8647"), 'books'),
        'toys': stryMutAct_9fa48("8648") ? "" : (stryCov_9fa48("8648"), 'toys'),
        'toysgames': stryMutAct_9fa48("8649") ? "" : (stryCov_9fa48("8649"), 'toys'),
        'games': stryMutAct_9fa48("8650") ? "" : (stryCov_9fa48("8650"), 'toys'),
        'beauty': stryMutAct_9fa48("8651") ? "" : (stryCov_9fa48("8651"), 'beautyAndPersonalCare'),
        'beautyandpersonalcare': stryMutAct_9fa48("8652") ? "" : (stryCov_9fa48("8652"), 'beautyAndPersonalCare'),
        'personalcare': stryMutAct_9fa48("8653") ? "" : (stryCov_9fa48("8653"), 'beautyAndPersonalCare'),
        'automotive': stryMutAct_9fa48("8654") ? "" : (stryCov_9fa48("8654"), 'automotive'),
        'industrial': stryMutAct_9fa48("8655") ? "" : (stryCov_9fa48("8655"), 'industrial'),
        'outdoor': stryMutAct_9fa48("8656") ? "" : (stryCov_9fa48("8656"), 'outdoorAndGarden')
      });
      const mappedCategory = categoryMappings[normalizedCategory];
      return stryMutAct_9fa48("8659") ? mappedCategory && amazonConfig.commissionRates[mappedCategory as keyof typeof amazonConfig.commissionRates] && amazonConfig.commissionRates.default : stryMutAct_9fa48("8658") ? false : stryMutAct_9fa48("8657") ? true : (stryCov_9fa48("8657", "8658", "8659"), (stryMutAct_9fa48("8661") ? mappedCategory || amazonConfig.commissionRates[mappedCategory as keyof typeof amazonConfig.commissionRates] : stryMutAct_9fa48("8660") ? false : (stryCov_9fa48("8660", "8661"), mappedCategory && amazonConfig.commissionRates[mappedCategory as keyof typeof amazonConfig.commissionRates])) || amazonConfig.commissionRates.default);
    }
  }
}

// Theme configuration
export const theme = stryMutAct_9fa48("8662") ? {} : (stryCov_9fa48("8662"), {
  colors: stryMutAct_9fa48("8663") ? {} : (stryCov_9fa48("8663"), {
    primary: stryMutAct_9fa48("8664") ? "" : (stryCov_9fa48("8664"), '#f03dff'),
    secondary: stryMutAct_9fa48("8665") ? "" : (stryCov_9fa48("8665"), '#0ea5e9'),
    success: stryMutAct_9fa48("8666") ? "" : (stryCov_9fa48("8666"), '#22c55e'),
    warning: stryMutAct_9fa48("8667") ? "" : (stryCov_9fa48("8667"), '#f59e0b'),
    error: stryMutAct_9fa48("8668") ? "" : (stryCov_9fa48("8668"), '#ef4444'),
    neutral: stryMutAct_9fa48("8669") ? "" : (stryCov_9fa48("8669"), '#737373')
  }),
  breakpoints: stryMutAct_9fa48("8670") ? {} : (stryCov_9fa48("8670"), {
    xs: stryMutAct_9fa48("8671") ? "" : (stryCov_9fa48("8671"), '475px'),
    sm: stryMutAct_9fa48("8672") ? "" : (stryCov_9fa48("8672"), '640px'),
    md: stryMutAct_9fa48("8673") ? "" : (stryCov_9fa48("8673"), '768px'),
    lg: stryMutAct_9fa48("8674") ? "" : (stryCov_9fa48("8674"), '1024px'),
    xl: stryMutAct_9fa48("8675") ? "" : (stryCov_9fa48("8675"), '1280px'),
    '2xl': stryMutAct_9fa48("8676") ? "" : (stryCov_9fa48("8676"), '1536px'),
    '3xl': stryMutAct_9fa48("8677") ? "" : (stryCov_9fa48("8677"), '1600px')
  }),
  spacing: stryMutAct_9fa48("8678") ? {} : (stryCov_9fa48("8678"), {
    xs: stryMutAct_9fa48("8679") ? "" : (stryCov_9fa48("8679"), '4px'),
    sm: stryMutAct_9fa48("8680") ? "" : (stryCov_9fa48("8680"), '8px'),
    md: stryMutAct_9fa48("8681") ? "" : (stryCov_9fa48("8681"), '16px'),
    lg: stryMutAct_9fa48("8682") ? "" : (stryCov_9fa48("8682"), '24px'),
    xl: stryMutAct_9fa48("8683") ? "" : (stryCov_9fa48("8683"), '32px'),
    '2xl': stryMutAct_9fa48("8684") ? "" : (stryCov_9fa48("8684"), '48px'),
    '3xl': stryMutAct_9fa48("8685") ? "" : (stryCov_9fa48("8685"), '64px')
  }),
  borderRadius: stryMutAct_9fa48("8686") ? {} : (stryCov_9fa48("8686"), {
    sm: stryMutAct_9fa48("8687") ? "" : (stryCov_9fa48("8687"), '4px'),
    md: stryMutAct_9fa48("8688") ? "" : (stryCov_9fa48("8688"), '8px'),
    lg: stryMutAct_9fa48("8689") ? "" : (stryCov_9fa48("8689"), '12px'),
    xl: stryMutAct_9fa48("8690") ? "" : (stryCov_9fa48("8690"), '16px'),
    '2xl': stryMutAct_9fa48("8691") ? "" : (stryCov_9fa48("8691"), '24px'),
    full: stryMutAct_9fa48("8692") ? "" : (stryCov_9fa48("8692"), '9999px')
  }),
  shadows: stryMutAct_9fa48("8693") ? {} : (stryCov_9fa48("8693"), {
    sm: stryMutAct_9fa48("8694") ? "" : (stryCov_9fa48("8694"), '0 1px 2px 0 rgba(0, 0, 0, 0.05)'),
    md: stryMutAct_9fa48("8695") ? "" : (stryCov_9fa48("8695"), '0 4px 6px -1px rgba(0, 0, 0, 0.1)'),
    lg: stryMutAct_9fa48("8696") ? "" : (stryCov_9fa48("8696"), '0 10px 15px -3px rgba(0, 0, 0, 0.1)'),
    xl: stryMutAct_9fa48("8697") ? "" : (stryCov_9fa48("8697"), '0 20px 25px -5px rgba(0, 0, 0, 0.1)')
  })
});
export default config;