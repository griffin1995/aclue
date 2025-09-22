import Link from 'next/link'
import Image from 'next/image'
import ServerNavigation from './ServerNavigation'

/**
 * Server Header Component
 *
 * Main navigation header rendered on the server for optimal performance.
 * Provides consistent branding and navigation across all pages.
 *
 * Features:
 * - Server-side rendering for SEO
 * - Responsive design
 * - Aclue branding
 * - Main navigation
 *
 * Performance Benefits:
 * - No client-side JavaScript required
 * - Faster initial page load
 * - Better Core Web Vitals scores
 */
export default function ServerHeader() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/aclue_text_clean.png"
              alt="Aclue Logo"
              width={120}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation */}
          <ServerNavigation />

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}