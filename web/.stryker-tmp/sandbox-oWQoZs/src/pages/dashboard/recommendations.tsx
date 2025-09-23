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
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, RefreshCw, Star, Heart, ExternalLink, Share2, Gift, TrendingUp, Sparkles, ShoppingBag, Target, Clock } from 'lucide-react';
import { api, tokenManager } from '@/lib/api';
import { Recommendation, RecommendationRequest } from '@/types';
import { generateAffiliateLink, trackAffiliateClick, isValidAmazonUrl, extractASIN } from '@/lib/affiliate';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
interface FilterOptions {
  category?: string;
  budget_min?: number;
  budget_max?: number;
  occasion?: string;
  sort_by?: 'score' | 'price_asc' | 'price_desc' | 'newest';
}
export default function RecommendationsPage() {
  if (stryMutAct_9fa48("13543")) {
    {}
  } else {
    stryCov_9fa48("13543");
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<Recommendation[]>(stryMutAct_9fa48("13544") ? ["Stryker was here"] : (stryCov_9fa48("13544"), []));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("13545") ? false : (stryCov_9fa48("13545"), true));
    const [isRefreshing, setIsRefreshing] = useState(stryMutAct_9fa48("13546") ? true : (stryCov_9fa48("13546"), false));
    const [showFilters, setShowFilters] = useState(stryMutAct_9fa48("13547") ? true : (stryCov_9fa48("13547"), false));
    const [filters, setFilters] = useState<FilterOptions>({});
    const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

    // Check authentication
    useEffect(() => {
      if (stryMutAct_9fa48("13548")) {
        {}
      } else {
        stryCov_9fa48("13548");
        const token = tokenManager.getAccessToken();
        if (stryMutAct_9fa48("13551") ? false : stryMutAct_9fa48("13550") ? true : stryMutAct_9fa48("13549") ? token : (stryCov_9fa48("13549", "13550", "13551"), !token)) {
          if (stryMutAct_9fa48("13552")) {
            {}
          } else {
            stryCov_9fa48("13552");
            router.replace(stryMutAct_9fa48("13553") ? "" : (stryCov_9fa48("13553"), '/auth/login?redirect=/dashboard/recommendations'));
            return;
          }
        }
        loadRecommendations();
      }
    }, stryMutAct_9fa48("13554") ? [] : (stryCov_9fa48("13554"), [router]));

    // Load recommendations with filters
    const loadRecommendations = async (newFilters?: FilterOptions) => {
      if (stryMutAct_9fa48("13555")) {
        {}
      } else {
        stryCov_9fa48("13555");
        try {
          if (stryMutAct_9fa48("13556")) {
            {}
          } else {
            stryCov_9fa48("13556");
            setIsLoading(stryMutAct_9fa48("13557") ? false : (stryCov_9fa48("13557"), true));
            const requestFilters: RecommendationRequest = stryMutAct_9fa48("13558") ? {} : (stryCov_9fa48("13558"), {
              ...filters,
              ...newFilters,
              limit: 50,
              exclude_seen: stryMutAct_9fa48("13559") ? true : (stryCov_9fa48("13559"), false)
            });
            const response = await api.getRecommendations(requestFilters);
            setRecommendations(Array.isArray(response.data) ? response.data : stryMutAct_9fa48("13562") ? response.data.items && [] : stryMutAct_9fa48("13561") ? false : stryMutAct_9fa48("13560") ? true : (stryCov_9fa48("13560", "13561", "13562"), response.data.items || (stryMutAct_9fa48("13563") ? ["Stryker was here"] : (stryCov_9fa48("13563"), []))));
          }
        } catch (error) {
          if (stryMutAct_9fa48("13564")) {
            {}
          } else {
            stryCov_9fa48("13564");
            console.error(stryMutAct_9fa48("13565") ? "" : (stryCov_9fa48("13565"), 'Failed to load recommendations:'), error);
            toast.error(stryMutAct_9fa48("13566") ? "" : (stryCov_9fa48("13566"), 'Failed to load recommendations. Please try again.'));
          }
        } finally {
          if (stryMutAct_9fa48("13567")) {
            {}
          } else {
            stryCov_9fa48("13567");
            setIsLoading(stryMutAct_9fa48("13568") ? true : (stryCov_9fa48("13568"), false));
          }
        }
      }
    };

    // Refresh recommendations
    const handleRefresh = async () => {
      if (stryMutAct_9fa48("13569")) {
        {}
      } else {
        stryCov_9fa48("13569");
        try {
          if (stryMutAct_9fa48("13570")) {
            {}
          } else {
            stryCov_9fa48("13570");
            setIsRefreshing(stryMutAct_9fa48("13571") ? false : (stryCov_9fa48("13571"), true));
            await api.refreshRecommendations();
            await loadRecommendations();
            toast.success(stryMutAct_9fa48("13572") ? "" : (stryCov_9fa48("13572"), 'Recommendations refreshed!'));
          }
        } catch (error) {
          if (stryMutAct_9fa48("13573")) {
            {}
          } else {
            stryCov_9fa48("13573");
            console.error(stryMutAct_9fa48("13574") ? "" : (stryCov_9fa48("13574"), 'Failed to refresh recommendations:'), error);
            toast.error(stryMutAct_9fa48("13575") ? "" : (stryCov_9fa48("13575"), 'Failed to refresh recommendations.'));
          }
        } finally {
          if (stryMutAct_9fa48("13576")) {
            {}
          } else {
            stryCov_9fa48("13576");
            setIsRefreshing(stryMutAct_9fa48("13577") ? true : (stryCov_9fa48("13577"), false));
          }
        }
      }
    };

    // Handle filter changes
    const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
      if (stryMutAct_9fa48("13578")) {
        {}
      } else {
        stryCov_9fa48("13578");
        const updatedFilters = stryMutAct_9fa48("13579") ? {} : (stryCov_9fa48("13579"), {
          ...filters,
          ...newFilters
        });
        setFilters(updatedFilters);
        loadRecommendations(updatedFilters);
      }
    };

    // Handle recommendation click
    const handleRecommendationClick = (recommendation: Recommendation) => {
      if (stryMutAct_9fa48("13580")) {
        {}
      } else {
        stryCov_9fa48("13580");
        setSelectedRecommendation(recommendation);

        // Track click
        api.trackEvent(stryMutAct_9fa48("13581") ? {} : (stryCov_9fa48("13581"), {
          event_name: stryMutAct_9fa48("13582") ? "" : (stryCov_9fa48("13582"), 'recommendation_clicked'),
          properties: stryMutAct_9fa48("13583") ? {} : (stryCov_9fa48("13583"), {
            recommendation_id: recommendation.id,
            product_id: recommendation.product.id,
            score: recommendation.score,
            algorithm: recommendation.algorithm_used
          })
        }));
      }
    };

    // Handle external link click
    const handleExternalClick = async (recommendation: Recommendation) => {
      if (stryMutAct_9fa48("13584")) {
        {}
      } else {
        stryCov_9fa48("13584");
        const product = recommendation.product;

        // Generate affiliate link and track click if it's an Amazon product
        if (stryMutAct_9fa48("13587") ? product.url || isValidAmazonUrl(product.url) : stryMutAct_9fa48("13586") ? false : stryMutAct_9fa48("13585") ? true : (stryCov_9fa48("13585", "13586", "13587"), product.url && isValidAmazonUrl(product.url))) {
          if (stryMutAct_9fa48("13588")) {
            {}
          } else {
            stryCov_9fa48("13588");
            const affiliateUrl = generateAffiliateLink(product.url, stryMutAct_9fa48("13589") ? {} : (stryCov_9fa48("13589"), {
              campaign: stryMutAct_9fa48("13590") ? "" : (stryCov_9fa48("13590"), 'gift_recommendation'),
              medium: stryMutAct_9fa48("13591") ? "" : (stryCov_9fa48("13591"), 'recommendations_page'),
              source: stryMutAct_9fa48("13592") ? "" : (stryCov_9fa48("13592"), 'view_product_button'),
              content: stryMutAct_9fa48("13593") ? "" : (stryCov_9fa48("13593"), 'recommendation_grid')
            }));

            // Track the affiliate click
            await trackAffiliateClick(stryMutAct_9fa48("13594") ? {} : (stryCov_9fa48("13594"), {
              productId: product.id,
              asin: extractASIN(product.url),
              category: stryMutAct_9fa48("13597") ? product.category?.name && 'Unknown' : stryMutAct_9fa48("13596") ? false : stryMutAct_9fa48("13595") ? true : (stryCov_9fa48("13595", "13596", "13597"), (stryMutAct_9fa48("13598") ? product.category.name : (stryCov_9fa48("13598"), product.category?.name)) || (stryMutAct_9fa48("13599") ? "" : (stryCov_9fa48("13599"), 'Unknown'))),
              price: product.price,
              currency: stryMutAct_9fa48("13602") ? product.currency && 'GBP' : stryMutAct_9fa48("13601") ? false : stryMutAct_9fa48("13600") ? true : (stryCov_9fa48("13600", "13601", "13602"), product.currency || (stryMutAct_9fa48("13603") ? "" : (stryCov_9fa48("13603"), 'GBP'))),
              affiliateUrl,
              originalUrl: product.url,
              source: stryMutAct_9fa48("13604") ? "" : (stryCov_9fa48("13604"), 'recommendation')
            }));

            // Track for analytics
            api.trackEvent(stryMutAct_9fa48("13605") ? {} : (stryCov_9fa48("13605"), {
              event_name: stryMutAct_9fa48("13606") ? "" : (stryCov_9fa48("13606"), 'affiliate_click'),
              properties: stryMutAct_9fa48("13607") ? {} : (stryCov_9fa48("13607"), {
                recommendation_id: recommendation.id,
                product_id: product.id,
                affiliate_source: stryMutAct_9fa48("13608") ? "" : (stryCov_9fa48("13608"), 'amazon_associates'),
                price: product.price,
                is_affiliate: stryMutAct_9fa48("13609") ? false : (stryCov_9fa48("13609"), true)
              })
            }));

            // Open affiliate link in new tab
            window.open(affiliateUrl, stryMutAct_9fa48("13610") ? "" : (stryCov_9fa48("13610"), '_blank'), stryMutAct_9fa48("13611") ? "" : (stryCov_9fa48("13611"), 'noopener,noreferrer'));
          }
        } else {
          if (stryMutAct_9fa48("13612")) {
            {}
          } else {
            stryCov_9fa48("13612");
            // Track regular click
            api.trackEvent(stryMutAct_9fa48("13613") ? {} : (stryCov_9fa48("13613"), {
              event_name: stryMutAct_9fa48("13614") ? "" : (stryCov_9fa48("13614"), 'product_click'),
              properties: stryMutAct_9fa48("13615") ? {} : (stryCov_9fa48("13615"), {
                recommendation_id: recommendation.id,
                product_id: product.id,
                price: product.price,
                is_affiliate: stryMutAct_9fa48("13616") ? true : (stryCov_9fa48("13616"), false)
              })
            }));

            // Open regular product link or affiliate URL
            const targetUrl = stryMutAct_9fa48("13619") ? product.affiliate_url && product.url : stryMutAct_9fa48("13618") ? false : stryMutAct_9fa48("13617") ? true : (stryCov_9fa48("13617", "13618", "13619"), product.affiliate_url || product.url);
            if (stryMutAct_9fa48("13621") ? false : stryMutAct_9fa48("13620") ? true : (stryCov_9fa48("13620", "13621"), targetUrl)) {
              if (stryMutAct_9fa48("13622")) {
                {}
              } else {
                stryCov_9fa48("13622");
                window.open(targetUrl, stryMutAct_9fa48("13623") ? "" : (stryCov_9fa48("13623"), '_blank'), stryMutAct_9fa48("13624") ? "" : (stryCov_9fa48("13624"), 'noopener,noreferrer'));
              }
            }
          }
        }
      }
    };

    // Handle share recommendation
    const handleShare = async (recommendation: Recommendation) => {
      if (stryMutAct_9fa48("13625")) {
        {}
      } else {
        stryCov_9fa48("13625");
        if (stryMutAct_9fa48("13627") ? false : stryMutAct_9fa48("13626") ? true : (stryCov_9fa48("13626", "13627"), navigator.share)) {
          if (stryMutAct_9fa48("13628")) {
            {}
          } else {
            stryCov_9fa48("13628");
            try {
              if (stryMutAct_9fa48("13629")) {
                {}
              } else {
                stryCov_9fa48("13629");
                await navigator.share(stryMutAct_9fa48("13630") ? {} : (stryCov_9fa48("13630"), {
                  title: recommendation.product.name,
                  text: stryMutAct_9fa48("13631") ? `` : (stryCov_9fa48("13631"), `Check out this gift recommendation from aclue!`),
                  url: window.location.origin + (stryMutAct_9fa48("13632") ? `` : (stryCov_9fa48("13632"), `/products/${recommendation.product.id}`))
                }));
              }
            } catch (error) {
              // User cancelled sharing
            }
          }
        } else {
          if (stryMutAct_9fa48("13633")) {
            {}
          } else {
            stryCov_9fa48("13633");
            // Fallback to clipboard
            const shareUrl = stryMutAct_9fa48("13634") ? `` : (stryCov_9fa48("13634"), `${window.location.origin}/products/${recommendation.product.id}`);
            await navigator.clipboard.writeText(shareUrl);
            toast.success(stryMutAct_9fa48("13635") ? "" : (stryCov_9fa48("13635"), 'Link copied to clipboard!'));
          }
        }
      }
    };

    // Format price
    const formatPrice = (price: number, currency: string = stryMutAct_9fa48("13636") ? "" : (stryCov_9fa48("13636"), 'GBP')) => {
      if (stryMutAct_9fa48("13637")) {
        {}
      } else {
        stryCov_9fa48("13637");
        return new Intl.NumberFormat(stryMutAct_9fa48("13638") ? "" : (stryCov_9fa48("13638"), 'en-GB'), stryMutAct_9fa48("13639") ? {} : (stryCov_9fa48("13639"), {
          style: stryMutAct_9fa48("13640") ? "" : (stryCov_9fa48("13640"), 'currency'),
          currency: currency
        })).format(price);
      }
    };

    // Get confidence color
    const getConfidenceColor = (confidence: number) => {
      if (stryMutAct_9fa48("13641")) {
        {}
      } else {
        stryCov_9fa48("13641");
        if (stryMutAct_9fa48("13645") ? confidence < 0.8 : stryMutAct_9fa48("13644") ? confidence > 0.8 : stryMutAct_9fa48("13643") ? false : stryMutAct_9fa48("13642") ? true : (stryCov_9fa48("13642", "13643", "13644", "13645"), confidence >= 0.8)) return stryMutAct_9fa48("13646") ? "" : (stryCov_9fa48("13646"), 'text-green-600 bg-green-100');
        if (stryMutAct_9fa48("13650") ? confidence < 0.6 : stryMutAct_9fa48("13649") ? confidence > 0.6 : stryMutAct_9fa48("13648") ? false : stryMutAct_9fa48("13647") ? true : (stryCov_9fa48("13647", "13648", "13649", "13650"), confidence >= 0.6)) return stryMutAct_9fa48("13651") ? "" : (stryCov_9fa48("13651"), 'text-yellow-600 bg-yellow-100');
        return stryMutAct_9fa48("13652") ? "" : (stryCov_9fa48("13652"), 'text-gray-600 bg-gray-100');
      }
    };
    const occasions = stryMutAct_9fa48("13653") ? [] : (stryCov_9fa48("13653"), [stryMutAct_9fa48("13654") ? "" : (stryCov_9fa48("13654"), 'Birthday'), stryMutAct_9fa48("13655") ? "" : (stryCov_9fa48("13655"), 'Christmas'), stryMutAct_9fa48("13656") ? "" : (stryCov_9fa48("13656"), 'Anniversary'), stryMutAct_9fa48("13657") ? "" : (stryCov_9fa48("13657"), 'Wedding'), stryMutAct_9fa48("13658") ? "" : (stryCov_9fa48("13658"), 'Graduation'), stryMutAct_9fa48("13659") ? "" : (stryCov_9fa48("13659"), 'Baby Shower')]);
    const categories = stryMutAct_9fa48("13660") ? [] : (stryCov_9fa48("13660"), [stryMutAct_9fa48("13661") ? "" : (stryCov_9fa48("13661"), 'Electronics'), stryMutAct_9fa48("13662") ? "" : (stryCov_9fa48("13662"), 'Fashion'), stryMutAct_9fa48("13663") ? "" : (stryCov_9fa48("13663"), 'Home & Garden'), stryMutAct_9fa48("13664") ? "" : (stryCov_9fa48("13664"), 'Books'), stryMutAct_9fa48("13665") ? "" : (stryCov_9fa48("13665"), 'Sports'), stryMutAct_9fa48("13666") ? "" : (stryCov_9fa48("13666"), 'Beauty'), stryMutAct_9fa48("13667") ? "" : (stryCov_9fa48("13667"), 'Toys')]);
    return <>
      <Head>
        <title>Recommendations - aclue</title>
        <meta name="description" content="Your personalized gift recommendations powered by AI" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Link>
                
                <h1 className="text-xl font-semibold text-gray-900">
                  AI Recommendations
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={stryMutAct_9fa48("13668") ? () => undefined : (stryCov_9fa48("13668"), () => setShowFilters(stryMutAct_9fa48("13669") ? showFilters : (stryCov_9fa48("13669"), !showFilters)))} className={stryMutAct_9fa48("13670") ? `` : (stryCov_9fa48("13670"), `flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${showFilters ? stryMutAct_9fa48("13671") ? "" : (stryCov_9fa48("13671"), 'bg-primary-50 border-primary-200 text-primary-700') : stryMutAct_9fa48("13672") ? "" : (stryCov_9fa48("13672"), 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50')}`)}>
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <button onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
                  <RefreshCw className={stryMutAct_9fa48("13673") ? `` : (stryCov_9fa48("13673"), `w-4 h-4 ${isRefreshing ? stryMutAct_9fa48("13674") ? "" : (stryCov_9fa48("13674"), 'animate-spin') : stryMutAct_9fa48("13675") ? "Stryker was here!" : (stryCov_9fa48("13675"), '')}`)} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Filters Panel */}
        <AnimatePresence>
          {stryMutAct_9fa48("13678") ? showFilters || <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select value={filters.category || ''} onChange={e => handleFilterChange({
                    category: e.target.value || undefined
                  })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="">All Categories</option>
                      {categories.map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" value={filters.budget_min || ''} onChange={e => handleFilterChange({
                      budget_min: e.target.value ? Number(e.target.value) : undefined
                    })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                      <input type="number" placeholder="Max" value={filters.budget_max || ''} onChange={e => handleFilterChange({
                      budget_max: e.target.value ? Number(e.target.value) : undefined
                    })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                  </div>

                  {/* Occasion Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <select value={filters.occasion || ''} onChange={e => handleFilterChange({
                    occasion: e.target.value || undefined
                  })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="">Any Occasion</option>
                      {occasions.map(occasion => <option key={occasion} value={occasion}>{occasion}</option>)}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select value={filters.sort_by || 'score'} onChange={e => handleFilterChange({
                    sort_by: e.target.value as any
                  })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="score">Best Match</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div> : stryMutAct_9fa48("13677") ? false : stryMutAct_9fa48("13676") ? true : (stryCov_9fa48("13676", "13677", "13678"), showFilters && <motion.div initial={stryMutAct_9fa48("13679") ? {} : (stryCov_9fa48("13679"), {
            opacity: 0,
            height: 0
          })} animate={stryMutAct_9fa48("13680") ? {} : (stryCov_9fa48("13680"), {
            opacity: 1,
            height: stryMutAct_9fa48("13681") ? "" : (stryCov_9fa48("13681"), 'auto')
          })} exit={stryMutAct_9fa48("13682") ? {} : (stryCov_9fa48("13682"), {
            opacity: 0,
            height: 0
          })} className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select value={stryMutAct_9fa48("13685") ? filters.category && '' : stryMutAct_9fa48("13684") ? false : stryMutAct_9fa48("13683") ? true : (stryCov_9fa48("13683", "13684", "13685"), filters.category || (stryMutAct_9fa48("13686") ? "Stryker was here!" : (stryCov_9fa48("13686"), '')))} onChange={stryMutAct_9fa48("13687") ? () => undefined : (stryCov_9fa48("13687"), e => handleFilterChange(stryMutAct_9fa48("13688") ? {} : (stryCov_9fa48("13688"), {
                    category: stryMutAct_9fa48("13691") ? e.target.value && undefined : stryMutAct_9fa48("13690") ? false : stryMutAct_9fa48("13689") ? true : (stryCov_9fa48("13689", "13690", "13691"), e.target.value || undefined)
                  })))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="">All Categories</option>
                      {categories.map(stryMutAct_9fa48("13692") ? () => undefined : (stryCov_9fa48("13692"), category => <option key={category} value={category}>{category}</option>))}
                    </select>
                  </div>

                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" value={stryMutAct_9fa48("13695") ? filters.budget_min && '' : stryMutAct_9fa48("13694") ? false : stryMutAct_9fa48("13693") ? true : (stryCov_9fa48("13693", "13694", "13695"), filters.budget_min || (stryMutAct_9fa48("13696") ? "Stryker was here!" : (stryCov_9fa48("13696"), '')))} onChange={stryMutAct_9fa48("13697") ? () => undefined : (stryCov_9fa48("13697"), e => handleFilterChange(stryMutAct_9fa48("13698") ? {} : (stryCov_9fa48("13698"), {
                      budget_min: e.target.value ? Number(e.target.value) : undefined
                    })))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                      <input type="number" placeholder="Max" value={stryMutAct_9fa48("13701") ? filters.budget_max && '' : stryMutAct_9fa48("13700") ? false : stryMutAct_9fa48("13699") ? true : (stryCov_9fa48("13699", "13700", "13701"), filters.budget_max || (stryMutAct_9fa48("13702") ? "Stryker was here!" : (stryCov_9fa48("13702"), '')))} onChange={stryMutAct_9fa48("13703") ? () => undefined : (stryCov_9fa48("13703"), e => handleFilterChange(stryMutAct_9fa48("13704") ? {} : (stryCov_9fa48("13704"), {
                      budget_max: e.target.value ? Number(e.target.value) : undefined
                    })))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                  </div>

                  {/* Occasion Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <select value={stryMutAct_9fa48("13707") ? filters.occasion && '' : stryMutAct_9fa48("13706") ? false : stryMutAct_9fa48("13705") ? true : (stryCov_9fa48("13705", "13706", "13707"), filters.occasion || (stryMutAct_9fa48("13708") ? "Stryker was here!" : (stryCov_9fa48("13708"), '')))} onChange={stryMutAct_9fa48("13709") ? () => undefined : (stryCov_9fa48("13709"), e => handleFilterChange(stryMutAct_9fa48("13710") ? {} : (stryCov_9fa48("13710"), {
                    occasion: stryMutAct_9fa48("13713") ? e.target.value && undefined : stryMutAct_9fa48("13712") ? false : stryMutAct_9fa48("13711") ? true : (stryCov_9fa48("13711", "13712", "13713"), e.target.value || undefined)
                  })))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="">Any Occasion</option>
                      {occasions.map(stryMutAct_9fa48("13714") ? () => undefined : (stryCov_9fa48("13714"), occasion => <option key={occasion} value={occasion}>{occasion}</option>))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select value={stryMutAct_9fa48("13717") ? filters.sort_by && 'score' : stryMutAct_9fa48("13716") ? false : stryMutAct_9fa48("13715") ? true : (stryCov_9fa48("13715", "13716", "13717"), filters.sort_by || (stryMutAct_9fa48("13718") ? "" : (stryCov_9fa48("13718"), 'score')))} onChange={stryMutAct_9fa48("13719") ? () => undefined : (stryCov_9fa48("13719"), e => handleFilterChange(stryMutAct_9fa48("13720") ? {} : (stryCov_9fa48("13720"), {
                    sort_by: e.target.value as any
                  })))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="score">Best Match</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>)}
        </AnimatePresence>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {isLoading ?
          // Loading State
          <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your recommendations...</p>
              </div>
            </div> : (stryMutAct_9fa48("13723") ? recommendations.length !== 0 : stryMutAct_9fa48("13722") ? false : stryMutAct_9fa48("13721") ? true : (stryCov_9fa48("13721", "13722", "13723"), recommendations.length === 0)) ?
          // Empty State
          <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No recommendations yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start swiping on products to train our AI and get personalized recommendations.
              </p>
              <Link href="/discover" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                <Sparkles className="w-5 h-5" />
                Start Discovering
              </Link>
            </div> :
          // Recommendations Grid
          <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Recommendations
                  </h2>
                  <p className="text-gray-600">
                    {recommendations.length} personalized suggestions found
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString(stryMutAct_9fa48("13724") ? "" : (stryCov_9fa48("13724"), 'en-GB'))}
                </div>
              </div>

              {/* Recommendations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recommendations.map(stryMutAct_9fa48("13725") ? () => undefined : (stryCov_9fa48("13725"), (recommendation, index) => <motion.div key={recommendation.id} initial={stryMutAct_9fa48("13726") ? {} : (stryCov_9fa48("13726"), {
                opacity: 0,
                y: 20
              })} animate={stryMutAct_9fa48("13727") ? {} : (stryCov_9fa48("13727"), {
                opacity: 1,
                y: 0
              })} transition={stryMutAct_9fa48("13728") ? {} : (stryCov_9fa48("13728"), {
                delay: stryMutAct_9fa48("13729") ? index / 0.1 : (stryCov_9fa48("13729"), index * 0.1)
              })} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={stryMutAct_9fa48("13730") ? () => undefined : (stryCov_9fa48("13730"), () => handleRecommendationClick(recommendation))}>
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image src={recommendation.product.image_url} alt={recommendation.product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      
                      {/* Match Score Badge */}
                      <div className="absolute top-3 left-3">
                        <div className={stryMutAct_9fa48("13731") ? `` : (stryCov_9fa48("13731"), `px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getConfidenceColor(recommendation.confidence)}`)}>
                          <Star className="w-3 h-3 fill-current" />
                          {Math.round(stryMutAct_9fa48("13732") ? recommendation.score / 100 : (stryCov_9fa48("13732"), recommendation.score * 100))}% match
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button onClick={e => {
                        if (stryMutAct_9fa48("13733")) {
                          {}
                        } else {
                          stryCov_9fa48("13733");
                          e.stopPropagation();
                          handleShare(recommendation);
                        }
                      }} className="p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button onClick={e => {
                        if (stryMutAct_9fa48("13734")) {
                          {}
                        } else {
                          stryCov_9fa48("13734");
                          e.stopPropagation();
                          handleExternalClick(recommendation);
                        }
                      }} className="p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Product Badges */}
                      <div className="absolute bottom-3 left-3">
                        {stryMutAct_9fa48("13737") ? recommendation.product.is_featured || <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium mb-1">
                            Featured
                          </div> : stryMutAct_9fa48("13736") ? false : stryMutAct_9fa48("13735") ? true : (stryCov_9fa48("13735", "13736", "13737"), recommendation.product.is_featured && <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium mb-1">
                            Featured
                          </div>)}
                        {stryMutAct_9fa48("13740") ? recommendation.product.is_trending || <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            🔥 Trending
                          </div> : stryMutAct_9fa48("13739") ? false : stryMutAct_9fa48("13738") ? true : (stryCov_9fa48("13738", "13739", "13740"), recommendation.product.is_trending && <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            🔥 Trending
                          </div>)}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                          {recommendation.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">{recommendation.product.brand}</p>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(recommendation.product.price, recommendation.product.currency)}
                          </span>
                          {stryMutAct_9fa48("13743") ? recommendation.product.original_price && recommendation.product.original_price > recommendation.product.price || <span className="text-sm text-gray-500 line-through">
                              {formatPrice(recommendation.product.original_price, recommendation.product.currency)}
                            </span> : stryMutAct_9fa48("13742") ? false : stryMutAct_9fa48("13741") ? true : (stryCov_9fa48("13741", "13742", "13743"), (stryMutAct_9fa48("13745") ? recommendation.product.original_price || recommendation.product.original_price > recommendation.product.price : stryMutAct_9fa48("13744") ? true : (stryCov_9fa48("13744", "13745"), recommendation.product.original_price && (stryMutAct_9fa48("13748") ? recommendation.product.original_price <= recommendation.product.price : stryMutAct_9fa48("13747") ? recommendation.product.original_price >= recommendation.product.price : stryMutAct_9fa48("13746") ? true : (stryCov_9fa48("13746", "13747", "13748"), recommendation.product.original_price > recommendation.product.price)))) && <span className="text-sm text-gray-500 line-through">
                              {formatPrice(recommendation.product.original_price, recommendation.product.currency)}
                            </span>)}
                        </div>
                        
                        {stryMutAct_9fa48("13751") ? recommendation.product.rating || <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {recommendation.product.rating.toFixed(1)}
                            </span>
                          </div> : stryMutAct_9fa48("13750") ? false : stryMutAct_9fa48("13749") ? true : (stryCov_9fa48("13749", "13750", "13751"), recommendation.product.rating && <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {recommendation.product.rating.toFixed(1)}
                            </span>
                          </div>)}
                      </div>

                      {/* Algorithm Info */}
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span>Confidence:</span>
                          <span className="font-medium">{Math.round(stryMutAct_9fa48("13752") ? recommendation.confidence / 100 : (stryCov_9fa48("13752"), recommendation.confidence * 100))}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Algorithm:</span>
                          <span className="font-medium capitalize">{recommendation.algorithm_used.replace(stryMutAct_9fa48("13753") ? "" : (stryCov_9fa48("13753"), '_'), stryMutAct_9fa48("13754") ? "" : (stryCov_9fa48("13754"), ' '))}</span>
                        </div>
                      </div>

                      {/* Reasoning */}
                      {stryMutAct_9fa48("13757") ? recommendation.reasoning && recommendation.reasoning.length > 0 || <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-600">
                            <strong>Why we recommend:</strong> {recommendation.reasoning[0]}
                          </p>
                        </div> : stryMutAct_9fa48("13756") ? false : stryMutAct_9fa48("13755") ? true : (stryCov_9fa48("13755", "13756", "13757"), (stryMutAct_9fa48("13759") ? recommendation.reasoning || recommendation.reasoning.length > 0 : stryMutAct_9fa48("13758") ? true : (stryCov_9fa48("13758", "13759"), recommendation.reasoning && (stryMutAct_9fa48("13762") ? recommendation.reasoning.length <= 0 : stryMutAct_9fa48("13761") ? recommendation.reasoning.length >= 0 : stryMutAct_9fa48("13760") ? true : (stryCov_9fa48("13760", "13761", "13762"), recommendation.reasoning.length > 0)))) && <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-600">
                            <strong>Why we recommend:</strong> {recommendation.reasoning[0]}
                          </p>
                        </div>)}

                    </div>
                  </motion.div>))}
              </div>
            </>}
        </main>
      </div>

      {/* Recommendation Detail Modal */}
      <AnimatePresence>
        {stryMutAct_9fa48("13765") ? selectedRecommendation || <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedRecommendation(null)}>
            <motion.div initial={{
            scale: 0.9,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} exit={{
            scale: 0.9,
            opacity: 0
          }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="relative h-64">
                <Image src={selectedRecommendation.product.image_url} alt={selectedRecommendation.product.name} fill className="object-cover" />
                <button onClick={() => setSelectedRecommendation(null)} className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors">
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedRecommendation.product.name}
                    </h2>
                    <p className="text-gray-600">{selectedRecommendation.product.brand}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatPrice(selectedRecommendation.product.price, selectedRecommendation.product.currency)}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getConfidenceColor(selectedRecommendation.confidence)}`}>
                      <Star className="w-4 h-4 fill-current" />
                      {Math.round(selectedRecommendation.score * 100)}% match
                    </div>
                  </div>
                </div>

                {selectedRecommendation.product.description && <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedRecommendation.product.description}
                    </p>
                  </div>}

                {selectedRecommendation.reasoning && selectedRecommendation.reasoning.length > 0 && <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Why We Recommend This</h3>
                    <ul className="space-y-2">
                      {selectedRecommendation.reasoning.map((reason, index) => <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                          {reason}
                        </li>)}
                    </ul>
                  </div>}


                <div className="flex gap-3">
                  <button onClick={() => handleExternalClick(selectedRecommendation)} className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2" title={selectedRecommendation.product.url && isValidAmazonUrl(selectedRecommendation.product.url) ? 'View on Amazon (affiliate link)' : 'View product'}>
                    <ShoppingBag className="w-5 h-5" />
                    {selectedRecommendation.product.url && isValidAmazonUrl(selectedRecommendation.product.url) ? 'View on Amazon' : 'View Product'}
                  </button>
                  <button onClick={() => handleShare(selectedRecommendation)} className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div> : stryMutAct_9fa48("13764") ? false : stryMutAct_9fa48("13763") ? true : (stryCov_9fa48("13763", "13764", "13765"), selectedRecommendation && <motion.div initial={stryMutAct_9fa48("13766") ? {} : (stryCov_9fa48("13766"), {
          opacity: 0
        })} animate={stryMutAct_9fa48("13767") ? {} : (stryCov_9fa48("13767"), {
          opacity: 1
        })} exit={stryMutAct_9fa48("13768") ? {} : (stryCov_9fa48("13768"), {
          opacity: 0
        })} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={stryMutAct_9fa48("13769") ? () => undefined : (stryCov_9fa48("13769"), () => setSelectedRecommendation(null))}>
            <motion.div initial={stryMutAct_9fa48("13770") ? {} : (stryCov_9fa48("13770"), {
            scale: 0.9,
            opacity: 0
          })} animate={stryMutAct_9fa48("13771") ? {} : (stryCov_9fa48("13771"), {
            scale: 1,
            opacity: 1
          })} exit={stryMutAct_9fa48("13772") ? {} : (stryCov_9fa48("13772"), {
            scale: 0.9,
            opacity: 0
          })} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={stryMutAct_9fa48("13773") ? () => undefined : (stryCov_9fa48("13773"), e => e.stopPropagation())}>
              <div className="relative h-64">
                <Image src={selectedRecommendation.product.image_url} alt={selectedRecommendation.product.name} fill className="object-cover" />
                <button onClick={stryMutAct_9fa48("13774") ? () => undefined : (stryCov_9fa48("13774"), () => setSelectedRecommendation(null))} className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-colors">
                  ×
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedRecommendation.product.name}
                    </h2>
                    <p className="text-gray-600">{selectedRecommendation.product.brand}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {formatPrice(selectedRecommendation.product.price, selectedRecommendation.product.currency)}
                    </div>
                    <div className={stryMutAct_9fa48("13775") ? `` : (stryCov_9fa48("13775"), `inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getConfidenceColor(selectedRecommendation.confidence)}`)}>
                      <Star className="w-4 h-4 fill-current" />
                      {Math.round(stryMutAct_9fa48("13776") ? selectedRecommendation.score / 100 : (stryCov_9fa48("13776"), selectedRecommendation.score * 100))}% match
                    </div>
                  </div>
                </div>

                {stryMutAct_9fa48("13779") ? selectedRecommendation.product.description || <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedRecommendation.product.description}
                    </p>
                  </div> : stryMutAct_9fa48("13778") ? false : stryMutAct_9fa48("13777") ? true : (stryCov_9fa48("13777", "13778", "13779"), selectedRecommendation.product.description && <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedRecommendation.product.description}
                    </p>
                  </div>)}

                {stryMutAct_9fa48("13782") ? selectedRecommendation.reasoning && selectedRecommendation.reasoning.length > 0 || <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Why We Recommend This</h3>
                    <ul className="space-y-2">
                      {selectedRecommendation.reasoning.map((reason, index) => <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                          {reason}
                        </li>)}
                    </ul>
                  </div> : stryMutAct_9fa48("13781") ? false : stryMutAct_9fa48("13780") ? true : (stryCov_9fa48("13780", "13781", "13782"), (stryMutAct_9fa48("13784") ? selectedRecommendation.reasoning || selectedRecommendation.reasoning.length > 0 : stryMutAct_9fa48("13783") ? true : (stryCov_9fa48("13783", "13784"), selectedRecommendation.reasoning && (stryMutAct_9fa48("13787") ? selectedRecommendation.reasoning.length <= 0 : stryMutAct_9fa48("13786") ? selectedRecommendation.reasoning.length >= 0 : stryMutAct_9fa48("13785") ? true : (stryCov_9fa48("13785", "13786", "13787"), selectedRecommendation.reasoning.length > 0)))) && <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Why We Recommend This</h3>
                    <ul className="space-y-2">
                      {selectedRecommendation.reasoning.map(stryMutAct_9fa48("13788") ? () => undefined : (stryCov_9fa48("13788"), (reason, index) => <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                          {reason}
                        </li>))}
                    </ul>
                  </div>)}


                <div className="flex gap-3">
                  <button onClick={stryMutAct_9fa48("13789") ? () => undefined : (stryCov_9fa48("13789"), () => handleExternalClick(selectedRecommendation))} className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2" title={(stryMutAct_9fa48("13792") ? selectedRecommendation.product.url || isValidAmazonUrl(selectedRecommendation.product.url) : stryMutAct_9fa48("13791") ? false : stryMutAct_9fa48("13790") ? true : (stryCov_9fa48("13790", "13791", "13792"), selectedRecommendation.product.url && isValidAmazonUrl(selectedRecommendation.product.url))) ? stryMutAct_9fa48("13793") ? "" : (stryCov_9fa48("13793"), 'View on Amazon (affiliate link)') : stryMutAct_9fa48("13794") ? "" : (stryCov_9fa48("13794"), 'View product')}>
                    <ShoppingBag className="w-5 h-5" />
                    {(stryMutAct_9fa48("13797") ? selectedRecommendation.product.url || isValidAmazonUrl(selectedRecommendation.product.url) : stryMutAct_9fa48("13796") ? false : stryMutAct_9fa48("13795") ? true : (stryCov_9fa48("13795", "13796", "13797"), selectedRecommendation.product.url && isValidAmazonUrl(selectedRecommendation.product.url))) ? stryMutAct_9fa48("13798") ? "" : (stryCov_9fa48("13798"), 'View on Amazon') : stryMutAct_9fa48("13799") ? "" : (stryCov_9fa48("13799"), 'View Product')}
                  </button>
                  <button onClick={stryMutAct_9fa48("13800") ? () => undefined : (stryCov_9fa48("13800"), () => handleShare(selectedRecommendation))} className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </>;
  }
}