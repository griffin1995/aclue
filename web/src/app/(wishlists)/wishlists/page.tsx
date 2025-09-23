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

export const metadata: Metadata = {
  title: 'My Wishlists',
  description: 'Manage your wishlists, create new ones, and share with friends and family. Discover amazing gifts with AI-powered recommendations.',
  keywords: ['my wishlists', 'gift lists', 'wishlist management', 'share wishlists', 'AI recommendations'],
  openGraph: {
    title: 'My Wishlists | aclue',
    description: 'Manage and share your wishlists with AI-powered gift recommendations',
    type: 'website',
    locale: 'en_GB',
  },
  robots: {
    index: false,
    follow: false,
  },
};

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
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token');
    return !!accessToken?.value;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Get user's wishlists with fallback
 * Server-side data fetching with error handling
 */
async function getUserWishlists(): Promise<Wishlist[]> {
  try {
    const result = await getUserWishlistsAction();

    if (result.success && result.data) {
      return result.data;
    }

    console.error('Failed to fetch wishlists:', result.error);
    return [];
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    return [];
  }
}

/**
 * Calculate wishlist statistics
 */
function calculateWishlistStats(wishlists: Wishlist[]) {
  const totalWishlists = wishlists.length;
  const totalProducts = wishlists.reduce((sum, wishlist) => sum + wishlist.product_count, 0);
  const publicWishlists = wishlists.filter(w => w.is_public).length;
  const privateWishlists = totalWishlists - publicWishlists;

  return {
    totalWishlists,
    totalProducts,
    publicWishlists,
    privateWishlists,
  };
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
  // Server-side authentication check
  const isAuthenticated = await getAuthenticationStatus();

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    redirect('/auth/login?redirect=/wishlists');
  }

  // Server-side data fetching
  const wishlists = await getUserWishlists();
  const stats = calculateWishlistStats(wishlists);

  return (
    <div className="min-h-screen bg-white">
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
        {wishlists.length === 0 ? (
          <div className="text-center py-16">
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

              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Discover Products
              </Link>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}

        {/* Quick Actions - Server Component */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Discover More Amazing Products
            </h3>
            <p className="text-gray-600 mb-6">
              Explore our curated collection and add items to your wishlists
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Start Discovering
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// PERFORMANCE OPTIMIZATIONS
// ==============================================================================

/**
 * Enable static generation with ISR
 * This page will be dynamically rendered due to authentication requirements
 */
export const dynamic = 'force-dynamic';

/**
 * Revalidation for cached content
 */
export const revalidate = 300; // 5 minutes