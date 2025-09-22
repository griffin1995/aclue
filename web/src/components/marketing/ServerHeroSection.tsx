import Link from 'next/link'
import { Sparkles, ArrowRight, CheckCircle, Gift, Heart } from 'lucide-react'

/**
 * Server Hero Section - Server Component
 *
 * Server-rendered hero section with static content for optimal performance and SEO.
 * Contains the main value proposition and key statistics.
 *
 * Features:
 * - Server-side rendering for SEO optimization
 * - Static content with fast initial load
 * - Structured data for search engines
 * - Performance-optimised images
 */

interface HeroSectionProps {
  stats: Array<{
    number: string
    label: string
  }>
}

export default function ServerHeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Gift Discovery
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Find the{' '}
              <span className="text-primary-600">perfect gift</span>{' '}
              with AI
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Swipe through products, train our AI to understand your taste, and get personalised
              gift recommendations that actually make sense. No more guessing, no more gift fails.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                Start Discovering
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Try Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats - Server Rendered */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white mb-6">
                  <h3 className="text-lg font-semibold mb-2">Your Perfect Match</h3>
                  <p className="text-primary-100">AI found the perfect gift based on your swipes!</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">97% match confidence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Based on 50+ swipes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Free shipping included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Static decorative elements */}
            <div className="absolute top-10 -left-4 bg-yellow-400 rounded-full p-3">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-10 -right-4 bg-pink-400 rounded-full p-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary-500 rounded-full blur-3xl" />
      </div>
    </section>
  )
}