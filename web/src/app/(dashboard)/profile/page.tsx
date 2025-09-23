import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser, logoutAction } from '@/app/actions/auth'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileSettings } from '@/components/profile/ProfileSettings'

// Force dynamic rendering for authentication check
export const dynamic = 'force-dynamic'

/**
 * Enhanced Profile Page - App Router Implementation
 *
 * Server-rendered user profile page with comprehensive user management.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - Server-side authentication validation
 * - Automatic redirect for unauthenticated users
 * - Server actions for profile updates
 * - Enhanced security with minimal client-side JavaScript
 * - Full compatibility with existing Supabase auth system
 *
 * Security Improvements:
 * - Server-side user data fetching
 * - HTTP-only cookie authentication
 * - Protected route enforcement
 * - Automatic session validation
 */

export const metadata = {
  title: 'Profile - aclue',
  description: 'Manage your aclue account settings and preferences',
}

export default async function ProfilePage() {
  // Server-side authentication check - redirect if not authenticated
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/auth/login?redirect=/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ProfileHeader user={currentUser} logoutAction={logoutAction} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Settings */}
          <ProfileSettings user={currentUser} />
        </div>
      </main>
    </div>
  )
}