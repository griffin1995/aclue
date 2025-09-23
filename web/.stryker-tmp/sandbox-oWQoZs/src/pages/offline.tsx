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
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Gift, Home } from 'lucide-react';
export default function OfflinePage() {
  if (stryMutAct_9fa48("14205")) {
    {}
  } else {
    stryCov_9fa48("14205");
    const handleRetry = () => {
      if (stryMutAct_9fa48("14206")) {
        {}
      } else {
        stryCov_9fa48("14206");
        window.location.reload();
      }
    };
    return <>
      <Head>
        <title>Offline - aclue</title>
        <meta name="description" content="aclue is currently offline. Please check your internet connection." />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <motion.div initial={stryMutAct_9fa48("14207") ? {} : (stryCov_9fa48("14207"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("14208") ? {} : (stryCov_9fa48("14208"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("14209") ? {} : (stryCov_9fa48("14209"), {
            duration: 0.6
          })} className="bg-white rounded-2xl shadow-xl p-8">
            {/* Icon */}
            <motion.div initial={stryMutAct_9fa48("14210") ? {} : (stryCov_9fa48("14210"), {
              scale: 0
            })} animate={stryMutAct_9fa48("14211") ? {} : (stryCov_9fa48("14211"), {
              scale: 1
            })} transition={stryMutAct_9fa48("14212") ? {} : (stryCov_9fa48("14212"), {
              duration: 0.5,
              delay: 0.2
            })} className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <WifiOff className="w-12 h-12 text-gray-600" />
            </motion.div>

            {/* Title */}
            <motion.h1 initial={stryMutAct_9fa48("14213") ? {} : (stryCov_9fa48("14213"), {
              opacity: 0
            })} animate={stryMutAct_9fa48("14214") ? {} : (stryCov_9fa48("14214"), {
              opacity: 1
            })} transition={stryMutAct_9fa48("14215") ? {} : (stryCov_9fa48("14215"), {
              delay: 0.4
            })} className="text-2xl font-bold text-gray-900 mb-4">
              You're Offline
            </motion.h1>

            {/* Description */}
            <motion.p initial={stryMutAct_9fa48("14216") ? {} : (stryCov_9fa48("14216"), {
              opacity: 0
            })} animate={stryMutAct_9fa48("14217") ? {} : (stryCov_9fa48("14217"), {
              opacity: 1
            })} transition={stryMutAct_9fa48("14218") ? {} : (stryCov_9fa48("14218"), {
              delay: 0.6
            })} className="text-gray-600 mb-8 leading-relaxed">
              aclue needs an internet connection to discover new gifts and sync your preferences. 
              Please check your connection and try again.
            </motion.p>

            {/* Actions */}
            <motion.div initial={stryMutAct_9fa48("14219") ? {} : (stryCov_9fa48("14219"), {
              opacity: 0
            })} animate={stryMutAct_9fa48("14220") ? {} : (stryCov_9fa48("14220"), {
              opacity: 1
            })} transition={stryMutAct_9fa48("14221") ? {} : (stryCov_9fa48("14221"), {
              delay: 0.8
            })} className="space-y-4">
              <button onClick={handleRetry} className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <Link href="/" className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </motion.div>

            {/* Offline Features */}
            <motion.div initial={stryMutAct_9fa48("14222") ? {} : (stryCov_9fa48("14222"), {
              opacity: 0
            })} animate={stryMutAct_9fa48("14223") ? {} : (stryCov_9fa48("14223"), {
              opacity: 1
            })} transition={stryMutAct_9fa48("14224") ? {} : (stryCov_9fa48("14224"), {
              delay: 1
            })} className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Offline Mode</span>
              </div>
              <p className="text-sm text-blue-700">
                While offline, you can still browse previously loaded content. 
                Your swipes and preferences will sync when you're back online.
              </p>
            </motion.div>

            {/* Connection Tips */}
            <motion.div initial={stryMutAct_9fa48("14225") ? {} : (stryCov_9fa48("14225"), {
              opacity: 0
            })} animate={stryMutAct_9fa48("14226") ? {} : (stryCov_9fa48("14226"), {
              opacity: 1
            })} transition={stryMutAct_9fa48("14227") ? {} : (stryCov_9fa48("14227"), {
              delay: 1.2
            })} className="mt-6 text-left">
              <h3 className="font-medium text-gray-900 mb-3">Connection Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  Check your WiFi or mobile data connection
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  Try switching between WiFi and mobile data
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  Check if other apps are working
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  Try refreshing the page
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.p initial={stryMutAct_9fa48("14228") ? {} : (stryCov_9fa48("14228"), {
            opacity: 0
          })} animate={stryMutAct_9fa48("14229") ? {} : (stryCov_9fa48("14229"), {
            opacity: 1
          })} transition={stryMutAct_9fa48("14230") ? {} : (stryCov_9fa48("14230"), {
            delay: 1.4
          })} className="mt-6 text-sm text-gray-500">
            aclue works best with a stable internet connection for real-time recommendations.
          </motion.p>
        </div>
      </div>
    </>;
  }
}