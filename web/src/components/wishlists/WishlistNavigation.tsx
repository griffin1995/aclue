/**
 * Wishlist Navigation - Client Component
 *
 * Navigation component for wishlist sections with user-friendly links
 * and breadcrumb functionality for the Amazon affiliate wishlist system.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ArrowLeft, Grid3X3, Plus } from 'lucide-react';

export function WishlistNavigation() {
  const pathname = usePathname();

  // Determine if we're on a specific wishlist page
  const isWishlistDetail = pathname.includes('/wishlists/') && pathname !== '/wishlists';
  const isCreatePage = pathname.includes('/create');
  const isEditPage = pathname.includes('/edit');
  const isSharePage = pathname.includes('/share');

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Back/Navigation */}
          <div className="flex items-center gap-6">
            {isWishlistDetail ? (
              <Link
                href="/wishlists"
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Wishlists</span>
              </Link>
            ) : (
              <Link
                href="/wishlists"
                className="flex items-center gap-2 text-gray-900 font-semibold"
              >
                <Heart className="w-6 h-6 text-primary-600" />
                <span>Wishlists</span>
              </Link>
            )}
          </div>

          {/* Center - Breadcrumb for detail pages */}
          {isWishlistDetail && !isCreatePage && (
            <div className="hidden md:flex items-center text-sm text-gray-600">
              <Link href="/wishlists" className="hover:text-primary-600">
                My Wishlists
              </Link>
              <span className="mx-2">/</span>
              {isEditPage ? (
                <>
                  <span>Edit Wishlist</span>
                </>
              ) : isSharePage ? (
                <>
                  <span>Share Wishlist</span>
                </>
              ) : (
                <>
                  <span>Wishlist Details</span>
                </>
              )}
            </div>
          )}

          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            {!isCreatePage && !isEditPage && (
              <>
                <Link
                  href="/discover"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Discover</span>
                </Link>

                {pathname === '/wishlists' && (
                  <Link
                    href="/wishlists/create"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Wishlist</span>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}