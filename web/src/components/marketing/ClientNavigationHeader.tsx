'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X, Gift } from 'lucide-react'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/aclue_text_clean.png"
              alt="aclue Logo"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              priority
              onError={(e) => {
                // Fallback to Gift icon if logo fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallbackDiv = target.nextElementSibling as HTMLElement;
                if (fallbackDiv) fallbackDiv.style.display = 'flex';
              }}
            />
            <div className="hidden w-8 h-8 bg-primary-600 rounded-lg items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/testimonials"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Reviews
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/features"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/testimonials"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reviews
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t border-gray-200 pt-4 px-4">
                <Link
                  href="/auth/login"
                  className="block text-gray-700 hover:text-primary-600 font-medium transition-colors mb-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}