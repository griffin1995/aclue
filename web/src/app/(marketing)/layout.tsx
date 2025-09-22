import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Gift } from 'lucide-react'

/**
 * Marketing Layout - App Router Server Component
 *
 * Server-rendered layout for marketing pages providing:
 * - Consistent navigation across marketing sections
 * - SEO-optimised meta tags and structured data
 * - Performance-optimised server-side rendering
 * - Clean separation between marketing and app functionality
 *
 * Features:
 * - Server component for optimal performance
 * - Shared navigation and footer
 * - Progressive enhancement patterns
 * - Structured data for SEO
 * - British English throughout
 */

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <>
      {/* Marketing Navigation - Server Rendered */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/aclue_text_clean.png"
                alt="Aclue - AI-powered gifting platform"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/about"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                About
              </Link>
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
                href="/contact"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Contact
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
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
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Marketing Footer - Server Rendered */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/aclue_text_clean.png"
                  alt="Aclue Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 mb-4">
                A data-led insight layer that transforms how gifts are chosen.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/discover" className="hover:text-white transition-colors">
                    Try Demo
                  </Link>
                </li>
                <li>
                  <Link href="/landingpage" className="hover:text-white transition-colors">
                    Full App
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="hover:text-white transition-colors">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Centre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Aclue Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Aclue',
            description: 'AI-powered gifting platform that transforms how gifts are chosen',
            url: 'https://aclue.app',
            logo: 'https://aclue.app/aclue_text_clean.png',
            sameAs: [
              'https://twitter.com/aclue',
              'https://linkedin.com/company/aclue',
              'https://instagram.com/aclue'
            ],
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'GB'
            }
          })
        }}
      />
    </>
  )
}

/**
 * Default metadata for marketing pages
 * Can be overridden by individual pages
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Aclue - AI-Powered Gifting Platform',
    default: 'Aclue - AI-Powered Gifting Platform'
  },
  description: 'Transform how gifts are chosen with AI-powered recommendations. Swipe through products, train our AI, and discover perfect gifts every time.',
  keywords: [
    'AI gifts',
    'gift recommendations',
    'personalised gifts',
    'gift finder',
    'machine learning gifts',
    'intelligent gift discovery',
    'gift ideas AI'
  ],
  authors: [{ name: 'Aclue Ltd' }],
  creator: 'Aclue Ltd',
  publisher: 'Aclue Ltd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://aclue.app',
    siteName: 'Aclue',
    title: 'Aclue - AI-Powered Gifting Platform',
    description: 'Transform how gifts are chosen with AI-powered recommendations',
    images: [
      {
        url: '/aclue_text_clean.png',
        width: 1200,
        height: 630,
        alt: 'Aclue - AI-Powered Gifting Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aclue - AI-Powered Gifting Platform',
    description: 'Transform how gifts are chosen with AI-powered recommendations',
    images: ['/aclue_text_clean.png'],
    creator: '@aclue',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#6366f1',
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://aclue.app',
  },
}