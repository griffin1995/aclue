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

export const metadata: Metadata = {
  title: 'Search Products',
  description: 'Search through our curated collection of gifts and products. Find the perfect item with our AI-powered search and filtering.',
  keywords: ['search', 'products', 'gifts', 'shopping', 'find', 'aclue'],
  openGraph: {
    title: 'Search Products | aclue',
    description: 'Search through our curated collection of gifts and products',
    type: 'website',
    locale: 'en_GB',
  },
  robots: {
    index: false,
    follow: false,
  },
};

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
  try {
    const {
      q: query = '',
      category = '',
      minPrice,
      maxPrice,
      sortBy = 'relevance',
      page = '1',
    } = searchParams;

    const searchOptions = {
      query,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      page: parseInt(page, 10),
      limit: 20,
    };

    const result = await searchProducts(searchOptions);

    return {
      products: result.success ? result.data : [],
      error: result.success ? null : result.error,
      totalResults: result.success ? result.data?.length || 0 : 0,
    };
  } catch (error) {
    console.error('Error getting search results:', error);
    return {
      products: [],
      error: 'Failed to load search results',
      totalResults: 0,
    };
  }
}

/**
 * Get available categories for filtering
 */
function getAvailableCategories(): string[] {
  // In a real implementation, this would fetch from the backend
  return [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Books',
    'Sports',
    'Beauty',
    'Toys',
    'Food & Drink',
    'Health',
    'Automotive',
  ];
}

// ==============================================================================
// LOADING COMPONENTS
// ==============================================================================

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Results header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==============================================================================
// MAIN PAGE COMPONENT
// ==============================================================================

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Server-side data fetching
  const [searchResults, categories] = await Promise.all([
    getSearchResults(searchParams),
    getAvailableCategories(),
  ]);

  const { products, error, totalResults } = searchResults;
  const currentQuery = searchParams.q || '';
  const hasActiveFilters = !!(
    searchParams.category ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
    (searchParams.sortBy && searchParams.sortBy !== 'relevance')
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
            {currentQuery
              ? `Search results for "${currentQuery}"`
              : 'Discover products from our curated collection'}
          </p>
        </div>

        {/* Search Interface - Client Component */}
        <div className="mb-8">
          <SearchInterface
            initialQuery={currentQuery}
            categories={categories}
            initialFilters={{
              category: searchParams.category,
              minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
              maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
              sortBy: searchParams.sortBy,
            }}
          />
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Server Component */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                    Active
                  </span>
                )}
              </div>

              <SearchFilters
                categories={categories}
                activeFilters={{
                  category: searchParams.category,
                  minPrice: searchParams.minPrice,
                  maxPrice: searchParams.maxPrice,
                  sortBy: searchParams.sortBy,
                }}
              />
            </div>
          </div>

          {/* Main Results - Server Component with Client Interactivity */}
          <div className="lg:col-span-3">
            <Suspense fallback={<SearchResultsSkeleton />}>
              {error ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Search Error
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentQuery ? 'No results found' : 'Start your search'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {currentQuery
                      ? `No products found for "${currentQuery}". Try different keywords or adjust your filters.`
                      : 'Enter a search term above to find products in our collection.'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.delete('category');
                        url.searchParams.delete('minPrice');
                        url.searchParams.delete('maxPrice');
                        url.searchParams.delete('sortBy');
                        window.location.href = url.toString();
                      }}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <SearchResults
                  products={products}
                  totalResults={totalResults}
                  currentQuery={currentQuery}
                  sortBy={searchParams.sortBy || 'relevance'}
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
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
export const dynamic = 'force-dynamic';