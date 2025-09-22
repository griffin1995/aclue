import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'

// Force dynamic rendering for authentication check
export const dynamic = 'force-dynamic'

/**
 * Dashboard Layout - App Router Implementation
 *
 * Protected layout for dashboard pages with automatic authentication.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side authentication enforcement
 * - Automatic redirect for unauthenticated users
 * - Shared dashboard structure
 * - Enhanced security validation
 */

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Server-side authentication check - redirect if not authenticated
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/auth/login')
  }

  return (
    <div className="dashboard-layout">
      {children}
    </div>
  )
}