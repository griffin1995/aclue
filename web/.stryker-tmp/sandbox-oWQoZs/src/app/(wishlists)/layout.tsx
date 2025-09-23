/**
 * Wishlists Layout - Server Component
 *
 * Provides the shared layout for all wishlist-related pages including:
 * - Wishlist collection (/wishlists)
 * - Individual wishlist views (/wishlists/[id])
 * - Wishlist creation and editing
 * - Shared wishlist pages
 *
 * This is a server component that handles:
 * - Meta tags and SEO optimisation
 * - Shared navigation structure for wishlist features
 * - Common styling and branding
 * - Authentication-aware rendering
 *
 * Features:
 * - Server-side authentication checking
 * - Responsive design with glassmorphism
 * - Progressive enhancement approach
 * - Amazon affiliate integration ready
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
import { WishlistNavigation } from '@/components/wishlists/WishlistNavigation';
export const metadata: Metadata = stryMutAct_9fa48("1227") ? {} : (stryCov_9fa48("1227"), {
  title: stryMutAct_9fa48("1228") ? {} : (stryCov_9fa48("1228"), {
    template: stryMutAct_9fa48("1229") ? "" : (stryCov_9fa48("1229"), '%s | Wishlists | aclue'),
    default: stryMutAct_9fa48("1230") ? "" : (stryCov_9fa48("1230"), 'Wishlists | aclue')
  }),
  description: stryMutAct_9fa48("1231") ? "" : (stryCov_9fa48("1231"), 'Create and manage wishlists, share with friends and family, and discover amazing gifts with AI-powered recommendations on aclue'),
  keywords: stryMutAct_9fa48("1232") ? [] : (stryCov_9fa48("1232"), [stryMutAct_9fa48("1233") ? "" : (stryCov_9fa48("1233"), 'wishlists'), stryMutAct_9fa48("1234") ? "" : (stryCov_9fa48("1234"), 'gift lists'), stryMutAct_9fa48("1235") ? "" : (stryCov_9fa48("1235"), 'sharing'), stryMutAct_9fa48("1236") ? "" : (stryCov_9fa48("1236"), 'AI recommendations'), stryMutAct_9fa48("1237") ? "" : (stryCov_9fa48("1237"), 'Amazon affiliate'), stryMutAct_9fa48("1238") ? "" : (stryCov_9fa48("1238"), 'aclue')]),
  openGraph: stryMutAct_9fa48("1239") ? {} : (stryCov_9fa48("1239"), {
    title: stryMutAct_9fa48("1240") ? "" : (stryCov_9fa48("1240"), 'Wishlists | aclue'),
    description: stryMutAct_9fa48("1241") ? "" : (stryCov_9fa48("1241"), 'Create and share wishlists with AI-powered gift recommendations'),
    type: stryMutAct_9fa48("1242") ? "" : (stryCov_9fa48("1242"), 'website'),
    locale: stryMutAct_9fa48("1243") ? "" : (stryCov_9fa48("1243"), 'en_GB')
  }),
  robots: stryMutAct_9fa48("1244") ? {} : (stryCov_9fa48("1244"), {
    index: stryMutAct_9fa48("1245") ? true : (stryCov_9fa48("1245"), false),
    // Keeping consistent with existing pages during alpha
    follow: stryMutAct_9fa48("1246") ? true : (stryCov_9fa48("1246"), false)
  })
});
interface WishlistLayoutProps {
  children: React.ReactNode;
}

/**
 * Wishlist Layout Server Component
 *
 * Renders the shared layout structure for all wishlist pages.
 * Uses server components by default for optimal performance.
 */
export default function WishlistLayout({
  children
}: WishlistLayoutProps) {
  if (stryMutAct_9fa48("1247")) {
    {}
  } else {
    stryCov_9fa48("1247");
    return <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Wishlist Navigation - Client Component for Interactivity */}
      <WishlistNavigation />

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>;
  }
}