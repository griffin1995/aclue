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
import { loginAction, getCurrentUser } from '@/app/actions/auth';
import { LoginForm } from '@/components/auth/LoginForm';

// Force dynamic rendering for authentication check
export const dynamic = stryMutAct_9fa48("5") ? "" : (stryCov_9fa48("5"), 'force-dynamic');

/**
 * Enhanced Login Page - App Router Implementation
 *
 * Server-rendered authentication page with enhanced security and performance.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - Server actions for secure form processing
 * - Automatic authentication check and redirect
 * - Enhanced security with minimal client-side JavaScript
 * - Full compatibility with existing Supabase auth system
 *
 * Security Improvements:
 * - Server-side form validation
 * - HTTP-only cookie authentication
 * - CSRF protection
 * - Automatic session validation
 */

interface LoginPageProps {
  searchParams: {
    redirect?: string;
    error?: string;
  };
}
export const metadata = stryMutAct_9fa48("6") ? {} : (stryCov_9fa48("6"), {
  title: stryMutAct_9fa48("7") ? "" : (stryCov_9fa48("7"), 'Sign in - aclue'),
  description: stryMutAct_9fa48("8") ? "" : (stryCov_9fa48("8"), 'Sign in to your aclue account to access personalised gift recommendations')
});
export default async function LoginPage({
  searchParams
}: LoginPageProps) {
  if (stryMutAct_9fa48("9")) {
    {}
  } else {
    stryCov_9fa48("9");
    // Server-side authentication check - redirect if already authenticated
    const currentUser = await getCurrentUser();
    if (stryMutAct_9fa48("11") ? false : stryMutAct_9fa48("10") ? true : (stryCov_9fa48("10", "11"), currentUser)) {
      if (stryMutAct_9fa48("12")) {
        {}
      } else {
        stryCov_9fa48("12");
        const redirectTo = stryMutAct_9fa48("15") ? searchParams.redirect && '/dashboard' : stryMutAct_9fa48("14") ? false : stryMutAct_9fa48("13") ? true : (stryCov_9fa48("13", "14", "15"), searchParams.redirect || (stryMutAct_9fa48("16") ? "" : (stryCov_9fa48("16"), '/dashboard')));
        redirect(redirectTo);
      }
    }
    return <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <LoginForm loginAction={loginAction} redirectUrl={searchParams.redirect} error={searchParams.error} />
    </div>;
  }
}