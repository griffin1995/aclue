/**
 * aclue PostHog Analytics Provider
 * 
 * Provides application-wide analytics tracking using PostHog for user behavior
 * analysis, feature usage monitoring, and business intelligence. Handles automatic
 * page view tracking, user identification, and custom event collection.
 * 
 * Key Features:
 *   - Automatic page view tracking on route changes
 *   - User identification and session management
 *   - Custom event tracking for business metrics
 *   - Feature flag integration for A/B testing
 *   - Privacy-compliant data collection
 *   - Development/production environment handling
 * 
 * Business Intelligence:
 *   - User journey and funnel analysis
 *   - Feature adoption and usage patterns
 *   - Conversion rate optimization
 *   - A/B test performance tracking
 *   - Revenue attribution and cohort analysis
 * 
 * Privacy Features:
 *   - GDPR-compliant data collection
 *   - User consent management
 *   - Data anonymization options
 *   - Opt-out functionality
 *   - Secure data transmission
 * 
 * Integration Points:
 *   - Authentication: User identification
 *   - E-commerce: Purchase and revenue tracking
 *   - Feature flags: A/B testing and rollouts
 *   - Error tracking: Performance monitoring
 * 
 * Usage:
 *   <PostHogProvider>
 *     <App />
 *   </PostHogProvider>
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
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { analytics, trackPageView } from '@/lib/analytics';

/**
 * Props interface for PostHogProvider component.
 * 
 * @param children - React components to wrap with analytics tracking
 */
interface PostHogProviderProps {
  children: React.ReactNode;
}
export function PostHogProvider({
  children
}: PostHogProviderProps) {
  if (stryMutAct_9fa48("4861")) {
    {}
  } else {
    stryCov_9fa48("4861");
    const router = useRouter();
    useEffect(() => {
      if (stryMutAct_9fa48("4862")) {
        {}
      } else {
        stryCov_9fa48("4862");
        // Temporarily disable PostHog in production to avoid CORS issues
        if (stryMutAct_9fa48("4865") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("4864") ? false : stryMutAct_9fa48("4863") ? true : (stryCov_9fa48("4863", "4864", "4865"), process.env.NODE_ENV === (stryMutAct_9fa48("4866") ? "" : (stryCov_9fa48("4866"), 'production')))) {
          if (stryMutAct_9fa48("4867")) {
            {}
          } else {
            stryCov_9fa48("4867");
            console.log(stryMutAct_9fa48("4868") ? "" : (stryCov_9fa48("4868"), '[PostHog Provider] Disabled in production to avoid CORS issues'));
            return;
          }
        }

        // Initialize PostHog
        analytics.init();

        // Track page views on route changes
        const handleRouteChange = (url: string) => {
          if (stryMutAct_9fa48("4869")) {
            {}
          } else {
            stryCov_9fa48("4869");
            console.log(stryMutAct_9fa48("4870") ? "" : (stryCov_9fa48("4870"), '[PostHog Provider] Route change detected:'), url);

            // Track pageview with proper properties
            analytics.track(stryMutAct_9fa48("4871") ? "" : (stryCov_9fa48("4871"), '$pageview'), stryMutAct_9fa48("4872") ? {} : (stryCov_9fa48("4872"), {
              $current_url: stryMutAct_9fa48("4873") ? `` : (stryCov_9fa48("4873"), `${window.location.origin}${url}`),
              $pathname: url,
              $host: window.location.host,
              $referrer: document.referrer,
              page_title: document.title
            }));
          }
        };
        router.events.on(stryMutAct_9fa48("4874") ? "" : (stryCov_9fa48("4874"), 'routeChangeComplete'), handleRouteChange);

        // Track initial page view
        if (stryMutAct_9fa48("4876") ? false : stryMutAct_9fa48("4875") ? true : (stryCov_9fa48("4875", "4876"), router.isReady)) {
          if (stryMutAct_9fa48("4877")) {
            {}
          } else {
            stryCov_9fa48("4877");
            console.log(stryMutAct_9fa48("4878") ? "" : (stryCov_9fa48("4878"), '[PostHog Provider] Initial page view:'), router.asPath);

            // Initial pageview
            analytics.track(stryMutAct_9fa48("4879") ? "" : (stryCov_9fa48("4879"), '$pageview'), stryMutAct_9fa48("4880") ? {} : (stryCov_9fa48("4880"), {
              $current_url: window.location.href,
              $pathname: router.asPath,
              $host: window.location.host,
              $referrer: document.referrer,
              page_title: document.title,
              initial_page: stryMutAct_9fa48("4881") ? false : (stryCov_9fa48("4881"), true)
            }));
          }
        }
        return () => {
          if (stryMutAct_9fa48("4882")) {
            {}
          } else {
            stryCov_9fa48("4882");
            router.events.off(stryMutAct_9fa48("4883") ? "" : (stryCov_9fa48("4883"), 'routeChangeComplete'), handleRouteChange);
          }
        };
      }
    }, stryMutAct_9fa48("4884") ? [] : (stryCov_9fa48("4884"), [router.events, router.isReady, router.asPath]));
    return <>{children}</>;
  }
}
export default PostHogProvider;