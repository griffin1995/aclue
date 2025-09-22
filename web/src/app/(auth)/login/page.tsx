import React from 'react'
import { redirect } from 'next/navigation'
import { loginAction, getCurrentUser } from '@/app/actions/auth'
import { LoginForm } from '@/components/auth/LoginForm'

// Force dynamic rendering for authentication check
export const dynamic = 'force-dynamic'

/**
 * Enhanced Login Page - App Router Implementation
 *
 * Server-rendered authentication page with enhanced security and performance.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - Server actions for secure form processing
 * - Automatic authentication check and redirect
 * - Enhanced security with minimal client-side JavaScript
 * - Full compatibility with existing Supabase auth system
 *
 * Security Improvements:
 * - Server-side form validation
 * - HTTP-only cookie authentication
 * - CSRF protection
 * - Automatic session validation
 */

interface LoginPageProps {
  searchParams: {
    redirect?: string
    error?: string
  }
}

export const metadata = {
  title: 'Sign in - Aclue',
  description: 'Sign in to your Aclue account to access personalised gift recommendations',
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Server-side authentication check - redirect if already authenticated
  const currentUser = await getCurrentUser()

  if (currentUser) {
    const redirectTo = searchParams.redirect || '/dashboard'
    redirect(redirectTo)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      <LoginForm
        loginAction={loginAction}
        redirectUrl={searchParams.redirect}
        error={searchParams.error}
      />
    </div>
  )
}