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
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon, FireIcon, TagIcon, BuildingStorefrontIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { useSearch, SearchSuggestion } from '@/hooks/useSearch';
interface SearchBarProps {
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}
export function SearchBar({
  onSearchSubmit,
  placeholder = stryMutAct_9fa48("5039") ? "" : (stryCov_9fa48("5039"), "Search for gifts, products, or categories..."),
  className = stryMutAct_9fa48("5040") ? "Stryker was here!" : (stryCov_9fa48("5040"), ''),
  showSuggestions = stryMutAct_9fa48("5041") ? false : (stryCov_9fa48("5041"), true),
  autoFocus = stryMutAct_9fa48("5042") ? true : (stryCov_9fa48("5042"), false)
}: SearchBarProps) {
  if (stryMutAct_9fa48("5043")) {
    {}
  } else {
    stryCov_9fa48("5043");
    const {
      query,
      suggestions,
      isLoadingSuggestions,
      recentSearches,
      popularSearches,
      setQuery,
      search,
      addToRecentSearches,
      clearRecentSearches
    } = useSearch(stryMutAct_9fa48("5044") ? {} : (stryCov_9fa48("5044"), {
      autoSearch: stryMutAct_9fa48("5045") ? true : (stryCov_9fa48("5045"), false)
    }));
    const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("5046") ? true : (stryCov_9fa48("5046"), false));
    const [selectedIndex, setSelectedIndex] = useState(stryMutAct_9fa48("5047") ? +1 : (stryCov_9fa48("5047"), -1));
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside to close suggestions
    useEffect(() => {
      if (stryMutAct_9fa48("5048")) {
        {}
      } else {
        stryCov_9fa48("5048");
        const handleClickOutside = (event: MouseEvent) => {
          if (stryMutAct_9fa48("5049")) {
            {}
          } else {
            stryCov_9fa48("5049");
            if (stryMutAct_9fa48("5052") ? containerRef.current || !containerRef.current.contains(event.target as Node) : stryMutAct_9fa48("5051") ? false : stryMutAct_9fa48("5050") ? true : (stryCov_9fa48("5050", "5051", "5052"), containerRef.current && (stryMutAct_9fa48("5053") ? containerRef.current.contains(event.target as Node) : (stryCov_9fa48("5053"), !containerRef.current.contains(event.target as Node))))) {
              if (stryMutAct_9fa48("5054")) {
                {}
              } else {
                stryCov_9fa48("5054");
                setIsOpen(stryMutAct_9fa48("5055") ? true : (stryCov_9fa48("5055"), false));
              }
            }
          }
        };
        document.addEventListener(stryMutAct_9fa48("5056") ? "" : (stryCov_9fa48("5056"), 'mousedown'), handleClickOutside);
        return stryMutAct_9fa48("5057") ? () => undefined : (stryCov_9fa48("5057"), () => document.removeEventListener(stryMutAct_9fa48("5058") ? "" : (stryCov_9fa48("5058"), 'mousedown'), handleClickOutside));
      }
    }, stryMutAct_9fa48("5059") ? ["Stryker was here"] : (stryCov_9fa48("5059"), []));

    // Auto-focus if requested
    useEffect(() => {
      if (stryMutAct_9fa48("5060")) {
        {}
      } else {
        stryCov_9fa48("5060");
        if (stryMutAct_9fa48("5063") ? autoFocus || inputRef.current : stryMutAct_9fa48("5062") ? false : stryMutAct_9fa48("5061") ? true : (stryCov_9fa48("5061", "5062", "5063"), autoFocus && inputRef.current)) {
          if (stryMutAct_9fa48("5064")) {
            {}
          } else {
            stryCov_9fa48("5064");
            inputRef.current.focus();
          }
        }
      }
    }, stryMutAct_9fa48("5065") ? [] : (stryCov_9fa48("5065"), [autoFocus]));
    const getSuggestionIcon = (type: SearchSuggestion['type']) => {
      if (stryMutAct_9fa48("5066")) {
        {}
      } else {
        stryCov_9fa48("5066");
        const iconClass = stryMutAct_9fa48("5067") ? "" : (stryCov_9fa48("5067"), "w-4 h-4 text-gray-400");
        switch (type) {
          case stryMutAct_9fa48("5069") ? "" : (stryCov_9fa48("5069"), 'category'):
            if (stryMutAct_9fa48("5068")) {} else {
              stryCov_9fa48("5068");
              return <Squares2X2Icon className={iconClass} />;
            }
          case stryMutAct_9fa48("5071") ? "" : (stryCov_9fa48("5071"), 'brand'):
            if (stryMutAct_9fa48("5070")) {} else {
              stryCov_9fa48("5070");
              return <BuildingStorefrontIcon className={iconClass} />;
            }
          case stryMutAct_9fa48("5073") ? "" : (stryCov_9fa48("5073"), 'tag'):
            if (stryMutAct_9fa48("5072")) {} else {
              stryCov_9fa48("5072");
              return <TagIcon className={iconClass} />;
            }
          default:
            if (stryMutAct_9fa48("5074")) {} else {
              stryCov_9fa48("5074");
              return <MagnifyingGlassIcon className={iconClass} />;
            }
        }
      }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (stryMutAct_9fa48("5075")) {
        {}
      } else {
        stryCov_9fa48("5075");
        const value = e.target.value;
        setQuery(value);
        setIsOpen(stryMutAct_9fa48("5078") ? showSuggestions || value.length > 0 : stryMutAct_9fa48("5077") ? false : stryMutAct_9fa48("5076") ? true : (stryCov_9fa48("5076", "5077", "5078"), showSuggestions && (stryMutAct_9fa48("5081") ? value.length <= 0 : stryMutAct_9fa48("5080") ? value.length >= 0 : stryMutAct_9fa48("5079") ? true : (stryCov_9fa48("5079", "5080", "5081"), value.length > 0))));
        setSelectedIndex(stryMutAct_9fa48("5082") ? +1 : (stryCov_9fa48("5082"), -1));
      }
    };
    const handleInputFocus = () => {
      if (stryMutAct_9fa48("5083")) {
        {}
      } else {
        stryCov_9fa48("5083");
        if (stryMutAct_9fa48("5086") ? showSuggestions || query.length > 0 || recentSearches.length > 0 || popularSearches.length > 0 : stryMutAct_9fa48("5085") ? false : stryMutAct_9fa48("5084") ? true : (stryCov_9fa48("5084", "5085", "5086"), showSuggestions && (stryMutAct_9fa48("5088") ? (query.length > 0 || recentSearches.length > 0) && popularSearches.length > 0 : stryMutAct_9fa48("5087") ? true : (stryCov_9fa48("5087", "5088"), (stryMutAct_9fa48("5090") ? query.length > 0 && recentSearches.length > 0 : stryMutAct_9fa48("5089") ? false : (stryCov_9fa48("5089", "5090"), (stryMutAct_9fa48("5093") ? query.length <= 0 : stryMutAct_9fa48("5092") ? query.length >= 0 : stryMutAct_9fa48("5091") ? false : (stryCov_9fa48("5091", "5092", "5093"), query.length > 0)) || (stryMutAct_9fa48("5096") ? recentSearches.length <= 0 : stryMutAct_9fa48("5095") ? recentSearches.length >= 0 : stryMutAct_9fa48("5094") ? false : (stryCov_9fa48("5094", "5095", "5096"), recentSearches.length > 0)))) || (stryMutAct_9fa48("5099") ? popularSearches.length <= 0 : stryMutAct_9fa48("5098") ? popularSearches.length >= 0 : stryMutAct_9fa48("5097") ? false : (stryCov_9fa48("5097", "5098", "5099"), popularSearches.length > 0)))))) {
          if (stryMutAct_9fa48("5100")) {
            {}
          } else {
            stryCov_9fa48("5100");
            setIsOpen(stryMutAct_9fa48("5101") ? false : (stryCov_9fa48("5101"), true));
          }
        }
      }
    };
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (stryMutAct_9fa48("5102")) {
        {}
      } else {
        stryCov_9fa48("5102");
        if (stryMutAct_9fa48("5105") ? false : stryMutAct_9fa48("5104") ? true : stryMutAct_9fa48("5103") ? isOpen : (stryCov_9fa48("5103", "5104", "5105"), !isOpen)) return;
        const allSuggestions = stryMutAct_9fa48("5106") ? [] : (stryCov_9fa48("5106"), [...suggestions, ...recentSearches.map(stryMutAct_9fa48("5107") ? () => undefined : (stryCov_9fa48("5107"), s => stryMutAct_9fa48("5108") ? {} : (stryCov_9fa48("5108"), {
          id: s,
          text: s,
          type: 'recent' as const
        }))), ...popularSearches.map(stryMutAct_9fa48("5109") ? () => undefined : (stryCov_9fa48("5109"), s => stryMutAct_9fa48("5110") ? {} : (stryCov_9fa48("5110"), {
          id: s,
          text: s,
          type: 'popular' as const
        })))]);
        switch (e.key) {
          case stryMutAct_9fa48("5112") ? "" : (stryCov_9fa48("5112"), 'ArrowDown'):
            if (stryMutAct_9fa48("5111")) {} else {
              stryCov_9fa48("5111");
              e.preventDefault();
              setSelectedIndex(stryMutAct_9fa48("5113") ? () => undefined : (stryCov_9fa48("5113"), prev => (stryMutAct_9fa48("5117") ? prev >= allSuggestions.length - 1 : stryMutAct_9fa48("5116") ? prev <= allSuggestions.length - 1 : stryMutAct_9fa48("5115") ? false : stryMutAct_9fa48("5114") ? true : (stryCov_9fa48("5114", "5115", "5116", "5117"), prev < (stryMutAct_9fa48("5118") ? allSuggestions.length + 1 : (stryCov_9fa48("5118"), allSuggestions.length - 1)))) ? stryMutAct_9fa48("5119") ? prev - 1 : (stryCov_9fa48("5119"), prev + 1) : prev));
              break;
            }
          case stryMutAct_9fa48("5121") ? "" : (stryCov_9fa48("5121"), 'ArrowUp'):
            if (stryMutAct_9fa48("5120")) {} else {
              stryCov_9fa48("5120");
              e.preventDefault();
              setSelectedIndex(stryMutAct_9fa48("5122") ? () => undefined : (stryCov_9fa48("5122"), prev => (stryMutAct_9fa48("5126") ? prev <= -1 : stryMutAct_9fa48("5125") ? prev >= -1 : stryMutAct_9fa48("5124") ? false : stryMutAct_9fa48("5123") ? true : (stryCov_9fa48("5123", "5124", "5125", "5126"), prev > (stryMutAct_9fa48("5127") ? +1 : (stryCov_9fa48("5127"), -1)))) ? stryMutAct_9fa48("5128") ? prev + 1 : (stryCov_9fa48("5128"), prev - 1) : stryMutAct_9fa48("5129") ? +1 : (stryCov_9fa48("5129"), -1)));
              break;
            }
          case stryMutAct_9fa48("5131") ? "" : (stryCov_9fa48("5131"), 'Enter'):
            if (stryMutAct_9fa48("5130")) {} else {
              stryCov_9fa48("5130");
              e.preventDefault();
              if (stryMutAct_9fa48("5134") ? selectedIndex >= 0 || allSuggestions[selectedIndex] : stryMutAct_9fa48("5133") ? false : stryMutAct_9fa48("5132") ? true : (stryCov_9fa48("5132", "5133", "5134"), (stryMutAct_9fa48("5137") ? selectedIndex < 0 : stryMutAct_9fa48("5136") ? selectedIndex > 0 : stryMutAct_9fa48("5135") ? true : (stryCov_9fa48("5135", "5136", "5137"), selectedIndex >= 0)) && allSuggestions[selectedIndex])) {
                if (stryMutAct_9fa48("5138")) {
                  {}
                } else {
                  stryCov_9fa48("5138");
                  handleSuggestionSelect(allSuggestions[selectedIndex].text);
                }
              } else if (stryMutAct_9fa48("5141") ? query : stryMutAct_9fa48("5140") ? false : stryMutAct_9fa48("5139") ? true : (stryCov_9fa48("5139", "5140", "5141"), query.trim())) {
                if (stryMutAct_9fa48("5142")) {
                  {}
                } else {
                  stryCov_9fa48("5142");
                  handleSubmit();
                }
              }
              break;
            }
          case stryMutAct_9fa48("5144") ? "" : (stryCov_9fa48("5144"), 'Escape'):
            if (stryMutAct_9fa48("5143")) {} else {
              stryCov_9fa48("5143");
              setIsOpen(stryMutAct_9fa48("5145") ? true : (stryCov_9fa48("5145"), false));
              setSelectedIndex(stryMutAct_9fa48("5146") ? +1 : (stryCov_9fa48("5146"), -1));
              stryMutAct_9fa48("5147") ? inputRef.current.blur() : (stryCov_9fa48("5147"), inputRef.current?.blur());
              break;
            }
        }
      }
    };
    const handleSubmit = () => {
      if (stryMutAct_9fa48("5148")) {
        {}
      } else {
        stryCov_9fa48("5148");
        if (stryMutAct_9fa48("5151") ? query : stryMutAct_9fa48("5150") ? false : stryMutAct_9fa48("5149") ? true : (stryCov_9fa48("5149", "5150", "5151"), query.trim())) {
          if (stryMutAct_9fa48("5152")) {
            {}
          } else {
            stryCov_9fa48("5152");
            addToRecentSearches(stryMutAct_9fa48("5153") ? query : (stryCov_9fa48("5153"), query.trim()));
            stryMutAct_9fa48("5154") ? onSearchSubmit(query.trim()) : (stryCov_9fa48("5154"), onSearchSubmit?.(stryMutAct_9fa48("5155") ? query : (stryCov_9fa48("5155"), query.trim())));
            search(stryMutAct_9fa48("5156") ? query : (stryCov_9fa48("5156"), query.trim()));
            setIsOpen(stryMutAct_9fa48("5157") ? true : (stryCov_9fa48("5157"), false));
          }
        }
      }
    };
    const handleSuggestionSelect = (suggestionText: string) => {
      if (stryMutAct_9fa48("5158")) {
        {}
      } else {
        stryCov_9fa48("5158");
        setQuery(suggestionText);
        addToRecentSearches(suggestionText);
        stryMutAct_9fa48("5159") ? onSearchSubmit(suggestionText) : (stryCov_9fa48("5159"), onSearchSubmit?.(suggestionText));
        search(suggestionText);
        setIsOpen(stryMutAct_9fa48("5160") ? true : (stryCov_9fa48("5160"), false));
        stryMutAct_9fa48("5161") ? inputRef.current.blur() : (stryCov_9fa48("5161"), inputRef.current?.blur());
      }
    };
    const handleClearQuery = () => {
      if (stryMutAct_9fa48("5162")) {
        {}
      } else {
        stryCov_9fa48("5162");
        setQuery(stryMutAct_9fa48("5163") ? "Stryker was here!" : (stryCov_9fa48("5163"), ''));
        setIsOpen(stryMutAct_9fa48("5164") ? true : (stryCov_9fa48("5164"), false));
        stryMutAct_9fa48("5165") ? inputRef.current.focus() : (stryCov_9fa48("5165"), inputRef.current?.focus());
      }
    };
    return <div ref={containerRef} className={stryMutAct_9fa48("5166") ? `` : (stryCov_9fa48("5166"), `relative ${className}`)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        
        <input ref={inputRef} type="text" value={query} onChange={handleInputChange} onFocus={handleInputFocus} onKeyDown={handleKeyDown} placeholder={placeholder} className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" />
        
        {stryMutAct_9fa48("5169") ? query || <button onClick={handleClearQuery} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button> : stryMutAct_9fa48("5168") ? false : stryMutAct_9fa48("5167") ? true : (stryCov_9fa48("5167", "5168", "5169"), query && <button onClick={handleClearQuery} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>)}
      </div>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {stryMutAct_9fa48("5172") ? isOpen && showSuggestions || <motion.div initial={{
          opacity: 0,
          y: -10,
          scale: 0.95
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} exit={{
          opacity: 0,
          y: -10,
          scale: 0.95
        }} transition={{
          duration: 0.2
        }} className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
            {/* Search Suggestions */}
            {suggestions.length > 0 && <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => <button key={suggestion.id} onClick={() => handleSuggestionSelect(suggestion.text)} className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${selectedIndex === index ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {getSuggestionIcon(suggestion.type)}
                    <span className="flex-1">{suggestion.text}</span>
                    {suggestion.count && <span className="text-xs text-gray-400">
                        {suggestion.count.toLocaleString()} results
                      </span>}
                  </button>)}
              </div>}

            {/* Loading */}
            {isLoadingSuggestions && <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Loading suggestions...
              </div>}

            {/* Recent Searches */}
            {recentSearches.length > 0 && <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  <button onClick={clearRecentSearches} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    Clear
                  </button>
                </div>
                {recentSearches.slice(0, 5).map((search, index) => <button key={search} onClick={() => handleSuggestionSelect(search)} className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${selectedIndex === suggestions.length + index ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>)}
              </div>}

            {/* Popular Searches */}
            {popularSearches.length > 0 && query.length === 0 && <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Popular Searches
                </div>
                {popularSearches.slice(0, 5).map((search, index) => <button key={search} onClick={() => handleSuggestionSelect(search)} className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${selectedIndex === suggestions.length + recentSearches.length + index ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <FireIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>)}
              </div>}

            {/* No Results */}
            {!isLoadingSuggestions && suggestions.length === 0 && query.length > 1 && <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions found</p>
                <button onClick={handleSubmit} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium mt-1">
                  Search for "{query}"
                </button>
              </div>}
          </motion.div> : stryMutAct_9fa48("5171") ? false : stryMutAct_9fa48("5170") ? true : (stryCov_9fa48("5170", "5171", "5172"), (stryMutAct_9fa48("5174") ? isOpen || showSuggestions : stryMutAct_9fa48("5173") ? true : (stryCov_9fa48("5173", "5174"), isOpen && showSuggestions)) && <motion.div initial={stryMutAct_9fa48("5175") ? {} : (stryCov_9fa48("5175"), {
          opacity: 0,
          y: stryMutAct_9fa48("5176") ? +10 : (stryCov_9fa48("5176"), -10),
          scale: 0.95
        })} animate={stryMutAct_9fa48("5177") ? {} : (stryCov_9fa48("5177"), {
          opacity: 1,
          y: 0,
          scale: 1
        })} exit={stryMutAct_9fa48("5178") ? {} : (stryCov_9fa48("5178"), {
          opacity: 0,
          y: stryMutAct_9fa48("5179") ? +10 : (stryCov_9fa48("5179"), -10),
          scale: 0.95
        })} transition={stryMutAct_9fa48("5180") ? {} : (stryCov_9fa48("5180"), {
          duration: 0.2
        })} className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
            {/* Search Suggestions */}
            {stryMutAct_9fa48("5183") ? suggestions.length > 0 || <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => <button key={suggestion.id} onClick={() => handleSuggestionSelect(suggestion.text)} className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${selectedIndex === index ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {getSuggestionIcon(suggestion.type)}
                    <span className="flex-1">{suggestion.text}</span>
                    {suggestion.count && <span className="text-xs text-gray-400">
                        {suggestion.count.toLocaleString()} results
                      </span>}
                  </button>)}
              </div> : stryMutAct_9fa48("5182") ? false : stryMutAct_9fa48("5181") ? true : (stryCov_9fa48("5181", "5182", "5183"), (stryMutAct_9fa48("5186") ? suggestions.length <= 0 : stryMutAct_9fa48("5185") ? suggestions.length >= 0 : stryMutAct_9fa48("5184") ? true : (stryCov_9fa48("5184", "5185", "5186"), suggestions.length > 0)) && <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Suggestions
                </div>
                {suggestions.map(stryMutAct_9fa48("5187") ? () => undefined : (stryCov_9fa48("5187"), (suggestion, index) => <button key={suggestion.id} onClick={stryMutAct_9fa48("5188") ? () => undefined : (stryCov_9fa48("5188"), () => handleSuggestionSelect(suggestion.text))} className={stryMutAct_9fa48("5189") ? `` : (stryCov_9fa48("5189"), `w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${(stryMutAct_9fa48("5192") ? selectedIndex !== index : stryMutAct_9fa48("5191") ? false : stryMutAct_9fa48("5190") ? true : (stryCov_9fa48("5190", "5191", "5192"), selectedIndex === index)) ? stryMutAct_9fa48("5193") ? "" : (stryCov_9fa48("5193"), 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300') : stryMutAct_9fa48("5194") ? "" : (stryCov_9fa48("5194"), 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300')}`)}>
                    {getSuggestionIcon(suggestion.type)}
                    <span className="flex-1">{suggestion.text}</span>
                    {stryMutAct_9fa48("5197") ? suggestion.count || <span className="text-xs text-gray-400">
                        {suggestion.count.toLocaleString()} results
                      </span> : stryMutAct_9fa48("5196") ? false : stryMutAct_9fa48("5195") ? true : (stryCov_9fa48("5195", "5196", "5197"), suggestion.count && <span className="text-xs text-gray-400">
                        {suggestion.count.toLocaleString()} results
                      </span>)}
                  </button>))}
              </div>)}

            {/* Loading */}
            {stryMutAct_9fa48("5200") ? isLoadingSuggestions || <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Loading suggestions...
              </div> : stryMutAct_9fa48("5199") ? false : stryMutAct_9fa48("5198") ? true : (stryCov_9fa48("5198", "5199", "5200"), isLoadingSuggestions && <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Loading suggestions...
              </div>)}

            {/* Recent Searches */}
            {stryMutAct_9fa48("5203") ? recentSearches.length > 0 || <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  <button onClick={clearRecentSearches} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    Clear
                  </button>
                </div>
                {recentSearches.slice(0, 5).map((search, index) => <button key={search} onClick={() => handleSuggestionSelect(search)} className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${selectedIndex === suggestions.length + index ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>)}
              </div> : stryMutAct_9fa48("5202") ? false : stryMutAct_9fa48("5201") ? true : (stryCov_9fa48("5201", "5202", "5203"), (stryMutAct_9fa48("5206") ? recentSearches.length <= 0 : stryMutAct_9fa48("5205") ? recentSearches.length >= 0 : stryMutAct_9fa48("5204") ? true : (stryCov_9fa48("5204", "5205", "5206"), recentSearches.length > 0)) && <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent Searches
                  </div>
                  <button onClick={clearRecentSearches} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    Clear
                  </button>
                </div>
                {stryMutAct_9fa48("5207") ? recentSearches.map((search, index) => <button key={search} onClick={() => handleSuggestionSelect(search)} className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${selectedIndex === suggestions.length + index ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>) : (stryCov_9fa48("5207"), recentSearches.slice(0, 5).map(stryMutAct_9fa48("5208") ? () => undefined : (stryCov_9fa48("5208"), (search, index) => <button key={search} onClick={stryMutAct_9fa48("5209") ? () => undefined : (stryCov_9fa48("5209"), () => handleSuggestionSelect(search))} className={stryMutAct_9fa48("5210") ? `` : (stryCov_9fa48("5210"), `w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${(stryMutAct_9fa48("5213") ? selectedIndex !== suggestions.length + index : stryMutAct_9fa48("5212") ? false : stryMutAct_9fa48("5211") ? true : (stryCov_9fa48("5211", "5212", "5213"), selectedIndex === (stryMutAct_9fa48("5214") ? suggestions.length - index : (stryCov_9fa48("5214"), suggestions.length + index)))) ? stryMutAct_9fa48("5215") ? "" : (stryCov_9fa48("5215"), 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300') : stryMutAct_9fa48("5216") ? "" : (stryCov_9fa48("5216"), 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300')}`)}>
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>)))}
              </div>)}

            {/* Popular Searches */}
            {stryMutAct_9fa48("5219") ? popularSearches.length > 0 && query.length === 0 || <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Popular Searches
                </div>
                {popularSearches.slice(0, 5).map((search, index) => <button key={search} onClick={() => handleSuggestionSelect(search)} className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${selectedIndex === suggestions.length + recentSearches.length + index ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <FireIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>)}
              </div> : stryMutAct_9fa48("5218") ? false : stryMutAct_9fa48("5217") ? true : (stryCov_9fa48("5217", "5218", "5219"), (stryMutAct_9fa48("5221") ? popularSearches.length > 0 || query.length === 0 : stryMutAct_9fa48("5220") ? true : (stryCov_9fa48("5220", "5221"), (stryMutAct_9fa48("5224") ? popularSearches.length <= 0 : stryMutAct_9fa48("5223") ? popularSearches.length >= 0 : stryMutAct_9fa48("5222") ? true : (stryCov_9fa48("5222", "5223", "5224"), popularSearches.length > 0)) && (stryMutAct_9fa48("5226") ? query.length !== 0 : stryMutAct_9fa48("5225") ? true : (stryCov_9fa48("5225", "5226"), query.length === 0)))) && <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Popular Searches
                </div>
                {stryMutAct_9fa48("5227") ? popularSearches.map((search, index) => <button key={search} onClick={() => handleSuggestionSelect(search)} className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${selectedIndex === suggestions.length + recentSearches.length + index ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    <FireIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>) : (stryCov_9fa48("5227"), popularSearches.slice(0, 5).map(stryMutAct_9fa48("5228") ? () => undefined : (stryCov_9fa48("5228"), (search, index) => <button key={search} onClick={stryMutAct_9fa48("5229") ? () => undefined : (stryCov_9fa48("5229"), () => handleSuggestionSelect(search))} className={stryMutAct_9fa48("5230") ? `` : (stryCov_9fa48("5230"), `w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${(stryMutAct_9fa48("5233") ? selectedIndex !== suggestions.length + recentSearches.length + index : stryMutAct_9fa48("5232") ? false : stryMutAct_9fa48("5231") ? true : (stryCov_9fa48("5231", "5232", "5233"), selectedIndex === (stryMutAct_9fa48("5234") ? suggestions.length + recentSearches.length - index : (stryCov_9fa48("5234"), (stryMutAct_9fa48("5235") ? suggestions.length - recentSearches.length : (stryCov_9fa48("5235"), suggestions.length + recentSearches.length)) + index)))) ? stryMutAct_9fa48("5236") ? "" : (stryCov_9fa48("5236"), 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300') : stryMutAct_9fa48("5237") ? "" : (stryCov_9fa48("5237"), 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300')}`)}>
                    <FireIcon className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">{search}</span>
                  </button>)))}
              </div>)}

            {/* No Results */}
            {stryMutAct_9fa48("5240") ? !isLoadingSuggestions && suggestions.length === 0 && query.length > 1 || <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions found</p>
                <button onClick={handleSubmit} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium mt-1">
                  Search for "{query}"
                </button>
              </div> : stryMutAct_9fa48("5239") ? false : stryMutAct_9fa48("5238") ? true : (stryCov_9fa48("5238", "5239", "5240"), (stryMutAct_9fa48("5242") ? !isLoadingSuggestions && suggestions.length === 0 || query.length > 1 : stryMutAct_9fa48("5241") ? true : (stryCov_9fa48("5241", "5242"), (stryMutAct_9fa48("5244") ? !isLoadingSuggestions || suggestions.length === 0 : stryMutAct_9fa48("5243") ? true : (stryCov_9fa48("5243", "5244"), (stryMutAct_9fa48("5245") ? isLoadingSuggestions : (stryCov_9fa48("5245"), !isLoadingSuggestions)) && (stryMutAct_9fa48("5247") ? suggestions.length !== 0 : stryMutAct_9fa48("5246") ? true : (stryCov_9fa48("5246", "5247"), suggestions.length === 0)))) && (stryMutAct_9fa48("5250") ? query.length <= 1 : stryMutAct_9fa48("5249") ? query.length >= 1 : stryMutAct_9fa48("5248") ? true : (stryCov_9fa48("5248", "5249", "5250"), query.length > 1)))) && <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions found</p>
                <button onClick={handleSubmit} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium mt-1">
                  Search for "{query}"
                </button>
              </div>)}
          </motion.div>)}
      </AnimatePresence>
    </div>;
  }
}