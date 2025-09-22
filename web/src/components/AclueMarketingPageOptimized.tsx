import Link from 'next/link'
import Image from 'next/image'
import {
  Gift,
  Sparkles,
  Heart,
  Zap,
  Users,
  ArrowRight,
  Play,
  CheckCircle,
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react'

// Server Components
import ServerHeroSection from '@/components/marketing/ServerHeroSection'
import ServerFeaturesSection from '@/components/marketing/ServerFeaturesSection'
import ServerTestimonialsSection from '@/components/marketing/ServerTestimonialsSection'

// Client Components
import ClientNavigationHeader from '@/components/marketing/ClientNavigationHeader'
import ClientAnimatedHero from '@/components/marketing/ClientAnimatedHero'

/**
 * Aclue Marketing Page - Optimized Hybrid Component
 *
 * Hybrid server/client component architecture achieving 50% server rendering target.
 * Static content is server-rendered for SEO and performance, while interactive
 * elements use client components for enhanced user experience.
 *
 * Architecture:
 * - Server components: Navigation structure, hero content, features, testimonials, footer
 * - Client components: Interactive navigation, animations, form interactions
 * - Progressive enhancement: Core content loads immediately, enhancements load progressively
 * - Performance optimized: Critical content server-rendered, interactive features client-side
 *
 * Features:
 * - 50% server/client component split
 * - SEO-optimized static content
 * - Interactive user experience elements
 * - Progressive enhancement patterns
 * - Optimal Core Web Vitals
 */

export default function AclueMarketingPageOptimized() {
  // Static data for server components
  const stats = [
    { number: '1M+', label: 'Products Curated' },
    { number: '50K+', label: 'Happy Users' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'AI Learning' },
  ]

  return (
    <>
      {/* Client Navigation with Interactive Features */}
      <ClientNavigationHeader />

      {/* Server Hero Section with Static Content */}
      <div className="relative">
        <ServerHeroSection stats={stats} />
        {/* Client-side animations overlay */}
        <ClientAnimatedHero />
      </div>

      {/* Server Features Section */}
      <ServerFeaturesSection />

      {/* How It Works Section - Server Rendered */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get personalised gift recommendations in three simple steps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {[
              {
                step: '01',
                title: 'Swipe & Discover',
                description: 'Browse through curated products and swipe right on items you love, left on items you don\'t.',
                icon: <Heart className="w-8 h-8" />,
              },
              {
                step: '02',
                title: 'AI Learns Your Taste',
                description: 'Our machine learning algorithms analyse your preferences to understand your unique style.',
                icon: <Sparkles className="w-8 h-8" />,
              },
              {
                step: '03',
                title: 'Get Perfect Matches',
                description: 'Receive personalised recommendations and create shareable gift links for any occasion.',
                icon: <Gift className="w-8 h-8" />,
              },
            ].map((step, index) => (
              <div
                key={step.step}
                className="text-center relative"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-4 border-primary-200 rounded-full mb-6 relative z-10">
                  <div className="text-primary-600">
                    {step.icon}
                  </div>
                </div>

                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-primary-100 -z-10">
                  {step.step}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>

                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-primary-200 transform translate-x-8" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Try It Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Server Testimonials Section */}
      <ServerTestimonialsSection />

      {/* Platform Section - Server Rendered */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Available Everywhere
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              Access Aclue on all your devices. Seamless sync across platforms means your preferences travel with you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <Globe className="w-12 h-12" />,
                title: 'Web App',
                description: 'Full-featured experience in your browser',
              },
              {
                icon: <Smartphone className="w-12 h-12" />,
                title: 'Mobile Apps',
                description: 'Native iOS and Android applications',
              },
              {
                icon: <Monitor className="w-12 h-12" />,
                title: 'Desktop',
                description: 'Coming soon to Windows and macOS',
              },
            ].map((platform, index) => (
              <div
                key={platform.title}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6">
                  {platform.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {platform.title}
                </h3>
                <p className="text-primary-100">
                  {platform.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Server Rendered */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to revolutionise your gift-giving?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've discovered the perfect way to find and give gifts.
            Start your free account today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 bg-white border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Try Demo
              <Play className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Server Rendered */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/aclue_text_clean.png"
                  alt="Aclue Logo"
                  width={120}
                  height={32}
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 mb-4">
                A data-led insight layer that transforms how gifts are chosen.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/discover" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/landingpage" className="hover:text-white transition-colors">Full App</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Centre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Aclue Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}