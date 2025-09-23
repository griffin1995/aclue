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
import { Gift, Home, Search, ArrowLeft, Sparkles } from 'lucide-react';
export default function NotFoundPage() {
  if (stryMutAct_9fa48("11853")) {
    {}
  } else {
    stryCov_9fa48("11853");
    return <>
      <Head>
        <title>Page Not Found - aclue</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col items-center justify-center px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={stryMutAct_9fa48("11854") ? {} : (stryCov_9fa48("11854"), {
            y: stryMutAct_9fa48("11855") ? [] : (stryCov_9fa48("11855"), [0, stryMutAct_9fa48("11856") ? +20 : (stryCov_9fa48("11856"), -20), 0]),
            rotate: stryMutAct_9fa48("11857") ? [] : (stryCov_9fa48("11857"), [0, 5, 0])
          })} transition={stryMutAct_9fa48("11858") ? {} : (stryCov_9fa48("11858"), {
            duration: 6,
            repeat: Infinity,
            ease: stryMutAct_9fa48("11859") ? "" : (stryCov_9fa48("11859"), "easeInOut")
          })} className="absolute top-20 left-20 w-32 h-32 gradient-primary rounded-full opacity-10 blur-3xl" />
          <motion.div animate={stryMutAct_9fa48("11860") ? {} : (stryCov_9fa48("11860"), {
            y: stryMutAct_9fa48("11861") ? [] : (stryCov_9fa48("11861"), [0, 20, 0]),
            rotate: stryMutAct_9fa48("11862") ? [] : (stryCov_9fa48("11862"), [0, stryMutAct_9fa48("11863") ? +5 : (stryCov_9fa48("11863"), -5), 0])
          })} transition={stryMutAct_9fa48("11864") ? {} : (stryCov_9fa48("11864"), {
            duration: 8,
            repeat: Infinity,
            ease: stryMutAct_9fa48("11865") ? "" : (stryCov_9fa48("11865"), "easeInOut")
          })} className="absolute bottom-20 right-20 w-48 h-48 gradient-secondary rounded-full opacity-10 blur-3xl" />
          <motion.div animate={stryMutAct_9fa48("11866") ? {} : (stryCov_9fa48("11866"), {
            scale: stryMutAct_9fa48("11867") ? [] : (stryCov_9fa48("11867"), [1, 1.1, 1]),
            opacity: stryMutAct_9fa48("11868") ? [] : (stryCov_9fa48("11868"), [0.1, 0.2, 0.1])
          })} transition={stryMutAct_9fa48("11869") ? {} : (stryCov_9fa48("11869"), {
            duration: 4,
            repeat: Infinity,
            ease: stryMutAct_9fa48("11870") ? "" : (stryCov_9fa48("11870"), "easeInOut")
          })} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 gradient-warm rounded-full opacity-5 blur-3xl" />
        </div>

        {/* Content */}
        <motion.div initial={stryMutAct_9fa48("11871") ? {} : (stryCov_9fa48("11871"), {
          opacity: 0,
          y: 20
        })} animate={stryMutAct_9fa48("11872") ? {} : (stryCov_9fa48("11872"), {
          opacity: 1,
          y: 0
        })} transition={stryMutAct_9fa48("11873") ? {} : (stryCov_9fa48("11873"), {
          duration: 0.6
        })} className="text-center relative z-10">
          {/* 404 Icon */}
          <motion.div initial={stryMutAct_9fa48("11874") ? {} : (stryCov_9fa48("11874"), {
            scale: 0
          })} animate={stryMutAct_9fa48("11875") ? {} : (stryCov_9fa48("11875"), {
            scale: 1
          })} transition={stryMutAct_9fa48("11876") ? {} : (stryCov_9fa48("11876"), {
            duration: 0.8,
            type: stryMutAct_9fa48("11877") ? "" : (stryCov_9fa48("11877"), "spring"),
            bounce: 0.4
          })} className="relative mb-8">
            <div className="w-32 h-32 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow-lg">
              <Image src="/logo.png" alt="aclue logo" width={64} height={64} className="rounded-lg" />
            </div>
            
            {/* Floating sparkles */}
            <motion.div animate={stryMutAct_9fa48("11878") ? {} : (stryCov_9fa48("11878"), {
              y: stryMutAct_9fa48("11879") ? [] : (stryCov_9fa48("11879"), [stryMutAct_9fa48("11880") ? +10 : (stryCov_9fa48("11880"), -10), stryMutAct_9fa48("11881") ? +20 : (stryCov_9fa48("11881"), -20), stryMutAct_9fa48("11882") ? +10 : (stryCov_9fa48("11882"), -10)]),
              x: stryMutAct_9fa48("11883") ? [] : (stryCov_9fa48("11883"), [0, 5, 0]),
              rotate: stryMutAct_9fa48("11884") ? [] : (stryCov_9fa48("11884"), [0, 180, 360])
            })} transition={stryMutAct_9fa48("11885") ? {} : (stryCov_9fa48("11885"), {
              duration: 3,
              repeat: Infinity,
              ease: stryMutAct_9fa48("11886") ? "" : (stryCov_9fa48("11886"), "easeInOut")
            })} className="absolute -top-4 -right-4">
              <Sparkles className="w-6 h-6 text-primary-400" />
            </motion.div>
            
            <motion.div animate={stryMutAct_9fa48("11887") ? {} : (stryCov_9fa48("11887"), {
              y: stryMutAct_9fa48("11888") ? [] : (stryCov_9fa48("11888"), [0, stryMutAct_9fa48("11889") ? +15 : (stryCov_9fa48("11889"), -15), 0]),
              x: stryMutAct_9fa48("11890") ? [] : (stryCov_9fa48("11890"), [0, stryMutAct_9fa48("11891") ? +8 : (stryCov_9fa48("11891"), -8), 0]),
              rotate: stryMutAct_9fa48("11892") ? [] : (stryCov_9fa48("11892"), [0, stryMutAct_9fa48("11893") ? +180 : (stryCov_9fa48("11893"), -180), stryMutAct_9fa48("11894") ? +360 : (stryCov_9fa48("11894"), -360)])
            })} transition={stryMutAct_9fa48("11895") ? {} : (stryCov_9fa48("11895"), {
              duration: 4,
              repeat: Infinity,
              ease: stryMutAct_9fa48("11896") ? "" : (stryCov_9fa48("11896"), "easeInOut"),
              delay: 1
            })} className="absolute top-2 -left-6">
              <Sparkles className="w-4 h-4 text-secondary-400" />
            </motion.div>
            
            <motion.div animate={stryMutAct_9fa48("11897") ? {} : (stryCov_9fa48("11897"), {
              y: stryMutAct_9fa48("11898") ? [] : (stryCov_9fa48("11898"), [stryMutAct_9fa48("11899") ? +5 : (stryCov_9fa48("11899"), -5), stryMutAct_9fa48("11900") ? +25 : (stryCov_9fa48("11900"), -25), stryMutAct_9fa48("11901") ? +5 : (stryCov_9fa48("11901"), -5)]),
              x: stryMutAct_9fa48("11902") ? [] : (stryCov_9fa48("11902"), [0, 3, 0]),
              rotate: stryMutAct_9fa48("11903") ? [] : (stryCov_9fa48("11903"), [0, 90, 180])
            })} transition={stryMutAct_9fa48("11904") ? {} : (stryCov_9fa48("11904"), {
              duration: 5,
              repeat: Infinity,
              ease: stryMutAct_9fa48("11905") ? "" : (stryCov_9fa48("11905"), "easeInOut"),
              delay: 2
            })} className="absolute bottom-0 right-8">
              <Sparkles className="w-5 h-5 text-primary-300" />
            </motion.div>
          </motion.div>

          {/* 404 Text */}
          <motion.div initial={stryMutAct_9fa48("11906") ? {} : (stryCov_9fa48("11906"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("11907") ? {} : (stryCov_9fa48("11907"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("11908") ? {} : (stryCov_9fa48("11908"), {
            duration: 0.6,
            delay: 0.2
          })} className="mb-8">
            <h1 className="text-8xl font-bold text-gradient mb-4">404</h1>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Gift Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Looks like this page went gift hunting and got lost! Don't worry, 
              we'll help you find exactly what you're looking for.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div initial={stryMutAct_9fa48("11909") ? {} : (stryCov_9fa48("11909"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("11910") ? {} : (stryCov_9fa48("11910"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("11911") ? {} : (stryCov_9fa48("11911"), {
            duration: 0.6,
            delay: 0.4
          })} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.div whileHover={stryMutAct_9fa48("11912") ? {} : (stryCov_9fa48("11912"), {
              scale: 1.05
            })} whileTap={stryMutAct_9fa48("11913") ? {} : (stryCov_9fa48("11913"), {
              scale: 0.95
            })}>
              <Link href="/" className="btn-primary btn-hover-lift">
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </motion.div>
            
            <motion.div whileHover={stryMutAct_9fa48("11914") ? {} : (stryCov_9fa48("11914"), {
              scale: 1.05
            })} whileTap={stryMutAct_9fa48("11915") ? {} : (stryCov_9fa48("11915"), {
              scale: 0.95
            })}>
              <Link href="/discover" className="btn-secondary btn-hover-lift">
                <Gift className="w-5 h-5" />
                Discover Gifts
              </Link>
            </motion.div>
            
            <motion.div whileHover={stryMutAct_9fa48("11916") ? {} : (stryCov_9fa48("11916"), {
              scale: 1.05
            })} whileTap={stryMutAct_9fa48("11917") ? {} : (stryCov_9fa48("11917"), {
              scale: 0.95
            })}>
              <Link href="/search" className="btn-outline btn-hover-lift">
                <Search className="w-5 h-5" />
                Search
              </Link>
            </motion.div>
          </motion.div>

          {/* Popular Links */}
          <motion.div initial={stryMutAct_9fa48("11918") ? {} : (stryCov_9fa48("11918"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("11919") ? {} : (stryCov_9fa48("11919"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("11920") ? {} : (stryCov_9fa48("11920"), {
            duration: 0.6,
            delay: 0.6
          })} className="glass-light rounded-2xl p-6 max-w-md mx-auto border border-white/20">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
            <div className="space-y-3">
              <Link href="/discover" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <Gift className="w-4 h-4 text-primary-600" />
                </div>
                <span className="font-medium">Discover Gifts</span>
              </Link>
              
              <Link href="/auth/register" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group">
                <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                  <Sparkles className="w-4 h-4 text-secondary-600" />
                </div>
                <span className="font-medium">Sign Up Free</span>
              </Link>
              
              <Link href="/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Home className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium">Dashboard</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div initial={stryMutAct_9fa48("11921") ? {} : (stryCov_9fa48("11921"), {
          opacity: 0
        })} animate={stryMutAct_9fa48("11922") ? {} : (stryCov_9fa48("11922"), {
          opacity: 1
        })} transition={stryMutAct_9fa48("11923") ? {} : (stryCov_9fa48("11923"), {
          duration: 0.6,
          delay: 0.8
        })} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">Contact us</Link>
          </p>
        </motion.div>
      </div>
    </>;
  }
}