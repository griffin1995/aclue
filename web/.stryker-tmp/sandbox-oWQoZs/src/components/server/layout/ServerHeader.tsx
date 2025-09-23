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
import Image from 'next/image';
import ServerNavigation from './ServerNavigation';

/**
 * Server Header Component
 *
 * Main navigation header rendered on the server for optimal performance.
 * Provides consistent branding and navigation across all pages.
 *
 * Features:
 * - Server-side rendering for SEO
 * - Responsive design
 * - aclue branding
 * - Main navigation
 *
 * Performance Benefits:
 * - No client-side JavaScript required
 * - Faster initial page load
 * - Better Core Web Vitals scores
 */
export default function ServerHeader() {
  if (stryMutAct_9fa48("5552")) {
    {}
  } else {
    stryCov_9fa48("5552");
    return <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Image src="/aclue_text_clean.png" alt="aclue Logo" width={120} height={40} priority className="h-8 w-auto" />
          </Link>

          {/* Navigation */}
          <ServerNavigation />

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>;
  }
}