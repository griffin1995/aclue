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
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
export function WishlistStats({
  stats,
  className = stryMutAct_9fa48("8261") ? "Stryker was here!" : (stryCov_9fa48("8261"), '')
}: WishlistStatsProps) {
  if (stryMutAct_9fa48("8262")) {
    {}
  } else {
    stryCov_9fa48("8262");
    const statisticItems = stryMutAct_9fa48("8263") ? [] : (stryCov_9fa48("8263"), [stryMutAct_9fa48("8264") ? {} : (stryCov_9fa48("8264"), {
      icon: Heart,
      value: stats.totalWishlists,
      label: (stryMutAct_9fa48("8267") ? stats.totalWishlists !== 1 : stryMutAct_9fa48("8266") ? false : stryMutAct_9fa48("8265") ? true : (stryCov_9fa48("8265", "8266", "8267"), stats.totalWishlists === 1)) ? stryMutAct_9fa48("8268") ? "" : (stryCov_9fa48("8268"), 'Wishlist') : stryMutAct_9fa48("8269") ? "" : (stryCov_9fa48("8269"), 'Wishlists'),
      color: stryMutAct_9fa48("8270") ? "" : (stryCov_9fa48("8270"), 'text-primary-600'),
      bgColor: stryMutAct_9fa48("8271") ? "" : (stryCov_9fa48("8271"), 'bg-primary-100')
    }), stryMutAct_9fa48("8272") ? {} : (stryCov_9fa48("8272"), {
      icon: Package,
      value: stats.totalProducts,
      label: (stryMutAct_9fa48("8275") ? stats.totalProducts !== 1 : stryMutAct_9fa48("8274") ? false : stryMutAct_9fa48("8273") ? true : (stryCov_9fa48("8273", "8274", "8275"), stats.totalProducts === 1)) ? stryMutAct_9fa48("8276") ? "" : (stryCov_9fa48("8276"), 'Product') : stryMutAct_9fa48("8277") ? "" : (stryCov_9fa48("8277"), 'Products'),
      color: stryMutAct_9fa48("8278") ? "" : (stryCov_9fa48("8278"), 'text-blue-600'),
      bgColor: stryMutAct_9fa48("8279") ? "" : (stryCov_9fa48("8279"), 'bg-blue-100')
    }), stryMutAct_9fa48("8280") ? {} : (stryCov_9fa48("8280"), {
      icon: Users,
      value: stats.publicWishlists,
      label: (stryMutAct_9fa48("8283") ? stats.publicWishlists !== 1 : stryMutAct_9fa48("8282") ? false : stryMutAct_9fa48("8281") ? true : (stryCov_9fa48("8281", "8282", "8283"), stats.publicWishlists === 1)) ? stryMutAct_9fa48("8284") ? "" : (stryCov_9fa48("8284"), 'Public') : stryMutAct_9fa48("8285") ? "" : (stryCov_9fa48("8285"), 'Public'),
      color: stryMutAct_9fa48("8286") ? "" : (stryCov_9fa48("8286"), 'text-green-600'),
      bgColor: stryMutAct_9fa48("8287") ? "" : (stryCov_9fa48("8287"), 'bg-green-100')
    }), stryMutAct_9fa48("8288") ? {} : (stryCov_9fa48("8288"), {
      icon: Lock,
      value: stats.privateWishlists,
      label: (stryMutAct_9fa48("8291") ? stats.privateWishlists !== 1 : stryMutAct_9fa48("8290") ? false : stryMutAct_9fa48("8289") ? true : (stryCov_9fa48("8289", "8290", "8291"), stats.privateWishlists === 1)) ? stryMutAct_9fa48("8292") ? "" : (stryCov_9fa48("8292"), 'Private') : stryMutAct_9fa48("8293") ? "" : (stryCov_9fa48("8293"), 'Private'),
      color: stryMutAct_9fa48("8294") ? "" : (stryCov_9fa48("8294"), 'text-gray-600'),
      bgColor: stryMutAct_9fa48("8295") ? "" : (stryCov_9fa48("8295"), 'bg-gray-100')
    })]);
    return <div className={stryMutAct_9fa48("8296") ? `` : (stryCov_9fa48("8296"), `grid grid-cols-2 lg:grid-cols-4 gap-6 ${className}`)}>
      {statisticItems.map((item, index) => {
        if (stryMutAct_9fa48("8297")) {
          {}
        } else {
          stryCov_9fa48("8297");
          const Icon = item.icon;
          return <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className={stryMutAct_9fa48("8298") ? `` : (stryCov_9fa48("8298"), `${item.bgColor} rounded-full p-2 flex-shrink-0`)}>
                <Icon className={stryMutAct_9fa48("8299") ? `` : (stryCov_9fa48("8299"), `w-5 h-5 ${item.color}`)} />
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
          </div>;
        }
      })}
    </div>;
  }
}

// ==============================================================================
// EXPORTS
// ==============================================================================

export default WishlistStats;