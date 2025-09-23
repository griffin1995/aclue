/**
 * Related Products - Server Component
 *
 * Displays related products based on category or recommendations.
 * Server-rendered for better performance and SEO.
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
  price: number;
  currency?: string;
  image_url: string;
  brand?: string;
  rating?: number;
}
interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}
function formatPrice(price: number, currency: string = stryMutAct_9fa48("6177") ? "" : (stryCov_9fa48("6177"), 'GBP')): string {
  if (stryMutAct_9fa48("6178")) {
    {}
  } else {
    stryCov_9fa48("6178");
    return new Intl.NumberFormat(stryMutAct_9fa48("6179") ? "" : (stryCov_9fa48("6179"), 'en-GB'), stryMutAct_9fa48("6180") ? {} : (stryCov_9fa48("6180"), {
      style: stryMutAct_9fa48("6181") ? "" : (stryCov_9fa48("6181"), 'currency'),
      currency: currency
    })).format(price);
  }
}
export function RelatedProducts({
  products,
  currentProductId
}: RelatedProductsProps) {
  if (stryMutAct_9fa48("6182")) {
    {}
  } else {
    stryCov_9fa48("6182");
    if (stryMutAct_9fa48("6185") ? products.length !== 0 : stryMutAct_9fa48("6184") ? false : stryMutAct_9fa48("6183") ? true : (stryCov_9fa48("6183", "6184", "6185"), products.length === 0)) {
      if (stryMutAct_9fa48("6186")) {
        {}
      } else {
        stryCov_9fa48("6186");
        return null;
      }
    }
    return <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Related Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => {
          if (stryMutAct_9fa48("6187")) {
            {}
          } else {
            stryCov_9fa48("6187");
            const productName = stryMutAct_9fa48("6190") ? (product.title || product.name) && 'Product' : stryMutAct_9fa48("6189") ? false : stryMutAct_9fa48("6188") ? true : (stryCov_9fa48("6188", "6189", "6190"), (stryMutAct_9fa48("6192") ? product.title && product.name : stryMutAct_9fa48("6191") ? false : (stryCov_9fa48("6191", "6192"), product.title || product.name)) || (stryMutAct_9fa48("6193") ? "" : (stryCov_9fa48("6193"), 'Product')));
            return <Link key={product.id} href={stryMutAct_9fa48("6194") ? `` : (stryCov_9fa48("6194"), `/products/${product.id}`)} className="group">
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

                  {stryMutAct_9fa48("6197") ? product.brand || <p className="text-sm text-gray-600 mb-2">{product.brand}</p> : stryMutAct_9fa48("6196") ? false : stryMutAct_9fa48("6195") ? true : (stryCov_9fa48("6195", "6196", "6197"), product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>)}

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price, product.currency)}
                    </span>

                    {stryMutAct_9fa48("6200") ? product.rating || <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {product.rating.toFixed(1)}
                        </span>
                      </div> : stryMutAct_9fa48("6199") ? false : stryMutAct_9fa48("6198") ? true : (stryCov_9fa48("6198", "6199", "6200"), product.rating && <div className="flex items-center gap-1">
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
      </div>
    </div>;
  }
}