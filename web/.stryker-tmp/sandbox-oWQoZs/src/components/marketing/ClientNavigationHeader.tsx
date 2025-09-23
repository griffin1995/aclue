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
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Menu, X, Gift } from 'lucide-react';

/**
 * Client Navigation Header - Client Component
 *
 * Interactive navigation with mobile menu, hover effects, and responsive behavior.
 * Provides dynamic functionality that requires client-side JavaScript.
 *
 * Features:
 * - Mobile menu toggle
 * - Hover animations
 * - Responsive navigation
 * - Progressive enhancement
 */

export default function ClientNavigationHeader() {
  if (stryMutAct_9fa48("3811")) {
    {}
  } else {
    stryCov_9fa48("3811");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(stryMutAct_9fa48("3812") ? true : (stryCov_9fa48("3812"), false));
    const toggleMobileMenu = () => {
      if (stryMutAct_9fa48("3813")) {
        {}
      } else {
        stryCov_9fa48("3813");
        setIsMobileMenuOpen(stryMutAct_9fa48("3814") ? isMobileMenuOpen : (stryCov_9fa48("3814"), !isMobileMenuOpen));
      }
    };
    return <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/aclue_text_clean.png" alt="aclue Logo" width={120} height={32} className="h-8 w-auto object-contain" priority onError={e => {
              if (stryMutAct_9fa48("3815")) {
                {}
              } else {
                stryCov_9fa48("3815");
                // Fallback to Gift icon if logo fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = stryMutAct_9fa48("3816") ? "" : (stryCov_9fa48("3816"), 'none');
                const fallbackDiv = target.nextElementSibling as HTMLElement;
                if (stryMutAct_9fa48("3818") ? false : stryMutAct_9fa48("3817") ? true : (stryCov_9fa48("3817", "3818"), fallbackDiv)) fallbackDiv.style.display = stryMutAct_9fa48("3819") ? "" : (stryCov_9fa48("3819"), 'flex');
              }
            }} />
            <div className="hidden w-8 h-8 bg-primary-600 rounded-lg items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/testimonials" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Reviews
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Sign In
            </Link>
            <motion.div whileHover={stryMutAct_9fa48("3820") ? {} : (stryCov_9fa48("3820"), {
              scale: 1.05
            })} whileTap={stryMutAct_9fa48("3821") ? {} : (stryCov_9fa48("3821"), {
              scale: 0.95
            })}>
              <Link href="/auth/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors" aria-label="Toggle mobile menu">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {stryMutAct_9fa48("3824") ? isMobileMenuOpen || <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: 'auto'
        }} exit={{
          opacity: 0,
          height: 0
        }} className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Reviews
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
              <div className="border-t border-gray-200 pt-4 px-4">
                <Link href="/auth/login" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors mb-3" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth/register" className="block bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div> : stryMutAct_9fa48("3823") ? false : stryMutAct_9fa48("3822") ? true : (stryCov_9fa48("3822", "3823", "3824"), isMobileMenuOpen && <motion.div initial={stryMutAct_9fa48("3825") ? {} : (stryCov_9fa48("3825"), {
          opacity: 0,
          height: 0
        })} animate={stryMutAct_9fa48("3826") ? {} : (stryCov_9fa48("3826"), {
          opacity: 1,
          height: stryMutAct_9fa48("3827") ? "" : (stryCov_9fa48("3827"), 'auto')
        })} exit={stryMutAct_9fa48("3828") ? {} : (stryCov_9fa48("3828"), {
          opacity: 0,
          height: 0
        })} className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={stryMutAct_9fa48("3829") ? () => undefined : (stryCov_9fa48("3829"), () => setIsMobileMenuOpen(stryMutAct_9fa48("3830") ? true : (stryCov_9fa48("3830"), false)))}>
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={stryMutAct_9fa48("3831") ? () => undefined : (stryCov_9fa48("3831"), () => setIsMobileMenuOpen(stryMutAct_9fa48("3832") ? true : (stryCov_9fa48("3832"), false)))}>
                Pricing
              </Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={stryMutAct_9fa48("3833") ? () => undefined : (stryCov_9fa48("3833"), () => setIsMobileMenuOpen(stryMutAct_9fa48("3834") ? true : (stryCov_9fa48("3834"), false)))}>
                Reviews
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={stryMutAct_9fa48("3835") ? () => undefined : (stryCov_9fa48("3835"), () => setIsMobileMenuOpen(stryMutAct_9fa48("3836") ? true : (stryCov_9fa48("3836"), false)))}>
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2" onClick={stryMutAct_9fa48("3837") ? () => undefined : (stryCov_9fa48("3837"), () => setIsMobileMenuOpen(stryMutAct_9fa48("3838") ? true : (stryCov_9fa48("3838"), false)))}>
                Contact
              </Link>
              <div className="border-t border-gray-200 pt-4 px-4">
                <Link href="/auth/login" className="block text-gray-700 hover:text-primary-600 font-medium transition-colors mb-3" onClick={stryMutAct_9fa48("3839") ? () => undefined : (stryCov_9fa48("3839"), () => setIsMobileMenuOpen(stryMutAct_9fa48("3840") ? true : (stryCov_9fa48("3840"), false)))}>
                  Sign In
                </Link>
                <Link href="/auth/register" className="block bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center" onClick={stryMutAct_9fa48("3841") ? () => undefined : (stryCov_9fa48("3841"), () => setIsMobileMenuOpen(stryMutAct_9fa48("3842") ? true : (stryCov_9fa48("3842"), false)))}>
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>)}
      </div>
    </nav>;
  }
}