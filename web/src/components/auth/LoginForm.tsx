'use client'

import React, { useState } from 'react'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react'

/**
 * Enhanced Login Form Component - App Router Implementation
 *
 * Client component optimised for server actions with minimal JavaScript.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Progressive enhancement with server actions
 * - Client-side state for UX (password visibility, loading states)
 * - Server-side validation and processing
 * - Enhanced error handling and user feedback
 * - Responsive design with accessibility features
 *
 * Security:
 * - Form data processed entirely server-side
 * - No sensitive data stored in client state
 * - CSRF protection through server actions
 * - Secure cookie-based authentication
 */

interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<any>
  redirectUrl?: string
  error?: string
}

export function LoginForm({ loginAction, redirectUrl, error: initialError }: LoginFormProps) {
  // Client-side UI state (minimal for enhanced security)
  const [showPassword, setShowPassword] = useState(false)

  // Use Next.js useFormState for server action integration
  const [state, formAction] = useFormState(loginAction, {
    success: false,
    error: initialError || null,
  })

  // Track form submission state
  const [isPending, setIsPending] = useState(false)

  return (
    <>
      {/* Header */}
      <header className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                <Image
                  src="/aclue_text_clean.png"
                  alt="Aclue logo"
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Aclue</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to continue discovering amazing gifts
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              action={async (formData) => {
                setIsPending(true)
                await formAction(formData)
                setIsPending(false)
              }}
              className="space-y-6"
            >
              {/* Hidden redirect field */}
              {redirectUrl && (
                <input type="hidden" name="redirect" value={redirectUrl} />
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 hover:border-gray-400"
                    placeholder="Enter your email"
                    disabled={isPending}
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 hover:border-gray-400"
                    placeholder="Enter your password"
                    disabled={isPending}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={isPending}
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Display */}
              <AnimatePresence mode="wait">
                {state.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-lg flex items-start gap-3 bg-red-50 border border-red-200"
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        {state.error}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: isPending ? 1 : 1.02 }}
                whileTap={{ scale: isPending ? 1 : 0.98 }}
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </form>

            {/* Login Information */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">
                    Enhanced Security
                  </h4>
                  <p className="mt-1 text-sm text-blue-700">
                    Your login is processed securely on our servers with industry-standard encryption and protection.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}