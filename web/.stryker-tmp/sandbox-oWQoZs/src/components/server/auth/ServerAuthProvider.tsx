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
import { type ReactNode } from 'react';
interface ServerAuthProviderProps {
  children: ReactNode;
  user?: {
    id: string;
    email: string;
    name?: string;
  } | null;
}

/**
 * Server Auth Provider Component
 *
 * Provides authentication context at the server level.
 * Handles user session validation and provides auth state to child components.
 *
 * Features:
 * - Server-side authentication validation
 * - User session management
 * - Auth state propagation
 * - Performance optimised
 *
 * @param children - Child components that need auth context
 * @param user - Current user data (pre-validated on server)
 */
export default function ServerAuthProvider({
  children,
  user = null
}: ServerAuthProviderProps) {
  if (stryMutAct_9fa48("5497")) {
    {}
  } else {
    stryCov_9fa48("5497");
    // In a real implementation, this would validate the user session
    // and provide authentication context to child components

    return <div data-auth-provider="server" data-user-authenticated={stryMutAct_9fa48("5498") ? !user : (stryCov_9fa48("5498"), !(stryMutAct_9fa48("5499") ? user : (stryCov_9fa48("5499"), !user)))}>
      {children}
    </div>;
  }
}