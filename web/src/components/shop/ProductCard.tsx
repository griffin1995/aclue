/**
 * Product Card - Client Component
 *
 * Interactive product card component for the swipe interface.
 * Handles touch gestures, hover effects, and product display.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  isLoading?: boolean;
}

export function ProductCard({ product, onSwipe, isLoading = false }: ProductCardProps) {
  const formatPrice = (price: number, currency: string = 'GBP') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const productName = product.title || product.name || 'Product';

  return (
    <motion.div
      className={`relative w-full h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden ${
        isLoading ? 'pointer-events-none opacity-75' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Product Image */}
      <div className="relative w-full h-2/3">
        <Image
          src={product.image_url}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-800">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* External Link Button */}
        {(product.affiliate_url || product.url) && (
          <div className="absolute bottom-4 right-4">
            <a
              href={product.affiliate_url || product.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-colors"
              title="View product details"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-6 h-1/3 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                {productName}
              </h3>
              {product.brand && (
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
              )}
            </div>
            <div className="text-right ml-4">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price, product.currency)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Swipe Indicators */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
          <span>← Dislike</span>
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <span>↑ Super</span>
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <span>Like →</span>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}