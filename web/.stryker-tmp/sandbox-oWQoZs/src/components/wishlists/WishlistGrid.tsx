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
  if (stryMutAct_9fa48("8194")) {
    {}
  } else {
    stryCov_9fa48("8194");
    try {
      if (stryMutAct_9fa48("8195")) {
        {}
      } else {
        stryCov_9fa48("8195");
        const date = new Date(dateString);
        return date.toLocaleDateString(stryMutAct_9fa48("8196") ? "" : (stryCov_9fa48("8196"), 'en-GB'), stryMutAct_9fa48("8197") ? {} : (stryCov_9fa48("8197"), {
          day: stryMutAct_9fa48("8198") ? "" : (stryCov_9fa48("8198"), 'numeric'),
          month: stryMutAct_9fa48("8199") ? "" : (stryCov_9fa48("8199"), 'short'),
          year: stryMutAct_9fa48("8200") ? "" : (stryCov_9fa48("8200"), 'numeric')
        }));
      }
    } catch (error) {
      if (stryMutAct_9fa48("8201")) {
        {}
      } else {
        stryCov_9fa48("8201");
        return stryMutAct_9fa48("8202") ? "" : (stryCov_9fa48("8202"), 'Unknown date');
      }
    }
  }
}

/**
 * Generate wishlist URL
 */
function getWishlistUrl(wishlistId: string): string {
  if (stryMutAct_9fa48("8203")) {
    {}
  } else {
    stryCov_9fa48("8203");
    return stryMutAct_9fa48("8204") ? `` : (stryCov_9fa48("8204"), `/wishlists/${wishlistId}`);
  }
}

// ==============================================================================
// WISHLIST CARD COMPONENT
// ==============================================================================

/**
 * Individual Wishlist Card - Server Component
 */
function WishlistCard({
  wishlist
}: {
  wishlist: Wishlist;
}) {
  if (stryMutAct_9fa48("8205")) {
    {}
  } else {
    stryCov_9fa48("8205");
    const createdDate = formatDate(wishlist.created_at);
    const updatedDate = formatDate(wishlist.updated_at);
    const wishlistUrl = getWishlistUrl(wishlist.id);
    return <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <Link href={wishlistUrl} className="block hover:text-primary-600 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600">
                {wishlist.name}
              </h3>
            </Link>
            
            {stryMutAct_9fa48("8208") ? wishlist.description || <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {wishlist.description}
              </p> : stryMutAct_9fa48("8207") ? false : stryMutAct_9fa48("8206") ? true : (stryCov_9fa48("8206", "8207", "8208"), wishlist.description && <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {wishlist.description}
              </p>)}
          </div>

          {/* Actions Menu - Client Component */}
          <WishlistActions wishlist={wishlist} />
        </div>

        {/* Wishlist Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>{wishlist.product_count} {(stryMutAct_9fa48("8211") ? wishlist.product_count !== 1 : stryMutAct_9fa48("8210") ? false : stryMutAct_9fa48("8209") ? true : (stryCov_9fa48("8209", "8210", "8211"), wishlist.product_count === 1)) ? stryMutAct_9fa48("8212") ? "" : (stryCov_9fa48("8212"), 'item') : stryMutAct_9fa48("8213") ? "" : (stryCov_9fa48("8213"), 'items')}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            {wishlist.is_public ? <>
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Public</span>
              </> : <>
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Private</span>
              </>}
          </div>
        </div>

        {/* Date Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Created {createdDate}</span>
          </div>
          {stryMutAct_9fa48("8216") ? wishlist.updated_at !== wishlist.created_at || <div className="flex items-center gap-1">
              <span className="w-3 h-3 flex items-center justify-center">•</span>
              <span>Updated {updatedDate}</span>
            </div> : stryMutAct_9fa48("8215") ? false : stryMutAct_9fa48("8214") ? true : (stryCov_9fa48("8214", "8215", "8216"), (stryMutAct_9fa48("8218") ? wishlist.updated_at === wishlist.created_at : stryMutAct_9fa48("8217") ? true : (stryCov_9fa48("8217", "8218"), wishlist.updated_at !== wishlist.created_at)) && <div className="flex items-center gap-1">
              <span className="w-3 h-3 flex items-center justify-center">•</span>
              <span>Updated {updatedDate}</span>
            </div>)}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="flex items-center justify-between">
          <Link href={wishlistUrl} className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
            View Wishlist
          </Link>

          {stryMutAct_9fa48("8221") ? wishlist.is_public || <div className="flex items-center gap-1 text-xs text-gray-500">
              <Share2 className="w-3 h-3" />
              <span>Shareable</span>
            </div> : stryMutAct_9fa48("8220") ? false : stryMutAct_9fa48("8219") ? true : (stryCov_9fa48("8219", "8220", "8221"), wishlist.is_public && <div className="flex items-center gap-1 text-xs text-gray-500">
              <Share2 className="w-3 h-3" />
              <span>Shareable</span>
            </div>)}
        </div>
      </div>
    </div>;
  }
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
export function WishlistGrid({
  wishlists,
  className = stryMutAct_9fa48("8222") ? "Stryker was here!" : (stryCov_9fa48("8222"), '')
}: WishlistGridProps) {
  if (stryMutAct_9fa48("8223")) {
    {}
  } else {
    stryCov_9fa48("8223");
    if (stryMutAct_9fa48("8226") ? wishlists.length !== 0 : stryMutAct_9fa48("8225") ? false : stryMutAct_9fa48("8224") ? true : (stryCov_9fa48("8224", "8225", "8226"), wishlists.length === 0)) {
      if (stryMutAct_9fa48("8227")) {
        {}
      } else {
        stryCov_9fa48("8227");
        return <div className={stryMutAct_9fa48("8228") ? `` : (stryCov_9fa48("8228"), `text-center py-12 ${className}`)}>
        <div className="bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Heart className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No wishlists yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first wishlist to start collecting your favourite items.
        </p>
      </div>;
      }
    }
    return <div className={stryMutAct_9fa48("8229") ? `` : (stryCov_9fa48("8229"), `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`)}>
      {wishlists.map(stryMutAct_9fa48("8230") ? () => undefined : (stryCov_9fa48("8230"), wishlist => <WishlistCard key={wishlist.id} wishlist={wishlist} />))}
    </div>;
  }
}

// ==============================================================================
// EXPORTS
// ==============================================================================

export default WishlistGrid;