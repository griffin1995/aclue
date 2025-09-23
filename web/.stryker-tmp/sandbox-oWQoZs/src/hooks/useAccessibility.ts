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
import { useEffect, useState, useCallback } from 'react';
interface UseAccessibilityOptions {
  announcePageChanges?: boolean;
  enableKeyboardNavigation?: boolean;
  reducedMotion?: boolean;
}
interface UseAccessibilityReturn {
  isReducedMotion: boolean;
  announceToScreenReader: (message: string) => void;
  focusOnElement: (selector: string) => void;
  trapFocus: (container: HTMLElement) => () => void;
  getSkipLinks: () => {
    href: string;
    label: string;
  }[];
}
export function useAccessibility(options: UseAccessibilityOptions = {}): UseAccessibilityReturn {
  if (stryMutAct_9fa48("8910")) {
    {}
  } else {
    stryCov_9fa48("8910");
    const {
      announcePageChanges = stryMutAct_9fa48("8911") ? false : (stryCov_9fa48("8911"), true),
      enableKeyboardNavigation = stryMutAct_9fa48("8912") ? false : (stryCov_9fa48("8912"), true),
      reducedMotion = stryMutAct_9fa48("8913") ? false : (stryCov_9fa48("8913"), true)
    } = options;
    const [isReducedMotion, setIsReducedMotion] = useState(stryMutAct_9fa48("8914") ? true : (stryCov_9fa48("8914"), false));

    // Check for reduced motion preference
    useEffect(() => {
      if (stryMutAct_9fa48("8915")) {
        {}
      } else {
        stryCov_9fa48("8915");
        if (stryMutAct_9fa48("8918") ? false : stryMutAct_9fa48("8917") ? true : stryMutAct_9fa48("8916") ? reducedMotion : (stryCov_9fa48("8916", "8917", "8918"), !reducedMotion)) return;
        const mediaQuery = window.matchMedia(stryMutAct_9fa48("8919") ? "" : (stryCov_9fa48("8919"), '(prefers-reduced-motion: reduce)'));
        setIsReducedMotion(mediaQuery.matches);
        const handleChange = (event: MediaQueryListEvent) => {
          if (stryMutAct_9fa48("8920")) {
            {}
          } else {
            stryCov_9fa48("8920");
            setIsReducedMotion(event.matches);
          }
        };
        mediaQuery.addEventListener(stryMutAct_9fa48("8921") ? "" : (stryCov_9fa48("8921"), 'change'), handleChange);
        return stryMutAct_9fa48("8922") ? () => undefined : (stryCov_9fa48("8922"), () => mediaQuery.removeEventListener(stryMutAct_9fa48("8923") ? "" : (stryCov_9fa48("8923"), 'change'), handleChange));
      }
    }, stryMutAct_9fa48("8924") ? [] : (stryCov_9fa48("8924"), [reducedMotion]));

    // Announce messages to screen readers
    const announceToScreenReader = useCallback((message: string) => {
      if (stryMutAct_9fa48("8925")) {
        {}
      } else {
        stryCov_9fa48("8925");
        const announcement = document.createElement(stryMutAct_9fa48("8926") ? "" : (stryCov_9fa48("8926"), 'div'));
        announcement.setAttribute(stryMutAct_9fa48("8927") ? "" : (stryCov_9fa48("8927"), 'aria-live'), stryMutAct_9fa48("8928") ? "" : (stryCov_9fa48("8928"), 'polite'));
        announcement.setAttribute(stryMutAct_9fa48("8929") ? "" : (stryCov_9fa48("8929"), 'aria-atomic'), stryMutAct_9fa48("8930") ? "" : (stryCov_9fa48("8930"), 'true'));
        announcement.setAttribute(stryMutAct_9fa48("8931") ? "" : (stryCov_9fa48("8931"), 'class'), stryMutAct_9fa48("8932") ? "" : (stryCov_9fa48("8932"), 'sr-only'));
        announcement.textContent = message;
        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
          if (stryMutAct_9fa48("8933")) {
            {}
          } else {
            stryCov_9fa48("8933");
            document.body.removeChild(announcement);
          }
        }, 1000);
      }
    }, stryMutAct_9fa48("8934") ? ["Stryker was here"] : (stryCov_9fa48("8934"), []));

    // Focus on an element by selector
    const focusOnElement = useCallback((selector: string) => {
      if (stryMutAct_9fa48("8935")) {
        {}
      } else {
        stryCov_9fa48("8935");
        const element = document.querySelector(selector) as HTMLElement;
        if (stryMutAct_9fa48("8937") ? false : stryMutAct_9fa48("8936") ? true : (stryCov_9fa48("8936", "8937"), element)) {
          if (stryMutAct_9fa48("8938")) {
            {}
          } else {
            stryCov_9fa48("8938");
            element.focus();

            // Scroll into view if needed
            element.scrollIntoView(stryMutAct_9fa48("8939") ? {} : (stryCov_9fa48("8939"), {
              behavior: isReducedMotion ? stryMutAct_9fa48("8940") ? "" : (stryCov_9fa48("8940"), 'auto') : stryMutAct_9fa48("8941") ? "" : (stryCov_9fa48("8941"), 'smooth'),
              block: stryMutAct_9fa48("8942") ? "" : (stryCov_9fa48("8942"), 'center')
            }));
          }
        }
      }
    }, stryMutAct_9fa48("8943") ? [] : (stryCov_9fa48("8943"), [isReducedMotion]));

    // Trap focus within a container (for modals, etc.)
    const trapFocus = useCallback((container: HTMLElement) => {
      if (stryMutAct_9fa48("8944")) {
        {}
      } else {
        stryCov_9fa48("8944");
        const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as NodeListOf<HTMLElement>;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[stryMutAct_9fa48("8945") ? focusableElements.length + 1 : (stryCov_9fa48("8945"), focusableElements.length - 1)];
        const handleTabKey = (event: KeyboardEvent) => {
          if (stryMutAct_9fa48("8946")) {
            {}
          } else {
            stryCov_9fa48("8946");
            if (stryMutAct_9fa48("8949") ? event.key === 'Tab' : stryMutAct_9fa48("8948") ? false : stryMutAct_9fa48("8947") ? true : (stryCov_9fa48("8947", "8948", "8949"), event.key !== (stryMutAct_9fa48("8950") ? "" : (stryCov_9fa48("8950"), 'Tab')))) return;
            if (stryMutAct_9fa48("8952") ? false : stryMutAct_9fa48("8951") ? true : (stryCov_9fa48("8951", "8952"), event.shiftKey)) {
              if (stryMutAct_9fa48("8953")) {
                {}
              } else {
                stryCov_9fa48("8953");
                // Shift + Tab
                if (stryMutAct_9fa48("8956") ? document.activeElement === firstElement || lastElement : stryMutAct_9fa48("8955") ? false : stryMutAct_9fa48("8954") ? true : (stryCov_9fa48("8954", "8955", "8956"), (stryMutAct_9fa48("8958") ? document.activeElement !== firstElement : stryMutAct_9fa48("8957") ? true : (stryCov_9fa48("8957", "8958"), document.activeElement === firstElement)) && lastElement)) {
                  if (stryMutAct_9fa48("8959")) {
                    {}
                  } else {
                    stryCov_9fa48("8959");
                    lastElement.focus();
                    event.preventDefault();
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("8960")) {
                {}
              } else {
                stryCov_9fa48("8960");
                // Tab
                if (stryMutAct_9fa48("8963") ? document.activeElement === lastElement || firstElement : stryMutAct_9fa48("8962") ? false : stryMutAct_9fa48("8961") ? true : (stryCov_9fa48("8961", "8962", "8963"), (stryMutAct_9fa48("8965") ? document.activeElement !== lastElement : stryMutAct_9fa48("8964") ? true : (stryCov_9fa48("8964", "8965"), document.activeElement === lastElement)) && firstElement)) {
                  if (stryMutAct_9fa48("8966")) {
                    {}
                  } else {
                    stryCov_9fa48("8966");
                    firstElement.focus();
                    event.preventDefault();
                  }
                }
              }
            }
          }
        };
        const handleEscapeKey = (event: KeyboardEvent) => {
          if (stryMutAct_9fa48("8967")) {
            {}
          } else {
            stryCov_9fa48("8967");
            if (stryMutAct_9fa48("8970") ? event.key !== 'Escape' : stryMutAct_9fa48("8969") ? false : stryMutAct_9fa48("8968") ? true : (stryCov_9fa48("8968", "8969", "8970"), event.key === (stryMutAct_9fa48("8971") ? "" : (stryCov_9fa48("8971"), 'Escape')))) {
              if (stryMutAct_9fa48("8972")) {
                {}
              } else {
                stryCov_9fa48("8972");
                // Close modal or return focus
                const closeButton = container.querySelector('[data-close]') as HTMLElement;
                if (stryMutAct_9fa48("8974") ? false : stryMutAct_9fa48("8973") ? true : (stryCov_9fa48("8973", "8974"), closeButton)) {
                  if (stryMutAct_9fa48("8975")) {
                    {}
                  } else {
                    stryCov_9fa48("8975");
                    closeButton.click();
                  }
                }
              }
            }
          }
        };
        document.addEventListener(stryMutAct_9fa48("8976") ? "" : (stryCov_9fa48("8976"), 'keydown'), handleTabKey);
        document.addEventListener(stryMutAct_9fa48("8977") ? "" : (stryCov_9fa48("8977"), 'keydown'), handleEscapeKey);

        // Focus first element
        if (stryMutAct_9fa48("8979") ? false : stryMutAct_9fa48("8978") ? true : (stryCov_9fa48("8978", "8979"), firstElement)) {
          if (stryMutAct_9fa48("8980")) {
            {}
          } else {
            stryCov_9fa48("8980");
            firstElement.focus();
          }
        }

        // Return cleanup function
        return () => {
          if (stryMutAct_9fa48("8981")) {
            {}
          } else {
            stryCov_9fa48("8981");
            document.removeEventListener(stryMutAct_9fa48("8982") ? "" : (stryCov_9fa48("8982"), 'keydown'), handleTabKey);
            document.removeEventListener(stryMutAct_9fa48("8983") ? "" : (stryCov_9fa48("8983"), 'keydown'), handleEscapeKey);
          }
        };
      }
    }, stryMutAct_9fa48("8984") ? ["Stryker was here"] : (stryCov_9fa48("8984"), []));

    // Get skip navigation links
    const getSkipLinks = useCallback(() => {
      if (stryMutAct_9fa48("8985")) {
        {}
      } else {
        stryCov_9fa48("8985");
        return stryMutAct_9fa48("8986") ? [] : (stryCov_9fa48("8986"), [stryMutAct_9fa48("8987") ? {} : (stryCov_9fa48("8987"), {
          href: stryMutAct_9fa48("8988") ? "" : (stryCov_9fa48("8988"), '#main-content'),
          label: stryMutAct_9fa48("8989") ? "" : (stryCov_9fa48("8989"), 'Skip to main content')
        }), stryMutAct_9fa48("8990") ? {} : (stryCov_9fa48("8990"), {
          href: stryMutAct_9fa48("8991") ? "" : (stryCov_9fa48("8991"), '#navigation'),
          label: stryMutAct_9fa48("8992") ? "" : (stryCov_9fa48("8992"), 'Skip to navigation')
        }), stryMutAct_9fa48("8993") ? {} : (stryCov_9fa48("8993"), {
          href: stryMutAct_9fa48("8994") ? "" : (stryCov_9fa48("8994"), '#footer'),
          label: stryMutAct_9fa48("8995") ? "" : (stryCov_9fa48("8995"), 'Skip to footer')
        })]);
      }
    }, stryMutAct_9fa48("8996") ? ["Stryker was here"] : (stryCov_9fa48("8996"), []));

    // Set up keyboard navigation
    useEffect(() => {
      if (stryMutAct_9fa48("8997")) {
        {}
      } else {
        stryCov_9fa48("8997");
        if (stryMutAct_9fa48("9000") ? false : stryMutAct_9fa48("8999") ? true : stryMutAct_9fa48("8998") ? enableKeyboardNavigation : (stryCov_9fa48("8998", "8999", "9000"), !enableKeyboardNavigation)) return;
        const handleKeyDown = (event: KeyboardEvent) => {
          if (stryMutAct_9fa48("9001")) {
            {}
          } else {
            stryCov_9fa48("9001");
            // Global keyboard shortcuts
            if (stryMutAct_9fa48("9003") ? false : stryMutAct_9fa48("9002") ? true : (stryCov_9fa48("9002", "9003"), event.altKey)) {
              if (stryMutAct_9fa48("9004")) {
                {}
              } else {
                stryCov_9fa48("9004");
                switch (event.key) {
                  case stryMutAct_9fa48("9006") ? "" : (stryCov_9fa48("9006"), 'h'):
                    if (stryMutAct_9fa48("9005")) {} else {
                      stryCov_9fa48("9005");
                      // Alt + H: Go to home
                      event.preventDefault();
                      window.location.href = stryMutAct_9fa48("9007") ? "" : (stryCov_9fa48("9007"), '/');
                      break;
                    }
                  case stryMutAct_9fa48("9009") ? "" : (stryCov_9fa48("9009"), 'd'):
                    if (stryMutAct_9fa48("9008")) {} else {
                      stryCov_9fa48("9008");
                      // Alt + D: Go to dashboard
                      event.preventDefault();
                      window.location.href = stryMutAct_9fa48("9010") ? "" : (stryCov_9fa48("9010"), '/dashboard');
                      break;
                    }
                  case stryMutAct_9fa48("9012") ? "" : (stryCov_9fa48("9012"), 's'):
                    if (stryMutAct_9fa48("9011")) {} else {
                      stryCov_9fa48("9011");
                      // Alt + S: Go to search/discover
                      event.preventDefault();
                      window.location.href = stryMutAct_9fa48("9013") ? "" : (stryCov_9fa48("9013"), '/discover');
                      break;
                    }
                  case stryMutAct_9fa48("9015") ? "" : (stryCov_9fa48("9015"), '/'):
                    if (stryMutAct_9fa48("9014")) {} else {
                      stryCov_9fa48("9014");
                      // Alt + /: Focus search
                      event.preventDefault();
                      focusOnElement(stryMutAct_9fa48("9016") ? "" : (stryCov_9fa48("9016"), 'input[type="search"], input[placeholder*="search" i]'));
                      break;
                    }
                }
              }
            }

            // Tab navigation enhancements
            if (stryMutAct_9fa48("9019") ? event.key !== 'Tab' : stryMutAct_9fa48("9018") ? false : stryMutAct_9fa48("9017") ? true : (stryCov_9fa48("9017", "9018", "9019"), event.key === (stryMutAct_9fa48("9020") ? "" : (stryCov_9fa48("9020"), 'Tab')))) {
              if (stryMutAct_9fa48("9021")) {
                {}
              } else {
                stryCov_9fa48("9021");
                // Add visible focus indicators
                document.body.classList.add(stryMutAct_9fa48("9022") ? "" : (stryCov_9fa48("9022"), 'keyboard-navigation'));
              }
            }
          }
        };
        const handleMouseDown = () => {
          if (stryMutAct_9fa48("9023")) {
            {}
          } else {
            stryCov_9fa48("9023");
            // Remove keyboard navigation class on mouse use
            document.body.classList.remove(stryMutAct_9fa48("9024") ? "" : (stryCov_9fa48("9024"), 'keyboard-navigation'));
          }
        };
        document.addEventListener(stryMutAct_9fa48("9025") ? "" : (stryCov_9fa48("9025"), 'keydown'), handleKeyDown);
        document.addEventListener(stryMutAct_9fa48("9026") ? "" : (stryCov_9fa48("9026"), 'mousedown'), handleMouseDown);
        return () => {
          if (stryMutAct_9fa48("9027")) {
            {}
          } else {
            stryCov_9fa48("9027");
            document.removeEventListener(stryMutAct_9fa48("9028") ? "" : (stryCov_9fa48("9028"), 'keydown'), handleKeyDown);
            document.removeEventListener(stryMutAct_9fa48("9029") ? "" : (stryCov_9fa48("9029"), 'mousedown'), handleMouseDown);
          }
        };
      }
    }, stryMutAct_9fa48("9030") ? [] : (stryCov_9fa48("9030"), [enableKeyboardNavigation, focusOnElement]));

    // Announce page changes for screen readers
    useEffect(() => {
      if (stryMutAct_9fa48("9031")) {
        {}
      } else {
        stryCov_9fa48("9031");
        if (stryMutAct_9fa48("9034") ? false : stryMutAct_9fa48("9033") ? true : stryMutAct_9fa48("9032") ? announcePageChanges : (stryCov_9fa48("9032", "9033", "9034"), !announcePageChanges)) return;
        const announcePageTitle = () => {
          if (stryMutAct_9fa48("9035")) {
            {}
          } else {
            stryCov_9fa48("9035");
            const title = document.title;
            if (stryMutAct_9fa48("9037") ? false : stryMutAct_9fa48("9036") ? true : (stryCov_9fa48("9036", "9037"), title)) {
              if (stryMutAct_9fa48("9038")) {
                {}
              } else {
                stryCov_9fa48("9038");
                announceToScreenReader(stryMutAct_9fa48("9039") ? `` : (stryCov_9fa48("9039"), `Page loaded: ${title}`));
              }
            }
          }
        };

        // Announce initial page load
        setTimeout(announcePageTitle, 100);

        // Listen for navigation changes (for SPA routing)
        const handlePopState = () => {
          if (stryMutAct_9fa48("9040")) {
            {}
          } else {
            stryCov_9fa48("9040");
            setTimeout(announcePageTitle, 100);
          }
        };
        window.addEventListener(stryMutAct_9fa48("9041") ? "" : (stryCov_9fa48("9041"), 'popstate'), handlePopState);
        return stryMutAct_9fa48("9042") ? () => undefined : (stryCov_9fa48("9042"), () => window.removeEventListener(stryMutAct_9fa48("9043") ? "" : (stryCov_9fa48("9043"), 'popstate'), handlePopState));
      }
    }, stryMutAct_9fa48("9044") ? [] : (stryCov_9fa48("9044"), [announcePageChanges, announceToScreenReader]));
    return stryMutAct_9fa48("9045") ? {} : (stryCov_9fa48("9045"), {
      isReducedMotion,
      announceToScreenReader,
      focusOnElement,
      trapFocus,
      getSkipLinks
    });
  }
}