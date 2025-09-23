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
import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/PageLoader';
interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
  requireAuth?: boolean;
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = stryMutAct_9fa48("3154") ? "" : (stryCov_9fa48("3154"), '/auth/login'),
  fallback,
  requireAuth = stryMutAct_9fa48("3155") ? false : (stryCov_9fa48("3155"), true)
}) => {
  if (stryMutAct_9fa48("3156")) {
    {}
  } else {
    stryCov_9fa48("3156");
    const {
      isAuthenticated,
      isInitialized,
      isLoading
    } = useAuth();
    const router = useRouter();

    // Show loading state while initializing
    if (stryMutAct_9fa48("3159") ? !isInitialized && isLoading : stryMutAct_9fa48("3158") ? false : stryMutAct_9fa48("3157") ? true : (stryCov_9fa48("3157", "3158", "3159"), (stryMutAct_9fa48("3160") ? isInitialized : (stryCov_9fa48("3160"), !isInitialized)) || isLoading)) {
      if (stryMutAct_9fa48("3161")) {
        {}
      } else {
        stryCov_9fa48("3161");
        return stryMutAct_9fa48("3164") ? fallback && <PageLoader text="Checking authentication..." /> : stryMutAct_9fa48("3163") ? false : stryMutAct_9fa48("3162") ? true : (stryCov_9fa48("3162", "3163", "3164"), fallback || <PageLoader text="Checking authentication..." />);
      }
    }

    // If auth is required but user is not authenticated
    if (stryMutAct_9fa48("3167") ? requireAuth || !isAuthenticated : stryMutAct_9fa48("3166") ? false : stryMutAct_9fa48("3165") ? true : (stryCov_9fa48("3165", "3166", "3167"), requireAuth && (stryMutAct_9fa48("3168") ? isAuthenticated : (stryCov_9fa48("3168"), !isAuthenticated)))) {
      if (stryMutAct_9fa48("3169")) {
        {}
      } else {
        stryCov_9fa48("3169");
        // Redirect to login with the specified redirect path
        const currentPath = router.asPath;
        const loginUrl = stryMutAct_9fa48("3170") ? `` : (stryCov_9fa48("3170"), `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        router.replace(loginUrl);
        return <PageLoader text="Redirecting to login..." />;
      }
    }

    // If user is authenticated but shouldn't be (e.g., login page)
    if (stryMutAct_9fa48("3173") ? !requireAuth || isAuthenticated : stryMutAct_9fa48("3172") ? false : stryMutAct_9fa48("3171") ? true : (stryCov_9fa48("3171", "3172", "3173"), (stryMutAct_9fa48("3174") ? requireAuth : (stryCov_9fa48("3174"), !requireAuth)) && isAuthenticated)) {
      if (stryMutAct_9fa48("3175")) {
        {}
      } else {
        stryCov_9fa48("3175");
        // Redirect authenticated users away from auth pages
        router.replace(stryMutAct_9fa48("3176") ? "" : (stryCov_9fa48("3176"), '/dashboard'));
        return <PageLoader text="Redirecting to dashboard..." />;
      }
    }
    return <>{children}</>;
  }
};
export default ProtectedRoute;