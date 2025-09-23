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
import { useEffect, useState } from 'react';
interface MobileOptimizations {
  isMobile: boolean;
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
  viewportHeight: number;
  isStandalone: boolean;
  hasNotch: boolean;
  devicePixelRatio: number;
}
export const useMobileOptimizations = (): MobileOptimizations => {
  if (stryMutAct_9fa48("9260")) {
    {}
  } else {
    stryCov_9fa48("9260");
    const [optimizations, setOptimizations] = useState<MobileOptimizations>(stryMutAct_9fa48("9261") ? {} : (stryCov_9fa48("9261"), {
      isMobile: stryMutAct_9fa48("9262") ? true : (stryCov_9fa48("9262"), false),
      isTouch: stryMutAct_9fa48("9263") ? true : (stryCov_9fa48("9263"), false),
      orientation: stryMutAct_9fa48("9264") ? "" : (stryCov_9fa48("9264"), 'portrait'),
      viewportHeight: 0,
      isStandalone: stryMutAct_9fa48("9265") ? true : (stryCov_9fa48("9265"), false),
      hasNotch: stryMutAct_9fa48("9266") ? true : (stryCov_9fa48("9266"), false),
      devicePixelRatio: 1
    }));
    useEffect(() => {
      if (stryMutAct_9fa48("9267")) {
        {}
      } else {
        stryCov_9fa48("9267");
        if (stryMutAct_9fa48("9270") ? typeof window !== 'undefined' : stryMutAct_9fa48("9269") ? false : stryMutAct_9fa48("9268") ? true : (stryCov_9fa48("9268", "9269", "9270"), typeof window === (stryMutAct_9fa48("9271") ? "" : (stryCov_9fa48("9271"), 'undefined')))) return;
        const updateOptimizations = () => {
          if (stryMutAct_9fa48("9272")) {
            {}
          } else {
            stryCov_9fa48("9272");
            // Detect mobile device
            const isMobile = stryMutAct_9fa48("9275") ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth <= 768 : stryMutAct_9fa48("9274") ? false : stryMutAct_9fa48("9273") ? true : (stryCov_9fa48("9273", "9274", "9275"), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (stryMutAct_9fa48("9278") ? window.innerWidth > 768 : stryMutAct_9fa48("9277") ? window.innerWidth < 768 : stryMutAct_9fa48("9276") ? false : (stryCov_9fa48("9276", "9277", "9278"), window.innerWidth <= 768)));

            // Detect touch capability
            const isTouch = stryMutAct_9fa48("9281") ? 'ontouchstart' in window && navigator.maxTouchPoints > 0 : stryMutAct_9fa48("9280") ? false : stryMutAct_9fa48("9279") ? true : (stryCov_9fa48("9279", "9280", "9281"), (stryMutAct_9fa48("9282") ? "" : (stryCov_9fa48("9282"), 'ontouchstart')) in window || (stryMutAct_9fa48("9285") ? navigator.maxTouchPoints <= 0 : stryMutAct_9fa48("9284") ? navigator.maxTouchPoints >= 0 : stryMutAct_9fa48("9283") ? false : (stryCov_9fa48("9283", "9284", "9285"), navigator.maxTouchPoints > 0)));

            // Detect orientation
            const orientation = (stryMutAct_9fa48("9289") ? window.innerHeight <= window.innerWidth : stryMutAct_9fa48("9288") ? window.innerHeight >= window.innerWidth : stryMutAct_9fa48("9287") ? false : stryMutAct_9fa48("9286") ? true : (stryCov_9fa48("9286", "9287", "9288", "9289"), window.innerHeight > window.innerWidth)) ? stryMutAct_9fa48("9290") ? "" : (stryCov_9fa48("9290"), 'portrait') : stryMutAct_9fa48("9291") ? "" : (stryCov_9fa48("9291"), 'landscape');

            // Get viewport height (accounting for mobile browser UI)
            const viewportHeight = stryMutAct_9fa48("9294") ? window.visualViewport?.height && window.innerHeight : stryMutAct_9fa48("9293") ? false : stryMutAct_9fa48("9292") ? true : (stryCov_9fa48("9292", "9293", "9294"), (stryMutAct_9fa48("9295") ? window.visualViewport.height : (stryCov_9fa48("9295"), window.visualViewport?.height)) || window.innerHeight);

            // Detect standalone PWA mode
            const isStandalone = stryMutAct_9fa48("9298") ? (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) && document.referrer.includes('android-app://') : stryMutAct_9fa48("9297") ? false : stryMutAct_9fa48("9296") ? true : (stryCov_9fa48("9296", "9297", "9298"), (stryMutAct_9fa48("9300") ? window.matchMedia('(display-mode: standalone)').matches && (navigator as any).standalone : stryMutAct_9fa48("9299") ? false : (stryCov_9fa48("9299", "9300"), window.matchMedia(stryMutAct_9fa48("9301") ? "" : (stryCov_9fa48("9301"), '(display-mode: standalone)')).matches || (navigator as any).standalone)) || document.referrer.includes(stryMutAct_9fa48("9302") ? "" : (stryCov_9fa48("9302"), 'android-app://')));

            // Detect iPhone X+ notch
            const hasNotch = stryMutAct_9fa48("9305") ? CSS.supports('padding-top: env(safe-area-inset-top)') || /iPhone/.test(navigator.userAgent) : stryMutAct_9fa48("9304") ? false : stryMutAct_9fa48("9303") ? true : (stryCov_9fa48("9303", "9304", "9305"), CSS.supports(stryMutAct_9fa48("9306") ? "" : (stryCov_9fa48("9306"), 'padding-top: env(safe-area-inset-top)')) && /iPhone/.test(navigator.userAgent));

            // Get device pixel ratio
            const devicePixelRatio = stryMutAct_9fa48("9309") ? window.devicePixelRatio && 1 : stryMutAct_9fa48("9308") ? false : stryMutAct_9fa48("9307") ? true : (stryCov_9fa48("9307", "9308", "9309"), window.devicePixelRatio || 1);
            setOptimizations(stryMutAct_9fa48("9310") ? {} : (stryCov_9fa48("9310"), {
              isMobile,
              isTouch,
              orientation,
              viewportHeight,
              isStandalone,
              hasNotch,
              devicePixelRatio
            }));
          }
        };

        // Initial setup
        updateOptimizations();

        // Listen for changes
        const handleResize = stryMutAct_9fa48("9311") ? () => undefined : (stryCov_9fa48("9311"), (() => {
          const handleResize = () => updateOptimizations();
          return handleResize;
        })());
        const handleOrientationChange = () => {
          if (stryMutAct_9fa48("9312")) {
            {}
          } else {
            stryCov_9fa48("9312");
            setTimeout(updateOptimizations, 100); // Delay to account for orientation change
          }
        };
        window.addEventListener(stryMutAct_9fa48("9313") ? "" : (stryCov_9fa48("9313"), 'resize'), handleResize);
        window.addEventListener(stryMutAct_9fa48("9314") ? "" : (stryCov_9fa48("9314"), 'orientationchange'), handleOrientationChange);

        // Listen for visual viewport changes (mobile keyboard, etc.)
        if (stryMutAct_9fa48("9316") ? false : stryMutAct_9fa48("9315") ? true : (stryCov_9fa48("9315", "9316"), window.visualViewport)) {
          if (stryMutAct_9fa48("9317")) {
            {}
          } else {
            stryCov_9fa48("9317");
            window.visualViewport.addEventListener(stryMutAct_9fa48("9318") ? "" : (stryCov_9fa48("9318"), 'resize'), updateOptimizations);
          }
        }
        return () => {
          if (stryMutAct_9fa48("9319")) {
            {}
          } else {
            stryCov_9fa48("9319");
            window.removeEventListener(stryMutAct_9fa48("9320") ? "" : (stryCov_9fa48("9320"), 'resize'), handleResize);
            window.removeEventListener(stryMutAct_9fa48("9321") ? "" : (stryCov_9fa48("9321"), 'orientationchange'), handleOrientationChange);
            if (stryMutAct_9fa48("9323") ? false : stryMutAct_9fa48("9322") ? true : (stryCov_9fa48("9322", "9323"), window.visualViewport)) {
              if (stryMutAct_9fa48("9324")) {
                {}
              } else {
                stryCov_9fa48("9324");
                window.visualViewport.removeEventListener(stryMutAct_9fa48("9325") ? "" : (stryCov_9fa48("9325"), 'resize'), updateOptimizations);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("9326") ? ["Stryker was here"] : (stryCov_9fa48("9326"), []));

    // Apply mobile-specific optimizations
    useEffect(() => {
      if (stryMutAct_9fa48("9327")) {
        {}
      } else {
        stryCov_9fa48("9327");
        if (stryMutAct_9fa48("9330") ? typeof window !== 'undefined' : stryMutAct_9fa48("9329") ? false : stryMutAct_9fa48("9328") ? true : (stryCov_9fa48("9328", "9329", "9330"), typeof window === (stryMutAct_9fa48("9331") ? "" : (stryCov_9fa48("9331"), 'undefined')))) return;

        // Disable zoom on iOS
        if (stryMutAct_9fa48("9333") ? false : stryMutAct_9fa48("9332") ? true : (stryCov_9fa48("9332", "9333"), optimizations.isMobile)) {
          if (stryMutAct_9fa48("9334")) {
            {}
          } else {
            stryCov_9fa48("9334");
            const viewport = document.querySelector(stryMutAct_9fa48("9335") ? "" : (stryCov_9fa48("9335"), 'meta[name="viewport"]'));
            if (stryMutAct_9fa48("9337") ? false : stryMutAct_9fa48("9336") ? true : (stryCov_9fa48("9336", "9337"), viewport)) {
              if (stryMutAct_9fa48("9338")) {
                {}
              } else {
                stryCov_9fa48("9338");
                viewport.setAttribute(stryMutAct_9fa48("9339") ? "" : (stryCov_9fa48("9339"), 'content'), stryMutAct_9fa48("9340") ? "" : (stryCov_9fa48("9340"), 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'));
              }
            }
          }
        }

        // Prevent overscroll/bounce on iOS
        if (stryMutAct_9fa48("9342") ? false : stryMutAct_9fa48("9341") ? true : (stryCov_9fa48("9341", "9342"), /iPad|iPhone|iPod/.test(navigator.userAgent))) {
          if (stryMutAct_9fa48("9343")) {
            {}
          } else {
            stryCov_9fa48("9343");
            document.body.style.overscrollBehavior = stryMutAct_9fa48("9344") ? "" : (stryCov_9fa48("9344"), 'none');
            document.documentElement.style.overscrollBehavior = stryMutAct_9fa48("9345") ? "" : (stryCov_9fa48("9345"), 'none');
          }
        }

        // Add mobile-specific CSS classes
        document.body.classList.toggle(stryMutAct_9fa48("9346") ? "" : (stryCov_9fa48("9346"), 'mobile'), optimizations.isMobile);
        document.body.classList.toggle(stryMutAct_9fa48("9347") ? "" : (stryCov_9fa48("9347"), 'touch'), optimizations.isTouch);
        document.body.classList.toggle(stryMutAct_9fa48("9348") ? "" : (stryCov_9fa48("9348"), 'standalone'), optimizations.isStandalone);
        document.body.classList.toggle(stryMutAct_9fa48("9349") ? "" : (stryCov_9fa48("9349"), 'has-notch'), optimizations.hasNotch);
        document.body.classList.toggle(stryMutAct_9fa48("9350") ? "" : (stryCov_9fa48("9350"), 'landscape'), stryMutAct_9fa48("9353") ? optimizations.orientation !== 'landscape' : stryMutAct_9fa48("9352") ? false : stryMutAct_9fa48("9351") ? true : (stryCov_9fa48("9351", "9352", "9353"), optimizations.orientation === (stryMutAct_9fa48("9354") ? "" : (stryCov_9fa48("9354"), 'landscape'))));
        document.body.classList.toggle(stryMutAct_9fa48("9355") ? "" : (stryCov_9fa48("9355"), 'portrait'), stryMutAct_9fa48("9358") ? optimizations.orientation !== 'portrait' : stryMutAct_9fa48("9357") ? false : stryMutAct_9fa48("9356") ? true : (stryCov_9fa48("9356", "9357", "9358"), optimizations.orientation === (stryMutAct_9fa48("9359") ? "" : (stryCov_9fa48("9359"), 'portrait'))));
        return () => {
          if (stryMutAct_9fa48("9360")) {
            {}
          } else {
            stryCov_9fa48("9360");
            document.body.classList.remove(stryMutAct_9fa48("9361") ? "" : (stryCov_9fa48("9361"), 'mobile'), stryMutAct_9fa48("9362") ? "" : (stryCov_9fa48("9362"), 'touch'), stryMutAct_9fa48("9363") ? "" : (stryCov_9fa48("9363"), 'standalone'), stryMutAct_9fa48("9364") ? "" : (stryCov_9fa48("9364"), 'has-notch'), stryMutAct_9fa48("9365") ? "" : (stryCov_9fa48("9365"), 'landscape'), stryMutAct_9fa48("9366") ? "" : (stryCov_9fa48("9366"), 'portrait'));
          }
        };
      }
    }, stryMutAct_9fa48("9367") ? [] : (stryCov_9fa48("9367"), [optimizations]));
    return optimizations;
  }
};

// Hook for haptic feedback
export const useHapticFeedback = () => {
  if (stryMutAct_9fa48("9368")) {
    {}
  } else {
    stryCov_9fa48("9368");
    const vibrate = (pattern: number | number[]) => {
      if (stryMutAct_9fa48("9369")) {
        {}
      } else {
        stryCov_9fa48("9369");
        if (stryMutAct_9fa48("9372") ? typeof window !== 'undefined' || 'vibrate' in navigator : stryMutAct_9fa48("9371") ? false : stryMutAct_9fa48("9370") ? true : (stryCov_9fa48("9370", "9371", "9372"), (stryMutAct_9fa48("9374") ? typeof window === 'undefined' : stryMutAct_9fa48("9373") ? true : (stryCov_9fa48("9373", "9374"), typeof window !== (stryMutAct_9fa48("9375") ? "" : (stryCov_9fa48("9375"), 'undefined')))) && (stryMutAct_9fa48("9376") ? "" : (stryCov_9fa48("9376"), 'vibrate')) in navigator)) {
          if (stryMutAct_9fa48("9377")) {
            {}
          } else {
            stryCov_9fa48("9377");
            navigator.vibrate(pattern);
          }
        }
      }
    };
    const lightTap = stryMutAct_9fa48("9378") ? () => undefined : (stryCov_9fa48("9378"), (() => {
      const lightTap = () => vibrate(10);
      return lightTap;
    })());
    const mediumTap = stryMutAct_9fa48("9379") ? () => undefined : (stryCov_9fa48("9379"), (() => {
      const mediumTap = () => vibrate(50);
      return mediumTap;
    })());
    const heavyTap = stryMutAct_9fa48("9380") ? () => undefined : (stryCov_9fa48("9380"), (() => {
      const heavyTap = () => vibrate(100);
      return heavyTap;
    })());
    const doubleTap = stryMutAct_9fa48("9381") ? () => undefined : (stryCov_9fa48("9381"), (() => {
      const doubleTap = () => vibrate(stryMutAct_9fa48("9382") ? [] : (stryCov_9fa48("9382"), [30, 20, 30]));
      return doubleTap;
    })());
    const success = stryMutAct_9fa48("9383") ? () => undefined : (stryCov_9fa48("9383"), (() => {
      const success = () => vibrate(stryMutAct_9fa48("9384") ? [] : (stryCov_9fa48("9384"), [50, 50, 50]));
      return success;
    })());
    const error = stryMutAct_9fa48("9385") ? () => undefined : (stryCov_9fa48("9385"), (() => {
      const error = () => vibrate(stryMutAct_9fa48("9386") ? [] : (stryCov_9fa48("9386"), [100, 50, 100]));
      return error;
    })());
    return stryMutAct_9fa48("9387") ? {} : (stryCov_9fa48("9387"), {
      vibrate,
      lightTap,
      mediumTap,
      heavyTap,
      doubleTap,
      success,
      error
    });
  }
};

// Hook for detecting network status
export const useNetworkStatus = () => {
  if (stryMutAct_9fa48("9388")) {
    {}
  } else {
    stryCov_9fa48("9388");
    const [isOnline, setIsOnline] = useState(stryMutAct_9fa48("9389") ? false : (stryCov_9fa48("9389"), true));
    const [connectionType, setConnectionType] = useState<string>(stryMutAct_9fa48("9390") ? "" : (stryCov_9fa48("9390"), 'unknown'));
    useEffect(() => {
      if (stryMutAct_9fa48("9391")) {
        {}
      } else {
        stryCov_9fa48("9391");
        if (stryMutAct_9fa48("9394") ? typeof window !== 'undefined' : stryMutAct_9fa48("9393") ? false : stryMutAct_9fa48("9392") ? true : (stryCov_9fa48("9392", "9393", "9394"), typeof window === (stryMutAct_9fa48("9395") ? "" : (stryCov_9fa48("9395"), 'undefined')))) return;
        const updateNetworkStatus = () => {
          if (stryMutAct_9fa48("9396")) {
            {}
          } else {
            stryCov_9fa48("9396");
            setIsOnline(navigator.onLine);

            // Get connection type if available
            const connection = stryMutAct_9fa48("9399") ? ((navigator as any).connection || (navigator as any).mozConnection) && (navigator as any).webkitConnection : stryMutAct_9fa48("9398") ? false : stryMutAct_9fa48("9397") ? true : (stryCov_9fa48("9397", "9398", "9399"), (stryMutAct_9fa48("9401") ? (navigator as any).connection && (navigator as any).mozConnection : stryMutAct_9fa48("9400") ? false : (stryCov_9fa48("9400", "9401"), (navigator as any).connection || (navigator as any).mozConnection)) || (navigator as any).webkitConnection);
            if (stryMutAct_9fa48("9403") ? false : stryMutAct_9fa48("9402") ? true : (stryCov_9fa48("9402", "9403"), connection)) {
              if (stryMutAct_9fa48("9404")) {
                {}
              } else {
                stryCov_9fa48("9404");
                setConnectionType(stryMutAct_9fa48("9407") ? (connection.effectiveType || connection.type) && 'unknown' : stryMutAct_9fa48("9406") ? false : stryMutAct_9fa48("9405") ? true : (stryCov_9fa48("9405", "9406", "9407"), (stryMutAct_9fa48("9409") ? connection.effectiveType && connection.type : stryMutAct_9fa48("9408") ? false : (stryCov_9fa48("9408", "9409"), connection.effectiveType || connection.type)) || (stryMutAct_9fa48("9410") ? "" : (stryCov_9fa48("9410"), 'unknown'))));
              }
            }
          }
        };
        updateNetworkStatus();
        window.addEventListener(stryMutAct_9fa48("9411") ? "" : (stryCov_9fa48("9411"), 'online'), updateNetworkStatus);
        window.addEventListener(stryMutAct_9fa48("9412") ? "" : (stryCov_9fa48("9412"), 'offline'), updateNetworkStatus);
        return () => {
          if (stryMutAct_9fa48("9413")) {
            {}
          } else {
            stryCov_9fa48("9413");
            window.removeEventListener(stryMutAct_9fa48("9414") ? "" : (stryCov_9fa48("9414"), 'online'), updateNetworkStatus);
            window.removeEventListener(stryMutAct_9fa48("9415") ? "" : (stryCov_9fa48("9415"), 'offline'), updateNetworkStatus);
          }
        };
      }
    }, stryMutAct_9fa48("9416") ? ["Stryker was here"] : (stryCov_9fa48("9416"), []));
    return stryMutAct_9fa48("9417") ? {} : (stryCov_9fa48("9417"), {
      isOnline,
      connectionType
    });
  }
};
export default useMobileOptimizations;