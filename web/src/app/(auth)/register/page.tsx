import React from 'react'
import { redirect } from 'next/navigation'
import { registerAction, getCurrentUser } from '@/app/actions/auth'
import { RegisterForm } from '@/components/auth/RegisterForm'

// Force dynamic rendering for authentication check
export const dynamic = 'force-dynamic'

/**
 * Enhanced Registration Page - App Router Implementation
 *
 * Server-rendered registration page with comprehensive validation and security.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - Multi-step form with server actions
 * - Comprehensive validation and error handling
 * - Enhanced security with minimal client-side JavaScript
 * - Full compatibility with existing Supabase auth system
 *
 * Security Improvements:
 * - Server-side form validation with Zod schemas
 * - Password strength validation
 * - HTTP-only cookie authentication
 * - CSRF protection
 * - Automatic session validation
 */

interface RegisterPageProps {
  searchParams: {
    redirect?: string
    error?: string
  }
}

export const metadata = {
  title: 'Create account - Aclue',
  description: 'Create your Aclue account to start discovering perfect gifts with AI-powered recommendations',
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  // Server-side authentication check - redirect if already authenticated
  const currentUser = await getCurrentUser()

  if (currentUser) {
    const redirectTo = searchParams.redirect || '/dashboard'
    redirect(redirectTo)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <RegisterForm
        registerAction={registerAction}
        redirectUrl={searchParams.redirect}
        error={searchParams.error}
      />
    </div>
  )
}