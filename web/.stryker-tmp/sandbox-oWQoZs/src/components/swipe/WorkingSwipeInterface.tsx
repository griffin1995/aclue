/**
 * WorkingSwipeInterface Component
 * 
 * Production-ready swipe interface for product discovery and preference collection.
 * This component was specifically created to resolve rendering issues with the original
 * SwipeInterface that had complex dependencies and animation conflicts.
 * 
 * Key Features:
 *   - Stable, dependency-minimal implementation
 *   - Real Amazon product integration with fallback mock data
 *   - Tinder-style swipe gestures (left: dislike, right: like)
 *   - Session progress tracking and completion handling
 *   - Responsive design with proper CSS layout
 *   - Loading states and error handling
 * 
 * Critical CSS Requirements (from CLAUDE.md):
 *   - Main container: min-h-96 (prevents flex-1 collapse)
 *   - Product cards: absolute inset-4 positioning
 *   - Avoids framer-motion and complex animations
 * 
 * Usage:
 *   <WorkingSwipeInterface 
 *     sessionType="discovery"
 *     onSessionComplete={(session) => handleComplete(session)}
 *     onRecommendationsReady={() => navigateToRecommendations()}
 *   />
 */
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
import { Gift, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

/**
 * Props interface for WorkingSwipeInterface component.
 * 
 * Provides configuration options for different swipe session types
 * and callback handlers for session lifecycle events.
 */
interface WorkingSwipeInterfaceProps {
  sessionType?: string; // Type of swipe session ("discovery", "onboarding", "gift_selection")
  onSessionComplete?: (session: any) => void; // Called when user completes swipe session
  onRecommendationsReady?: () => void; // Called when recommendations should be generated
  className?: string; // Additional CSS classes for styling
}

/**
 * WorkingSwipeInterface functional component.
 * 
 * Manages product data fetching, swipe state, and user interactions
 * for the core product discovery experience.
 */
export const WorkingSwipeInterface: React.FC<WorkingSwipeInterfaceProps> = ({
  sessionType = stryMutAct_9fa48("7144") ? "" : (stryCov_9fa48("7144"), 'discovery'),
  // Default to general discovery session
  onSessionComplete,
  // Optional session completion callback
  className = stryMutAct_9fa48("7145") ? "Stryker was here!" : (stryCov_9fa48("7145"), '') // Optional additional styling
}) => {
  if (stryMutAct_9fa48("7146")) {
    {}
  } else {
    stryCov_9fa48("7146");
    // ===========================================================================
    // COMPONENT STATE
    // ===========================================================================

    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("7147") ? false : (stryCov_9fa48("7147"), true)); // Loading state for initial data fetch
    const [products, setProducts] = useState<any[]>(stryMutAct_9fa48("7148") ? ["Stryker was here"] : (stryCov_9fa48("7148"), [])); // Array of products to swipe through
    const [currentIndex, setCurrentIndex] = useState(0); // Index of currently displayed product

    // ===========================================================================
    // DATA FETCHING FUNCTIONS
    // ===========================================================================

    /**
     * Fetch real Amazon products from the backend API.
     * 
     * Attempts to load real product data from the backend. If the API call fails
     * (e.g., backend not running, network issues), falls back to mock data to
     * ensure the component remains functional during development.
     * 
     * API Integration:
     *   - Calls /api/v1/products/ endpoint with limit parameter
     *   - Uses absolute URL for development (localhost:8000)
     *   - In production, would use relative URLs with proxy
     * 
     * Error Handling:
     *   - Network errors: Logs error and returns mock data
     *   - API errors: Throws error and falls back to mock data
     *   - Malformed response: Handles gracefully with fallback
     * 
     * Performance:
     *   - Limits to 5 products for optimal swipe session length
     *   - Async/await pattern for clean error handling
     *   - Mock data fallback ensures UI never breaks
     * 
     * Returns:
     *   Promise<Product[]>: Array of product objects for swiping
     */
    const fetchProducts = async () => {
      if (stryMutAct_9fa48("7149")) {
        {}
      } else {
        stryCov_9fa48("7149");
        try {
          if (stryMutAct_9fa48("7150")) {
            {}
          } else {
            stryCov_9fa48("7150");
            // Attempt to fetch real products from backend API using authenticated client
            const response = await api.products.getProducts(stryMutAct_9fa48("7151") ? {} : (stryCov_9fa48("7151"), {
              limit: 5
            }));
            return stryMutAct_9fa48("7154") ? response.data && response : stryMutAct_9fa48("7153") ? false : stryMutAct_9fa48("7152") ? true : (stryCov_9fa48("7152", "7153", "7154"), response.data || response); // Handle both wrapped and direct responses
          }
        } catch (error) {
          if (stryMutAct_9fa48("7155")) {
            {}
          } else {
            stryCov_9fa48("7155");
            console.error(stryMutAct_9fa48("7156") ? "" : (stryCov_9fa48("7156"), 'Failed to fetch products from API, using mock data:'), error);
            // Fallback to local mock data for development reliability
            return stryMutAct_9fa48("7157") ? [] : (stryCov_9fa48("7157"), [// ===========================================================================
            // MOCK PRODUCT DATA
            // ===========================================================================
            // High-quality mock products for development and testing
            stryMutAct_9fa48("7158") ? {} : (stryCov_9fa48("7158"), {
              id: stryMutAct_9fa48("7159") ? "" : (stryCov_9fa48("7159"), '1'),
              title: stryMutAct_9fa48("7160") ? "" : (stryCov_9fa48("7160"), 'Wireless Bluetooth Headphones'),
              description: stryMutAct_9fa48("7161") ? "" : (stryCov_9fa48("7161"), 'Premium noise-cancelling headphones with 30-hour battery life'),
              price: 79.99,
              currency: stryMutAct_9fa48("7162") ? "" : (stryCov_9fa48("7162"), 'GBP'),
              image_url: stryMutAct_9fa48("7163") ? "" : (stryCov_9fa48("7163"), 'https://picsum.photos/400/300?random=1'),
              brand: stryMutAct_9fa48("7164") ? "" : (stryCov_9fa48("7164"), 'AudioTech')
            }), stryMutAct_9fa48("7165") ? {} : (stryCov_9fa48("7165"), {
              id: stryMutAct_9fa48("7166") ? "" : (stryCov_9fa48("7166"), '2'),
              title: stryMutAct_9fa48("7167") ? "" : (stryCov_9fa48("7167"), 'Smart Fitness Watch'),
              description: stryMutAct_9fa48("7168") ? "" : (stryCov_9fa48("7168"), 'Advanced smartwatch with health monitoring features'),
              price: 199.99,
              currency: stryMutAct_9fa48("7169") ? "" : (stryCov_9fa48("7169"), 'GBP'),
              image_url: stryMutAct_9fa48("7170") ? "" : (stryCov_9fa48("7170"), 'https://picsum.photos/400/300?random=2'),
              brand: stryMutAct_9fa48("7171") ? "" : (stryCov_9fa48("7171"), 'FitTech')
            }), stryMutAct_9fa48("7172") ? {} : (stryCov_9fa48("7172"), {
              id: stryMutAct_9fa48("7173") ? "" : (stryCov_9fa48("7173"), '3'),
              title: stryMutAct_9fa48("7174") ? "" : (stryCov_9fa48("7174"), 'Coffee Bean Gift Set'),
              description: stryMutAct_9fa48("7175") ? "" : (stryCov_9fa48("7175"), 'Premium coffee beans from around the world'),
              price: 45.00,
              currency: stryMutAct_9fa48("7176") ? "" : (stryCov_9fa48("7176"), 'GBP'),
              image_url: stryMutAct_9fa48("7177") ? "" : (stryCov_9fa48("7177"), 'https://picsum.photos/400/300?random=3'),
              brand: stryMutAct_9fa48("7178") ? "" : (stryCov_9fa48("7178"), 'RoastMaster')
            })]);
          }
        }
      }
    };

    // ===========================================================================
    // COMPONENT INITIALIZATION
    // ===========================================================================

    /**
     * Initialize component with product data on mount.
     * 
     * Loads products asynchronously and manages loading state for smooth UX.
     * Uses empty dependency array to run only once on component mount.
     */
    useEffect(() => {
      if (stryMutAct_9fa48("7179")) {
        {}
      } else {
        stryCov_9fa48("7179");
        const loadProducts = async () => {
          if (stryMutAct_9fa48("7180")) {
            {}
          } else {
            stryCov_9fa48("7180");
            setIsLoading(stryMutAct_9fa48("7181") ? false : (stryCov_9fa48("7181"), true)); // Show loading spinner
            const products = await fetchProducts(); // Fetch from API or fallback to mock
            setProducts(products); // Set products for swipe interface
            setIsLoading(stryMutAct_9fa48("7182") ? true : (stryCov_9fa48("7182"), false)); // Hide loading spinner
          }
        };
        loadProducts();
      }
    }, stryMutAct_9fa48("7183") ? ["Stryker was here"] : (stryCov_9fa48("7183"), []));

    // ===========================================================================
    // KEYBOARD INTERACTION HANDLING
    // ===========================================================================

    /**
     * Setup keyboard event handlers for accessibility and power users.
     * 
     * Provides keyboard shortcuts for swipe actions:
     *   - Left Arrow: Dislike current product
     *   - Right Arrow / Space: Like current product
     *   - Prevents default browser behavior
     * 
     * Accessibility Benefits:
     *   - Keyboard navigation for users who can't use mouse/touch
     *   - Faster interaction for power users
     *   - Consistent with common UI patterns
     */
    useEffect(() => {
      if (stryMutAct_9fa48("7184")) {
        {}
      } else {
        stryCov_9fa48("7184");
        const handleKeyPress = (event: KeyboardEvent) => {
          if (stryMutAct_9fa48("7185")) {
            {}
          } else {
            stryCov_9fa48("7185");
            // Don't handle keys during loading or when no products available
            if (stryMutAct_9fa48("7188") ? isLoading && products.length === 0 : stryMutAct_9fa48("7187") ? false : stryMutAct_9fa48("7186") ? true : (stryCov_9fa48("7186", "7187", "7188"), isLoading || (stryMutAct_9fa48("7190") ? products.length !== 0 : stryMutAct_9fa48("7189") ? false : (stryCov_9fa48("7189", "7190"), products.length === 0)))) return;
            switch (event.key) {
              case stryMutAct_9fa48("7192") ? "" : (stryCov_9fa48("7192"), 'ArrowLeft'):
                if (stryMutAct_9fa48("7191")) {} else {
                  stryCov_9fa48("7191");
                  event.preventDefault(); // Prevent browser navigation
                  handleSwipe(stryMutAct_9fa48("7193") ? "" : (stryCov_9fa48("7193"), 'left')); // Dislike current product
                  break;
                }
              case stryMutAct_9fa48("7195") ? "" : (stryCov_9fa48("7195"), 'ArrowRight'):
                if (stryMutAct_9fa48("7194")) {} else {
                  stryCov_9fa48("7194");
                  event.preventDefault(); // Prevent browser navigation
                  handleSwipe(stryMutAct_9fa48("7196") ? "" : (stryCov_9fa48("7196"), 'right')); // Like current product
                  break;
                }
              case stryMutAct_9fa48("7197") ? "" : (stryCov_9fa48("7197"), ' '): // Spacebar (common like action)
              case stryMutAct_9fa48("7199") ? "" : (stryCov_9fa48("7199"), 'Spacebar'):
                if (stryMutAct_9fa48("7198")) {} else {
                  stryCov_9fa48("7198");
                  event.preventDefault(); // Prevent page scroll
                  handleSwipe(stryMutAct_9fa48("7200") ? "" : (stryCov_9fa48("7200"), 'right')); // Like current product
                  break;
                }
            }
          }
        };

        // Add global keyboard listener
        window.addEventListener(stryMutAct_9fa48("7201") ? "" : (stryCov_9fa48("7201"), 'keydown'), handleKeyPress);

        // Cleanup listener on unmount to prevent memory leaks
        return stryMutAct_9fa48("7202") ? () => undefined : (stryCov_9fa48("7202"), () => window.removeEventListener(stryMutAct_9fa48("7203") ? "" : (stryCov_9fa48("7203"), 'keydown'), handleKeyPress));
      }
    }, stryMutAct_9fa48("7204") ? [] : (stryCov_9fa48("7204"), [isLoading, products.length, currentIndex]));

    // ===========================================================================
    // SWIPE INTERACTION HANDLERS
    // ===========================================================================

    /**
     * Handle swipe gesture or button click for product preference.
     * 
     * Records user preference and advances to next product. When session
     * is complete, triggers callback for parent component handling.
     * 
     * Future Enhancements:
     *   - Send preference data to backend API
     *   - Track swipe timing and hesitation for ML insights
     *   - Add haptic feedback for mobile devices
     * 
     * @param direction - Swipe direction ('left' for dislike, 'right' for like)
     */
    const handleSwipe = (direction: 'left' | 'right') => {
      if (stryMutAct_9fa48("7205")) {
        {}
      } else {
        stryCov_9fa48("7205");
        console.log(stryMutAct_9fa48("7206") ? `` : (stryCov_9fa48("7206"), `Swiped ${direction} on product`), stryMutAct_9fa48("7207") ? products[currentIndex].title : (stryCov_9fa48("7207"), products[currentIndex]?.title));

        // TODO: Send swipe data to backend for preference learning
        // await fetch('/api/v1/swipes/', {
        //   method: 'POST',
        //   body: JSON.stringify({
        //     product_id: currentProduct.id,
        //     direction: direction === 'left' ? 'dislike' : 'like',
        //     session_id: sessionId
        //   })
        // });

        if (stryMutAct_9fa48("7211") ? currentIndex >= products.length - 1 : stryMutAct_9fa48("7210") ? currentIndex <= products.length - 1 : stryMutAct_9fa48("7209") ? false : stryMutAct_9fa48("7208") ? true : (stryCov_9fa48("7208", "7209", "7210", "7211"), currentIndex < (stryMutAct_9fa48("7212") ? products.length + 1 : (stryCov_9fa48("7212"), products.length - 1)))) {
          if (stryMutAct_9fa48("7213")) {
            {}
          } else {
            stryCov_9fa48("7213");
            // Move to next product
            setCurrentIndex(stryMutAct_9fa48("7214") ? currentIndex - 1 : (stryCov_9fa48("7214"), currentIndex + 1));
          }
        } else {
          if (stryMutAct_9fa48("7215")) {
            {}
          } else {
            stryCov_9fa48("7215");
            // Session complete - trigger callback for parent handling
            if (stryMutAct_9fa48("7217") ? false : stryMutAct_9fa48("7216") ? true : (stryCov_9fa48("7216", "7217"), onSessionComplete)) {
              if (stryMutAct_9fa48("7218")) {
                {}
              } else {
                stryCov_9fa48("7218");
                onSessionComplete(stryMutAct_9fa48("7219") ? {} : (stryCov_9fa48("7219"), {
                  completed: stryMutAct_9fa48("7220") ? false : (stryCov_9fa48("7220"), true),
                  totalSwipes: products.length,
                  sessionType: sessionType
                }));
              }
            }
          }
        }
      }
    };

    /**
     * Reset swipe session to beginning.
     * 
     * Allows users to restart the session without reloading the component.
     * Useful for testing different preference patterns or if user wants
     * to re-evaluate products.
     */
    const resetSession = () => {
      if (stryMutAct_9fa48("7221")) {
        {}
      } else {
        stryCov_9fa48("7221");
        setCurrentIndex(0);
      }
    };
    const currentProduct = products[currentIndex];
    return <div className={stryMutAct_9fa48("7222") ? `` : (stryCov_9fa48("7222"), `relative w-full h-full flex flex-col ${className}`)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-primary-600" />
          <div>
            <h2 className="font-semibold text-gray-900">Discover Products</h2>
            <p className="text-sm text-gray-600">
              {stryMutAct_9fa48("7223") ? currentIndex - 1 : (stryCov_9fa48("7223"), currentIndex + 1)} of {products.length}
            </p>
          </div>
        </div>
        <button onClick={resetSession} className="p-2 text-gray-600 hover:text-primary-600 transition-colors" title="Reset session">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 min-h-96">
        {isLoading ?
        // Loading state
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div> : currentProduct ?
        // Product card
        <div className="absolute inset-4">
            <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Product Image */}
              <div className="relative w-full h-2/3">
                <img src={currentProduct.image_url} alt={currentProduct.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Product Information */}
              <div className="p-6 h-1/3 flex flex-col justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {currentProduct.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{currentProduct.brand}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {currentProduct.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-gray-900">
                      £{currentProduct.price.toFixed(2)}
                    </span>
                    {stryMutAct_9fa48("7226") ? currentProduct.affiliate_url || <a href={currentProduct.affiliate_url} target="_blank" rel="noopener noreferrer" className="text-xs bg-amazon-orange text-white px-2 py-1 rounded hover:bg-amazon-orange-dark transition-colors" style={{
                    backgroundColor: '#FF9900'
                  }}>
                        View on Amazon
                      </a> : stryMutAct_9fa48("7225") ? false : stryMutAct_9fa48("7224") ? true : (stryCov_9fa48("7224", "7225", "7226"), currentProduct.affiliate_url && <a href={currentProduct.affiliate_url} target="_blank" rel="noopener noreferrer" className="text-xs bg-amazon-orange text-white px-2 py-1 rounded hover:bg-amazon-orange-dark transition-colors" style={stryMutAct_9fa48("7227") ? {} : (stryCov_9fa48("7227"), {
                    backgroundColor: stryMutAct_9fa48("7228") ? "" : (stryCov_9fa48("7228"), '#FF9900')
                  })}>
                        View on Amazon
                      </a>)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button onClick={stryMutAct_9fa48("7229") ? () => undefined : (stryCov_9fa48("7229"), () => handleSwipe(stryMutAct_9fa48("7230") ? "" : (stryCov_9fa48("7230"), 'left')))} className="w-12 h-12 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors group">
                    <span className="text-2xl group-hover:text-red-500">✕</span>
                  </button>
                  <button onClick={stryMutAct_9fa48("7231") ? () => undefined : (stryCov_9fa48("7231"), () => handleSwipe(stryMutAct_9fa48("7232") ? "" : (stryCov_9fa48("7232"), 'right')))} className="w-12 h-12 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors group">
                    <span className="text-2xl group-hover:text-green-500">♥</span>
                  </button>
                </div>
              </div>
            </div>
          </div> :
        // Session complete
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Session Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Great job! We've learned about your preferences.
              </p>
              <button onClick={resetSession} className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Start New Session
              </button>
            </div>
          </div>}
      </div>

      {/* Instructions */}
      {stryMutAct_9fa48("7235") ? currentProduct && currentIndex < 3 || <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs">
          <p>← Dislike • → Like</p>
          <p className="text-xs opacity-75 mt-1">Or use the buttons below</p>
        </div> : stryMutAct_9fa48("7234") ? false : stryMutAct_9fa48("7233") ? true : (stryCov_9fa48("7233", "7234", "7235"), (stryMutAct_9fa48("7237") ? currentProduct || currentIndex < 3 : stryMutAct_9fa48("7236") ? true : (stryCov_9fa48("7236", "7237"), currentProduct && (stryMutAct_9fa48("7240") ? currentIndex >= 3 : stryMutAct_9fa48("7239") ? currentIndex <= 3 : stryMutAct_9fa48("7238") ? true : (stryCov_9fa48("7238", "7239", "7240"), currentIndex < 3)))) && <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs">
          <p>← Dislike • → Like</p>
          <p className="text-xs opacity-75 mt-1">Or use the buttons below</p>
        </div>)}
    </div>;
  }
};
export default WorkingSwipeInterface;