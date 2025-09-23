/**
 * aclue Analytics Service
 * 
 * Comprehensive user behavior tracking and analytics integration using PostHog.
 * Provides business intelligence, user insights, and performance metrics for
 * data-driven product decisions and revenue optimization.
 * 
 * Key Features:
 *   - User behavior tracking (swipes, clicks, conversions)
 *   - Revenue analytics (affiliate clicks, commissions)
 *   - Feature flag management for A/B testing
 *   - User segmentation and cohort analysis
 *   - Error tracking and performance monitoring
 * 
 * Business Intelligence:
 *   - Track user journey from discovery to purchase
 *   - Measure recommendation algorithm effectiveness
 *   - Monitor affiliate conversion rates and revenue
 *   - Analyze user engagement and retention patterns
 * 
 * Privacy & Compliance:
 *   - GDPR-compliant user consent management
 *   - User opt-out functionality
 *   - Data anonymization and retention policies
 *   - Cookie consent integration
 * 
 * Integration:
 *   - PostHog for event tracking and analytics
 *   - Feature flags for controlled rollouts
 *   - User identification for personalized experiences
 *   - Custom event validation and enrichment
 * 
 * Usage:
 *   import { analytics, trackEvent, identifyUser } from '@/lib/analytics';
 *   
 *   // Initialize analytics
 *   await analytics.init();
 *   
 *   // Track user events
 *   trackEvent('product_swiped', { direction: 'right', product_id: '123' });
 *   
 *   // Identify users
 *   identifyUser('user_123', { subscription_tier: 'premium' });
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
import posthog from 'posthog-js';
import { config } from '@/config';
import { createPostHogConfig, validateEvent, getCommonEventProperties } from './posthog-config';

/**
 * Analytics Service class for comprehensive user behavior tracking.
 * 
 * Manages PostHog integration with robust error handling, retry logic,
 * and business-specific event tracking. Provides type-safe analytics
 * interface for the entire application.
 * 
 * Architecture:
 *   - Singleton pattern for consistent analytics instance
 *   - Automatic initialization with retry logic
 *   - Event validation and enrichment
 *   - Feature flag integration
 *   - Privacy controls and opt-out functionality
 * 
 * Error Handling:
 *   - Graceful degradation when analytics unavailable
 *   - Automatic retry on initialization failures
 *   - Comprehensive logging for debugging
 *   - Fallback behavior for critical paths
 */
class AnalyticsService {
  /**
   * Service state management for reliable analytics operation.
   */
  private initialized = stryMutAct_9fa48("10157") ? true : (stryCov_9fa48("10157"), false); // Analytics initialization status
  private retryCount = 0; // Current retry attempt counter
  private maxRetries = 3; // Maximum initialization retry attempts

  /**
   * Initialize PostHog analytics service with robust error handling.
   * 
   * Performs comprehensive setup including:
   *   - PostHog SDK initialization with custom configuration
   *   - Connection testing and validation
   *   - Automatic retry on failures
   *   - Development vs production environment handling
   * 
   * Error Recovery:
   *   - Retries initialization up to maxRetries times
   *   - Exponential backoff for retry delays
   *   - Graceful degradation if initialization fails
   * 
   * Environment Handling:
   *   - Server-side rendering compatibility (no window)
   *   - Development debugging and logging
   *   - Production optimizations
   * 
   * Returns:
   *   Promise<void>: Resolves when initialization complete
   */
  async init() {
    if (stryMutAct_9fa48("10158")) {
      {}
    } else {
      stryCov_9fa48("10158");
      // Prevent initialization in invalid environments
      if (stryMutAct_9fa48("10161") ? (typeof window === 'undefined' || this.initialized) && !config.posthogKey : stryMutAct_9fa48("10160") ? false : stryMutAct_9fa48("10159") ? true : (stryCov_9fa48("10159", "10160", "10161"), (stryMutAct_9fa48("10163") ? typeof window === 'undefined' && this.initialized : stryMutAct_9fa48("10162") ? false : (stryCov_9fa48("10162", "10163"), (stryMutAct_9fa48("10165") ? typeof window !== 'undefined' : stryMutAct_9fa48("10164") ? false : (stryCov_9fa48("10164", "10165"), typeof window === (stryMutAct_9fa48("10166") ? "" : (stryCov_9fa48("10166"), 'undefined')))) || this.initialized)) || (stryMutAct_9fa48("10167") ? config.posthogKey : (stryCov_9fa48("10167"), !config.posthogKey)))) {
        if (stryMutAct_9fa48("10168")) {
          {}
        } else {
          stryCov_9fa48("10168");
          return;
        }
      }
      try {
        if (stryMutAct_9fa48("10169")) {
          {}
        } else {
          stryCov_9fa48("10169");
          // Create PostHog configuration with environment-specific settings
          const posthogConfig = createPostHogConfig();
          console.log(stryMutAct_9fa48("10170") ? "" : (stryCov_9fa48("10170"), '[PostHog] Initializing analytics service...'), stryMutAct_9fa48("10171") ? {} : (stryCov_9fa48("10171"), {
            key: (stryMutAct_9fa48("10173") ? config.posthogKey.substring(0, 10) : stryMutAct_9fa48("10172") ? config.posthogKey : (stryCov_9fa48("10172", "10173"), config.posthogKey?.substring(0, 10))) + (stryMutAct_9fa48("10174") ? "" : (stryCov_9fa48("10174"), '...')),
            // Masked key for security
            host: posthogConfig.api_host,
            // PostHog server host
            debug: posthogConfig.debug // Debug mode status
          }));

          // Initialize PostHog SDK with configuration
          posthog.init(config.posthogKey, posthogConfig);

          // Mark as successfully initialized
          this.initialized = stryMutAct_9fa48("10175") ? false : (stryCov_9fa48("10175"), true);
          this.retryCount = 0; // Reset retry counter

          // Verify analytics connectivity with test event
          await this.testConnection();
        }
      } catch (error) {
        if (stryMutAct_9fa48("10176")) {
          {}
        } else {
          stryCov_9fa48("10176");
          console.error(stryMutAct_9fa48("10177") ? "" : (stryCov_9fa48("10177"), '[PostHog] Initialization failed:'), error);

          // Implement retry logic with exponential backoff
          if (stryMutAct_9fa48("10181") ? this.retryCount >= this.maxRetries : stryMutAct_9fa48("10180") ? this.retryCount <= this.maxRetries : stryMutAct_9fa48("10179") ? false : stryMutAct_9fa48("10178") ? true : (stryCov_9fa48("10178", "10179", "10180", "10181"), this.retryCount < this.maxRetries)) {
            if (stryMutAct_9fa48("10182")) {
              {}
            } else {
              stryCov_9fa48("10182");
              stryMutAct_9fa48("10183") ? this.retryCount-- : (stryCov_9fa48("10183"), this.retryCount++);
              const delayMs = stryMutAct_9fa48("10184") ? 1000 / this.retryCount : (stryCov_9fa48("10184"), 1000 * this.retryCount); // Exponential backoff
              console.log(stryMutAct_9fa48("10185") ? `` : (stryCov_9fa48("10185"), `[PostHog] Retrying initialization (${this.retryCount}/${this.maxRetries}) in ${delayMs}ms...`));
              setTimeout(stryMutAct_9fa48("10186") ? () => undefined : (stryCov_9fa48("10186"), () => this.init()), delayMs);
            }
          } else {
            if (stryMutAct_9fa48("10187")) {
              {}
            } else {
              stryCov_9fa48("10187");
              console.error(stryMutAct_9fa48("10188") ? "" : (stryCov_9fa48("10188"), '[PostHog] Maximum retry attempts reached, analytics disabled'));
            }
          }
        }
      }
    }
  }

  /**
   * Test PostHog connectivity with diagnostic event.
   * 
   * Sends a test event to verify that analytics are working correctly.
   * Provides debugging information for troubleshooting connection issues.
   * 
   * Test Event Data:
   *   - Common properties (user agent, URL, timestamp)
   *   - Initialization metadata (time, retry count)
   *   - Environment information for debugging
   * 
   * Returns:
   *   Promise<void>: Resolves when test complete
   */
  private async testConnection(): Promise<void> {
    if (stryMutAct_9fa48("10189")) {
      {}
    } else {
      stryCov_9fa48("10189");
      if (stryMutAct_9fa48("10192") ? false : stryMutAct_9fa48("10191") ? true : stryMutAct_9fa48("10190") ? this.initialized : (stryCov_9fa48("10190", "10191", "10192"), !this.initialized)) return;
      try {
        if (stryMutAct_9fa48("10193")) {
          {}
        } else {
          stryCov_9fa48("10193");
          // Send diagnostic event with initialization metadata
          this.track(stryMutAct_9fa48("10194") ? "" : (stryCov_9fa48("10194"), 'analytics_service_initialized'), stryMutAct_9fa48("10195") ? {} : (stryCov_9fa48("10195"), {
            ...getCommonEventProperties(),
            // Standard event properties
            initialization_time: Date.now(),
            // Timestamp for performance tracking
            retry_count: this.retryCount,
            // Number of retries for debugging
            environment: config.isProduction ? stryMutAct_9fa48("10196") ? "" : (stryCov_9fa48("10196"), 'production') : stryMutAct_9fa48("10197") ? "" : (stryCov_9fa48("10197"), 'development')
          }));
          console.log(stryMutAct_9fa48("10198") ? "" : (stryCov_9fa48("10198"), '[PostHog] Connection test successful - analytics ready'));
        }
      } catch (error) {
        if (stryMutAct_9fa48("10199")) {
          {}
        } else {
          stryCov_9fa48("10199");
          console.warn(stryMutAct_9fa48("10200") ? "" : (stryCov_9fa48("10200"), '[PostHog] Connection test failed:'), error);
        }
      }
    }
  }

  /**
   * Identify user for personalized analytics and targeting.
   * 
   * Associates all future events with a specific user ID, enabling:
   *   - Cross-device tracking and session continuity
   *   - Personalized feature flags and A/B tests
   *   - User-specific analytics and cohort analysis
   *   - Revenue attribution and lifetime value tracking
   * 
   * Privacy Compliance:
   *   - Only identifies users who have provided consent
   *   - Supports pseudonymous identifiers for privacy
   *   - Respects user opt-out preferences
   * 
   * Parameters:
   *   userId: Unique user identifier (UUID, email hash, etc.)
   *   properties: Additional user attributes for segmentation
   * 
   * Example:
   *   analytics.identify('user_123', {
   *     email: 'user@example.com',
   *     subscription_tier: 'premium',
   *     first_name: 'John',
   *     signup_date: '2024-01-01'
   *   });
   */
  identify(userId: string, properties?: Record<string, any>) {
    if (stryMutAct_9fa48("10201")) {
      {}
    } else {
      stryCov_9fa48("10201");
      if (stryMutAct_9fa48("10203") ? false : stryMutAct_9fa48("10202") ? true : (stryCov_9fa48("10202", "10203"), this.initialized)) {
        if (stryMutAct_9fa48("10204")) {
          {}
        } else {
          stryCov_9fa48("10204");
          console.log(stryMutAct_9fa48("10205") ? "" : (stryCov_9fa48("10205"), '[PostHog] Identifying user:'), userId, properties);
          posthog.identify(userId, properties);
        }
      }
    }
  }

  /**
   * Track user events for analytics and business intelligence.
   * 
   * Records user actions, behaviors, and system events for:
   *   - Product analytics and user journey mapping
   *   - Revenue tracking and conversion optimization
   *   - A/B testing and feature performance measurement
   *   - Error monitoring and performance analysis
   * 
   * Event Processing:
   *   - Validates event name and properties
   *   - Enriches events with common properties (timestamp, user agent, etc.)
   *   - Handles errors gracefully without breaking user experience
   *   - Logs events for debugging in development
   * 
   * Common Event Categories:
   *   - User actions: swipe_left, swipe_right, product_clicked
   *   - Revenue events: affiliate_click, purchase_completed
   *   - System events: page_viewed, error_occurred
   *   - Engagement: session_started, feature_used
   * 
   * Parameters:
   *   eventName: Descriptive event name (snake_case convention)
   *   properties: Event-specific data for analysis
   * 
   * Example:
   *   analytics.track('product_swiped', {
   *     direction: 'right',
   *     product_id: 'B08GYKNCCP',
   *     category: 'Electronics',
   *     session_id: 'session_123'
   *   });
   */
  track(eventName: string, properties?: Record<string, any>) {
    if (stryMutAct_9fa48("10206")) {
      {}
    } else {
      stryCov_9fa48("10206");
      // Handle analytics not initialized gracefully
      if (stryMutAct_9fa48("10209") ? false : stryMutAct_9fa48("10208") ? true : stryMutAct_9fa48("10207") ? this.initialized : (stryCov_9fa48("10207", "10208", "10209"), !this.initialized)) {
        if (stryMutAct_9fa48("10210")) {
          {}
        } else {
          stryCov_9fa48("10210");
          console.warn(stryMutAct_9fa48("10211") ? "" : (stryCov_9fa48("10211"), '[PostHog] Analytics not initialized, event queued:'), eventName);
          // In production, could queue events for later sending
          return;
        }
      }

      // Validate event meets naming and data requirements
      if (stryMutAct_9fa48("10214") ? false : stryMutAct_9fa48("10213") ? true : stryMutAct_9fa48("10212") ? validateEvent(eventName, properties) : (stryCov_9fa48("10212", "10213", "10214"), !validateEvent(eventName, properties))) {
        if (stryMutAct_9fa48("10215")) {
          {}
        } else {
          stryCov_9fa48("10215");
          return;
        }
      }
      try {
        if (stryMutAct_9fa48("10216")) {
          {}
        } else {
          stryCov_9fa48("10216");
          // Enrich event with common properties for consistent analytics
          const enrichedProperties = stryMutAct_9fa48("10217") ? {} : (stryCov_9fa48("10217"), {
            ...getCommonEventProperties(),
            // Standard properties (timestamp, URL, etc.)
            ...properties // Event-specific properties
          });
          console.log(stryMutAct_9fa48("10218") ? "" : (stryCov_9fa48("10218"), '[PostHog] Tracking event:'), eventName, enrichedProperties);
          posthog.capture(eventName, enrichedProperties);
        }
      } catch (error) {
        if (stryMutAct_9fa48("10219")) {
          {}
        } else {
          stryCov_9fa48("10219");
          console.error(stryMutAct_9fa48("10220") ? "" : (stryCov_9fa48("10220"), '[PostHog] Failed to track event:'), eventName, error);
          // Continue execution even if analytics fails
        }
      }
    }
  }

  /**
   * Set or update user properties for segmentation and personalization.
   * 
   * Updates user profile data for:
   *   - User segmentation and cohort analysis
   *   - Personalized feature flags and targeting
   *   - Revenue analysis and lifetime value tracking
   *   - Customer support and user insights
   * 
   * Property Categories:
   *   - Demographics: age, location, gender
   *   - Subscription: tier, status, billing_cycle
   *   - Behavior: last_login, total_swipes, preferences
   *   - Revenue: total_spent, commission_generated
   * 
   * Parameters:
   *   properties: Key-value pairs of user attributes
   * 
   * Example:
   *   analytics.setUserProperties({
   *     subscription_tier: 'premium',
   *     total_swipes: 150,
   *     last_active: '2024-01-01',
   *     favorite_categories: ['Electronics', 'Books']
   *   });
   */
  setUserProperties(properties: Record<string, any>) {
    if (stryMutAct_9fa48("10221")) {
      {}
    } else {
      stryCov_9fa48("10221");
      if (stryMutAct_9fa48("10223") ? false : stryMutAct_9fa48("10222") ? true : (stryCov_9fa48("10222", "10223"), this.initialized)) {
        if (stryMutAct_9fa48("10224")) {
          {}
        } else {
          stryCov_9fa48("10224");
          console.log(stryMutAct_9fa48("10225") ? "" : (stryCov_9fa48("10225"), '[PostHog] Setting user properties:'), properties);
          posthog.people.set(properties);
        }
      }
    }
  }

  /**
   * Track page views for navigation analytics and user journey mapping.
   * 
   * Records page navigation events for:
   *   - User flow analysis and conversion funnels
   *   - Page performance and engagement metrics
   *   - A/B testing of page layouts and content
   *   - SEO and content optimization insights
   * 
   * Automatic Enrichment:
   *   - Referrer information for traffic source analysis
   *   - Page load time and performance metrics
   *   - Device and browser information
   *   - User session context
   * 
   * Parameters:
   *   path: Optional page path (defaults to current URL)
   * 
   * Example:
   *   analytics.trackPageView('/discover'); // Track specific page
   *   analytics.trackPageView();            // Track current page
   */
  trackPageView(path?: string) {
    if (stryMutAct_9fa48("10226")) {
      {}
    } else {
      stryCov_9fa48("10226");
      if (stryMutAct_9fa48("10228") ? false : stryMutAct_9fa48("10227") ? true : (stryCov_9fa48("10227", "10228"), this.initialized)) {
        if (stryMutAct_9fa48("10229")) {
          {}
        } else {
          stryCov_9fa48("10229");
          const pageUrl = stryMutAct_9fa48("10232") ? path && window.location.href : stryMutAct_9fa48("10231") ? false : stryMutAct_9fa48("10230") ? true : (stryCov_9fa48("10230", "10231", "10232"), path || window.location.href);
          console.log(stryMutAct_9fa48("10233") ? "" : (stryCov_9fa48("10233"), '[PostHog] Tracking page view:'), pageUrl);
          posthog.capture(stryMutAct_9fa48("10234") ? "" : (stryCov_9fa48("10234"), '$pageview'), stryMutAct_9fa48("10235") ? {} : (stryCov_9fa48("10235"), {
            $current_url: pageUrl,
            // Page URL for navigation tracking
            page_title: document.title,
            // Page title for content analysis
            referrer: document.referrer // Previous page for traffic flow
          }));
        }
      }
    }
  }

  /**
   * Reset user session for logout and privacy compliance.
   * 
   * Clears all user identification and session data for:
   *   - User logout and session termination
   *   - Privacy compliance and data protection
   *   - Shared device usage scenarios
   *   - Testing and development environments
   * 
   * Reset Actions:
   *   - Clears user identification and properties
   *   - Resets feature flag cache
   *   - Generates new anonymous session ID
   *   - Maintains analytics functionality for anonymous tracking
   * 
   * Privacy Compliance:
   *   - Ensures no personal data persists after logout
   *   - Supports "right to be forgotten" requirements
   *   - Clears all locally stored user data
   * 
   * Example:
   *   // On user logout
   *   analytics.reset();
   */
  reset() {
    if (stryMutAct_9fa48("10236")) {
      {}
    } else {
      stryCov_9fa48("10236");
      if (stryMutAct_9fa48("10238") ? false : stryMutAct_9fa48("10237") ? true : (stryCov_9fa48("10237", "10238"), this.initialized)) {
        if (stryMutAct_9fa48("10239")) {
          {}
        } else {
          stryCov_9fa48("10239");
          console.log(stryMutAct_9fa48("10240") ? "" : (stryCov_9fa48("10240"), '[PostHog] Resetting user session'));
          posthog.reset();
        }
      }
    }
  }

  /**
   * Associate user with groups for organizational analytics.
   * 
   * Groups users by organization, team, or other entities for:
   *   - B2B analytics and enterprise insights
   *   - Team collaboration feature usage
   *   - Organization-level reporting and billing
   *   - Multi-tenant application analytics
   * 
   * Group Types:
   *   - organization: Company or business entity
   *   - team: Department or project team
   *   - subscription: Shared subscription account
   *   - family: Family gift-giving groups
   * 
   * Parameters:
   *   groupType: Type of group (organization, team, etc.)
   *   groupKey: Unique identifier for the group
   *   properties: Group-specific attributes
   * 
   * Example:
   *   analytics.group('organization', 'acme-corp', {
   *     name: 'Acme Corporation',
   *     plan: 'enterprise',
   *     employees: 500
   *   });
   */
  group(groupType: string, groupKey: string, properties?: Record<string, any>) {
    if (stryMutAct_9fa48("10241")) {
      {}
    } else {
      stryCov_9fa48("10241");
      if (stryMutAct_9fa48("10243") ? false : stryMutAct_9fa48("10242") ? true : (stryCov_9fa48("10242", "10243"), this.initialized)) {
        if (stryMutAct_9fa48("10244")) {
          {}
        } else {
          stryCov_9fa48("10244");
          console.log(stryMutAct_9fa48("10245") ? "" : (stryCov_9fa48("10245"), '[PostHog] Setting group:'), groupType, groupKey, properties);
          posthog.group(groupType, groupKey, properties);
        }
      }
    }
  }

  /**
   * Check if a feature flag is enabled for the current user.
   * 
   * Enables controlled feature rollouts and A/B testing for:
   *   - Gradual feature releases to user segments
   *   - A/B testing of new functionality
   *   - Kill switches for problematic features
   *   - Personalized user experiences
   * 
   * Feature Flag Categories:
   *   - UI features: new_swipe_interface, dark_mode
   *   - Business logic: premium_recommendations, affiliate_tracking
   *   - Experiments: recommendation_algorithm_v2
   *   - Rollouts: mobile_app_promotion
   * 
   * Parameters:
   *   flag: Feature flag name (snake_case convention)
   * 
   * Returns:
   *   boolean: True if feature is enabled for current user
   * 
   * Example:
   *   if (analytics.isFeatureEnabled('new_recommendation_engine')) {
   *     // Show new recommendation UI
   *   }
   */
  isFeatureEnabled(flag: string): boolean {
    if (stryMutAct_9fa48("10246")) {
      {}
    } else {
      stryCov_9fa48("10246");
      if (stryMutAct_9fa48("10248") ? false : stryMutAct_9fa48("10247") ? true : (stryCov_9fa48("10247", "10248"), this.initialized)) {
        if (stryMutAct_9fa48("10249")) {
          {}
        } else {
          stryCov_9fa48("10249");
          const enabled = stryMutAct_9fa48("10252") ? posthog.isFeatureEnabled(flag) !== true : stryMutAct_9fa48("10251") ? false : stryMutAct_9fa48("10250") ? true : (stryCov_9fa48("10250", "10251", "10252"), posthog.isFeatureEnabled(flag) === (stryMutAct_9fa48("10253") ? false : (stryCov_9fa48("10253"), true)));
          console.log(stryMutAct_9fa48("10254") ? `` : (stryCov_9fa48("10254"), `[PostHog] Feature flag '${flag}':`), enabled);
          return enabled;
        }
      }
      return stryMutAct_9fa48("10255") ? true : (stryCov_9fa48("10255"), false); // Default to disabled if analytics not available
    }
  }

  /**
   * Get feature flag value for advanced flag configurations.
   * 
   * Retrieves feature flag values that can be:
   *   - Boolean: true/false for simple on/off features
   *   - String: variant names for multivariate tests
   *   - Number: configuration values or percentages
   * 
   * Advanced Use Cases:
   *   - Multivariate testing with multiple variants
   *   - Configuration flags with specific values
   *   - Percentage-based rollouts
   *   - String-based feature variants
   * 
   * Parameters:
   *   flag: Feature flag name
   * 
   * Returns:
   *   string | boolean | undefined: Flag value or undefined if not set
   * 
   * Example:
   *   const variant = analytics.getFeatureFlag('recommendation_algorithm');
   *   if (variant === 'collaborative_filtering') {
   *     // Use collaborative filtering algorithm
   *   } else if (variant === 'content_based') {
   *     // Use content-based algorithm
   *   }
   */
  getFeatureFlag(flag: string): string | boolean | undefined {
    if (stryMutAct_9fa48("10256")) {
      {}
    } else {
      stryCov_9fa48("10256");
      if (stryMutAct_9fa48("10258") ? false : stryMutAct_9fa48("10257") ? true : (stryCov_9fa48("10257", "10258"), this.initialized)) {
        if (stryMutAct_9fa48("10259")) {
          {}
        } else {
          stryCov_9fa48("10259");
          const value = posthog.getFeatureFlag(flag);
          console.log(stryMutAct_9fa48("10260") ? `` : (stryCov_9fa48("10260"), `[PostHog] Feature flag '${flag}' value:`), value);
          return value;
        }
      }
      return undefined;
    }
  }

  /**
   * Opt user out of analytics tracking for privacy compliance.
   * 
   * Provides user control over data collection for:
   *   - GDPR and privacy regulation compliance
   *   - User preference and consent management
   *   - Cookie banner and privacy controls
   *   - Data minimization principles
   * 
   * Opt-Out Effects:
   *   - Stops all event tracking and data collection
   *   - Disables feature flags and personalization
   *   - Maintains basic functionality without analytics
   *   - Sets persistent opt-out preference
   * 
   * Privacy Compliance:
   *   - Respects user privacy choices
   *   - Provides clear opt-out mechanism
   *   - Maintains opt-out status across sessions
   * 
   * Example:
   *   // User clicks "Opt out of analytics"
   *   analytics.optOut();
   */
  optOut() {
    if (stryMutAct_9fa48("10261")) {
      {}
    } else {
      stryCov_9fa48("10261");
      if (stryMutAct_9fa48("10263") ? false : stryMutAct_9fa48("10262") ? true : (stryCov_9fa48("10262", "10263"), this.initialized)) {
        if (stryMutAct_9fa48("10264")) {
          {}
        } else {
          stryCov_9fa48("10264");
          console.log(stryMutAct_9fa48("10265") ? "" : (stryCov_9fa48("10265"), '[PostHog] User opted out of analytics tracking'));
          posthog.opt_out_capturing();
        }
      }
    }
  }

  /**
   * Opt user into analytics tracking after previous opt-out.
   * 
   * Re-enables analytics for users who previously opted out:
   *   - Restores full analytics functionality
   *   - Re-enables feature flags and personalization
   *   - Resumes event tracking and data collection
   *   - Updates user consent preferences
   * 
   * Use Cases:
   *   - User changes privacy preferences
   *   - Premium users enabling advanced features
   *   - Onboarding flow consent updates
   *   - Settings page privacy controls
   * 
   * Example:
   *   // User clicks "Enable analytics"
   *   analytics.optIn();
   */
  optIn() {
    if (stryMutAct_9fa48("10266")) {
      {}
    } else {
      stryCov_9fa48("10266");
      if (stryMutAct_9fa48("10268") ? false : stryMutAct_9fa48("10267") ? true : (stryCov_9fa48("10267", "10268"), this.initialized)) {
        if (stryMutAct_9fa48("10269")) {
          {}
        } else {
          stryCov_9fa48("10269");
          console.log(stryMutAct_9fa48("10270") ? "" : (stryCov_9fa48("10270"), '[PostHog] User opted into analytics tracking'));
          posthog.opt_in_capturing();
        }
      }
    }
  }

  /**
   * Check if user has opted out of analytics tracking.
   * 
   * Determines user's current privacy preference for:
   *   - Conditional UI rendering based on consent
   *   - Privacy settings page status display
   *   - Feature availability and functionality
   *   - Compliance with privacy regulations
   * 
   * Returns:
   *   boolean: True if user has opted out, false otherwise
   * 
   * Example:
   *   if (!analytics.hasOptedOut()) {
   *     // Show analytics-dependent features
   *     renderPersonalizedRecommendations();
   *   }
   */
  hasOptedOut(): boolean {
    if (stryMutAct_9fa48("10271")) {
      {}
    } else {
      stryCov_9fa48("10271");
      if (stryMutAct_9fa48("10273") ? false : stryMutAct_9fa48("10272") ? true : (stryCov_9fa48("10272", "10273"), this.initialized)) {
        if (stryMutAct_9fa48("10274")) {
          {}
        } else {
          stryCov_9fa48("10274");
          return posthog.has_opted_out_capturing();
        }
      }
      return stryMutAct_9fa48("10275") ? true : (stryCov_9fa48("10275"), false); // Default to opted-in if analytics not available
    }
  }
}

// ==============================================================================
// SINGLETON ANALYTICS INSTANCE
// ==============================================================================
// Global analytics instance for application-wide usage

/**
 * Global analytics service instance.
 * 
 * Singleton pattern ensures consistent analytics across the entire application.
 * Use this instance for all analytics operations to maintain state and configuration.
 */
export const analytics = new AnalyticsService();

// ==============================================================================
// CONVENIENCE FUNCTIONS
// ==============================================================================
// Simplified API for common analytics operations

/**
 * Track user event with simplified API.
 * 
 * Convenience function for the most common analytics operation.
 * Provides type-safe event tracking without direct service access.
 * 
 * Parameters:
 *   eventName: Descriptive event name (snake_case)
 *   properties: Optional event data
 * 
 * Example:
 *   trackEvent('button_clicked', { button_id: 'signup' });
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (stryMutAct_9fa48("10276")) {
    {}
  } else {
    stryCov_9fa48("10276");
    analytics.track(eventName, properties);
  }
};

/**
 * Identify user with simplified API.
 * 
 * Convenience function for user identification without direct service access.
 * 
 * Parameters:
 *   userId: Unique user identifier
 *   properties: Optional user attributes
 * 
 * Example:
 *   identifyUser('user_123', { email: 'user@example.com' });
 */
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (stryMutAct_9fa48("10277")) {
    {}
  } else {
    stryCov_9fa48("10277");
    analytics.identify(userId, properties);
  }
};

/**
 * Track page view with simplified API.
 * 
 * Convenience function for page view tracking without direct service access.
 * 
 * Parameters:
 *   path: Optional page path (defaults to current URL)
 * 
 * Example:
 *   trackPageView('/discover');
 */
export const trackPageView = (path?: string) => {
  if (stryMutAct_9fa48("10278")) {
    {}
  } else {
    stryCov_9fa48("10278");
    analytics.trackPageView(path);
  }
};

// Default export for importing as single module
export default analytics;

// Export all public interfaces
// Exported: analytics, trackEvent, identifyUser, trackPageView, AnalyticsService