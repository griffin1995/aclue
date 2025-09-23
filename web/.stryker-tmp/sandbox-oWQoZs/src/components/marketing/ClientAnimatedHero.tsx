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
import { motion } from 'framer-motion';
import { Gift, Heart } from 'lucide-react';

/**
 * Client Animated Hero - Client Component
 *
 * Client-side animations for hero section floating elements.
 * Provides enhanced user experience through motion without blocking initial render.
 *
 * Features:
 * - Framer Motion animations
 * - Floating decorative elements
 * - Progressive enhancement
 * - Performance-optimised animations
 */

export default function ClientAnimatedHero() {
  if (stryMutAct_9fa48("3801")) {
    {}
  } else {
    stryCov_9fa48("3801");
    return <>
      {/* Animated Floating Elements */}
      <motion.div animate={stryMutAct_9fa48("3802") ? {} : (stryCov_9fa48("3802"), {
        y: stryMutAct_9fa48("3803") ? [] : (stryCov_9fa48("3803"), [stryMutAct_9fa48("3804") ? +10 : (stryCov_9fa48("3804"), -10), 10, stryMutAct_9fa48("3805") ? +10 : (stryCov_9fa48("3805"), -10)])
      })} transition={stryMutAct_9fa48("3806") ? {} : (stryCov_9fa48("3806"), {
        duration: 4,
        repeat: Infinity
      })} className="absolute top-10 -left-4 bg-yellow-400 rounded-full p-3 z-20">
        <Gift className="w-6 h-6 text-white" />
      </motion.div>

      <motion.div animate={stryMutAct_9fa48("3807") ? {} : (stryCov_9fa48("3807"), {
        y: stryMutAct_9fa48("3808") ? [] : (stryCov_9fa48("3808"), [10, stryMutAct_9fa48("3809") ? +10 : (stryCov_9fa48("3809"), -10), 10])
      })} transition={stryMutAct_9fa48("3810") ? {} : (stryCov_9fa48("3810"), {
        duration: 3,
        repeat: Infinity
      })} className="absolute bottom-10 -right-4 bg-pink-400 rounded-full p-3 z-20">
        <Heart className="w-6 h-6 text-white" />
      </motion.div>
    </>;
  }
}