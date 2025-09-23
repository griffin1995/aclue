'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, Zap } from 'lucide-react'
import { newsletterSignupAction } from '@/app/actions/newsletter'

/**
 * Newsletter Signup Form - Frontend-Only Implementation
 *
 * Interactive client component for newsletter signup using App Router server actions
 * with frontend-only Resend integration for improved reliability.
 *
 * Features:
 * - Server actions with frontend API route integration
 * - Direct Resend integration following official patterns
 * - Real-time validation feedback
 * - Accessibility compliant
 * - Success/error state management
 * - Loading states with proper UX
 *
 * Integration:
 * - Uses server actions that call frontend /api/send route
 * - Frontend API route uses direct Resend SDK integration
 * - Handles all form states client-side
 * - Provides immediate user feedback
 * - GDPR-compliant signup process
 */

export default function NewsletterSignupForm() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    console.log('📧 Submitting newsletter signup for:', email)

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('email', email)
        formData.append('source', 'maintenance_page_frontend_api')

        const result = await newsletterSignupAction(formData)

        if (result.success) {
          setIsSubmitted(true)
          console.log('✅ Newsletter signup successful:', result.message)
        } else {
          console.error('❌ Newsletter signup failed:', result)
          setError(result.error || 'An unexpected error occurred. Please try again.')
        }
      } catch (error) {
        console.error('💥 Form submission error:', error)
        setError('Unable to connect to our service. Please check your connection and try again.')
      }
    })
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
      >
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Welcome to the Future! 🚀
          </h3>
          <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">
            You're now part of our exclusive beta program. We'll notify you
            the moment our AI is ready to transform your gift-giving experience.
          </p>
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-blue-200">
              Check your email for beta access details and updates.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
    >
      <div className="text-center mb-6 sm:mb-8">
        <h2 id="signup-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
          Join the Beta
        </h2>
        <p id="email-description" className="text-blue-100 text-base sm:text-lg mb-4 sm:mb-6">
          Be among the first to experience the future of gift discovery.
          Get early access when we launch.
        </p>

        {/* Beta Benefits */}
        <div id="beta-benefits" className="space-y-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 text-blue-100">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            </div>
            <span className="text-sm sm:text-base">Early access to all features</span>
          </div>
          <div className="flex items-center gap-3 text-blue-100">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            </div>
            <span className="text-sm sm:text-base">Priority customer support</span>
          </div>
          <div className="flex items-center gap-3 text-blue-100">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            </div>
            <span className="text-sm sm:text-base">Exclusive beta features</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg"
        >
          <p className="text-red-200 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Newsletter Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" role="form" aria-labelledby="signup-heading">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 sm:w-6 sm:h-6" />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full pl-12 sm:pl-14 pr-4 py-4 sm:py-5 bg-white/10 border-2 border-white/20 rounded-xl focus:border-blue-400 focus:outline-none text-white placeholder-blue-200 backdrop-blur-sm text-base sm:text-lg min-h-[48px] sm:min-h-[56px]"
            required
            disabled={isPending}
            aria-label="Email address for beta signup"
            aria-describedby="email-description"
            autoComplete="email"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isPending || !email.trim()}
          whileHover={{ scale: isPending ? 1 : 1.02 }}
          whileTap={{ scale: isPending ? 1 : 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 sm:py-5 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg text-base sm:text-lg min-h-[48px] sm:min-h-[56px]"
          aria-label={isPending ? "Joining beta program, please wait" : "Join beta program"}
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <span>Joining Beta...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Join Beta Program</span>
            </>
          )}
        </motion.button>
      </form>

      <div className="text-center mt-6">
        <p className="text-xs text-blue-200">
          No spam • Unsubscribe anytime • Early access guaranteed
        </p>
      </div>
    </motion.div>
  )
}