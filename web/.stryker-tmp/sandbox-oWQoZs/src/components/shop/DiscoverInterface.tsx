/**
 * Discover Interface - Client Component
 *
 * Interactive product discovery interface using the swipe paradigm.
 * This client component handles all user interactions and state management
 * while receiving initial data from the server component.
 *
 * Features:
 * - Tinder-style swipe interface
 * - Keyboard navigation
 * - Mobile touch gestures
 * - Progress tracking
 * - Session completion handling
 * - Preference recording via server actions
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
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, X, ArrowUp, RotateCcw, Info } from 'lucide-react';
import { recordSwipe } from '@/app/actions/products';
import { WelcomeOverlay } from './WelcomeOverlay';
import { ProductCard } from './ProductCard';
import { useMobileOptimizations, useHapticFeedback } from '@/hooks/useMobileOptimizations';
import toast from 'react-hot-toast';

// ==============================================================================
// TYPES
// ==============================================================================

interface Product {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  currency?: string;
  image_url: string;
  brand?: string;
  category?: {
    name: string;
  };
  rating?: number;
  affiliate_url?: string;
  url?: string;
}
interface DiscoverInterfaceProps {
  initialProducts: Product[];
  isAuthenticated: boolean;
  sessionType?: string;
}
type SwipeDirection = 'left' | 'right' | 'up';

// ==============================================================================
// MAIN COMPONENT
// ==============================================================================

export function DiscoverInterface({
  initialProducts,
  isAuthenticated,
  sessionType = stryMutAct_9fa48("5670") ? "" : (stryCov_9fa48("5670"), 'discovery')
}: DiscoverInterfaceProps) {
  if (stryMutAct_9fa48("5671")) {
    {}
  } else {
    stryCov_9fa48("5671");
    const router = useRouter();
    const [products] = useState<Product[]>(initialProducts);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("5672") ? true : (stryCov_9fa48("5672"), false));
    const [showWelcome, setShowWelcome] = useState(stryMutAct_9fa48("5673") ? false : (stryCov_9fa48("5673"), true));
    const [swipeCount, setSwipeCount] = useState(0);

    // Mobile optimisations
    const mobileOptimizations = useMobileOptimizations();
    const haptics = useHapticFeedback();

    // Current product
    const currentProduct = products[currentIndex];
    const isSessionComplete = stryMutAct_9fa48("5677") ? currentIndex < products.length : stryMutAct_9fa48("5676") ? currentIndex > products.length : stryMutAct_9fa48("5675") ? false : stryMutAct_9fa48("5674") ? true : (stryCov_9fa48("5674", "5675", "5676", "5677"), currentIndex >= products.length);

    // ==============================================================================
    // EFFECTS
    // ==============================================================================

    // Auto-hide welcome overlay
    useEffect(() => {
      if (stryMutAct_9fa48("5678")) {
        {}
      } else {
        stryCov_9fa48("5678");
        const timer = setTimeout(() => {
          if (stryMutAct_9fa48("5679")) {
            {}
          } else {
            stryCov_9fa48("5679");
            setShowWelcome(stryMutAct_9fa48("5680") ? true : (stryCov_9fa48("5680"), false));
          }
        }, 3000);
        return stryMutAct_9fa48("5681") ? () => undefined : (stryCov_9fa48("5681"), () => clearTimeout(timer));
      }
    }, stryMutAct_9fa48("5682") ? ["Stryker was here"] : (stryCov_9fa48("5682"), []));

    // Keyboard navigation
    useEffect(() => {
      if (stryMutAct_9fa48("5683")) {
        {}
      } else {
        stryCov_9fa48("5683");
        const handleKeyPress = (event: KeyboardEvent) => {
          if (stryMutAct_9fa48("5684")) {
            {}
          } else {
            stryCov_9fa48("5684");
            if (stryMutAct_9fa48("5687") ? showWelcome && isSessionComplete : stryMutAct_9fa48("5686") ? false : stryMutAct_9fa48("5685") ? true : (stryCov_9fa48("5685", "5686", "5687"), showWelcome || isSessionComplete)) return;
            switch (event.key) {
              case stryMutAct_9fa48("5689") ? "" : (stryCov_9fa48("5689"), 'ArrowLeft'):
                if (stryMutAct_9fa48("5688")) {} else {
                  stryCov_9fa48("5688");
                  event.preventDefault();
                  handleSwipe(stryMutAct_9fa48("5690") ? "" : (stryCov_9fa48("5690"), 'left'));
                  break;
                }
              case stryMutAct_9fa48("5691") ? "" : (stryCov_9fa48("5691"), 'ArrowRight'):
              case stryMutAct_9fa48("5693") ? "" : (stryCov_9fa48("5693"), ' '):
                if (stryMutAct_9fa48("5692")) {} else {
                  stryCov_9fa48("5692");
                  event.preventDefault();
                  handleSwipe(stryMutAct_9fa48("5694") ? "" : (stryCov_9fa48("5694"), 'right'));
                  break;
                }
              case stryMutAct_9fa48("5696") ? "" : (stryCov_9fa48("5696"), 'ArrowUp'):
                if (stryMutAct_9fa48("5695")) {} else {
                  stryCov_9fa48("5695");
                  event.preventDefault();
                  handleSwipe(stryMutAct_9fa48("5697") ? "" : (stryCov_9fa48("5697"), 'up'));
                  break;
                }
              case stryMutAct_9fa48("5698") ? "" : (stryCov_9fa48("5698"), 'r'):
              case stryMutAct_9fa48("5700") ? "" : (stryCov_9fa48("5700"), 'R'):
                if (stryMutAct_9fa48("5699")) {} else {
                  stryCov_9fa48("5699");
                  if (stryMutAct_9fa48("5703") ? event.ctrlKey && event.metaKey : stryMutAct_9fa48("5702") ? false : stryMutAct_9fa48("5701") ? true : (stryCov_9fa48("5701", "5702", "5703"), event.ctrlKey || event.metaKey)) {
                    if (stryMutAct_9fa48("5704")) {
                      {}
                    } else {
                      stryCov_9fa48("5704");
                      event.preventDefault();
                      handleResetSession();
                    }
                  }
                  break;
                }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("5705") ? "" : (stryCov_9fa48("5705"), 'keydown'), handleKeyPress);
        return stryMutAct_9fa48("5706") ? () => undefined : (stryCov_9fa48("5706"), () => window.removeEventListener(stryMutAct_9fa48("5707") ? "" : (stryCov_9fa48("5707"), 'keydown'), handleKeyPress));
      }
    }, stryMutAct_9fa48("5708") ? [] : (stryCov_9fa48("5708"), [showWelcome, isSessionComplete, currentIndex]));

    // ==============================================================================
    // SWIPE HANDLERS
    // ==============================================================================

    const handleSwipe = useCallback(async (direction: SwipeDirection) => {
      if (stryMutAct_9fa48("5709")) {
        {}
      } else {
        stryCov_9fa48("5709");
        if (stryMutAct_9fa48("5712") ? !currentProduct && isLoading : stryMutAct_9fa48("5711") ? false : stryMutAct_9fa48("5710") ? true : (stryCov_9fa48("5710", "5711", "5712"), (stryMutAct_9fa48("5713") ? currentProduct : (stryCov_9fa48("5713"), !currentProduct)) || isLoading)) return;
        setIsLoading(stryMutAct_9fa48("5714") ? false : (stryCov_9fa48("5714"), true));
        try {
          if (stryMutAct_9fa48("5715")) {
            {}
          } else {
            stryCov_9fa48("5715");
            // Provide haptic feedback for mobile users
            if (stryMutAct_9fa48("5717") ? false : stryMutAct_9fa48("5716") ? true : (stryCov_9fa48("5716", "5717"), mobileOptimizations.isMobile)) {
              if (stryMutAct_9fa48("5718")) {
                {}
              } else {
                stryCov_9fa48("5718");
                if (stryMutAct_9fa48("5721") ? direction !== 'right' : stryMutAct_9fa48("5720") ? false : stryMutAct_9fa48("5719") ? true : (stryCov_9fa48("5719", "5720", "5721"), direction === (stryMutAct_9fa48("5722") ? "" : (stryCov_9fa48("5722"), 'right')))) {
                  if (stryMutAct_9fa48("5723")) {
                    {}
                  } else {
                    stryCov_9fa48("5723");
                    haptics.mediumTap();
                  }
                } else if (stryMutAct_9fa48("5726") ? direction !== 'up' : stryMutAct_9fa48("5725") ? false : stryMutAct_9fa48("5724") ? true : (stryCov_9fa48("5724", "5725", "5726"), direction === (stryMutAct_9fa48("5727") ? "" : (stryCov_9fa48("5727"), 'up')))) {
                  if (stryMutAct_9fa48("5728")) {
                    {}
                  } else {
                    stryCov_9fa48("5728");
                    haptics.doubleTap();
                  }
                } else {
                  if (stryMutAct_9fa48("5729")) {
                    {}
                  } else {
                    stryCov_9fa48("5729");
                    haptics.lightTap();
                  }
                }
              }
            }

            // Record swipe preference if authenticated
            if (stryMutAct_9fa48("5731") ? false : stryMutAct_9fa48("5730") ? true : (stryCov_9fa48("5730", "5731"), isAuthenticated)) {
              if (stryMutAct_9fa48("5732")) {
                {}
              } else {
                stryCov_9fa48("5732");
                const swipeDirection = (stryMutAct_9fa48("5735") ? direction !== 'left' : stryMutAct_9fa48("5734") ? false : stryMutAct_9fa48("5733") ? true : (stryCov_9fa48("5733", "5734", "5735"), direction === (stryMutAct_9fa48("5736") ? "" : (stryCov_9fa48("5736"), 'left')))) ? stryMutAct_9fa48("5737") ? "" : (stryCov_9fa48("5737"), 'dislike') : (stryMutAct_9fa48("5740") ? direction !== 'up' : stryMutAct_9fa48("5739") ? false : stryMutAct_9fa48("5738") ? true : (stryCov_9fa48("5738", "5739", "5740"), direction === (stryMutAct_9fa48("5741") ? "" : (stryCov_9fa48("5741"), 'up')))) ? stryMutAct_9fa48("5742") ? "" : (stryCov_9fa48("5742"), 'super_like') : stryMutAct_9fa48("5743") ? "" : (stryCov_9fa48("5743"), 'like');
                const result = await recordSwipe(stryMutAct_9fa48("5744") ? {} : (stryCov_9fa48("5744"), {
                  productId: currentProduct.id,
                  direction: swipeDirection,
                  sessionType,
                  timestamp: new Date()
                }));
                if (stryMutAct_9fa48("5747") ? false : stryMutAct_9fa48("5746") ? true : stryMutAct_9fa48("5745") ? result.success : (stryCov_9fa48("5745", "5746", "5747"), !result.success)) {
                  if (stryMutAct_9fa48("5748")) {
                    {}
                  } else {
                    stryCov_9fa48("5748");
                    console.warn(stryMutAct_9fa48("5749") ? "" : (stryCov_9fa48("5749"), 'Failed to record swipe:'), result.error);
                  }
                }
              }
            }

            // Show feedback toast
            const productName = stryMutAct_9fa48("5752") ? (currentProduct.title || currentProduct.name) && 'this product' : stryMutAct_9fa48("5751") ? false : stryMutAct_9fa48("5750") ? true : (stryCov_9fa48("5750", "5751", "5752"), (stryMutAct_9fa48("5754") ? currentProduct.title && currentProduct.name : stryMutAct_9fa48("5753") ? false : (stryCov_9fa48("5753", "5754"), currentProduct.title || currentProduct.name)) || (stryMutAct_9fa48("5755") ? "" : (stryCov_9fa48("5755"), 'this product')));
            if (stryMutAct_9fa48("5758") ? direction !== 'right' : stryMutAct_9fa48("5757") ? false : stryMutAct_9fa48("5756") ? true : (stryCov_9fa48("5756", "5757", "5758"), direction === (stryMutAct_9fa48("5759") ? "" : (stryCov_9fa48("5759"), 'right')))) {
              if (stryMutAct_9fa48("5760")) {
                {}
              } else {
                stryCov_9fa48("5760");
                toast.success(stryMutAct_9fa48("5761") ? `` : (stryCov_9fa48("5761"), `❤️ Added ${productName} to your likes!`));
              }
            } else if (stryMutAct_9fa48("5764") ? direction !== 'up' : stryMutAct_9fa48("5763") ? false : stryMutAct_9fa48("5762") ? true : (stryCov_9fa48("5762", "5763", "5764"), direction === (stryMutAct_9fa48("5765") ? "" : (stryCov_9fa48("5765"), 'up')))) {
              if (stryMutAct_9fa48("5766")) {
                {}
              } else {
                stryCov_9fa48("5766");
                toast.success(stryMutAct_9fa48("5767") ? `` : (stryCov_9fa48("5767"), `⚡ Super liked ${productName}!`));
              }
            } else {
              if (stryMutAct_9fa48("5768")) {
                {}
              } else {
                stryCov_9fa48("5768");
                toast(stryMutAct_9fa48("5769") ? `` : (stryCov_9fa48("5769"), `👍 Thanks for the feedback!`));
              }
            }
            setSwipeCount(stryMutAct_9fa48("5770") ? () => undefined : (stryCov_9fa48("5770"), prev => stryMutAct_9fa48("5771") ? prev - 1 : (stryCov_9fa48("5771"), prev + 1)));

            // Move to next product with delay for animation
            setTimeout(() => {
              if (stryMutAct_9fa48("5772")) {
                {}
              } else {
                stryCov_9fa48("5772");
                if (stryMutAct_9fa48("5776") ? currentIndex >= products.length - 1 : stryMutAct_9fa48("5775") ? currentIndex <= products.length - 1 : stryMutAct_9fa48("5774") ? false : stryMutAct_9fa48("5773") ? true : (stryCov_9fa48("5773", "5774", "5775", "5776"), currentIndex < (stryMutAct_9fa48("5777") ? products.length + 1 : (stryCov_9fa48("5777"), products.length - 1)))) {
                  if (stryMutAct_9fa48("5778")) {
                    {}
                  } else {
                    stryCov_9fa48("5778");
                    setCurrentIndex(stryMutAct_9fa48("5779") ? () => undefined : (stryCov_9fa48("5779"), prev => stryMutAct_9fa48("5780") ? prev - 1 : (stryCov_9fa48("5780"), prev + 1)));
                  }
                } else {
                  if (stryMutAct_9fa48("5781")) {
                    {}
                  } else {
                    stryCov_9fa48("5781");
                    handleSessionComplete();
                  }
                }
                setIsLoading(stryMutAct_9fa48("5782") ? true : (stryCov_9fa48("5782"), false));
              }
            }, 300);
          }
        } catch (error) {
          if (stryMutAct_9fa48("5783")) {
            {}
          } else {
            stryCov_9fa48("5783");
            console.error(stryMutAct_9fa48("5784") ? "" : (stryCov_9fa48("5784"), 'Error handling swipe:'), error);
            toast.error(stryMutAct_9fa48("5785") ? "" : (stryCov_9fa48("5785"), 'Failed to record preference. Please try again.'));
            setIsLoading(stryMutAct_9fa48("5786") ? true : (stryCov_9fa48("5786"), false));
          }
        }
      }
    }, stryMutAct_9fa48("5787") ? [] : (stryCov_9fa48("5787"), [currentProduct, isLoading, isAuthenticated, currentIndex, products.length, sessionType, mobileOptimizations.isMobile, haptics]));

    // ==============================================================================
    // SESSION HANDLERS
    // ==============================================================================

    const handleSessionComplete = useCallback(() => {
      if (stryMutAct_9fa48("5788")) {
        {}
      } else {
        stryCov_9fa48("5788");
        toast.success(stryMutAct_9fa48("5789") ? "" : (stryCov_9fa48("5789"), '🎉 Great job! Your session is complete.'));
        if (stryMutAct_9fa48("5791") ? false : stryMutAct_9fa48("5790") ? true : (stryCov_9fa48("5790", "5791"), isAuthenticated)) {
          if (stryMutAct_9fa48("5792")) {
            {}
          } else {
            stryCov_9fa48("5792");
            // Redirect to recommendations
            setTimeout(() => {
              if (stryMutAct_9fa48("5793")) {
                {}
              } else {
                stryCov_9fa48("5793");
                router.push(stryMutAct_9fa48("5794") ? "" : (stryCov_9fa48("5794"), '/dashboard/recommendations'));
              }
            }, 1500);
          }
        } else {
          if (stryMutAct_9fa48("5795")) {
            {}
          } else {
            stryCov_9fa48("5795");
            // Encourage sign up
            toast.success(stryMutAct_9fa48("5796") ? "" : (stryCov_9fa48("5796"), 'Sign up to save your preferences and get personalised recommendations!'));
            setTimeout(() => {
              if (stryMutAct_9fa48("5797")) {
                {}
              } else {
                stryCov_9fa48("5797");
                router.push(stryMutAct_9fa48("5798") ? "" : (stryCov_9fa48("5798"), '/auth/register?redirect=/dashboard/recommendations'));
              }
            }, 2000);
          }
        }
      }
    }, stryMutAct_9fa48("5799") ? [] : (stryCov_9fa48("5799"), [isAuthenticated, router]));
    const handleResetSession = useCallback(() => {
      if (stryMutAct_9fa48("5800")) {
        {}
      } else {
        stryCov_9fa48("5800");
        setCurrentIndex(0);
        setSwipeCount(0);
        toast.success(stryMutAct_9fa48("5801") ? "" : (stryCov_9fa48("5801"), 'Session reset! Starting over.'));
      }
    }, stryMutAct_9fa48("5802") ? ["Stryker was here"] : (stryCov_9fa48("5802"), []));

    // ==============================================================================
    // RENDER COMPONENTS
    // ==============================================================================

    if (stryMutAct_9fa48("5804") ? false : stryMutAct_9fa48("5803") ? true : (stryCov_9fa48("5803", "5804"), isSessionComplete)) {
      if (stryMutAct_9fa48("5805")) {
        {}
      } else {
        stryCov_9fa48("5805");
        return <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
        <motion.div initial={stryMutAct_9fa48("5806") ? {} : (stryCov_9fa48("5806"), {
            scale: 0.9,
            opacity: 0
          })} animate={stryMutAct_9fa48("5807") ? {} : (stryCov_9fa48("5807"), {
            scale: 1,
            opacity: 1
          })} className="text-center max-w-md">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Session Complete!
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {isAuthenticated ? stryMutAct_9fa48("5808") ? "" : (stryCov_9fa48("5808"), "Great job! We've learned about your preferences. Redirecting to your personalised recommendations...") : stryMutAct_9fa48("5809") ? "" : (stryCov_9fa48("5809"), "Thanks for trying our discovery! Sign up to save your preferences and get personalised recommendations.")}
          </p>

          <div className="space-y-3">
            <button onClick={handleResetSession} className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Start New Session
            </button>

            {stryMutAct_9fa48("5812") ? !isAuthenticated || <button onClick={() => router.push('/auth/register')} className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Sign Up for Recommendations
              </button> : stryMutAct_9fa48("5811") ? false : stryMutAct_9fa48("5810") ? true : (stryCov_9fa48("5810", "5811", "5812"), (stryMutAct_9fa48("5813") ? isAuthenticated : (stryCov_9fa48("5813"), !isAuthenticated)) && <button onClick={stryMutAct_9fa48("5814") ? () => undefined : (stryCov_9fa48("5814"), () => router.push(stryMutAct_9fa48("5815") ? "" : (stryCov_9fa48("5815"), '/auth/register')))} className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Sign Up for Recommendations
              </button>)}
          </div>
        </motion.div>
      </div>;
      }
    }
    return <div className="flex-1 relative bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Welcome Overlay */}
      <AnimatePresence>
        {stryMutAct_9fa48("5818") ? showWelcome || <WelcomeOverlay onDismiss={() => setShowWelcome(false)} isAuthenticated={isAuthenticated} /> : stryMutAct_9fa48("5817") ? false : stryMutAct_9fa48("5816") ? true : (stryCov_9fa48("5816", "5817", "5818"), showWelcome && <WelcomeOverlay onDismiss={stryMutAct_9fa48("5819") ? () => undefined : (stryCov_9fa48("5819"), () => setShowWelcome(stryMutAct_9fa48("5820") ? true : (stryCov_9fa48("5820"), false)))} isAuthenticated={isAuthenticated} />)}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-primary-600" />
            <div>
              <h1 className="font-semibold text-gray-900">Discover Products</h1>
              <p className="text-sm text-gray-600">
                {stryMutAct_9fa48("5821") ? currentIndex - 1 : (stryCov_9fa48("5821"), currentIndex + 1)} of {products.length} • {swipeCount} preferences recorded
              </p>
            </div>
          </div>

          <button onClick={handleResetSession} className="p-2 text-gray-600 hover:text-primary-600 transition-colors" title="Reset session">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Swipe Interface */}
      <div className="flex-1 relative overflow-hidden p-6">
        <AnimatePresence mode="wait">
          {stryMutAct_9fa48("5824") ? currentProduct || <motion.div key={currentProduct.id} initial={{
            scale: 0.9,
            opacity: 0,
            y: 50
          }} animate={{
            scale: 1,
            opacity: 1,
            y: 0
          }} exit={{
            scale: 0.9,
            opacity: 0,
            y: -50
          }} transition={{
            duration: 0.3
          }} className="h-full flex items-center justify-center">
              <div className="w-full max-w-md">
                <ProductCard product={currentProduct} onSwipe={handleSwipe} isLoading={isLoading} />
              </div>
            </motion.div> : stryMutAct_9fa48("5823") ? false : stryMutAct_9fa48("5822") ? true : (stryCov_9fa48("5822", "5823", "5824"), currentProduct && <motion.div key={currentProduct.id} initial={stryMutAct_9fa48("5825") ? {} : (stryCov_9fa48("5825"), {
            scale: 0.9,
            opacity: 0,
            y: 50
          })} animate={stryMutAct_9fa48("5826") ? {} : (stryCov_9fa48("5826"), {
            scale: 1,
            opacity: 1,
            y: 0
          })} exit={stryMutAct_9fa48("5827") ? {} : (stryCov_9fa48("5827"), {
            scale: 0.9,
            opacity: 0,
            y: stryMutAct_9fa48("5828") ? +50 : (stryCov_9fa48("5828"), -50)
          })} transition={stryMutAct_9fa48("5829") ? {} : (stryCov_9fa48("5829"), {
            duration: 0.3
          })} className="h-full flex items-center justify-center">
              <div className="w-full max-w-md">
                <ProductCard product={currentProduct} onSwipe={handleSwipe} isLoading={isLoading} />
              </div>
            </motion.div>)}
        </AnimatePresence>

        {/* Swipe Action Buttons */}
        {stryMutAct_9fa48("5832") ? currentProduct || <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <motion.button whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.95
          }} onClick={() => handleSwipe('left')} disabled={isLoading} className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
              <X className="w-6 h-6" />
            </motion.button>

            <motion.button whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.95
          }} onClick={() => handleSwipe('up')} disabled={isLoading} className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50">
              <ArrowUp className="w-5 h-5" />
            </motion.button>

            <motion.button whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.95
          }} onClick={() => handleSwipe('right')} disabled={isLoading} className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors disabled:opacity-50">
              <Heart className="w-6 h-6" />
            </motion.button>
          </div> : stryMutAct_9fa48("5831") ? false : stryMutAct_9fa48("5830") ? true : (stryCov_9fa48("5830", "5831", "5832"), currentProduct && <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <motion.button whileHover={stryMutAct_9fa48("5833") ? {} : (stryCov_9fa48("5833"), {
            scale: 1.1
          })} whileTap={stryMutAct_9fa48("5834") ? {} : (stryCov_9fa48("5834"), {
            scale: 0.95
          })} onClick={stryMutAct_9fa48("5835") ? () => undefined : (stryCov_9fa48("5835"), () => handleSwipe(stryMutAct_9fa48("5836") ? "" : (stryCov_9fa48("5836"), 'left')))} disabled={isLoading} className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
              <X className="w-6 h-6" />
            </motion.button>

            <motion.button whileHover={stryMutAct_9fa48("5837") ? {} : (stryCov_9fa48("5837"), {
            scale: 1.1
          })} whileTap={stryMutAct_9fa48("5838") ? {} : (stryCov_9fa48("5838"), {
            scale: 0.95
          })} onClick={stryMutAct_9fa48("5839") ? () => undefined : (stryCov_9fa48("5839"), () => handleSwipe(stryMutAct_9fa48("5840") ? "" : (stryCov_9fa48("5840"), 'up')))} disabled={isLoading} className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50">
              <ArrowUp className="w-5 h-5" />
            </motion.button>

            <motion.button whileHover={stryMutAct_9fa48("5841") ? {} : (stryCov_9fa48("5841"), {
            scale: 1.1
          })} whileTap={stryMutAct_9fa48("5842") ? {} : (stryCov_9fa48("5842"), {
            scale: 0.95
          })} onClick={stryMutAct_9fa48("5843") ? () => undefined : (stryCov_9fa48("5843"), () => handleSwipe(stryMutAct_9fa48("5844") ? "" : (stryCov_9fa48("5844"), 'right')))} disabled={isLoading} className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors disabled:opacity-50">
              <Heart className="w-6 h-6" />
            </motion.button>
          </div>)}

        {/* Instructions Hint */}
        {stryMutAct_9fa48("5847") ? currentIndex < 3 && currentProduct || <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 1
        }} className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs">
            <p className="flex items-center gap-2">
              <span>←</span> Dislike • <span>→</span> Like • <span>↑</span> Super Like
            </p>
            <p className="text-xs opacity-75 mt-1">Or use the buttons below</p>
          </motion.div> : stryMutAct_9fa48("5846") ? false : stryMutAct_9fa48("5845") ? true : (stryCov_9fa48("5845", "5846", "5847"), (stryMutAct_9fa48("5849") ? currentIndex < 3 || currentProduct : stryMutAct_9fa48("5848") ? true : (stryCov_9fa48("5848", "5849"), (stryMutAct_9fa48("5852") ? currentIndex >= 3 : stryMutAct_9fa48("5851") ? currentIndex <= 3 : stryMutAct_9fa48("5850") ? true : (stryCov_9fa48("5850", "5851", "5852"), currentIndex < 3)) && currentProduct)) && <motion.div initial={stryMutAct_9fa48("5853") ? {} : (stryCov_9fa48("5853"), {
          opacity: 0,
          y: 20
        })} animate={stryMutAct_9fa48("5854") ? {} : (stryCov_9fa48("5854"), {
          opacity: 1,
          y: 0
        })} transition={stryMutAct_9fa48("5855") ? {} : (stryCov_9fa48("5855"), {
          delay: 1
        })} className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs">
            <p className="flex items-center gap-2">
              <span>←</span> Dislike • <span>→</span> Like • <span>↑</span> Super Like
            </p>
            <p className="text-xs opacity-75 mt-1">Or use the buttons below</p>
          </motion.div>)}
      </div>
    </div>;
  }
}