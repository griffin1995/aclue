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
import posthog from 'posthog-js';
export function initPostHog() {
  if (stryMutAct_9fa48("11560")) {
    {}
  } else {
    stryCov_9fa48("11560");
    if (stryMutAct_9fa48("11563") ? typeof window !== 'undefined' || process.env.NEXT_PUBLIC_POSTHOG_KEY : stryMutAct_9fa48("11562") ? false : stryMutAct_9fa48("11561") ? true : (stryCov_9fa48("11561", "11562", "11563"), (stryMutAct_9fa48("11565") ? typeof window === 'undefined' : stryMutAct_9fa48("11564") ? true : (stryCov_9fa48("11564", "11565"), typeof window !== (stryMutAct_9fa48("11566") ? "" : (stryCov_9fa48("11566"), 'undefined')))) && process.env.NEXT_PUBLIC_POSTHOG_KEY)) {
      if (stryMutAct_9fa48("11567")) {
        {}
      } else {
        stryCov_9fa48("11567");
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, stryMutAct_9fa48("11568") ? {} : (stryCov_9fa48("11568"), {
          api_host: stryMutAct_9fa48("11571") ? process.env.NEXT_PUBLIC_POSTHOG_HOST && 'https://app.posthog.com' : stryMutAct_9fa48("11570") ? false : stryMutAct_9fa48("11569") ? true : (stryCov_9fa48("11569", "11570", "11571"), process.env.NEXT_PUBLIC_POSTHOG_HOST || (stryMutAct_9fa48("11572") ? "" : (stryCov_9fa48("11572"), 'https://app.posthog.com'))),
          person_profiles: stryMutAct_9fa48("11573") ? "" : (stryCov_9fa48("11573"), 'identified_only'),
          capture_pageview: stryMutAct_9fa48("11574") ? true : (stryCov_9fa48("11574"), false),
          // We'll handle this manually
          capture_pageleave: stryMutAct_9fa48("11575") ? false : (stryCov_9fa48("11575"), true),
          debug: stryMutAct_9fa48("11578") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("11577") ? false : stryMutAct_9fa48("11576") ? true : (stryCov_9fa48("11576", "11577", "11578"), process.env.NODE_ENV === (stryMutAct_9fa48("11579") ? "" : (stryCov_9fa48("11579"), 'development')))
        }));
      }
    }
  }
}
export { posthog };