/**
 * Product Card - Client Component
 *
 * Interactive product card component for the swipe interface.
 * Handles touch gestures, hover effects, and product display.
 */
// @ts-nocheck


'use client';

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
export function ProductCard({
  product,
  onSwipe,
  isLoading = stryMutAct_9fa48("5985") ? true : (stryCov_9fa48("5985"), false)
}: ProductCardProps) {
  if (stryMutAct_9fa48("5986")) {
    {}
  } else {
    stryCov_9fa48("5986");
    const formatPrice = (price: number, currency: string = stryMutAct_9fa48("5987") ? "" : (stryCov_9fa48("5987"), 'GBP')) => {
      if (stryMutAct_9fa48("5988")) {
        {}
      } else {
        stryCov_9fa48("5988");
        return new Intl.NumberFormat(stryMutAct_9fa48("5989") ? "" : (stryCov_9fa48("5989"), 'en-GB'), stryMutAct_9fa48("5990") ? {} : (stryCov_9fa48("5990"), {
          style: stryMutAct_9fa48("5991") ? "" : (stryCov_9fa48("5991"), 'currency'),
          currency: currency
        })).format(price);
      }
    };
    const productName = stryMutAct_9fa48("5994") ? (product.title || product.name) && 'Product' : stryMutAct_9fa48("5993") ? false : stryMutAct_9fa48("5992") ? true : (stryCov_9fa48("5992", "5993", "5994"), (stryMutAct_9fa48("5996") ? product.title && product.name : stryMutAct_9fa48("5995") ? false : (stryCov_9fa48("5995", "5996"), product.title || product.name)) || (stryMutAct_9fa48("5997") ? "" : (stryCov_9fa48("5997"), 'Product')));
    return <motion.div className={stryMutAct_9fa48("5998") ? `` : (stryCov_9fa48("5998"), `relative w-full h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden ${isLoading ? stryMutAct_9fa48("5999") ? "" : (stryCov_9fa48("5999"), 'pointer-events-none opacity-75') : stryMutAct_9fa48("6000") ? "Stryker was here!" : (stryCov_9fa48("6000"), '')}`)} whileHover={stryMutAct_9fa48("6001") ? {} : (stryCov_9fa48("6001"), {
      scale: 1.02
    })} transition={stryMutAct_9fa48("6002") ? {} : (stryCov_9fa48("6002"), {
      type: stryMutAct_9fa48("6003") ? "" : (stryCov_9fa48("6003"), 'spring'),
      stiffness: 300,
      damping: 30
    })}>
      {/* Product Image */}
      <div className="relative w-full h-2/3">
        <Image src={product.image_url} alt={productName} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Category Badge */}
        {stryMutAct_9fa48("6006") ? product.category || <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {product.category.name}
            </span>
          </div> : stryMutAct_9fa48("6005") ? false : stryMutAct_9fa48("6004") ? true : (stryCov_9fa48("6004", "6005", "6006"), product.category && <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {product.category.name}
            </span>
          </div>)}

        {/* Rating Badge */}
        {stryMutAct_9fa48("6009") ? product.rating || <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-800">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div> : stryMutAct_9fa48("6008") ? false : stryMutAct_9fa48("6007") ? true : (stryCov_9fa48("6007", "6008", "6009"), product.rating && <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-800">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>)}

        {/* External Link Button */}
        {stryMutAct_9fa48("6012") ? product.affiliate_url || product.url || <div className="absolute bottom-4 right-4">
            <a href={product.affiliate_url || product.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-colors" title="View product details">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div> : stryMutAct_9fa48("6011") ? false : stryMutAct_9fa48("6010") ? true : (stryCov_9fa48("6010", "6011", "6012"), (stryMutAct_9fa48("6014") ? product.affiliate_url && product.url : stryMutAct_9fa48("6013") ? true : (stryCov_9fa48("6013", "6014"), product.affiliate_url || product.url)) && <div className="absolute bottom-4 right-4">
            <a href={stryMutAct_9fa48("6017") ? product.affiliate_url && product.url : stryMutAct_9fa48("6016") ? false : stryMutAct_9fa48("6015") ? true : (stryCov_9fa48("6015", "6016", "6017"), product.affiliate_url || product.url)} target="_blank" rel="noopener noreferrer" onClick={stryMutAct_9fa48("6018") ? () => undefined : (stryCov_9fa48("6018"), e => e.stopPropagation())} className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-colors" title="View product details">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>)}
      </div>

      {/* Product Information */}
      <div className="p-6 h-1/3 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                {productName}
              </h3>
              {stryMutAct_9fa48("6021") ? product.brand || <p className="text-sm text-gray-600 mb-2">{product.brand}</p> : stryMutAct_9fa48("6020") ? false : stryMutAct_9fa48("6019") ? true : (stryCov_9fa48("6019", "6020", "6021"), product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>)}
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
      {stryMutAct_9fa48("6024") ? isLoading || <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div> : stryMutAct_9fa48("6023") ? false : stryMutAct_9fa48("6022") ? true : (stryCov_9fa48("6022", "6023", "6024"), isLoading && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>)}
    </motion.div>;
  }
}