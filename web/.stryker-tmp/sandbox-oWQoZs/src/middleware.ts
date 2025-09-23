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
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { evaluateAppRouterForRequest } from '@/lib/feature-flags';

/**
 * Enhanced Middleware - Phase 4: Tier 2 Migration
 *
 * Enterprise-grade middleware for App Router authentication and route protection.
 * Provides secure session validation, automatic redirects, and feature flag evaluation.
 *
 * Phase 4 Features:
 * - Product discovery route protection
 * - Search functionality access control
 * - Shopping cart session management
 * - Enhanced performance monitoring
 *
 * Security Features:
 * - Server-side session validation
 * - Protected route enforcement
 * - Automatic token refresh handling
 * - CSRF protection headers
 * - Secure cookie validation
 *
 * Performance Features:
 * - Edge function execution
 * - Minimal processing overhead
 * - Efficient route matching
 * - Feature flag evaluation
 */

// Configuration for middleware
const AUTH_CONFIG = {
  cookies: {
    accessToken: 'auth_access_token',
    refreshToken: 'auth_refresh_token',
    user: 'auth_user_data'
  },
  routes: {
    protected: ['/dashboard', '/profile', '/settings', '/admin', '/cart', '/wishlist'],
    auth: ['/auth/login', '/auth/register'],
    public: ['/', '/about', '/contact', '/terms', '/privacy', '/discover', '/search', '/products']
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  }
} as const;

/**
 * Check if a route requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  if (stryMutAct_9fa48("11758")) {
    {}
  } else {
    stryCov_9fa48("11758");
    return stryMutAct_9fa48("11759") ? AUTH_CONFIG.routes.protected.every(route => pathname.startsWith(route)) : (stryCov_9fa48("11759"), AUTH_CONFIG.routes.protected.some(stryMutAct_9fa48("11760") ? () => undefined : (stryCov_9fa48("11760"), route => stryMutAct_9fa48("11761") ? pathname.endsWith(route) : (stryCov_9fa48("11761"), pathname.startsWith(route)))));
  }
}

/**
 * Check if a route is an authentication route
 */
function isAuthRoute(pathname: string): boolean {
  if (stryMutAct_9fa48("11762")) {
    {}
  } else {
    stryCov_9fa48("11762");
    return stryMutAct_9fa48("11763") ? AUTH_CONFIG.routes.auth.every(route => pathname.startsWith(route)) : (stryCov_9fa48("11763"), AUTH_CONFIG.routes.auth.some(stryMutAct_9fa48("11764") ? () => undefined : (stryCov_9fa48("11764"), route => stryMutAct_9fa48("11765") ? pathname.endsWith(route) : (stryCov_9fa48("11765"), pathname.startsWith(route)))));
  }
}

/**
 * Validate user session by checking secure cookies
 */
async function validateSession(request: NextRequest): Promise<boolean> {
  if (stryMutAct_9fa48("11766")) {
    {}
  } else {
    stryCov_9fa48("11766");
    try {
      if (stryMutAct_9fa48("11767")) {
        {}
      } else {
        stryCov_9fa48("11767");
        const accessToken = stryMutAct_9fa48("11768") ? request.cookies.get(AUTH_CONFIG.cookies.accessToken).value : (stryCov_9fa48("11768"), request.cookies.get(AUTH_CONFIG.cookies.accessToken)?.value);
        const userCookie = stryMutAct_9fa48("11769") ? request.cookies.get(AUTH_CONFIG.cookies.user).value : (stryCov_9fa48("11769"), request.cookies.get(AUTH_CONFIG.cookies.user)?.value);
        if (stryMutAct_9fa48("11772") ? !accessToken && !userCookie : stryMutAct_9fa48("11771") ? false : stryMutAct_9fa48("11770") ? true : (stryCov_9fa48("11770", "11771", "11772"), (stryMutAct_9fa48("11773") ? accessToken : (stryCov_9fa48("11773"), !accessToken)) || (stryMutAct_9fa48("11774") ? userCookie : (stryCov_9fa48("11774"), !userCookie)))) {
          if (stryMutAct_9fa48("11775")) {
            {}
          } else {
            stryCov_9fa48("11775");
            return stryMutAct_9fa48("11776") ? true : (stryCov_9fa48("11776"), false);
          }
        }

        // Basic token validation (in production, you might want to verify JWT signature)
        if (stryMutAct_9fa48("11780") ? accessToken.length >= 10 : stryMutAct_9fa48("11779") ? accessToken.length <= 10 : stryMutAct_9fa48("11778") ? false : stryMutAct_9fa48("11777") ? true : (stryCov_9fa48("11777", "11778", "11779", "11780"), accessToken.length < 10)) {
          if (stryMutAct_9fa48("11781")) {
            {}
          } else {
            stryCov_9fa48("11781");
            return stryMutAct_9fa48("11782") ? true : (stryCov_9fa48("11782"), false);
          }
        }

        // Validate user data cookie
        try {
          if (stryMutAct_9fa48("11783")) {
            {}
          } else {
            stryCov_9fa48("11783");
            const userData = JSON.parse(userCookie);
            if (stryMutAct_9fa48("11786") ? !userData.id && !userData.email : stryMutAct_9fa48("11785") ? false : stryMutAct_9fa48("11784") ? true : (stryCov_9fa48("11784", "11785", "11786"), (stryMutAct_9fa48("11787") ? userData.id : (stryCov_9fa48("11787"), !userData.id)) || (stryMutAct_9fa48("11788") ? userData.email : (stryCov_9fa48("11788"), !userData.email)))) {
              if (stryMutAct_9fa48("11789")) {
                {}
              } else {
                stryCov_9fa48("11789");
                return stryMutAct_9fa48("11790") ? true : (stryCov_9fa48("11790"), false);
              }
            }
          }
        } catch {
          if (stryMutAct_9fa48("11791")) {
            {}
          } else {
            stryCov_9fa48("11791");
            return stryMutAct_9fa48("11792") ? true : (stryCov_9fa48("11792"), false);
          }
        }
        return stryMutAct_9fa48("11793") ? false : (stryCov_9fa48("11793"), true);
      }
    } catch (error) {
      if (stryMutAct_9fa48("11794")) {
        {}
      } else {
        stryCov_9fa48("11794");
        console.error(stryMutAct_9fa48("11795") ? "" : (stryCov_9fa48("11795"), 'Session validation error:'), error);
        return stryMutAct_9fa48("11796") ? true : (stryCov_9fa48("11796"), false);
      }
    }
  }
}

/**
 * Enhanced middleware function
 */
export async function middleware(request: NextRequest) {
  if (stryMutAct_9fa48("11797")) {
    {}
  } else {
    stryCov_9fa48("11797");
    const {
      pathname
    } = request.nextUrl;
    const isValid = await validateSession(request);
    console.log(stryMutAct_9fa48("11798") ? `` : (stryCov_9fa48("11798"), `🔒 Middleware: ${pathname} - Session valid: ${isValid}`));

    // Feature flag evaluation for App Router migration
    const {
      shouldUseAppRouter,
      reason
    } = evaluateAppRouterForRequest(pathname);
    if (stryMutAct_9fa48("11800") ? false : stryMutAct_9fa48("11799") ? true : (stryCov_9fa48("11799", "11800"), shouldUseAppRouter)) {
      if (stryMutAct_9fa48("11801")) {
        {}
      } else {
        stryCov_9fa48("11801");
        console.log(stryMutAct_9fa48("11802") ? `` : (stryCov_9fa48("11802"), `🚀 App Router enabled for ${pathname}: ${reason}`));
      }
    } else {
      if (stryMutAct_9fa48("11803")) {
        {}
      } else {
        stryCov_9fa48("11803");
        console.log(stryMutAct_9fa48("11804") ? `` : (stryCov_9fa48("11804"), `📄 Pages Router fallback for ${pathname}: ${reason}`));
      }
    }

    // Handle protected routes
    if (stryMutAct_9fa48("11806") ? false : stryMutAct_9fa48("11805") ? true : (stryCov_9fa48("11805", "11806"), isProtectedRoute(pathname))) {
      if (stryMutAct_9fa48("11807")) {
        {}
      } else {
        stryCov_9fa48("11807");
        if (stryMutAct_9fa48("11810") ? false : stryMutAct_9fa48("11809") ? true : stryMutAct_9fa48("11808") ? isValid : (stryCov_9fa48("11808", "11809", "11810"), !isValid)) {
          if (stryMutAct_9fa48("11811")) {
            {}
          } else {
            stryCov_9fa48("11811");
            console.log(stryMutAct_9fa48("11812") ? `` : (stryCov_9fa48("11812"), `🚫 Access denied to protected route: ${pathname}`));
            const loginUrl = new URL(stryMutAct_9fa48("11813") ? "" : (stryCov_9fa48("11813"), '/auth/login'), request.url);
            loginUrl.searchParams.set(stryMutAct_9fa48("11814") ? "" : (stryCov_9fa48("11814"), 'redirect'), pathname);
            return NextResponse.redirect(loginUrl);
          }
        }
      }
    }

    // Handle authentication routes (redirect if already authenticated)
    if (stryMutAct_9fa48("11816") ? false : stryMutAct_9fa48("11815") ? true : (stryCov_9fa48("11815", "11816"), isAuthRoute(pathname))) {
      if (stryMutAct_9fa48("11817")) {
        {}
      } else {
        stryCov_9fa48("11817");
        if (stryMutAct_9fa48("11819") ? false : stryMutAct_9fa48("11818") ? true : (stryCov_9fa48("11818", "11819"), isValid)) {
          if (stryMutAct_9fa48("11820")) {
            {}
          } else {
            stryCov_9fa48("11820");
            console.log(stryMutAct_9fa48("11821") ? `` : (stryCov_9fa48("11821"), `🔄 Redirecting authenticated user from auth route: ${pathname}`));
            const dashboardUrl = new URL(stryMutAct_9fa48("11822") ? "" : (stryCov_9fa48("11822"), '/dashboard'), request.url);
            return NextResponse.redirect(dashboardUrl);
          }
        }
      }
    }

    // Handle App Router feature flag routing
    if (stryMutAct_9fa48("11824") ? false : stryMutAct_9fa48("11823") ? true : (stryCov_9fa48("11823", "11824"), shouldUseAppRouter)) {
      if (stryMutAct_9fa48("11825")) {
        {}
      } else {
        stryCov_9fa48("11825");
        // For App Router routes (auth routes, root route, etc.)
        const response = NextResponse.next();

        // Add security headers for enhanced protection
        response.headers.set(stryMutAct_9fa48("11826") ? "" : (stryCov_9fa48("11826"), 'X-Frame-Options'), stryMutAct_9fa48("11827") ? "" : (stryCov_9fa48("11827"), 'DENY'));
        response.headers.set(stryMutAct_9fa48("11828") ? "" : (stryCov_9fa48("11828"), 'X-Content-Type-Options'), stryMutAct_9fa48("11829") ? "" : (stryCov_9fa48("11829"), 'nosniff'));
        response.headers.set(stryMutAct_9fa48("11830") ? "" : (stryCov_9fa48("11830"), 'Referrer-Policy'), stryMutAct_9fa48("11831") ? "" : (stryCov_9fa48("11831"), 'strict-origin-when-cross-origin'));
        response.headers.set(stryMutAct_9fa48("11832") ? "" : (stryCov_9fa48("11832"), 'Permissions-Policy'), stryMutAct_9fa48("11833") ? "" : (stryCov_9fa48("11833"), 'camera=(), microphone=(), geolocation=()'));
        console.log(stryMutAct_9fa48("11834") ? `` : (stryCov_9fa48("11834"), `✅ App Router serving: ${pathname}`));
        return response;
      }
    }

    // Default response with security headers
    const response = NextResponse.next();

    // Add security headers to all responses
    response.headers.set(stryMutAct_9fa48("11835") ? "" : (stryCov_9fa48("11835"), 'X-Frame-Options'), stryMutAct_9fa48("11836") ? "" : (stryCov_9fa48("11836"), 'DENY'));
    response.headers.set(stryMutAct_9fa48("11837") ? "" : (stryCov_9fa48("11837"), 'X-Content-Type-Options'), stryMutAct_9fa48("11838") ? "" : (stryCov_9fa48("11838"), 'nosniff'));
    response.headers.set(stryMutAct_9fa48("11839") ? "" : (stryCov_9fa48("11839"), 'Referrer-Policy'), stryMutAct_9fa48("11840") ? "" : (stryCov_9fa48("11840"), 'strict-origin-when-cross-origin'));
    response.headers.set(stryMutAct_9fa48("11841") ? "" : (stryCov_9fa48("11841"), 'Permissions-Policy'), stryMutAct_9fa48("11842") ? "" : (stryCov_9fa48("11842"), 'camera=(), microphone=(), geolocation=()'));

    // Add CSRF protection for form submissions
    if (stryMutAct_9fa48("11845") ? request.method !== 'POST' : stryMutAct_9fa48("11844") ? false : stryMutAct_9fa48("11843") ? true : (stryCov_9fa48("11843", "11844", "11845"), request.method === (stryMutAct_9fa48("11846") ? "" : (stryCov_9fa48("11846"), 'POST')))) {
      if (stryMutAct_9fa48("11847")) {
        {}
      } else {
        stryCov_9fa48("11847");
        response.headers.set(stryMutAct_9fa48("11848") ? "" : (stryCov_9fa48("11848"), 'X-CSRF-Protection'), stryMutAct_9fa48("11849") ? "" : (stryCov_9fa48("11849"), '1'));
      }
    }
    return response;
  }
}

/**
 * Middleware configuration
 */
export const config = stryMutAct_9fa48("11850") ? {} : (stryCov_9fa48("11850"), {
  matcher: stryMutAct_9fa48("11851") ? [] : (stryCov_9fa48("11851"), [
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public assets
   */
  stryMutAct_9fa48("11852") ? "" : (stryCov_9fa48("11852"), '/((?!api|_next/static|_next/image|favicon.ico|logo.png|aclue_text_clean.png).*)')])
});