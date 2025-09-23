import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import WebVitalsReporter from '@/components/performance/WebVitalsReporter'

// Configure Inter font with proper settings
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

// Root metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://aclue.app'),
  title: {
    template: '%s | aclue',
    default: 'aclue - AI-powered gifting platform'
  },
  description: 'Discover the perfect gifts with AI-powered recommendations. aclue makes gift-giving effortless and meaningful.',
  keywords: ['gifts', 'AI', 'recommendations', 'gifting', 'presents', 'shopping'],
  authors: [{ name: 'aclue' }],
  creator: 'aclue',
  publisher: 'aclue',
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
    siteName: 'aclue',
    title: 'aclue - AI-powered gifting platform',
    description: 'Discover the perfect gifts with AI-powered recommendations. aclue makes gift-giving effortless and meaningful.',
    images: [
      {
        url: '/aclue_text_clean.png',
        width: 1200,
        height: 630,
        alt: 'aclue - AI-powered gifting platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'aclue - AI-powered gifting platform',
    description: 'Discover the perfect gifts with AI-powered recommendations. aclue makes gift-giving effortless and meaningful.',
    images: ['/aclue_text_clean.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://aclue.app',
    languages: {
      'en-GB': 'https://aclue.app',
      'en-US': 'https://aclue.app',
    },
  },
}

// Root layout component with proper TypeScript typing
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <WebVitalsReporter />
      </body>
    </html>
  )
}