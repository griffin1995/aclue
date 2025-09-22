/**
 * Wishlist Statistics Component - Server Component
 *
 * Displays user wishlist statistics in a clean, informative layout.
 * Shows total wishlists, products, and public/private breakdown.
 * 
 * Server Component Features:
 * - No client-side JavaScript required
 * - SEO-friendly rendering
 * - Fast initial page load
 * - Optimal for static statistics display
 */

import React from 'react';
import { Heart, Users, Lock, Package } from 'lucide-react';

// ==============================================================================
// TYPES
// ==============================================================================

interface WishlistStatsData {
  totalWishlists: number;
  totalProducts: number;
  publicWishlists: number;
  privateWishlists: number;
}

interface WishlistStatsProps {
  stats: WishlistStatsData;
  className?: string;
}

// ==============================================================================
// COMPONENT
// ==============================================================================

/**
 * WishlistStats Server Component
 * 
 * Renders wishlist statistics in an attractive grid layout.
 * Each statistic is displayed with an icon, number, and label.
 */
export function WishlistStats({ stats, className = '' }: WishlistStatsProps) {
  const statisticItems = [
    {
      icon: Heart,
      value: stats.totalWishlists,
      label: stats.totalWishlists === 1 ? 'Wishlist' : 'Wishlists',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      icon: Package,
      value: stats.totalProducts,
      label: stats.totalProducts === 1 ? 'Product' : 'Products',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Users,
      value: stats.publicWishlists,
      label: stats.publicWishlists === 1 ? 'Public' : 'Public',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Lock,
      value: stats.privateWishlists,
      label: stats.privateWishlists === 1 ? 'Private' : 'Private',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {statisticItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className={`${item.bgColor} rounded-full p-2 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-2xl font-bold text-white">
                  {item.value.toLocaleString()}
                </div>
                <div className="text-sm text-primary-100 truncate">
                  {item.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==============================================================================
// EXPORTS
// ==============================================================================

export default WishlistStats;