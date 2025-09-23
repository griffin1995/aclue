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
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Gift } from 'lucide-react';

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
  children: React.ReactNode;
}
export default function MarketingLayout({
  children
}: MarketingLayoutProps) {
  if (stryMutAct_9fa48("366")) {
    {}
  } else {
    stryCov_9fa48("366");
    return <>
      {/* Marketing Navigation - Server Rendered */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image src="/aclue_text_clean.png" alt="aclue - AI-powered gifting platform" width={120} height={32} className="h-8 w-auto object-contain" priority />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                About
              </Link>
              <Link href="/features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Reviews
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Contact
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
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
                <Image src="/aclue_text_clean.png" alt="aclue Logo" width={120} height={32} className="h-8 w-auto object-contain brightness-0 invert" />
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
            <p>&copy; 2025 aclue Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={stryMutAct_9fa48("367") ? {} : (stryCov_9fa48("367"), {
        __html: JSON.stringify(stryMutAct_9fa48("368") ? {} : (stryCov_9fa48("368"), {
          '@context': stryMutAct_9fa48("369") ? "" : (stryCov_9fa48("369"), 'https://schema.org'),
          '@type': stryMutAct_9fa48("370") ? "" : (stryCov_9fa48("370"), 'Organization'),
          name: stryMutAct_9fa48("371") ? "" : (stryCov_9fa48("371"), 'aclue'),
          description: stryMutAct_9fa48("372") ? "" : (stryCov_9fa48("372"), 'AI-powered gifting platform that transforms how gifts are chosen'),
          url: stryMutAct_9fa48("373") ? "" : (stryCov_9fa48("373"), 'https://aclue.app'),
          logo: stryMutAct_9fa48("374") ? "" : (stryCov_9fa48("374"), 'https://aclue.app/aclue_text_clean.png'),
          sameAs: stryMutAct_9fa48("375") ? [] : (stryCov_9fa48("375"), [stryMutAct_9fa48("376") ? "" : (stryCov_9fa48("376"), 'https://twitter.com/aclue'), stryMutAct_9fa48("377") ? "" : (stryCov_9fa48("377"), 'https://linkedin.com/company/aclue'), stryMutAct_9fa48("378") ? "" : (stryCov_9fa48("378"), 'https://instagram.com/aclue')]),
          address: stryMutAct_9fa48("379") ? {} : (stryCov_9fa48("379"), {
            '@type': stryMutAct_9fa48("380") ? "" : (stryCov_9fa48("380"), 'PostalAddress'),
            addressCountry: stryMutAct_9fa48("381") ? "" : (stryCov_9fa48("381"), 'GB')
          })
        }))
      })} />
    </>;
  }
}

/**
 * Default metadata for marketing pages
 * Can be overridden by individual pages
 */
export const metadata: Metadata = stryMutAct_9fa48("382") ? {} : (stryCov_9fa48("382"), {
  title: stryMutAct_9fa48("383") ? {} : (stryCov_9fa48("383"), {
    template: stryMutAct_9fa48("384") ? "" : (stryCov_9fa48("384"), '%s | aclue - AI-Powered Gifting Platform'),
    default: stryMutAct_9fa48("385") ? "" : (stryCov_9fa48("385"), 'aclue - AI-Powered Gifting Platform')
  }),
  description: stryMutAct_9fa48("386") ? "" : (stryCov_9fa48("386"), 'Transform how gifts are chosen with AI-powered recommendations. Swipe through products, train our AI, and discover perfect gifts every time.'),
  keywords: stryMutAct_9fa48("387") ? [] : (stryCov_9fa48("387"), [stryMutAct_9fa48("388") ? "" : (stryCov_9fa48("388"), 'AI gifts'), stryMutAct_9fa48("389") ? "" : (stryCov_9fa48("389"), 'gift recommendations'), stryMutAct_9fa48("390") ? "" : (stryCov_9fa48("390"), 'personalised gifts'), stryMutAct_9fa48("391") ? "" : (stryCov_9fa48("391"), 'gift finder'), stryMutAct_9fa48("392") ? "" : (stryCov_9fa48("392"), 'machine learning gifts'), stryMutAct_9fa48("393") ? "" : (stryCov_9fa48("393"), 'intelligent gift discovery'), stryMutAct_9fa48("394") ? "" : (stryCov_9fa48("394"), 'gift ideas AI')]),
  authors: stryMutAct_9fa48("395") ? [] : (stryCov_9fa48("395"), [stryMutAct_9fa48("396") ? {} : (stryCov_9fa48("396"), {
    name: stryMutAct_9fa48("397") ? "" : (stryCov_9fa48("397"), 'aclue Ltd')
  })]),
  creator: stryMutAct_9fa48("398") ? "" : (stryCov_9fa48("398"), 'aclue Ltd'),
  publisher: stryMutAct_9fa48("399") ? "" : (stryCov_9fa48("399"), 'aclue Ltd'),
  robots: stryMutAct_9fa48("400") ? {} : (stryCov_9fa48("400"), {
    index: stryMutAct_9fa48("401") ? false : (stryCov_9fa48("401"), true),
    follow: stryMutAct_9fa48("402") ? false : (stryCov_9fa48("402"), true),
    googleBot: stryMutAct_9fa48("403") ? {} : (stryCov_9fa48("403"), {
      index: stryMutAct_9fa48("404") ? false : (stryCov_9fa48("404"), true),
      follow: stryMutAct_9fa48("405") ? false : (stryCov_9fa48("405"), true),
      'max-video-preview': stryMutAct_9fa48("406") ? +1 : (stryCov_9fa48("406"), -1),
      'max-image-preview': stryMutAct_9fa48("407") ? "" : (stryCov_9fa48("407"), 'large'),
      'max-snippet': stryMutAct_9fa48("408") ? +1 : (stryCov_9fa48("408"), -1)
    })
  }),
  openGraph: stryMutAct_9fa48("409") ? {} : (stryCov_9fa48("409"), {
    type: stryMutAct_9fa48("410") ? "" : (stryCov_9fa48("410"), 'website'),
    locale: stryMutAct_9fa48("411") ? "" : (stryCov_9fa48("411"), 'en_GB'),
    url: stryMutAct_9fa48("412") ? "" : (stryCov_9fa48("412"), 'https://aclue.app'),
    siteName: stryMutAct_9fa48("413") ? "" : (stryCov_9fa48("413"), 'aclue'),
    title: stryMutAct_9fa48("414") ? "" : (stryCov_9fa48("414"), 'aclue - AI-Powered Gifting Platform'),
    description: stryMutAct_9fa48("415") ? "" : (stryCov_9fa48("415"), 'Transform how gifts are chosen with AI-powered recommendations'),
    images: stryMutAct_9fa48("416") ? [] : (stryCov_9fa48("416"), [stryMutAct_9fa48("417") ? {} : (stryCov_9fa48("417"), {
      url: stryMutAct_9fa48("418") ? "" : (stryCov_9fa48("418"), '/aclue_text_clean.png'),
      width: 1200,
      height: 630,
      alt: stryMutAct_9fa48("419") ? "" : (stryCov_9fa48("419"), 'aclue - AI-Powered Gifting Platform')
    })])
  }),
  twitter: stryMutAct_9fa48("420") ? {} : (stryCov_9fa48("420"), {
    card: stryMutAct_9fa48("421") ? "" : (stryCov_9fa48("421"), 'summary_large_image'),
    title: stryMutAct_9fa48("422") ? "" : (stryCov_9fa48("422"), 'aclue - AI-Powered Gifting Platform'),
    description: stryMutAct_9fa48("423") ? "" : (stryCov_9fa48("423"), 'Transform how gifts are chosen with AI-powered recommendations'),
    images: stryMutAct_9fa48("424") ? [] : (stryCov_9fa48("424"), [stryMutAct_9fa48("425") ? "" : (stryCov_9fa48("425"), '/aclue_text_clean.png')]),
    creator: stryMutAct_9fa48("426") ? "" : (stryCov_9fa48("426"), '@aclue')
  }),
  viewport: stryMutAct_9fa48("427") ? {} : (stryCov_9fa48("427"), {
    width: stryMutAct_9fa48("428") ? "" : (stryCov_9fa48("428"), 'device-width'),
    initialScale: 1,
    maximumScale: 1
  }),
  themeColor: stryMutAct_9fa48("429") ? "" : (stryCov_9fa48("429"), '#6366f1'),
  manifest: stryMutAct_9fa48("430") ? "" : (stryCov_9fa48("430"), '/manifest.json'),
  alternates: stryMutAct_9fa48("431") ? {} : (stryCov_9fa48("431"), {
    canonical: stryMutAct_9fa48("432") ? "" : (stryCov_9fa48("432"), 'https://aclue.app')
  })
});