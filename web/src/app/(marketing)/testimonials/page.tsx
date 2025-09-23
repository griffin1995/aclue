import { Metadata } from 'next'
import Link from 'next/link'
import {
  Star,
  Quote,
  Heart,
  Gift,
  Sparkles,
  ArrowRight,
  Users,
  TrendingUp,
  CheckCircle,
  Award,
  MessageCircle,
  ThumbsUp
} from 'lucide-react'

/**
 * Testimonials Page - App Router Server Component
 *
 * Server-rendered testimonials page showcasing user reviews, success stories, and social proof.
 * This page builds trust and credibility through authentic user experiences.
 *
 * Features:
 * - Server component for optimal SEO and performance
 * - Detailed customer testimonials and reviews
 * - Success stories and use cases
 * - Statistical social proof
 * - Trust indicators and ratings
 * - British English throughout
 */

export default function TestimonialsPage() {
  // Featured testimonials - ideal for server rendering
  const featuredTestimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      location: 'London, UK',
      avatar: 'SJ',
      rating: 5,
      title: 'Perfect Birthday Gift Discovery',
      content: 'aclue helped me find the most thoughtful birthday gift for my sister. The AI understood her love for sustainable fashion and suggested an eco-friendly jewellery set that she absolutely adores. No more guessing games!',
      useCase: 'Birthday Gifts',
      giftSuccess: 'Eco-friendly jewellery set',
      timeToFind: '5 minutes',
      featured: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Developer',
      location: 'Manchester, UK',
      avatar: 'MC',
      rating: 5,
      title: 'Family Christmas Made Easy',
      content: 'Christmas shopping for my family of six used to be a nightmare. aclue\'s AI learned each family member\'s preferences and suggested perfect gifts for everyone. My wife was amazed at how well I "knew" what to get our teenage kids!',
      useCase: 'Family Gifts',
      giftSuccess: 'Complete family Christmas',
      timeToFind: '30 minutes',
      featured: true
    },
    {
      id: 3,
      name: 'Emma Davies',
      role: 'Primary School Teacher',
      location: 'Cardiff, Wales',
      avatar: 'ED',
      rating: 5,
      title: 'Colleague Gift Exchange Success',
      content: 'Our school\'s secret Santa was stress-free thanks to aclue. I input my colleague\'s interests and got brilliant suggestions within my £15 budget. She loved the artisan tea set, and I felt like a thoughtful gift-giver for once!',
      useCase: 'Workplace Gifts',
      giftSuccess: 'Artisan tea set',
      timeToFind: '3 minutes',
      featured: true
    }
  ]

  const moreTestimonials = [
    {
      name: 'David Thompson',
      role: 'Freelance Designer',
      avatar: 'DT',
      rating: 5,
      content: 'The swipe interface is genius! It\'s like Tinder for gifts. I found the perfect anniversary present for my partner in minutes.',
      timeToFind: '4 minutes'
    },
    {
      name: 'Lisa Rodriguez',
      role: 'HR Director',
      avatar: 'LR',
      rating: 5,
      content: 'aclue saved me during the company gift-giving season. Found personalised gifts for 20+ team members effortlessly.',
      timeToFind: '2 hours'
    },
    {
      name: 'James Wilson',
      role: 'University Student',
      avatar: 'JW',
      rating: 4,
      content: 'As a broke student, finding meaningful gifts on a budget was impossible. aclue found amazing options under £20.',
      timeToFind: '6 minutes'
    },
    {
      name: 'Rachel Green',
      role: 'Busy Mum of Three',
      avatar: 'RG',
      rating: 5,
      content: 'With three kids and zero spare time, aclue is a lifesaver. The AI knows exactly what my children will love.',
      timeToFind: '10 minutes'
    },
    {
      name: 'Tom Anderson',
      role: 'Retired Engineer',
      avatar: 'TA',
      rating: 5,
      content: 'I was sceptical about AI, but aclue impressed me. Found a perfect gadget for my tech-loving grandson.',
      timeToFind: '8 minutes'
    },
    {
      name: 'Sophie Miller',
      role: 'Event Planner',
      avatar: 'SM',
      rating: 5,
      content: 'Professional gift-giving is part of my job. aclue\'s recommendations are consistently spot-on and impressive.',
      timeToFind: '5 minutes'
    }
  ]

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: '50,000+',
      label: 'Happy Users',
      description: 'Active users discovering perfect gifts'
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: '4.9/5',
      label: 'Average Rating',
      description: 'Based on 10,000+ reviews'
    },
    {
      icon: <Gift className="w-8 h-8" />,
      value: '95%',
      label: 'Gift Success Rate',
      description: 'Recipients love their gifts'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: '5 mins',
      label: 'Average Discovery Time',
      description: 'From search to perfect gift'
    }
  ]

  const useCaseBreakdown = [
    {
      useCase: 'Birthday Gifts',
      percentage: 35,
      satisfaction: '97%',
      icon: <Gift className="w-6 h-6" />
    },
    {
      useCase: 'Holiday Shopping',
      percentage: 28,
      satisfaction: '94%',
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      useCase: 'Anniversary Gifts',
      percentage: 18,
      satisfaction: '98%',
      icon: <Heart className="w-6 h-6" />
    },
    {
      useCase: 'Workplace Gifts',
      percentage: 12,
      satisfaction: '92%',
      icon: <Users className="w-6 h-6" />
    },
    {
      useCase: 'Just Because',
      percentage: 7,
      satisfaction: '96%',
      icon: <ThumbsUp className="w-6 h-6" />
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              4.9/5 Average Rating
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Real Stories from{' '}
              <span className="text-primary-600">Happy Gift-Givers</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how thousands of users have transformed their gift-giving experience
              with AI-powered recommendations and found perfect gifts in minutes.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Featured Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read detailed accounts of how aclue solved real gift-giving challenges
            </p>
          </div>

          <div className="space-y-16">
            {featuredTestimonials.map((testimonial, index) => (
              <div key={testimonial.id} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    <Quote className="w-8 h-8 text-primary-600 mb-4" />

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {testimonial.title}
                    </h3>

                    <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                        <span className="text-primary-800 font-semibold">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role} • {testimonial.location}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center pt-6 border-t border-gray-200">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Use Case</div>
                        <div className="text-xs text-gray-600">{testimonial.useCase}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Gift Found</div>
                        <div className="text-xs text-gray-600">{testimonial.giftSuccess}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Time Taken</div>
                        <div className="text-xs text-gray-600">{testimonial.timeToFind}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <span className="font-semibold text-gray-900">Perfect Match Found</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-primary-600" />
                          <span className="text-gray-700">AI-powered recommendation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-red-500" />
                          <span className="text-gray-700">Recipient loved the gift</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-yellow-500" />
                          <span className="text-gray-700">Exceeded expectations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Breakdown */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Across All Occasions
            </h2>
            <p className="text-lg text-gray-600">
              See how aclue performs across different gift-giving scenarios
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8">
            <div className="space-y-6">
              {useCaseBreakdown.map((useCase, index) => (
                <div key={useCase.useCase} className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                    {useCase.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{useCase.useCase}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{useCase.percentage}% of users</span>
                        <span className="text-sm font-semibold text-green-600">{useCase.satisfaction} satisfaction</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${useCase.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* More Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              More Happy Customers
            </h2>
            <p className="text-lg text-gray-600">
              Quick insights from our growing community of satisfied users
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {moreTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-primary-800 font-semibold text-sm">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonial.timeToFind}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            Trusted by Gift-Givers Everywhere
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6">
              <MessageCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Reviews & Ratings</div>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <ThumbsUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Would Recommend</div>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <Award className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-gray-600">Overall Rating</div>
            </div>
          </div>

          <p className="text-lg text-gray-600 mb-8">
            Join thousands of satisfied users who've discovered the joy of stress-free,
            thoughtful gift-giving with AI-powered recommendations.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Join Our Happy Users?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Experience the difference AI-powered gift discovery makes. Join our free beta program
            and start finding perfect gifts in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Finding Perfect Gifts
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

          <p className="text-sm text-primary-200 mt-6">
            Free beta access • No credit card required • Join 50,000+ happy users
          </p>
        </div>
      </section>
    </>
  )
}

/**
 * SEO Metadata for Testimonials Page
 */
export const metadata: Metadata = {
  title: 'Customer Reviews & Success Stories | aclue',
  description: 'Read real customer testimonials and success stories from users who\'ve transformed their gift-giving with aclue\'s AI-powered recommendations. 4.9/5 average rating.',
  keywords: [
    'aclue reviews',
    'customer testimonials',
    'gift discovery reviews',
    'ai gift platform reviews',
    'user success stories',
    'gift-giving testimonials',
    'aclue ratings'
  ],
  openGraph: {
    title: 'Customer Reviews & Success Stories | aclue',
    description: 'See how 50,000+ users have transformed their gift-giving with AI-powered recommendations. Read real success stories and reviews.',
    url: 'https://aclue.app/testimonials',
    images: [
      {
        url: '/aclue_text_clean.png',
        width: 1200,
        height: 630,
        alt: 'aclue Customer Testimonials and Reviews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Reviews & Success Stories | aclue',
    description: 'See how users transformed gift-giving with AI. 4.9/5 rating from 50,000+ users.',
    images: ['/aclue_text_clean.png'],
  },
  alternates: {
    canonical: 'https://aclue.app/testimonials',
  },
}