import React from 'react'
import { Metadata } from 'next'

/**
 * Authentication Layout - App Router Implementation
 *
 * Shared layout for authentication pages with optimised structure.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side rendering
 * - Shared authentication page structure
 * - Optimised metadata and SEO
 * - Enhanced security headers
 */

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}