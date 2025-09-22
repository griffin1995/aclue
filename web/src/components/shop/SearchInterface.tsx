/**
 * Search Interface - Client Component
 *
 * Interactive search interface with real-time filtering and autocomplete.
 * Handles search input, filter controls, and URL state management.
 */

'use client';

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

export function SearchInterface({ initialQuery, categories, initialFilters }: SearchInterfaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set('q', searchQuery.trim());
    params.delete('page'); // Reset to first page

    router.push(`/search?${params.toString()}`);

    // Reset loading state after navigation
    setTimeout(() => setIsSearching(false), 1000);
  };

  const handleClearSearch = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    params.delete('page');
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for products, brands, or categories..."
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          disabled={!query.trim() || isSearching}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Search
        </button>
      </div>
    </div>
  );
}