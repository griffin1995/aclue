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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Gift, User, Menu, X, Search, ShoppingBag } from 'lucide-react';
import { tokenManager } from '@/lib/api';

export function ShopNavigation() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = tokenManager.getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  const navigationItems = [
    { href: '/discover', label: 'Discover', icon: Gift },
    { href: '/search', label: 'Search', icon: Search },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Back Navigation */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
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
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated === null ? (
                // Loading state
                <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
              ) : isAuthenticated ? (
                // Authenticated user actions
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                // Guest user actions
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Auth Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Cart
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-3 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}