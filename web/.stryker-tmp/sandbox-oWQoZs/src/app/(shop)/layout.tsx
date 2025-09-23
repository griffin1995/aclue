/**
 * Shop Layout - Server Component
 *
 * Provides the shared layout for all shop-related pages including:
 * - Product discovery (/discover)
 * - Product details (/products/[id])
 * - Search results (/search)
 *
 * This is a server component that handles:
 * - Meta tags and SEO
 * - Shared navigation structure
 * - Common styling and branding
 *
 * Features:
 * - Server-side authentication checking
 * - Responsive design with glassmorphism
 * - Progressive enhancement approach
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
import React from 'react';
import type { Metadata } from 'next';
import { ShopNavigation } from '@/components/shop/ShopNavigation';
export const metadata: Metadata = stryMutAct_9fa48("883") ? {} : (stryCov_9fa48("883"), {
  title: stryMutAct_9fa48("884") ? {} : (stryCov_9fa48("884"), {
    template: stryMutAct_9fa48("885") ? "" : (stryCov_9fa48("885"), '%s | aclue'),
    default: stryMutAct_9fa48("886") ? "" : (stryCov_9fa48("886"), 'Shop | aclue')
  }),
  description: stryMutAct_9fa48("887") ? "" : (stryCov_9fa48("887"), 'Discover amazing gifts with AI-powered recommendations on aclue'),
  keywords: stryMutAct_9fa48("888") ? [] : (stryCov_9fa48("888"), [stryMutAct_9fa48("889") ? "" : (stryCov_9fa48("889"), 'gifts'), stryMutAct_9fa48("890") ? "" : (stryCov_9fa48("890"), 'recommendations'), stryMutAct_9fa48("891") ? "" : (stryCov_9fa48("891"), 'AI'), stryMutAct_9fa48("892") ? "" : (stryCov_9fa48("892"), 'shopping'), stryMutAct_9fa48("893") ? "" : (stryCov_9fa48("893"), 'aclue')]),
  openGraph: stryMutAct_9fa48("894") ? {} : (stryCov_9fa48("894"), {
    title: stryMutAct_9fa48("895") ? "" : (stryCov_9fa48("895"), 'Shop | aclue'),
    description: stryMutAct_9fa48("896") ? "" : (stryCov_9fa48("896"), 'Discover amazing gifts with AI-powered recommendations'),
    type: stryMutAct_9fa48("897") ? "" : (stryCov_9fa48("897"), 'website'),
    locale: stryMutAct_9fa48("898") ? "" : (stryCov_9fa48("898"), 'en_GB')
  }),
  robots: stryMutAct_9fa48("899") ? {} : (stryCov_9fa48("899"), {
    index: stryMutAct_9fa48("900") ? true : (stryCov_9fa48("900"), false),
    // Keeping consistent with existing pages
    follow: stryMutAct_9fa48("901") ? true : (stryCov_9fa48("901"), false)
  })
});
interface ShopLayoutProps {
  children: React.ReactNode;
}

/**
 * Shop Layout Server Component
 *
 * Renders the shared layout structure for all shop pages.
 * Uses server components by default for optimal performance.
 */
export default function ShopLayout({
  children
}: ShopLayoutProps) {
  if (stryMutAct_9fa48("902")) {
    {}
  } else {
    stryCov_9fa48("902");
    return <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Shop Navigation - Client Component for Interactivity */}
      <ShopNavigation />

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>;
  }
}