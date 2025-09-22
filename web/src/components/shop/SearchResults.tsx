/**
 * Search Results - Server Component with Client Interactivity
 *
 * Displays search results in a grid layout with server-side rendering
 * and client-side interactions for optimal performance.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    id: string;
    name: string;
  };
  rating?: number;
  affiliate_url?: string;
  url?: string;
}

interface SearchResultsProps {
  products: Product[];
  totalResults: number;
  currentQuery: string;
  sortBy: string;
}

function formatPrice(price: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

export function SearchResults({ products, totalResults, currentQuery, sortBy }: SearchResultsProps) {
  const getSortLabel = (sortBy: string) => {
    switch (sortBy) {
      case 'price_asc': return 'Price: Low to High';
      case 'price_desc': return 'Price: High to Low';
      case 'rating': return 'Highest Rated';
      default: return 'Relevance';
    }
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentQuery ? `Results for "${currentQuery}"` : 'All Products'}
          </h2>
          <p className="text-sm text-gray-600">
            {totalResults} products found • Sorted by {getSortLabel(sortBy)}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const productName = product.title || product.name || 'Product';

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Product Image */}
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={product.image_url}
                    alt={productName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />

                  {/* Category Badge */}
                  {product.category && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.category.name}
                      </span>
                    </div>
                  )}

                  {/* Quick View Button */}
                  {(product.affiliate_url || product.url) && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={product.affiliate_url || product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-colors"
                        title="View product"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                    {productName}
                  </h3>
                </Link>

                {product.brand && (
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                )}

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price, product.currency)}
                  </span>

                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More / Pagination */}
      {products.length >= 20 && (
        <div className="text-center pt-8">
          <p className="text-sm text-gray-600 mb-4">
            Showing {products.length} of {totalResults} results
          </p>
          {/* Pagination could be implemented here */}
        </div>
      )}
    </div>
  );
}