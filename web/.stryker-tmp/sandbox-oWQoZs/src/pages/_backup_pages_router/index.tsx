/**
 * aclue Homepage Component
 *
 * REBRANDING NOTE (August 2025):
 * This component was updated during the comprehensive rebrand from aclue/aclue to aclue.
 * All branding elements, meta tags, and user-facing content have been updated to reflect
 * the new aclue brand identity and aclue.app domain.
 *
 * MAINTENANCE MODE NOTE (September 2025):
 * This component now respects the NEXT_PUBLIC_MAINTENANCE_MODE environment variable.
 * When set to 'true', it displays the newsletter signup page instead of the full marketing site.
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
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift, Sparkles, Heart, Zap, Users, Star, ArrowRight, Play, CheckCircle, Smartphone, Monitor, Globe } from 'lucide-react';
import MaintenanceMode from '@/components/MaintenanceMode';
export default function HomePage() {
  if (stryMutAct_9fa48("11961")) {
    {}
  } else {
    stryCov_9fa48("11961");
    // Check if maintenance mode is enabled
    const isMaintenanceMode = stryMutAct_9fa48("11964") ? process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== 'true' : stryMutAct_9fa48("11963") ? false : stryMutAct_9fa48("11962") ? true : (stryCov_9fa48("11962", "11963", "11964"), process.env.NEXT_PUBLIC_MAINTENANCE_MODE === (stryMutAct_9fa48("11965") ? "" : (stryCov_9fa48("11965"), 'true')));

    // If maintenance mode is enabled, show the newsletter signup page
    if (stryMutAct_9fa48("11967") ? false : stryMutAct_9fa48("11966") ? true : (stryCov_9fa48("11966", "11967"), isMaintenanceMode)) {
      if (stryMutAct_9fa48("11968")) {
        {}
      } else {
        stryCov_9fa48("11968");
        return <MaintenanceMode />;
      }
    }
    const features = stryMutAct_9fa48("11969") ? [] : (stryCov_9fa48("11969"), [stryMutAct_9fa48("11970") ? {} : (stryCov_9fa48("11970"), {
      icon: <Sparkles className="w-6 h-6" />,
      title: stryMutAct_9fa48("11971") ? "" : (stryCov_9fa48("11971"), 'AI-Powered Recommendations'),
      description: stryMutAct_9fa48("11972") ? "" : (stryCov_9fa48("11972"), 'Our advanced ML algorithms learn your preferences to suggest perfect gifts every time.')
    }), stryMutAct_9fa48("11973") ? {} : (stryCov_9fa48("11973"), {
      icon: <Heart className="w-6 h-6" />,
      title: stryMutAct_9fa48("11974") ? "" : (stryCov_9fa48("11974"), 'Swipe-Based Discovery'),
      description: stryMutAct_9fa48("11975") ? "" : (stryCov_9fa48("11975"), 'Like Tinder for gifts! Swipe through products to train our AI and discover what you love.')
    }), stryMutAct_9fa48("11976") ? {} : (stryCov_9fa48("11976"), {
      icon: <Zap className="w-6 h-6" />,
      title: stryMutAct_9fa48("11977") ? "" : (stryCov_9fa48("11977"), 'Instant Gift Links'),
      description: stryMutAct_9fa48("11978") ? "" : (stryCov_9fa48("11978"), 'Create shareable gift links in seconds. Perfect for wishlists and gift exchanges.')
    }), stryMutAct_9fa48("11979") ? {} : (stryCov_9fa48("11979"), {
      icon: <Users className="w-6 h-6" />,
      title: stryMutAct_9fa48("11980") ? "" : (stryCov_9fa48("11980"), 'Social Gifting'),
      description: stryMutAct_9fa48("11981") ? "" : (stryCov_9fa48("11981"), 'Share with friends and family. Collaborate on gift ideas and never give duplicate gifts.')
    })]);
    const stats = stryMutAct_9fa48("11982") ? [] : (stryCov_9fa48("11982"), [stryMutAct_9fa48("11983") ? {} : (stryCov_9fa48("11983"), {
      number: stryMutAct_9fa48("11984") ? "" : (stryCov_9fa48("11984"), '1M+'),
      label: stryMutAct_9fa48("11985") ? "" : (stryCov_9fa48("11985"), 'Products Curated')
    }), stryMutAct_9fa48("11986") ? {} : (stryCov_9fa48("11986"), {
      number: stryMutAct_9fa48("11987") ? "" : (stryCov_9fa48("11987"), '50K+'),
      label: stryMutAct_9fa48("11988") ? "" : (stryCov_9fa48("11988"), 'Happy Users')
    }), stryMutAct_9fa48("11989") ? {} : (stryCov_9fa48("11989"), {
      number: stryMutAct_9fa48("11990") ? "" : (stryCov_9fa48("11990"), '95%'),
      label: stryMutAct_9fa48("11991") ? "" : (stryCov_9fa48("11991"), 'Satisfaction Rate')
    }), stryMutAct_9fa48("11992") ? {} : (stryCov_9fa48("11992"), {
      number: stryMutAct_9fa48("11993") ? "" : (stryCov_9fa48("11993"), '24/7'),
      label: stryMutAct_9fa48("11994") ? "" : (stryCov_9fa48("11994"), 'AI Learning')
    })]);
    const testimonials = stryMutAct_9fa48("11995") ? [] : (stryCov_9fa48("11995"), [stryMutAct_9fa48("11996") ? {} : (stryCov_9fa48("11996"), {
      name: stryMutAct_9fa48("11997") ? "" : (stryCov_9fa48("11997"), 'Sarah Johnson'),
      role: stryMutAct_9fa48("11998") ? "" : (stryCov_9fa48("11998"), 'Gift Enthusiast'),
      avatar: stryMutAct_9fa48("11999") ? "" : (stryCov_9fa48("11999"), '/images/testimonials/sarah.jpg'),
      content: stryMutAct_9fa48("12000") ? "" : (stryCov_9fa48("12000"), 'aclue helped me find the perfect birthday gift for my sister. The data-led insights were spot-on!'),
      rating: 5
    }), stryMutAct_9fa48("12001") ? {} : (stryCov_9fa48("12001"), {
      name: stryMutAct_9fa48("12002") ? "" : (stryCov_9fa48("12002"), 'Mike Chen'),
      role: stryMutAct_9fa48("12003") ? "" : (stryCov_9fa48("12003"), 'Busy Professional'),
      avatar: stryMutAct_9fa48("12004") ? "" : (stryCov_9fa48("12004"), '/images/testimonials/mike.jpg'),
      content: stryMutAct_9fa48("12005") ? "" : (stryCov_9fa48("12005"), 'As someone who struggles with gift-giving, this app is a lifesaver. Quick, easy, and always great suggestions.'),
      rating: 5
    }), stryMutAct_9fa48("12006") ? {} : (stryCov_9fa48("12006"), {
      name: stryMutAct_9fa48("12007") ? "" : (stryCov_9fa48("12007"), 'Emma Davis'),
      role: stryMutAct_9fa48("12008") ? "" : (stryCov_9fa48("12008"), 'Mother of 3'),
      avatar: stryMutAct_9fa48("12009") ? "" : (stryCov_9fa48("12009"), '/images/testimonials/emma.jpg'),
      content: stryMutAct_9fa48("12010") ? "" : (stryCov_9fa48("12010"), 'Love how it learns what my kids like. No more guessing what toys they actually want!'),
      rating: 5
    })]);
    return <>
      <Head>
        <title>aclue - A data-led insight layer that transforms how gifts are chosen</title>
        <meta name="description" content="A data-led insight layer that transforms how gifts are chosen. Swipe through products, get personalised recommendations, and create shareable gift links." />
        <meta name="keywords" content="gifts, AI recommendations, gift ideas, personalised gifts, gift finder" />
        <meta property="og:title" content="aclue - A data-led insight layer that transforms how gifts are chosen" />
        <meta property="og:description" content="Discover perfect gifts with AI. Swipe through products, get personalised recommendations, and create shareable gift links." />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://aclue.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://aclue.app" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img src="/aclue-logo.png" alt="aclue Logo" className="h-8 w-auto object-contain" onError={e => {
                if (stryMutAct_9fa48("12011")) {
                  {}
                } else {
                  stryCov_9fa48("12011");
                  // Fallback to Gift icon if logo fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = stryMutAct_9fa48("12012") ? "" : (stryCov_9fa48("12012"), 'none');
                  const fallbackDiv = target.nextElementSibling as HTMLElement;
                  if (stryMutAct_9fa48("12014") ? false : stryMutAct_9fa48("12013") ? true : (stryCov_9fa48("12013", "12014"), fallbackDiv)) fallbackDiv.style.display = stryMutAct_9fa48("12015") ? "" : (stryCov_9fa48("12015"), 'flex');
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

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Sign In
              </Link>
              <motion.div whileHover={stryMutAct_9fa48("12016") ? {} : (stryCov_9fa48("12016"), {
                scale: 1.05
              })} whileTap={stryMutAct_9fa48("12017") ? {} : (stryCov_9fa48("12017"), {
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
            <motion.div initial={stryMutAct_9fa48("12018") ? {} : (stryCov_9fa48("12018"), {
              opacity: 0,
              y: 20
            })} animate={stryMutAct_9fa48("12019") ? {} : (stryCov_9fa48("12019"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("12020") ? {} : (stryCov_9fa48("12020"), {
              duration: 0.6
            })}>
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Gift Discovery
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find the{stryMutAct_9fa48("12021") ? "" : (stryCov_9fa48("12021"), ' ')}
                <span className="text-primary-600">perfect gift</span>{stryMutAct_9fa48("12022") ? "" : (stryCov_9fa48("12022"), ' ')}
                with AI
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Swipe through products, train our AI to understand your taste, and get personalised 
                gift recommendations that actually make sense. No more guessing, no more gift fails.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.div whileHover={stryMutAct_9fa48("12023") ? {} : (stryCov_9fa48("12023"), {
                  scale: 1.05
                })} whileTap={stryMutAct_9fa48("12024") ? {} : (stryCov_9fa48("12024"), {
                  scale: 0.95
                })}>
                  <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                    Start Discovering
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
                
                <motion.button whileHover={stryMutAct_9fa48("12025") ? {} : (stryCov_9fa48("12025"), {
                  scale: 1.05
                })} whileTap={stryMutAct_9fa48("12026") ? {} : (stryCov_9fa48("12026"), {
                  scale: 0.95
                })} className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stryMutAct_9fa48("12027") ? () => undefined : (stryCov_9fa48("12027"), (stat, index) => <motion.div key={stat.label} initial={stryMutAct_9fa48("12028") ? {} : (stryCov_9fa48("12028"), {
                  opacity: 0,
                  y: 20
                })} animate={stryMutAct_9fa48("12029") ? {} : (stryCov_9fa48("12029"), {
                  opacity: 1,
                  y: 0
                })} transition={stryMutAct_9fa48("12030") ? {} : (stryCov_9fa48("12030"), {
                  duration: 0.6,
                  delay: stryMutAct_9fa48("12031") ? 0.1 / index : (stryCov_9fa48("12031"), 0.1 * index)
                })} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>))}
              </div>
            </motion.div>

            <motion.div initial={stryMutAct_9fa48("12032") ? {} : (stryCov_9fa48("12032"), {
              opacity: 0,
              scale: 0.95
            })} animate={stryMutAct_9fa48("12033") ? {} : (stryCov_9fa48("12033"), {
              opacity: 1,
              scale: 1
            })} transition={stryMutAct_9fa48("12034") ? {} : (stryCov_9fa48("12034"), {
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
              <motion.div animate={stryMutAct_9fa48("12035") ? {} : (stryCov_9fa48("12035"), {
                y: stryMutAct_9fa48("12036") ? [] : (stryCov_9fa48("12036"), [stryMutAct_9fa48("12037") ? +10 : (stryCov_9fa48("12037"), -10), 10, stryMutAct_9fa48("12038") ? +10 : (stryCov_9fa48("12038"), -10)])
              })} transition={stryMutAct_9fa48("12039") ? {} : (stryCov_9fa48("12039"), {
                duration: 4,
                repeat: Infinity
              })} className="absolute top-10 -left-4 bg-yellow-400 rounded-full p-3">
                <Gift className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.div animate={stryMutAct_9fa48("12040") ? {} : (stryCov_9fa48("12040"), {
                y: stryMutAct_9fa48("12041") ? [] : (stryCov_9fa48("12041"), [10, stryMutAct_9fa48("12042") ? +10 : (stryCov_9fa48("12042"), -10), 10])
              })} transition={stryMutAct_9fa48("12043") ? {} : (stryCov_9fa48("12043"), {
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
          <motion.div initial={stryMutAct_9fa48("12044") ? {} : (stryCov_9fa48("12044"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("12045") ? {} : (stryCov_9fa48("12045"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12046") ? {} : (stryCov_9fa48("12046"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("12047") ? {} : (stryCov_9fa48("12047"), {
            once: stryMutAct_9fa48("12048") ? false : (stryCov_9fa48("12048"), true)
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
            {features.map(stryMutAct_9fa48("12049") ? () => undefined : (stryCov_9fa48("12049"), (feature, index) => <motion.div key={feature.title} initial={stryMutAct_9fa48("12050") ? {} : (stryCov_9fa48("12050"), {
              opacity: 0,
              y: 20
            })} whileInView={stryMutAct_9fa48("12051") ? {} : (stryCov_9fa48("12051"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("12052") ? {} : (stryCov_9fa48("12052"), {
              duration: 0.6,
              delay: stryMutAct_9fa48("12053") ? 0.1 / index : (stryCov_9fa48("12053"), 0.1 * index)
            })} viewport={stryMutAct_9fa48("12054") ? {} : (stryCov_9fa48("12054"), {
              once: stryMutAct_9fa48("12055") ? false : (stryCov_9fa48("12055"), true)
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
          <motion.div initial={stryMutAct_9fa48("12056") ? {} : (stryCov_9fa48("12056"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("12057") ? {} : (stryCov_9fa48("12057"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12058") ? {} : (stryCov_9fa48("12058"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("12059") ? {} : (stryCov_9fa48("12059"), {
            once: stryMutAct_9fa48("12060") ? false : (stryCov_9fa48("12060"), true)
          })} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get personalised gift recommendations in three simple steps
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {(stryMutAct_9fa48("12061") ? [] : (stryCov_9fa48("12061"), [stryMutAct_9fa48("12062") ? {} : (stryCov_9fa48("12062"), {
              step: stryMutAct_9fa48("12063") ? "" : (stryCov_9fa48("12063"), '01'),
              title: stryMutAct_9fa48("12064") ? "" : (stryCov_9fa48("12064"), 'Swipe & Discover'),
              description: stryMutAct_9fa48("12065") ? "" : (stryCov_9fa48("12065"), 'Browse through curated products and swipe right on items you love, left on items you don\'t.'),
              icon: <Heart className="w-8 h-8" />
            }), stryMutAct_9fa48("12066") ? {} : (stryCov_9fa48("12066"), {
              step: stryMutAct_9fa48("12067") ? "" : (stryCov_9fa48("12067"), '02'),
              title: stryMutAct_9fa48("12068") ? "" : (stryCov_9fa48("12068"), 'AI Learns Your Taste'),
              description: stryMutAct_9fa48("12069") ? "" : (stryCov_9fa48("12069"), 'Our machine learning algorithms analyse your preferences to understand your unique style.'),
              icon: <Sparkles className="w-8 h-8" />
            }), stryMutAct_9fa48("12070") ? {} : (stryCov_9fa48("12070"), {
              step: stryMutAct_9fa48("12071") ? "" : (stryCov_9fa48("12071"), '03'),
              title: stryMutAct_9fa48("12072") ? "" : (stryCov_9fa48("12072"), 'Get Perfect Matches'),
              description: stryMutAct_9fa48("12073") ? "" : (stryCov_9fa48("12073"), 'Receive personalised recommendations and create shareable gift links for any occasion.'),
              icon: <Gift className="w-8 h-8" />
            })])).map(stryMutAct_9fa48("12074") ? () => undefined : (stryCov_9fa48("12074"), (step, index) => <motion.div key={step.step} initial={stryMutAct_9fa48("12075") ? {} : (stryCov_9fa48("12075"), {
              opacity: 0,
              y: 20
            })} whileInView={stryMutAct_9fa48("12076") ? {} : (stryCov_9fa48("12076"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("12077") ? {} : (stryCov_9fa48("12077"), {
              duration: 0.6,
              delay: stryMutAct_9fa48("12078") ? 0.2 / index : (stryCov_9fa48("12078"), 0.2 * index)
            })} viewport={stryMutAct_9fa48("12079") ? {} : (stryCov_9fa48("12079"), {
              once: stryMutAct_9fa48("12080") ? false : (stryCov_9fa48("12080"), true)
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
                {stryMutAct_9fa48("12083") ? index < 2 || <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-primary-200 transform translate-x-8" /> : stryMutAct_9fa48("12082") ? false : stryMutAct_9fa48("12081") ? true : (stryCov_9fa48("12081", "12082", "12083"), (stryMutAct_9fa48("12086") ? index >= 2 : stryMutAct_9fa48("12085") ? index <= 2 : stryMutAct_9fa48("12084") ? true : (stryCov_9fa48("12084", "12085", "12086"), index < 2)) && <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-primary-200 transform translate-x-8" />)}
              </motion.div>))}
          </div>

          <motion.div initial={stryMutAct_9fa48("12087") ? {} : (stryCov_9fa48("12087"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("12088") ? {} : (stryCov_9fa48("12088"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12089") ? {} : (stryCov_9fa48("12089"), {
            duration: 0.6,
            delay: 0.6
          })} viewport={stryMutAct_9fa48("12090") ? {} : (stryCov_9fa48("12090"), {
            once: stryMutAct_9fa48("12091") ? false : (stryCov_9fa48("12091"), true)
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
          <motion.div initial={stryMutAct_9fa48("12092") ? {} : (stryCov_9fa48("12092"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("12093") ? {} : (stryCov_9fa48("12093"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12094") ? {} : (stryCov_9fa48("12094"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("12095") ? {} : (stryCov_9fa48("12095"), {
            once: stryMutAct_9fa48("12096") ? false : (stryCov_9fa48("12096"), true)
          })} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy users who've discovered the joy of perfect gift-giving
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(stryMutAct_9fa48("12097") ? () => undefined : (stryCov_9fa48("12097"), (testimonial, index) => <motion.div key={testimonial.name} initial={stryMutAct_9fa48("12098") ? {} : (stryCov_9fa48("12098"), {
              opacity: 0,
              y: 20
            })} whileInView={stryMutAct_9fa48("12099") ? {} : (stryCov_9fa48("12099"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("12100") ? {} : (stryCov_9fa48("12100"), {
              duration: 0.6,
              delay: stryMutAct_9fa48("12101") ? 0.1 / index : (stryCov_9fa48("12101"), 0.1 * index)
            })} viewport={stryMutAct_9fa48("12102") ? {} : (stryCov_9fa48("12102"), {
              once: stryMutAct_9fa48("12103") ? false : (stryCov_9fa48("12103"), true)
            })} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {(stryMutAct_9fa48("12104") ? [] : (stryCov_9fa48("12104"), [...(stryMutAct_9fa48("12105") ? Array() : (stryCov_9fa48("12105"), Array(testimonial.rating)))])).map(stryMutAct_9fa48("12106") ? () => undefined : (stryCov_9fa48("12106"), (_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                    <span className="text-primary-800 font-semibold">
                      {stryMutAct_9fa48("12107") ? testimonial.name : (stryCov_9fa48("12107"), testimonial.name.charAt(0))}
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
          <motion.div initial={stryMutAct_9fa48("12108") ? {} : (stryCov_9fa48("12108"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("12109") ? {} : (stryCov_9fa48("12109"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12110") ? {} : (stryCov_9fa48("12110"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("12111") ? {} : (stryCov_9fa48("12111"), {
            once: stryMutAct_9fa48("12112") ? false : (stryCov_9fa48("12112"), true)
          })} className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Available Everywhere
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              Access aclue on all your devices. Seamless sync across platforms means your preferences travel with you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {(stryMutAct_9fa48("12113") ? [] : (stryCov_9fa48("12113"), [stryMutAct_9fa48("12114") ? {} : (stryCov_9fa48("12114"), {
              icon: <Globe className="w-12 h-12" />,
              title: stryMutAct_9fa48("12115") ? "" : (stryCov_9fa48("12115"), 'Web App'),
              description: stryMutAct_9fa48("12116") ? "" : (stryCov_9fa48("12116"), 'Full-featured experience in your browser')
            }), stryMutAct_9fa48("12117") ? {} : (stryCov_9fa48("12117"), {
              icon: <Smartphone className="w-12 h-12" />,
              title: stryMutAct_9fa48("12118") ? "" : (stryCov_9fa48("12118"), 'Mobile Apps'),
              description: stryMutAct_9fa48("12119") ? "" : (stryCov_9fa48("12119"), 'Native iOS and Android applications')
            }), stryMutAct_9fa48("12120") ? {} : (stryCov_9fa48("12120"), {
              icon: <Monitor className="w-12 h-12" />,
              title: stryMutAct_9fa48("12121") ? "" : (stryCov_9fa48("12121"), 'Desktop'),
              description: stryMutAct_9fa48("12122") ? "" : (stryCov_9fa48("12122"), 'Coming soon to Windows and macOS')
            })])).map(stryMutAct_9fa48("12123") ? () => undefined : (stryCov_9fa48("12123"), (platform, index) => <motion.div key={platform.title} initial={stryMutAct_9fa48("12124") ? {} : (stryCov_9fa48("12124"), {
              opacity: 0,
              y: 20
            })} whileInView={stryMutAct_9fa48("12125") ? {} : (stryCov_9fa48("12125"), {
              opacity: 1,
              y: 0
            })} transition={stryMutAct_9fa48("12126") ? {} : (stryCov_9fa48("12126"), {
              duration: 0.6,
              delay: stryMutAct_9fa48("12127") ? 0.1 / index : (stryCov_9fa48("12127"), 0.1 * index)
            })} viewport={stryMutAct_9fa48("12128") ? {} : (stryCov_9fa48("12128"), {
              once: stryMutAct_9fa48("12129") ? false : (stryCov_9fa48("12129"), true)
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
          <motion.div initial={stryMutAct_9fa48("12130") ? {} : (stryCov_9fa48("12130"), {
            opacity: 0,
            y: 20
          })} whileInView={stryMutAct_9fa48("12131") ? {} : (stryCov_9fa48("12131"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12132") ? {} : (stryCov_9fa48("12132"), {
            duration: 0.6
          })} viewport={stryMutAct_9fa48("12133") ? {} : (stryCov_9fa48("12133"), {
            once: stryMutAct_9fa48("12134") ? false : (stryCov_9fa48("12134"), true)
          })}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to revolutionise your gift-giving?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who've discovered the perfect way to find and give gifts. 
              Start your free account today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={stryMutAct_9fa48("12135") ? {} : (stryCov_9fa48("12135"), {
                scale: 1.05
              })} whileTap={stryMutAct_9fa48("12136") ? {} : (stryCov_9fa48("12136"), {
                scale: 0.95
              })}>
                <Link href="/auth/register" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={stryMutAct_9fa48("12137") ? {} : (stryCov_9fa48("12137"), {
                scale: 1.05
              })} whileTap={stryMutAct_9fa48("12138") ? {} : (stryCov_9fa48("12138"), {
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
                <img src="/aclue-logo.png" alt="aclue Logo" className="h-8 w-auto object-contain" onError={e => {
                  if (stryMutAct_9fa48("12139")) {
                    {}
                  } else {
                    stryCov_9fa48("12139");
                    // Fallback to Gift icon if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = stryMutAct_9fa48("12140") ? "" : (stryCov_9fa48("12140"), 'none');
                    const fallbackDiv = target.nextElementSibling as HTMLElement;
                    if (stryMutAct_9fa48("12142") ? false : stryMutAct_9fa48("12141") ? true : (stryCov_9fa48("12141", "12142"), fallbackDiv)) fallbackDiv.style.display = stryMutAct_9fa48("12143") ? "" : (stryCov_9fa48("12143"), 'flex');
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
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 aclue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>;
  }
}