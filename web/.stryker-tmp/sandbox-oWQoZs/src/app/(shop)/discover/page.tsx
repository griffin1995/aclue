/**
 * Discover Page - Server Component (75% Server Components Target)
 *
 * Product discovery page using App Router with server-side rendering.
 * This page demonstrates the Phase 4 migration with 75% server components.
 *
 * Server Components (75%):
 * - Page layout and structure
 * - Initial product data fetching
 * - SEO metadata generation
 * - Authentication state checking
 * - Static content rendering
 *
 * Client Components (25%):
 * - Interactive swipe interface
 * - User preference recording
 * - Dynamic UI updates
 * - Mobile-specific interactions
 *
 * Features:
 * - Server-side product fetching with caching
 * - Progressive enhancement approach
 * - Responsive design
 * - Authentication-aware rendering
 * - SEO optimised with metadata
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
import { getProducts } from '@/app/actions/products';
import { DiscoverInterface } from '@/components/shop/DiscoverInterface';
import { GuestNotice } from '@/components/shop/GuestNotice';
import { WelcomeOverlay } from '@/components/shop/WelcomeOverlay';

// ==============================================================================
// METADATA (SERVER-SIDE)
// ==============================================================================

export const metadata: Metadata = stryMutAct_9fa48("791") ? {} : (stryCov_9fa48("791"), {
  title: stryMutAct_9fa48("792") ? "" : (stryCov_9fa48("792"), 'Discover Gifts'),
  description: stryMutAct_9fa48("793") ? "" : (stryCov_9fa48("793"), 'Discover amazing gifts by swiping through our curated collection. Train our AI to understand your preferences and get personalised recommendations.'),
  keywords: stryMutAct_9fa48("794") ? [] : (stryCov_9fa48("794"), [stryMutAct_9fa48("795") ? "" : (stryCov_9fa48("795"), 'gift discovery'), stryMutAct_9fa48("796") ? "" : (stryCov_9fa48("796"), 'product recommendations'), stryMutAct_9fa48("797") ? "" : (stryCov_9fa48("797"), 'AI gifts'), stryMutAct_9fa48("798") ? "" : (stryCov_9fa48("798"), 'swipe interface'), stryMutAct_9fa48("799") ? "" : (stryCov_9fa48("799"), 'personalised shopping')]),
  openGraph: stryMutAct_9fa48("800") ? {} : (stryCov_9fa48("800"), {
    title: stryMutAct_9fa48("801") ? "" : (stryCov_9fa48("801"), 'Discover Gifts | aclue'),
    description: stryMutAct_9fa48("802") ? "" : (stryCov_9fa48("802"), 'Discover amazing gifts with AI-powered recommendations'),
    type: stryMutAct_9fa48("803") ? "" : (stryCov_9fa48("803"), 'website'),
    locale: stryMutAct_9fa48("804") ? "" : (stryCov_9fa48("804"), 'en_GB')
  }),
  robots: stryMutAct_9fa48("805") ? {} : (stryCov_9fa48("805"), {
    index: stryMutAct_9fa48("806") ? true : (stryCov_9fa48("806"), false),
    follow: stryMutAct_9fa48("807") ? true : (stryCov_9fa48("807"), false)
  })
});

// ==============================================================================
// TYPES
// ==============================================================================

interface Product {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  currency?: string;
  image_url: string;
  brand?: string;
  category?: {
    name: string;
  };
  rating?: number;
  affiliate_url?: string;
  url?: string;
}

// ==============================================================================
// SERVER HELPER FUNCTIONS
// ==============================================================================

/**
 * Check authentication status server-side
 * Uses Next.js cookies() to access HTTP cookies on the server
 */
async function getAuthenticationStatus(): Promise<boolean> {
  if (stryMutAct_9fa48("808")) {
    {}
  } else {
    stryCov_9fa48("808");
    try {
      if (stryMutAct_9fa48("809")) {
        {}
      } else {
        stryCov_9fa48("809");
        const cookieStore = cookies();
        const accessToken = cookieStore.get(stryMutAct_9fa48("810") ? "" : (stryCov_9fa48("810"), 'access_token'));
        return stryMutAct_9fa48("811") ? !accessToken?.value : (stryCov_9fa48("811"), !(stryMutAct_9fa48("812") ? accessToken?.value : (stryCov_9fa48("812"), !(stryMutAct_9fa48("813") ? accessToken.value : (stryCov_9fa48("813"), accessToken?.value)))));
      }
    } catch (error) {
      if (stryMutAct_9fa48("814")) {
        {}
      } else {
        stryCov_9fa48("814");
        console.error(stryMutAct_9fa48("815") ? "" : (stryCov_9fa48("815"), 'Error checking authentication:'), error);
        return stryMutAct_9fa48("816") ? true : (stryCov_9fa48("816"), false);
      }
    }
  }
}

/**
 * Get discovery products with fallback
 * Server-side data fetching with error handling
 */
async function getDiscoveryProducts(): Promise<Product[]> {
  if (stryMutAct_9fa48("817")) {
    {}
  } else {
    stryCov_9fa48("817");
    try {
      if (stryMutAct_9fa48("818")) {
        {}
      } else {
        stryCov_9fa48("818");
        const result = await getProducts(stryMutAct_9fa48("819") ? {} : (stryCov_9fa48("819"), {
          limit: 10
        }));
        if (stryMutAct_9fa48("822") ? result.success || result.data : stryMutAct_9fa48("821") ? false : stryMutAct_9fa48("820") ? true : (stryCov_9fa48("820", "821", "822"), result.success && result.data)) {
          if (stryMutAct_9fa48("823")) {
            {}
          } else {
            stryCov_9fa48("823");
            return result.data;
          }
        }

        // Return fallback products if API fails
        return getFallbackProducts();
      }
    } catch (error) {
      if (stryMutAct_9fa48("824")) {
        {}
      } else {
        stryCov_9fa48("824");
        console.error(stryMutAct_9fa48("825") ? "" : (stryCov_9fa48("825"), 'Error fetching discovery products:'), error);
        return getFallbackProducts();
      }
    }
  }
}

/**
 * Fallback products for development and error states
 */
function getFallbackProducts(): Product[] {
  if (stryMutAct_9fa48("826")) {
    {}
  } else {
    stryCov_9fa48("826");
    return stryMutAct_9fa48("827") ? [] : (stryCov_9fa48("827"), [stryMutAct_9fa48("828") ? {} : (stryCov_9fa48("828"), {
      id: stryMutAct_9fa48("829") ? "" : (stryCov_9fa48("829"), '1'),
      title: stryMutAct_9fa48("830") ? "" : (stryCov_9fa48("830"), 'Wireless Bluetooth Headphones'),
      description: stryMutAct_9fa48("831") ? "" : (stryCov_9fa48("831"), 'Premium noise-cancelling headphones with 30-hour battery life and crystal-clear audio quality.'),
      price: 79.99,
      currency: stryMutAct_9fa48("832") ? "" : (stryCov_9fa48("832"), 'GBP'),
      image_url: stryMutAct_9fa48("833") ? "" : (stryCov_9fa48("833"), 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'),
      brand: stryMutAct_9fa48("834") ? "" : (stryCov_9fa48("834"), 'AudioTech'),
      rating: 4.8
    }), stryMutAct_9fa48("835") ? {} : (stryCov_9fa48("835"), {
      id: stryMutAct_9fa48("836") ? "" : (stryCov_9fa48("836"), '2'),
      title: stryMutAct_9fa48("837") ? "" : (stryCov_9fa48("837"), 'Artisan Coffee Blend Gift Set'),
      description: stryMutAct_9fa48("838") ? "" : (stryCov_9fa48("838"), 'A curated collection of premium coffee beans from around the world, perfect for coffee enthusiasts.'),
      price: 45.00,
      currency: stryMutAct_9fa48("839") ? "" : (stryCov_9fa48("839"), 'GBP'),
      image_url: stryMutAct_9fa48("840") ? "" : (stryCov_9fa48("840"), 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop'),
      brand: stryMutAct_9fa48("841") ? "" : (stryCov_9fa48("841"), 'RoastMaster'),
      rating: 4.9
    }), stryMutAct_9fa48("842") ? {} : (stryCov_9fa48("842"), {
      id: stryMutAct_9fa48("843") ? "" : (stryCov_9fa48("843"), '3'),
      title: stryMutAct_9fa48("844") ? "" : (stryCov_9fa48("844"), 'Smart Fitness Watch'),
      description: stryMutAct_9fa48("845") ? "" : (stryCov_9fa48("845"), 'Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring.'),
      price: 199.99,
      currency: stryMutAct_9fa48("846") ? "" : (stryCov_9fa48("846"), 'GBP'),
      image_url: stryMutAct_9fa48("847") ? "" : (stryCov_9fa48("847"), 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'),
      brand: stryMutAct_9fa48("848") ? "" : (stryCov_9fa48("848"), 'FitTech'),
      rating: 4.6
    }), stryMutAct_9fa48("849") ? {} : (stryCov_9fa48("849"), {
      id: stryMutAct_9fa48("850") ? "" : (stryCov_9fa48("850"), '4'),
      title: stryMutAct_9fa48("851") ? "" : (stryCov_9fa48("851"), 'Luxury Skincare Set'),
      description: stryMutAct_9fa48("852") ? "" : (stryCov_9fa48("852"), 'Pamper yourself or a loved one with this premium skincare collection featuring natural ingredients.'),
      price: 89.99,
      currency: stryMutAct_9fa48("853") ? "" : (stryCov_9fa48("853"), 'GBP'),
      image_url: stryMutAct_9fa48("854") ? "" : (stryCov_9fa48("854"), 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop'),
      brand: stryMutAct_9fa48("855") ? "" : (stryCov_9fa48("855"), 'GlowLux'),
      rating: 4.7
    }), stryMutAct_9fa48("856") ? {} : (stryCov_9fa48("856"), {
      id: stryMutAct_9fa48("857") ? "" : (stryCov_9fa48("857"), '5'),
      title: stryMutAct_9fa48("858") ? "" : (stryCov_9fa48("858"), 'Succulent Garden Kit'),
      description: stryMutAct_9fa48("859") ? "" : (stryCov_9fa48("859"), 'Everything you need to start your own beautiful succulent garden, including pots and soil.'),
      price: 32.50,
      currency: stryMutAct_9fa48("860") ? "" : (stryCov_9fa48("860"), 'GBP'),
      image_url: stryMutAct_9fa48("861") ? "" : (stryCov_9fa48("861"), 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop'),
      brand: stryMutAct_9fa48("862") ? "" : (stryCov_9fa48("862"), 'GreenThumb'),
      rating: 4.5
    })]);
  }
}

// ==============================================================================
// SERVER COMPONENT PAGE
// ==============================================================================

/**
 * Discover Page Server Component
 *
 * This is the main server component that:
 * 1. Fetches data server-side
 * 2. Checks authentication
 * 3. Renders the page structure
 * 4. Passes data to client components
 */
export default async function DiscoverPage() {
  if (stryMutAct_9fa48("863")) {
    {}
  } else {
    stryCov_9fa48("863");
    // Server-side data fetching
    const [isAuthenticated, products] = await Promise.all(stryMutAct_9fa48("864") ? [] : (stryCov_9fa48("864"), [getAuthenticationStatus(), getDiscoveryProducts()]));

    // Redirect if no products available (error state)
    if (stryMutAct_9fa48("867") ? !products && products.length === 0 : stryMutAct_9fa48("866") ? false : stryMutAct_9fa48("865") ? true : (stryCov_9fa48("865", "866", "867"), (stryMutAct_9fa48("868") ? products : (stryCov_9fa48("868"), !products)) || (stryMutAct_9fa48("870") ? products.length !== 0 : stryMutAct_9fa48("869") ? false : (stryCov_9fa48("869", "870"), products.length === 0)))) {
      if (stryMutAct_9fa48("871")) {
        {}
      } else {
        stryCov_9fa48("871");
        console.error(stryMutAct_9fa48("872") ? "" : (stryCov_9fa48("872"), 'No products available for discovery'));
        redirect(stryMutAct_9fa48("873") ? "" : (stryCov_9fa48("873"), '/'));
      }
    }
    return <div className="flex flex-col min-h-screen">
      {/* Guest Notice - Server-rendered with client interactivity */}
      {stryMutAct_9fa48("876") ? !isAuthenticated || <GuestNotice /> : stryMutAct_9fa48("875") ? false : stryMutAct_9fa48("874") ? true : (stryCov_9fa48("874", "875", "876"), (stryMutAct_9fa48("877") ? isAuthenticated : (stryCov_9fa48("877"), !isAuthenticated)) && <GuestNotice />)}

      {/* Main Discovery Interface - Client Component */}
      <div className="flex-1 relative">
        <DiscoverInterface initialProducts={products} isAuthenticated={isAuthenticated} sessionType="discovery" />
      </div>

      {/* Bottom Navigation Hint - Server Component */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            Use keyboard shortcuts:{stryMutAct_9fa48("878") ? "" : (stryCov_9fa48("878"), ' ')}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd> dislike,{stryMutAct_9fa48("879") ? "" : (stryCov_9fa48("879"), ' ')}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs mx-1">→</kbd> like,{stryMutAct_9fa48("880") ? "" : (stryCov_9fa48("880"), ' ')}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑</kbd> super like,{stryMutAct_9fa48("881") ? "" : (stryCov_9fa48("881"), ' ')}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">space</kbd> view product
          </p>
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
 * This page will be statically generated and revalidated every 5 minutes
 */
export const revalidate = 300; // 5 minutes

/**
 * Force dynamic rendering for authenticated content
 * This ensures user-specific content is handled correctly
 */
export const dynamic = stryMutAct_9fa48("882") ? "" : (stryCov_9fa48("882"), 'force-dynamic');