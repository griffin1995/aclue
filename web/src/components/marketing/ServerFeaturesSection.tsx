import { Sparkles, Heart, Zap, Users } from 'lucide-react'

/**
 * Server Features Section - Server Component
 *
 * Server-rendered features section with static feature descriptions.
 * Optimised for SEO and fast initial content delivery.
 *
 * Features:
 * - Server-side rendering for performance
 * - Static feature content
 * - SEO-optimised structure
 * - Clean semantic HTML
 */

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

export default function ServerFeaturesSection() {
  const features: Feature[] = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Recommendations',
      description: 'Our advanced ML algorithms learn your preferences to suggest perfect gifts every time.',
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Swipe-Based Discovery',
      description: 'Like Tinder for gifts! Swipe through products to train our AI and discover what you love.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Gift Links',
      description: 'Create shareable gift links in seconds. Perfect for wishlists and gift exchanges.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Social Gifting',
      description: 'Share with friends and family. Collaborate on gift ideas and never give duplicate gifts.',
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why aclue Works Better
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We've reinvented gift discovery using cutting-edge AI and intuitive design.
            Here's what makes us different.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}