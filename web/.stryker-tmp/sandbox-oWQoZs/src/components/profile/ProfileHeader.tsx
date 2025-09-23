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
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, ArrowLeft, Shield } from 'lucide-react';

/**
 * Enhanced Profile Header Component - Server Component
 *
 * Server-rendered profile header with user information and navigation.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - User information display
 * - Server action integration for logout
 * - Enhanced security indicators
 * - Responsive design with accessibility features
 */

interface ProfileHeaderProps {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    subscription_tier: string;
    created_at: string;
    updated_at: string;
  };
  logoutAction: () => Promise<void>;
}
export function ProfileHeader({
  user,
  logoutAction
}: ProfileHeaderProps) {
  if (stryMutAct_9fa48("4785")) {
    {}
  } else {
    stryCov_9fa48("4785");
    return <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Left side - Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                <Image src="/aclue_text_clean.png" alt="aclue logo" width={20} height={20} className="rounded-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-sm text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-600">{user.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  Secure Session
                </span>
              </div>
            </div>

            {/* User Avatar */}
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {stryMutAct_9fa48("4786") ? user.first_name : (stryCov_9fa48("4786"), user.first_name.charAt(0))}{stryMutAct_9fa48("4787") ? user.last_name : (stryCov_9fa48("4787"), user.last_name.charAt(0))}
              </span>
            </div>

            {/* Logout Button */}
            <form action={logoutAction}>
              <button type="submit" className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>;
  }
}