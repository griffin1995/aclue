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
import React, { createContext, useContext, ReactNode } from 'react';
import { useDarkMode, Theme } from '@/hooks/useDarkMode';
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
interface ThemeProviderProps {
  children: ReactNode;
}
export function ThemeProvider({
  children
}: ThemeProviderProps) {
  if (stryMutAct_9fa48("8903")) {
    {}
  } else {
    stryCov_9fa48("8903");
    const darkMode = useDarkMode();
    return <ThemeContext.Provider value={darkMode}>
      {children}
    </ThemeContext.Provider>;
  }
}
export function useTheme() {
  if (stryMutAct_9fa48("8904")) {
    {}
  } else {
    stryCov_9fa48("8904");
    const context = useContext(ThemeContext);
    if (stryMutAct_9fa48("8907") ? context !== undefined : stryMutAct_9fa48("8906") ? false : stryMutAct_9fa48("8905") ? true : (stryCov_9fa48("8905", "8906", "8907"), context === undefined)) {
      if (stryMutAct_9fa48("8908")) {
        {}
      } else {
        stryCov_9fa48("8908");
        throw new Error(stryMutAct_9fa48("8909") ? "" : (stryCov_9fa48("8909"), 'useTheme must be used within a ThemeProvider'));
      }
    }
    return context;
  }
}