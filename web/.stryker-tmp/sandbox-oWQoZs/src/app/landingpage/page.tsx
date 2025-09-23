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
import aclueMarketingPageOptimized from '@/components/aclueMarketingPageOptimized';

/**
 * App Router Landing Page - Optimized Hybrid Implementation
 *
 * This page serves as the main application entry point when maintenance mode is disabled.
 * Now uses optimized hybrid server/client architecture for improved performance and SEO.
 *
 * Features:
 * - Hybrid server/client component architecture (50% server rendered)
 * - Static content server-rendered for optimal SEO and performance
 * - Interactive elements client-side for enhanced user experience
 * - Progressive enhancement patterns throughout
 * - Optimal Core Web Vitals performance
 *
 * Architecture:
 * - Server components: Hero content, features, testimonials, footer
 * - Client components: Navigation interactions, animations, forms
 * - Achieves Phase 5 target of 50% server component rendering
 * - Integrates with App Router authentication system
 */

export default function LandingPageAppRouter() {
  if (stryMutAct_9fa48("2556")) {
    {}
  } else {
    stryCov_9fa48("2556");
    console.log(stryMutAct_9fa48("2557") ? "" : (stryCov_9fa48("2557"), '🏠 Landing page (App Router - Optimized) rendered'));
    return <main className="min-h-screen">
      <aclueMarketingPageOptimized />
    </main>;
  }
}

/**
 * Metadata for the landing page
 */
export const metadata = stryMutAct_9fa48("2558") ? {} : (stryCov_9fa48("2558"), {
  title: stryMutAct_9fa48("2559") ? "" : (stryCov_9fa48("2559"), 'aclue - A Data-Led Insight Layer That Transforms How Gifts Are Chosen'),
  description: stryMutAct_9fa48("2560") ? "" : (stryCov_9fa48("2560"), 'Swipe through products, train our AI to understand your taste, and get personalised gift recommendations that actually make sense. No more guessing, no more gift fails.'),
  keywords: stryMutAct_9fa48("2561") ? "" : (stryCov_9fa48("2561"), 'gifts, AI recommendations, gift ideas, personalised gifts, gift finder, machine learning, swipe interface'),
  openGraph: stryMutAct_9fa48("2562") ? {} : (stryCov_9fa48("2562"), {
    title: stryMutAct_9fa48("2563") ? "" : (stryCov_9fa48("2563"), 'aclue - A Data-Led Insight Layer That Transforms How Gifts Are Chosen'),
    description: stryMutAct_9fa48("2564") ? "" : (stryCov_9fa48("2564"), 'Discover perfect gifts with AI. Swipe through products, get personalised recommendations, and create shareable gift links.'),
    images: stryMutAct_9fa48("2565") ? [] : (stryCov_9fa48("2565"), [stryMutAct_9fa48("2566") ? "" : (stryCov_9fa48("2566"), '/aclue_text_clean.png')]),
    url: stryMutAct_9fa48("2567") ? "" : (stryCov_9fa48("2567"), 'https://aclue.app/landingpage')
  }),
  twitter: stryMutAct_9fa48("2568") ? {} : (stryCov_9fa48("2568"), {
    card: stryMutAct_9fa48("2569") ? "" : (stryCov_9fa48("2569"), 'summary_large_image'),
    title: stryMutAct_9fa48("2570") ? "" : (stryCov_9fa48("2570"), 'aclue - A Data-Led Insight Layer That Transforms How Gifts Are Chosen'),
    description: stryMutAct_9fa48("2571") ? "" : (stryCov_9fa48("2571"), 'Discover perfect gifts with AI. Swipe through products, get personalised recommendations, and create shareable gift links.'),
    images: stryMutAct_9fa48("2572") ? [] : (stryCov_9fa48("2572"), [stryMutAct_9fa48("2573") ? "" : (stryCov_9fa48("2573"), '/aclue_text_clean.png')])
  }),
  robots: stryMutAct_9fa48("2574") ? {} : (stryCov_9fa48("2574"), {
    index: stryMutAct_9fa48("2575") ? false : (stryCov_9fa48("2575"), true),
    follow: stryMutAct_9fa48("2576") ? false : (stryCov_9fa48("2576"), true)
  })
});