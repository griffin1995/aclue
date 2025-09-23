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
import { appConfig } from '@/config';
export type Theme = 'light' | 'dark' | 'system';
interface UseDarkModeReturn {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
export function useDarkMode(): UseDarkModeReturn {
  if (stryMutAct_9fa48("9046")) {
    {}
  } else {
    stryCov_9fa48("9046");
    const [theme, setThemeState] = useState<Theme>(stryMutAct_9fa48("9047") ? "" : (stryCov_9fa48("9047"), 'system'));
    const [isDark, setIsDark] = useState(stryMutAct_9fa48("9048") ? true : (stryCov_9fa48("9048"), false));

    // Initialize theme from localStorage
    useEffect(() => {
      if (stryMutAct_9fa48("9049")) {
        {}
      } else {
        stryCov_9fa48("9049");
        if (stryMutAct_9fa48("9052") ? typeof window === 'undefined' : stryMutAct_9fa48("9051") ? false : stryMutAct_9fa48("9050") ? true : (stryCov_9fa48("9050", "9051", "9052"), typeof window !== (stryMutAct_9fa48("9053") ? "" : (stryCov_9fa48("9053"), 'undefined')))) {
          if (stryMutAct_9fa48("9054")) {
            {}
          } else {
            stryCov_9fa48("9054");
            const savedTheme = localStorage.getItem(appConfig.storage.theme) as Theme;
            if (stryMutAct_9fa48("9057") ? savedTheme || ['light', 'dark', 'system'].includes(savedTheme) : stryMutAct_9fa48("9056") ? false : stryMutAct_9fa48("9055") ? true : (stryCov_9fa48("9055", "9056", "9057"), savedTheme && (stryMutAct_9fa48("9058") ? [] : (stryCov_9fa48("9058"), [stryMutAct_9fa48("9059") ? "" : (stryCov_9fa48("9059"), 'light'), stryMutAct_9fa48("9060") ? "" : (stryCov_9fa48("9060"), 'dark'), stryMutAct_9fa48("9061") ? "" : (stryCov_9fa48("9061"), 'system')])).includes(savedTheme))) {
              if (stryMutAct_9fa48("9062")) {
                {}
              } else {
                stryCov_9fa48("9062");
                setThemeState(savedTheme);
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("9063") ? ["Stryker was here"] : (stryCov_9fa48("9063"), []));

    // Update dark mode state based on theme preference
    useEffect(() => {
      if (stryMutAct_9fa48("9064")) {
        {}
      } else {
        stryCov_9fa48("9064");
        const updateDarkMode = () => {
          if (stryMutAct_9fa48("9065")) {
            {}
          } else {
            stryCov_9fa48("9065");
            let shouldBeDark = stryMutAct_9fa48("9066") ? true : (stryCov_9fa48("9066"), false);
            if (stryMutAct_9fa48("9069") ? theme !== 'dark' : stryMutAct_9fa48("9068") ? false : stryMutAct_9fa48("9067") ? true : (stryCov_9fa48("9067", "9068", "9069"), theme === (stryMutAct_9fa48("9070") ? "" : (stryCov_9fa48("9070"), 'dark')))) {
              if (stryMutAct_9fa48("9071")) {
                {}
              } else {
                stryCov_9fa48("9071");
                shouldBeDark = stryMutAct_9fa48("9072") ? false : (stryCov_9fa48("9072"), true);
              }
            } else if (stryMutAct_9fa48("9075") ? theme !== 'light' : stryMutAct_9fa48("9074") ? false : stryMutAct_9fa48("9073") ? true : (stryCov_9fa48("9073", "9074", "9075"), theme === (stryMutAct_9fa48("9076") ? "" : (stryCov_9fa48("9076"), 'light')))) {
              if (stryMutAct_9fa48("9077")) {
                {}
              } else {
                stryCov_9fa48("9077");
                shouldBeDark = stryMutAct_9fa48("9078") ? true : (stryCov_9fa48("9078"), false);
              }
            } else if (stryMutAct_9fa48("9081") ? theme !== 'system' : stryMutAct_9fa48("9080") ? false : stryMutAct_9fa48("9079") ? true : (stryCov_9fa48("9079", "9080", "9081"), theme === (stryMutAct_9fa48("9082") ? "" : (stryCov_9fa48("9082"), 'system')))) {
              if (stryMutAct_9fa48("9083")) {
                {}
              } else {
                stryCov_9fa48("9083");
                shouldBeDark = window.matchMedia(stryMutAct_9fa48("9084") ? "" : (stryCov_9fa48("9084"), '(prefers-color-scheme: dark)')).matches;
              }
            }
            setIsDark(shouldBeDark);

            // Update DOM
            if (stryMutAct_9fa48("9087") ? typeof window === 'undefined' : stryMutAct_9fa48("9086") ? false : stryMutAct_9fa48("9085") ? true : (stryCov_9fa48("9085", "9086", "9087"), typeof window !== (stryMutAct_9fa48("9088") ? "" : (stryCov_9fa48("9088"), 'undefined')))) {
              if (stryMutAct_9fa48("9089")) {
                {}
              } else {
                stryCov_9fa48("9089");
                const root = window.document.documentElement;
                if (stryMutAct_9fa48("9091") ? false : stryMutAct_9fa48("9090") ? true : (stryCov_9fa48("9090", "9091"), shouldBeDark)) {
                  if (stryMutAct_9fa48("9092")) {
                    {}
                  } else {
                    stryCov_9fa48("9092");
                    root.classList.add(stryMutAct_9fa48("9093") ? "" : (stryCov_9fa48("9093"), 'dark'));
                  }
                } else {
                  if (stryMutAct_9fa48("9094")) {
                    {}
                  } else {
                    stryCov_9fa48("9094");
                    root.classList.remove(stryMutAct_9fa48("9095") ? "" : (stryCov_9fa48("9095"), 'dark'));
                  }
                }
              }
            }
          }
        };
        updateDarkMode();

        // Listen for system theme changes
        const mediaQuery = window.matchMedia(stryMutAct_9fa48("9096") ? "" : (stryCov_9fa48("9096"), '(prefers-color-scheme: dark)'));
        const handleChange = () => {
          if (stryMutAct_9fa48("9097")) {
            {}
          } else {
            stryCov_9fa48("9097");
            if (stryMutAct_9fa48("9100") ? theme !== 'system' : stryMutAct_9fa48("9099") ? false : stryMutAct_9fa48("9098") ? true : (stryCov_9fa48("9098", "9099", "9100"), theme === (stryMutAct_9fa48("9101") ? "" : (stryCov_9fa48("9101"), 'system')))) {
              if (stryMutAct_9fa48("9102")) {
                {}
              } else {
                stryCov_9fa48("9102");
                updateDarkMode();
              }
            }
          }
        };
        mediaQuery.addEventListener(stryMutAct_9fa48("9103") ? "" : (stryCov_9fa48("9103"), 'change'), handleChange);
        return stryMutAct_9fa48("9104") ? () => undefined : (stryCov_9fa48("9104"), () => mediaQuery.removeEventListener(stryMutAct_9fa48("9105") ? "" : (stryCov_9fa48("9105"), 'change'), handleChange));
      }
    }, stryMutAct_9fa48("9106") ? [] : (stryCov_9fa48("9106"), [theme]));

    // Set theme and persist to localStorage
    const setTheme = (newTheme: Theme) => {
      if (stryMutAct_9fa48("9107")) {
        {}
      } else {
        stryCov_9fa48("9107");
        setThemeState(newTheme);
        if (stryMutAct_9fa48("9110") ? typeof window === 'undefined' : stryMutAct_9fa48("9109") ? false : stryMutAct_9fa48("9108") ? true : (stryCov_9fa48("9108", "9109", "9110"), typeof window !== (stryMutAct_9fa48("9111") ? "" : (stryCov_9fa48("9111"), 'undefined')))) {
          if (stryMutAct_9fa48("9112")) {
            {}
          } else {
            stryCov_9fa48("9112");
            localStorage.setItem(appConfig.storage.theme, newTheme);
          }
        }
      }
    };

    // Toggle between light and dark mode
    const toggleTheme = () => {
      if (stryMutAct_9fa48("9113")) {
        {}
      } else {
        stryCov_9fa48("9113");
        if (stryMutAct_9fa48("9116") ? theme !== 'system' : stryMutAct_9fa48("9115") ? false : stryMutAct_9fa48("9114") ? true : (stryCov_9fa48("9114", "9115", "9116"), theme === (stryMutAct_9fa48("9117") ? "" : (stryCov_9fa48("9117"), 'system')))) {
          if (stryMutAct_9fa48("9118")) {
            {}
          } else {
            stryCov_9fa48("9118");
            // If currently system, toggle to the opposite of current dark state
            setTheme(isDark ? stryMutAct_9fa48("9119") ? "" : (stryCov_9fa48("9119"), 'light') : stryMutAct_9fa48("9120") ? "" : (stryCov_9fa48("9120"), 'dark'));
          }
        } else {
          if (stryMutAct_9fa48("9121")) {
            {}
          } else {
            stryCov_9fa48("9121");
            // If manually set, toggle between light and dark
            setTheme((stryMutAct_9fa48("9124") ? theme !== 'light' : stryMutAct_9fa48("9123") ? false : stryMutAct_9fa48("9122") ? true : (stryCov_9fa48("9122", "9123", "9124"), theme === (stryMutAct_9fa48("9125") ? "" : (stryCov_9fa48("9125"), 'light')))) ? stryMutAct_9fa48("9126") ? "" : (stryCov_9fa48("9126"), 'dark') : stryMutAct_9fa48("9127") ? "" : (stryCov_9fa48("9127"), 'light'));
          }
        }
      }
    };
    return stryMutAct_9fa48("9128") ? {} : (stryCov_9fa48("9128"), {
      theme,
      isDark,
      setTheme,
      toggleTheme
    });
  }
}