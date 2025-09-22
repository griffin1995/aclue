import { Metadata } from 'next'
import Link from 'next/link'
import {
  Check,
  X,
  Star,
  Sparkles,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Gift,
  Crown,
  Infinity,
  Clock,
  Heart,
  TrendingUp
} from 'lucide-react'

/**
 * Pricing Page - App Router Server Component
 *
 * Server-rendered pricing page showcasing beta program and future pricing plans.
 * Currently focused on free beta access with transparent future pricing communication.
 *
 * Features:
 * - Server component for optimal SEO and performance
 * - Beta program highlighting with clear value proposition
 * - Future pricing transparency
 * - Feature comparison tables
 * - Clear call-to-action for beta access
 * - British English throughout
 */

export default function PricingPage() {
  // Current beta program details
  const betaProgram = {
    title: 'Free Beta Access',
    subtitle: 'Full Platform Access',
    price: 'Free',
    duration: 'Limited Time',
    description: 'Join our exclusive beta program and help shape the future of gift discovery',
    features: [
      'Unlimited AI recommendations',
      'Full swipe interface access',
      'Social gifting features',
      'Premium customer support',
      'Early access to new features',
      'Beta program exclusive benefits',
      'No payment required',
      'Cancel anytime'
    ],
    badge: 'Beta Program',
    popular: true
  }

  // Future pricing plans (for transparency)
  const futurePlans = [
    {
      name: 'Free',
      price: '£0',
      period: 'forever',
      description: 'Perfect for casual gift-givers',
      features: [
        '10 AI recommendations per month',
        'Basic swipe interface',
        'Standard customer support',
        'Basic gift links',
        'Mobile app access'
      ],
      limitations: [
        'Limited monthly recommendations',
        'Basic features only',
        'Standard support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Premium',
      price: '£9.99',
      period: 'per month',
      description: 'For frequent gift-givers and families',
      features: [
        'Unlimited AI recommendations',
        'Advanced preference learning',
        'Social gifting features',
        'Priority customer support',
        'Advanced analytics',
        'Family account sharing',
        'Premium gift links',
        'Early feature access'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For businesses and large organisations',
      features: [
        'Everything in Premium',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics dashboard',
        'White-label options',
        'API access',
        'Custom training',
        'SLA guarantees'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'What is the beta program?',
      answer: 'Our beta program gives you full access to Aclue\'s platform completely free while we refine the service based on user feedback. Beta users get exclusive benefits and help shape the product\'s future.'
    },
    {
      question: 'How long does the beta program last?',
      answer: 'The beta program will run until we officially launch our paid tiers. Beta users will receive advance notice and special pricing when we transition to our full pricing model.'
    },
    {
      question: 'Will I need to pay after the beta?',
      answer: 'Not necessarily! We\'ll always offer a free tier. Beta participants will receive exclusive pricing and grandfathered benefits as a thank you for helping us improve the platform.'
    },
    {
      question: 'What happens to my data after beta?',
      answer: 'Your preferences, gift history, and account data remain yours. We\'ll seamlessly transition your account to our full platform with all your data intact.'
    },
    {
      question: 'Can I cancel during the beta?',
      answer: 'Absolutely! There\'s no commitment during the beta program. You can stop using the service at any time, though we\'d love feedback on how we can improve.'
    },
    {
      question: 'Are there any limitations during beta?',
      answer: 'Beta users get access to our full feature set with no artificial limitations. You might occasionally encounter new features being tested or minor bugs as we improve the platform.'
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
              Free Beta Program Active
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Join Our{' '}
              <span className="text-primary-600">Free Beta Program</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get full access to Aclue's AI-powered gift discovery platform completely free.
              Help us build the future of gift-giving while enjoying premium features at no cost.
            </p>
          </div>
        </div>
      </section>

      {/* Beta Program Highlight */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Crown className="w-4 h-4" />
                {betaProgram.badge}
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {betaProgram.title}
              </h2>
              <p className="text-xl text-primary-100 mb-6">
                {betaProgram.subtitle}
              </p>

              <div className="text-center mb-8">
                <div className="text-5xl lg:text-6xl font-bold mb-2">
                  {betaProgram.price}
                </div>
                <div className="text-primary-100">
                  {betaProgram.duration}
                </div>
              </div>

              <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                {betaProgram.description}
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                {betaProgram.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-primary-100">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg"
              >
                Join Beta Program Now
                <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="text-sm text-primary-200 mt-4">
                No payment required • Full feature access • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Pricing Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Future Pricing Plans
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transparent pricing for when we launch our full service. Beta users get exclusive benefits!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {futurePlans.map((plan, index) => (
              <div key={plan.name} className={`bg-white rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-primary-500 relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    {plan.period !== 'contact us' && (
                      <span className="text-lg text-gray-500 font-normal">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.length > 0 && (
                    <div className="border-t pt-4 mt-4">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-3 mb-2">
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } opacity-60 cursor-not-allowed`}
                  disabled
                >
                  {plan.cta} (Coming Soon)
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Infinity className="w-4 h-4" />
              Beta users get exclusive pricing and early access to paid features
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What's Included
            </h2>
            <p className="text-lg text-gray-600">
              Compare features across our current beta program and future plans
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-50 text-center py-4 font-semibold text-gray-900 border-b">
              <div className="text-left px-6">Feature</div>
              <div className="text-green-600">Beta (Current)</div>
              <div>Free (Future)</div>
              <div className="text-primary-600">Premium (Future)</div>
            </div>

            {[
              ['AI Recommendations', 'Unlimited', '10/month', 'Unlimited'],
              ['Swipe Interface', 'Full Access', 'Basic', 'Advanced'],
              ['Social Gifting', 'Included', 'Limited', 'Full'],
              ['Customer Support', 'Premium', 'Standard', 'Priority'],
              ['Gift Analytics', 'Included', '❌', 'Advanced'],
              ['Family Sharing', 'Included', '❌', 'Included'],
              ['API Access', 'Beta Testing', '❌', 'Limited'],
              ['Early Features', 'First Access', '❌', 'Included']
            ].map((row, index) => (
              <div key={row[0]} className={`grid grid-cols-4 items-center py-4 px-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="font-medium text-gray-900">{row[0]}</div>
                <div className="text-center text-green-600 font-semibold">{row[1]}</div>
                <div className="text-center text-gray-600">{row[2]}</div>
                <div className="text-center text-primary-600 font-semibold">{row[3]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our beta program and pricing
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Gift-Giving?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our free beta program today and experience the future of AI-powered gift discovery.
            No commitment, no payment required - just amazing gifts made simple.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Beta Program
              <Gift className="w-5 h-5" />
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Try Demo First
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-sm text-primary-200 mt-6">
            Beta access includes all premium features • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </>
  )
}

/**
 * SEO Metadata for Pricing Page
 */
export const metadata: Metadata = {
  title: 'Pricing - Free Beta Program | Aclue',
  description: 'Join Aclue\'s free beta program and get full access to AI-powered gift discovery. No payment required, all premium features included. Limited time offer.',
  keywords: [
    'aclue pricing',
    'free beta program',
    'ai gift platform pricing',
    'gift discovery free trial',
    'beta program access',
    'free gift recommendations',
    'pricing plans'
  ],
  openGraph: {
    title: 'Pricing - Free Beta Program | Aclue',
    description: 'Join our free beta program and experience AI-powered gift discovery at no cost. Full feature access, no payment required.',
    url: 'https://aclue.app/pricing',
    images: [
      {
        url: '/aclue_text_clean.png',
        width: 1200,
        height: 630,
        alt: 'Aclue Pricing - Free Beta Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - Free Beta Program | Aclue',
    description: 'Join our free beta program for AI-powered gift discovery. No payment required.',
    images: ['/aclue_text_clean.png'],
  },
  alternates: {
    canonical: 'https://aclue.app/pricing',
  },
}