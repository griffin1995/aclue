import { Suspense } from 'react'
import Head from 'next/head'
import { Gift, Brain, Sparkles, Users, Star } from 'lucide-react'
import NeuralNetworkBackgroundOptimized from '@/components/ui/NeuralNetworkBackgroundOptimized'
import NewsletterSignupForm from '@/components/NewsletterSignupForm'

/**
 * Newsletter Maintenance Page - App Router Server Component
 *
 * Server component implementation of the newsletter/maintenance page optimised for App Router.
 * This component provides the main landing page when in maintenance mode, featuring:
 *
 * Features:
 * - Server-side rendering for optimal performance
 * - Neural network background with glassmorphism design
 * - Newsletter signup form with server actions
 * - Responsive design with accessibility features
 * - Consistent aclue branding with aclue_text_clean.png
 *
 * Structure:
 * - Server component for static content
 * - Client component for interactive newsletter form
 * - Neural network background for visual appeal
 * - GDPR-compliant newsletter signup
 */

export default function NewsletterMaintenancePage() {
  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex relative overflow-hidden">
        {/* Optimised Neural Network Background */}
        <NeuralNetworkBackgroundOptimized
          nodeCount={60}
          connectionDistance={120}
          animationSpeed={0.3}
          performanceMode="balanced"
          colors={{
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#06b6d4',
            connections: '#3b82f6'
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

        {/* Main Content Container */}
        <main className="relative z-10 w-full flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="main">
          {/* Left Column - Hero Content */}
          <section className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-20" aria-labelledby="hero-heading">
            {/* Logo */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                  <img
                    src="/aclue_text_clean.png"
                    alt="aclue Logo"
                    className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
                  />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-xl animate-pulse" />
              </div>
            </div>

            {/* Main Headline */}
            <div className="mb-6 sm:mb-8">
              <h1 id="hero-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                The Future of
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Gift Discovery
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
                Our AI-powered platform is learning to understand your unique gift preferences.
                Experience personalised recommendations that actually understand what you and your loved ones want.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <span className="text-sm sm:text-base">AI-Powered Learning</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                </div>
                <span className="text-sm sm:text-base">Smart Recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                </div>
                <span className="text-sm sm:text-base">Social Integration</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                </div>
                <span className="text-sm sm:text-base">Curated Quality</span>
              </div>
            </div>

          </section>

          {/* Right Column - Newsletter Signup Form */}
          <section className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-20" aria-labelledby="signup-heading">
            <Suspense fallback={
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="animate-pulse">
                  <div className="h-8 bg-white/20 rounded-lg mb-4" />
                  <div className="h-4 bg-white/20 rounded mb-6" />
                  <div className="h-12 bg-white/20 rounded-lg mb-4" />
                  <div className="h-12 bg-white/20 rounded-lg" />
                </div>
              </div>
            }>
              <NewsletterSignupForm />
            </Suspense>
          </section>
        </main>

        {/* Legal Statement - Bottom Right */}
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-20">
          <div className="text-xs text-white/60 text-right leading-tight">
            <div>© 2025 ACLUE LIMITED</div>
            <div className="text-white/40">Company No. 14659276</div>
          </div>
        </div>
      </div>
    </>
  )
}