/**
 * Guest Notice - Client Component
 *
 * Notification banner for guest users encouraging authentication.
 * Shows benefits of signing up while allowing dismissal.
 */
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
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
export function GuestNotice() {
  if (stryMutAct_9fa48("5856")) {
    {}
  } else {
    stryCov_9fa48("5856");
    const [isDismissed, setIsDismissed] = useState(stryMutAct_9fa48("5857") ? true : (stryCov_9fa48("5857"), false));
    if (stryMutAct_9fa48("5859") ? false : stryMutAct_9fa48("5858") ? true : (stryCov_9fa48("5858", "5859"), isDismissed)) return null;
    return <AnimatePresence>
      <motion.div initial={stryMutAct_9fa48("5860") ? {} : (stryCov_9fa48("5860"), {
        opacity: 0,
        y: stryMutAct_9fa48("5861") ? +20 : (stryCov_9fa48("5861"), -20)
      })} animate={stryMutAct_9fa48("5862") ? {} : (stryCov_9fa48("5862"), {
        opacity: 1,
        y: 0
      })} exit={stryMutAct_9fa48("5863") ? {} : (stryCov_9fa48("5863"), {
        opacity: 0,
        y: stryMutAct_9fa48("5864") ? +20 : (stryCov_9fa48("5864"), -20)
      })} className="bg-amber-50 border-b border-amber-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">
              You're browsing as a guest.{stryMutAct_9fa48("5865") ? "" : (stryCov_9fa48("5865"), ' ')}
              <Link href="/auth/register" className="font-medium underline hover:no-underline">
                Sign up
              </Link>{stryMutAct_9fa48("5866") ? "" : (stryCov_9fa48("5866"), ' ')}
              to save your preferences and get personalised recommendations.
            </span>
          </div>
          <button onClick={stryMutAct_9fa48("5867") ? () => undefined : (stryCov_9fa48("5867"), () => setIsDismissed(stryMutAct_9fa48("5868") ? false : (stryCov_9fa48("5868"), true)))} className="text-amber-600 hover:text-amber-800 ml-4 flex-shrink-0" aria-label="Dismiss notice">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>;
  }
}