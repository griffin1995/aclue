/**
 * Welcome Overlay - Client Component
 *
 * Modal overlay that introduces new users to the swipe interface.
 * Provides instructions and encourages engagement with the discovery process.
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
import React from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
interface WelcomeOverlayProps {
  onDismiss: () => void;
  isAuthenticated: boolean;
}
export function WelcomeOverlay({
  onDismiss,
  isAuthenticated
}: WelcomeOverlayProps) {
  if (stryMutAct_9fa48("6403")) {
    {}
  } else {
    stryCov_9fa48("6403");
    return <motion.div initial={stryMutAct_9fa48("6404") ? {} : (stryCov_9fa48("6404"), {
      opacity: 0
    })} animate={stryMutAct_9fa48("6405") ? {} : (stryCov_9fa48("6405"), {
      opacity: 1
    })} exit={stryMutAct_9fa48("6406") ? {} : (stryCov_9fa48("6406"), {
      opacity: 0
    })} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={onDismiss}>
      <motion.div initial={stryMutAct_9fa48("6407") ? {} : (stryCov_9fa48("6407"), {
        scale: 0.9,
        opacity: 0
      })} animate={stryMutAct_9fa48("6408") ? {} : (stryCov_9fa48("6408"), {
        scale: 1,
        opacity: 1
      })} exit={stryMutAct_9fa48("6409") ? {} : (stryCov_9fa48("6409"), {
        scale: 0.9,
        opacity: 0
      })} transition={stryMutAct_9fa48("6410") ? {} : (stryCov_9fa48("6410"), {
        duration: 0.3
      })} className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl" onClick={stryMutAct_9fa48("6411") ? () => undefined : (stryCov_9fa48("6411"), e => e.stopPropagation())}>
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift className="w-8 h-8 text-primary-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Gift Discovery!
        </h2>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Swipe through products to help our AI learn your preferences.
          Like what you see? Swipe right. Not your style? Swipe left.
        </p>

        <div className="space-y-3 text-sm text-gray-500 mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Swipe left to dislike</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <ArrowRight className="w-4 h-4" />
            </div>
            <span>Swipe right to like</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <ArrowUp className="w-4 h-4" />
            </div>
            <span>Swipe up to super like</span>
          </div>
        </div>

        {stryMutAct_9fa48("6414") ? !isAuthenticated || <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-amber-800">
              💡 <strong>Tip:</strong> Sign up to save your preferences and get personalised recommendations!
            </p>
          </div> : stryMutAct_9fa48("6413") ? false : stryMutAct_9fa48("6412") ? true : (stryCov_9fa48("6412", "6413", "6414"), (stryMutAct_9fa48("6415") ? isAuthenticated : (stryCov_9fa48("6415"), !isAuthenticated)) && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-amber-800">
              💡 <strong>Tip:</strong> Sign up to save your preferences and get personalised recommendations!
            </p>
          </div>)}

        <button onClick={onDismiss} className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
          Start Discovering
        </button>
      </motion.div>
    </motion.div>;
  }
}