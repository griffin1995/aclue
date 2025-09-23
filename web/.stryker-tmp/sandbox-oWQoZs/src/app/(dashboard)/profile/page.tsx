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
import { getCurrentUser, logoutAction } from '@/app/actions/auth';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSettings } from '@/components/profile/ProfileSettings';

// Force dynamic rendering for authentication check
export const dynamic = stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), 'force-dynamic');

/**
 * Enhanced Profile Page - App Router Implementation
 *
 * Server-rendered user profile page with comprehensive user management.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - Server-side authentication validation
 * - Automatic redirect for unauthenticated users
 * - Server actions for profile updates
 * - Enhanced security with minimal client-side JavaScript
 * - Full compatibility with existing Supabase auth system
 *
 * Security Improvements:
 * - Server-side user data fetching
 * - HTTP-only cookie authentication
 * - Protected route enforcement
 * - Automatic session validation
 */

export const metadata = stryMutAct_9fa48("37") ? {} : (stryCov_9fa48("37"), {
  title: stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), 'Profile - aclue'),
  description: stryMutAct_9fa48("39") ? "" : (stryCov_9fa48("39"), 'Manage your aclue account settings and preferences')
});
export default async function ProfilePage() {
  if (stryMutAct_9fa48("40")) {
    {}
  } else {
    stryCov_9fa48("40");
    // Server-side authentication check - redirect if not authenticated
    const currentUser = await getCurrentUser();
    if (stryMutAct_9fa48("43") ? false : stryMutAct_9fa48("42") ? true : stryMutAct_9fa48("41") ? currentUser : (stryCov_9fa48("41", "42", "43"), !currentUser)) {
      if (stryMutAct_9fa48("44")) {
        {}
      } else {
        stryCov_9fa48("44");
        redirect(stryMutAct_9fa48("45") ? "" : (stryCov_9fa48("45"), '/auth/login?redirect=/profile'));
      }
    }
    return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProfileHeader user={currentUser} logoutAction={logoutAction} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Settings */}
          <ProfileSettings user={currentUser} />
        </div>
      </main>
    </div>;
  }
}