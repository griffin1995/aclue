/**
 * Product Actions - Client Component
 *
 * Interactive product action buttons for cart, wishlist, and sharing.
 * Handles user authentication and provides feedback for all actions.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Share2, ExternalLink, Plus } from 'lucide-react';
import { toggleWishlistAction } from '@/app/actions/products';
import { generateAffiliateLink, isValidAmazonUrl } from '@/lib/affiliate';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  name?: string;
  price: number;
  currency?: string;
  affiliate_url?: string;
  url?: string;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface ProductActionsProps {
  product: Product;
  isAuthenticated: boolean;
}

export function ProductActions({ product, isAuthenticated }: ProductActionsProps) {
  const router = useRouter();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false); // This would normally come from props

  const productName = product.title || product.name || 'Product';

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save items to wishlist');
      router.push(`/auth/login?redirect=/products/${product.id}`);
      return;
    }

    await handleToggleWishlist();
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save items to wishlist');
      router.push(`/auth/login?redirect=/products/${product.id}`);
      return;
    }

    setIsTogglingWishlist(true);

    try {
      const result = await toggleWishlistAction(product.id);

      if (result.success) {
        setIsInWishlist(result.added || false);
        toast.success(result.message || 'Wishlist updated!');
      } else {
        toast.error(result.error || 'Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist. Please try again.');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: productName,
      text: `Check out this product: ${productName}`,
      url: window.location.href,
    };

    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          await fallbackShare();
        }
      }
    } else {
      await fallbackShare();
    }
  };

  const fallbackShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link. Please try again.');
    }
  };

  const handleViewOnAmazon = () => {
    const productUrl = product.affiliate_url || product.url;

    if (!productUrl) {
      toast.error('Amazon link not available for this product');
      return;
    }

    // Generate affiliate tracking for revenue
    if (isValidAmazonUrl(productUrl)) {
      const affiliateUrl = generateAffiliateLink(productUrl, {
        campaign: 'wishlist_redirect',
        medium: 'view_on_amazon_button',
        source: 'product_page',
      });

      // Track the affiliate click for analytics
      console.log('Amazon affiliate click tracked:', {
        productId: product.id,
        productName,
        affiliateUrl,
        timestamp: new Date().toISOString()
      });

      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      toast.success('Redirecting to Amazon...');
    } else {
      window.open(productUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatPrice = (price: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Price Display */}
      <div className="border-t border-gray-200 pt-6">
        <div className="text-3xl font-bold text-gray-900">
          {formatPrice(product.price, product.currency)}
        </div>
      </div>

      {/* Product Availability Status */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-sm font-medium text-blue-700">
          Available on Amazon
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Primary Action: View on Amazon */}
        {(product.affiliate_url || product.url) && (
          <button
            onClick={handleViewOnAmazon}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#ff9900] text-white rounded-lg hover:bg-[#e88800] font-medium transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Buy on Amazon
          </button>
        )}

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Add to Wishlist Button */}
          <button
            onClick={handleAddToWishlist}
            disabled={isTogglingWishlist}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              isInWishlist
                ? 'border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } disabled:opacity-50`}
          >
            {isTogglingWishlist ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isInWishlist ? (
              <Heart className="w-4 h-4 fill-current" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Authentication Prompt */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <strong>Sign in</strong> to save items to wishlists, share with friends, and get personalised recommendations.
          </p>
          <div className="mt-2 space-x-3">
            <button
              onClick={() => router.push(`/auth/login?redirect=/products/${product.id}`)}
              className="text-sm font-medium text-blue-800 underline hover:no-underline"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push(`/auth/register?redirect=/products/${product.id}`)}
              className="text-sm font-medium text-blue-800 underline hover:no-underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}