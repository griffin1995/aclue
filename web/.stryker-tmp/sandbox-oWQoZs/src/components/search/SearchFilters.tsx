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
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FunnelIcon, XMarkIcon, ChevronDownIcon, StarIcon, CurrencyDollarIcon, TagIcon, BuildingStorefrontIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useSearch, SearchFilters as SearchFiltersType } from '@/hooks/useSearch';
interface SearchFiltersProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  collapsible?: boolean;
}
interface FilterSection {
  id: keyof SearchFiltersType;
  label: string;
  icon: React.ComponentType<any>;
  type: 'checkboxes' | 'range' | 'rating' | 'radio';
  options?: {
    value: string;
    label: string;
    count?: number;
  }[];
}
const filterSections: FilterSection[] = stryMutAct_9fa48("5251") ? [] : (stryCov_9fa48("5251"), [stryMutAct_9fa48("5252") ? {} : (stryCov_9fa48("5252"), {
  id: stryMutAct_9fa48("5253") ? "" : (stryCov_9fa48("5253"), 'categories'),
  label: stryMutAct_9fa48("5254") ? "" : (stryCov_9fa48("5254"), 'Categories'),
  icon: Squares2X2Icon,
  type: stryMutAct_9fa48("5255") ? "" : (stryCov_9fa48("5255"), 'checkboxes'),
  options: stryMutAct_9fa48("5256") ? [] : (stryCov_9fa48("5256"), [stryMutAct_9fa48("5257") ? {} : (stryCov_9fa48("5257"), {
    value: stryMutAct_9fa48("5258") ? "" : (stryCov_9fa48("5258"), 'electronics'),
    label: stryMutAct_9fa48("5259") ? "" : (stryCov_9fa48("5259"), 'Electronics'),
    count: 1234
  }), stryMutAct_9fa48("5260") ? {} : (stryCov_9fa48("5260"), {
    value: stryMutAct_9fa48("5261") ? "" : (stryCov_9fa48("5261"), 'books'),
    label: stryMutAct_9fa48("5262") ? "" : (stryCov_9fa48("5262"), 'Books'),
    count: 856
  }), stryMutAct_9fa48("5263") ? {} : (stryCov_9fa48("5263"), {
    value: stryMutAct_9fa48("5264") ? "" : (stryCov_9fa48("5264"), 'clothing'),
    label: stryMutAct_9fa48("5265") ? "" : (stryCov_9fa48("5265"), 'Clothing'),
    count: 2341
  }), stryMutAct_9fa48("5266") ? {} : (stryCov_9fa48("5266"), {
    value: stryMutAct_9fa48("5267") ? "" : (stryCov_9fa48("5267"), 'home'),
    label: stryMutAct_9fa48("5268") ? "" : (stryCov_9fa48("5268"), 'Home & Garden'),
    count: 987
  }), stryMutAct_9fa48("5269") ? {} : (stryCov_9fa48("5269"), {
    value: stryMutAct_9fa48("5270") ? "" : (stryCov_9fa48("5270"), 'toys'),
    label: stryMutAct_9fa48("5271") ? "" : (stryCov_9fa48("5271"), 'Toys & Games'),
    count: 654
  }), stryMutAct_9fa48("5272") ? {} : (stryCov_9fa48("5272"), {
    value: stryMutAct_9fa48("5273") ? "" : (stryCov_9fa48("5273"), 'sports'),
    label: stryMutAct_9fa48("5274") ? "" : (stryCov_9fa48("5274"), 'Sports & Outdoors'),
    count: 432
  }), stryMutAct_9fa48("5275") ? {} : (stryCov_9fa48("5275"), {
    value: stryMutAct_9fa48("5276") ? "" : (stryCov_9fa48("5276"), 'beauty'),
    label: stryMutAct_9fa48("5277") ? "" : (stryCov_9fa48("5277"), 'Beauty & Personal Care'),
    count: 789
  }), stryMutAct_9fa48("5278") ? {} : (stryCov_9fa48("5278"), {
    value: stryMutAct_9fa48("5279") ? "" : (stryCov_9fa48("5279"), 'jewelry'),
    label: stryMutAct_9fa48("5280") ? "" : (stryCov_9fa48("5280"), 'Jewelry'),
    count: 345
  })])
}), stryMutAct_9fa48("5281") ? {} : (stryCov_9fa48("5281"), {
  id: stryMutAct_9fa48("5282") ? "" : (stryCov_9fa48("5282"), 'brands'),
  label: stryMutAct_9fa48("5283") ? "" : (stryCov_9fa48("5283"), 'Brands'),
  icon: BuildingStorefrontIcon,
  type: stryMutAct_9fa48("5284") ? "" : (stryCov_9fa48("5284"), 'checkboxes'),
  options: stryMutAct_9fa48("5285") ? [] : (stryCov_9fa48("5285"), [stryMutAct_9fa48("5286") ? {} : (stryCov_9fa48("5286"), {
    value: stryMutAct_9fa48("5287") ? "" : (stryCov_9fa48("5287"), 'apple'),
    label: stryMutAct_9fa48("5288") ? "" : (stryCov_9fa48("5288"), 'Apple'),
    count: 156
  }), stryMutAct_9fa48("5289") ? {} : (stryCov_9fa48("5289"), {
    value: stryMutAct_9fa48("5290") ? "" : (stryCov_9fa48("5290"), 'samsung'),
    label: stryMutAct_9fa48("5291") ? "" : (stryCov_9fa48("5291"), 'Samsung'),
    count: 134
  }), stryMutAct_9fa48("5292") ? {} : (stryCov_9fa48("5292"), {
    value: stryMutAct_9fa48("5293") ? "" : (stryCov_9fa48("5293"), 'nike'),
    label: stryMutAct_9fa48("5294") ? "" : (stryCov_9fa48("5294"), 'Nike'),
    count: 98
  }), stryMutAct_9fa48("5295") ? {} : (stryCov_9fa48("5295"), {
    value: stryMutAct_9fa48("5296") ? "" : (stryCov_9fa48("5296"), 'adidas'),
    label: stryMutAct_9fa48("5297") ? "" : (stryCov_9fa48("5297"), 'Adidas'),
    count: 87
  }), stryMutAct_9fa48("5298") ? {} : (stryCov_9fa48("5298"), {
    value: stryMutAct_9fa48("5299") ? "" : (stryCov_9fa48("5299"), 'sony'),
    label: stryMutAct_9fa48("5300") ? "" : (stryCov_9fa48("5300"), 'Sony'),
    count: 76
  }), stryMutAct_9fa48("5301") ? {} : (stryCov_9fa48("5301"), {
    value: stryMutAct_9fa48("5302") ? "" : (stryCov_9fa48("5302"), 'lego'),
    label: stryMutAct_9fa48("5303") ? "" : (stryCov_9fa48("5303"), 'LEGO'),
    count: 65
  })])
}), stryMutAct_9fa48("5304") ? {} : (stryCov_9fa48("5304"), {
  id: stryMutAct_9fa48("5305") ? "" : (stryCov_9fa48("5305"), 'tags'),
  label: stryMutAct_9fa48("5306") ? "" : (stryCov_9fa48("5306"), 'Tags'),
  icon: TagIcon,
  type: stryMutAct_9fa48("5307") ? "" : (stryCov_9fa48("5307"), 'checkboxes'),
  options: stryMutAct_9fa48("5308") ? [] : (stryCov_9fa48("5308"), [stryMutAct_9fa48("5309") ? {} : (stryCov_9fa48("5309"), {
    value: stryMutAct_9fa48("5310") ? "" : (stryCov_9fa48("5310"), 'bestseller'),
    label: stryMutAct_9fa48("5311") ? "" : (stryCov_9fa48("5311"), 'Bestseller'),
    count: 234
  }), stryMutAct_9fa48("5312") ? {} : (stryCov_9fa48("5312"), {
    value: stryMutAct_9fa48("5313") ? "" : (stryCov_9fa48("5313"), 'new'),
    label: stryMutAct_9fa48("5314") ? "" : (stryCov_9fa48("5314"), 'New Arrivals'),
    count: 187
  }), stryMutAct_9fa48("5315") ? {} : (stryCov_9fa48("5315"), {
    value: stryMutAct_9fa48("5316") ? "" : (stryCov_9fa48("5316"), 'sale'),
    label: stryMutAct_9fa48("5317") ? "" : (stryCov_9fa48("5317"), 'On Sale'),
    count: 156
  }), stryMutAct_9fa48("5318") ? {} : (stryCov_9fa48("5318"), {
    value: stryMutAct_9fa48("5319") ? "" : (stryCov_9fa48("5319"), 'eco-friendly'),
    label: stryMutAct_9fa48("5320") ? "" : (stryCov_9fa48("5320"), 'Eco-Friendly'),
    count: 89
  }), stryMutAct_9fa48("5321") ? {} : (stryCov_9fa48("5321"), {
    value: stryMutAct_9fa48("5322") ? "" : (stryCov_9fa48("5322"), 'handmade'),
    label: stryMutAct_9fa48("5323") ? "" : (stryCov_9fa48("5323"), 'Handmade'),
    count: 67
  }), stryMutAct_9fa48("5324") ? {} : (stryCov_9fa48("5324"), {
    value: stryMutAct_9fa48("5325") ? "" : (stryCov_9fa48("5325"), 'premium'),
    label: stryMutAct_9fa48("5326") ? "" : (stryCov_9fa48("5326"), 'Premium'),
    count: 45
  })])
})]);
export function SearchFilters({
  className = stryMutAct_9fa48("5327") ? "Stryker was here!" : (stryCov_9fa48("5327"), ''),
  collapsible = stryMutAct_9fa48("5328") ? false : (stryCov_9fa48("5328"), true)
}: SearchFiltersProps) {
  if (stryMutAct_9fa48("5329")) {
    {}
  } else {
    stryCov_9fa48("5329");
    const {
      filters,
      setFilters,
      resetFilters
    } = useSearch();
    const [isExpanded, setIsExpanded] = useState(stryMutAct_9fa48("5330") ? collapsible : (stryCov_9fa48("5330"), !collapsible));
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(stryMutAct_9fa48("5331") ? {} : (stryCov_9fa48("5331"), {
      categories: stryMutAct_9fa48("5332") ? false : (stryCov_9fa48("5332"), true),
      brands: stryMutAct_9fa48("5333") ? true : (stryCov_9fa48("5333"), false),
      tags: stryMutAct_9fa48("5334") ? true : (stryCov_9fa48("5334"), false)
    }));
    const toggleSection = (sectionId: string) => {
      if (stryMutAct_9fa48("5335")) {
        {}
      } else {
        stryCov_9fa48("5335");
        setExpandedSections(stryMutAct_9fa48("5336") ? () => undefined : (stryCov_9fa48("5336"), prev => stryMutAct_9fa48("5337") ? {} : (stryCov_9fa48("5337"), {
          ...prev,
          [sectionId]: stryMutAct_9fa48("5338") ? prev[sectionId] : (stryCov_9fa48("5338"), !prev[sectionId])
        })));
      }
    };
    const handleCheckboxChange = (filterId: keyof SearchFiltersType, value: string, checked: boolean) => {
      if (stryMutAct_9fa48("5339")) {
        {}
      } else {
        stryCov_9fa48("5339");
        const currentValues = filters[filterId] as string[];
        const newValues = checked ? stryMutAct_9fa48("5340") ? [] : (stryCov_9fa48("5340"), [...currentValues, value]) : stryMutAct_9fa48("5341") ? currentValues : (stryCov_9fa48("5341"), currentValues.filter(stryMutAct_9fa48("5342") ? () => undefined : (stryCov_9fa48("5342"), v => stryMutAct_9fa48("5345") ? v === value : stryMutAct_9fa48("5344") ? false : stryMutAct_9fa48("5343") ? true : (stryCov_9fa48("5343", "5344", "5345"), v !== value))));
        setFilters(stryMutAct_9fa48("5346") ? {} : (stryCov_9fa48("5346"), {
          [filterId]: newValues
        }));
      }
    };
    const handlePriceRangeChange = (field: 'min' | 'max', value: number) => {
      if (stryMutAct_9fa48("5347")) {
        {}
      } else {
        stryCov_9fa48("5347");
        setFilters(stryMutAct_9fa48("5348") ? {} : (stryCov_9fa48("5348"), {
          priceRange: stryMutAct_9fa48("5349") ? {} : (stryCov_9fa48("5349"), {
            ...filters.priceRange,
            [field]: value
          })
        }));
      }
    };
    const handleRatingChange = (rating: number) => {
      if (stryMutAct_9fa48("5350")) {
        {}
      } else {
        stryCov_9fa48("5350");
        setFilters(stryMutAct_9fa48("5351") ? {} : (stryCov_9fa48("5351"), {
          rating
        }));
      }
    };
    const handleAvailabilityChange = (availability: SearchFiltersType['availability']) => {
      if (stryMutAct_9fa48("5352")) {
        {}
      } else {
        stryCov_9fa48("5352");
        setFilters(stryMutAct_9fa48("5353") ? {} : (stryCov_9fa48("5353"), {
          availability
        }));
      }
    };
    const handleSortByChange = (sortBy: SearchFiltersType['sortBy']) => {
      if (stryMutAct_9fa48("5354")) {
        {}
      } else {
        stryCov_9fa48("5354");
        setFilters(stryMutAct_9fa48("5355") ? {} : (stryCov_9fa48("5355"), {
          sortBy
        }));
      }
    };
    const getActiveFiltersCount = () => {
      if (stryMutAct_9fa48("5356")) {
        {}
      } else {
        stryCov_9fa48("5356");
        let count = 0;
        if (stryMutAct_9fa48("5360") ? filters.categories.length <= 0 : stryMutAct_9fa48("5359") ? filters.categories.length >= 0 : stryMutAct_9fa48("5358") ? false : stryMutAct_9fa48("5357") ? true : (stryCov_9fa48("5357", "5358", "5359", "5360"), filters.categories.length > 0)) stryMutAct_9fa48("5361") ? count-- : (stryCov_9fa48("5361"), count++);
        if (stryMutAct_9fa48("5365") ? filters.brands.length <= 0 : stryMutAct_9fa48("5364") ? filters.brands.length >= 0 : stryMutAct_9fa48("5363") ? false : stryMutAct_9fa48("5362") ? true : (stryCov_9fa48("5362", "5363", "5364", "5365"), filters.brands.length > 0)) stryMutAct_9fa48("5366") ? count-- : (stryCov_9fa48("5366"), count++);
        if (stryMutAct_9fa48("5370") ? filters.tags.length <= 0 : stryMutAct_9fa48("5369") ? filters.tags.length >= 0 : stryMutAct_9fa48("5368") ? false : stryMutAct_9fa48("5367") ? true : (stryCov_9fa48("5367", "5368", "5369", "5370"), filters.tags.length > 0)) stryMutAct_9fa48("5371") ? count-- : (stryCov_9fa48("5371"), count++);
        if (stryMutAct_9fa48("5375") ? filters.rating <= 0 : stryMutAct_9fa48("5374") ? filters.rating >= 0 : stryMutAct_9fa48("5373") ? false : stryMutAct_9fa48("5372") ? true : (stryCov_9fa48("5372", "5373", "5374", "5375"), filters.rating > 0)) stryMutAct_9fa48("5376") ? count-- : (stryCov_9fa48("5376"), count++);
        if (stryMutAct_9fa48("5379") ? filters.availability === 'all' : stryMutAct_9fa48("5378") ? false : stryMutAct_9fa48("5377") ? true : (stryCov_9fa48("5377", "5378", "5379"), filters.availability !== (stryMutAct_9fa48("5380") ? "" : (stryCov_9fa48("5380"), 'all')))) stryMutAct_9fa48("5381") ? count-- : (stryCov_9fa48("5381"), count++);
        if (stryMutAct_9fa48("5384") ? filters.priceRange.min > 0 && filters.priceRange.max < 1000 : stryMutAct_9fa48("5383") ? false : stryMutAct_9fa48("5382") ? true : (stryCov_9fa48("5382", "5383", "5384"), (stryMutAct_9fa48("5387") ? filters.priceRange.min <= 0 : stryMutAct_9fa48("5386") ? filters.priceRange.min >= 0 : stryMutAct_9fa48("5385") ? false : (stryCov_9fa48("5385", "5386", "5387"), filters.priceRange.min > 0)) || (stryMutAct_9fa48("5390") ? filters.priceRange.max >= 1000 : stryMutAct_9fa48("5389") ? filters.priceRange.max <= 1000 : stryMutAct_9fa48("5388") ? false : (stryCov_9fa48("5388", "5389", "5390"), filters.priceRange.max < 1000)))) stryMutAct_9fa48("5391") ? count-- : (stryCov_9fa48("5391"), count++);
        return count;
      }
    };
    const activeFiltersCount = getActiveFiltersCount();
    return <div className={stryMutAct_9fa48("5392") ? `` : (stryCov_9fa48("5392"), `bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`)}>
      {/* Header */}
      {stryMutAct_9fa48("5395") ? collapsible || <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              Filters
            </span>
            {activeFiltersCount > 0 && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                {activeFiltersCount}
              </span>}
          </div>
          <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button> : stryMutAct_9fa48("5394") ? false : stryMutAct_9fa48("5393") ? true : (stryCov_9fa48("5393", "5394", "5395"), collapsible && <button onClick={stryMutAct_9fa48("5396") ? () => undefined : (stryCov_9fa48("5396"), () => setIsExpanded(stryMutAct_9fa48("5397") ? isExpanded : (stryCov_9fa48("5397"), !isExpanded)))} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">
              Filters
            </span>
            {stryMutAct_9fa48("5400") ? activeFiltersCount > 0 || <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                {activeFiltersCount}
              </span> : stryMutAct_9fa48("5399") ? false : stryMutAct_9fa48("5398") ? true : (stryCov_9fa48("5398", "5399", "5400"), (stryMutAct_9fa48("5403") ? activeFiltersCount <= 0 : stryMutAct_9fa48("5402") ? activeFiltersCount >= 0 : stryMutAct_9fa48("5401") ? true : (stryCov_9fa48("5401", "5402", "5403"), activeFiltersCount > 0)) && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                {activeFiltersCount}
              </span>)}
          </div>
          <ChevronDownIcon className={stryMutAct_9fa48("5404") ? `` : (stryCov_9fa48("5404"), `w-5 h-5 text-gray-400 transition-transform ${isExpanded ? stryMutAct_9fa48("5405") ? "" : (stryCov_9fa48("5405"), 'rotate-180') : stryMutAct_9fa48("5406") ? "Stryker was here!" : (stryCov_9fa48("5406"), '')}`)} />
        </button>)}

      <AnimatePresence>
        {stryMutAct_9fa48("5409") ? isExpanded || <motion.div initial={{
          height: 0,
          opacity: 0
        }} animate={{
          height: 'auto',
          opacity: 1
        }} exit={{
          height: 0,
          opacity: 0
        }} transition={{
          duration: 0.2
        }} className="overflow-hidden">
            <div className="p-4 space-y-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sort By
                </label>
                <select value={filters.sortBy} onChange={e => handleSortByChange(e.target.value as SearchFiltersType['sortBy'])} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                  Price Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="number" placeholder="Min" value={filters.priceRange.min || ''} onChange={e => handlePriceRangeChange('min', Number(e.target.value) || 0)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <input type="number" placeholder="Max" value={filters.priceRange.max || ''} onChange={e => handlePriceRangeChange('max', Number(e.target.value) || 1000)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>${filters.priceRange.min}</span>
                    <span>${filters.priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => <button key={star} onClick={() => handleRatingChange(star === filters.rating ? 0 : star)} className="p-1 transition-colors">
                      {star <= filters.rating ? <StarIconSolid className="w-5 h-5 text-yellow-400" /> : <StarIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-yellow-400" />}
                    </button>)}
                  {filters.rating > 0 && <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {filters.rating}+ stars
                    </span>}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Availability
                </label>
                <div className="space-y-2">
                  {[{
                  value: 'all',
                  label: 'All Items'
                }, {
                  value: 'in_stock',
                  label: 'In Stock Only'
                }, {
                  value: 'out_of_stock',
                  label: 'Out of Stock'
                }].map(option => <label key={option.value} className="flex items-center">
                      <input type="radio" name="availability" value={option.value} checked={filters.availability === option.value} onChange={() => handleAvailabilityChange(option.value as SearchFiltersType['availability'])} className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>)}
                </div>
              </div>

              {/* Dynamic Filter Sections */}
              {filterSections.map(section => <div key={section.id}>
                  <button onClick={() => toggleSection(section.id)} className="w-full flex items-center justify-between text-left mb-3">
                    <div className="flex items-center gap-2">
                      <section.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {section.label}
                      </span>
                      {(filters[section.id] as string[]).length > 0 && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                          {(filters[section.id] as string[]).length}
                        </span>}
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections[section.id] ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections[section.id] && <motion.div initial={{
                  height: 0,
                  opacity: 0
                }} animate={{
                  height: 'auto',
                  opacity: 1
                }} exit={{
                  height: 0,
                  opacity: 0
                }} transition={{
                  duration: 0.2
                }} className="overflow-hidden">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {section.options?.map(option => <label key={option.value} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input type="checkbox" checked={(filters[section.id] as string[]).includes(option.value)} onChange={e => handleCheckboxChange(section.id, option.value, e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500" />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                  {option.label}
                                </span>
                              </div>
                              {option.count && <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {option.count.toLocaleString('en-GB')}
                                </span>}
                            </label>)}
                        </div>
                      </motion.div>}
                  </AnimatePresence>
                </div>)}

              {/* Reset Filters */}
              {activeFiltersCount > 0 && <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <XMarkIcon className="w-4 h-4" />
                  Clear All Filters
                </button>}
            </div>
          </motion.div> : stryMutAct_9fa48("5408") ? false : stryMutAct_9fa48("5407") ? true : (stryCov_9fa48("5407", "5408", "5409"), isExpanded && <motion.div initial={stryMutAct_9fa48("5410") ? {} : (stryCov_9fa48("5410"), {
          height: 0,
          opacity: 0
        })} animate={stryMutAct_9fa48("5411") ? {} : (stryCov_9fa48("5411"), {
          height: stryMutAct_9fa48("5412") ? "" : (stryCov_9fa48("5412"), 'auto'),
          opacity: 1
        })} exit={stryMutAct_9fa48("5413") ? {} : (stryCov_9fa48("5413"), {
          height: 0,
          opacity: 0
        })} transition={stryMutAct_9fa48("5414") ? {} : (stryCov_9fa48("5414"), {
          duration: 0.2
        })} className="overflow-hidden">
            <div className="p-4 space-y-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sort By
                </label>
                <select value={filters.sortBy} onChange={stryMutAct_9fa48("5415") ? () => undefined : (stryCov_9fa48("5415"), e => handleSortByChange(e.target.value as SearchFiltersType['sortBy']))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                  Price Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="number" placeholder="Min" value={stryMutAct_9fa48("5418") ? filters.priceRange.min && '' : stryMutAct_9fa48("5417") ? false : stryMutAct_9fa48("5416") ? true : (stryCov_9fa48("5416", "5417", "5418"), filters.priceRange.min || (stryMutAct_9fa48("5419") ? "Stryker was here!" : (stryCov_9fa48("5419"), '')))} onChange={stryMutAct_9fa48("5420") ? () => undefined : (stryCov_9fa48("5420"), e => handlePriceRangeChange(stryMutAct_9fa48("5421") ? "" : (stryCov_9fa48("5421"), 'min'), stryMutAct_9fa48("5424") ? Number(e.target.value) && 0 : stryMutAct_9fa48("5423") ? false : stryMutAct_9fa48("5422") ? true : (stryCov_9fa48("5422", "5423", "5424"), Number(e.target.value) || 0)))} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <input type="number" placeholder="Max" value={stryMutAct_9fa48("5427") ? filters.priceRange.max && '' : stryMutAct_9fa48("5426") ? false : stryMutAct_9fa48("5425") ? true : (stryCov_9fa48("5425", "5426", "5427"), filters.priceRange.max || (stryMutAct_9fa48("5428") ? "Stryker was here!" : (stryCov_9fa48("5428"), '')))} onChange={stryMutAct_9fa48("5429") ? () => undefined : (stryCov_9fa48("5429"), e => handlePriceRangeChange(stryMutAct_9fa48("5430") ? "" : (stryCov_9fa48("5430"), 'max'), stryMutAct_9fa48("5433") ? Number(e.target.value) && 1000 : stryMutAct_9fa48("5432") ? false : stryMutAct_9fa48("5431") ? true : (stryCov_9fa48("5431", "5432", "5433"), Number(e.target.value) || 1000)))} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>${filters.priceRange.min}</span>
                    <span>${filters.priceRange.max}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-1">
                  {(stryMutAct_9fa48("5434") ? [] : (stryCov_9fa48("5434"), [1, 2, 3, 4, 5])).map(stryMutAct_9fa48("5435") ? () => undefined : (stryCov_9fa48("5435"), star => <button key={star} onClick={stryMutAct_9fa48("5436") ? () => undefined : (stryCov_9fa48("5436"), () => handleRatingChange((stryMutAct_9fa48("5439") ? star !== filters.rating : stryMutAct_9fa48("5438") ? false : stryMutAct_9fa48("5437") ? true : (stryCov_9fa48("5437", "5438", "5439"), star === filters.rating)) ? 0 : star))} className="p-1 transition-colors">
                      {(stryMutAct_9fa48("5443") ? star > filters.rating : stryMutAct_9fa48("5442") ? star < filters.rating : stryMutAct_9fa48("5441") ? false : stryMutAct_9fa48("5440") ? true : (stryCov_9fa48("5440", "5441", "5442", "5443"), star <= filters.rating)) ? <StarIconSolid className="w-5 h-5 text-yellow-400" /> : <StarIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-yellow-400" />}
                    </button>))}
                  {stryMutAct_9fa48("5446") ? filters.rating > 0 || <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {filters.rating}+ stars
                    </span> : stryMutAct_9fa48("5445") ? false : stryMutAct_9fa48("5444") ? true : (stryCov_9fa48("5444", "5445", "5446"), (stryMutAct_9fa48("5449") ? filters.rating <= 0 : stryMutAct_9fa48("5448") ? filters.rating >= 0 : stryMutAct_9fa48("5447") ? true : (stryCov_9fa48("5447", "5448", "5449"), filters.rating > 0)) && <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {filters.rating}+ stars
                    </span>)}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Availability
                </label>
                <div className="space-y-2">
                  {(stryMutAct_9fa48("5450") ? [] : (stryCov_9fa48("5450"), [stryMutAct_9fa48("5451") ? {} : (stryCov_9fa48("5451"), {
                  value: stryMutAct_9fa48("5452") ? "" : (stryCov_9fa48("5452"), 'all'),
                  label: stryMutAct_9fa48("5453") ? "" : (stryCov_9fa48("5453"), 'All Items')
                }), stryMutAct_9fa48("5454") ? {} : (stryCov_9fa48("5454"), {
                  value: stryMutAct_9fa48("5455") ? "" : (stryCov_9fa48("5455"), 'in_stock'),
                  label: stryMutAct_9fa48("5456") ? "" : (stryCov_9fa48("5456"), 'In Stock Only')
                }), stryMutAct_9fa48("5457") ? {} : (stryCov_9fa48("5457"), {
                  value: stryMutAct_9fa48("5458") ? "" : (stryCov_9fa48("5458"), 'out_of_stock'),
                  label: stryMutAct_9fa48("5459") ? "" : (stryCov_9fa48("5459"), 'Out of Stock')
                })])).map(stryMutAct_9fa48("5460") ? () => undefined : (stryCov_9fa48("5460"), option => <label key={option.value} className="flex items-center">
                      <input type="radio" name="availability" value={option.value} checked={stryMutAct_9fa48("5463") ? filters.availability !== option.value : stryMutAct_9fa48("5462") ? false : stryMutAct_9fa48("5461") ? true : (stryCov_9fa48("5461", "5462", "5463"), filters.availability === option.value)} onChange={stryMutAct_9fa48("5464") ? () => undefined : (stryCov_9fa48("5464"), () => handleAvailabilityChange(option.value as SearchFiltersType['availability']))} className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </label>))}
                </div>
              </div>

              {/* Dynamic Filter Sections */}
              {filterSections.map(stryMutAct_9fa48("5465") ? () => undefined : (stryCov_9fa48("5465"), section => <div key={section.id}>
                  <button onClick={stryMutAct_9fa48("5466") ? () => undefined : (stryCov_9fa48("5466"), () => toggleSection(section.id))} className="w-full flex items-center justify-between text-left mb-3">
                    <div className="flex items-center gap-2">
                      <section.icon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {section.label}
                      </span>
                      {stryMutAct_9fa48("5469") ? (filters[section.id] as string[]).length > 0 || <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                          {(filters[section.id] as string[]).length}
                        </span> : stryMutAct_9fa48("5468") ? false : stryMutAct_9fa48("5467") ? true : (stryCov_9fa48("5467", "5468", "5469"), (stryMutAct_9fa48("5472") ? (filters[section.id] as string[]).length <= 0 : stryMutAct_9fa48("5471") ? (filters[section.id] as string[]).length >= 0 : stryMutAct_9fa48("5470") ? true : (stryCov_9fa48("5470", "5471", "5472"), (filters[section.id] as string[]).length > 0)) && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                          {(filters[section.id] as string[]).length}
                        </span>)}
                    </div>
                    <ChevronDownIcon className={stryMutAct_9fa48("5473") ? `` : (stryCov_9fa48("5473"), `w-4 h-4 text-gray-400 transition-transform ${expandedSections[section.id] ? stryMutAct_9fa48("5474") ? "" : (stryCov_9fa48("5474"), 'rotate-180') : stryMutAct_9fa48("5475") ? "Stryker was here!" : (stryCov_9fa48("5475"), '')}`)} />
                  </button>
                  
                  <AnimatePresence>
                    {stryMutAct_9fa48("5478") ? expandedSections[section.id] || <motion.div initial={{
                  height: 0,
                  opacity: 0
                }} animate={{
                  height: 'auto',
                  opacity: 1
                }} exit={{
                  height: 0,
                  opacity: 0
                }} transition={{
                  duration: 0.2
                }} className="overflow-hidden">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {section.options?.map(option => <label key={option.value} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input type="checkbox" checked={(filters[section.id] as string[]).includes(option.value)} onChange={e => handleCheckboxChange(section.id, option.value, e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500" />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                  {option.label}
                                </span>
                              </div>
                              {option.count && <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {option.count.toLocaleString('en-GB')}
                                </span>}
                            </label>)}
                        </div>
                      </motion.div> : stryMutAct_9fa48("5477") ? false : stryMutAct_9fa48("5476") ? true : (stryCov_9fa48("5476", "5477", "5478"), expandedSections[section.id] && <motion.div initial={stryMutAct_9fa48("5479") ? {} : (stryCov_9fa48("5479"), {
                  height: 0,
                  opacity: 0
                })} animate={stryMutAct_9fa48("5480") ? {} : (stryCov_9fa48("5480"), {
                  height: stryMutAct_9fa48("5481") ? "" : (stryCov_9fa48("5481"), 'auto'),
                  opacity: 1
                })} exit={stryMutAct_9fa48("5482") ? {} : (stryCov_9fa48("5482"), {
                  height: 0,
                  opacity: 0
                })} transition={stryMutAct_9fa48("5483") ? {} : (stryCov_9fa48("5483"), {
                  duration: 0.2
                })} className="overflow-hidden">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {stryMutAct_9fa48("5484") ? section.options.map(option => <label key={option.value} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input type="checkbox" checked={(filters[section.id] as string[]).includes(option.value)} onChange={e => handleCheckboxChange(section.id, option.value, e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500" />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                  {option.label}
                                </span>
                              </div>
                              {option.count && <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {option.count.toLocaleString('en-GB')}
                                </span>}
                            </label>) : (stryCov_9fa48("5484"), section.options?.map(stryMutAct_9fa48("5485") ? () => undefined : (stryCov_9fa48("5485"), option => <label key={option.value} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input type="checkbox" checked={(filters[section.id] as string[]).includes(option.value)} onChange={stryMutAct_9fa48("5486") ? () => undefined : (stryCov_9fa48("5486"), e => handleCheckboxChange(section.id, option.value, e.target.checked))} className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500" />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                  {option.label}
                                </span>
                              </div>
                              {stryMutAct_9fa48("5489") ? option.count || <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {option.count.toLocaleString('en-GB')}
                                </span> : stryMutAct_9fa48("5488") ? false : stryMutAct_9fa48("5487") ? true : (stryCov_9fa48("5487", "5488", "5489"), option.count && <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {option.count.toLocaleString(stryMutAct_9fa48("5490") ? "" : (stryCov_9fa48("5490"), 'en-GB'))}
                                </span>)}
                            </label>)))}
                        </div>
                      </motion.div>)}
                  </AnimatePresence>
                </div>))}

              {/* Reset Filters */}
              {stryMutAct_9fa48("5493") ? activeFiltersCount > 0 || <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <XMarkIcon className="w-4 h-4" />
                  Clear All Filters
                </button> : stryMutAct_9fa48("5492") ? false : stryMutAct_9fa48("5491") ? true : (stryCov_9fa48("5491", "5492", "5493"), (stryMutAct_9fa48("5496") ? activeFiltersCount <= 0 : stryMutAct_9fa48("5495") ? activeFiltersCount >= 0 : stryMutAct_9fa48("5494") ? true : (stryCov_9fa48("5494", "5495", "5496"), activeFiltersCount > 0)) && <button onClick={resetFilters} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <XMarkIcon className="w-4 h-4" />
                  Clear All Filters
                </button>)}
            </div>
          </motion.div>)}
      </AnimatePresence>
    </div>;
  }
}