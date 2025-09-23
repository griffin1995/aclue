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
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { api } from '@/lib/api';
import { Product } from '@/types';
export interface SearchFilters {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  availability: 'all' | 'in_stock' | 'out_of_stock';
  brands: string[];
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'popularity';
  tags: string[];
}
export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand' | 'tag';
  count?: number;
}
interface UseSearchOptions {
  debounceMs?: number;
  maxSuggestions?: number;
  enableFilters?: boolean;
  autoSearch?: boolean;
}
interface UseSearchReturn {
  query: string;
  results: Product[];
  suggestions: SearchSuggestion[];
  filters: SearchFilters;
  isLoading: boolean;
  isLoadingSuggestions: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  recentSearches: string[];
  popularSearches: string[];
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  search: (query?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
  addToRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
  getSuggestions: (query: string) => Promise<SearchSuggestion[]>;
}
const defaultFilters: SearchFilters = stryMutAct_9fa48("9627") ? {} : (stryCov_9fa48("9627"), {
  categories: stryMutAct_9fa48("9628") ? ["Stryker was here"] : (stryCov_9fa48("9628"), []),
  priceRange: stryMutAct_9fa48("9629") ? {} : (stryCov_9fa48("9629"), {
    min: 0,
    max: 1000
  }),
  rating: 0,
  availability: stryMutAct_9fa48("9630") ? "" : (stryCov_9fa48("9630"), 'all'),
  brands: stryMutAct_9fa48("9631") ? ["Stryker was here"] : (stryCov_9fa48("9631"), []),
  sortBy: stryMutAct_9fa48("9632") ? "" : (stryCov_9fa48("9632"), 'relevance'),
  tags: stryMutAct_9fa48("9633") ? ["Stryker was here"] : (stryCov_9fa48("9633"), [])
});
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  if (stryMutAct_9fa48("9634")) {
    {}
  } else {
    stryCov_9fa48("9634");
    const {
      debounceMs = 300,
      maxSuggestions = 10,
      enableFilters = stryMutAct_9fa48("9635") ? false : (stryCov_9fa48("9635"), true),
      autoSearch = stryMutAct_9fa48("9636") ? false : (stryCov_9fa48("9636"), true)
    } = options;
    const [query, setQuery] = useState(stryMutAct_9fa48("9637") ? "Stryker was here!" : (stryCov_9fa48("9637"), ''));
    const [results, setResults] = useState<Product[]>(stryMutAct_9fa48("9638") ? ["Stryker was here"] : (stryCov_9fa48("9638"), []));
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>(stryMutAct_9fa48("9639") ? ["Stryker was here"] : (stryCov_9fa48("9639"), []));
    const [filters, setFiltersState] = useState<SearchFilters>(defaultFilters);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("9640") ? true : (stryCov_9fa48("9640"), false));
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(stryMutAct_9fa48("9641") ? true : (stryCov_9fa48("9641"), false));
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(stryMutAct_9fa48("9642") ? true : (stryCov_9fa48("9642"), false));
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [recentSearches, setRecentSearches] = useState<string[]>(stryMutAct_9fa48("9643") ? ["Stryker was here"] : (stryCov_9fa48("9643"), []));
    const [popularSearches, setPopularSearches] = useState<string[]>(stryMutAct_9fa48("9644") ? ["Stryker was here"] : (stryCov_9fa48("9644"), []));
    const debouncedQuery = useDebounce(query, debounceMs);

    // Load recent searches from localStorage
    useEffect(() => {
      if (stryMutAct_9fa48("9645")) {
        {}
      } else {
        stryCov_9fa48("9645");
        const saved = localStorage.getItem(stryMutAct_9fa48("9646") ? "" : (stryCov_9fa48("9646"), 'aclue_recent_searches'));
        if (stryMutAct_9fa48("9648") ? false : stryMutAct_9fa48("9647") ? true : (stryCov_9fa48("9647", "9648"), saved)) {
          if (stryMutAct_9fa48("9649")) {
            {}
          } else {
            stryCov_9fa48("9649");
            try {
              if (stryMutAct_9fa48("9650")) {
                {}
              } else {
                stryCov_9fa48("9650");
                setRecentSearches(JSON.parse(saved));
              }
            } catch {
              // Ignore parsing errors
            }
          }
        }
      }
    }, stryMutAct_9fa48("9651") ? ["Stryker was here"] : (stryCov_9fa48("9651"), []));

    // Save recent searches to localStorage
    useEffect(() => {
      if (stryMutAct_9fa48("9652")) {
        {}
      } else {
        stryCov_9fa48("9652");
        localStorage.setItem(stryMutAct_9fa48("9653") ? "" : (stryCov_9fa48("9653"), 'aclue_recent_searches'), JSON.stringify(recentSearches));
      }
    }, stryMutAct_9fa48("9654") ? [] : (stryCov_9fa48("9654"), [recentSearches]));

    // Load popular searches
    useEffect(() => {
      if (stryMutAct_9fa48("9655")) {
        {}
      } else {
        stryCov_9fa48("9655");
        const loadPopularSearches = async () => {
          if (stryMutAct_9fa48("9656")) {
            {}
          } else {
            stryCov_9fa48("9656");
            try {
              if (stryMutAct_9fa48("9657")) {
                {}
              } else {
                stryCov_9fa48("9657");
                const response = await api.search.getPopularSearches();
                setPopularSearches(response.searches);
              }
            } catch {
              // Silently fail for popular searches
            }
          }
        };
        loadPopularSearches();
      }
    }, stryMutAct_9fa48("9658") ? ["Stryker was here"] : (stryCov_9fa48("9658"), []));

    // Auto-search when query or filters change
    useEffect(() => {
      if (stryMutAct_9fa48("9659")) {
        {}
      } else {
        stryCov_9fa48("9659");
        if (stryMutAct_9fa48("9662") ? autoSearch || debouncedQuery || enableFilters : stryMutAct_9fa48("9661") ? false : stryMutAct_9fa48("9660") ? true : (stryCov_9fa48("9660", "9661", "9662"), autoSearch && (stryMutAct_9fa48("9664") ? debouncedQuery && enableFilters : stryMutAct_9fa48("9663") ? true : (stryCov_9fa48("9663", "9664"), debouncedQuery || enableFilters)))) {
          if (stryMutAct_9fa48("9665")) {
            {}
          } else {
            stryCov_9fa48("9665");
            search(debouncedQuery);
          }
        }
      }
    }, stryMutAct_9fa48("9666") ? [] : (stryCov_9fa48("9666"), [debouncedQuery, filters, autoSearch, enableFilters]));

    // Search function
    const search = useCallback(async (searchQuery?: string) => {
      if (stryMutAct_9fa48("9667")) {
        {}
      } else {
        stryCov_9fa48("9667");
        const queryToSearch = stryMutAct_9fa48("9668") ? searchQuery && query : (stryCov_9fa48("9668"), searchQuery ?? query);
        setIsLoading(stryMutAct_9fa48("9669") ? false : (stryCov_9fa48("9669"), true));
        setError(null);
        setCurrentPage(1);
        try {
          if (stryMutAct_9fa48("9670")) {
            {}
          } else {
            stryCov_9fa48("9670");
            const searchParams = stryMutAct_9fa48("9671") ? {} : (stryCov_9fa48("9671"), {
              q: queryToSearch,
              page: 1,
              limit: 20,
              ...(enableFilters ? filters : {})
            });
            const response = await api.products.search(searchParams);
            setResults(response.products);
            setTotalCount(response.total);
            setHasMore(response.hasMore);
            setCurrentPage(1);

            // Add to recent searches if it's a meaningful query
            if (stryMutAct_9fa48("9675") ? queryToSearch.trim().length <= 1 : stryMutAct_9fa48("9674") ? queryToSearch.trim().length >= 1 : stryMutAct_9fa48("9673") ? false : stryMutAct_9fa48("9672") ? true : (stryCov_9fa48("9672", "9673", "9674", "9675"), (stryMutAct_9fa48("9676") ? queryToSearch.length : (stryCov_9fa48("9676"), queryToSearch.trim().length)) > 1)) {
              if (stryMutAct_9fa48("9677")) {
                {}
              } else {
                stryCov_9fa48("9677");
                addToRecentSearches(stryMutAct_9fa48("9678") ? queryToSearch : (stryCov_9fa48("9678"), queryToSearch.trim()));
              }
            }
          }
        } catch (err) {
          if (stryMutAct_9fa48("9679")) {
            {}
          } else {
            stryCov_9fa48("9679");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("9680") ? "" : (stryCov_9fa48("9680"), 'Search failed'));
            setResults(stryMutAct_9fa48("9681") ? ["Stryker was here"] : (stryCov_9fa48("9681"), []));
            setTotalCount(0);
            setHasMore(stryMutAct_9fa48("9682") ? true : (stryCov_9fa48("9682"), false));
          }
        } finally {
          if (stryMutAct_9fa48("9683")) {
            {}
          } else {
            stryCov_9fa48("9683");
            setIsLoading(stryMutAct_9fa48("9684") ? true : (stryCov_9fa48("9684"), false));
          }
        }
      }
    }, stryMutAct_9fa48("9685") ? [] : (stryCov_9fa48("9685"), [query, filters, enableFilters]));

    // Load more results
    const loadMore = useCallback(async () => {
      if (stryMutAct_9fa48("9686")) {
        {}
      } else {
        stryCov_9fa48("9686");
        if (stryMutAct_9fa48("9689") ? !hasMore && isLoading : stryMutAct_9fa48("9688") ? false : stryMutAct_9fa48("9687") ? true : (stryCov_9fa48("9687", "9688", "9689"), (stryMutAct_9fa48("9690") ? hasMore : (stryCov_9fa48("9690"), !hasMore)) || isLoading)) return;
        setIsLoading(stryMutAct_9fa48("9691") ? false : (stryCov_9fa48("9691"), true));
        setError(null);
        try {
          if (stryMutAct_9fa48("9692")) {
            {}
          } else {
            stryCov_9fa48("9692");
            const searchParams = stryMutAct_9fa48("9693") ? {} : (stryCov_9fa48("9693"), {
              q: query,
              page: stryMutAct_9fa48("9694") ? currentPage - 1 : (stryCov_9fa48("9694"), currentPage + 1),
              limit: 20,
              ...(enableFilters ? filters : {})
            });
            const response = await api.products.search(searchParams);
            setResults(stryMutAct_9fa48("9695") ? () => undefined : (stryCov_9fa48("9695"), prev => stryMutAct_9fa48("9696") ? [] : (stryCov_9fa48("9696"), [...prev, ...response.products])));
            setHasMore(response.hasMore);
            setCurrentPage(stryMutAct_9fa48("9697") ? () => undefined : (stryCov_9fa48("9697"), prev => stryMutAct_9fa48("9698") ? prev - 1 : (stryCov_9fa48("9698"), prev + 1)));
          }
        } catch (err) {
          if (stryMutAct_9fa48("9699")) {
            {}
          } else {
            stryCov_9fa48("9699");
            setError(err instanceof Error ? err.message : stryMutAct_9fa48("9700") ? "" : (stryCov_9fa48("9700"), 'Failed to load more results'));
          }
        } finally {
          if (stryMutAct_9fa48("9701")) {
            {}
          } else {
            stryCov_9fa48("9701");
            setIsLoading(stryMutAct_9fa48("9702") ? true : (stryCov_9fa48("9702"), false));
          }
        }
      }
    }, stryMutAct_9fa48("9703") ? [] : (stryCov_9fa48("9703"), [query, filters, currentPage, hasMore, isLoading, enableFilters]));

    // Get search suggestions
    const getSuggestions = useCallback(async (searchQuery: string): Promise<SearchSuggestion[]> => {
      if (stryMutAct_9fa48("9704")) {
        {}
      } else {
        stryCov_9fa48("9704");
        if (stryMutAct_9fa48("9707") ? !searchQuery.trim() && searchQuery.length < 2 : stryMutAct_9fa48("9706") ? false : stryMutAct_9fa48("9705") ? true : (stryCov_9fa48("9705", "9706", "9707"), (stryMutAct_9fa48("9708") ? searchQuery.trim() : (stryCov_9fa48("9708"), !(stryMutAct_9fa48("9709") ? searchQuery : (stryCov_9fa48("9709"), searchQuery.trim())))) || (stryMutAct_9fa48("9712") ? searchQuery.length >= 2 : stryMutAct_9fa48("9711") ? searchQuery.length <= 2 : stryMutAct_9fa48("9710") ? false : (stryCov_9fa48("9710", "9711", "9712"), searchQuery.length < 2)))) {
          if (stryMutAct_9fa48("9713")) {
            {}
          } else {
            stryCov_9fa48("9713");
            return stryMutAct_9fa48("9714") ? ["Stryker was here"] : (stryCov_9fa48("9714"), []);
          }
        }
        setIsLoadingSuggestions(stryMutAct_9fa48("9715") ? false : (stryCov_9fa48("9715"), true));
        try {
          if (stryMutAct_9fa48("9716")) {
            {}
          } else {
            stryCov_9fa48("9716");
            const response = await api.search.getSuggestions(stryMutAct_9fa48("9717") ? {} : (stryCov_9fa48("9717"), {
              q: searchQuery,
              limit: maxSuggestions
            }));
            const suggestions = response.suggestions;
            setSuggestions(suggestions);
            return suggestions;
          }
        } catch {
          if (stryMutAct_9fa48("9718")) {
            {}
          } else {
            stryCov_9fa48("9718");
            return stryMutAct_9fa48("9719") ? ["Stryker was here"] : (stryCov_9fa48("9719"), []);
          }
        } finally {
          if (stryMutAct_9fa48("9720")) {
            {}
          } else {
            stryCov_9fa48("9720");
            setIsLoadingSuggestions(stryMutAct_9fa48("9721") ? true : (stryCov_9fa48("9721"), false));
          }
        }
      }
    }, stryMutAct_9fa48("9722") ? [] : (stryCov_9fa48("9722"), [maxSuggestions]));

    // Auto-load suggestions when query changes
    useEffect(() => {
      if (stryMutAct_9fa48("9723")) {
        {}
      } else {
        stryCov_9fa48("9723");
        if (stryMutAct_9fa48("9727") ? query.length < 2 : stryMutAct_9fa48("9726") ? query.length > 2 : stryMutAct_9fa48("9725") ? false : stryMutAct_9fa48("9724") ? true : (stryCov_9fa48("9724", "9725", "9726", "9727"), query.length >= 2)) {
          if (stryMutAct_9fa48("9728")) {
            {}
          } else {
            stryCov_9fa48("9728");
            getSuggestions(query);
          }
        } else {
          if (stryMutAct_9fa48("9729")) {
            {}
          } else {
            stryCov_9fa48("9729");
            setSuggestions(stryMutAct_9fa48("9730") ? ["Stryker was here"] : (stryCov_9fa48("9730"), []));
          }
        }
      }
    }, stryMutAct_9fa48("9731") ? [] : (stryCov_9fa48("9731"), [query, getSuggestions]));

    // Update filters
    const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
      if (stryMutAct_9fa48("9732")) {
        {}
      } else {
        stryCov_9fa48("9732");
        setFiltersState(stryMutAct_9fa48("9733") ? () => undefined : (stryCov_9fa48("9733"), prev => stryMutAct_9fa48("9734") ? {} : (stryCov_9fa48("9734"), {
          ...prev,
          ...newFilters
        })));
      }
    }, stryMutAct_9fa48("9735") ? ["Stryker was here"] : (stryCov_9fa48("9735"), []));

    // Reset filters
    const resetFilters = useCallback(() => {
      if (stryMutAct_9fa48("9736")) {
        {}
      } else {
        stryCov_9fa48("9736");
        setFiltersState(defaultFilters);
      }
    }, stryMutAct_9fa48("9737") ? ["Stryker was here"] : (stryCov_9fa48("9737"), []));

    // Clear results
    const clearResults = useCallback(() => {
      if (stryMutAct_9fa48("9738")) {
        {}
      } else {
        stryCov_9fa48("9738");
        setResults(stryMutAct_9fa48("9739") ? ["Stryker was here"] : (stryCov_9fa48("9739"), []));
        setTotalCount(0);
        setHasMore(stryMutAct_9fa48("9740") ? true : (stryCov_9fa48("9740"), false));
        setCurrentPage(1);
        setError(null);
      }
    }, stryMutAct_9fa48("9741") ? ["Stryker was here"] : (stryCov_9fa48("9741"), []));

    // Add to recent searches
    const addToRecentSearches = useCallback((searchQuery: string) => {
      if (stryMutAct_9fa48("9742")) {
        {}
      } else {
        stryCov_9fa48("9742");
        setRecentSearches(prev => {
          if (stryMutAct_9fa48("9743")) {
            {}
          } else {
            stryCov_9fa48("9743");
            const filtered = stryMutAct_9fa48("9744") ? prev : (stryCov_9fa48("9744"), prev.filter(stryMutAct_9fa48("9745") ? () => undefined : (stryCov_9fa48("9745"), s => stryMutAct_9fa48("9748") ? s.toLowerCase() === searchQuery.toLowerCase() : stryMutAct_9fa48("9747") ? false : stryMutAct_9fa48("9746") ? true : (stryCov_9fa48("9746", "9747", "9748"), (stryMutAct_9fa48("9749") ? s.toUpperCase() : (stryCov_9fa48("9749"), s.toLowerCase())) !== (stryMutAct_9fa48("9750") ? searchQuery.toUpperCase() : (stryCov_9fa48("9750"), searchQuery.toLowerCase()))))));
            return stryMutAct_9fa48("9751") ? [searchQuery, ...filtered] : (stryCov_9fa48("9751"), (stryMutAct_9fa48("9752") ? [] : (stryCov_9fa48("9752"), [searchQuery, ...filtered])).slice(0, 10)); // Keep max 10 recent searches
          }
        });
      }
    }, stryMutAct_9fa48("9753") ? ["Stryker was here"] : (stryCov_9fa48("9753"), []));

    // Clear recent searches
    const clearRecentSearches = useCallback(() => {
      if (stryMutAct_9fa48("9754")) {
        {}
      } else {
        stryCov_9fa48("9754");
        setRecentSearches(stryMutAct_9fa48("9755") ? ["Stryker was here"] : (stryCov_9fa48("9755"), []));
        localStorage.removeItem(stryMutAct_9fa48("9756") ? "" : (stryCov_9fa48("9756"), 'aclue_recent_searches'));
      }
    }, stryMutAct_9fa48("9757") ? ["Stryker was here"] : (stryCov_9fa48("9757"), []));
    return stryMutAct_9fa48("9758") ? {} : (stryCov_9fa48("9758"), {
      query,
      results,
      suggestions,
      filters,
      isLoading,
      isLoadingSuggestions,
      error,
      hasMore,
      totalCount,
      recentSearches,
      popularSearches,
      setQuery,
      setFilters,
      resetFilters,
      search,
      loadMore,
      clearResults,
      addToRecentSearches,
      clearRecentSearches,
      getSuggestions
    });
  }
}