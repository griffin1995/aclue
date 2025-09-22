/**
 * Product Detail Page - Server Component
 *
 * Individual product detail page with server-side rendering.
 * This demonstrates 75% server components with client-side interactivity.
 *
 * Server Components:
 * - Product data fetching
 * - SEO metadata generation
 * - Static product information
 * - Structured data for search engines
 * - Related products server-side rendering
 *
 * Client Components:
 * - Add to cart functionality
 * - Wishlist toggle
 * - Image gallery interactions
 * - Social sharing
 */

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getProductById, getProducts } from '@/app/actions/products';
import { ProductImageGallery } from '@/components/shop/ProductImageGallery';
import { ProductActions } from '@/components/shop/ProductActions';
import { RelatedProducts } from '@/components/shop/RelatedProducts';
import { ProductReviews } from '@/components/shop/ProductReviews';
import { BreadcrumbNavigation } from '@/components/shop/BreadcrumbNavigation';
import { Star, Award, Shield, Truck } from 'lucide-react';

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
  original_price?: number;
  image_url: string;
  images?: string[];
  brand?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  rating?: number;
  review_count?: number;
  affiliate_url?: string;
  url?: string;
  features?: string[];
  specifications?: Record<string, string>;
  is_featured?: boolean;
  is_trending?: boolean;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  availability?: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

// ==============================================================================
// METADATA GENERATION (SERVER-SIDE)
// ==============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const result = await getProductById(params.id);

    if (!result.success || !result.data) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    const product: Product = result.data;
    const productName = product.title || product.name || 'Product';

    return {
      title: `${productName} | aclue`,
      description: product.description || `Discover ${productName} and more amazing gifts with AI-powered recommendations on aclue.`,
      keywords: [
        productName,
        product.brand,
        product.category?.name,
        'gifts',
        'shopping',
        'aclue'
      ].filter(Boolean),
      openGraph: {
        title: `${productName} | aclue`,
        description: product.description,
        images: [
          {
            url: product.image_url,
            width: 1200,
            height: 630,
            alt: productName,
          },
        ],
        type: 'product',
        locale: 'en_GB',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productName} | aclue`,
        description: product.description,
        images: [product.image_url],
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | aclue',
      description: 'Discover amazing gifts with AI-powered recommendations.',
    };
  }
}

// ==============================================================================
// SERVER HELPER FUNCTIONS
// ==============================================================================

/**
 * Check authentication status server-side
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
 * Get related products based on category
 */
async function getRelatedProducts(product: Product): Promise<Product[]> {
  try {
    if (!product.category?.name) return [];

    const result = await getProducts({
      category: product.category.name,
      limit: 4,
    });

    if (result.success && result.data) {
      // Filter out the current product
      return result.data.filter((p: Product) => p.id !== product.id).slice(0, 4);
    }

    return [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

/**
 * Format price with currency
 */
function formatPrice(price: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

/**
 * Calculate discount percentage
 */
function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// ==============================================================================
// MAIN PAGE COMPONENT (SERVER)
// ==============================================================================

export default async function ProductDetailPage({ params }: PageProps) {
  // Server-side data fetching
  const [productResult, isAuthenticated] = await Promise.all([
    getProductById(params.id),
    getAuthenticationStatus(),
  ]);

  // Handle product not found
  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const product: Product = productResult.data;
  const productName = product.title || product.name || 'Product';

  // Get related products
  const relatedProducts = await getRelatedProducts(product);

  // Prepare product images
  const productImages = product.images || [product.image_url];

  // Calculate discount if applicable
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount
    ? calculateDiscount(product.original_price!, product.price)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <BreadcrumbNavigation
            items={[
              { label: 'Discover', href: '/discover' },
              ...(product.category
                ? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
                : []
              ),
              { label: productName, href: '' },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images - Client Component for Gallery Interactions */}
          <div className="space-y-4">
            <ProductImageGallery
              images={productImages}
              productName={productName}
            />
          </div>

          {/* Product Information - Server Component */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
              )}

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {productName}
              </h1>

              {/* Rating and Reviews */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating!)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {product.rating.toFixed(1)}
                  </span>
                  {product.review_count && (
                    <span className="text-sm text-gray-600">
                      ({product.review_count} reviews)
                    </span>
                  )}
                </div>
              )}

              {/* Product Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.is_featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Featured
                  </span>
                )}
                {product.is_trending && (
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    🔥 Trending
                  </span>
                )}
                {product.stock_status === 'low_stock' && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    Low Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.original_price!, product.currency)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {discountPercentage}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Product Actions - Client Component */}
            <ProductActions
              product={product}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <RelatedProducts
              products={relatedProducts}
              currentProductId={product.id}
            />
          </div>
        )}
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: productName,
            description: product.description,
            brand: {
              '@type': 'Brand',
              name: product.brand || 'aclue',
            },
            image: productImages,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: product.currency || 'GBP',
              availability: product.stock_status === 'in_stock'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
            ...(product.rating && {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.review_count || 1,
              },
            }),
          }),
        }}
      />
    </div>
  );
}

// ==============================================================================
// PERFORMANCE OPTIMIZATIONS
// ==============================================================================

/**
 * Enable static generation for better performance
 */
export const revalidate = 600; // 10 minutes

/**
 * Generate static params for popular products
 */
export async function generateStaticParams() {
  try {
    const result = await getProducts({ limit: 10 });

    if (result.success && result.data) {
      return result.data.map((product: Product) => ({
        id: product.id,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}