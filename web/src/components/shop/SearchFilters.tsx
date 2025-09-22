/**
 * Search Filters - Client Component
 *
 * Filter controls for search results including category, price range, and sorting.
 * Manages URL state and provides immediate feedback.
 */

'use client';

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

export function SearchFilters({ categories, activeFilters }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete('page'); // Reset pagination
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('sortBy');
    params.delete('page');
    router.push(`/search?${params.toString()}`);
  };

  const hasActiveFilters = !!(
    activeFilters.category ||
    activeFilters.minPrice ||
    activeFilters.maxPrice ||
    (activeFilters.sortBy && activeFilters.sortBy !== 'relevance')
  );

  return (
    <div className="space-y-6">
      {/* Clear All Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear all filters
        </button>
      )}

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={activeFilters.category || ''}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min price"
            value={activeFilters.minPrice || ''}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          <input
            type="number"
            placeholder="Max price"
            value={activeFilters.maxPrice || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={activeFilters.sortBy || 'relevance'}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}