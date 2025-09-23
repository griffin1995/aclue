/**
 * Wishlist Server Actions
 *
 * Server-side actions for wishlist operations in the Amazon affiliate model:
 * - Wishlist CRUD operations
 * - Adding/removing products from wishlists
 * - Wishlist sharing and social features
 * - Amazon affiliate link generation
 * - Price tracking and notifications
 *
 * These actions run on the server and provide:
 * - Type safety with TypeScript
 * - Authentication handling
 * - API integration with backend
 * - Error handling and validation
 * - Performance optimisation with caching
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
import { generateAffiliateLink } from '@/lib/affiliate';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  share_token?: string;
  created_at: Date;
  updated_at: Date;
  product_count: number;
}
interface WishlistProduct {
  id: string;
  wishlist_id: string;
  product_id: string;
  added_at: Date;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  price_when_added?: number;
}
interface CreateWishlistData {
  name: string;
  description?: string;
  is_public?: boolean;
}
interface UpdateWishlistData {
  wishlistId: string;
  name?: string;
  description?: string;
  is_public?: boolean;
}
interface AddToWishlistData {
  wishlistId: string;
  productId: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

// ==============================================================================
// HELPER FUNCTIONS
// ==============================================================================

/**
 * Get authentication token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  if (stryMutAct_9fa48("1965")) {
    {}
  } else {
    stryCov_9fa48("1965");
    try {
      if (stryMutAct_9fa48("1966")) {
        {}
      } else {
        stryCov_9fa48("1966");
        const cookieStore = cookies();
        return stryMutAct_9fa48("1969") ? cookieStore.get('access_token')?.value && null : stryMutAct_9fa48("1968") ? false : stryMutAct_9fa48("1967") ? true : (stryCov_9fa48("1967", "1968", "1969"), (stryMutAct_9fa48("1970") ? cookieStore.get('access_token').value : (stryCov_9fa48("1970"), cookieStore.get(stryMutAct_9fa48("1971") ? "" : (stryCov_9fa48("1971"), 'access_token'))?.value)) || null);
      }
    } catch (error) {
      if (stryMutAct_9fa48("1972")) {
        {}
      } else {
        stryCov_9fa48("1972");
        console.error(stryMutAct_9fa48("1973") ? "" : (stryCov_9fa48("1973"), 'Error getting auth token:'), error);
        return null;
      }
    }
  }
}

/**
 * Generate unique share token for wishlist
 */
function generateShareToken(): string {
  if (stryMutAct_9fa48("1974")) {
    {}
  } else {
    stryCov_9fa48("1974");
    return stryMutAct_9fa48("1975") ? Math.random().toString(36).substring(2, 15) - Math.random().toString(36).substring(2, 15) : (stryCov_9fa48("1975"), (stryMutAct_9fa48("1976") ? Math.random().toString(36) : (stryCov_9fa48("1976"), Math.random().toString(36).substring(2, 15))) + (stryMutAct_9fa48("1977") ? Math.random().toString(36) : (stryCov_9fa48("1977"), Math.random().toString(36).substring(2, 15))));
  }
}

// ==============================================================================
// WISHLIST CRUD ACTIONS
// ==============================================================================

/**
 * Create new wishlist
 */
export async function createWishlistAction(data: CreateWishlistData) {
  if (stryMutAct_9fa48("1978")) {
    {}
  } else {
    stryCov_9fa48("1978");
    try {
      if (stryMutAct_9fa48("1979")) {
        {}
      } else {
        stryCov_9fa48("1979");
        const token = await getAuthToken();
        if (stryMutAct_9fa48("1982") ? false : stryMutAct_9fa48("1981") ? true : stryMutAct_9fa48("1980") ? token : (stryCov_9fa48("1980", "1981", "1982"), !token)) {
          if (stryMutAct_9fa48("1983")) {
            {}
          } else {
            stryCov_9fa48("1983");
            return stryMutAct_9fa48("1984") ? {} : (stryCov_9fa48("1984"), {
              success: stryMutAct_9fa48("1985") ? true : (stryCov_9fa48("1985"), false),
              error: stryMutAct_9fa48("1986") ? "" : (stryCov_9fa48("1986"), 'Please sign in to create wishlists')
            });
          }
        }

        // Validate input
        if (stryMutAct_9fa48("1989") ? !data.name && data.name.trim().length === 0 : stryMutAct_9fa48("1988") ? false : stryMutAct_9fa48("1987") ? true : (stryCov_9fa48("1987", "1988", "1989"), (stryMutAct_9fa48("1990") ? data.name : (stryCov_9fa48("1990"), !data.name)) || (stryMutAct_9fa48("1992") ? data.name.trim().length !== 0 : stryMutAct_9fa48("1991") ? false : (stryCov_9fa48("1991", "1992"), (stryMutAct_9fa48("1993") ? data.name.length : (stryCov_9fa48("1993"), data.name.trim().length)) === 0)))) {
          if (stryMutAct_9fa48("1994")) {
            {}
          } else {
            stryCov_9fa48("1994");
            return stryMutAct_9fa48("1995") ? {} : (stryCov_9fa48("1995"), {
              success: stryMutAct_9fa48("1996") ? true : (stryCov_9fa48("1996"), false),
              error: stryMutAct_9fa48("1997") ? "" : (stryCov_9fa48("1997"), 'Wishlist name is required')
            });
          }
        }
        if (stryMutAct_9fa48("2001") ? data.name.length <= 100 : stryMutAct_9fa48("2000") ? data.name.length >= 100 : stryMutAct_9fa48("1999") ? false : stryMutAct_9fa48("1998") ? true : (stryCov_9fa48("1998", "1999", "2000", "2001"), data.name.length > 100)) {
          if (stryMutAct_9fa48("2002")) {
            {}
          } else {
            stryCov_9fa48("2002");
            return stryMutAct_9fa48("2003") ? {} : (stryCov_9fa48("2003"), {
              success: stryMutAct_9fa48("2004") ? true : (stryCov_9fa48("2004"), false),
              error: stryMutAct_9fa48("2005") ? "" : (stryCov_9fa48("2005"), 'Wishlist name must be 100 characters or less')
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("2006") ? `` : (stryCov_9fa48("2006"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/`), stryMutAct_9fa48("2007") ? {} : (stryCov_9fa48("2007"), {
          method: stryMutAct_9fa48("2008") ? "" : (stryCov_9fa48("2008"), 'POST'),
          headers: stryMutAct_9fa48("2009") ? {} : (stryCov_9fa48("2009"), {
            'Content-Type': stryMutAct_9fa48("2010") ? "" : (stryCov_9fa48("2010"), 'application/json'),
            'Authorization': stryMutAct_9fa48("2011") ? `` : (stryCov_9fa48("2011"), `Bearer ${token}`)
          }),
          body: JSON.stringify(stryMutAct_9fa48("2012") ? {} : (stryCov_9fa48("2012"), {
            name: stryMutAct_9fa48("2013") ? data.name : (stryCov_9fa48("2013"), data.name.trim()),
            description: stryMutAct_9fa48("2016") ? data.description?.trim() && null : stryMutAct_9fa48("2015") ? false : stryMutAct_9fa48("2014") ? true : (stryCov_9fa48("2014", "2015", "2016"), (stryMutAct_9fa48("2018") ? data.description.trim() : stryMutAct_9fa48("2017") ? data.description : (stryCov_9fa48("2017", "2018"), data.description?.trim())) || null),
            is_public: stryMutAct_9fa48("2021") ? data.is_public && false : stryMutAct_9fa48("2020") ? false : stryMutAct_9fa48("2019") ? true : (stryCov_9fa48("2019", "2020", "2021"), data.is_public || (stryMutAct_9fa48("2022") ? true : (stryCov_9fa48("2022"), false)))
          }))
        }));
        if (stryMutAct_9fa48("2025") ? false : stryMutAct_9fa48("2024") ? true : stryMutAct_9fa48("2023") ? response.ok : (stryCov_9fa48("2023", "2024", "2025"), !response.ok)) {
          if (stryMutAct_9fa48("2026")) {
            {}
          } else {
            stryCov_9fa48("2026");
            throw new Error(stryMutAct_9fa48("2027") ? `` : (stryCov_9fa48("2027"), `Failed to create wishlist: ${response.status}`));
          }
        }
        const wishlist = await response.json();

        // Revalidate caches
        revalidateTag(stryMutAct_9fa48("2028") ? "" : (stryCov_9fa48("2028"), 'wishlists'));
        revalidatePath(stryMutAct_9fa48("2029") ? "" : (stryCov_9fa48("2029"), '/wishlists'));
        return stryMutAct_9fa48("2030") ? {} : (stryCov_9fa48("2030"), {
          success: stryMutAct_9fa48("2031") ? false : (stryCov_9fa48("2031"), true),
          data: wishlist,
          message: stryMutAct_9fa48("2032") ? "" : (stryCov_9fa48("2032"), 'Wishlist created successfully!')
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2033")) {
        {}
      } else {
        stryCov_9fa48("2033");
        console.error(stryMutAct_9fa48("2034") ? "" : (stryCov_9fa48("2034"), 'Error creating wishlist:'), error);
        return stryMutAct_9fa48("2035") ? {} : (stryCov_9fa48("2035"), {
          success: stryMutAct_9fa48("2036") ? true : (stryCov_9fa48("2036"), false),
          error: stryMutAct_9fa48("2037") ? "" : (stryCov_9fa48("2037"), 'Failed to create wishlist. Please try again.')
        });
      }
    }
  }
}

/**
 * Get all user wishlists
 */
export async function getUserWishlistsAction() {
  if (stryMutAct_9fa48("2038")) {
    {}
  } else {
    stryCov_9fa48("2038");
    try {
      if (stryMutAct_9fa48("2039")) {
        {}
      } else {
        stryCov_9fa48("2039");
        const token = await getAuthToken();
        if (stryMutAct_9fa48("2042") ? false : stryMutAct_9fa48("2041") ? true : stryMutAct_9fa48("2040") ? token : (stryCov_9fa48("2040", "2041", "2042"), !token)) {
          if (stryMutAct_9fa48("2043")) {
            {}
          } else {
            stryCov_9fa48("2043");
            return stryMutAct_9fa48("2044") ? {} : (stryCov_9fa48("2044"), {
              success: stryMutAct_9fa48("2045") ? true : (stryCov_9fa48("2045"), false),
              error: stryMutAct_9fa48("2046") ? "" : (stryCov_9fa48("2046"), 'Authentication required'),
              data: stryMutAct_9fa48("2047") ? ["Stryker was here"] : (stryCov_9fa48("2047"), [])
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("2048") ? `` : (stryCov_9fa48("2048"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/`), stryMutAct_9fa48("2049") ? {} : (stryCov_9fa48("2049"), {
          headers: stryMutAct_9fa48("2050") ? {} : (stryCov_9fa48("2050"), {
            'Authorization': stryMutAct_9fa48("2051") ? `` : (stryCov_9fa48("2051"), `Bearer ${token}`)
          }),
          next: stryMutAct_9fa48("2052") ? {} : (stryCov_9fa48("2052"), {
            revalidate: 300,
            // Cache for 5 minutes
            tags: stryMutAct_9fa48("2053") ? [] : (stryCov_9fa48("2053"), [stryMutAct_9fa48("2054") ? "" : (stryCov_9fa48("2054"), 'wishlists'), stryMutAct_9fa48("2055") ? `` : (stryCov_9fa48("2055"), `wishlists-user`)])
          })
        }));
        if (stryMutAct_9fa48("2058") ? false : stryMutAct_9fa48("2057") ? true : stryMutAct_9fa48("2056") ? response.ok : (stryCov_9fa48("2056", "2057", "2058"), !response.ok)) {
          if (stryMutAct_9fa48("2059")) {
            {}
          } else {
            stryCov_9fa48("2059");
            throw new Error(stryMutAct_9fa48("2060") ? `` : (stryCov_9fa48("2060"), `Failed to fetch wishlists: ${response.status}`));
          }
        }
        const data = await response.json();
        return stryMutAct_9fa48("2061") ? {} : (stryCov_9fa48("2061"), {
          success: stryMutAct_9fa48("2062") ? false : (stryCov_9fa48("2062"), true),
          data: stryMutAct_9fa48("2065") ? data.data && data : stryMutAct_9fa48("2064") ? false : stryMutAct_9fa48("2063") ? true : (stryCov_9fa48("2063", "2064", "2065"), data.data || data)
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2066")) {
        {}
      } else {
        stryCov_9fa48("2066");
        console.error(stryMutAct_9fa48("2067") ? "" : (stryCov_9fa48("2067"), 'Error fetching wishlists:'), error);
        return stryMutAct_9fa48("2068") ? {} : (stryCov_9fa48("2068"), {
          success: stryMutAct_9fa48("2069") ? true : (stryCov_9fa48("2069"), false),
          error: stryMutAct_9fa48("2070") ? "" : (stryCov_9fa48("2070"), 'Failed to load wishlists. Please try again.'),
          data: stryMutAct_9fa48("2071") ? ["Stryker was here"] : (stryCov_9fa48("2071"), [])
        });
      }
    }
  }
}

/**
 * Get single wishlist by ID
 */
export async function getWishlistByIdAction(wishlistId: string) {
  if (stryMutAct_9fa48("2072")) {
    {}
  } else {
    stryCov_9fa48("2072");
    try {
      if (stryMutAct_9fa48("2073")) {
        {}
      } else {
        stryCov_9fa48("2073");
        const token = await getAuthToken();
        if (stryMutAct_9fa48("2076") ? false : stryMutAct_9fa48("2075") ? true : stryMutAct_9fa48("2074") ? token : (stryCov_9fa48("2074", "2075", "2076"), !token)) {
          if (stryMutAct_9fa48("2077")) {
            {}
          } else {
            stryCov_9fa48("2077");
            return stryMutAct_9fa48("2078") ? {} : (stryCov_9fa48("2078"), {
              success: stryMutAct_9fa48("2079") ? true : (stryCov_9fa48("2079"), false),
              error: stryMutAct_9fa48("2080") ? "" : (stryCov_9fa48("2080"), 'Authentication required'),
              data: null
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("2081") ? `` : (stryCov_9fa48("2081"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}`), stryMutAct_9fa48("2082") ? {} : (stryCov_9fa48("2082"), {
          headers: stryMutAct_9fa48("2083") ? {} : (stryCov_9fa48("2083"), {
            'Authorization': stryMutAct_9fa48("2084") ? `` : (stryCov_9fa48("2084"), `Bearer ${token}`)
          }),
          next: stryMutAct_9fa48("2085") ? {} : (stryCov_9fa48("2085"), {
            revalidate: 300,
            // Cache for 5 minutes
            tags: stryMutAct_9fa48("2086") ? [] : (stryCov_9fa48("2086"), [stryMutAct_9fa48("2087") ? "" : (stryCov_9fa48("2087"), 'wishlists'), stryMutAct_9fa48("2088") ? `` : (stryCov_9fa48("2088"), `wishlist-${wishlistId}`)])
          })
        }));
        if (stryMutAct_9fa48("2091") ? false : stryMutAct_9fa48("2090") ? true : stryMutAct_9fa48("2089") ? response.ok : (stryCov_9fa48("2089", "2090", "2091"), !response.ok)) {
          if (stryMutAct_9fa48("2092")) {
            {}
          } else {
            stryCov_9fa48("2092");
            if (stryMutAct_9fa48("2095") ? response.status !== 404 : stryMutAct_9fa48("2094") ? false : stryMutAct_9fa48("2093") ? true : (stryCov_9fa48("2093", "2094", "2095"), response.status === 404)) {
              if (stryMutAct_9fa48("2096")) {
                {}
              } else {
                stryCov_9fa48("2096");
                return stryMutAct_9fa48("2097") ? {} : (stryCov_9fa48("2097"), {
                  success: stryMutAct_9fa48("2098") ? true : (stryCov_9fa48("2098"), false),
                  error: stryMutAct_9fa48("2099") ? "" : (stryCov_9fa48("2099"), 'Wishlist not found'),
                  data: null
                });
              }
            }
            throw new Error(stryMutAct_9fa48("2100") ? `` : (stryCov_9fa48("2100"), `Failed to fetch wishlist: ${response.status}`));
          }
        }
        const data = await response.json();
        return stryMutAct_9fa48("2101") ? {} : (stryCov_9fa48("2101"), {
          success: stryMutAct_9fa48("2102") ? false : (stryCov_9fa48("2102"), true),
          data: stryMutAct_9fa48("2105") ? data.data && data : stryMutAct_9fa48("2104") ? false : stryMutAct_9fa48("2103") ? true : (stryCov_9fa48("2103", "2104", "2105"), data.data || data)
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2106")) {
        {}
      } else {
        stryCov_9fa48("2106");
        console.error(stryMutAct_9fa48("2107") ? "" : (stryCov_9fa48("2107"), 'Error fetching wishlist:'), error);
        return stryMutAct_9fa48("2108") ? {} : (stryCov_9fa48("2108"), {
          success: stryMutAct_9fa48("2109") ? true : (stryCov_9fa48("2109"), false),
          error: stryMutAct_9fa48("2110") ? "" : (stryCov_9fa48("2110"), 'Failed to load wishlist. Please try again.'),
          data: null
        });
      }
    }
  }
}

/**
 * Update wishlist details
 */
export async function updateWishlistAction(data: UpdateWishlistData) {
  if (stryMutAct_9fa48("2111")) {
    {}
  } else {
    stryCov_9fa48("2111");
    try {
      if (stryMutAct_9fa48("2112")) {
        {}
      } else {
        stryCov_9fa48("2112");
        const token = await getAuthToken();
        if (stryMutAct_9fa48("2115") ? false : stryMutAct_9fa48("2114") ? true : stryMutAct_9fa48("2113") ? token : (stryCov_9fa48("2113", "2114", "2115"), !token)) {
          if (stryMutAct_9fa48("2116")) {
            {}
          } else {
            stryCov_9fa48("2116");
            return stryMutAct_9fa48("2117") ? {} : (stryCov_9fa48("2117"), {
              success: stryMutAct_9fa48("2118") ? true : (stryCov_9fa48("2118"), false),
              error: stryMutAct_9fa48("2119") ? "" : (stryCov_9fa48("2119"), 'Please sign in to update wishlists')
            });
          }
        }

        // Validate input
        if (stryMutAct_9fa48("2122") ? data.name !== undefined || !data.name || data.name.trim().length === 0 : stryMutAct_9fa48("2121") ? false : stryMutAct_9fa48("2120") ? true : (stryCov_9fa48("2120", "2121", "2122"), (stryMutAct_9fa48("2124") ? data.name === undefined : stryMutAct_9fa48("2123") ? true : (stryCov_9fa48("2123", "2124"), data.name !== undefined)) && (stryMutAct_9fa48("2126") ? !data.name && data.name.trim().length === 0 : stryMutAct_9fa48("2125") ? true : (stryCov_9fa48("2125", "2126"), (stryMutAct_9fa48("2127") ? data.name : (stryCov_9fa48("2127"), !data.name)) || (stryMutAct_9fa48("2129") ? data.name.trim().length !== 0 : stryMutAct_9fa48("2128") ? false : (stryCov_9fa48("2128", "2129"), (stryMutAct_9fa48("2130") ? data.name.length : (stryCov_9fa48("2130"), data.name.trim().length)) === 0)))))) {
          if (stryMutAct_9fa48("2131")) {
            {}
          } else {
            stryCov_9fa48("2131");
            return stryMutAct_9fa48("2132") ? {} : (stryCov_9fa48("2132"), {
              success: stryMutAct_9fa48("2133") ? true : (stryCov_9fa48("2133"), false),
              error: stryMutAct_9fa48("2134") ? "" : (stryCov_9fa48("2134"), 'Wishlist name is required')
            });
          }
        }
        if (stryMutAct_9fa48("2137") ? data.name || data.name.length > 100 : stryMutAct_9fa48("2136") ? false : stryMutAct_9fa48("2135") ? true : (stryCov_9fa48("2135", "2136", "2137"), data.name && (stryMutAct_9fa48("2140") ? data.name.length <= 100 : stryMutAct_9fa48("2139") ? data.name.length >= 100 : stryMutAct_9fa48("2138") ? true : (stryCov_9fa48("2138", "2139", "2140"), data.name.length > 100)))) {
          if (stryMutAct_9fa48("2141")) {
            {}
          } else {
            stryCov_9fa48("2141");
            return stryMutAct_9fa48("2142") ? {} : (stryCov_9fa48("2142"), {
              success: stryMutAct_9fa48("2143") ? true : (stryCov_9fa48("2143"), false),
              error: stryMutAct_9fa48("2144") ? "" : (stryCov_9fa48("2144"), 'Wishlist name must be 100 characters or less')
            });
          }
        }
        const updateData: any = {};
        if (stryMutAct_9fa48("2147") ? data.name === undefined : stryMutAct_9fa48("2146") ? false : stryMutAct_9fa48("2145") ? true : (stryCov_9fa48("2145", "2146", "2147"), data.name !== undefined)) updateData.name = stryMutAct_9fa48("2148") ? data.name : (stryCov_9fa48("2148"), data.name.trim());
        if (stryMutAct_9fa48("2151") ? data.description === undefined : stryMutAct_9fa48("2150") ? false : stryMutAct_9fa48("2149") ? true : (stryCov_9fa48("2149", "2150", "2151"), data.description !== undefined)) updateData.description = stryMutAct_9fa48("2154") ? data.description?.trim() && null : stryMutAct_9fa48("2153") ? false : stryMutAct_9fa48("2152") ? true : (stryCov_9fa48("2152", "2153", "2154"), (stryMutAct_9fa48("2156") ? data.description.trim() : stryMutAct_9fa48("2155") ? data.description : (stryCov_9fa48("2155", "2156"), data.description?.trim())) || null);
        if (stryMutAct_9fa48("2159") ? data.is_public === undefined : stryMutAct_9fa48("2158") ? false : stryMutAct_9fa48("2157") ? true : (stryCov_9fa48("2157", "2158", "2159"), data.is_public !== undefined)) updateData.is_public = data.is_public;
        const response = await fetch(stryMutAct_9fa48("2160") ? `` : (stryCov_9fa48("2160"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${data.wishlistId}`), stryMutAct_9fa48("2161") ? {} : (stryCov_9fa48("2161"), {
          method: stryMutAct_9fa48("2162") ? "" : (stryCov_9fa48("2162"), 'PUT'),
          headers: stryMutAct_9fa48("2163") ? {} : (stryCov_9fa48("2163"), {
            'Content-Type': stryMutAct_9fa48("2164") ? "" : (stryCov_9fa48("2164"), 'application/json'),
            'Authorization': stryMutAct_9fa48("2165") ? `` : (stryCov_9fa48("2165"), `Bearer ${token}`)
          }),
          body: JSON.stringify(updateData)
        }));
        if (stryMutAct_9fa48("2168") ? false : stryMutAct_9fa48("2167") ? true : stryMutAct_9fa48("2166") ? response.ok : (stryCov_9fa48("2166", "2167", "2168"), !response.ok)) {
          if (stryMutAct_9fa48("2169")) {
            {}
          } else {
            stryCov_9fa48("2169");
            throw new Error(stryMutAct_9fa48("2170") ? `` : (stryCov_9fa48("2170"), `Failed to update wishlist: ${response.status}`));
          }
        }
        const wishlist = await response.json();

        // Revalidate caches
        revalidateTag(stryMutAct_9fa48("2171") ? "" : (stryCov_9fa48("2171"), 'wishlists'));
        revalidateTag(stryMutAct_9fa48("2172") ? `` : (stryCov_9fa48("2172"), `wishlist-${data.wishlistId}`));
        revalidatePath(stryMutAct_9fa48("2173") ? "" : (stryCov_9fa48("2173"), '/wishlists'));
        revalidatePath(stryMutAct_9fa48("2174") ? `` : (stryCov_9fa48("2174"), `/wishlists/${data.wishlistId}`));
        return stryMutAct_9fa48("2175") ? {} : (stryCov_9fa48("2175"), {
          success: stryMutAct_9fa48("2176") ? false : (stryCov_9fa48("2176"), true),
          data: wishlist,
          message: stryMutAct_9fa48("2177") ? "" : (stryCov_9fa48("2177"), 'Wishlist updated successfully!')
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2178")) {
        {}
      } else {
        stryCov_9fa48("2178");
        console.error(stryMutAct_9fa48("2179") ? "" : (stryCov_9fa48("2179"), 'Error updating wishlist:'), error);
        return stryMutAct_9fa48("2180") ? {} : (stryCov_9fa48("2180"), {
          success: stryMutAct_9fa48("2181") ? true : (stryCov_9fa48("2181"), false),
          error: stryMutAct_9fa48("2182") ? "" : (stryCov_9fa48("2182"), 'Failed to update wishlist. Please try again.')
        });
      }
    }
  }
}

/**
 * Delete wishlist
 */
export async function deleteWishlistAction(wishlistId: string) {
  if (stryMutAct_9fa48("2183")) {
    {}
  } else {
    stryCov_9fa48("2183");
    try {
      if (stryMutAct_9fa48("2184")) {
        {}
      } else {
        stryCov_9fa48("2184");
        const token = await getAuthToken();
        if (stryMutAct_9fa48("2187") ? false : stryMutAct_9fa48("2186") ? true : stryMutAct_9fa48("2185") ? token : (stryCov_9fa48("2185", "2186", "2187"), !token)) {
          if (stryMutAct_9fa48("2188")) {
            {}
          } else {
            stryCov_9fa48("2188");
            return stryMutAct_9fa48("2189") ? {} : (stryCov_9fa48("2189"), {
              success: stryMutAct_9fa48("2190") ? true : (stryCov_9fa48("2190"), false),
              error: stryMutAct_9fa48("2191") ? "" : (stryCov_9fa48("2191"), 'Authentication required')
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("2192") ? `` : (stryCov_9fa48("2192"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}`), stryMutAct_9fa48("2193") ? {} : (stryCov_9fa48("2193"), {
          method: stryMutAct_9fa48("2194") ? "" : (stryCov_9fa48("2194"), 'DELETE'),
          headers: stryMutAct_9fa48("2195") ? {} : (stryCov_9fa48("2195"), {
            'Authorization': stryMutAct_9fa48("2196") ? `` : (stryCov_9fa48("2196"), `Bearer ${token}`)
          })
        }));
        if (stryMutAct_9fa48("2199") ? false : stryMutAct_9fa48("2198") ? true : stryMutAct_9fa48("2197") ? response.ok : (stryCov_9fa48("2197", "2198", "2199"), !response.ok)) {
          if (stryMutAct_9fa48("2200")) {
            {}
          } else {
            stryCov_9fa48("2200");
            throw new Error(stryMutAct_9fa48("2201") ? `` : (stryCov_9fa48("2201"), `Failed to delete wishlist: ${response.status}`));
          }
        }

        // Revalidate caches
        revalidateTag(stryMutAct_9fa48("2202") ? "" : (stryCov_9fa48("2202"), 'wishlists'));
        revalidateTag(stryMutAct_9fa48("2203") ? `` : (stryCov_9fa48("2203"), `wishlist-${wishlistId}`));
        revalidatePath(stryMutAct_9fa48("2204") ? "" : (stryCov_9fa48("2204"), '/wishlists'));
        return stryMutAct_9fa48("2205") ? {} : (stryCov_9fa48("2205"), {
          success: stryMutAct_9fa48("2206") ? false : (stryCov_9fa48("2206"), true),
          message: stryMutAct_9fa48("2207") ? "" : (stryCov_9fa48("2207"), 'Wishlist deleted successfully!')
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2208")) {
        {}
      } else {
        stryCov_9fa48("2208");
        console.error(stryMutAct_9fa48("2209") ? "" : (stryCov_9fa48("2209"), 'Error deleting wishlist:'), error);
        return stryMutAct_9fa48("2210") ? {} : (stryCov_9fa48("2210"), {
          success: stryMutAct_9fa48("2211") ? true : (stryCov_9fa48("2211"), false),
          error: stryMutAct_9fa48("2212") ? "" : (stryCov_9fa48("2212"), 'Failed to delete wishlist. Please try again.')
        });
      }
    }
  }
}

// ==============================================================================
// WISHLIST PRODUCT ACTIONS
// ==============================================================================

/**
 * Add product to wishlist
 */
export async function addToWishlistAction(data: AddToWishlistData) {
  if (stryMutAct_9fa48("2213")) {
    {}
  } else {
    stryCov_9fa48("2213");
    try {
      if (stryMutAct_9fa48("2214")) {
        {}
      } else {
        stryCov_9fa48("2214");
        const token = await getAuthToken();
        if (stryMutAct_9fa48("2217") ? false : stryMutAct_9fa48("2216") ? true : stryMutAct_9fa48("2215") ? token : (stryCov_9fa48("2215", "2216", "2217"), !token)) {
          if (stryMutAct_9fa48("2218")) {
            {}
          } else {
            stryCov_9fa48("2218");
            return stryMutAct_9fa48("2219") ? {} : (stryCov_9fa48("2219"), {
              success: stryMutAct_9fa48("2220") ? true : (stryCov_9fa48("2220"), false),
              error: stryMutAct_9fa48("2221") ? "" : (stryCov_9fa48("2221"), 'Please sign in to add items to wishlists')
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("2222") ? `` : (stryCov_9fa48("2222"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${data.wishlistId}/products`), stryMutAct_9fa48("2223") ? {} : (stryCov_9fa48("2223"), {
          method: stryMutAct_9fa48("2224") ? "" : (stryCov_9fa48("2224"), 'POST'),
          headers: stryMutAct_9fa48("2225") ? {} : (stryCov_9fa48("2225"), {
            'Content-Type': stryMutAct_9fa48("2226") ? "" : (stryCov_9fa48("2226"), 'application/json'),
            'Authorization': stryMutAct_9fa48("2227") ? `` : (stryCov_9fa48("2227"), `Bearer ${token}`)
          }),
          body: JSON.stringify(stryMutAct_9fa48("2228") ? {} : (stryCov_9fa48("2228"), {
            product_id: data.productId,
            notes: stryMutAct_9fa48("2231") ? data.notes?.trim() && null : stryMutAct_9fa48("2230") ? false : stryMutAct_9fa48("2229") ? true : (stryCov_9fa48("2229", "2230", "2231"), (stryMutAct_9fa48("2233") ? data.notes.trim() : stryMutAct_9fa48("2232") ? data.notes : (stryCov_9fa48("2232", "2233"), data.notes?.trim())) || null),
            priority: stryMutAct_9fa48("2236") ? data.priority && 'medium' : stryMutAct_9fa48("2235") ? false : stryMutAct_9fa48("2234") ? true : (stryCov_9fa48("2234", "2235", "2236"), data.priority || (stryMutAct_9fa48("2237") ? "" : (stryCov_9fa48("2237"), 'medium')))
          }))
        }));
        if (stryMutAct_9fa48("2240") ? false : stryMutAct_9fa48("2239") ? true : stryMutAct_9fa48("2238") ? response.ok : (stryCov_9fa48("2238", "2239", "2240"), !response.ok)) {
          if (stryMutAct_9fa48("2241")) {
            {}
          } else {
            stryCov_9fa48("2241");
            if (stryMutAct_9fa48("2244") ? response.status !== 409 : stryMutAct_9fa48("2243") ? false : stryMutAct_9fa48("2242") ? true : (stryCov_9fa48("2242", "2243", "2244"), response.status === 409)) {
              if (stryMutAct_9fa48("2245")) {
                {}
              } else {
                stryCov_9fa48("2245");
                return stryMutAct_9fa48("2246") ? {} : (stryCov_9fa48("2246"), {
                  success: stryMutAct_9fa48("2247") ? true : (stryCov_9fa48("2247"), false),
                  error: stryMutAct_9fa48("2248") ? "" : (stryCov_9fa48("2248"), 'Product is already in this wishlist')
                });
              }
            }
            throw new Error(stryMutAct_9fa48("2249") ? `` : (stryCov_9fa48("2249"), `Failed to add to wishlist: ${response.status}`));
          }
        }

        // Revalidate caches
        revalidateTag(stryMutAct_9fa48("2250") ? "" : (stryCov_9fa48("2250"), 'wishlists'));
        revalidateTag(stryMutAct_9fa48("2251") ? `` : (stryCov_9fa48("2251"), `wishlist-${data.wishlistId}`));
        revalidatePath(stryMutAct_9fa48("2252") ? `` : (stryCov_9fa48("2252"), `/wishlists/${data.wishlistId}`));
        return stryMutAct_9fa48("2253") ? {} : (stryCov_9fa48("2253"), {
          success: stryMutAct_9fa48("2254") ? false : (stryCov_9fa48("2254"), true),
          message: stryMutAct_9fa48("2255") ? "" : (stryCov_9fa48("2255"), 'Product added to wishlist!')
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2256")) {
        {}
      } else {
        stryCov_9fa48("2256");
        console.error(stryMutAct_9fa48("2257") ? "" : (stryCov_9fa48("2257"), 'Error adding to wishlist:'), error);
        return stryMutAct_9fa48("2258") ? {} : (stryCov_9fa48("2258"), {
          success: stryMutAct_9fa48("2259") ? true : (stryCov_9fa48("2259"), false),
          error: stryMutAct_9fa48("2260") ? "" : (stryCov_9fa48("2260"), 'Failed to add product to wishlist. Please try again.')
        });
      }
    }
  }
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlistAction(wishlistId: string, productId: string) {
  if (stryMutAct_9fa48("2261")) {
    {}
  } else {
    stryCov_9fa48("2261");
    try {
      if (stryMutAct_9fa48("2262")) {
        {}
      } else {
        stryCov_9fa48("2262");
        const token = await getAuthToken();
        if (stryMutAct_9fa48("2265") ? false : stryMutAct_9fa48("2264") ? true : stryMutAct_9fa48("2263") ? token : (stryCov_9fa48("2263", "2264", "2265"), !token)) {
          if (stryMutAct_9fa48("2266")) {
            {}
          } else {
            stryCov_9fa48("2266");
            return stryMutAct_9fa48("2267") ? {} : (stryCov_9fa48("2267"), {
              success: stryMutAct_9fa48("2268") ? true : (stryCov_9fa48("2268"), false),
              error: stryMutAct_9fa48("2269") ? "" : (stryCov_9fa48("2269"), 'Authentication required')
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("2270") ? `` : (stryCov_9fa48("2270"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}/products/${productId}`), stryMutAct_9fa48("2271") ? {} : (stryCov_9fa48("2271"), {
          method: stryMutAct_9fa48("2272") ? "" : (stryCov_9fa48("2272"), 'DELETE'),
          headers: stryMutAct_9fa48("2273") ? {} : (stryCov_9fa48("2273"), {
            'Authorization': stryMutAct_9fa48("2274") ? `` : (stryCov_9fa48("2274"), `Bearer ${token}`)
          })
        }));
        if (stryMutAct_9fa48("2277") ? false : stryMutAct_9fa48("2276") ? true : stryMutAct_9fa48("2275") ? response.ok : (stryCov_9fa48("2275", "2276", "2277"), !response.ok)) {
          if (stryMutAct_9fa48("2278")) {
            {}
          } else {
            stryCov_9fa48("2278");
            throw new Error(stryMutAct_9fa48("2279") ? `` : (stryCov_9fa48("2279"), `Failed to remove from wishlist: ${response.status}`));
          }
        }

        // Revalidate caches
        revalidateTag(stryMutAct_9fa48("2280") ? "" : (stryCov_9fa48("2280"), 'wishlists'));
        revalidateTag(stryMutAct_9fa48("2281") ? `` : (stryCov_9fa48("2281"), `wishlist-${wishlistId}`));
        revalidatePath(stryMutAct_9fa48("2282") ? `` : (stryCov_9fa48("2282"), `/wishlists/${wishlistId}`));
        return stryMutAct_9fa48("2283") ? {} : (stryCov_9fa48("2283"), {
          success: stryMutAct_9fa48("2284") ? false : (stryCov_9fa48("2284"), true),
          message: stryMutAct_9fa48("2285") ? "" : (stryCov_9fa48("2285"), 'Product removed from wishlist!')
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2286")) {
        {}
      } else {
        stryCov_9fa48("2286");
        console.error(stryMutAct_9fa48("2287") ? "" : (stryCov_9fa48("2287"), 'Error removing from wishlist:'), error);
        return stryMutAct_9fa48("2288") ? {} : (stryCov_9fa48("2288"), {
          success: stryMutAct_9fa48("2289") ? true : (stryCov_9fa48("2289"), false),
          error: stryMutAct_9fa48("2290") ? "" : (stryCov_9fa48("2290"), 'Failed to remove product from wishlist. Please try again.')
        });
      }
    }
  }
}

// ==============================================================================
// WISHLIST SHARING ACTIONS
// ==============================================================================

/**
 * Generate sharing link for wishlist
 */
export async function generateShareLinkAction(wishlistId: string) {
  if (stryMutAct_9fa48("2291")) {
    {}
  } else {
    stryCov_9fa48("2291");
    try {
      if (stryMutAct_9fa48("2292")) {
        {}
      } else {
        stryCov_9fa48("2292");
        const token = await getAuthToken();
        if (stryMutAct_9fa48("2295") ? false : stryMutAct_9fa48("2294") ? true : stryMutAct_9fa48("2293") ? token : (stryCov_9fa48("2293", "2294", "2295"), !token)) {
          if (stryMutAct_9fa48("2296")) {
            {}
          } else {
            stryCov_9fa48("2296");
            return stryMutAct_9fa48("2297") ? {} : (stryCov_9fa48("2297"), {
              success: stryMutAct_9fa48("2298") ? true : (stryCov_9fa48("2298"), false),
              error: stryMutAct_9fa48("2299") ? "" : (stryCov_9fa48("2299"), 'Authentication required')
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("2300") ? `` : (stryCov_9fa48("2300"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}/share`), stryMutAct_9fa48("2301") ? {} : (stryCov_9fa48("2301"), {
          method: stryMutAct_9fa48("2302") ? "" : (stryCov_9fa48("2302"), 'POST'),
          headers: stryMutAct_9fa48("2303") ? {} : (stryCov_9fa48("2303"), {
            'Authorization': stryMutAct_9fa48("2304") ? `` : (stryCov_9fa48("2304"), `Bearer ${token}`)
          })
        }));
        if (stryMutAct_9fa48("2307") ? false : stryMutAct_9fa48("2306") ? true : stryMutAct_9fa48("2305") ? response.ok : (stryCov_9fa48("2305", "2306", "2307"), !response.ok)) {
          if (stryMutAct_9fa48("2308")) {
            {}
          } else {
            stryCov_9fa48("2308");
            throw new Error(stryMutAct_9fa48("2309") ? `` : (stryCov_9fa48("2309"), `Failed to generate share link: ${response.status}`));
          }
        }
        const data = await response.json();

        // Revalidate wishlist cache
        revalidateTag(stryMutAct_9fa48("2310") ? `` : (stryCov_9fa48("2310"), `wishlist-${wishlistId}`));
        return stryMutAct_9fa48("2311") ? {} : (stryCov_9fa48("2311"), {
          success: stryMutAct_9fa48("2312") ? false : (stryCov_9fa48("2312"), true),
          data: stryMutAct_9fa48("2313") ? {} : (stryCov_9fa48("2313"), {
            shareToken: data.share_token,
            shareUrl: stryMutAct_9fa48("2314") ? `` : (stryCov_9fa48("2314"), `${process.env.NEXT_PUBLIC_WEB_URL}/wishlists/${wishlistId}/share/${data.share_token}`)
          }),
          message: stryMutAct_9fa48("2315") ? "" : (stryCov_9fa48("2315"), 'Share link generated successfully!')
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2316")) {
        {}
      } else {
        stryCov_9fa48("2316");
        console.error(stryMutAct_9fa48("2317") ? "" : (stryCov_9fa48("2317"), 'Error generating share link:'), error);
        return stryMutAct_9fa48("2318") ? {} : (stryCov_9fa48("2318"), {
          success: stryMutAct_9fa48("2319") ? true : (stryCov_9fa48("2319"), false),
          error: stryMutAct_9fa48("2320") ? "" : (stryCov_9fa48("2320"), 'Failed to generate share link. Please try again.')
        });
      }
    }
  }
}

/**
 * Get public shared wishlist (no authentication required)
 */
export async function getSharedWishlistAction(wishlistId: string, shareToken: string) {
  if (stryMutAct_9fa48("2321")) {
    {}
  } else {
    stryCov_9fa48("2321");
    try {
      if (stryMutAct_9fa48("2322")) {
        {}
      } else {
        stryCov_9fa48("2322");
        const response = await fetch(stryMutAct_9fa48("2323") ? `` : (stryCov_9fa48("2323"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}/shared/${shareToken}`), stryMutAct_9fa48("2324") ? {} : (stryCov_9fa48("2324"), {
          next: stryMutAct_9fa48("2325") ? {} : (stryCov_9fa48("2325"), {
            revalidate: 600,
            // Cache for 10 minutes
            tags: stryMutAct_9fa48("2326") ? [] : (stryCov_9fa48("2326"), [stryMutAct_9fa48("2327") ? "" : (stryCov_9fa48("2327"), 'shared-wishlist'), stryMutAct_9fa48("2328") ? `` : (stryCov_9fa48("2328"), `shared-wishlist-${wishlistId}`)])
          })
        }));
        if (stryMutAct_9fa48("2331") ? false : stryMutAct_9fa48("2330") ? true : stryMutAct_9fa48("2329") ? response.ok : (stryCov_9fa48("2329", "2330", "2331"), !response.ok)) {
          if (stryMutAct_9fa48("2332")) {
            {}
          } else {
            stryCov_9fa48("2332");
            if (stryMutAct_9fa48("2335") ? response.status !== 404 : stryMutAct_9fa48("2334") ? false : stryMutAct_9fa48("2333") ? true : (stryCov_9fa48("2333", "2334", "2335"), response.status === 404)) {
              if (stryMutAct_9fa48("2336")) {
                {}
              } else {
                stryCov_9fa48("2336");
                return stryMutAct_9fa48("2337") ? {} : (stryCov_9fa48("2337"), {
                  success: stryMutAct_9fa48("2338") ? true : (stryCov_9fa48("2338"), false),
                  error: stryMutAct_9fa48("2339") ? "" : (stryCov_9fa48("2339"), 'Shared wishlist not found or link has expired'),
                  data: null
                });
              }
            }
            throw new Error(stryMutAct_9fa48("2340") ? `` : (stryCov_9fa48("2340"), `Failed to fetch shared wishlist: ${response.status}`));
          }
        }
        const data = await response.json();
        return stryMutAct_9fa48("2341") ? {} : (stryCov_9fa48("2341"), {
          success: stryMutAct_9fa48("2342") ? false : (stryCov_9fa48("2342"), true),
          data: stryMutAct_9fa48("2345") ? data.data && data : stryMutAct_9fa48("2344") ? false : stryMutAct_9fa48("2343") ? true : (stryCov_9fa48("2343", "2344", "2345"), data.data || data)
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2346")) {
        {}
      } else {
        stryCov_9fa48("2346");
        console.error(stryMutAct_9fa48("2347") ? "" : (stryCov_9fa48("2347"), 'Error fetching shared wishlist:'), error);
        return stryMutAct_9fa48("2348") ? {} : (stryCov_9fa48("2348"), {
          success: stryMutAct_9fa48("2349") ? true : (stryCov_9fa48("2349"), false),
          error: stryMutAct_9fa48("2350") ? "" : (stryCov_9fa48("2350"), 'Failed to load shared wishlist. Please try again.'),
          data: null
        });
      }
    }
  }
}

// ==============================================================================
// AMAZON AFFILIATE ACTIONS
// ==============================================================================

/**
 * Generate Amazon affiliate links for wishlist products
 */
export async function generateAffiliateLinksAction(productIds: string[]) {
  if (stryMutAct_9fa48("2351")) {
    {}
  } else {
    stryCov_9fa48("2351");
    try {
      if (stryMutAct_9fa48("2352")) {
        {}
      } else {
        stryCov_9fa48("2352");
        const token = await getAuthToken();
        if (stryMutAct_9fa48("2355") ? false : stryMutAct_9fa48("2354") ? true : stryMutAct_9fa48("2353") ? token : (stryCov_9fa48("2353", "2354", "2355"), !token)) {
          if (stryMutAct_9fa48("2356")) {
            {}
          } else {
            stryCov_9fa48("2356");
            return stryMutAct_9fa48("2357") ? {} : (stryCov_9fa48("2357"), {
              success: stryMutAct_9fa48("2358") ? true : (stryCov_9fa48("2358"), false),
              error: stryMutAct_9fa48("2359") ? "" : (stryCov_9fa48("2359"), 'Authentication required'),
              data: {}
            });
          }
        }
        const response = await fetch(stryMutAct_9fa48("2360") ? `` : (stryCov_9fa48("2360"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/affiliate/generate`), stryMutAct_9fa48("2361") ? {} : (stryCov_9fa48("2361"), {
          method: stryMutAct_9fa48("2362") ? "" : (stryCov_9fa48("2362"), 'POST'),
          headers: stryMutAct_9fa48("2363") ? {} : (stryCov_9fa48("2363"), {
            'Content-Type': stryMutAct_9fa48("2364") ? "" : (stryCov_9fa48("2364"), 'application/json'),
            'Authorization': stryMutAct_9fa48("2365") ? `` : (stryCov_9fa48("2365"), `Bearer ${token}`)
          }),
          body: JSON.stringify(stryMutAct_9fa48("2366") ? {} : (stryCov_9fa48("2366"), {
            product_ids: productIds,
            affiliate_tag: process.env.AMAZON_AFFILIATE_TAG,
            campaign: stryMutAct_9fa48("2367") ? "" : (stryCov_9fa48("2367"), 'wishlist_sharing')
          }))
        }));
        if (stryMutAct_9fa48("2370") ? false : stryMutAct_9fa48("2369") ? true : stryMutAct_9fa48("2368") ? response.ok : (stryCov_9fa48("2368", "2369", "2370"), !response.ok)) {
          if (stryMutAct_9fa48("2371")) {
            {}
          } else {
            stryCov_9fa48("2371");
            throw new Error(stryMutAct_9fa48("2372") ? `` : (stryCov_9fa48("2372"), `Failed to generate affiliate links: ${response.status}`));
          }
        }
        const data = await response.json();
        return stryMutAct_9fa48("2373") ? {} : (stryCov_9fa48("2373"), {
          success: stryMutAct_9fa48("2374") ? false : (stryCov_9fa48("2374"), true),
          data: stryMutAct_9fa48("2377") ? data.affiliate_links && {} : stryMutAct_9fa48("2376") ? false : stryMutAct_9fa48("2375") ? true : (stryCov_9fa48("2375", "2376", "2377"), data.affiliate_links || {})
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2378")) {
        {}
      } else {
        stryCov_9fa48("2378");
        console.error(stryMutAct_9fa48("2379") ? "" : (stryCov_9fa48("2379"), 'Error generating affiliate links:'), error);
        return stryMutAct_9fa48("2380") ? {} : (stryCov_9fa48("2380"), {
          success: stryMutAct_9fa48("2381") ? true : (stryCov_9fa48("2381"), false),
          error: stryMutAct_9fa48("2382") ? "" : (stryCov_9fa48("2382"), 'Failed to generate affiliate links. Using direct links instead.'),
          data: {}
        });
      }
    }
  }
}

/**
 * Track affiliate click for analytics
 */
export async function trackAffiliateClickAction(data: {
  productId: string;
  wishlistId?: string;
  source: string;
  campaign: string;
}) {
  if (stryMutAct_9fa48("2383")) {
    {}
  } else {
    stryCov_9fa48("2383");
    try {
      if (stryMutAct_9fa48("2384")) {
        {}
      } else {
        stryCov_9fa48("2384");
        // This is fire-and-forget analytics tracking
        fetch(stryMutAct_9fa48("2385") ? `` : (stryCov_9fa48("2385"), `${process.env.NEXT_PUBLIC_API_URL}/api/v1/affiliate/track`), stryMutAct_9fa48("2386") ? {} : (stryCov_9fa48("2386"), {
          method: stryMutAct_9fa48("2387") ? "" : (stryCov_9fa48("2387"), 'POST'),
          headers: stryMutAct_9fa48("2388") ? {} : (stryCov_9fa48("2388"), {
            'Content-Type': stryMutAct_9fa48("2389") ? "" : (stryCov_9fa48("2389"), 'application/json')
          }),
          body: JSON.stringify(stryMutAct_9fa48("2390") ? {} : (stryCov_9fa48("2390"), {
            product_id: data.productId,
            wishlist_id: data.wishlistId,
            source: data.source,
            campaign: data.campaign,
            timestamp: new Date().toISOString()
          }))
        })).catch(error => {
          if (stryMutAct_9fa48("2391")) {
            {}
          } else {
            stryCov_9fa48("2391");
            console.error(stryMutAct_9fa48("2392") ? "" : (stryCov_9fa48("2392"), 'Error tracking affiliate click:'), error);
          }
        });
        return stryMutAct_9fa48("2393") ? {} : (stryCov_9fa48("2393"), {
          success: stryMutAct_9fa48("2394") ? false : (stryCov_9fa48("2394"), true)
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2395")) {
        {}
      } else {
        stryCov_9fa48("2395");
        console.error(stryMutAct_9fa48("2396") ? "" : (stryCov_9fa48("2396"), 'Error tracking affiliate click:'), error);
        return stryMutAct_9fa48("2397") ? {} : (stryCov_9fa48("2397"), {
          success: stryMutAct_9fa48("2398") ? true : (stryCov_9fa48("2398"), false)
        });
      }
    }
  }
}

// ==============================================================================
// CACHE MANAGEMENT
// ==============================================================================

/**
 * Refresh wishlist caches
 */
export async function refreshWishlistCacheAction() {
  if (stryMutAct_9fa48("2399")) {
    {}
  } else {
    stryCov_9fa48("2399");
    try {
      if (stryMutAct_9fa48("2400")) {
        {}
      } else {
        stryCov_9fa48("2400");
        revalidateTag(stryMutAct_9fa48("2401") ? "" : (stryCov_9fa48("2401"), 'wishlists'));
        revalidateTag(stryMutAct_9fa48("2402") ? "" : (stryCov_9fa48("2402"), 'shared-wishlist'));
        revalidatePath(stryMutAct_9fa48("2403") ? "" : (stryCov_9fa48("2403"), '/wishlists'));
        return stryMutAct_9fa48("2404") ? {} : (stryCov_9fa48("2404"), {
          success: stryMutAct_9fa48("2405") ? false : (stryCov_9fa48("2405"), true),
          message: stryMutAct_9fa48("2406") ? "" : (stryCov_9fa48("2406"), 'Wishlist cache refreshed successfully!')
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2407")) {
        {}
      } else {
        stryCov_9fa48("2407");
        console.error(stryMutAct_9fa48("2408") ? "" : (stryCov_9fa48("2408"), 'Error refreshing wishlist cache:'), error);
        return stryMutAct_9fa48("2409") ? {} : (stryCov_9fa48("2409"), {
          success: stryMutAct_9fa48("2410") ? true : (stryCov_9fa48("2410"), false),
          error: stryMutAct_9fa48("2411") ? "" : (stryCov_9fa48("2411"), 'Failed to refresh cache. Please try again.')
        });
      }
    }
  }
}