import { Metadata } from 'next'
import NewsletterMaintenancePage from '@/components/NewsletterMaintenancePage'

export const metadata: Metadata = {
  title: 'aclue - The Future of Gift Discovery | AI-Powered Gifting Platform',
  description: 'Join the beta program for aclue, the revolutionary AI-powered platform that understands your unique gift preferences. Experience personalised recommendations that actually understand what you and your loved ones want.',
  keywords: ['AI gifts', 'gift discovery', 'personalised recommendations', 'gift beta', 'AI gifting', 'smart gifts', 'gift suggestions'],
  openGraph: {
    title: 'aclue - The Future of Gift Discovery',
    description: 'Join our exclusive beta program. AI-powered platform learning to understand your unique gift preferences.',
    images: [
      {
        url: '/aclue_text_clean.png',
        width: 1200,
        height: 630,
        alt: 'aclue - AI-Powered Gift Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'aclue - The Future of Gift Discovery',
    description: 'Join our exclusive beta program. AI-powered platform learning to understand your unique gift preferences.',
    images: ['/aclue_text_clean.png'],
  },
}

/**
 * Root Page - Premium Newsletter Landing
 *
 * Serves as the main landing page featuring the premium newsletter signup
 * for the aclue AI-powered gifting platform. Uses the existing working
 * API route structure with App Router for optimal performance.
 */
export default function HomePage() {
  return <NewsletterMaintenancePage />
}