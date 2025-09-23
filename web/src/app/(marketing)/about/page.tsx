import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Users,
  Target,
  Lightbulb,
  Award,
  Heart,
  Sparkles,
  ArrowRight,
  Globe,
  TrendingUp,
  Shield
} from 'lucide-react'

/**
 * About Page - App Router Server Component
 *
 * Server-rendered about page showcasing company information, mission, team, and values.
 * This page provides comprehensive information about aclue's background and vision.
 *
 * Features:
 * - Server component for optimal SEO and performance
 * - Company mission and values
 * - Team information and leadership
 * - Company history and milestones
 * - Static content optimised for search engines
 * - British English throughout
 */

export default function AboutPage() {
  // Static data - ideal for server rendering
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: '50K+',
      label: 'Happy Users',
      description: 'Active users discovering perfect gifts'
    },
    {
      icon: <Target className="w-8 h-8" />,
      value: '95%',
      label: 'Satisfaction Rate',
      description: 'Users satisfied with recommendations'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: '1M+',
      label: 'Products Analysed',
      description: 'Products curated and analysed by AI'
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: '24/7',
      label: 'AI Learning',
      description: 'Continuous machine learning improvement'
    }
  ]

  const values = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Human-Centred Design',
      description: 'We believe technology should enhance human connections, not replace them. Every feature is designed to strengthen relationships through thoughtful gift-giving.'
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: 'AI with Purpose',
      description: 'Our artificial intelligence is trained to understand the nuances of personal taste and emotional connection, making gift selection both smart and meaningful.'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Privacy First',
      description: 'Your preferences and data are sacred. We use advanced encryption and privacy-by-design principles to protect your personal information.'
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: 'Global Impact',
      description: 'Starting in the UK, we aim to transform gift-giving worldwide, creating a more thoughtful and sustainable approach to celebrations.'
    }
  ]

  const milestones = [
    {
      year: '2024',
      title: 'aclue Founded',
      description: 'Born from the frustration of endless gift browsing and the excitement of AI possibilities.'
    },
    {
      year: '2024',
      title: 'Alpha Launch',
      description: 'First version launched with basic swipe interface and product recommendations.'
    },
    {
      year: '2025',
      title: 'AI Enhancement',
      description: 'Advanced machine learning algorithms deployed for personalised recommendations.'
    },
    {
      year: '2025',
      title: 'Production Launch',
      description: 'Full platform deployed with comprehensive gifting features and affiliate integration.'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Transforming Gift-Giving with{' '}
              <span className="text-primary-600">Artificial Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're building the future of gift discovery, where technology understands human emotion
              and artificial intelligence helps create meaningful connections through perfect gift selection.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {stat.label}
                </div>
                <p className="text-sm text-gray-600">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Gift-giving should be joyful, not stressful. We've all experienced the anxiety of finding
                the perfect present, the disappointment of giving something that misses the mark, or the
                frustration of endless browsing without inspiration.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                aclue combines cutting-edge artificial intelligence with human psychology to understand
                what makes a gift truly special. Our platform learns your unique preferences and those
                of your loved ones, delivering personalised recommendations that create genuine moments of joy.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe that the best gifts come from understanding, not guessing. By leveraging data
                and machine learning, we're making thoughtful gift-giving accessible to everyone.
              </p>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Explore Our Technology
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8 transform rotate-2">
                <div className="bg-white rounded-xl p-6 transform -rotate-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    The Perfect Gift Formula
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <span className="text-gray-700">Understand preferences through AI analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        2
                      </div>
                      <span className="text-gray-700">Match personality with product characteristics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <span className="text-gray-700">Deliver personalised recommendations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        4
                      </div>
                      <span className="text-gray-700">Create moments of genuine joy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our approach to building technology that enhances human relationships
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={value.title} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              From concept to launch, here's how we're revolutionising gift discovery
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Join Us in Transforming Gift-Giving
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Be part of the future where artificial intelligence helps create perfect moments
            of human connection through thoughtful gifts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/**
 * SEO Metadata for About Page
 */
export const metadata: Metadata = {
  title: 'About Us - Transforming Gift-Giving with AI',
  description: 'Learn about aclue\'s mission to revolutionise gift-giving through artificial intelligence. Discover our values, journey, and vision for the future of personalised gift discovery.',
  keywords: [
    'about aclue',
    'ai gift company',
    'gift technology',
    'personalised gifts',
    'machine learning gifts',
    'gift discovery platform',
    'uk gift startup'
  ],
  openGraph: {
    title: 'About aclue - Transforming Gift-Giving with AI',
    description: 'Learn about our mission to revolutionise gift-giving through artificial intelligence and personalised recommendations.',
    url: 'https://aclue.app/about',
    images: [
      {
        url: '/aclue_text_clean.png',
        width: 1200,
        height: 630,
        alt: 'About aclue - AI-Powered Gift Discovery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About aclue - Transforming Gift-Giving with AI',
    description: 'Learn about our mission to revolutionise gift-giving through artificial intelligence.',
    images: ['/aclue_text_clean.png'],
  },
  alternates: {
    canonical: 'https://aclue.app/about',
  },
}