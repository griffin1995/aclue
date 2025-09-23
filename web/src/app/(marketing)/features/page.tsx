import { Metadata } from 'next'
import Link from 'next/link'
import {
  Sparkles,
  Heart,
  Zap,
  Users,
  Brain,
  Target,
  Shield,
  Globe,
  Clock,
  TrendingUp,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Bot,
  Gift,
  Search,
  Share,
  BarChart3
} from 'lucide-react'

/**
 * Features Page - App Router Server Component
 *
 * Server-rendered features showcase highlighting aclue's key capabilities and technology.
 * This page demonstrates how AI enhances the gift discovery experience.
 *
 * Features:
 * - Server component for optimal SEO and performance
 * - Comprehensive feature explanations
 * - Technical capability demonstrations
 * - Use case examples and benefits
 * - Static content optimised for search engines
 * - British English throughout
 */

export default function FeaturesPage() {
  // Core features data - perfect for server rendering
  const coreFeatures = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI-Powered Recommendations',
      description: 'Advanced machine learning algorithms analyse your preferences to suggest perfect gifts every time.',
      benefits: [
        '95% accuracy in preference matching',
        'Learns from every interaction',
        'Personalised for each user',
        'Improves over time'
      ]
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Swipe-Based Discovery',
      description: 'Intuitive Tinder-style interface makes finding gifts as easy as swiping through your favourite social media.',
      benefits: [
        'Quick and engaging interaction',
        'Trains AI with minimal effort',
        'Mobile-optimised experience',
        'Fun and addictive interface'
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Gift Links',
      description: 'Generate shareable gift links in seconds. Perfect for wishlists, gift exchanges, and special occasions.',
      benefits: [
        'One-click sharing',
        'Works across all platforms',
        'No registration required for recipients',
        'Tracks gift preferences'
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Social Gifting',
      description: 'Collaborate with friends and family. Share preferences, create group wishlists, and never give duplicate gifts.',
      benefits: [
        'Group collaboration features',
        'Shared preference insights',
        'Duplicate gift prevention',
        'Family and friend networks'
      ]
    }
  ]

  const technicalFeatures = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Machine Learning Engine',
      description: 'Neural networks trained on millions of gift preferences and purchasing patterns.',
      detail: 'Our ML models use collaborative filtering, content-based recommendation, and deep learning to understand complex preference patterns.'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Preference Mapping',
      description: 'Advanced algorithms that map personality traits to product characteristics.',
      detail: 'Psychological profiling combined with product analysis creates detailed preference maps for accurate matching.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Privacy Protection',
      description: 'Enterprise-grade security with privacy-by-design architecture.',
      detail: 'End-to-end encryption, GDPR compliance, and user-controlled data sharing ensure complete privacy protection.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Product Database',
      description: 'Curated catalogue of over 1 million products from trusted retailers.',
      detail: 'Real-time product data, pricing updates, and availability checks across multiple international marketplaces.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Real-Time Processing',
      description: 'Lightning-fast recommendations powered by cloud infrastructure.',
      detail: 'Sub-second response times using distributed computing and edge caching for optimal user experience.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Trend Analysis',
      description: 'Seasonal and cultural trend integration for timely suggestions.',
      detail: 'Real-time trend analysis incorporating social media, market data, and seasonal patterns for relevant recommendations.'
    }
  ]

  const useCases = [
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Birthday Gifts',
      scenario: 'Your best friend\'s birthday is next week',
      solution: 'Swipe through personalised options based on their interests, age, and your relationship history.',
      outcome: 'Find the perfect gift in under 5 minutes with 95% satisfaction guarantee.'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Holiday Shopping',
      scenario: 'Christmas shopping for the entire family',
      solution: 'Create individual profiles for each family member and get tailored recommendations for everyone.',
      outcome: 'Complete your holiday shopping efficiently with gifts everyone will love.'
    },
    {
      icon: <Share className="w-8 h-8" />,
      title: 'Group Events',
      scenario: 'Office secret Santa or group wedding gift',
      solution: 'Collaborate with colleagues or friends to find the perfect group gift within budget.',
      outcome: 'Seamless group coordination with shared preferences and budget management.'
    }
  ]

  const comparisonFeatures = [
    {
      feature: 'AI-Powered Recommendations',
      aclue: true,
      traditional: false,
      description: 'Personalised suggestions based on machine learning'
    },
    {
      feature: 'Swipe Interface',
      aclue: true,
      traditional: false,
      description: 'Engaging, mobile-first discovery experience'
    },
    {
      feature: 'Preference Learning',
      aclue: true,
      traditional: false,
      description: 'Continuous improvement through user interaction'
    },
    {
      feature: 'Social Collaboration',
      aclue: true,
      traditional: false,
      description: 'Share and collaborate on gift ideas'
    },
    {
      feature: 'Real-Time Updates',
      aclue: true,
      traditional: false,
      description: 'Live pricing and availability information'
    },
    {
      feature: 'Manual Browsing Required',
      aclue: false,
      traditional: true,
      description: 'Time-consuming manual product search'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Features That Make{' '}
              <span className="text-primary-600">Gift-Giving Effortless</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how artificial intelligence, intuitive design, and powerful features
              transform the way you find and share perfect gifts.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The essential capabilities that power intelligent gift discovery
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {coreFeatures.map((feature, index) => (
              <div key={feature.title} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Technical Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced technology and infrastructure powering exceptional user experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalFeatures.map((feature, index) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Real-World Applications
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how aclue solves common gift-giving challenges
            </p>
          </div>

          <div className="space-y-12">
            {useCases.map((useCase, index) => (
              <div key={useCase.title} className={`grid lg:grid-cols-3 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:col-start-3' : ''}`}>
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                    {useCase.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {useCase.title}
                  </h3>
                </div>
                <div className={`lg:col-span-2 space-y-6 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Scenario:</h4>
                    <p className="text-gray-600">{useCase.scenario}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">aclue Solution:</h4>
                    <p className="text-gray-600">{useCase.solution}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Outcome:</h4>
                    <p className="text-gray-600">{useCase.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              aclue vs Traditional Gift Shopping
            </h2>
            <p className="text-lg text-gray-600">
              See how our platform compares to conventional gift discovery methods
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-3 bg-gray-100 text-center py-4 font-semibold text-gray-900">
              <div>Feature</div>
              <div className="text-primary-600">aclue</div>
              <div>Traditional Shopping</div>
            </div>

            {comparisonFeatures.map((item, index) => (
              <div key={item.feature} className={`grid grid-cols-3 items-center py-4 px-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div>
                  <div className="font-medium text-gray-900 mb-1">{item.feature}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
                <div className="text-center">
                  {item.aclue ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>
                  )}
                </div>
                <div className="text-center">
                  {item.traditional ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Mobile-First Experience
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Designed for the way you actually shop - on your phone, on the go, whenever inspiration strikes.
                Our mobile-optimised interface makes gift discovery as natural as scrolling through social media.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Smartphone className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Touch-Optimised Interface</h3>
                    <p className="text-gray-600">Intuitive swipe gestures and thumb-friendly navigation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Lightning Fast</h3>
                    <p className="text-gray-600">Optimised loading times and smooth animations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Globe className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Works Everywhere</h3>
                    <p className="text-gray-600">Cross-platform compatibility on any device</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Try Mobile Demo
                  <Smartphone className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="bg-primary-100 rounded-lg p-4 mt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-5 h-5 text-primary-600" />
                        <span className="text-sm font-medium text-primary-800">AI Recommendation</span>
                      </div>
                      <div className="h-3 bg-primary-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Experience the Future of Gift Discovery
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've discovered how AI can make gift-giving effortless,
            enjoyable, and extraordinarily effective.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Try Demo
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * SEO Metadata for Features Page
 */
export const metadata: Metadata = {
  title: 'Features - AI-Powered Gift Discovery Platform',
  description: 'Explore aclue\'s powerful features: AI recommendations, swipe discovery, instant gift links, and social gifting. See how technology transforms gift-giving.',
  keywords: [
    'ai gift features',
    'gift discovery platform',
    'machine learning gifts',
    'swipe interface gifts',
    'personalised recommendations',
    'gift technology features',
    'social gifting platform'
  ],
  openGraph: {
    title: 'Features - AI-Powered Gift Discovery Platform',
    description: 'Discover how AI recommendations, swipe discovery, and social gifting transform the way you find perfect gifts.',
    url: 'https://aclue.app/features',
    images: [
      {
        url: '/aclue_text_clean.png',
        width: 1200,
        height: 630,
        alt: 'aclue Features - AI Gift Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features - AI-Powered Gift Discovery Platform',
    description: 'Discover how AI recommendations and swipe discovery transform gift-giving.',
    images: ['/aclue_text_clean.png'],
  },
  alternates: {
    canonical: 'https://aclue.app/features',
  },
}