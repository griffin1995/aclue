import Link from 'next/link'

/**
 * Server Navigation Component
 *
 * Main navigation menu rendered on the server.
 * Provides primary navigation links with performance optimisation.
 *
 * Features:
 * - Server-side rendering
 * - Responsive design
 * - Semantic HTML structure
 * - Accessibility support
 */
export default function ServerNavigation() {
  const navigationItems = [
    {
      name: 'Discover',
      href: '/discover',
      description: 'Find perfect gifts with AI recommendations'
    },
    {
      name: 'How It Works',
      href: '/about',
      description: 'Learn about our AI-powered gifting platform'
    },
    {
      name: 'Pricing',
      href: '/pricing',
      description: 'Simple, transparent pricing'
    }
  ]

  return (
    <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
          title={item.description}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}