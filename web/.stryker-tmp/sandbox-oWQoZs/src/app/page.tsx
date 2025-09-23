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
import NewsletterMaintenancePage from '@/components/NewsletterMaintenancePage';

/**
 * App Router Root Page - Newsletter Landing Page
 *
 * This is the App Router implementation of the root page that provides:
 * 1. Newsletter signup as the primary landing page at /
 * 2. Beta program signup with email collection
 * 3. Future of gift discovery messaging
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - Newsletter signup using server actions
 * - Optimal performance with server components
 * - Preserves all Phase 3 authentication work
 * - Consistent branding with aclue_text_clean.png
 * - Always displays newsletter page (no redirects)
 *
 * Architecture:
 * - Server component for optimal performance
 * - No maintenance mode dependency
 * - Newsletter component handles client interactions
 * - Primary landing page for all users
 */

/**
 * Root page server component
 * Always displays the newsletter landing page
 */
export default function RootPage() {
  if (stryMutAct_9fa48("2626")) {
    {}
  } else {
    stryCov_9fa48("2626");
    console.log(stryMutAct_9fa48("2627") ? "" : (stryCov_9fa48("2627"), '🏠 Newsletter landing page rendered at root'));

    // Always render newsletter landing page - no redirects
    return <main className="min-h-screen">
      <NewsletterMaintenancePage />
    </main>;
  }
}

/**
 * Metadata for the root page
 */
export const metadata = stryMutAct_9fa48("2628") ? {} : (stryCov_9fa48("2628"), {
  title: stryMutAct_9fa48("2629") ? "" : (stryCov_9fa48("2629"), 'aclue - AI-Powered Gift Discovery Platform'),
  description: stryMutAct_9fa48("2630") ? "" : (stryCov_9fa48("2630"), 'aclue is launching soon! Join our beta program for early access to our AI-powered gift recommendation platform that transforms how gifts are chosen.'),
  keywords: stryMutAct_9fa48("2631") ? "" : (stryCov_9fa48("2631"), 'gifts, AI recommendations, gift ideas, beta signup, personalised gifts, neural network, coming soon'),
  openGraph: stryMutAct_9fa48("2632") ? {} : (stryCov_9fa48("2632"), {
    title: stryMutAct_9fa48("2633") ? "" : (stryCov_9fa48("2633"), 'aclue - AI-Powered Gift Discovery Platform'),
    description: stryMutAct_9fa48("2634") ? "" : (stryCov_9fa48("2634"), 'Join our beta program for early access to revolutionary AI-powered gift recommendations.'),
    images: stryMutAct_9fa48("2635") ? [] : (stryCov_9fa48("2635"), [stryMutAct_9fa48("2636") ? "" : (stryCov_9fa48("2636"), '/aclue_text_clean.png')]),
    url: stryMutAct_9fa48("2637") ? "" : (stryCov_9fa48("2637"), 'https://aclue.app')
  }),
  twitter: stryMutAct_9fa48("2638") ? {} : (stryCov_9fa48("2638"), {
    card: stryMutAct_9fa48("2639") ? "" : (stryCov_9fa48("2639"), 'summary_large_image'),
    title: stryMutAct_9fa48("2640") ? "" : (stryCov_9fa48("2640"), 'aclue - AI-Powered Gift Discovery Platform'),
    description: stryMutAct_9fa48("2641") ? "" : (stryCov_9fa48("2641"), 'Join our beta program for early access to revolutionary AI-powered gift recommendations.'),
    images: stryMutAct_9fa48("2642") ? [] : (stryCov_9fa48("2642"), [stryMutAct_9fa48("2643") ? "" : (stryCov_9fa48("2643"), '/aclue_text_clean.png')])
  }),
  robots: stryMutAct_9fa48("2644") ? {} : (stryCov_9fa48("2644"), {
    index: (stryMutAct_9fa48("2647") ? process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== 'true' : stryMutAct_9fa48("2646") ? false : stryMutAct_9fa48("2645") ? true : (stryCov_9fa48("2645", "2646", "2647"), process.env.NEXT_PUBLIC_MAINTENANCE_MODE === (stryMutAct_9fa48("2648") ? "" : (stryCov_9fa48("2648"), 'true')))) ? stryMutAct_9fa48("2649") ? true : (stryCov_9fa48("2649"), false) : stryMutAct_9fa48("2650") ? false : (stryCov_9fa48("2650"), true),
    follow: (stryMutAct_9fa48("2653") ? process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== 'true' : stryMutAct_9fa48("2652") ? false : stryMutAct_9fa48("2651") ? true : (stryCov_9fa48("2651", "2652", "2653"), process.env.NEXT_PUBLIC_MAINTENANCE_MODE === (stryMutAct_9fa48("2654") ? "" : (stryCov_9fa48("2654"), 'true')))) ? stryMutAct_9fa48("2655") ? true : (stryCov_9fa48("2655"), false) : stryMutAct_9fa48("2656") ? false : (stryCov_9fa48("2656"), true)
  })
});