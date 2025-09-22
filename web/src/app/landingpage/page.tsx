import AclueMarketingPage from '@/components/AclueMarketingPage'

/**
 * App Router Landing Page - Full Aclue Application
 *
 * This page serves as the main application entry point when maintenance mode is disabled.
 * It provides access to the full Aclue marketing site with all features and functionality.
 *
 * Features:
 * - Complete marketing site with hero, features, testimonials
 * - Authentication integration with App Router auth system
 * - Product discovery and all standard pages
 * - Bypasses maintenance mode restrictions
 * - Server-side rendering for optimal performance
 *
 * Architecture:
 * - Server component for optimal performance
 * - Integrates with existing Phase 3 authentication work
 * - Preserves all feature flags and auth routes
 * - Uses App Router patterns throughout
 */

export default function LandingPageAppRouter() {
  console.log('🏠 Landing page (App Router) rendered')

  return (
    <main className="min-h-screen">
      <AclueMarketingPage />
    </main>
  )
}

/**
 * Metadata for the landing page
 */
export const metadata = {
  title: 'Aclue - A Data-Led Insight Layer That Transforms How Gifts Are Chosen',
  description: 'Swipe through products, train our AI to understand your taste, and get personalised gift recommendations that actually make sense. No more guessing, no more gift fails.',
  keywords: 'gifts, AI recommendations, gift ideas, personalised gifts, gift finder, machine learning, swipe interface',
  openGraph: {
    title: 'Aclue - A Data-Led Insight Layer That Transforms How Gifts Are Chosen',
    description: 'Discover perfect gifts with AI. Swipe through products, get personalised recommendations, and create shareable gift links.',
    images: ['/aclue_text_clean.png'],
    url: 'https://aclue.app/landingpage',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aclue - A Data-Led Insight Layer That Transforms How Gifts Are Chosen',
    description: 'Discover perfect gifts with AI. Swipe through products, get personalised recommendations, and create shareable gift links.',
    images: ['/aclue_text_clean.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}