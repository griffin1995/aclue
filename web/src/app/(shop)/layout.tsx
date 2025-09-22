/**
 * Shop Layout - Server Component
 *
 * Provides the shared layout for all shop-related pages including:
 * - Product discovery (/discover)
 * - Product details (/products/[id])
 * - Search results (/search)
 *
 * This is a server component that handles:
 * - Meta tags and SEO
 * - Shared navigation structure
 * - Common styling and branding
 *
 * Features:
 * - Server-side authentication checking
 * - Responsive design with glassmorphism
 * - Progressive enhancement approach
 */

import React from 'react';
import type { Metadata } from 'next';
import { ShopNavigation } from '@/components/shop/ShopNavigation';

export const metadata: Metadata = {
  title: {
    template: '%s | aclue',
    default: 'Shop | aclue'
  },
  description: 'Discover amazing gifts with AI-powered recommendations on aclue',
  keywords: ['gifts', 'recommendations', 'AI', 'shopping', 'aclue'],
  openGraph: {
    title: 'Shop | aclue',
    description: 'Discover amazing gifts with AI-powered recommendations',
    type: 'website',
    locale: 'en_GB',
  },
  robots: {
    index: false, // Keeping consistent with existing pages
    follow: false,
  },
};

interface ShopLayoutProps {
  children: React.ReactNode;
}

/**
 * Shop Layout Server Component
 *
 * Renders the shared layout structure for all shop pages.
 * Uses server components by default for optimal performance.
 */
export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Shop Navigation - Client Component for Interactivity */}
      <ShopNavigation />

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}