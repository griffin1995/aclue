/**
 * Search Results - Server Component with Client Interactivity
 *
 * Displays search results in a grid layout with server-side rendering
 * and client-side interactions for optimal performance.
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
import Link from 'next/link';
import Image from 'next/image';
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
    id: string;
    name: string;
  };
  rating?: number;
  affiliate_url?: string;
  url?: string;
}
interface SearchResultsProps {
  products: Product[];
  totalResults: number;
  currentQuery: string;
  sortBy: string;
}
function formatPrice(price: number, currency: string = stryMutAct_9fa48("6297") ? "" : (stryCov_9fa48("6297"), 'GBP')): string {
  if (stryMutAct_9fa48("6298")) {
    {}
  } else {
    stryCov_9fa48("6298");
    return new Intl.NumberFormat(stryMutAct_9fa48("6299") ? "" : (stryCov_9fa48("6299"), 'en-GB'), stryMutAct_9fa48("6300") ? {} : (stryCov_9fa48("6300"), {
      style: stryMutAct_9fa48("6301") ? "" : (stryCov_9fa48("6301"), 'currency'),
      currency: currency
    })).format(price);
  }
}
export function SearchResults({
  products,
  totalResults,
  currentQuery,
  sortBy
}: SearchResultsProps) {
  if (stryMutAct_9fa48("6302")) {
    {}
  } else {
    stryCov_9fa48("6302");
    const getSortLabel = (sortBy: string) => {
      if (stryMutAct_9fa48("6303")) {
        {}
      } else {
        stryCov_9fa48("6303");
        switch (sortBy) {
          case stryMutAct_9fa48("6305") ? "" : (stryCov_9fa48("6305"), 'price_asc'):
            if (stryMutAct_9fa48("6304")) {} else {
              stryCov_9fa48("6304");
              return stryMutAct_9fa48("6306") ? "" : (stryCov_9fa48("6306"), 'Price: Low to High');
            }
          case stryMutAct_9fa48("6308") ? "" : (stryCov_9fa48("6308"), 'price_desc'):
            if (stryMutAct_9fa48("6307")) {} else {
              stryCov_9fa48("6307");
              return stryMutAct_9fa48("6309") ? "" : (stryCov_9fa48("6309"), 'Price: High to Low');
            }
          case stryMutAct_9fa48("6311") ? "" : (stryCov_9fa48("6311"), 'rating'):
            if (stryMutAct_9fa48("6310")) {} else {
              stryCov_9fa48("6310");
              return stryMutAct_9fa48("6312") ? "" : (stryCov_9fa48("6312"), 'Highest Rated');
            }
          default:
            if (stryMutAct_9fa48("6313")) {} else {
              stryCov_9fa48("6313");
              return stryMutAct_9fa48("6314") ? "" : (stryCov_9fa48("6314"), 'Relevance');
            }
        }
      }
    };
    return <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {currentQuery ? stryMutAct_9fa48("6315") ? `` : (stryCov_9fa48("6315"), `Results for "${currentQuery}"`) : stryMutAct_9fa48("6316") ? "" : (stryCov_9fa48("6316"), 'All Products')}
          </h2>
          <p className="text-sm text-gray-600">
            {totalResults} products found • Sorted by {getSortLabel(sortBy)}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => {
          if (stryMutAct_9fa48("6317")) {
            {}
          } else {
            stryCov_9fa48("6317");
            const productName = stryMutAct_9fa48("6320") ? (product.title || product.name) && 'Product' : stryMutAct_9fa48("6319") ? false : stryMutAct_9fa48("6318") ? true : (stryCov_9fa48("6318", "6319", "6320"), (stryMutAct_9fa48("6322") ? product.title && product.name : stryMutAct_9fa48("6321") ? false : (stryCov_9fa48("6321", "6322"), product.title || product.name)) || (stryMutAct_9fa48("6323") ? "" : (stryCov_9fa48("6323"), 'Product')));
            return <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
              {/* Product Image */}
              <Link href={stryMutAct_9fa48("6324") ? `` : (stryCov_9fa48("6324"), `/products/${product.id}`)} className="block">
                <div className="relative aspect-square bg-gray-100">
                  <Image src={product.image_url} alt={productName} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" />

                  {/* Category Badge */}
                  {stryMutAct_9fa48("6327") ? product.category || <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.category.name}
                      </span>
                    </div> : stryMutAct_9fa48("6326") ? false : stryMutAct_9fa48("6325") ? true : (stryCov_9fa48("6325", "6326", "6327"), product.category && <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.category.name}
                      </span>
                    </div>)}

                  {/* Quick View Button */}
                  {stryMutAct_9fa48("6330") ? product.affiliate_url || product.url || <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={product.affiliate_url || product.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-colors" title="View product">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div> : stryMutAct_9fa48("6329") ? false : stryMutAct_9fa48("6328") ? true : (stryCov_9fa48("6328", "6329", "6330"), (stryMutAct_9fa48("6332") ? product.affiliate_url && product.url : stryMutAct_9fa48("6331") ? true : (stryCov_9fa48("6331", "6332"), product.affiliate_url || product.url)) && <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={stryMutAct_9fa48("6335") ? product.affiliate_url && product.url : stryMutAct_9fa48("6334") ? false : stryMutAct_9fa48("6333") ? true : (stryCov_9fa48("6333", "6334", "6335"), product.affiliate_url || product.url)} target="_blank" rel="noopener noreferrer" onClick={stryMutAct_9fa48("6336") ? () => undefined : (stryCov_9fa48("6336"), e => e.stopPropagation())} className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-colors" title="View product">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>)}
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-4">
                <Link href={stryMutAct_9fa48("6337") ? `` : (stryCov_9fa48("6337"), `/products/${product.id}`)}>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                    {productName}
                  </h3>
                </Link>

                {stryMutAct_9fa48("6340") ? product.brand || <p className="text-sm text-gray-600 mb-2">{product.brand}</p> : stryMutAct_9fa48("6339") ? false : stryMutAct_9fa48("6338") ? true : (stryCov_9fa48("6338", "6339", "6340"), product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>)}

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price, product.currency)}
                  </span>

                  {stryMutAct_9fa48("6343") ? product.rating || <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {product.rating.toFixed(1)}
                      </span>
                    </div> : stryMutAct_9fa48("6342") ? false : stryMutAct_9fa48("6341") ? true : (stryCov_9fa48("6341", "6342", "6343"), product.rating && <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>)}
                </div>
              </div>
            </div>;
          }
        })}
      </div>

      {/* Load More / Pagination */}
      {stryMutAct_9fa48("6346") ? products.length >= 20 || <div className="text-center pt-8">
          <p className="text-sm text-gray-600 mb-4">
            Showing {products.length} of {totalResults} results
          </p>
          {/* Pagination could be implemented here */}
        </div> : stryMutAct_9fa48("6345") ? false : stryMutAct_9fa48("6344") ? true : (stryCov_9fa48("6344", "6345", "6346"), (stryMutAct_9fa48("6349") ? products.length < 20 : stryMutAct_9fa48("6348") ? products.length > 20 : stryMutAct_9fa48("6347") ? true : (stryCov_9fa48("6347", "6348", "6349"), products.length >= 20)) && <div className="text-center pt-8">
          <p className="text-sm text-gray-600 mb-4">
            Showing {products.length} of {totalResults} results
          </p>
          {/* Pagination could be implemented here */}
        </div>)}
    </div>;
  }
}