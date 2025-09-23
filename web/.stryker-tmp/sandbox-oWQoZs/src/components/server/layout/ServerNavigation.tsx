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
import Link from 'next/link';

/**
 * Server Navigation Component
 *
 * Main navigation menu rendered on the server.
 * Provides primary navigation links with performance optimisation.
 *
 * Features:
 * - Server-side rendering
 * - Responsive design
 * - Semantic HTML structure
 * - Accessibility support
 */
export default function ServerNavigation() {
  if (stryMutAct_9fa48("5564")) {
    {}
  } else {
    stryCov_9fa48("5564");
    const navigationItems = stryMutAct_9fa48("5565") ? [] : (stryCov_9fa48("5565"), [stryMutAct_9fa48("5566") ? {} : (stryCov_9fa48("5566"), {
      name: stryMutAct_9fa48("5567") ? "" : (stryCov_9fa48("5567"), 'Discover'),
      href: stryMutAct_9fa48("5568") ? "" : (stryCov_9fa48("5568"), '/discover'),
      description: stryMutAct_9fa48("5569") ? "" : (stryCov_9fa48("5569"), 'Find perfect gifts with AI recommendations')
    }), stryMutAct_9fa48("5570") ? {} : (stryCov_9fa48("5570"), {
      name: stryMutAct_9fa48("5571") ? "" : (stryCov_9fa48("5571"), 'How It Works'),
      href: stryMutAct_9fa48("5572") ? "" : (stryCov_9fa48("5572"), '/about'),
      description: stryMutAct_9fa48("5573") ? "" : (stryCov_9fa48("5573"), 'Learn about our AI-powered gifting platform')
    }), stryMutAct_9fa48("5574") ? {} : (stryCov_9fa48("5574"), {
      name: stryMutAct_9fa48("5575") ? "" : (stryCov_9fa48("5575"), 'Pricing'),
      href: stryMutAct_9fa48("5576") ? "" : (stryCov_9fa48("5576"), '/pricing'),
      description: stryMutAct_9fa48("5577") ? "" : (stryCov_9fa48("5577"), 'Simple, transparent pricing')
    })]);
    return <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
      {navigationItems.map(stryMutAct_9fa48("5578") ? () => undefined : (stryCov_9fa48("5578"), item => <Link key={item.name} href={item.href} className="text-gray-700 hover:text-gray-900 font-medium transition-colors" title={item.description}>
          {item.name}
        </Link>))}
    </nav>;
  }
}