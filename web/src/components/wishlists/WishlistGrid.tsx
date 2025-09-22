/**
 * Wishlist Grid Component - Server Component with Client Interactions
 *
 * Displays user wishlists in a responsive grid layout.
 * Combines server-side rendering with client-side interactions.
 * 
 * Server Component Features:
 * - Initial wishlist data rendering
 * - SEO-friendly structure
 * - Optimal performance
 * 
 * Client Component Features:
 * - Interactive wishlist actions (edit, delete, share)
 * - Hover effects and animations
 * - Modal dialogs for actions
 */

import React from 'react';
import Link from 'next/link';
import { Heart, Users, Lock, Share2, MoreVertical, Calendar, Package } from 'lucide-react';
import { WishlistActions } from './WishlistActions';

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

interface WishlistGridProps {
  wishlists: Wishlist[];
  className?: string;
}

// ==============================================================================
// HELPER FUNCTIONS
// ==============================================================================

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    return 'Unknown date';
  }
}

/**
 * Generate wishlist URL
 */
function getWishlistUrl(wishlistId: string): string {
  return `/wishlists/${wishlistId}`;
}

// ==============================================================================
// WISHLIST CARD COMPONENT
// ==============================================================================

/**
 * Individual Wishlist Card - Server Component
 */
function WishlistCard({ wishlist }: { wishlist: Wishlist }) {
  const createdDate = formatDate(wishlist.created_at);
  const updatedDate = formatDate(wishlist.updated_at);
  const wishlistUrl = getWishlistUrl(wishlist.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <Link 
              href={wishlistUrl}
              className="block hover:text-primary-600 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600">
                {wishlist.name}
              </h3>
            </Link>
            
            {wishlist.description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {wishlist.description}
              </p>
            )}
          </div>

          {/* Actions Menu - Client Component */}
          <WishlistActions wishlist={wishlist} />
        </div>

        {/* Wishlist Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>{wishlist.product_count} {wishlist.product_count === 1 ? 'item' : 'items'}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            {wishlist.is_public ? (
              <>
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Public</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Private</span>
              </>
            )}
          </div>
        </div>

        {/* Date Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Created {createdDate}</span>
          </div>
          {wishlist.updated_at !== wishlist.created_at && (
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 flex items-center justify-center">•</span>
              <span>Updated {updatedDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="flex items-center justify-between">
          <Link
            href={wishlistUrl}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View Wishlist
          </Link>

          {wishlist.is_public && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Share2 className="w-3 h-3" />
              <span>Shareable</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// MAIN COMPONENT
// ==============================================================================

/**
 * WishlistGrid Server Component
 * 
 * Renders wishlists in a responsive grid layout.
 * Each wishlist is displayed as an interactive card.
 */
export function WishlistGrid({ wishlists, className = '' }: WishlistGridProps) {
  if (wishlists.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No wishlists yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first wishlist to start collecting your favourite items.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {wishlists.map((wishlist) => (
        <WishlistCard
          key={wishlist.id}
          wishlist={wishlist}
        />
      ))}
    </div>
  );
}

// ==============================================================================
// EXPORTS
// ==============================================================================

export default WishlistGrid;