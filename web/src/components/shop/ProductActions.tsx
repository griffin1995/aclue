/**
 * Product Actions - Client Component
 *
 * Interactive product action buttons for cart, wishlist, and sharing.
 * Handles user authentication and provides feedback for all actions.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Share2, ExternalLink } from 'lucide-react';
import { addToCartAction, toggleWishlistAction } from '@/app/actions/products';
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false); // This would normally come from props

  const productName = product.title || product.name || 'Product';
  const isOutOfStock = product.stock_status === 'out_of_stock';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      router.push(`/auth/login?redirect=/products/${product.id}`);
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    setIsAddingToCart(true);

    try {
      const result = await addToCartAction({
        productId: product.id,
        quantity: 1,
      });

      if (result.success) {
        toast.success(result.message || 'Added to cart!');
      } else {
        toast.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
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

  const handleViewProduct = () => {
    const productUrl = product.affiliate_url || product.url;

    if (!productUrl) {
      toast.error('Product link not available');
      return;
    }

    // Track click and open link
    if (isValidAmazonUrl(productUrl)) {
      const affiliateUrl = generateAffiliateLink(productUrl, {
        campaign: 'product_detail',
        medium: 'view_product_button',
        source: 'product_page',
      });
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
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

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            product.stock_status === 'in_stock'
              ? 'bg-green-500'
              : product.stock_status === 'low_stock'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
        />
        <span
          className={`text-sm font-medium ${
            product.stock_status === 'in_stock'
              ? 'text-green-700'
              : product.stock_status === 'low_stock'
              ? 'text-yellow-700'
              : 'text-red-700'
          }`}
        >
          {product.stock_status === 'in_stock'
            ? 'In Stock'
            : product.stock_status === 'low_stock'
            ? 'Low Stock'
            : 'Out of Stock'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
          }`}
        >
          {isAddingToCart ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShoppingBag className="w-5 h-5" />
          )}
          {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              isInWishlist
                ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } disabled:opacity-50`}
          >
            {isTogglingWishlist ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            )}
            <span className="hidden sm:inline">
              {isInWishlist ? 'Saved' : 'Save'}
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

        {/* View Product Button */}
        {(product.affiliate_url || product.url) && (
          <button
            onClick={handleViewProduct}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            {isValidAmazonUrl(product.affiliate_url || product.url || '')
              ? 'View on Amazon'
              : 'View Product'}
          </button>
        )}
      </div>

      {/* Authentication Prompt */}
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-amber-800">
            <strong>Sign in</strong> to add items to cart, save to wishlist, and get personalised recommendations.
          </p>
          <div className="mt-2 space-x-3">
            <button
              onClick={() => router.push(`/auth/login?redirect=/products/${product.id}`)}
              className="text-sm font-medium text-amber-800 underline hover:no-underline"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push(`/auth/register?redirect=/products/${product.id}`)}
              className="text-sm font-medium text-amber-800 underline hover:no-underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}