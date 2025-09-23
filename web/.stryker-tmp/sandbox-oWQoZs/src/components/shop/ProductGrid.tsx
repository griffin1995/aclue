/**
 * Product Grid - Server Component
 *
 * Reusable product grid component for displaying products in various layouts.
 * Server-rendered for optimal performance and SEO.
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
function formatPrice(price: number, currency: string = stryMutAct_9fa48("6025") ? "" : (stryCov_9fa48("6025"), 'GBP')): string {
  if (stryMutAct_9fa48("6026")) {
    {}
  } else {
    stryCov_9fa48("6026");
    return new Intl.NumberFormat(stryMutAct_9fa48("6027") ? "" : (stryCov_9fa48("6027"), 'en-GB'), stryMutAct_9fa48("6028") ? {} : (stryCov_9fa48("6028"), {
      style: stryMutAct_9fa48("6029") ? "" : (stryCov_9fa48("6029"), 'currency'),
      currency: currency
    })).format(price);
  }
}
export function ProductGrid({
  products,
  columns = stryMutAct_9fa48("6030") ? "" : (stryCov_9fa48("6030"), 'auto'),
  showDescription = stryMutAct_9fa48("6031") ? true : (stryCov_9fa48("6031"), false)
}: ProductGridProps) {
  if (stryMutAct_9fa48("6032")) {
    {}
  } else {
    stryCov_9fa48("6032");
    const getGridClasses = () => {
      if (stryMutAct_9fa48("6033")) {
        {}
      } else {
        stryCov_9fa48("6033");
        if (stryMutAct_9fa48("6036") ? columns !== 'auto' : stryMutAct_9fa48("6035") ? false : stryMutAct_9fa48("6034") ? true : (stryCov_9fa48("6034", "6035", "6036"), columns === (stryMutAct_9fa48("6037") ? "" : (stryCov_9fa48("6037"), 'auto')))) {
          if (stryMutAct_9fa48("6038")) {
            {}
          } else {
            stryCov_9fa48("6038");
            return stryMutAct_9fa48("6039") ? "" : (stryCov_9fa48("6039"), 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4');
          }
        }
        return stryMutAct_9fa48("6040") ? `` : (stryCov_9fa48("6040"), `grid-cols-1 sm:grid-cols-${stryMutAct_9fa48("6041") ? Math.max(columns, 2) : (stryCov_9fa48("6041"), Math.min(columns, 2))} lg:grid-cols-${columns}`);
      }
    };
    if (stryMutAct_9fa48("6044") ? products.length !== 0 : stryMutAct_9fa48("6043") ? false : stryMutAct_9fa48("6042") ? true : (stryCov_9fa48("6042", "6043", "6044"), products.length === 0)) {
      if (stryMutAct_9fa48("6045")) {
        {}
      } else {
        stryCov_9fa48("6045");
        return <div className="text-center py-12">
        <p className="text-gray-500">No products to display</p>
      </div>;
      }
    }
    return <div className={stryMutAct_9fa48("6046") ? `` : (stryCov_9fa48("6046"), `grid ${getGridClasses()} gap-6`)}>
      {products.map(product => {
        if (stryMutAct_9fa48("6047")) {
          {}
        } else {
          stryCov_9fa48("6047");
          const productName = stryMutAct_9fa48("6050") ? (product.title || product.name) && 'Product' : stryMutAct_9fa48("6049") ? false : stryMutAct_9fa48("6048") ? true : (stryCov_9fa48("6048", "6049", "6050"), (stryMutAct_9fa48("6052") ? product.title && product.name : stryMutAct_9fa48("6051") ? false : (stryCov_9fa48("6051", "6052"), product.title || product.name)) || (stryMutAct_9fa48("6053") ? "" : (stryCov_9fa48("6053"), 'Product')));
          return <Link key={product.id} href={stryMutAct_9fa48("6054") ? `` : (stryCov_9fa48("6054"), `/products/${product.id}`)} className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image src={product.image_url} alt={productName} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                  {productName}
                </h3>

                {stryMutAct_9fa48("6057") ? product.brand || <p className="text-sm text-gray-600 mb-2">{product.brand}</p> : stryMutAct_9fa48("6056") ? false : stryMutAct_9fa48("6055") ? true : (stryCov_9fa48("6055", "6056", "6057"), product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>)}

                {stryMutAct_9fa48("6060") ? showDescription && product.description || <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p> : stryMutAct_9fa48("6059") ? false : stryMutAct_9fa48("6058") ? true : (stryCov_9fa48("6058", "6059", "6060"), (stryMutAct_9fa48("6062") ? showDescription || product.description : stryMutAct_9fa48("6061") ? true : (stryCov_9fa48("6061", "6062"), showDescription && product.description)) && <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>)}

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price, product.currency)}
                  </span>

                  {stryMutAct_9fa48("6065") ? product.rating || <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {product.rating.toFixed(1)}
                      </span>
                    </div> : stryMutAct_9fa48("6064") ? false : stryMutAct_9fa48("6063") ? true : (stryCov_9fa48("6063", "6064", "6065"), product.rating && <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>)}
                </div>
              </div>
            </div>
          </Link>;
        }
      })}
    </div>;
  }
}