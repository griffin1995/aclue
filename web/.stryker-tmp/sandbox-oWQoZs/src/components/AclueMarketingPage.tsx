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
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Heart, Zap, Users, Star, ArrowRight, Play, CheckCircle, Smartphone, Monitor, Globe } from 'lucide-react';

/**
 * aclue Marketing Page - App Router Client Component
 *
 * Complete marketing site for aclue with all features, testimonials, and CTAs.
 * This component provides the full application experience when not in maintenance mode.
 *
 * Features:
 * - Hero section with value proposition
 * - Features showcase with icons and descriptions
 * - How it works step-by-step guide
 * - Customer testimonials and social proof
 * - Platform availability section
 * - Call-to-action sections
 * - Footer with links and company information
 *
 * Integration:
 * - Links to App Router authentication routes
 * - Preserves all existing design and animations
 * - Optimised for App Router performance
 * - Maintains brand consistency with aclue_text_clean.png
 */

export default function aclueMarketingPage() {
  if (stryMutAct_9fa48("2657")) {
    {}
  } else {
    stryCov_9fa48("2657");
    const features = stryMutAct_9fa48("2658") ? [] : (stryCov_9fa48("2658"), [stryMutAct_9fa48("2659") ? {} : (stryCov_9fa48("2659"), {
      icon: <Sparkles className="w-6 h-6" />,
      title: stryMutAct_9fa48("2660") ? "" : (stryCov_9fa48("2660"), 'AI-Powered Recommendations'),
      description: stryMutAct_9fa48("2661") ? "" : (stryCov_9fa48("2661"), 'Our advanced ML algorithms learn your preferences to suggest perfect gifts every time.')
    }), stryMutAct_9fa48("2662") ? {} : (stryCov_9fa48("2662"), {
      icon: <Heart className="w-6 h-6" />,
      title: stryMutAct_9fa48("2663") ? "" : (stryCov_9fa48("2663"), 'Swipe-Based Discovery'),
      description: stryMutAct_9fa48("2664") ? "" : (stryCov_9fa48("2664"), 'Like Tinder for gifts! Swipe through products to train our AI and discover what you love.')
    }), stryMutAct_9fa48("2665") ? {} : (stryCov_9fa48("2665"), {
      icon: <Zap className="w-6 h-6" />,
      title: stryMutAct_9fa48("2666") ? "" : (stryCov_9fa48("2666"), 'Instant Gift Links'),
      description: stryMutAct_9fa48("2667") ? "" : (stryCov_9fa48("2667"), 'Create shareable gift links in seconds. Perfect for wishlists and gift exchanges.')
    }), stryMutAct_9fa48("2668") ? {} : (stryCov_9fa48("2668"), {
      icon: <Users className="w-6 h-6" />,
      title: stryMutAct_9fa48("2669") ? "" : (stryCov_9fa48("2669"), 'Social Gifting'),
      description: stryMutAct_9fa48("2670") ? "" : (stryCov_9fa48("2670"), 'Share with friends and family. Collaborate on gift ideas and never give duplicate gifts.')
    })]);
    const stats = stryMutAct_9fa48("2671") ? [] : (stryCov_9fa48("2671"), [stryMutAct_9fa48("2672") ? {} : (stryCov_9fa48("2672"), {
      number: stryMutAct_9fa48("2673") ? "" : (stryCov_9fa48("2673"), '1M+'),
      label: stryMutAct_9fa48("2674") ? "" : (stryCov_9fa48("2674"), 'Products Curated')
    }), stryMutAct_9fa48("2675") ? {} : (stryCov_9fa48("2675"), {
      number: stryMutAct_9fa48("2676") ? "" : (stryCov_9fa48("2676"), '50K+'),
      label: stryMutAct_9fa48("2677") ? "" : (stryCov_9fa48("2677"), 'Happy Users')
    }), stryMutAct_9fa48("2678") ? {} : (stryCov_9fa48("2678"), {
      number: stryMutAct_9fa48("2679") ? "" : (stryCov_9fa48("2679"), '95%'),
      label: stryMutAct_9fa48("2680") ? "" : (stryCov_9fa48("2680"), 'Satisfaction Rate')
    }), stryMutAct_9fa48("2681") ? {} : (stryCov_9fa48("2681"), {
      number: stryMutAct_9fa48("2682") ? "" : (stryCov_9fa48("2682"), '24/7'),
      label: stryMutAct_9fa48("2683") ? "" : (stryCov_9fa48("2683"), 'AI Learning')
    })]);
    const testimonials = stryMutAct_9fa48("2684") ? [] : (stryCov_9fa48("2684"), [stryMutAct_9fa48("2685") ? {} : (stryCov_9fa48("2685"), {
      name: stryMutAct_9fa48("2686") ? "" : (stryCov_9fa48("2686"), 'Sarah Johnson'),
      role: stryMutAct_9fa48("2687") ? "" : (stryCov_9fa48("2687"), 'Gift Enthusiast'),
      avatar: stryMutAct_9fa48("2688") ? "" : (stryCov_9fa48("2688"), '/images/testimonials/sarah.jpg'),
      content: stryMutAct_9fa48("2689") ? "" : (stryCov_9fa48("2689"), 'aclue helped me find the perfect birthday gift for my sister. The AI-powered insights were spot-on!'),
      rating: 5
    }), stryMutAct_9fa48("2690") ? {} : (stryCov_9fa48("2690"), {
      name: stryMutAct_9fa48("2691") ? "" : (stryCov_9fa48("2691"), 'Mike Chen'),
      role: stryMutAct_9fa48("2692") ? "" : (stryCov_9fa48("2692"), 'Busy Professional'),
      avatar: stryMutAct_9fa48("2693") ? "" : (stryCov_9fa48("2693"), '/images/testimonials/mike.jpg'),
      content: stryMutAct_9fa48("2694") ? "" : (stryCov_9fa48("2694"), 'As someone who struggles with gift-giving, this app is a lifesaver. Quick, easy, and always great suggestions.'),
      rating: 5
    }), stryMutAct_9fa48("2695") ? {} : (stryCov_9fa48("2695"), {
      name: stryMutAct_9fa48("2696") ? "" : (stryCov_9fa48("2696"), 'Emma Davis'),
      role: stryMutAct_9fa48("2697") ? "" : (stryCov_9fa48("2697"), 'Mother of 3'),
      avatar: stryMutAct_9fa48("2698") ? "" : (stryCov_9fa48("2698"), '/images/testimonials/emma.jpg'),
      content: stryMutAct_9fa48("2699") ? "" : (stryCov_9fa48("2699"), 'Love how it learns what my kids like. No more guessing what toys they actually want!'),
      rating: 5
    })]);
    return <>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img src="/aclue_text_clean.png" alt="aclue Logo" className="h-8 w-auto object-contain" onError={e => {
                if (stryMutAct_9fa48("2700")) {
                  {}
                } else {
                  stryCov_9fa48("2700");
                  // Fallback to Gift icon if logo fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = stryMutAct_9fa48("2701") ? "" : (stryCov_9fa48("2701"), 'none');
                  const fallbackDiv = target.nextElementSibling as HTMLElement;
                  if (stryMutAct_9fa48("2703") ? false : stryMutAct_9fa48("2702") ? true : (stryCov_9fa48("2702", "2703"), fallbackDiv)) fallbackDiv.style.display = stryMutAct_9fa48("2704") ? "" : (stryCov_9fa48("2704"), 'flex');
                }
              }} />
              <div className="hidden w-8 h-8 bg-primary-600 rounded-lg items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                How it Works
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">
                Reviews
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition-colors">
                Pricing
              </Link>
            </div>

            {/* Auth Buttons - Updated for App Router */}
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Sign In
              </Link>
              <motion.div whileHover={stryMutAct_9fa48("2705") ? {} : (stryCov_9fa48("2705"), {
                scale: 1.05
              })} whileTap={stryMutAct_9fa48("2706") ? {} : (stryCov_9fa48("2706"), {
                scale: 0.95
              })}>
                <Link href="/auth/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={stryMutAct_9fa48("2707") ? {} : (stryCov_9fa48("2707"), {
              opacity: 0,
              y: 20
            })} animate={stryMutAct_9fa48("2708") ? {} : (stryCov_9fa48("2708"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("2709") ? {} : (stryCov_9fa48("2709"), {
              duration: 0.6
            })}>
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Gift Discovery
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find the{stryMutAct_9fa48("2710") ? "" : (stryCov_9fa48("2710"), ' ')}
                <span className="text-primary-600">perfect gift</span>{stryMutAct_9fa48("2711") ? "" : (stryCov_9fa48("2711"), ' ')}
                with AI
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Swipe through products, train our AI to understand your taste, and get personalised
                gift recommendations that actually make sense. No more guessing, no more gift fails.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.div whileHover={stryMutAct_9fa48("2712") ? {} : (stryCov_9fa48("2712"), {
                  scale: 1.05
                })} whileTap={stryMutAct_9fa48("2713") ? {} : (stryCov_9fa48("2713"), {
                  scale: 0.95
                })}>
                  <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                    Start Discovering
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>

                <motion.button whileHover={stryMutAct_9fa48("2714") ? {} : (stryCov_9fa48("2714"), {
                  scale: 1.05
                })} whileTap={stryMutAct_9fa48("2715") ? {} : (stryCov_9fa48("2715"), {
                  scale: 0.95
                })} className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stryMutAct_9fa48("2716") ? () => undefined : (stryCov_9fa48("2716"), (stat, index) => <motion.div key={stat.label} initial={stryMutAct_9fa48("2717") ? {} : (stryCov_9fa48("2717"), {
                  opacity: 0,
                  y: 20
                })} animate={stryMutAct_9fa48("2718") ? {} : (stryCov_9fa48("2718"), {
                  opacity: 1,
                  y: 0
                })} transition={stryMutAct_9fa48("2719") ? {} : (stryCov_9fa48("2719"), {
                  duration: 0.6,
                  delay: stryMutAct_9fa48("2720") ? 0.1 / index : (stryCov_9fa48("2720"), 0.1 * index)
                })} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>))}
              </div>
            </motion.div>

            <motion.div initial={stryMutAct_9fa48("2721") ? {} : (stryCov_9fa48("2721"), {
              opacity: 0,
              scale: 0.95
            })} animate={stryMutAct_9fa48("2722") ? {} : (stryCov_9fa48("2722"), {
              opacity: 1,
              scale: 1
            })} transition={stryMutAct_9fa48("2723") ? {} : (stryCov_9fa48("2723"), {
              duration: 0.6,
              delay: 0.2
            })} className="relative">
              <div className="relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white mb-6">
                    <h3 className="text-lg font-semibold mb-2">Your Perfect Match</h3>
                    <p className="text-primary-100">AI found the perfect gift based on your swipes!</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">97% match confidence</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Based on 50+ swipes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Free shipping included</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div animate={stryMutAct_9fa48("2724") ? {} : (stryCov_9fa48("2724"), {
                y: stryMutAct_9fa48("2725") ? [] : (stryCov_9fa48("2725"), [stryMutAct_9fa48("2726") ? +10 : (stryCov_9fa48("2726"), -10), 10, stryMutAct_9fa48("2727") ? +10 : (stryCov_9fa48("2727"), -10)])
              })} transition={stryMutAct_9fa48("2728") ? {} : (stryCov_9fa48("2728"), {
                duration: 4,
                repeat: Infinity
              })} className="absolute top-10 -left-4 bg-yellow-400 rounded-full p-3">
                <Gift className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div animate={stryMutAct_9fa48("2729") ? {} : (stryCov_9fa48("2729"), {
                y: stryMutAct_9fa48("2730") ? [] : (stryCov_9fa48("2730"), [10, stryMutAct_9fa48("2731") ? +10 : (stryCov_9fa48("2731"), -10), 10])
              })} transition={stryMutAct_9fa48("2732") ? {} : (stryCov_9fa48("2732"), {
                duration: 3,
                repeat: Infinity
              })} className="absolute bottom-10 -right-4 bg-pink-400 rounded-full p-3">
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary-500 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={stryMutAct_9fa48("2733") ? {} : (stryCov_9fa48("2733"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("2734") ? {} : (stryCov_9fa48("2734"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("2735") ? {} : (stryCov_9fa48("2735"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("2736") ? {} : (stryCov_9fa48("2736"), {
            once: stryMutAct_9fa48("2737") ? false : (stryCov_9fa48("2737"), true)
          })} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why aclue Works Better
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've reinvented gift discovery using cutting-edge AI and intuitive design.
              Here's what makes us different.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(stryMutAct_9fa48("2738") ? () => undefined : (stryCov_9fa48("2738"), (feature, index) => <motion.div key={feature.title} initial={stryMutAct_9fa48("2739") ? {} : (stryCov_9fa48("2739"), {
              opacity: 0,
              y: 20
            })} whileInView={stryMutAct_9fa48("2740") ? {} : (stryCov_9fa48("2740"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("2741") ? {} : (stryCov_9fa48("2741"), {
              duration: 0.6,
              delay: stryMutAct_9fa48("2742") ? 0.1 / index : (stryCov_9fa48("2742"), 0.1 * index)
            })} viewport={stryMutAct_9fa48("2743") ? {} : (stryCov_9fa48("2743"), {
              once: stryMutAct_9fa48("2744") ? false : (stryCov_9fa48("2744"), true)
            })} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={stryMutAct_9fa48("2745") ? {} : (stryCov_9fa48("2745"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("2746") ? {} : (stryCov_9fa48("2746"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("2747") ? {} : (stryCov_9fa48("2747"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("2748") ? {} : (stryCov_9fa48("2748"), {
            once: stryMutAct_9fa48("2749") ? false : (stryCov_9fa48("2749"), true)
          })} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get personalised gift recommendations in three simple steps
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {(stryMutAct_9fa48("2750") ? [] : (stryCov_9fa48("2750"), [stryMutAct_9fa48("2751") ? {} : (stryCov_9fa48("2751"), {
              step: stryMutAct_9fa48("2752") ? "" : (stryCov_9fa48("2752"), '01'),
              title: stryMutAct_9fa48("2753") ? "" : (stryCov_9fa48("2753"), 'Swipe & Discover'),
              description: stryMutAct_9fa48("2754") ? "" : (stryCov_9fa48("2754"), 'Browse through curated products and swipe right on items you love, left on items you don\'t.'),
              icon: <Heart className="w-8 h-8" />
            }), stryMutAct_9fa48("2755") ? {} : (stryCov_9fa48("2755"), {
              step: stryMutAct_9fa48("2756") ? "" : (stryCov_9fa48("2756"), '02'),
              title: stryMutAct_9fa48("2757") ? "" : (stryCov_9fa48("2757"), 'AI Learns Your Taste'),
              description: stryMutAct_9fa48("2758") ? "" : (stryCov_9fa48("2758"), 'Our machine learning algorithms analyse your preferences to understand your unique style.'),
              icon: <Sparkles className="w-8 h-8" />
            }), stryMutAct_9fa48("2759") ? {} : (stryCov_9fa48("2759"), {
              step: stryMutAct_9fa48("2760") ? "" : (stryCov_9fa48("2760"), '03'),
              title: stryMutAct_9fa48("2761") ? "" : (stryCov_9fa48("2761"), 'Get Perfect Matches'),
              description: stryMutAct_9fa48("2762") ? "" : (stryCov_9fa48("2762"), 'Receive personalised recommendations and create shareable gift links for any occasion.'),
              icon: <Gift className="w-8 h-8" />
            })])).map(stryMutAct_9fa48("2763") ? () => undefined : (stryCov_9fa48("2763"), (step, index) => <motion.div key={step.step} initial={stryMutAct_9fa48("2764") ? {} : (stryCov_9fa48("2764"), {
              opacity: 0,
              y: 20
            })} whileInView={stryMutAct_9fa48("2765") ? {} : (stryCov_9fa48("2765"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("2766") ? {} : (stryCov_9fa48("2766"), {
              duration: 0.6,
              delay: stryMutAct_9fa48("2767") ? 0.2 / index : (stryCov_9fa48("2767"), 0.2 * index)
            })} viewport={stryMutAct_9fa48("2768") ? {} : (stryCov_9fa48("2768"), {
              once: stryMutAct_9fa48("2769") ? false : (stryCov_9fa48("2769"), true)
            })} className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-4 border-primary-200 rounded-full mb-6 relative z-10">
                  <div className="text-primary-600">
                    {step.icon}
                  </div>
                </div>

                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-primary-100 -z-10">
                  {step.step}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>

                {/* Connector Line */}
                {stryMutAct_9fa48("2772") ? index < 2 || <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-primary-200 transform translate-x-8" /> : stryMutAct_9fa48("2771") ? false : stryMutAct_9fa48("2770") ? true : (stryCov_9fa48("2770", "2771", "2772"), (stryMutAct_9fa48("2775") ? index >= 2 : stryMutAct_9fa48("2774") ? index <= 2 : stryMutAct_9fa48("2773") ? true : (stryCov_9fa48("2773", "2774", "2775"), index < 2)) && <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-primary-200 transform translate-x-8" />)}
              </motion.div>))}
          </div>

          <motion.div initial={stryMutAct_9fa48("2776") ? {} : (stryCov_9fa48("2776"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("2777") ? {} : (stryCov_9fa48("2777"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("2778") ? {} : (stryCov_9fa48("2778"), {
            duration: 0.6,
            delay: 0.6
          })} viewport={stryMutAct_9fa48("2779") ? {} : (stryCov_9fa48("2779"), {
            once: stryMutAct_9fa48("2780") ? false : (stryCov_9fa48("2780"), true)
          })} className="text-center mt-12">
            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
              Try It Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={stryMutAct_9fa48("2781") ? {} : (stryCov_9fa48("2781"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("2782") ? {} : (stryCov_9fa48("2782"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("2783") ? {} : (stryCov_9fa48("2783"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("2784") ? {} : (stryCov_9fa48("2784"), {
            once: stryMutAct_9fa48("2785") ? false : (stryCov_9fa48("2785"), true)
          })} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy users who've discovered the joy of perfect gift-giving
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(stryMutAct_9fa48("2786") ? () => undefined : (stryCov_9fa48("2786"), (testimonial, index) => <motion.div key={testimonial.name} initial={stryMutAct_9fa48("2787") ? {} : (stryCov_9fa48("2787"), {
              opacity: 0,
              y: 20
            })} whileInView={stryMutAct_9fa48("2788") ? {} : (stryCov_9fa48("2788"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("2789") ? {} : (stryCov_9fa48("2789"), {
              duration: 0.6,
              delay: stryMutAct_9fa48("2790") ? 0.1 / index : (stryCov_9fa48("2790"), 0.1 * index)
            })} viewport={stryMutAct_9fa48("2791") ? {} : (stryCov_9fa48("2791"), {
              once: stryMutAct_9fa48("2792") ? false : (stryCov_9fa48("2792"), true)
            })} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {(stryMutAct_9fa48("2793") ? [] : (stryCov_9fa48("2793"), [...(stryMutAct_9fa48("2794") ? Array() : (stryCov_9fa48("2794"), Array(testimonial.rating)))])).map(stryMutAct_9fa48("2795") ? () => undefined : (stryCov_9fa48("2795"), (_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                    <span className="text-primary-800 font-semibold">
                      {stryMutAct_9fa48("2796") ? testimonial.name : (stryCov_9fa48("2796"), testimonial.name.charAt(0))}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial={stryMutAct_9fa48("2797") ? {} : (stryCov_9fa48("2797"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("2798") ? {} : (stryCov_9fa48("2798"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("2799") ? {} : (stryCov_9fa48("2799"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("2800") ? {} : (stryCov_9fa48("2800"), {
            once: stryMutAct_9fa48("2801") ? false : (stryCov_9fa48("2801"), true)
          })} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Available Everywhere
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              Access aclue on all your devices. Seamless sync across platforms means your preferences travel with you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {(stryMutAct_9fa48("2802") ? [] : (stryCov_9fa48("2802"), [stryMutAct_9fa48("2803") ? {} : (stryCov_9fa48("2803"), {
              icon: <Globe className="w-12 h-12" />,
              title: stryMutAct_9fa48("2804") ? "" : (stryCov_9fa48("2804"), 'Web App'),
              description: stryMutAct_9fa48("2805") ? "" : (stryCov_9fa48("2805"), 'Full-featured experience in your browser')
            }), stryMutAct_9fa48("2806") ? {} : (stryCov_9fa48("2806"), {
              icon: <Smartphone className="w-12 h-12" />,
              title: stryMutAct_9fa48("2807") ? "" : (stryCov_9fa48("2807"), 'Mobile Apps'),
              description: stryMutAct_9fa48("2808") ? "" : (stryCov_9fa48("2808"), 'Native iOS and Android applications')
            }), stryMutAct_9fa48("2809") ? {} : (stryCov_9fa48("2809"), {
              icon: <Monitor className="w-12 h-12" />,
              title: stryMutAct_9fa48("2810") ? "" : (stryCov_9fa48("2810"), 'Desktop'),
              description: stryMutAct_9fa48("2811") ? "" : (stryCov_9fa48("2811"), 'Coming soon to Windows and macOS')
            })])).map(stryMutAct_9fa48("2812") ? () => undefined : (stryCov_9fa48("2812"), (platform, index) => <motion.div key={platform.title} initial={stryMutAct_9fa48("2813") ? {} : (stryCov_9fa48("2813"), {
              opacity: 0,
              y: 20
            })} whileInView={stryMutAct_9fa48("2814") ? {} : (stryCov_9fa48("2814"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("2815") ? {} : (stryCov_9fa48("2815"), {
              duration: 0.6,
              delay: stryMutAct_9fa48("2816") ? 0.1 / index : (stryCov_9fa48("2816"), 0.1 * index)
            })} viewport={stryMutAct_9fa48("2817") ? {} : (stryCov_9fa48("2817"), {
              once: stryMutAct_9fa48("2818") ? false : (stryCov_9fa48("2818"), true)
            })} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
                  {platform.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {platform.title}
                </h3>
                <p className="text-primary-100">
                  {platform.description}
                </p>
              </motion.div>))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={stryMutAct_9fa48("2819") ? {} : (stryCov_9fa48("2819"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("2820") ? {} : (stryCov_9fa48("2820"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("2821") ? {} : (stryCov_9fa48("2821"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("2822") ? {} : (stryCov_9fa48("2822"), {
            once: stryMutAct_9fa48("2823") ? false : (stryCov_9fa48("2823"), true)
          })}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to revolutionise your gift-giving?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who've discovered the perfect way to find and give gifts.
              Start your free account today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={stryMutAct_9fa48("2824") ? {} : (stryCov_9fa48("2824"), {
                scale: 1.05
              })} whileTap={stryMutAct_9fa48("2825") ? {} : (stryCov_9fa48("2825"), {
                scale: 0.95
              })}>
                <Link href="/auth/register" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div whileHover={stryMutAct_9fa48("2826") ? {} : (stryCov_9fa48("2826"), {
                scale: 1.05
              })} whileTap={stryMutAct_9fa48("2827") ? {} : (stryCov_9fa48("2827"), {
                scale: 0.95
              })}>
                <Link href="/discover" className="inline-flex items-center gap-2 bg-white border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
                  Try Demo
                  <Play className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/aclue_text_clean.png" alt="aclue Logo" className="h-8 w-auto object-contain" onError={e => {
                  if (stryMutAct_9fa48("2828")) {
                    {}
                  } else {
                    stryCov_9fa48("2828");
                    // Fallback to Gift icon if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = stryMutAct_9fa48("2829") ? "" : (stryCov_9fa48("2829"), 'none');
                    const fallbackDiv = target.nextElementSibling as HTMLElement;
                    if (stryMutAct_9fa48("2831") ? false : stryMutAct_9fa48("2830") ? true : (stryCov_9fa48("2830", "2831"), fallbackDiv)) fallbackDiv.style.display = stryMutAct_9fa48("2832") ? "" : (stryCov_9fa48("2832"), 'flex');
                  }
                }} />
                <div className="hidden w-8 h-8 bg-primary-600 rounded-lg items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                A data-led insight layer that transforms how gifts are chosen.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="/mobile" className="hover:text-white transition-colors">Mobile Apps</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Centre</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 aclue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>;
  }
}