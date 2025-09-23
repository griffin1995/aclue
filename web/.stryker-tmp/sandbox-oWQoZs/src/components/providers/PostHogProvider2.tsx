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
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initPostHog, posthog } from '@/lib/posthog';
export function PostHogProvider2({
  children
}: {
  children: React.ReactNode;
}) {
  if (stryMutAct_9fa48("4885")) {
    {}
  } else {
    stryCov_9fa48("4885");
    const router = useRouter();
    useEffect(() => {
      if (stryMutAct_9fa48("4886")) {
        {}
      } else {
        stryCov_9fa48("4886");
        // Initialize PostHog
        initPostHog();

        // Track page views on route change
        const handleRouteChange = () => {
          if (stryMutAct_9fa48("4887")) {
            {}
          } else {
            stryCov_9fa48("4887");
            stryMutAct_9fa48("4888") ? posthog.capture('$pageview') : (stryCov_9fa48("4888"), posthog?.capture(stryMutAct_9fa48("4889") ? "" : (stryCov_9fa48("4889"), '$pageview')));
          }
        };
        router.events.on(stryMutAct_9fa48("4890") ? "" : (stryCov_9fa48("4890"), 'routeChangeComplete'), handleRouteChange);
        return () => {
          if (stryMutAct_9fa48("4891")) {
            {}
          } else {
            stryCov_9fa48("4891");
            router.events.off(stryMutAct_9fa48("4892") ? "" : (stryCov_9fa48("4892"), 'routeChangeComplete'), handleRouteChange);
          }
        };
      }
    }, stryMutAct_9fa48("4893") ? [] : (stryCov_9fa48("4893"), [router.events]));
    return <>{children}</>;
  }
}