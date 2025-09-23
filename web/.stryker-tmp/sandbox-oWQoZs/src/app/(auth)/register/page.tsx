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
import { registerAction, getCurrentUser } from '@/app/actions/auth';
import { RegisterForm } from '@/components/auth/RegisterForm';

// Force dynamic rendering for authentication check
export const dynamic = stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), 'force-dynamic');

/**
 * Enhanced Registration Page - App Router Implementation
 *
 * Server-rendered registration page with comprehensive validation and security.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - Multi-step form with server actions
 * - Comprehensive validation and error handling
 * - Enhanced security with minimal client-side JavaScript
 * - Full compatibility with existing Supabase auth system
 *
 * Security Improvements:
 * - Server-side form validation with Zod schemas
 * - Password strength validation
 * - HTTP-only cookie authentication
 * - CSRF protection
 * - Automatic session validation
 */

interface RegisterPageProps {
  searchParams: {
    redirect?: string;
    error?: string;
  };
}
export const metadata = stryMutAct_9fa48("18") ? {} : (stryCov_9fa48("18"), {
  title: stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), 'Create account - aclue'),
  description: stryMutAct_9fa48("20") ? "" : (stryCov_9fa48("20"), 'Create your aclue account to start discovering perfect gifts with AI-powered recommendations')
});
export default async function RegisterPage({
  searchParams
}: RegisterPageProps) {
  if (stryMutAct_9fa48("21")) {
    {}
  } else {
    stryCov_9fa48("21");
    // Server-side authentication check - redirect if already authenticated
    const currentUser = await getCurrentUser();
    if (stryMutAct_9fa48("23") ? false : stryMutAct_9fa48("22") ? true : (stryCov_9fa48("22", "23"), currentUser)) {
      if (stryMutAct_9fa48("24")) {
        {}
      } else {
        stryCov_9fa48("24");
        const redirectTo = stryMutAct_9fa48("27") ? searchParams.redirect && '/dashboard' : stryMutAct_9fa48("26") ? false : stryMutAct_9fa48("25") ? true : (stryCov_9fa48("25", "26", "27"), searchParams.redirect || (stryMutAct_9fa48("28") ? "" : (stryCov_9fa48("28"), '/dashboard')));
        redirect(redirectTo);
      }
    }
    return <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <RegisterForm registerAction={registerAction} redirectUrl={searchParams.redirect} error={searchParams.error} />
    </div>;
  }
}