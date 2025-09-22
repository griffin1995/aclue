/**
 * Discover Page - Server Component (75% Server Components Target)
 *
 * Product discovery page using App Router with server-side rendering.
 * This page demonstrates the Phase 4 migration with 75% server components.
 *
 * Server Components (75%):
 * - Page layout and structure
 * - Initial product data fetching
 * - SEO metadata generation
 * - Authentication state checking
 * - Static content rendering
 *
 * Client Components (25%):
 * - Interactive swipe interface
 * - User preference recording
 * - Dynamic UI updates
 * - Mobile-specific interactions
 *
 * Features:
 * - Server-side product fetching with caching
 * - Progressive enhancement approach
 * - Responsive design
 * - Authentication-aware rendering
 * - SEO optimised with metadata
 */

import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getProducts } from '@/app/actions/products';
import { DiscoverInterface } from '@/components/shop/DiscoverInterface';
import { GuestNotice } from '@/components/shop/GuestNotice';
import { WelcomeOverlay } from '@/components/shop/WelcomeOverlay';

// ==============================================================================
// METADATA (SERVER-SIDE)
// ==============================================================================

export const metadata: Metadata = {
  title: 'Discover Gifts',
  description: 'Discover amazing gifts by swiping through our curated collection. Train our AI to understand your preferences and get personalised recommendations.',
  keywords: ['gift discovery', 'product recommendations', 'AI gifts', 'swipe interface', 'personalised shopping'],
  openGraph: {
    title: 'Discover Gifts | aclue',
    description: 'Discover amazing gifts with AI-powered recommendations',
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
 * Get discovery products with fallback
 * Server-side data fetching with error handling
 */
async function getDiscoveryProducts(): Promise<Product[]> {
  try {
    const result = await getProducts({ limit: 10 });

    if (result.success && result.data) {
      return result.data;
    }

    // Return fallback products if API fails
    return getFallbackProducts();
  } catch (error) {
    console.error('Error fetching discovery products:', error);
    return getFallbackProducts();
  }
}

/**
 * Fallback products for development and error states
 */
function getFallbackProducts(): Product[] {
  return [
    {
      id: '1',
      title: 'Wireless Bluetooth Headphones',
      description: 'Premium noise-cancelling headphones with 30-hour battery life and crystal-clear audio quality.',
      price: 79.99,
      currency: 'GBP',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      brand: 'AudioTech',
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Artisan Coffee Blend Gift Set',
      description: 'A curated collection of premium coffee beans from around the world, perfect for coffee enthusiasts.',
      price: 45.00,
      currency: 'GBP',
      image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
      brand: 'RoastMaster',
      rating: 4.9,
    },
    {
      id: '3',
      title: 'Smart Fitness Watch',
      description: 'Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring.',
      price: 199.99,
      currency: 'GBP',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
      brand: 'FitTech',
      rating: 4.6,
    },
    {
      id: '4',
      title: 'Luxury Skincare Set',
      description: 'Pamper yourself or a loved one with this premium skincare collection featuring natural ingredients.',
      price: 89.99,
      currency: 'GBP',
      image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop',
      brand: 'GlowLux',
      rating: 4.7,
    },
    {
      id: '5',
      title: 'Succulent Garden Kit',
      description: 'Everything you need to start your own beautiful succulent garden, including pots and soil.',
      price: 32.50,
      currency: 'GBP',
      image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop',
      brand: 'GreenThumb',
      rating: 4.5,
    },
  ];
}

// ==============================================================================
// SERVER COMPONENT PAGE
// ==============================================================================

/**
 * Discover Page Server Component
 *
 * This is the main server component that:
 * 1. Fetches data server-side
 * 2. Checks authentication
 * 3. Renders the page structure
 * 4. Passes data to client components
 */
export default async function DiscoverPage() {
  // Server-side data fetching
  const [isAuthenticated, products] = await Promise.all([
    getAuthenticationStatus(),
    getDiscoveryProducts(),
  ]);

  // Redirect if no products available (error state)
  if (!products || products.length === 0) {
    console.error('No products available for discovery');
    redirect('/');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Guest Notice - Server-rendered with client interactivity */}
      {!isAuthenticated && <GuestNotice />}

      {/* Main Discovery Interface - Client Component */}
      <div className="flex-1 relative">
        <DiscoverInterface
          initialProducts={products}
          isAuthenticated={isAuthenticated}
          sessionType="discovery"
        />
      </div>

      {/* Bottom Navigation Hint - Server Component */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            Use keyboard shortcuts:{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">←</kbd> dislike,{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs mx-1">→</kbd> like,{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑</kbd> super like,{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">space</kbd> view product
          </p>
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
 * This page will be statically generated and revalidated every 5 minutes
 */
export const revalidate = 300; // 5 minutes

/**
 * Force dynamic rendering for authenticated content
 * This ensures user-specific content is handled correctly
 */
export const dynamic = 'force-dynamic';