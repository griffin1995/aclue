/**
 * Search Page - Server Component
 *
 * Product search page with server-side rendering and client-side interactivity.
 * Demonstrates 75% server components with enhanced search functionality.
 *
 * Server Components:
 * - Initial search results fetching
 * - SEO metadata generation
 * - Filter options rendering
 * - Pagination handling
 *
 * Client Components:
 * - Search input with autocomplete
 * - Real-time filtering
 * - Sorting controls
 * - Load more functionality
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
import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { searchProducts } from '@/app/actions/products';
import { SearchInterface } from '@/components/shop/SearchInterface';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { SearchFilters } from '@/components/shop/SearchFilters';
import { SearchResults } from '@/components/shop/SearchResults';
import { Search, Filter } from 'lucide-react';

// ==============================================================================
// METADATA
// ==============================================================================

export const metadata: Metadata = stryMutAct_9fa48("1127") ? {} : (stryCov_9fa48("1127"), {
  title: stryMutAct_9fa48("1128") ? "" : (stryCov_9fa48("1128"), 'Search Products'),
  description: stryMutAct_9fa48("1129") ? "" : (stryCov_9fa48("1129"), 'Search through our curated collection of gifts and products. Find the perfect item with our AI-powered search and filtering.'),
  keywords: stryMutAct_9fa48("1130") ? [] : (stryCov_9fa48("1130"), [stryMutAct_9fa48("1131") ? "" : (stryCov_9fa48("1131"), 'search'), stryMutAct_9fa48("1132") ? "" : (stryCov_9fa48("1132"), 'products'), stryMutAct_9fa48("1133") ? "" : (stryCov_9fa48("1133"), 'gifts'), stryMutAct_9fa48("1134") ? "" : (stryCov_9fa48("1134"), 'shopping'), stryMutAct_9fa48("1135") ? "" : (stryCov_9fa48("1135"), 'find'), stryMutAct_9fa48("1136") ? "" : (stryCov_9fa48("1136"), 'aclue')]),
  openGraph: stryMutAct_9fa48("1137") ? {} : (stryCov_9fa48("1137"), {
    title: stryMutAct_9fa48("1138") ? "" : (stryCov_9fa48("1138"), 'Search Products | aclue'),
    description: stryMutAct_9fa48("1139") ? "" : (stryCov_9fa48("1139"), 'Search through our curated collection of gifts and products'),
    type: stryMutAct_9fa48("1140") ? "" : (stryCov_9fa48("1140"), 'website'),
    locale: stryMutAct_9fa48("1141") ? "" : (stryCov_9fa48("1141"), 'en_GB')
  }),
  robots: stryMutAct_9fa48("1142") ? {} : (stryCov_9fa48("1142"), {
    index: stryMutAct_9fa48("1143") ? true : (stryCov_9fa48("1143"), false),
    follow: stryMutAct_9fa48("1144") ? true : (stryCov_9fa48("1144"), false)
  })
});

// ==============================================================================
// TYPES
// ==============================================================================

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating';
    page?: string;
  };
}
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

// ==============================================================================
// SERVER HELPER FUNCTIONS
// ==============================================================================

/**
 * Get search results with server-side processing
 */
async function getSearchResults(searchParams: SearchPageProps['searchParams']) {
  if (stryMutAct_9fa48("1145")) {
    {}
  } else {
    stryCov_9fa48("1145");
    try {
      if (stryMutAct_9fa48("1146")) {
        {}
      } else {
        stryCov_9fa48("1146");
        const {
          q: query = stryMutAct_9fa48("1147") ? "Stryker was here!" : (stryCov_9fa48("1147"), ''),
          category = stryMutAct_9fa48("1148") ? "Stryker was here!" : (stryCov_9fa48("1148"), ''),
          minPrice,
          maxPrice,
          sortBy = stryMutAct_9fa48("1149") ? "" : (stryCov_9fa48("1149"), 'relevance'),
          page = stryMutAct_9fa48("1150") ? "" : (stryCov_9fa48("1150"), '1')
        } = searchParams;
        const searchOptions = stryMutAct_9fa48("1151") ? {} : (stryCov_9fa48("1151"), {
          query,
          category,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          sortBy,
          page: parseInt(page, 10),
          limit: 20
        });
        const result = await searchProducts(searchOptions);
        return stryMutAct_9fa48("1152") ? {} : (stryCov_9fa48("1152"), {
          products: result.success ? result.data : stryMutAct_9fa48("1153") ? ["Stryker was here"] : (stryCov_9fa48("1153"), []),
          error: result.success ? null : result.error,
          totalResults: result.success ? stryMutAct_9fa48("1156") ? result.data?.length && 0 : stryMutAct_9fa48("1155") ? false : stryMutAct_9fa48("1154") ? true : (stryCov_9fa48("1154", "1155", "1156"), (stryMutAct_9fa48("1157") ? result.data.length : (stryCov_9fa48("1157"), result.data?.length)) || 0) : 0
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("1158")) {
        {}
      } else {
        stryCov_9fa48("1158");
        console.error(stryMutAct_9fa48("1159") ? "" : (stryCov_9fa48("1159"), 'Error getting search results:'), error);
        return stryMutAct_9fa48("1160") ? {} : (stryCov_9fa48("1160"), {
          products: stryMutAct_9fa48("1161") ? ["Stryker was here"] : (stryCov_9fa48("1161"), []),
          error: stryMutAct_9fa48("1162") ? "" : (stryCov_9fa48("1162"), 'Failed to load search results'),
          totalResults: 0
        });
      }
    }
  }
}

/**
 * Get available categories for filtering
 */
function getAvailableCategories(): string[] {
  if (stryMutAct_9fa48("1163")) {
    {}
  } else {
    stryCov_9fa48("1163");
    // In a real implementation, this would fetch from the backend
    return stryMutAct_9fa48("1164") ? [] : (stryCov_9fa48("1164"), [stryMutAct_9fa48("1165") ? "" : (stryCov_9fa48("1165"), 'Electronics'), stryMutAct_9fa48("1166") ? "" : (stryCov_9fa48("1166"), 'Fashion'), stryMutAct_9fa48("1167") ? "" : (stryCov_9fa48("1167"), 'Home & Garden'), stryMutAct_9fa48("1168") ? "" : (stryCov_9fa48("1168"), 'Books'), stryMutAct_9fa48("1169") ? "" : (stryCov_9fa48("1169"), 'Sports'), stryMutAct_9fa48("1170") ? "" : (stryCov_9fa48("1170"), 'Beauty'), stryMutAct_9fa48("1171") ? "" : (stryCov_9fa48("1171"), 'Toys'), stryMutAct_9fa48("1172") ? "" : (stryCov_9fa48("1172"), 'Food & Drink'), stryMutAct_9fa48("1173") ? "" : (stryCov_9fa48("1173"), 'Health'), stryMutAct_9fa48("1174") ? "" : (stryCov_9fa48("1174"), 'Automotive')]);
  }
}

// ==============================================================================
// LOADING COMPONENTS
// ==============================================================================

function SearchResultsSkeleton() {
  if (stryMutAct_9fa48("1175")) {
    {}
  } else {
    stryCov_9fa48("1175");
    return <div className="space-y-6">
      {/* Results header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(stryMutAct_9fa48("1176") ? [] : (stryCov_9fa48("1176"), [...(stryMutAct_9fa48("1177") ? Array() : (stryCov_9fa48("1177"), Array(8)))])).map(stryMutAct_9fa48("1178") ? () => undefined : (stryCov_9fa48("1178"), (_, i) => <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
            </div>
          </div>))}
      </div>
    </div>;
  }
}

// ==============================================================================
// MAIN PAGE COMPONENT
// ==============================================================================

export default async function SearchPage({
  searchParams
}: SearchPageProps) {
  if (stryMutAct_9fa48("1179")) {
    {}
  } else {
    stryCov_9fa48("1179");
    // Server-side data fetching
    const [searchResults, categories] = await Promise.all(stryMutAct_9fa48("1180") ? [] : (stryCov_9fa48("1180"), [getSearchResults(searchParams), getAvailableCategories()]));
    const {
      products,
      error,
      totalResults
    } = searchResults;
    const currentQuery = stryMutAct_9fa48("1183") ? searchParams.q && '' : stryMutAct_9fa48("1182") ? false : stryMutAct_9fa48("1181") ? true : (stryCov_9fa48("1181", "1182", "1183"), searchParams.q || (stryMutAct_9fa48("1184") ? "Stryker was here!" : (stryCov_9fa48("1184"), '')));
    const hasActiveFilters = stryMutAct_9fa48("1185") ? !(searchParams.category || searchParams.minPrice || searchParams.maxPrice || searchParams.sortBy && searchParams.sortBy !== 'relevance') : (stryCov_9fa48("1185"), !(stryMutAct_9fa48("1186") ? searchParams.category || searchParams.minPrice || searchParams.maxPrice || searchParams.sortBy && searchParams.sortBy !== 'relevance' : (stryCov_9fa48("1186"), !(stryMutAct_9fa48("1189") ? (searchParams.category || searchParams.minPrice || searchParams.maxPrice) && searchParams.sortBy && searchParams.sortBy !== 'relevance' : stryMutAct_9fa48("1188") ? false : stryMutAct_9fa48("1187") ? true : (stryCov_9fa48("1187", "1188", "1189"), (stryMutAct_9fa48("1191") ? (searchParams.category || searchParams.minPrice) && searchParams.maxPrice : stryMutAct_9fa48("1190") ? false : (stryCov_9fa48("1190", "1191"), (stryMutAct_9fa48("1193") ? searchParams.category && searchParams.minPrice : stryMutAct_9fa48("1192") ? false : (stryCov_9fa48("1192", "1193"), searchParams.category || searchParams.minPrice)) || searchParams.maxPrice)) || (stryMutAct_9fa48("1195") ? searchParams.sortBy || searchParams.sortBy !== 'relevance' : stryMutAct_9fa48("1194") ? false : (stryCov_9fa48("1194", "1195"), searchParams.sortBy && (stryMutAct_9fa48("1197") ? searchParams.sortBy === 'relevance' : stryMutAct_9fa48("1196") ? true : (stryCov_9fa48("1196", "1197"), searchParams.sortBy !== (stryMutAct_9fa48("1198") ? "" : (stryCov_9fa48("1198"), 'relevance')))))))))));
    return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Search Products
            </h1>
          </div>

          <p className="text-gray-600">
            {currentQuery ? stryMutAct_9fa48("1199") ? `` : (stryCov_9fa48("1199"), `Search results for "${currentQuery}"`) : stryMutAct_9fa48("1200") ? "" : (stryCov_9fa48("1200"), 'Discover products from our curated collection')}
          </p>
        </div>

        {/* Search Interface - Client Component */}
        <div className="mb-8">
          <SearchInterface initialQuery={currentQuery} categories={categories} initialFilters={stryMutAct_9fa48("1201") ? {} : (stryCov_9fa48("1201"), {
            category: searchParams.category,
            minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
            maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
            sortBy: searchParams.sortBy
          })} />
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Server Component */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {stryMutAct_9fa48("1204") ? hasActiveFilters || <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                    Active
                  </span> : stryMutAct_9fa48("1203") ? false : stryMutAct_9fa48("1202") ? true : (stryCov_9fa48("1202", "1203", "1204"), hasActiveFilters && <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                    Active
                  </span>)}
              </div>

              <SearchFilters categories={categories} activeFilters={stryMutAct_9fa48("1205") ? {} : (stryCov_9fa48("1205"), {
                category: searchParams.category,
                minPrice: searchParams.minPrice,
                maxPrice: searchParams.maxPrice,
                sortBy: searchParams.sortBy
              })} />
            </div>
          </div>

          {/* Main Results - Server Component with Client Interactivity */}
          <div className="lg:col-span-3">
            <Suspense fallback={<SearchResultsSkeleton />}>
              {error ? <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Search Error
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button onClick={stryMutAct_9fa48("1206") ? () => undefined : (stryCov_9fa48("1206"), () => window.location.reload())} className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                    Try Again
                  </button>
                </div> : (stryMutAct_9fa48("1209") ? products.length !== 0 : stryMutAct_9fa48("1208") ? false : stryMutAct_9fa48("1207") ? true : (stryCov_9fa48("1207", "1208", "1209"), products.length === 0)) ? <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentQuery ? stryMutAct_9fa48("1210") ? "" : (stryCov_9fa48("1210"), 'No results found') : stryMutAct_9fa48("1211") ? "" : (stryCov_9fa48("1211"), 'Start your search')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {currentQuery ? stryMutAct_9fa48("1212") ? `` : (stryCov_9fa48("1212"), `No products found for "${currentQuery}". Try different keywords or adjust your filters.`) : stryMutAct_9fa48("1213") ? "" : (stryCov_9fa48("1213"), 'Enter a search term above to find products in our collection.')}
                  </p>
                  {stryMutAct_9fa48("1216") ? hasActiveFilters || <button onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('category');
                  url.searchParams.delete('minPrice');
                  url.searchParams.delete('maxPrice');
                  url.searchParams.delete('sortBy');
                  window.location.href = url.toString();
                }} className="text-primary-600 hover:text-primary-700 font-medium">
                      Clear all filters
                    </button> : stryMutAct_9fa48("1215") ? false : stryMutAct_9fa48("1214") ? true : (stryCov_9fa48("1214", "1215", "1216"), hasActiveFilters && <button onClick={() => {
                  if (stryMutAct_9fa48("1217")) {
                    {}
                  } else {
                    stryCov_9fa48("1217");
                    const url = new URL(window.location.href);
                    url.searchParams.delete(stryMutAct_9fa48("1218") ? "" : (stryCov_9fa48("1218"), 'category'));
                    url.searchParams.delete(stryMutAct_9fa48("1219") ? "" : (stryCov_9fa48("1219"), 'minPrice'));
                    url.searchParams.delete(stryMutAct_9fa48("1220") ? "" : (stryCov_9fa48("1220"), 'maxPrice'));
                    url.searchParams.delete(stryMutAct_9fa48("1221") ? "" : (stryCov_9fa48("1221"), 'sortBy'));
                    window.location.href = url.toString();
                  }
                }} className="text-primary-600 hover:text-primary-700 font-medium">
                      Clear all filters
                    </button>)}
                </div> : <SearchResults products={products} totalResults={totalResults} currentQuery={currentQuery} sortBy={stryMutAct_9fa48("1224") ? searchParams.sortBy && 'relevance' : stryMutAct_9fa48("1223") ? false : stryMutAct_9fa48("1222") ? true : (stryCov_9fa48("1222", "1223", "1224"), searchParams.sortBy || (stryMutAct_9fa48("1225") ? "" : (stryCov_9fa48("1225"), 'relevance')))} />}
            </Suspense>
          </div>
        </div>
      </div>
    </div>;
  }
}

// ==============================================================================
// PERFORMANCE OPTIMIZATIONS
// ==============================================================================

/**
 * Enable static generation with ISR for common search terms
 */
export const revalidate = 300; // 5 minutes

/**
 * Force dynamic rendering for search results
 */
export const dynamic = stryMutAct_9fa48("1226") ? "" : (stryCov_9fa48("1226"), 'force-dynamic');