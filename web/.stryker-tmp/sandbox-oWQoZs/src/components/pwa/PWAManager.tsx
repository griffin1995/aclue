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
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Monitor } from 'lucide-react';
interface PWAManagerProps {
  className?: string;
}
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}
export const PWAManager: React.FC<PWAManagerProps> = ({
  className = stryMutAct_9fa48("4894") ? "Stryker was here!" : (stryCov_9fa48("4894"), '')
}) => {
  if (stryMutAct_9fa48("4895")) {
    {}
  } else {
    stryCov_9fa48("4895");
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(stryMutAct_9fa48("4896") ? true : (stryCov_9fa48("4896"), false));
    const [isInstalled, setIsInstalled] = useState(stryMutAct_9fa48("4897") ? true : (stryCov_9fa48("4897"), false));
    const [isStandalone, setIsStandalone] = useState(stryMutAct_9fa48("4898") ? true : (stryCov_9fa48("4898"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("4899")) {
        {}
      } else {
        stryCov_9fa48("4899");
        // Check if app is already installed/standalone
        const checkStandalone = () => {
          if (stryMutAct_9fa48("4900")) {
            {}
          } else {
            stryCov_9fa48("4900");
            if (stryMutAct_9fa48("4903") ? typeof window === 'undefined' : stryMutAct_9fa48("4902") ? false : stryMutAct_9fa48("4901") ? true : (stryCov_9fa48("4901", "4902", "4903"), typeof window !== (stryMutAct_9fa48("4904") ? "" : (stryCov_9fa48("4904"), 'undefined')))) {
              if (stryMutAct_9fa48("4905")) {
                {}
              } else {
                stryCov_9fa48("4905");
                const isStandaloneMode = stryMutAct_9fa48("4908") ? (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) && document.referrer.includes('android-app://') : stryMutAct_9fa48("4907") ? false : stryMutAct_9fa48("4906") ? true : (stryCov_9fa48("4906", "4907", "4908"), (stryMutAct_9fa48("4910") ? window.matchMedia('(display-mode: standalone)').matches && (window.navigator as any).standalone : stryMutAct_9fa48("4909") ? false : (stryCov_9fa48("4909", "4910"), window.matchMedia(stryMutAct_9fa48("4911") ? "" : (stryCov_9fa48("4911"), '(display-mode: standalone)')).matches || (window.navigator as any).standalone)) || document.referrer.includes(stryMutAct_9fa48("4912") ? "" : (stryCov_9fa48("4912"), 'android-app://')));
                setIsStandalone(isStandaloneMode);
                setIsInstalled(isStandaloneMode);
              }
            }
          }
        };
        checkStandalone();

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
          if (stryMutAct_9fa48("4913")) {
            {}
          } else {
            stryCov_9fa48("4913");
            e.preventDefault();
            const promptEvent = e as BeforeInstallPromptEvent;
            setDeferredPrompt(promptEvent);

            // Show install prompt after a delay (if not already installed)
            if (stryMutAct_9fa48("4916") ? false : stryMutAct_9fa48("4915") ? true : stryMutAct_9fa48("4914") ? isInstalled : (stryCov_9fa48("4914", "4915", "4916"), !isInstalled)) {
              if (stryMutAct_9fa48("4917")) {
                {}
              } else {
                stryCov_9fa48("4917");
                setTimeout(() => {
                  if (stryMutAct_9fa48("4918")) {
                    {}
                  } else {
                    stryCov_9fa48("4918");
                    setShowInstallPrompt(stryMutAct_9fa48("4919") ? false : (stryCov_9fa48("4919"), true));
                  }
                }, 10000); // Show after 10 seconds
              }
            }
          }
        };

        // Listen for app installed event
        const handleAppInstalled = () => {
          if (stryMutAct_9fa48("4920")) {
            {}
          } else {
            stryCov_9fa48("4920");
            setIsInstalled(stryMutAct_9fa48("4921") ? false : (stryCov_9fa48("4921"), true));
            setShowInstallPrompt(stryMutAct_9fa48("4922") ? true : (stryCov_9fa48("4922"), false));
            setDeferredPrompt(null);

            // Track installation
            if (stryMutAct_9fa48("4925") ? typeof window !== 'undefined' || (window as any).gtag : stryMutAct_9fa48("4924") ? false : stryMutAct_9fa48("4923") ? true : (stryCov_9fa48("4923", "4924", "4925"), (stryMutAct_9fa48("4927") ? typeof window === 'undefined' : stryMutAct_9fa48("4926") ? true : (stryCov_9fa48("4926", "4927"), typeof window !== (stryMutAct_9fa48("4928") ? "" : (stryCov_9fa48("4928"), 'undefined')))) && (window as any).gtag)) {
              if (stryMutAct_9fa48("4929")) {
                {}
              } else {
                stryCov_9fa48("4929");
                (window as any).gtag(stryMutAct_9fa48("4930") ? "" : (stryCov_9fa48("4930"), 'event'), stryMutAct_9fa48("4931") ? "" : (stryCov_9fa48("4931"), 'pwa_install'), stryMutAct_9fa48("4932") ? {} : (stryCov_9fa48("4932"), {
                  method: stryMutAct_9fa48("4933") ? "" : (stryCov_9fa48("4933"), 'browser_prompt')
                }));
              }
            }
          }
        };

        // Listen for display mode changes
        const handleDisplayModeChange = (e: MediaQueryListEvent) => {
          if (stryMutAct_9fa48("4934")) {
            {}
          } else {
            stryCov_9fa48("4934");
            setIsStandalone(e.matches);
          }
        };
        if (stryMutAct_9fa48("4937") ? typeof window === 'undefined' : stryMutAct_9fa48("4936") ? false : stryMutAct_9fa48("4935") ? true : (stryCov_9fa48("4935", "4936", "4937"), typeof window !== (stryMutAct_9fa48("4938") ? "" : (stryCov_9fa48("4938"), 'undefined')))) {
          if (stryMutAct_9fa48("4939")) {
            {}
          } else {
            stryCov_9fa48("4939");
            window.addEventListener(stryMutAct_9fa48("4940") ? "" : (stryCov_9fa48("4940"), 'beforeinstallprompt'), handleBeforeInstallPrompt);
            window.addEventListener(stryMutAct_9fa48("4941") ? "" : (stryCov_9fa48("4941"), 'appinstalled'), handleAppInstalled);
            const mediaQuery = window.matchMedia(stryMutAct_9fa48("4942") ? "" : (stryCov_9fa48("4942"), '(display-mode: standalone)'));
            mediaQuery.addEventListener(stryMutAct_9fa48("4943") ? "" : (stryCov_9fa48("4943"), 'change'), handleDisplayModeChange);
            return () => {
              if (stryMutAct_9fa48("4944")) {
                {}
              } else {
                stryCov_9fa48("4944");
                window.removeEventListener(stryMutAct_9fa48("4945") ? "" : (stryCov_9fa48("4945"), 'beforeinstallprompt'), handleBeforeInstallPrompt);
                window.removeEventListener(stryMutAct_9fa48("4946") ? "" : (stryCov_9fa48("4946"), 'appinstalled'), handleAppInstalled);
                mediaQuery.removeEventListener(stryMutAct_9fa48("4947") ? "" : (stryCov_9fa48("4947"), 'change'), handleDisplayModeChange);
              }
            };
          }
        }
        return undefined;
      }
    }, stryMutAct_9fa48("4948") ? [] : (stryCov_9fa48("4948"), [isInstalled]));
    const handleInstallClick = async () => {
      if (stryMutAct_9fa48("4949")) {
        {}
      } else {
        stryCov_9fa48("4949");
        if (stryMutAct_9fa48("4952") ? false : stryMutAct_9fa48("4951") ? true : stryMutAct_9fa48("4950") ? deferredPrompt : (stryCov_9fa48("4950", "4951", "4952"), !deferredPrompt)) return;
        try {
          if (stryMutAct_9fa48("4953")) {
            {}
          } else {
            stryCov_9fa48("4953");
            await deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (stryMutAct_9fa48("4956") ? choiceResult.outcome !== 'accepted' : stryMutAct_9fa48("4955") ? false : stryMutAct_9fa48("4954") ? true : (stryCov_9fa48("4954", "4955", "4956"), choiceResult.outcome === (stryMutAct_9fa48("4957") ? "" : (stryCov_9fa48("4957"), 'accepted')))) {
              if (stryMutAct_9fa48("4958")) {
                {}
              } else {
                stryCov_9fa48("4958");
                console.log(stryMutAct_9fa48("4959") ? "" : (stryCov_9fa48("4959"), 'User accepted the install prompt'));
                setShowInstallPrompt(stryMutAct_9fa48("4960") ? true : (stryCov_9fa48("4960"), false));

                // Track installation attempt
                if (stryMutAct_9fa48("4963") ? typeof window !== 'undefined' || (window as any).gtag : stryMutAct_9fa48("4962") ? false : stryMutAct_9fa48("4961") ? true : (stryCov_9fa48("4961", "4962", "4963"), (stryMutAct_9fa48("4965") ? typeof window === 'undefined' : stryMutAct_9fa48("4964") ? true : (stryCov_9fa48("4964", "4965"), typeof window !== (stryMutAct_9fa48("4966") ? "" : (stryCov_9fa48("4966"), 'undefined')))) && (window as any).gtag)) {
                  if (stryMutAct_9fa48("4967")) {
                    {}
                  } else {
                    stryCov_9fa48("4967");
                    (window as any).gtag(stryMutAct_9fa48("4968") ? "" : (stryCov_9fa48("4968"), 'event'), stryMutAct_9fa48("4969") ? "" : (stryCov_9fa48("4969"), 'pwa_install_accepted'), stryMutAct_9fa48("4970") ? {} : (stryCov_9fa48("4970"), {
                      platform: choiceResult.platform
                    }));
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("4971")) {
                {}
              } else {
                stryCov_9fa48("4971");
                console.log(stryMutAct_9fa48("4972") ? "" : (stryCov_9fa48("4972"), 'User dismissed the install prompt'));

                // Track dismissal
                if (stryMutAct_9fa48("4975") ? typeof window !== 'undefined' || (window as any).gtag : stryMutAct_9fa48("4974") ? false : stryMutAct_9fa48("4973") ? true : (stryCov_9fa48("4973", "4974", "4975"), (stryMutAct_9fa48("4977") ? typeof window === 'undefined' : stryMutAct_9fa48("4976") ? true : (stryCov_9fa48("4976", "4977"), typeof window !== (stryMutAct_9fa48("4978") ? "" : (stryCov_9fa48("4978"), 'undefined')))) && (window as any).gtag)) {
                  if (stryMutAct_9fa48("4979")) {
                    {}
                  } else {
                    stryCov_9fa48("4979");
                    (window as any).gtag(stryMutAct_9fa48("4980") ? "" : (stryCov_9fa48("4980"), 'event'), stryMutAct_9fa48("4981") ? "" : (stryCov_9fa48("4981"), 'pwa_install_dismissed'), stryMutAct_9fa48("4982") ? {} : (stryCov_9fa48("4982"), {
                      platform: choiceResult.platform
                    }));
                  }
                }
              }
            }
            setDeferredPrompt(null);
          }
        } catch (error) {
          if (stryMutAct_9fa48("4983")) {
            {}
          } else {
            stryCov_9fa48("4983");
            console.error(stryMutAct_9fa48("4984") ? "" : (stryCov_9fa48("4984"), 'Error during install:'), error);
          }
        }
      }
    };
    const handleDismiss = () => {
      if (stryMutAct_9fa48("4985")) {
        {}
      } else {
        stryCov_9fa48("4985");
        setShowInstallPrompt(stryMutAct_9fa48("4986") ? true : (stryCov_9fa48("4986"), false));

        // Don't show again for this session
        if (stryMutAct_9fa48("4989") ? typeof window === 'undefined' : stryMutAct_9fa48("4988") ? false : stryMutAct_9fa48("4987") ? true : (stryCov_9fa48("4987", "4988", "4989"), typeof window !== (stryMutAct_9fa48("4990") ? "" : (stryCov_9fa48("4990"), 'undefined')))) {
          if (stryMutAct_9fa48("4991")) {
            {}
          } else {
            stryCov_9fa48("4991");
            sessionStorage.setItem(stryMutAct_9fa48("4992") ? "" : (stryCov_9fa48("4992"), 'pwa-install-dismissed'), stryMutAct_9fa48("4993") ? "" : (stryCov_9fa48("4993"), 'true'));
          }
        }

        // Track dismissal
        if (stryMutAct_9fa48("4996") ? typeof window !== 'undefined' || (window as any).gtag : stryMutAct_9fa48("4995") ? false : stryMutAct_9fa48("4994") ? true : (stryCov_9fa48("4994", "4995", "4996"), (stryMutAct_9fa48("4998") ? typeof window === 'undefined' : stryMutAct_9fa48("4997") ? true : (stryCov_9fa48("4997", "4998"), typeof window !== (stryMutAct_9fa48("4999") ? "" : (stryCov_9fa48("4999"), 'undefined')))) && (window as any).gtag)) {
          if (stryMutAct_9fa48("5000")) {
            {}
          } else {
            stryCov_9fa48("5000");
            (window as any).gtag(stryMutAct_9fa48("5001") ? "" : (stryCov_9fa48("5001"), 'event'), stryMutAct_9fa48("5002") ? "" : (stryCov_9fa48("5002"), 'pwa_install_banner_dismissed'));
          }
        }
      }
    };

    // Don't show if already dismissed this session
    useEffect(() => {
      if (stryMutAct_9fa48("5003")) {
        {}
      } else {
        stryCov_9fa48("5003");
        if (stryMutAct_9fa48("5006") ? typeof window === 'undefined' : stryMutAct_9fa48("5005") ? false : stryMutAct_9fa48("5004") ? true : (stryCov_9fa48("5004", "5005", "5006"), typeof window !== (stryMutAct_9fa48("5007") ? "" : (stryCov_9fa48("5007"), 'undefined')))) {
          if (stryMutAct_9fa48("5008")) {
            {}
          } else {
            stryCov_9fa48("5008");
            const dismissed = sessionStorage.getItem(stryMutAct_9fa48("5009") ? "" : (stryCov_9fa48("5009"), 'pwa-install-dismissed'));
            if (stryMutAct_9fa48("5011") ? false : stryMutAct_9fa48("5010") ? true : (stryCov_9fa48("5010", "5011"), dismissed)) {
              if (stryMutAct_9fa48("5012")) {
                {}
              } else {
                stryCov_9fa48("5012");
                setShowInstallPrompt(stryMutAct_9fa48("5013") ? true : (stryCov_9fa48("5013"), false));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("5014") ? ["Stryker was here"] : (stryCov_9fa48("5014"), []));

    // Don't render if standalone or no prompt available
    if (stryMutAct_9fa48("5017") ? isStandalone && !deferredPrompt : stryMutAct_9fa48("5016") ? false : stryMutAct_9fa48("5015") ? true : (stryCov_9fa48("5015", "5016", "5017"), isStandalone || (stryMutAct_9fa48("5018") ? deferredPrompt : (stryCov_9fa48("5018"), !deferredPrompt)))) {
      if (stryMutAct_9fa48("5019")) {
        {}
      } else {
        stryCov_9fa48("5019");
        return null;
      }
    }
    return <div className={className}>
      <AnimatePresence>
        {stryMutAct_9fa48("5022") ? showInstallPrompt || <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: 50
        }} className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Install aclue
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Add to your home screen for quick access and offline browsing
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={handleInstallClick} className="flex-1 bg-primary-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1">
                      <Download className="w-3 h-3" />
                      Install
                    </button>
                    <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 transition-colors p-1" title="Dismiss">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div> : stryMutAct_9fa48("5021") ? false : stryMutAct_9fa48("5020") ? true : (stryCov_9fa48("5020", "5021", "5022"), showInstallPrompt && <motion.div initial={stryMutAct_9fa48("5023") ? {} : (stryCov_9fa48("5023"), {
          opacity: 0,
          y: 50
        })} animate={stryMutAct_9fa48("5024") ? {} : (stryCov_9fa48("5024"), {
          opacity: 1,
          y: 0
        })} exit={stryMutAct_9fa48("5025") ? {} : (stryCov_9fa48("5025"), {
          opacity: 0,
          y: 50
        })} className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Install aclue
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Add to your home screen for quick access and offline browsing
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={handleInstallClick} className="flex-1 bg-primary-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1">
                      <Download className="w-3 h-3" />
                      Install
                    </button>
                    <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 transition-colors p-1" title="Dismiss">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>)}
      </AnimatePresence>

      {/* iOS Safari specific install instructions */}
      <AnimatePresence>
        {stryMutAct_9fa48("5028") ? showInstallPrompt && typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) || <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: 50
        }} className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Install aclue
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Tap the share button <span className="inline-block">📤</span> and select "Add to Home Screen"
                  </p>
                  
                  <button onClick={handleDismiss} className="w-full bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Got it
                  </button>
                </div>
                
                <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 transition-colors p-1" title="Dismiss">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div> : stryMutAct_9fa48("5027") ? false : stryMutAct_9fa48("5026") ? true : (stryCov_9fa48("5026", "5027", "5028"), (stryMutAct_9fa48("5030") ? showInstallPrompt && typeof window !== 'undefined' || /iPad|iPhone|iPod/.test(navigator.userAgent) : stryMutAct_9fa48("5029") ? true : (stryCov_9fa48("5029", "5030"), (stryMutAct_9fa48("5032") ? showInstallPrompt || typeof window !== 'undefined' : stryMutAct_9fa48("5031") ? true : (stryCov_9fa48("5031", "5032"), showInstallPrompt && (stryMutAct_9fa48("5034") ? typeof window === 'undefined' : stryMutAct_9fa48("5033") ? true : (stryCov_9fa48("5033", "5034"), typeof window !== (stryMutAct_9fa48("5035") ? "" : (stryCov_9fa48("5035"), 'undefined')))))) && /iPad|iPhone|iPod/.test(navigator.userAgent))) && <motion.div initial={stryMutAct_9fa48("5036") ? {} : (stryCov_9fa48("5036"), {
          opacity: 0,
          y: 50
        })} animate={stryMutAct_9fa48("5037") ? {} : (stryCov_9fa48("5037"), {
          opacity: 1,
          y: 0
        })} exit={stryMutAct_9fa48("5038") ? {} : (stryCov_9fa48("5038"), {
          opacity: 0,
          y: 50
        })} className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Install aclue
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Tap the share button <span className="inline-block">📤</span> and select "Add to Home Screen"
                  </p>
                  
                  <button onClick={handleDismiss} className="w-full bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Got it
                  </button>
                </div>
                
                <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 transition-colors p-1" title="Dismiss">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>)}
      </AnimatePresence>
    </div>;
  }
};
export default PWAManager;