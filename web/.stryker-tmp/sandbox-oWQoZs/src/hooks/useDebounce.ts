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
import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  if (stryMutAct_9fa48("9129")) {
    {}
  } else {
    stryCov_9fa48("9129");
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
      if (stryMutAct_9fa48("9130")) {
        {}
      } else {
        stryCov_9fa48("9130");
        const handler = setTimeout(() => {
          if (stryMutAct_9fa48("9131")) {
            {}
          } else {
            stryCov_9fa48("9131");
            setDebouncedValue(value);
          }
        }, delay);
        return () => {
          if (stryMutAct_9fa48("9132")) {
            {}
          } else {
            stryCov_9fa48("9132");
            clearTimeout(handler);
          }
        };
      }
    }, stryMutAct_9fa48("9133") ? [] : (stryCov_9fa48("9133"), [value, delay]));
    return debouncedValue;
  }
}