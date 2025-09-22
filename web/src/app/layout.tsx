import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aclue - AI-Powered Gifting Platform',
  description: 'Discover perfect gifts with AI-powered recommendations',
  keywords: ['gifts', 'AI', 'recommendations', 'personalised shopping'],
  authors: [{ name: 'Aclue Team' }],
  creator: 'Aclue Ltd',
  publisher: 'Aclue Ltd',
  metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL || 'https://aclue.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Aclue - AI-Powered Gifting Platform',
    description: 'Discover perfect gifts with AI-powered recommendations',
    url: '/',
    siteName: 'Aclue',
    images: [
      {
        url: '/aclue_text_clean.png',
        width: 1200,
        height: 630,
        alt: 'Aclue Logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aclue - AI-Powered Gifting Platform',
    description: 'Discover perfect gifts with AI-powered recommendations',
    images: ['/aclue_text_clean.png'],
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}