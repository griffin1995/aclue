/**
 * Product Server Actions
 *
 * Server-side actions for product operations including:
 * - Product fetching and search
 * - Cart management
 * - Wishlist operations
 * - Recommendation generation
 * - User preference tracking
 *
 * These actions run on the server and provide:
 * - Type safety
 * - Authentication handling
 * - API integration
 * - Error handling
 * - Performance optimisation
 */
// @ts-nocheck


'use server';

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
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { api } from '@/lib/api';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

interface ProductSearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'relevance';
  page?: number;
  limit?: number;
}
interface SwipeData {
  productId: string;
  direction: 'like' | 'dislike' | 'super_like';
  sessionType?: string;
  timestamp?: Date;
}

// ==============================================================================
// PRODUCT FETCHING ACTIONS
// ==============================================================================

/**
 * Get products with server-side caching
 *
 * Fetches products from the backend API with caching for performance.
 * Uses Next.js cache tags for selective revalidation.
 */
export async function getProducts(params: ProductSearchParams = {}) {
  if (stryMutAct_9fa48("1759")) {
    {}
  } else {
    stryCov_9fa48("1759");
    try {
      if (stryMutAct_9fa48("1760")) {
        {}
      } else {
        stryCov_9fa48("1760");
        const {
          query = stryMutAct_9fa48("1761") ? "Stryker was here!" : (stryCov_9fa48("1761"), ''),
          category = stryMutAct_9fa48("1762") ? "Stryker was here!" : (stryCov_9fa48("1762"), ''),
          minPrice,
          maxPrice,
          sortBy = stryMutAct_9fa48("1763") ? "" : (stryCov_9fa48("1763"), 'relevance'),
          page = 1,
          limit = 20
        } = params;

        // Build API request parameters
        const apiParams = stryMutAct_9fa48("1764") ? {} : (stryCov_9fa48("1764"), {
          q: query,
          category,
          min_price: minPrice,
          max_price: maxPrice,
          sort_by: sortBy,
          page,
          limit
        });

        // Remove undefined values
        const cleanParams = Object.fromEntries(stryMutAct_9fa48("1765") ? Object.entries(apiParams) : (stryCov_9fa48("1765"), Object.entries(apiParams).filter(stryMutAct_9fa48("1766") ? () => undefined : (stryCov_9fa48("1766"), ([_, value]) => stryMutAct_9fa48("1769") ? value !== undefined || value !== '' : stryMutAct_9fa48("1768") ? false : stryMutAct_9fa48("1767") ? true : (stryCov_9fa48("1767", "1768", "1769"), (stryMutAct_9fa48("1771") ? value === undefined : stryMutAct_9fa48("1770") ? true : (stryCov_9fa48("1770", "1771"), value !== undefined)) && (stryMutAct_9fa48("1773") ? value === '' : stryMutAct_9fa48("1772") ? true : (stryCov_9fa48("1772", "1773"), value !== (stryMutAct_9fa48("1774") ? "Stryker was here!" : (stryCov_9fa48("1774"), '')))))))));

        // Fetch with caching
        const response = await fetch(stryMutAct_9fa48("1775") ? `` : (stryCov_9fa48("1775"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/?${new URLSearchParams(cleanParams)}`), stryMutAct_9fa48("1776") ? {} : (stryCov_9fa48("1776"), {
          next: stryMutAct_9fa48("1777") ? {} : (stryCov_9fa48("1777"), {
            revalidate: 300,
            // Cache for 5 minutes
            tags: stryMutAct_9fa48("1778") ? [] : (stryCov_9fa48("1778"), [stryMutAct_9fa48("1779") ? "" : (stryCov_9fa48("1779"), 'products'), stryMutAct_9fa48("1780") ? `` : (stryCov_9fa48("1780"), `products-${category}`), stryMutAct_9fa48("1781") ? `` : (stryCov_9fa48("1781"), `products-page-${page}`)])
          }),
          headers: stryMutAct_9fa48("1782") ? {} : (stryCov_9fa48("1782"), {
            'Content-Type': stryMutAct_9fa48("1783") ? "" : (stryCov_9fa48("1783"), 'application/json')
          })
        }));
        if (stryMutAct_9fa48("1786") ? false : stryMutAct_9fa48("1785") ? true : stryMutAct_9fa48("1784") ? response.ok : (stryCov_9fa48("1784", "1785", "1786"), !response.ok)) {
          if (stryMutAct_9fa48("1787")) {
            {}
          } else {
            stryCov_9fa48("1787");
            throw new Error(stryMutAct_9fa48("1788") ? `` : (stryCov_9fa48("1788"), `Failed to fetch products: ${response.status}`));
          }
        }
        const data = await response.json();
        return stryMutAct_9fa48("1789") ? {} : (stryCov_9fa48("1789"), {
          success: stryMutAct_9fa48("1790") ? false : (stryCov_9fa48("1790"), true),
          data: stryMutAct_9fa48("1793") ? data.data && data : stryMutAct_9fa48("1792") ? false : stryMutAct_9fa48("1791") ? true : (stryCov_9fa48("1791", "1792", "1793"), data.data || data)
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("1794")) {
        {}
      } else {
        stryCov_9fa48("1794");
        console.error(stryMutAct_9fa48("1795") ? "" : (stryCov_9fa48("1795"), 'Error fetching products:'), error);
        return stryMutAct_9fa48("1796") ? {} : (stryCov_9fa48("1796"), {
          success: stryMutAct_9fa48("1797") ? true : (stryCov_9fa48("1797"), false),
          error: stryMutAct_9fa48("1798") ? "" : (stryCov_9fa48("1798"), 'Failed to load products. Please try again.'),
          data: stryMutAct_9fa48("1799") ? ["Stryker was here"] : (stryCov_9fa48("1799"), [])
        });
      }
    }
  }
}

/**
 * Get single product by ID with caching
 */
export async function getProductById(productId: string) {
  if (stryMutAct_9fa48("1800")) {
    {}
  } else {
    stryCov_9fa48("1800");
    try {
      if (stryMutAct_9fa48("1801")) {
        {}
      } else {
        stryCov_9fa48("1801");
        const response = await fetch(stryMutAct_9fa48("1802") ? `` : (stryCov_9fa48("1802"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${productId}`), stryMutAct_9fa48("1803") ? {} : (stryCov_9fa48("1803"), {
          next: stryMutAct_9fa48("1804") ? {} : (stryCov_9fa48("1804"), {
            revalidate: 600,
            // Cache for 10 minutes
            tags: stryMutAct_9fa48("1805") ? [] : (stryCov_9fa48("1805"), [stryMutAct_9fa48("1806") ? "" : (stryCov_9fa48("1806"), 'products'), stryMutAct_9fa48("1807") ? `` : (stryCov_9fa48("1807"), `product-${productId}`)])
          }),
          headers: stryMutAct_9fa48("1808") ? {} : (stryCov_9fa48("1808"), {
            'Content-Type': stryMutAct_9fa48("1809") ? "" : (stryCov_9fa48("1809"), 'application/json')
          })
        }));
        if (stryMutAct_9fa48("1812") ? false : stryMutAct_9fa48("1811") ? true : stryMutAct_9fa48("1810") ? response.ok : (stryCov_9fa48("1810", "1811", "1812"), !response.ok)) {
          if (stryMutAct_9fa48("1813")) {
            {}
          } else {
            stryCov_9fa48("1813");
            if (stryMutAct_9fa48("1816") ? response.status !== 404 : stryMutAct_9fa48("1815") ? false : stryMutAct_9fa48("1814") ? true : (stryCov_9fa48("1814", "1815", "1816"), response.status === 404)) {
              if (stryMutAct_9fa48("1817")) {
                {}
              } else {
                stryCov_9fa48("1817");
                return stryMutAct_9fa48("1818") ? {} : (stryCov_9fa48("1818"), {
                  success: stryMutAct_9fa48("1819") ? true : (stryCov_9fa48("1819"), false),
                  error: stryMutAct_9fa48("1820") ? "" : (stryCov_9fa48("1820"), 'Product not found'),
                  data: null
                });
              }
            }
            throw new Error(stryMutAct_9fa48("1821") ? `` : (stryCov_9fa48("1821"), `Failed to fetch product: ${response.status}`));
          }
        }
        const data = await response.json();
        return stryMutAct_9fa48("1822") ? {} : (stryCov_9fa48("1822"), {
          success: stryMutAct_9fa48("1823") ? false : (stryCov_9fa48("1823"), true),
          data: stryMutAct_9fa48("1826") ? data.data && data : stryMutAct_9fa48("1825") ? false : stryMutAct_9fa48("1824") ? true : (stryCov_9fa48("1824", "1825", "1826"), data.data || data)
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("1827")) {
        {}
      } else {
        stryCov_9fa48("1827");
        console.error(stryMutAct_9fa48("1828") ? "" : (stryCov_9fa48("1828"), 'Error fetching product:'), error);
        return stryMutAct_9fa48("1829") ? {} : (stryCov_9fa48("1829"), {
          success: stryMutAct_9fa48("1830") ? true : (stryCov_9fa48("1830"), false),
          error: stryMutAct_9fa48("1831") ? "" : (stryCov_9fa48("1831"), 'Failed to load product. Please try again.'),
          data: null
        });
      }
    }
  }
}

/**
 * Search products with enhanced server-side processing
 */
export async function searchProducts(searchParams: ProductSearchParams) {
  if (stryMutAct_9fa48("1832")) {
    {}
  } else {
    stryCov_9fa48("1832");
    try {
      if (stryMutAct_9fa48("1833")) {
        {}
      } else {
        stryCov_9fa48("1833");
        const results = await getProducts(searchParams);

        // Revalidate search cache
        revalidateTag(stryMutAct_9fa48("1834") ? "" : (stryCov_9fa48("1834"), 'search'));
        return results;
      }
    } catch (error) {
      if (stryMutAct_9fa48("1835")) {
        {}
      } else {
        stryCov_9fa48("1835");
        console.error(stryMutAct_9fa48("1836") ? "" : (stryCov_9fa48("1836"), 'Error searching products:'), error);
        return stryMutAct_9fa48("1837") ? {} : (stryCov_9fa48("1837"), {
          success: stryMutAct_9fa48("1838") ? true : (stryCov_9fa48("1838"), false),
          error: stryMutAct_9fa48("1839") ? "" : (stryCov_9fa48("1839"), 'Search failed. Please try again.'),
          data: stryMutAct_9fa48("1840") ? ["Stryker was here"] : (stryCov_9fa48("1840"), [])
        });
      }
    }
  }
}

// ==============================================================================
// RECOMMENDATION ACTIONS
// ==============================================================================

/**
 * Get AI recommendations with authentication check
 */
export async function getRecommendations(params: {
  limit?: number;
  category?: string;
  budget_min?: number;
  budget_max?: number;
} = {}) {
  if (stryMutAct_9fa48("1841")) {
    {}
  } else {
    stryCov_9fa48("1841");
    try {
      if (stryMutAct_9fa48("1842")) {
        {}
      } else {
        stryCov_9fa48("1842");
        // Get authentication token from cookies
        const cookieStore = cookies();
        const token = stryMutAct_9fa48("1843") ? cookieStore.get('access_token').value : (stryCov_9fa48("1843"), cookieStore.get(stryMutAct_9fa48("1844") ? "" : (stryCov_9fa48("1844"), 'access_token'))?.value);
        if (stryMutAct_9fa48("1847") ? false : stryMutAct_9fa48("1846") ? true : stryMutAct_9fa48("1845") ? token : (stryCov_9fa48("1845", "1846", "1847"), !token)) {
          if (stryMutAct_9fa48("1848")) {
            {}
          } else {
            stryCov_9fa48("1848");
            return stryMutAct_9fa48("1849") ? {} : (stryCov_9fa48("1849"), {
              success: stryMutAct_9fa48("1850") ? true : (stryCov_9fa48("1850"), false),
              error: stryMutAct_9fa48("1851") ? "" : (stryCov_9fa48("1851"), 'Authentication required for recommendations'),
              data: stryMutAct_9fa48("1852") ? ["Stryker was here"] : (stryCov_9fa48("1852"), [])
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("1853") ? `` : (stryCov_9fa48("1853"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/recommendations/`), stryMutAct_9fa48("1854") ? {} : (stryCov_9fa48("1854"), {
          method: stryMutAct_9fa48("1855") ? "" : (stryCov_9fa48("1855"), 'POST'),
          headers: stryMutAct_9fa48("1856") ? {} : (stryCov_9fa48("1856"), {
            'Content-Type': stryMutAct_9fa48("1857") ? "" : (stryCov_9fa48("1857"), 'application/json'),
            'Authorization': stryMutAct_9fa48("1858") ? `` : (stryCov_9fa48("1858"), `Bearer ${token}`)
          }),
          body: JSON.stringify(params),
          next: stryMutAct_9fa48("1859") ? {} : (stryCov_9fa48("1859"), {
            revalidate: 300,
            // Cache for 5 minutes
            tags: stryMutAct_9fa48("1860") ? [] : (stryCov_9fa48("1860"), [stryMutAct_9fa48("1861") ? "" : (stryCov_9fa48("1861"), 'recommendations'), stryMutAct_9fa48("1862") ? `` : (stryCov_9fa48("1862"), `recommendations-${stryMutAct_9fa48("1863") ? token : (stryCov_9fa48("1863"), token.slice(stryMutAct_9fa48("1864") ? +8 : (stryCov_9fa48("1864"), -8)))}`)])
          })
        }));
        if (stryMutAct_9fa48("1867") ? false : stryMutAct_9fa48("1866") ? true : stryMutAct_9fa48("1865") ? response.ok : (stryCov_9fa48("1865", "1866", "1867"), !response.ok)) {
          if (stryMutAct_9fa48("1868")) {
            {}
          } else {
            stryCov_9fa48("1868");
            throw new Error(stryMutAct_9fa48("1869") ? `` : (stryCov_9fa48("1869"), `Failed to fetch recommendations: ${response.status}`));
          }
        }
        const data = await response.json();
        return stryMutAct_9fa48("1870") ? {} : (stryCov_9fa48("1870"), {
          success: stryMutAct_9fa48("1871") ? false : (stryCov_9fa48("1871"), true),
          data: stryMutAct_9fa48("1874") ? data.data && data : stryMutAct_9fa48("1873") ? false : stryMutAct_9fa48("1872") ? true : (stryCov_9fa48("1872", "1873", "1874"), data.data || data)
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("1875")) {
        {}
      } else {
        stryCov_9fa48("1875");
        console.error(stryMutAct_9fa48("1876") ? "" : (stryCov_9fa48("1876"), 'Error fetching recommendations:'), error);
        return stryMutAct_9fa48("1877") ? {} : (stryCov_9fa48("1877"), {
          success: stryMutAct_9fa48("1878") ? true : (stryCov_9fa48("1878"), false),
          error: stryMutAct_9fa48("1879") ? "" : (stryCov_9fa48("1879"), 'Failed to load recommendations. Please try again.'),
          data: stryMutAct_9fa48("1880") ? ["Stryker was here"] : (stryCov_9fa48("1880"), [])
        });
      }
    }
  }
}

// ==============================================================================
// USER INTERACTION ACTIONS
// ==============================================================================

/**
 * Record user swipe preference
 */
export async function recordSwipe(swipeData: SwipeData) {
  if (stryMutAct_9fa48("1881")) {
    {}
  } else {
    stryCov_9fa48("1881");
    try {
      if (stryMutAct_9fa48("1882")) {
        {}
      } else {
        stryCov_9fa48("1882");
        // Get authentication token from cookies
        const cookieStore = cookies();
        const token = stryMutAct_9fa48("1883") ? cookieStore.get('access_token').value : (stryCov_9fa48("1883"), cookieStore.get(stryMutAct_9fa48("1884") ? "" : (stryCov_9fa48("1884"), 'access_token'))?.value);
        if (stryMutAct_9fa48("1887") ? false : stryMutAct_9fa48("1886") ? true : stryMutAct_9fa48("1885") ? token : (stryCov_9fa48("1885", "1886", "1887"), !token)) {
          if (stryMutAct_9fa48("1888")) {
            {}
          } else {
            stryCov_9fa48("1888");
            return stryMutAct_9fa48("1889") ? {} : (stryCov_9fa48("1889"), {
              success: stryMutAct_9fa48("1890") ? true : (stryCov_9fa48("1890"), false),
              error: stryMutAct_9fa48("1891") ? "" : (stryCov_9fa48("1891"), 'Authentication required to save preferences')
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("1892") ? `` : (stryCov_9fa48("1892"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/swipes/`), stryMutAct_9fa48("1893") ? {} : (stryCov_9fa48("1893"), {
          method: stryMutAct_9fa48("1894") ? "" : (stryCov_9fa48("1894"), 'POST'),
          headers: stryMutAct_9fa48("1895") ? {} : (stryCov_9fa48("1895"), {
            'Content-Type': stryMutAct_9fa48("1896") ? "" : (stryCov_9fa48("1896"), 'application/json'),
            'Authorization': stryMutAct_9fa48("1897") ? `` : (stryCov_9fa48("1897"), `Bearer ${token}`)
          }),
          body: JSON.stringify(stryMutAct_9fa48("1898") ? {} : (stryCov_9fa48("1898"), {
            product_id: swipeData.productId,
            direction: swipeData.direction,
            session_type: stryMutAct_9fa48("1901") ? swipeData.sessionType && 'discovery' : stryMutAct_9fa48("1900") ? false : stryMutAct_9fa48("1899") ? true : (stryCov_9fa48("1899", "1900", "1901"), swipeData.sessionType || (stryMutAct_9fa48("1902") ? "" : (stryCov_9fa48("1902"), 'discovery'))),
            timestamp: stryMutAct_9fa48("1905") ? swipeData.timestamp && new Date() : stryMutAct_9fa48("1904") ? false : stryMutAct_9fa48("1903") ? true : (stryCov_9fa48("1903", "1904", "1905"), swipeData.timestamp || new Date())
          }))
        }));
        if (stryMutAct_9fa48("1908") ? false : stryMutAct_9fa48("1907") ? true : stryMutAct_9fa48("1906") ? response.ok : (stryCov_9fa48("1906", "1907", "1908"), !response.ok)) {
          if (stryMutAct_9fa48("1909")) {
            {}
          } else {
            stryCov_9fa48("1909");
            throw new Error(stryMutAct_9fa48("1910") ? `` : (stryCov_9fa48("1910"), `Failed to record swipe: ${response.status}`));
          }
        }

        // Revalidate recommendations cache as preferences have changed
        revalidateTag(stryMutAct_9fa48("1911") ? "" : (stryCov_9fa48("1911"), 'recommendations'));
        return stryMutAct_9fa48("1912") ? {} : (stryCov_9fa48("1912"), {
          success: stryMutAct_9fa48("1913") ? false : (stryCov_9fa48("1913"), true)
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("1914")) {
        {}
      } else {
        stryCov_9fa48("1914");
        console.error(stryMutAct_9fa48("1915") ? "" : (stryCov_9fa48("1915"), 'Error recording swipe:'), error);
        return stryMutAct_9fa48("1916") ? {} : (stryCov_9fa48("1916"), {
          success: stryMutAct_9fa48("1917") ? true : (stryCov_9fa48("1917"), false),
          error: stryMutAct_9fa48("1918") ? "" : (stryCov_9fa48("1918"), 'Failed to save preference. Please try again.')
        });
      }
    }
  }
}

// ==============================================================================
// WISHLIST ACTIONS
// ==============================================================================

/**
 * Toggle wishlist item
 */
export async function toggleWishlistAction(productId: string) {
  if (stryMutAct_9fa48("1919")) {
    {}
  } else {
    stryCov_9fa48("1919");
    try {
      if (stryMutAct_9fa48("1920")) {
        {}
      } else {
        stryCov_9fa48("1920");
        // Get authentication token from cookies
        const cookieStore = cookies();
        const token = stryMutAct_9fa48("1921") ? cookieStore.get('access_token').value : (stryCov_9fa48("1921"), cookieStore.get(stryMutAct_9fa48("1922") ? "" : (stryCov_9fa48("1922"), 'access_token'))?.value);
        if (stryMutAct_9fa48("1925") ? false : stryMutAct_9fa48("1924") ? true : stryMutAct_9fa48("1923") ? token : (stryCov_9fa48("1923", "1924", "1925"), !token)) {
          if (stryMutAct_9fa48("1926")) {
            {}
          } else {
            stryCov_9fa48("1926");
            return stryMutAct_9fa48("1927") ? {} : (stryCov_9fa48("1927"), {
              success: stryMutAct_9fa48("1928") ? true : (stryCov_9fa48("1928"), false),
              error: stryMutAct_9fa48("1929") ? "" : (stryCov_9fa48("1929"), 'Please sign in to save items to wishlist')
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("1930") ? `` : (stryCov_9fa48("1930"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlist/${productId}`), stryMutAct_9fa48("1931") ? {} : (stryCov_9fa48("1931"), {
          method: stryMutAct_9fa48("1932") ? "" : (stryCov_9fa48("1932"), 'POST'),
          headers: stryMutAct_9fa48("1933") ? {} : (stryCov_9fa48("1933"), {
            'Authorization': stryMutAct_9fa48("1934") ? `` : (stryCov_9fa48("1934"), `Bearer ${token}`)
          })
        }));
        if (stryMutAct_9fa48("1937") ? false : stryMutAct_9fa48("1936") ? true : stryMutAct_9fa48("1935") ? response.ok : (stryCov_9fa48("1935", "1936", "1937"), !response.ok)) {
          if (stryMutAct_9fa48("1938")) {
            {}
          } else {
            stryCov_9fa48("1938");
            throw new Error(stryMutAct_9fa48("1939") ? `` : (stryCov_9fa48("1939"), `Failed to update wishlist: ${response.status}`));
          }
        }
        const data = await response.json();

        // Revalidate wishlist cache
        revalidateTag(stryMutAct_9fa48("1940") ? "" : (stryCov_9fa48("1940"), 'wishlist'));
        revalidatePath(stryMutAct_9fa48("1941") ? "" : (stryCov_9fa48("1941"), '/wishlist'));
        return stryMutAct_9fa48("1942") ? {} : (stryCov_9fa48("1942"), {
          success: stryMutAct_9fa48("1943") ? false : (stryCov_9fa48("1943"), true),
          added: data.added,
          message: data.added ? stryMutAct_9fa48("1944") ? "" : (stryCov_9fa48("1944"), 'Added to wishlist!') : stryMutAct_9fa48("1945") ? "" : (stryCov_9fa48("1945"), 'Removed from wishlist!')
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("1946")) {
        {}
      } else {
        stryCov_9fa48("1946");
        console.error(stryMutAct_9fa48("1947") ? "" : (stryCov_9fa48("1947"), 'Error updating wishlist:'), error);
        return stryMutAct_9fa48("1948") ? {} : (stryCov_9fa48("1948"), {
          success: stryMutAct_9fa48("1949") ? true : (stryCov_9fa48("1949"), false),
          error: stryMutAct_9fa48("1950") ? "" : (stryCov_9fa48("1950"), 'Failed to update wishlist. Please try again.')
        });
      }
    }
  }
}

// ==============================================================================
// CACHE MANAGEMENT
// ==============================================================================

/**
 * Refresh product data cache
 */
export async function refreshProductCache() {
  if (stryMutAct_9fa48("1951")) {
    {}
  } else {
    stryCov_9fa48("1951");
    try {
      if (stryMutAct_9fa48("1952")) {
        {}
      } else {
        stryCov_9fa48("1952");
        revalidateTag(stryMutAct_9fa48("1953") ? "" : (stryCov_9fa48("1953"), 'products'));
        revalidateTag(stryMutAct_9fa48("1954") ? "" : (stryCov_9fa48("1954"), 'recommendations'));
        revalidatePath(stryMutAct_9fa48("1955") ? "" : (stryCov_9fa48("1955"), '/discover'));
        revalidatePath(stryMutAct_9fa48("1956") ? "" : (stryCov_9fa48("1956"), '/search'));
        return stryMutAct_9fa48("1957") ? {} : (stryCov_9fa48("1957"), {
          success: stryMutAct_9fa48("1958") ? false : (stryCov_9fa48("1958"), true),
          message: stryMutAct_9fa48("1959") ? "" : (stryCov_9fa48("1959"), 'Cache refreshed successfully!')
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("1960")) {
        {}
      } else {
        stryCov_9fa48("1960");
        console.error(stryMutAct_9fa48("1961") ? "" : (stryCov_9fa48("1961"), 'Error refreshing cache:'), error);
        return stryMutAct_9fa48("1962") ? {} : (stryCov_9fa48("1962"), {
          success: stryMutAct_9fa48("1963") ? true : (stryCov_9fa48("1963"), false),
          error: stryMutAct_9fa48("1964") ? "" : (stryCov_9fa48("1964"), 'Failed to refresh cache. Please try again.')
        });
      }
    }
  }
}