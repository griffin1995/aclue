import NewsletterMaintenancePage from '@/components/NewsletterMaintenancePage'

/**
 * App Router Root Page - Newsletter Landing Page
 *
 * This is the App Router implementation of the root page that provides:
 * 1. Newsletter signup as the primary landing page at /
 * 2. Beta program signup with email collection
 * 3. Future of gift discovery messaging
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - Newsletter signup using server actions
 * - Optimal performance with server components
 * - Preserves all Phase 3 authentication work
 * - Consistent branding with aclue_text_clean.png
 * - Always displays newsletter page (no redirects)
 *
 * Architecture:
 * - Server component for optimal performance
 * - No maintenance mode dependency
 * - Newsletter component handles client interactions
 * - Primary landing page for all users
 */

/**
 * Root page server component
 * Always displays the newsletter landing page
 */
export default function RootPage() {
  console.log('🏠 Newsletter landing page rendered at root')

  // Always render newsletter landing page - no redirects
  return (
    <main className="min-h-screen">
      <NewsletterMaintenancePage />
    </main>
  )
}

/**
 * Metadata for the root page
 */
export const metadata = {
  title: 'Aclue - AI-Powered Gift Discovery Platform',
  description: 'Aclue is launching soon! Join our beta program for early access to our AI-powered gift recommendation platform that transforms how gifts are chosen.',
  keywords: 'gifts, AI recommendations, gift ideas, beta signup, personalised gifts, neural network, coming soon',
  openGraph: {
    title: 'Aclue - AI-Powered Gift Discovery Platform',
    description: 'Join our beta program for early access to revolutionary AI-powered gift recommendations.',
    images: ['/aclue_text_clean.png'],
    url: 'https://aclue.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aclue - AI-Powered Gift Discovery Platform',
    description: 'Join our beta program for early access to revolutionary AI-powered gift recommendations.',
    images: ['/aclue_text_clean.png'],
  },
  robots: {
    index: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' ? false : true,
    follow: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' ? false : true,
  },
}