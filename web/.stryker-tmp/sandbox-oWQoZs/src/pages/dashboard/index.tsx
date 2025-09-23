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
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import { Gift, Heart, TrendingUp, Share2, User, Settings, Sparkles, Calendar, Link as LinkIcon, BarChart3, Target, Clock, Star } from "lucide-react";
import { api, tokenManager } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "../../utils/formatting";
import { User as UserType, Recommendation, GiftLink } from "@/types";
import Link from "next/link";
import toast from "react-hot-toast";
export default function DashboardPage() {
  if (stryMutAct_9fa48("13365")) {
    {}
  } else {
    stryCov_9fa48("13365");
    const router = useRouter();
    const {
      logout
    } = useAuth();
    const [user, setUser] = useState<UserType | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>(stryMutAct_9fa48("13366") ? ["Stryker was here"] : (stryCov_9fa48("13366"), []));
    const [giftLinks, setGiftLinks] = useState<GiftLink[]>(stryMutAct_9fa48("13367") ? ["Stryker was here"] : (stryCov_9fa48("13367"), []));
    const [statistics, setStatistics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("13368") ? false : (stryCov_9fa48("13368"), true));

    // Check authentication and load dashboard data
    useEffect(() => {
      if (stryMutAct_9fa48("13369")) {
        {}
      } else {
        stryCov_9fa48("13369");
        loadDashboardData();
      }
    }, stryMutAct_9fa48("13370") ? ["Stryker was here"] : (stryCov_9fa48("13370"), []));

    // Load all dashboard data
    const loadDashboardData = async () => {
      if (stryMutAct_9fa48("13371")) {
        {}
      } else {
        stryCov_9fa48("13371");
        try {
          if (stryMutAct_9fa48("13372")) {
            {}
          } else {
            stryCov_9fa48("13372");
            setIsLoading(stryMutAct_9fa48("13373") ? false : (stryCov_9fa48("13373"), true));

            // Load user data first - this is essential
            try {
              if (stryMutAct_9fa48("13374")) {
                {}
              } else {
                stryCov_9fa48("13374");
                const userResponse = await api.getCurrentUser();

                // Handle response format - sometimes data is direct, sometimes wrapped
                const userData = stryMutAct_9fa48("13377") ? userResponse.data && userResponse : stryMutAct_9fa48("13376") ? false : stryMutAct_9fa48("13375") ? true : (stryCov_9fa48("13375", "13376", "13377"), userResponse.data || userResponse);
                setUser(userData);
              }
            } catch (error) {
              if (stryMutAct_9fa48("13378")) {
                {}
              } else {
                stryCov_9fa48("13378");
                console.error(stryMutAct_9fa48("13379") ? "" : (stryCov_9fa48("13379"), "Failed to load user data:"), error);
                toast.error(stryMutAct_9fa48("13380") ? "" : (stryCov_9fa48("13380"), "Failed to load user data. Please try logging in again."));
                setIsLoading(stryMutAct_9fa48("13381") ? true : (stryCov_9fa48("13381"), false));
                return;
              }
            }

            // Load optional data - if these fail, dashboard should still work
            // Note: These endpoints may not be implemented in the backend yet

            // Load recent recommendations (optional)
            try {
              if (stryMutAct_9fa48("13382")) {
                {}
              } else {
                stryCov_9fa48("13382");
                const recommendationsResponse = await api.getRecommendations(stryMutAct_9fa48("13383") ? {} : (stryCov_9fa48("13383"), {
                  limit: 6
                }));
                // Handle different response formats - sometimes data is wrapped, sometimes direct
                const recommendationsData = stryMutAct_9fa48("13386") ? recommendationsResponse.data && recommendationsResponse : stryMutAct_9fa48("13385") ? false : stryMutAct_9fa48("13384") ? true : (stryCov_9fa48("13384", "13385", "13386"), recommendationsResponse.data || recommendationsResponse);
                setRecommendations(Array.isArray(recommendationsData) ? recommendationsData : stryMutAct_9fa48("13387") ? ["Stryker was here"] : (stryCov_9fa48("13387"), []));
              }
            } catch (error) {
              if (stryMutAct_9fa48("13388")) {
                {}
              } else {
                stryCov_9fa48("13388");
                console.warn(stryMutAct_9fa48("13389") ? "" : (stryCov_9fa48("13389"), "Recommendations not available:"), error);
                setRecommendations(stryMutAct_9fa48("13390") ? ["Stryker was here"] : (stryCov_9fa48("13390"), []));
              }
            }

            // Load gift links (optional)
            try {
              if (stryMutAct_9fa48("13391")) {
                {}
              } else {
                stryCov_9fa48("13391");
                const giftLinksResponse = await api.getGiftLinks();
                // Handle different response formats - sometimes data is wrapped, sometimes direct
                const giftLinksData = stryMutAct_9fa48("13394") ? giftLinksResponse.data && giftLinksResponse : stryMutAct_9fa48("13393") ? false : stryMutAct_9fa48("13392") ? true : (stryCov_9fa48("13392", "13393", "13394"), giftLinksResponse.data || giftLinksResponse);
                setGiftLinks(Array.isArray(giftLinksData) ? giftLinksData : stryMutAct_9fa48("13395") ? ["Stryker was here"] : (stryCov_9fa48("13395"), []));
              }
            } catch (error) {
              if (stryMutAct_9fa48("13396")) {
                {}
              } else {
                stryCov_9fa48("13396");
                console.warn(stryMutAct_9fa48("13397") ? "" : (stryCov_9fa48("13397"), "Gift links not available:"), error);
                setGiftLinks(stryMutAct_9fa48("13398") ? ["Stryker was here"] : (stryCov_9fa48("13398"), []));
              }
            }

            // Load user statistics (optional)
            try {
              if (stryMutAct_9fa48("13399")) {
                {}
              } else {
                stryCov_9fa48("13399");
                const statsResponse = await api.getUserStatistics();
                // Handle different response formats - sometimes data is wrapped, sometimes direct
                const statsData = stryMutAct_9fa48("13402") ? statsResponse.data && statsResponse : stryMutAct_9fa48("13401") ? false : stryMutAct_9fa48("13400") ? true : (stryCov_9fa48("13400", "13401", "13402"), statsResponse.data || statsResponse);
                setStatistics(statsData);
              }
            } catch (error) {
              if (stryMutAct_9fa48("13403")) {
                {}
              } else {
                stryCov_9fa48("13403");
                console.warn(stryMutAct_9fa48("13404") ? "" : (stryCov_9fa48("13404"), "Statistics not available:"), error);
                setStatistics(stryMutAct_9fa48("13405") ? {} : (stryCov_9fa48("13405"), {
                  total_swipes: 0,
                  recommendations_generated: 0,
                  gift_links_created: 0,
                  total_savings: 0,
                  favorite_categories: stryMutAct_9fa48("13406") ? ["Stryker was here"] : (stryCov_9fa48("13406"), []),
                  activity_score: 0
                })); // Set default stats to avoid loading states
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("13407")) {
            {}
          } else {
            stryCov_9fa48("13407");
            console.error(stryMutAct_9fa48("13408") ? "" : (stryCov_9fa48("13408"), "Unexpected error loading dashboard:"), error);
            toast.error(stryMutAct_9fa48("13409") ? "" : (stryCov_9fa48("13409"), "Failed to load dashboard. Please try again."));
          }
        } finally {
          if (stryMutAct_9fa48("13410")) {
            {}
          } else {
            stryCov_9fa48("13410");
            setIsLoading(stryMutAct_9fa48("13411") ? true : (stryCov_9fa48("13411"), false));
          }
        }
      }
    };

    // Handle logout
    const handleLogout = async () => {
      if (stryMutAct_9fa48("13412")) {
        {}
      } else {
        stryCov_9fa48("13412");
        try {
          if (stryMutAct_9fa48("13413")) {
            {}
          } else {
            stryCov_9fa48("13413");
            await logout(); // Use AuthContext logout for complete cleanup
            // AuthContext logout handles:
            // - Backend API call
            // - Clear all localStorage data
            // - Update global auth state
            // - Show success toast
            // - Redirect to homepage
          }
        } catch (error) {
          if (stryMutAct_9fa48("13414")) {
            {}
          } else {
            stryCov_9fa48("13414");
            console.error(stryMutAct_9fa48("13415") ? "" : (stryCov_9fa48("13415"), "Logout error:"), error);
            toast.error(stryMutAct_9fa48("13416") ? "" : (stryCov_9fa48("13416"), "Logout failed. Please try again."));
          }
        }
      }
    };
    if (stryMutAct_9fa48("13418") ? false : stryMutAct_9fa48("13417") ? true : (stryCov_9fa48("13417", "13418"), isLoading)) {
      if (stryMutAct_9fa48("13419")) {
        {}
      } else {
        stryCov_9fa48("13419");
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("13422") ? false : stryMutAct_9fa48("13421") ? true : stryMutAct_9fa48("13420") ? user : (stryCov_9fa48("13420", "13421", "13422"), !user)) {
      if (stryMutAct_9fa48("13423")) {
        {}
      } else {
        stryCov_9fa48("13423");
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load user data</p>
          <button onClick={stryMutAct_9fa48("13424") ? () => undefined : (stryCov_9fa48("13424"), () => router.reload())} className="mt-2 text-primary-600 hover:text-primary-500">
            Try again
          </button>
        </div>
      </div>;
      }
    }
    const stats = stryMutAct_9fa48("13425") ? [] : (stryCov_9fa48("13425"), [stryMutAct_9fa48("13426") ? {} : (stryCov_9fa48("13426"), {
      label: stryMutAct_9fa48("13427") ? "" : (stryCov_9fa48("13427"), "Total Swipes"),
      value: stryMutAct_9fa48("13430") ? statistics?.total_swipes && 0 : stryMutAct_9fa48("13429") ? false : stryMutAct_9fa48("13428") ? true : (stryCov_9fa48("13428", "13429", "13430"), (stryMutAct_9fa48("13431") ? statistics.total_swipes : (stryCov_9fa48("13431"), statistics?.total_swipes)) || 0),
      icon: <Heart className="w-5 h-5" />,
      color: stryMutAct_9fa48("13432") ? "" : (stryCov_9fa48("13432"), "text-pink-600"),
      bgColor: stryMutAct_9fa48("13433") ? "" : (stryCov_9fa48("13433"), "bg-pink-100")
    }), stryMutAct_9fa48("13434") ? {} : (stryCov_9fa48("13434"), {
      label: stryMutAct_9fa48("13435") ? "" : (stryCov_9fa48("13435"), "Recommendations"),
      value: stryMutAct_9fa48("13438") ? statistics?.recommendations_generated && 0 : stryMutAct_9fa48("13437") ? false : stryMutAct_9fa48("13436") ? true : (stryCov_9fa48("13436", "13437", "13438"), (stryMutAct_9fa48("13439") ? statistics.recommendations_generated : (stryCov_9fa48("13439"), statistics?.recommendations_generated)) || 0),
      icon: <Sparkles className="w-5 h-5" />,
      color: stryMutAct_9fa48("13440") ? "" : (stryCov_9fa48("13440"), "text-purple-600"),
      bgColor: stryMutAct_9fa48("13441") ? "" : (stryCov_9fa48("13441"), "bg-purple-100")
    }), stryMutAct_9fa48("13442") ? {} : (stryCov_9fa48("13442"), {
      label: stryMutAct_9fa48("13443") ? "" : (stryCov_9fa48("13443"), "Gift Links"),
      value: stryMutAct_9fa48("13446") ? statistics?.gift_links_created && 0 : stryMutAct_9fa48("13445") ? false : stryMutAct_9fa48("13444") ? true : (stryCov_9fa48("13444", "13445", "13446"), (stryMutAct_9fa48("13447") ? statistics.gift_links_created : (stryCov_9fa48("13447"), statistics?.gift_links_created)) || 0),
      icon: <LinkIcon className="w-5 h-5" />,
      color: stryMutAct_9fa48("13448") ? "" : (stryCov_9fa48("13448"), "text-blue-600"),
      bgColor: stryMutAct_9fa48("13449") ? "" : (stryCov_9fa48("13449"), "bg-blue-100")
    }), stryMutAct_9fa48("13450") ? {} : (stryCov_9fa48("13450"), {
      label: stryMutAct_9fa48("13451") ? "" : (stryCov_9fa48("13451"), "Saved"),
      value: stryMutAct_9fa48("13452") ? `` : (stryCov_9fa48("13452"), `$${stryMutAct_9fa48("13455") ? statistics?.total_savings && 0 : stryMutAct_9fa48("13454") ? false : stryMutAct_9fa48("13453") ? true : (stryCov_9fa48("13453", "13454", "13455"), (stryMutAct_9fa48("13456") ? statistics.total_savings : (stryCov_9fa48("13456"), statistics?.total_savings)) || 0)}`),
      icon: <Target className="w-5 h-5" />,
      color: stryMutAct_9fa48("13457") ? "" : (stryCov_9fa48("13457"), "text-green-600"),
      bgColor: stryMutAct_9fa48("13458") ? "" : (stryCov_9fa48("13458"), "bg-green-100")
    })]);
    return <>
      <Head>
        <title>Dashboard - aclue</title>
        <meta name="description" content="Your personalised aclue dashboard with recommendations, gift links, and preferences." />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  <Image src="/logo.png" alt="aclue logo" width={20} height={20} className="rounded" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  aclue
                </span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/discover" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Discover
                </Link>
                <Link href="/dashboard/recommendations" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Recommendations
                </Link>
                <Link href="/dashboard/gift-links" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Gift Links
                </Link>
              </nav>

              {/* User Menu */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.subscription_tier} Plan
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link href="/dashboard/settings" className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                    <Settings className="w-5 h-5" />
                  </Link>

                  <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div initial={stryMutAct_9fa48("13459") ? {} : (stryCov_9fa48("13459"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("13460") ? {} : (stryCov_9fa48("13460"), {
            opacity: 1,
            y: 0
          })} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.first_name}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your gift discovery journey.
            </p>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div initial={stryMutAct_9fa48("13461") ? {} : (stryCov_9fa48("13461"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("13462") ? {} : (stryCov_9fa48("13462"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("13463") ? {} : (stryCov_9fa48("13463"), {
            delay: 0.1
          })} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map(stryMutAct_9fa48("13464") ? () => undefined : (stryCov_9fa48("13464"), (stat, index) => <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={stryMutAct_9fa48("13465") ? `` : (stryCov_9fa48("13465"), `p-3 rounded-lg ${stat.bgColor} ${stat.color}`)}>
                    {stat.icon}
                  </div>
                </div>
              </div>))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={stryMutAct_9fa48("13466") ? {} : (stryCov_9fa48("13466"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("13467") ? {} : (stryCov_9fa48("13467"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("13468") ? {} : (stryCov_9fa48("13468"), {
            delay: 0.2
          })} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/discover" className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-6 hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Discover Gifts</h3>
                  <p className="text-primary-100 text-sm">
                    Swipe through new products
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/recommendations" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">View Recommendations</h3>
                  <p className="text-blue-100 text-sm">
                    See your AI suggestions
                  </p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/gift-links/create" className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
              <div className="flex items-center gap-3">
                <Share2 className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Create Gift Link</h3>
                  <p className="text-green-100 text-sm">Share with friends</p>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Recent Recommendations */}
          {stryMutAct_9fa48("13471") ? recommendations && recommendations.length > 0 || <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3
          }} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Recommendations
                </h2>
                <Link href="/dashboard/recommendations" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recommendations || []).slice(0, 6).map(recommendation => <div key={recommendation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                      {recommendation.product.image_url ? <Image src={recommendation.product.image_url} alt={recommendation.product.title || "Product"} fill className="object-cover" /> : <div className="text-gray-400 text-center">
                          <Gift className="w-12 h-12 mx-auto mb-2" />
                          <span className="text-sm">Product Image</span>
                        </div>}
                      <div className="absolute top-3 left-3">
                        <div className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {Math.round((recommendation.confidence_score || 0) * 100)}
                          % match
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                        {recommendation.product.title}
                      </h3>
                      <p className="text-primary-600 font-semibold">
                        £{recommendation.product.price_min}
                        {recommendation.product.price_max && recommendation.product.price_max !== recommendation.product.price_min && ` - £${recommendation.product.price_max}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {recommendation.product.brand}
                      </p>
                    </div>
                  </div>)}
              </div>
            </motion.div> : stryMutAct_9fa48("13470") ? false : stryMutAct_9fa48("13469") ? true : (stryCov_9fa48("13469", "13470", "13471"), (stryMutAct_9fa48("13473") ? recommendations || recommendations.length > 0 : stryMutAct_9fa48("13472") ? true : (stryCov_9fa48("13472", "13473"), recommendations && (stryMutAct_9fa48("13476") ? recommendations.length <= 0 : stryMutAct_9fa48("13475") ? recommendations.length >= 0 : stryMutAct_9fa48("13474") ? true : (stryCov_9fa48("13474", "13475", "13476"), recommendations.length > 0)))) && <motion.div initial={stryMutAct_9fa48("13477") ? {} : (stryCov_9fa48("13477"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("13478") ? {} : (stryCov_9fa48("13478"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("13479") ? {} : (stryCov_9fa48("13479"), {
            delay: 0.3
          })} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Recommendations
                </h2>
                <Link href="/dashboard/recommendations" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stryMutAct_9fa48("13480") ? (recommendations || []).map(recommendation => <div key={recommendation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                      {recommendation.product.image_url ? <Image src={recommendation.product.image_url} alt={recommendation.product.title || "Product"} fill className="object-cover" /> : <div className="text-gray-400 text-center">
                          <Gift className="w-12 h-12 mx-auto mb-2" />
                          <span className="text-sm">Product Image</span>
                        </div>}
                      <div className="absolute top-3 left-3">
                        <div className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {Math.round((recommendation.confidence_score || 0) * 100)}
                          % match
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                        {recommendation.product.title}
                      </h3>
                      <p className="text-primary-600 font-semibold">
                        £{recommendation.product.price_min}
                        {recommendation.product.price_max && recommendation.product.price_max !== recommendation.product.price_min && ` - £${recommendation.product.price_max}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {recommendation.product.brand}
                      </p>
                    </div>
                  </div>) : (stryCov_9fa48("13480"), (stryMutAct_9fa48("13483") ? recommendations && [] : stryMutAct_9fa48("13482") ? false : stryMutAct_9fa48("13481") ? true : (stryCov_9fa48("13481", "13482", "13483"), recommendations || (stryMutAct_9fa48("13484") ? ["Stryker was here"] : (stryCov_9fa48("13484"), [])))).slice(0, 6).map(stryMutAct_9fa48("13485") ? () => undefined : (stryCov_9fa48("13485"), recommendation => <div key={recommendation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                      {recommendation.product.image_url ? <Image src={recommendation.product.image_url} alt={stryMutAct_9fa48("13488") ? recommendation.product.title && "Product" : stryMutAct_9fa48("13487") ? false : stryMutAct_9fa48("13486") ? true : (stryCov_9fa48("13486", "13487", "13488"), recommendation.product.title || (stryMutAct_9fa48("13489") ? "" : (stryCov_9fa48("13489"), "Product")))} fill className="object-cover" /> : <div className="text-gray-400 text-center">
                          <Gift className="w-12 h-12 mx-auto mb-2" />
                          <span className="text-sm">Product Image</span>
                        </div>}
                      <div className="absolute top-3 left-3">
                        <div className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          {Math.round(stryMutAct_9fa48("13490") ? (recommendation.confidence_score || 0) / 100 : (stryCov_9fa48("13490"), (stryMutAct_9fa48("13493") ? recommendation.confidence_score && 0 : stryMutAct_9fa48("13492") ? false : stryMutAct_9fa48("13491") ? true : (stryCov_9fa48("13491", "13492", "13493"), recommendation.confidence_score || 0)) * 100))}
                          % match
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                        {recommendation.product.title}
                      </h3>
                      <p className="text-primary-600 font-semibold">
                        £{recommendation.product.price_min}
                        {stryMutAct_9fa48("13496") ? recommendation.product.price_max && recommendation.product.price_max !== recommendation.product.price_min || ` - £${recommendation.product.price_max}` : stryMutAct_9fa48("13495") ? false : stryMutAct_9fa48("13494") ? true : (stryCov_9fa48("13494", "13495", "13496"), (stryMutAct_9fa48("13498") ? recommendation.product.price_max || recommendation.product.price_max !== recommendation.product.price_min : stryMutAct_9fa48("13497") ? true : (stryCov_9fa48("13497", "13498"), recommendation.product.price_max && (stryMutAct_9fa48("13500") ? recommendation.product.price_max === recommendation.product.price_min : stryMutAct_9fa48("13499") ? true : (stryCov_9fa48("13499", "13500"), recommendation.product.price_max !== recommendation.product.price_min)))) && (stryMutAct_9fa48("13501") ? `` : (stryCov_9fa48("13501"), ` - £${recommendation.product.price_max}`)))}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {recommendation.product.brand}
                      </p>
                    </div>
                  </div>)))}
              </div>
            </motion.div>)}

          {/* Recent Gift Links */}
          {stryMutAct_9fa48("13504") ? giftLinks && giftLinks.length > 0 || <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4
          }} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Gift Links
                </h2>
                <Link href="/dashboard/gift-links" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(giftLinks || []).slice(0, 4).map(giftLink => <div key={giftLink.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {giftLink.title}
                        </h3>
                        {giftLink.recipient_name && <p className="text-sm text-gray-600">
                            For {giftLink.recipient_name}
                          </p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {giftLink.view_count} views
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        {giftLink.products.length} items
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(giftLink.created_at)}
                      </span>
                    </div>
                  </div>)}
              </div>
            </motion.div> : stryMutAct_9fa48("13503") ? false : stryMutAct_9fa48("13502") ? true : (stryCov_9fa48("13502", "13503", "13504"), (stryMutAct_9fa48("13506") ? giftLinks || giftLinks.length > 0 : stryMutAct_9fa48("13505") ? true : (stryCov_9fa48("13505", "13506"), giftLinks && (stryMutAct_9fa48("13509") ? giftLinks.length <= 0 : stryMutAct_9fa48("13508") ? giftLinks.length >= 0 : stryMutAct_9fa48("13507") ? true : (stryCov_9fa48("13507", "13508", "13509"), giftLinks.length > 0)))) && <motion.div initial={stryMutAct_9fa48("13510") ? {} : (stryCov_9fa48("13510"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("13511") ? {} : (stryCov_9fa48("13511"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("13512") ? {} : (stryCov_9fa48("13512"), {
            delay: 0.4
          })} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Gift Links
                </h2>
                <Link href="/dashboard/gift-links" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stryMutAct_9fa48("13513") ? (giftLinks || []).map(giftLink => <div key={giftLink.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {giftLink.title}
                        </h3>
                        {giftLink.recipient_name && <p className="text-sm text-gray-600">
                            For {giftLink.recipient_name}
                          </p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {giftLink.view_count} views
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        {giftLink.products.length} items
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(giftLink.created_at)}
                      </span>
                    </div>
                  </div>) : (stryCov_9fa48("13513"), (stryMutAct_9fa48("13516") ? giftLinks && [] : stryMutAct_9fa48("13515") ? false : stryMutAct_9fa48("13514") ? true : (stryCov_9fa48("13514", "13515", "13516"), giftLinks || (stryMutAct_9fa48("13517") ? ["Stryker was here"] : (stryCov_9fa48("13517"), [])))).slice(0, 4).map(stryMutAct_9fa48("13518") ? () => undefined : (stryCov_9fa48("13518"), giftLink => <div key={giftLink.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {giftLink.title}
                        </h3>
                        {stryMutAct_9fa48("13521") ? giftLink.recipient_name || <p className="text-sm text-gray-600">
                            For {giftLink.recipient_name}
                          </p> : stryMutAct_9fa48("13520") ? false : stryMutAct_9fa48("13519") ? true : (stryCov_9fa48("13519", "13520", "13521"), giftLink.recipient_name && <p className="text-sm text-gray-600">
                            For {giftLink.recipient_name}
                          </p>)}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {giftLink.view_count} views
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        {giftLink.products.length} items
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(giftLink.created_at)}
                      </span>
                    </div>
                  </div>)))}
              </div>
            </motion.div>)}

          {/* Activity Summary */}
          <motion.div initial={stryMutAct_9fa48("13522") ? {} : (stryCov_9fa48("13522"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("13523") ? {} : (stryCov_9fa48("13523"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("13524") ? {} : (stryCov_9fa48("13524"), {
            delay: 0.5
          })} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Activity Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Favorite Categories */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  Favourite Categories
                </h3>
                {(stryMutAct_9fa48("13528") ? statistics?.favorite_categories?.length <= 0 : stryMutAct_9fa48("13527") ? statistics?.favorite_categories?.length >= 0 : stryMutAct_9fa48("13526") ? false : stryMutAct_9fa48("13525") ? true : (stryCov_9fa48("13525", "13526", "13527", "13528"), (stryMutAct_9fa48("13530") ? statistics.favorite_categories?.length : stryMutAct_9fa48("13529") ? statistics?.favorite_categories.length : (stryCov_9fa48("13529", "13530"), statistics?.favorite_categories?.length)) > 0)) ? <div className="space-y-3">
                    {stryMutAct_9fa48("13531") ? statistics.favorite_categories.map((category: string, index: number) => <div key={category} className="flex items-center justify-between">
                          <span className="text-gray-700">{category}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-primary-500 h-2 rounded-full" style={{
                        width: `${Math.max(20, 100 - index * 15)}%`
                      }} />
                          </div>
                        </div>) : (stryCov_9fa48("13531"), statistics.favorite_categories.slice(0, 5).map(stryMutAct_9fa48("13532") ? () => undefined : (stryCov_9fa48("13532"), (category: string, index: number) => <div key={category} className="flex items-center justify-between">
                          <span className="text-gray-700">{category}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-primary-500 h-2 rounded-full" style={stryMutAct_9fa48("13533") ? {} : (stryCov_9fa48("13533"), {
                        width: stryMutAct_9fa48("13534") ? `` : (stryCov_9fa48("13534"), `${stryMutAct_9fa48("13535") ? Math.min(20, 100 - index * 15) : (stryCov_9fa48("13535"), Math.max(20, stryMutAct_9fa48("13536") ? 100 + index * 15 : (stryCov_9fa48("13536"), 100 - (stryMutAct_9fa48("13537") ? index / 15 : (stryCov_9fa48("13537"), index * 15)))))}%`)
                      })} />
                          </div>
                        </div>)))}
                  </div> : <p className="text-gray-500 text-sm">
                    Start swiping to see your favourite categories!
                  </p>}
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Last active: </span>
                    <span className="text-gray-900">
                      {user.last_login ? formatDate(user.last_login) : stryMutAct_9fa48("13538") ? "" : (stryCov_9fa48("13538"), "Today")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Account created: </span>
                    <span className="text-gray-900">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Activity score: </span>
                    <span className="text-gray-900">
                      {stryMutAct_9fa48("13541") ? statistics?.activity_score && 0 : stryMutAct_9fa48("13540") ? false : stryMutAct_9fa48("13539") ? true : (stryCov_9fa48("13539", "13540", "13541"), (stryMutAct_9fa48("13542") ? statistics.activity_score : (stryCov_9fa48("13542"), statistics?.activity_score)) || 0)}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>;
  }
}