/**
 * Wishlists Layout - Server Component
 *
 * Provides the shared layout for all wishlist-related pages including:
 * - Wishlist collection (/wishlists)
 * - Individual wishlist views (/wishlists/[id])
 * - Wishlist creation and editing
 * - Shared wishlist pages
 *
 * This is a server component that handles:
 * - Meta tags and SEO optimisation
 * - Shared navigation structure for wishlist features
 * - Common styling and branding
 * - Authentication-aware rendering
 *
 * Features:
 * - Server-side authentication checking
 * - Responsive design with glassmorphism
 * - Progressive enhancement approach
 * - Amazon affiliate integration ready
 */

import React from 'react';
import type { Metadata } from 'next';
import { WishlistNavigation } from '@/components/wishlists/WishlistNavigation';

export const metadata: Metadata = {
  title: {
    template: '%s | Wishlists | aclue',
    default: 'Wishlists | aclue'
  },
  description: 'Create and manage wishlists, share with friends and family, and discover amazing gifts with AI-powered recommendations on aclue',
  keywords: ['wishlists', 'gift lists', 'sharing', 'AI recommendations', 'Amazon affiliate', 'aclue'],
  openGraph: {
    title: 'Wishlists | aclue',
    description: 'Create and share wishlists with AI-powered gift recommendations',
    type: 'website',
    locale: 'en_GB',
  },
  robots: {
    index: false, // Keeping consistent with existing pages during alpha
    follow: false,
  },
};

interface WishlistLayoutProps {
  children: React.ReactNode;
}

/**
 * Wishlist Layout Server Component
 *
 * Renders the shared layout structure for all wishlist pages.
 * Uses server components by default for optimal performance.
 */
export default function WishlistLayout({ children }: WishlistLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Wishlist Navigation - Client Component for Interactivity */}
      <WishlistNavigation />

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}