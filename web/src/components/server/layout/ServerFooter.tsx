import Link from 'next/link'
import Image from 'next/image'

/**
 * Server Footer Component
 *
 * Site footer rendered on the server for optimal performance.
 * Provides company information, legal links, and secondary navigation.
 *
 * Features:
 * - Server-side rendering for SEO
 * - Comprehensive site links
 * - Company branding
 * - Legal compliance links
 */
export default function ServerFooter() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'How It Works', href: '/about' },
        { name: 'Discover Gifts', href: '/discover' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Help Centre', href: '/help' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press Kit', href: '/press-kit' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookie-policy' },
        { name: 'Data Protection', href: '/data-protection' }
      ]
    }
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/aclue_text_clean.png"
                alt="Aclue Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI-powered gifting platform that helps you discover perfect gifts
              for every occasion and recipient.
            </p>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Aclue Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/accessibility"
              className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}