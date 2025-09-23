import aclueMarketingPageOptimized from '@/components/aclueMarketingPageOptimized'

/**
 * App Router Landing Page - Optimized Hybrid Implementation
 *
 * This page serves as the main application entry point when maintenance mode is disabled.
 * Now uses optimized hybrid server/client architecture for improved performance and SEO.
 *
 * Features:
 * - Hybrid server/client component architecture (50% server rendered)
 * - Static content server-rendered for optimal SEO and performance
 * - Interactive elements client-side for enhanced user experience
 * - Progressive enhancement patterns throughout
 * - Optimal Core Web Vitals performance
 *
 * Architecture:
 * - Server components: Hero content, features, testimonials, footer
 * - Client components: Navigation interactions, animations, forms
 * - Achieves Phase 5 target of 50% server component rendering
 * - Integrates with App Router authentication system
 */

export default function LandingPageAppRouter() {
  console.log('🏠 Landing page (App Router - Optimized) rendered')

  return (
    <main className="min-h-screen">
      <aclueMarketingPageOptimized />
    </main>
  )
}

/**
 * Metadata for the landing page
 */
export const metadata = {
  title: 'aclue - A Data-Led Insight Layer That Transforms How Gifts Are Chosen',
  description: 'Swipe through products, train our AI to understand your taste, and get personalised gift recommendations that actually make sense. No more guessing, no more gift fails.',
  keywords: 'gifts, AI recommendations, gift ideas, personalised gifts, gift finder, machine learning, swipe interface',
  openGraph: {
    title: 'aclue - A Data-Led Insight Layer That Transforms How Gifts Are Chosen',
    description: 'Discover perfect gifts with AI. Swipe through products, get personalised recommendations, and create shareable gift links.',
    images: ['/aclue_text_clean.png'],
    url: 'https://aclue.app/landingpage',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'aclue - A Data-Led Insight Layer That Transforms How Gifts Are Chosen',
    description: 'Discover perfect gifts with AI. Swipe through products, get personalised recommendations, and create shareable gift links.',
    images: ['/aclue_text_clean.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}