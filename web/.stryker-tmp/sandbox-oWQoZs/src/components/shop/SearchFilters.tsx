/**
 * Search Filters - Client Component
 *
 * Filter controls for search results including category, price range, and sorting.
 * Manages URL state and provides immediate feedback.
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
import { useRouter, useSearchParams } from 'next/navigation';
interface SearchFiltersProps {
  categories: string[];
  activeFilters: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
  };
}
export function SearchFilters({
  categories,
  activeFilters
}: SearchFiltersProps) {
  if (stryMutAct_9fa48("6201")) {
    {}
  } else {
    stryCov_9fa48("6201");
    const router = useRouter();
    const searchParams = useSearchParams();
    const updateFilter = (key: string, value: string | undefined) => {
      if (stryMutAct_9fa48("6202")) {
        {}
      } else {
        stryCov_9fa48("6202");
        const params = new URLSearchParams(searchParams.toString());
        if (stryMutAct_9fa48("6205") ? value || value !== '' : stryMutAct_9fa48("6204") ? false : stryMutAct_9fa48("6203") ? true : (stryCov_9fa48("6203", "6204", "6205"), value && (stryMutAct_9fa48("6207") ? value === '' : stryMutAct_9fa48("6206") ? true : (stryCov_9fa48("6206", "6207"), value !== (stryMutAct_9fa48("6208") ? "Stryker was here!" : (stryCov_9fa48("6208"), '')))))) {
          if (stryMutAct_9fa48("6209")) {
            {}
          } else {
            stryCov_9fa48("6209");
            params.set(key, value);
          }
        } else {
          if (stryMutAct_9fa48("6210")) {
            {}
          } else {
            stryCov_9fa48("6210");
            params.delete(key);
          }
        }
        params.delete(stryMutAct_9fa48("6211") ? "" : (stryCov_9fa48("6211"), 'page')); // Reset pagination
        router.push(stryMutAct_9fa48("6212") ? `` : (stryCov_9fa48("6212"), `/search?${params.toString()}`));
      }
    };
    const clearAllFilters = () => {
      if (stryMutAct_9fa48("6213")) {
        {}
      } else {
        stryCov_9fa48("6213");
        const params = new URLSearchParams(searchParams.toString());
        params.delete(stryMutAct_9fa48("6214") ? "" : (stryCov_9fa48("6214"), 'category'));
        params.delete(stryMutAct_9fa48("6215") ? "" : (stryCov_9fa48("6215"), 'minPrice'));
        params.delete(stryMutAct_9fa48("6216") ? "" : (stryCov_9fa48("6216"), 'maxPrice'));
        params.delete(stryMutAct_9fa48("6217") ? "" : (stryCov_9fa48("6217"), 'sortBy'));
        params.delete(stryMutAct_9fa48("6218") ? "" : (stryCov_9fa48("6218"), 'page'));
        router.push(stryMutAct_9fa48("6219") ? `` : (stryCov_9fa48("6219"), `/search?${params.toString()}`));
      }
    };
    const hasActiveFilters = stryMutAct_9fa48("6220") ? !(activeFilters.category || activeFilters.minPrice || activeFilters.maxPrice || activeFilters.sortBy && activeFilters.sortBy !== 'relevance') : (stryCov_9fa48("6220"), !(stryMutAct_9fa48("6221") ? activeFilters.category || activeFilters.minPrice || activeFilters.maxPrice || activeFilters.sortBy && activeFilters.sortBy !== 'relevance' : (stryCov_9fa48("6221"), !(stryMutAct_9fa48("6224") ? (activeFilters.category || activeFilters.minPrice || activeFilters.maxPrice) && activeFilters.sortBy && activeFilters.sortBy !== 'relevance' : stryMutAct_9fa48("6223") ? false : stryMutAct_9fa48("6222") ? true : (stryCov_9fa48("6222", "6223", "6224"), (stryMutAct_9fa48("6226") ? (activeFilters.category || activeFilters.minPrice) && activeFilters.maxPrice : stryMutAct_9fa48("6225") ? false : (stryCov_9fa48("6225", "6226"), (stryMutAct_9fa48("6228") ? activeFilters.category && activeFilters.minPrice : stryMutAct_9fa48("6227") ? false : (stryCov_9fa48("6227", "6228"), activeFilters.category || activeFilters.minPrice)) || activeFilters.maxPrice)) || (stryMutAct_9fa48("6230") ? activeFilters.sortBy || activeFilters.sortBy !== 'relevance' : stryMutAct_9fa48("6229") ? false : (stryCov_9fa48("6229", "6230"), activeFilters.sortBy && (stryMutAct_9fa48("6232") ? activeFilters.sortBy === 'relevance' : stryMutAct_9fa48("6231") ? true : (stryCov_9fa48("6231", "6232"), activeFilters.sortBy !== (stryMutAct_9fa48("6233") ? "" : (stryCov_9fa48("6233"), 'relevance')))))))))));
    return <div className="space-y-6">
      {/* Clear All Filters */}
      {stryMutAct_9fa48("6236") ? hasActiveFilters || <button onClick={clearAllFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Clear all filters
        </button> : stryMutAct_9fa48("6235") ? false : stryMutAct_9fa48("6234") ? true : (stryCov_9fa48("6234", "6235", "6236"), hasActiveFilters && <button onClick={clearAllFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Clear all filters
        </button>)}

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select value={stryMutAct_9fa48("6239") ? activeFilters.category && '' : stryMutAct_9fa48("6238") ? false : stryMutAct_9fa48("6237") ? true : (stryCov_9fa48("6237", "6238", "6239"), activeFilters.category || (stryMutAct_9fa48("6240") ? "Stryker was here!" : (stryCov_9fa48("6240"), '')))} onChange={stryMutAct_9fa48("6241") ? () => undefined : (stryCov_9fa48("6241"), e => updateFilter(stryMutAct_9fa48("6242") ? "" : (stryCov_9fa48("6242"), 'category'), e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
          <option value="">All Categories</option>
          {categories.map(stryMutAct_9fa48("6243") ? () => undefined : (stryCov_9fa48("6243"), category => <option key={category} value={category}>
              {category}
            </option>))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <input type="number" placeholder="Min price" value={stryMutAct_9fa48("6246") ? activeFilters.minPrice && '' : stryMutAct_9fa48("6245") ? false : stryMutAct_9fa48("6244") ? true : (stryCov_9fa48("6244", "6245", "6246"), activeFilters.minPrice || (stryMutAct_9fa48("6247") ? "Stryker was here!" : (stryCov_9fa48("6247"), '')))} onChange={stryMutAct_9fa48("6248") ? () => undefined : (stryCov_9fa48("6248"), e => updateFilter(stryMutAct_9fa48("6249") ? "" : (stryCov_9fa48("6249"), 'minPrice'), e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" />
          <input type="number" placeholder="Max price" value={stryMutAct_9fa48("6252") ? activeFilters.maxPrice && '' : stryMutAct_9fa48("6251") ? false : stryMutAct_9fa48("6250") ? true : (stryCov_9fa48("6250", "6251", "6252"), activeFilters.maxPrice || (stryMutAct_9fa48("6253") ? "Stryker was here!" : (stryCov_9fa48("6253"), '')))} onChange={stryMutAct_9fa48("6254") ? () => undefined : (stryCov_9fa48("6254"), e => updateFilter(stryMutAct_9fa48("6255") ? "" : (stryCov_9fa48("6255"), 'maxPrice'), e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm" />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select value={stryMutAct_9fa48("6258") ? activeFilters.sortBy && 'relevance' : stryMutAct_9fa48("6257") ? false : stryMutAct_9fa48("6256") ? true : (stryCov_9fa48("6256", "6257", "6258"), activeFilters.sortBy || (stryMutAct_9fa48("6259") ? "" : (stryCov_9fa48("6259"), 'relevance')))} onChange={stryMutAct_9fa48("6260") ? () => undefined : (stryCov_9fa48("6260"), e => updateFilter(stryMutAct_9fa48("6261") ? "" : (stryCov_9fa48("6261"), 'sortBy'), e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>;
  }
}