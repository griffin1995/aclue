/**
 * Product Grid - Server Component
 *
 * Reusable product grid component for displaying products in various layouts.
 * Server-rendered for optimal performance and SEO.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  name?: string;
  description?: string;
  price: number;
  currency?: string;
  image_url: string;
  brand?: string;
  rating?: number;
}

interface ProductGridProps {
  products: Product[];
  columns?: 'auto' | 2 | 3 | 4;
  showDescription?: boolean;
}

function formatPrice(price: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

export function ProductGrid({
  products,
  columns = 'auto',
  showDescription = false
}: ProductGridProps) {
  const getGridClasses = () => {
    if (columns === 'auto') {
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
    return `grid-cols-1 sm:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products to display</p>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridClasses()} gap-6`}>
      {products.map((product) => {
        const productName = product.title || product.name || 'Product';

        return (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.image_url}
                  alt={productName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                  {productName}
                </h3>

                {product.brand && (
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                )}

                {showDescription && product.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                )}

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
          </Link>
        );
      })}
    </div>
  );
}