import { redirect } from 'next/navigation'
import NewsletterMaintenancePage from '@/components/NewsletterMaintenancePage'

/**
 * App Router Root Page - Newsletter/Maintenance Mode Handler
 *
 * This is the App Router implementation of the root page that provides:
 * 1. Maintenance mode newsletter signup when NEXT_PUBLIC_MAINTENANCE_MODE=true
 * 2. Redirect to full application when NEXT_PUBLIC_MAINTENANCE_MODE=false
 *
 * Features:
 * - Server-side maintenance mode evaluation
 * - Newsletter signup using server actions
 * - Optimal performance with server components
 * - Preserves all Phase 3 authentication work
 * - Consistent branding with aclue_text_clean.png
 *
 * Architecture:
 * - Server component for optimal performance
 * - Server-side redirect when not in maintenance mode
 * - Newsletter component handles client interactions
 * - Integrates with existing feature flag system
 */

/**
 * Root page server component
 * Handles maintenance mode logic and newsletter display
 */
export default function RootPage() {
  // Server-side evaluation of maintenance mode
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'

  console.log('🏠 Root page rendered, maintenance mode:', isMaintenanceMode)

  // If not in maintenance mode, redirect to the full application
  if (!isMaintenanceMode) {
    console.log('🚀 Redirecting to landingpage - maintenance mode disabled')
    redirect('/landingpage')
  }

  // Render newsletter/maintenance page when in maintenance mode
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