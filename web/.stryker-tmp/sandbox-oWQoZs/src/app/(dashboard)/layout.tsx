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
import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/auth';

// Force dynamic rendering for authentication check
export const dynamic = stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), 'force-dynamic');

/**
 * Dashboard Layout - App Router Implementation
 *
 * Protected layout for dashboard pages with automatic authentication.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side authentication enforcement
 * - Automatic redirect for unauthenticated users
 * - Shared dashboard structure
 * - Enhanced security validation
 */

interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {
  if (stryMutAct_9fa48("30")) {
    {}
  } else {
    stryCov_9fa48("30");
    // Server-side authentication check - redirect if not authenticated
    const currentUser = await getCurrentUser();
    if (stryMutAct_9fa48("33") ? false : stryMutAct_9fa48("32") ? true : stryMutAct_9fa48("31") ? currentUser : (stryCov_9fa48("31", "32", "33"), !currentUser)) {
      if (stryMutAct_9fa48("34")) {
        {}
      } else {
        stryCov_9fa48("34");
        redirect(stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), '/auth/login'));
      }
    }
    return <div className="dashboard-layout">
      {children}
    </div>;
  }
}