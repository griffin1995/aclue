/**
 * aclue Authentication Guard Component
 * 
 * Provides route-level authentication and authorization for the aclue application.
 * Handles protected routes, authentication redirects, and loading states during
 * authentication checks. Ensures secure access to user-specific features.
 * 
 * Key Features:
 *   - Automatic authentication checking on route changes
 *   - Protected route enforcement with redirect logic
 *   - Public route access for unauthenticated users
 *   - Authentication route handling (prevent double login)
 *   - Loading states during authentication verification
 *   - JWT token validation and refresh
 * 
 * Security Features:
 *   - Server-side authentication validation
 *   - Secure token storage and management
 *   - Session timeout handling
 *   - Unauthorized access prevention
 *   - Seamless login/logout flow
 * 
 * Route Categories:
 *   - Protected: Require valid authentication
 *   - Auth: Login/register pages (redirect if logged in)
 *   - Public: Accessible without authentication
 * 
 * Usage:
 *   <AuthGuard>
 *     <YourProtectedComponent />
 *   </AuthGuard>
 * 
 * Integration:
 *   - Works with AuthContext for global auth state
 *   - Uses Next.js router for navigation
 *   - Coordinates with PageLoader for UX
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
import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/PageLoader';

/**
 * Props interface for AuthGuard component.
 * 
 * @param children - React components to render if authentication check passes
 */
interface AuthGuardProps {
  children: ReactNode;
}

// Routes that require authentication
const PROTECTED_ROUTES = stryMutAct_9fa48("3049") ? [] : (stryCov_9fa48("3049"), [stryMutAct_9fa48("3050") ? "" : (stryCov_9fa48("3050"), '/dashboard'), stryMutAct_9fa48("3051") ? "" : (stryCov_9fa48("3051"), '/profile'), stryMutAct_9fa48("3052") ? "" : (stryCov_9fa48("3052"), '/settings'), stryMutAct_9fa48("3053") ? "" : (stryCov_9fa48("3053"), '/recommendations'), stryMutAct_9fa48("3054") ? "" : (stryCov_9fa48("3054"), '/gift-links'), stryMutAct_9fa48("3055") ? "" : (stryCov_9fa48("3055"), '/onboarding')]);

// Routes that should redirect authenticated users
const AUTH_ROUTES = stryMutAct_9fa48("3056") ? [] : (stryCov_9fa48("3056"), [stryMutAct_9fa48("3057") ? "" : (stryCov_9fa48("3057"), '/auth/login'), stryMutAct_9fa48("3058") ? "" : (stryCov_9fa48("3058"), '/auth/register'), stryMutAct_9fa48("3059") ? "" : (stryCov_9fa48("3059"), '/auth/forgot-password'), stryMutAct_9fa48("3060") ? "" : (stryCov_9fa48("3060"), '/auth/reset-password')]);

// Public routes that don't require any auth logic
// const PUBLIC_ROUTES = [
//   '/',
//   '/about',
//   '/contact',
//   '/privacy',
//   '/terms',
//   '/pricing',
//   '/404',
// ];

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children
}) => {
  if (stryMutAct_9fa48("3061")) {
    {}
  } else {
    stryCov_9fa48("3061");
    const {
      isAuthenticated,
      isInitialized,
      isLoading,
      isLoggingOut
    } = useAuth();
    const router = useRouter();
    const currentPath = stryMutAct_9fa48("3064") ? router.asPath?.split('?')[0] && '/' : stryMutAct_9fa48("3063") ? false : stryMutAct_9fa48("3062") ? true : (stryCov_9fa48("3062", "3063", "3064"), (stryMutAct_9fa48("3065") ? router.asPath.split('?')[0] : (stryCov_9fa48("3065"), router.asPath?.split(stryMutAct_9fa48("3066") ? "" : (stryCov_9fa48("3066"), '?'))[0])) || (stryMutAct_9fa48("3067") ? "" : (stryCov_9fa48("3067"), '/'))); // Remove query params

    useEffect(() => {
      if (stryMutAct_9fa48("3068")) {
        {}
      } else {
        stryCov_9fa48("3068");
        if (stryMutAct_9fa48("3071") ? false : stryMutAct_9fa48("3070") ? true : stryMutAct_9fa48("3069") ? isInitialized : (stryCov_9fa48("3069", "3070", "3071"), !isInitialized)) return;

        // Don't redirect during logout process
        if (stryMutAct_9fa48("3073") ? false : stryMutAct_9fa48("3072") ? true : (stryCov_9fa48("3072", "3073"), isLoggingOut)) return;
        const isProtectedRoute = stryMutAct_9fa48("3074") ? PROTECTED_ROUTES.every(route => currentPath.startsWith(route)) : (stryCov_9fa48("3074"), PROTECTED_ROUTES.some(stryMutAct_9fa48("3075") ? () => undefined : (stryCov_9fa48("3075"), route => stryMutAct_9fa48("3076") ? currentPath.endsWith(route) : (stryCov_9fa48("3076"), currentPath.startsWith(route)))));
        const isAuthRoute = stryMutAct_9fa48("3077") ? AUTH_ROUTES.every(route => currentPath.startsWith(route)) : (stryCov_9fa48("3077"), AUTH_ROUTES.some(stryMutAct_9fa48("3078") ? () => undefined : (stryCov_9fa48("3078"), route => stryMutAct_9fa48("3079") ? currentPath.endsWith(route) : (stryCov_9fa48("3079"), currentPath.startsWith(route)))));

        // Redirect unauthenticated users from protected routes
        if (stryMutAct_9fa48("3082") ? isProtectedRoute || !isAuthenticated : stryMutAct_9fa48("3081") ? false : stryMutAct_9fa48("3080") ? true : (stryCov_9fa48("3080", "3081", "3082"), isProtectedRoute && (stryMutAct_9fa48("3083") ? isAuthenticated : (stryCov_9fa48("3083"), !isAuthenticated)))) {
          if (stryMutAct_9fa48("3084")) {
            {}
          } else {
            stryCov_9fa48("3084");
            const redirectUrl = stryMutAct_9fa48("3085") ? `` : (stryCov_9fa48("3085"), `/auth/login?redirect=${encodeURIComponent(currentPath)}`);
            router.replace(redirectUrl);
            return;
          }
        }

        // Redirect authenticated users from auth routes
        if (stryMutAct_9fa48("3088") ? isAuthRoute || isAuthenticated : stryMutAct_9fa48("3087") ? false : stryMutAct_9fa48("3086") ? true : (stryCov_9fa48("3086", "3087", "3088"), isAuthRoute && isAuthenticated)) {
          if (stryMutAct_9fa48("3089")) {
            {}
          } else {
            stryCov_9fa48("3089");
            const redirectTo = stryMutAct_9fa48("3092") ? router.query['redirect'] as string && '/dashboard' : stryMutAct_9fa48("3091") ? false : stryMutAct_9fa48("3090") ? true : (stryCov_9fa48("3090", "3091", "3092"), router.query['redirect'] as string || (stryMutAct_9fa48("3093") ? "" : (stryCov_9fa48("3093"), '/dashboard')));
            router.replace(redirectTo);
            return;
          }
        }
      }
    }, stryMutAct_9fa48("3094") ? [] : (stryCov_9fa48("3094"), [isAuthenticated, isInitialized, isLoggingOut, currentPath, router]));

    // Show loading state while initializing or during redirects
    if (stryMutAct_9fa48("3097") ? !isInitialized && isLoading : stryMutAct_9fa48("3096") ? false : stryMutAct_9fa48("3095") ? true : (stryCov_9fa48("3095", "3096", "3097"), (stryMutAct_9fa48("3098") ? isInitialized : (stryCov_9fa48("3098"), !isInitialized)) || isLoading)) {
      if (stryMutAct_9fa48("3099")) {
        {}
      } else {
        stryCov_9fa48("3099");
        return <PageLoader text="Loading aclue..." />;
      }
    }

    // Show loading for protected routes while unauthenticated (redirect happening)
    const isProtectedRoute = stryMutAct_9fa48("3100") ? PROTECTED_ROUTES.every(route => currentPath.startsWith(route)) : (stryCov_9fa48("3100"), PROTECTED_ROUTES.some(stryMutAct_9fa48("3101") ? () => undefined : (stryCov_9fa48("3101"), route => stryMutAct_9fa48("3102") ? currentPath.endsWith(route) : (stryCov_9fa48("3102"), currentPath.startsWith(route)))));
    if (stryMutAct_9fa48("3105") ? isProtectedRoute || !isAuthenticated : stryMutAct_9fa48("3104") ? false : stryMutAct_9fa48("3103") ? true : (stryCov_9fa48("3103", "3104", "3105"), isProtectedRoute && (stryMutAct_9fa48("3106") ? isAuthenticated : (stryCov_9fa48("3106"), !isAuthenticated)))) {
      if (stryMutAct_9fa48("3107")) {
        {}
      } else {
        stryCov_9fa48("3107");
        return <PageLoader text="Redirecting to login..." />;
      }
    }

    // Show loading for auth routes while authenticated (redirect happening)
    const isAuthRoute = stryMutAct_9fa48("3108") ? AUTH_ROUTES.every(route => currentPath.startsWith(route)) : (stryCov_9fa48("3108"), AUTH_ROUTES.some(stryMutAct_9fa48("3109") ? () => undefined : (stryCov_9fa48("3109"), route => stryMutAct_9fa48("3110") ? currentPath.endsWith(route) : (stryCov_9fa48("3110"), currentPath.startsWith(route)))));
    if (stryMutAct_9fa48("3113") ? isAuthRoute || isAuthenticated : stryMutAct_9fa48("3112") ? false : stryMutAct_9fa48("3111") ? true : (stryCov_9fa48("3111", "3112", "3113"), isAuthRoute && isAuthenticated)) {
      if (stryMutAct_9fa48("3114")) {
        {}
      } else {
        stryCov_9fa48("3114");
        return <PageLoader text="Redirecting to dashboard..." />;
      }
    }
    return <>{children}</>;
  }
};
export default AuthGuard;