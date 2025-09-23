/**
 * Wishlists Collection Page - Server Component (75% Server Components Target)
 *
 * Main page for viewing and managing user's wishlists.
 * This page demonstrates the Amazon affiliate wishlist model with server-side rendering.
 *
 * Server Components (75%):
 * - Page layout and structure
 * - Wishlist data fetching with caching
 * - SEO metadata generation
 * - Authentication state checking
 * - Static content rendering
 * - Wishlist statistics
 *
 * Client Components (25%):
 * - Create wishlist form
 * - Wishlist action buttons
 * - Interactive search/filter
 * - Share wishlist modals
 *
 * Features:
 * - Server-side wishlist fetching with caching
 * - Progressive enhancement approach
 * - Responsive design
 * - Authentication-aware rendering
 * - SEO optimised for social sharing
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
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserWishlistsAction } from '@/app/actions/wishlists';
import { WishlistGrid } from '@/components/wishlists/WishlistGrid';
import { CreateWishlistButton } from '@/components/wishlists/CreateWishlistButton';
import { WishlistStats } from '@/components/wishlists/WishlistStats';
import { Plus, Heart, Users, Share2 } from 'lucide-react';

// ==============================================================================
// METADATA (SERVER-SIDE)
// ==============================================================================

export const metadata: Metadata = stryMutAct_9fa48("1248") ? {} : (stryCov_9fa48("1248"), {
  title: stryMutAct_9fa48("1249") ? "" : (stryCov_9fa48("1249"), 'My Wishlists'),
  description: stryMutAct_9fa48("1250") ? "" : (stryCov_9fa48("1250"), 'Manage your wishlists, create new ones, and share with friends and family. Discover amazing gifts with AI-powered recommendations.'),
  keywords: stryMutAct_9fa48("1251") ? [] : (stryCov_9fa48("1251"), [stryMutAct_9fa48("1252") ? "" : (stryCov_9fa48("1252"), 'my wishlists'), stryMutAct_9fa48("1253") ? "" : (stryCov_9fa48("1253"), 'gift lists'), stryMutAct_9fa48("1254") ? "" : (stryCov_9fa48("1254"), 'wishlist management'), stryMutAct_9fa48("1255") ? "" : (stryCov_9fa48("1255"), 'share wishlists'), stryMutAct_9fa48("1256") ? "" : (stryCov_9fa48("1256"), 'AI recommendations')]),
  openGraph: stryMutAct_9fa48("1257") ? {} : (stryCov_9fa48("1257"), {
    title: stryMutAct_9fa48("1258") ? "" : (stryCov_9fa48("1258"), 'My Wishlists | aclue'),
    description: stryMutAct_9fa48("1259") ? "" : (stryCov_9fa48("1259"), 'Manage and share your wishlists with AI-powered gift recommendations'),
    type: stryMutAct_9fa48("1260") ? "" : (stryCov_9fa48("1260"), 'website'),
    locale: stryMutAct_9fa48("1261") ? "" : (stryCov_9fa48("1261"), 'en_GB')
  }),
  robots: stryMutAct_9fa48("1262") ? {} : (stryCov_9fa48("1262"), {
    index: stryMutAct_9fa48("1263") ? true : (stryCov_9fa48("1263"), false),
    follow: stryMutAct_9fa48("1264") ? true : (stryCov_9fa48("1264"), false)
  })
});

// ==============================================================================
// TYPES
// ==============================================================================

interface Wishlist {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
  share_token?: string;
}

// ==============================================================================
// SERVER HELPER FUNCTIONS
// ==============================================================================

/**
 * Check authentication status server-side
 * Uses Next.js cookies() to access HTTP cookies on the server
 */
async function getAuthenticationStatus(): Promise<boolean> {
  if (stryMutAct_9fa48("1265")) {
    {}
  } else {
    stryCov_9fa48("1265");
    try {
      if (stryMutAct_9fa48("1266")) {
        {}
      } else {
        stryCov_9fa48("1266");
        const cookieStore = cookies();
        const accessToken = cookieStore.get(stryMutAct_9fa48("1267") ? "" : (stryCov_9fa48("1267"), 'access_token'));
        return stryMutAct_9fa48("1268") ? !accessToken?.value : (stryCov_9fa48("1268"), !(stryMutAct_9fa48("1269") ? accessToken?.value : (stryCov_9fa48("1269"), !(stryMutAct_9fa48("1270") ? accessToken.value : (stryCov_9fa48("1270"), accessToken?.value)))));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1271")) {
        {}
      } else {
        stryCov_9fa48("1271");
        console.error(stryMutAct_9fa48("1272") ? "" : (stryCov_9fa48("1272"), 'Error checking authentication:'), error);
        return stryMutAct_9fa48("1273") ? true : (stryCov_9fa48("1273"), false);
      }
    }
  }
}

/**
 * Get user's wishlists with fallback
 * Server-side data fetching with error handling
 */
async function getUserWishlists(): Promise<Wishlist[]> {
  if (stryMutAct_9fa48("1274")) {
    {}
  } else {
    stryCov_9fa48("1274");
    try {
      if (stryMutAct_9fa48("1275")) {
        {}
      } else {
        stryCov_9fa48("1275");
        const result = await getUserWishlistsAction();
        if (stryMutAct_9fa48("1278") ? result.success || result.data : stryMutAct_9fa48("1277") ? false : stryMutAct_9fa48("1276") ? true : (stryCov_9fa48("1276", "1277", "1278"), result.success && result.data)) {
          if (stryMutAct_9fa48("1279")) {
            {}
          } else {
            stryCov_9fa48("1279");
            return result.data;
          }
        }
        console.error(stryMutAct_9fa48("1280") ? "" : (stryCov_9fa48("1280"), 'Failed to fetch wishlists:'), result.error);
        return stryMutAct_9fa48("1281") ? ["Stryker was here"] : (stryCov_9fa48("1281"), []);
      }
    } catch (error) {
      if (stryMutAct_9fa48("1282")) {
        {}
      } else {
        stryCov_9fa48("1282");
        console.error(stryMutAct_9fa48("1283") ? "" : (stryCov_9fa48("1283"), 'Error fetching wishlists:'), error);
        return stryMutAct_9fa48("1284") ? ["Stryker was here"] : (stryCov_9fa48("1284"), []);
      }
    }
  }
}

/**
 * Calculate wishlist statistics
 */
function calculateWishlistStats(wishlists: Wishlist[]) {
  if (stryMutAct_9fa48("1285")) {
    {}
  } else {
    stryCov_9fa48("1285");
    const totalWishlists = wishlists.length;
    const totalProducts = wishlists.reduce(stryMutAct_9fa48("1286") ? () => undefined : (stryCov_9fa48("1286"), (sum, wishlist) => stryMutAct_9fa48("1287") ? sum - wishlist.product_count : (stryCov_9fa48("1287"), sum + wishlist.product_count)), 0);
    const publicWishlists = stryMutAct_9fa48("1288") ? wishlists.length : (stryCov_9fa48("1288"), wishlists.filter(stryMutAct_9fa48("1289") ? () => undefined : (stryCov_9fa48("1289"), w => w.is_public)).length);
    const privateWishlists = stryMutAct_9fa48("1290") ? totalWishlists + publicWishlists : (stryCov_9fa48("1290"), totalWishlists - publicWishlists);
    return stryMutAct_9fa48("1291") ? {} : (stryCov_9fa48("1291"), {
      totalWishlists,
      totalProducts,
      publicWishlists,
      privateWishlists
    });
  }
}

// ==============================================================================
// SERVER COMPONENT PAGE
// ==============================================================================

/**
 * Wishlists Collection Page Server Component
 *
 * This is the main server component that:
 * 1. Checks authentication server-side
 * 2. Fetches wishlist data server-side
 * 3. Renders the page structure
 * 4. Passes data to client components
 */
export default async function WishlistsPage() {
  if (stryMutAct_9fa48("1292")) {
    {}
  } else {
    stryCov_9fa48("1292");
    // Server-side authentication check
    const isAuthenticated = await getAuthenticationStatus();

    // Redirect unauthenticated users
    if (stryMutAct_9fa48("1295") ? false : stryMutAct_9fa48("1294") ? true : stryMutAct_9fa48("1293") ? isAuthenticated : (stryCov_9fa48("1293", "1294", "1295"), !isAuthenticated)) {
      if (stryMutAct_9fa48("1296")) {
        {}
      } else {
        stryCov_9fa48("1296");
        redirect(stryMutAct_9fa48("1297") ? "" : (stryCov_9fa48("1297"), '/auth/login?redirect=/wishlists'));
      }
    }

    // Server-side data fetching
    const wishlists = await getUserWishlists();
    const stats = calculateWishlistStats(wishlists);
    return <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">My Wishlists</h1>
              <p className="text-xl text-primary-100">
                Create, manage, and share your gift wishlists with friends and family
              </p>
            </div>

            {/* Create Wishlist Button - Client Component */}
            <CreateWishlistButton />
          </div>

          {/* Stats Overview - Server Component */}
          <div className="mt-8">
            <WishlistStats stats={stats} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Empty State */}
        {(stryMutAct_9fa48("1300") ? wishlists.length !== 0 : stryMutAct_9fa48("1299") ? false : stryMutAct_9fa48("1298") ? true : (stryCov_9fa48("1298", "1299", "1300"), wishlists.length === 0)) ? <div className="text-center py-16">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-16 h-16 text-primary-400" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Create Your First Wishlist
            </h2>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Start building your perfect gift wishlist! Add products you love,
              share with friends and family, and let our AI help you discover amazing recommendations.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create & Organise</h3>
                <p className="text-sm text-gray-600">
                  Build multiple wishlists for different occasions and interests
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Share with Friends</h3>
                <p className="text-sm text-gray-600">
                  Let friends and family know exactly what you want
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Share2 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Recommendations</h3>
                <p className="text-sm text-gray-600">
                  Get personalised gift suggestions powered by AI
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <CreateWishlistButton variant="primary" />

              <Link href="/discover" className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Discover Products
              </Link>
            </div>
          </div> : <>
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Your Wishlists ({wishlists.length})
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage and share your gift collections
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Search/Filter - Future Enhancement */}
                <CreateWishlistButton />
              </div>
            </div>

            {/* Wishlist Grid - Server Component with Client Interactions */}
            <WishlistGrid wishlists={wishlists} />
          </>}

        {/* Quick Actions - Server Component */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Discover More Amazing Products
            </h3>
            <p className="text-gray-600 mb-6">
              Explore our curated collection and add items to your wishlists
            </p>
            <Link href="/discover" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Heart className="w-5 h-5" />
              Start Discovering
            </Link>
          </div>
        </div>
      </div>
    </div>;
  }
}

// ==============================================================================
// PERFORMANCE OPTIMIZATIONS
// ==============================================================================

/**
 * Enable static generation with ISR
 * This page will be dynamically rendered due to authentication requirements
 */
export const dynamic = stryMutAct_9fa48("1301") ? "" : (stryCov_9fa48("1301"), 'force-dynamic');

/**
 * Revalidation for cached content
 */
export const revalidate = 300; // 5 minutes