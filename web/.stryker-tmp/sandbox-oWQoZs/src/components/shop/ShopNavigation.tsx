/**
 * Shop Navigation - Client Component
 *
 * Interactive navigation component for the shop section.
 * This is a client component to handle:
 * - Authentication state
 * - Interactive navigation
 * - Dynamic user interface elements
 *
 * Features:
 * - Responsive design
 * - Authentication-aware navigation
 * - Glassmorphism styling
 * - Progressive enhancement
 */
// @ts-nocheck


'use client';

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
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Gift, User, Menu, X, Search, ShoppingBag } from 'lucide-react';
import { tokenManager } from '@/lib/api';
export function ShopNavigation() {
  if (stryMutAct_9fa48("6350")) {
    {}
  } else {
    stryCov_9fa48("6350");
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(stryMutAct_9fa48("6351") ? true : (stryCov_9fa48("6351"), false));

    // Check authentication status
    useEffect(() => {
      if (stryMutAct_9fa48("6352")) {
        {}
      } else {
        stryCov_9fa48("6352");
        const token = tokenManager.getAccessToken();
        setIsAuthenticated(stryMutAct_9fa48("6353") ? !token : (stryCov_9fa48("6353"), !(stryMutAct_9fa48("6354") ? token : (stryCov_9fa48("6354"), !token))));
      }
    }, stryMutAct_9fa48("6355") ? ["Stryker was here"] : (stryCov_9fa48("6355"), []));
    const navigationItems = stryMutAct_9fa48("6356") ? [] : (stryCov_9fa48("6356"), [stryMutAct_9fa48("6357") ? {} : (stryCov_9fa48("6357"), {
      href: stryMutAct_9fa48("6358") ? "" : (stryCov_9fa48("6358"), '/discover'),
      label: stryMutAct_9fa48("6359") ? "" : (stryCov_9fa48("6359"), 'Discover'),
      icon: Gift
    }), stryMutAct_9fa48("6360") ? {} : (stryCov_9fa48("6360"), {
      href: stryMutAct_9fa48("6361") ? "" : (stryCov_9fa48("6361"), '/search'),
      label: stryMutAct_9fa48("6362") ? "" : (stryCov_9fa48("6362"), 'Search'),
      icon: Search
    })]);
    return <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Back Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">aclue</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map(item => {
              if (stryMutAct_9fa48("6363")) {
                {}
              } else {
                stryCov_9fa48("6363");
                const Icon = item.icon;
                const isActive = stryMutAct_9fa48("6366") ? pathname === item.href && pathname.startsWith(item.href + '/') : stryMutAct_9fa48("6365") ? false : stryMutAct_9fa48("6364") ? true : (stryCov_9fa48("6364", "6365", "6366"), (stryMutAct_9fa48("6368") ? pathname !== item.href : stryMutAct_9fa48("6367") ? false : (stryCov_9fa48("6367", "6368"), pathname === item.href)) || (stryMutAct_9fa48("6369") ? pathname.endsWith(item.href + '/') : (stryCov_9fa48("6369"), pathname.startsWith(item.href + (stryMutAct_9fa48("6370") ? "" : (stryCov_9fa48("6370"), '/'))))));
                return <Link key={item.href} href={item.href} className={stryMutAct_9fa48("6371") ? `` : (stryCov_9fa48("6371"), `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive ? stryMutAct_9fa48("6372") ? "" : (stryCov_9fa48("6372"), 'bg-primary-100 text-primary-700 font-medium') : stryMutAct_9fa48("6373") ? "" : (stryCov_9fa48("6373"), 'text-gray-600 hover:text-primary-600 hover:bg-gray-50')}`)}>
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>;
              }
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center gap-3">
              {(stryMutAct_9fa48("6376") ? isAuthenticated !== null : stryMutAct_9fa48("6375") ? false : stryMutAct_9fa48("6374") ? true : (stryCov_9fa48("6374", "6375", "6376"), isAuthenticated === null)) ?
              // Loading state
              <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" /> : isAuthenticated ?
              // Authenticated user actions
              <>
                  <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                  <Link href="/cart" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </> :
              // Guest user actions
              <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    Sign Up
                  </Link>
                </>}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={stryMutAct_9fa48("6377") ? () => undefined : (stryCov_9fa48("6377"), () => setIsMobileMenuOpen(stryMutAct_9fa48("6378") ? isMobileMenuOpen : (stryCov_9fa48("6378"), !isMobileMenuOpen)))} className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors" aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {stryMutAct_9fa48("6381") ? isMobileMenuOpen || <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-100 text-primary-700 font-medium' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`} onClick={() => setIsMobileMenuOpen(false)}>
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>;
            })}
            </nav>

            {/* Mobile Auth Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isAuthenticated ? <div className="space-y-2">
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShoppingBag className="w-5 h-5" />
                    Cart
                  </Link>
                </div> : <div className="space-y-2">
                  <Link href="/auth/login" className="block px-4 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="block bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>}
            </div>
          </div> : stryMutAct_9fa48("6380") ? false : stryMutAct_9fa48("6379") ? true : (stryCov_9fa48("6379", "6380", "6381"), isMobileMenuOpen && <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigationItems.map(item => {
              if (stryMutAct_9fa48("6382")) {
                {}
              } else {
                stryCov_9fa48("6382");
                const Icon = item.icon;
                const isActive = stryMutAct_9fa48("6385") ? pathname === item.href && pathname.startsWith(item.href + '/') : stryMutAct_9fa48("6384") ? false : stryMutAct_9fa48("6383") ? true : (stryCov_9fa48("6383", "6384", "6385"), (stryMutAct_9fa48("6387") ? pathname !== item.href : stryMutAct_9fa48("6386") ? false : (stryCov_9fa48("6386", "6387"), pathname === item.href)) || (stryMutAct_9fa48("6388") ? pathname.endsWith(item.href + '/') : (stryCov_9fa48("6388"), pathname.startsWith(item.href + (stryMutAct_9fa48("6389") ? "" : (stryCov_9fa48("6389"), '/'))))));
                return <Link key={item.href} href={item.href} className={stryMutAct_9fa48("6390") ? `` : (stryCov_9fa48("6390"), `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? stryMutAct_9fa48("6391") ? "" : (stryCov_9fa48("6391"), 'bg-primary-100 text-primary-700 font-medium') : stryMutAct_9fa48("6392") ? "" : (stryCov_9fa48("6392"), 'text-gray-600 hover:text-primary-600 hover:bg-gray-50')}`)} onClick={stryMutAct_9fa48("6393") ? () => undefined : (stryCov_9fa48("6393"), () => setIsMobileMenuOpen(stryMutAct_9fa48("6394") ? true : (stryCov_9fa48("6394"), false)))}>
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>;
              }
            })}
            </nav>

            {/* Mobile Auth Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isAuthenticated ? <div className="space-y-2">
                  <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors" onClick={stryMutAct_9fa48("6395") ? () => undefined : (stryCov_9fa48("6395"), () => setIsMobileMenuOpen(stryMutAct_9fa48("6396") ? true : (stryCov_9fa48("6396"), false)))}>
                    <User className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 transition-colors" onClick={stryMutAct_9fa48("6397") ? () => undefined : (stryCov_9fa48("6397"), () => setIsMobileMenuOpen(stryMutAct_9fa48("6398") ? true : (stryCov_9fa48("6398"), false)))}>
                    <ShoppingBag className="w-5 h-5" />
                    Cart
                  </Link>
                </div> : <div className="space-y-2">
                  <Link href="/auth/login" className="block px-4 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors" onClick={stryMutAct_9fa48("6399") ? () => undefined : (stryCov_9fa48("6399"), () => setIsMobileMenuOpen(stryMutAct_9fa48("6400") ? true : (stryCov_9fa48("6400"), false)))}>
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="block bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center" onClick={stryMutAct_9fa48("6401") ? () => undefined : (stryCov_9fa48("6401"), () => setIsMobileMenuOpen(stryMutAct_9fa48("6402") ? true : (stryCov_9fa48("6402"), false)))}>
                    Sign Up
                  </Link>
                </div>}
            </div>
          </div>)}
      </div>
    </header>;
  }
}