/**
 * Wishlist Navigation - Client Component
 *
 * Navigation component for wishlist sections with user-friendly links
 * and breadcrumb functionality for the Amazon affiliate wishlist system.
 */
// @ts-nocheck


'use client';

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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ArrowLeft, Grid3X3, Plus } from 'lucide-react';
export function WishlistNavigation() {
  if (stryMutAct_9fa48("8231")) {
    {}
  } else {
    stryCov_9fa48("8231");
    const pathname = usePathname();

    // Determine if we're on a specific wishlist page
    const isWishlistDetail = stryMutAct_9fa48("8234") ? pathname.includes('/wishlists/') || pathname !== '/wishlists' : stryMutAct_9fa48("8233") ? false : stryMutAct_9fa48("8232") ? true : (stryCov_9fa48("8232", "8233", "8234"), pathname.includes(stryMutAct_9fa48("8235") ? "" : (stryCov_9fa48("8235"), '/wishlists/')) && (stryMutAct_9fa48("8237") ? pathname === '/wishlists' : stryMutAct_9fa48("8236") ? true : (stryCov_9fa48("8236", "8237"), pathname !== (stryMutAct_9fa48("8238") ? "" : (stryCov_9fa48("8238"), '/wishlists')))));
    const isCreatePage = pathname.includes(stryMutAct_9fa48("8239") ? "" : (stryCov_9fa48("8239"), '/create'));
    const isEditPage = pathname.includes(stryMutAct_9fa48("8240") ? "" : (stryCov_9fa48("8240"), '/edit'));
    const isSharePage = pathname.includes(stryMutAct_9fa48("8241") ? "" : (stryCov_9fa48("8241"), '/share'));
    return <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Back/Navigation */}
          <div className="flex items-center gap-6">
            {isWishlistDetail ? <Link href="/wishlists" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Wishlists</span>
              </Link> : <Link href="/wishlists" className="flex items-center gap-2 text-gray-900 font-semibold">
                <Heart className="w-6 h-6 text-primary-600" />
                <span>Wishlists</span>
              </Link>}
          </div>

          {/* Center - Breadcrumb for detail pages */}
          {stryMutAct_9fa48("8244") ? isWishlistDetail && !isCreatePage || <div className="hidden md:flex items-center text-sm text-gray-600">
              <Link href="/wishlists" className="hover:text-primary-600">
                My Wishlists
              </Link>
              <span className="mx-2">/</span>
              {isEditPage ? <>
                  <span>Edit Wishlist</span>
                </> : isSharePage ? <>
                  <span>Share Wishlist</span>
                </> : <>
                  <span>Wishlist Details</span>
                </>}
            </div> : stryMutAct_9fa48("8243") ? false : stryMutAct_9fa48("8242") ? true : (stryCov_9fa48("8242", "8243", "8244"), (stryMutAct_9fa48("8246") ? isWishlistDetail || !isCreatePage : stryMutAct_9fa48("8245") ? true : (stryCov_9fa48("8245", "8246"), isWishlistDetail && (stryMutAct_9fa48("8247") ? isCreatePage : (stryCov_9fa48("8247"), !isCreatePage)))) && <div className="hidden md:flex items-center text-sm text-gray-600">
              <Link href="/wishlists" className="hover:text-primary-600">
                My Wishlists
              </Link>
              <span className="mx-2">/</span>
              {isEditPage ? <>
                  <span>Edit Wishlist</span>
                </> : isSharePage ? <>
                  <span>Share Wishlist</span>
                </> : <>
                  <span>Wishlist Details</span>
                </>}
            </div>)}

          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            {stryMutAct_9fa48("8250") ? !isCreatePage && !isEditPage || <>
                <Link href="/discover" className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Grid3X3 className="w-4 h-4" />
                  <span>Discover</span>
                </Link>

                {pathname === '/wishlists' && <Link href="/wishlists/create" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Wishlist</span>
                  </Link>}
              </> : stryMutAct_9fa48("8249") ? false : stryMutAct_9fa48("8248") ? true : (stryCov_9fa48("8248", "8249", "8250"), (stryMutAct_9fa48("8252") ? !isCreatePage || !isEditPage : stryMutAct_9fa48("8251") ? true : (stryCov_9fa48("8251", "8252"), (stryMutAct_9fa48("8253") ? isCreatePage : (stryCov_9fa48("8253"), !isCreatePage)) && (stryMutAct_9fa48("8254") ? isEditPage : (stryCov_9fa48("8254"), !isEditPage)))) && <>
                <Link href="/discover" className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Grid3X3 className="w-4 h-4" />
                  <span>Discover</span>
                </Link>

                {stryMutAct_9fa48("8257") ? pathname === '/wishlists' || <Link href="/wishlists/create" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Wishlist</span>
                  </Link> : stryMutAct_9fa48("8256") ? false : stryMutAct_9fa48("8255") ? true : (stryCov_9fa48("8255", "8256", "8257"), (stryMutAct_9fa48("8259") ? pathname !== '/wishlists' : stryMutAct_9fa48("8258") ? true : (stryCov_9fa48("8258", "8259"), pathname === (stryMutAct_9fa48("8260") ? "" : (stryCov_9fa48("8260"), '/wishlists')))) && <Link href="/wishlists/create" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Wishlist</span>
                  </Link>)}
              </>)}
          </div>
        </div>
      </div>
    </nav>;
  }
}