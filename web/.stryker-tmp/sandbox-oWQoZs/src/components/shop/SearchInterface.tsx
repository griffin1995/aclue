/**
 * Search Interface - Client Component
 *
 * Interactive search interface with real-time filtering and autocomplete.
 * Handles search input, filter controls, and URL state management.
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
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
interface SearchInterfaceProps {
  initialQuery: string;
  categories: string[];
  initialFilters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
  };
}
export function SearchInterface({
  initialQuery,
  categories,
  initialFilters
}: SearchInterfaceProps) {
  if (stryMutAct_9fa48("6262")) {
    {}
  } else {
    stryCov_9fa48("6262");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(initialQuery);
    const [isSearching, setIsSearching] = useState(stryMutAct_9fa48("6263") ? true : (stryCov_9fa48("6263"), false));
    const handleSearch = (searchQuery: string = query) => {
      if (stryMutAct_9fa48("6264")) {
        {}
      } else {
        stryCov_9fa48("6264");
        if (stryMutAct_9fa48("6267") ? false : stryMutAct_9fa48("6266") ? true : stryMutAct_9fa48("6265") ? searchQuery.trim() : (stryCov_9fa48("6265", "6266", "6267"), !(stryMutAct_9fa48("6268") ? searchQuery : (stryCov_9fa48("6268"), searchQuery.trim())))) return;
        setIsSearching(stryMutAct_9fa48("6269") ? false : (stryCov_9fa48("6269"), true));
        const params = new URLSearchParams(searchParams.toString());
        params.set(stryMutAct_9fa48("6270") ? "" : (stryCov_9fa48("6270"), 'q'), stryMutAct_9fa48("6271") ? searchQuery : (stryCov_9fa48("6271"), searchQuery.trim()));
        params.delete(stryMutAct_9fa48("6272") ? "" : (stryCov_9fa48("6272"), 'page')); // Reset to first page

        router.push(stryMutAct_9fa48("6273") ? `` : (stryCov_9fa48("6273"), `/search?${params.toString()}`));

        // Reset loading state after navigation
        setTimeout(stryMutAct_9fa48("6274") ? () => undefined : (stryCov_9fa48("6274"), () => setIsSearching(stryMutAct_9fa48("6275") ? true : (stryCov_9fa48("6275"), false))), 1000);
      }
    };
    const handleClearSearch = () => {
      if (stryMutAct_9fa48("6276")) {
        {}
      } else {
        stryCov_9fa48("6276");
        setQuery(stryMutAct_9fa48("6277") ? "Stryker was here!" : (stryCov_9fa48("6277"), ''));
        const params = new URLSearchParams(searchParams.toString());
        params.delete(stryMutAct_9fa48("6278") ? "" : (stryCov_9fa48("6278"), 'q'));
        params.delete(stryMutAct_9fa48("6279") ? "" : (stryCov_9fa48("6279"), 'page'));
        router.push(stryMutAct_9fa48("6280") ? `` : (stryCov_9fa48("6280"), `/search?${params.toString()}`));
      }
    };
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (stryMutAct_9fa48("6281")) {
        {}
      } else {
        stryCov_9fa48("6281");
        if (stryMutAct_9fa48("6284") ? e.key !== 'Enter' : stryMutAct_9fa48("6283") ? false : stryMutAct_9fa48("6282") ? true : (stryCov_9fa48("6282", "6283", "6284"), e.key === (stryMutAct_9fa48("6285") ? "" : (stryCov_9fa48("6285"), 'Enter')))) {
          if (stryMutAct_9fa48("6286")) {
            {}
          } else {
            stryCov_9fa48("6286");
            e.preventDefault();
            handleSearch();
          }
        }
      }
    };
    return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input type="text" value={query} onChange={stryMutAct_9fa48("6287") ? () => undefined : (stryCov_9fa48("6287"), e => setQuery(e.target.value))} onKeyPress={handleKeyPress} placeholder="Search for products, brands, or categories..." className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          {stryMutAct_9fa48("6290") ? query || <button onClick={handleClearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button> : stryMutAct_9fa48("6289") ? false : stryMutAct_9fa48("6288") ? true : (stryCov_9fa48("6288", "6289", "6290"), query && <button onClick={handleClearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>)}
        </div>

        {/* Search Button */}
        <button onClick={stryMutAct_9fa48("6291") ? () => undefined : (stryCov_9fa48("6291"), () => handleSearch())} disabled={stryMutAct_9fa48("6294") ? !query.trim() && isSearching : stryMutAct_9fa48("6293") ? false : stryMutAct_9fa48("6292") ? true : (stryCov_9fa48("6292", "6293", "6294"), (stryMutAct_9fa48("6295") ? query.trim() : (stryCov_9fa48("6295"), !(stryMutAct_9fa48("6296") ? query : (stryCov_9fa48("6296"), query.trim())))) || isSearching)} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
          {isSearching ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
          Search
        </button>
      </div>
    </div>;
  }
}