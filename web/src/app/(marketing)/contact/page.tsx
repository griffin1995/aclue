import { Metadata } from 'next'
import Link from 'next/link'
import {
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  Phone,
  HelpCircle,
  Users,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import ContactForm from '@/components/marketing/ContactForm'

/**
 * Contact Page - App Router Hybrid Component
 *
 * Server-rendered contact page with client-side interactive form.
 * Demonstrates the 50% server/client split approach with static content
 * server-rendered and interactive elements as client components.
 *
 * Features:
 * - Server component for SEO-optimised static content
 * - Client component for interactive contact form
 * - Multiple contact methods and channels
 * - FAQ section and support resources
 * - Progressive enhancement patterns
 * - British English throughout
 */

export default function ContactPage() {
  // Static contact information - ideal for server rendering
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      description: 'Get in touch for general enquiries and support',
      contact: 'hello@aclue.app',
      action: 'Send Email',
      href: 'mailto:hello@aclue.app',
      responseTime: 'Usually within 24 hours'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Beta Program',
      description: 'Questions about joining our free beta program',
      contact: 'beta@aclue.app',
      action: 'Join Beta',
      href: 'mailto:beta@aclue.app',
      responseTime: 'Same day response'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Business Enquiries',
      description: 'Partnership and business opportunities',
      contact: 'business@aclue.app',
      action: 'Contact Us',
      href: 'mailto:business@aclue.app',
      responseTime: 'Within 48 hours'
    }
  ]

  const officeInfo = {
    location: 'United Kingdom',
    description: 'Proudly based in the UK, serving users worldwide',
    timezone: 'GMT/BST',
    hours: 'Monday - Friday, 9:00 AM - 6:00 PM'
  }

  const faqs = [
    {
      question: 'How do I join the beta program?',
      answer: 'Simply register for a free account and you\'ll automatically get access to our beta program with full platform features.'
    },
    {
      question: 'Is customer support available during beta?',
      answer: 'Yes! Beta users receive full customer support via email. We typically respond within 24 hours.'
    },
    {
      question: 'Can I provide feedback about the platform?',
      answer: 'Absolutely! We actively encourage feedback from beta users. Use our contact form or email us directly at feedback@aclue.app.'
    },
    {
      question: 'Do you offer business or enterprise solutions?',
      answer: 'We\'re exploring enterprise solutions. Contact our business team at business@aclue.app to discuss your requirements.'
    },
    {
      question: 'How can I report a technical issue?',
      answer: 'Report technical issues through our contact form or email support@aclue.app with detailed information about the problem.'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get in{' '}
              <span className="text-primary-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you. Whether you have questions, feedback, or need support,
              our team is here to help make your gift-giving experience exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How Can We Help?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the best way to get in touch based on your enquiry type
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-6">
                  {method.icon}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {method.title}
                </h3>

                <p className="text-gray-600 mb-4">
                  {method.description}
                </p>

                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {method.contact}
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  {method.responseTime}
                </p>

                <a
                  href={method.href}
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  {method.action}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Send Us a Message
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Office Information */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Team
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                aclue is proudly based in the United Kingdom, with a distributed team passionate
                about transforming gift-giving through artificial intelligence. We're building
                the future of personalised recommendations, one perfect gift at a time.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{officeInfo.location}</h3>
                    <p className="text-gray-600">{officeInfo.description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">{officeInfo.hours}</p>
                    <p className="text-sm text-gray-500">Timezone: {officeInfo.timezone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-primary-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Always Innovating</h3>
                    <p className="text-gray-600">
                      Our AI learns 24/7, continuously improving recommendations for better gift discovery.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Join Our Community
                </h3>
                <p className="text-gray-600 mb-6">
                  Connect with us on social media for updates, tips, and behind-the-scenes content.
                </p>

                <div className="space-y-3">
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">T</span>
                    </div>
                    <span className="text-gray-700">Follow us on Twitter</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">L</span>
                    </div>
                    <span className="text-gray-700">Connect on LinkedIn</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">I</span>
                    </div>
                    <span className="text-gray-700">Follow on Instagram</span>
                  </a>
                </div>
              </div>
            </div>
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
              Quick answers to common questions. Can't find what you're looking for? Get in touch!
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 lg:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Still have questions? We're here to help!
            </p>
            <a
              href="mailto:hello@aclue.app"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Contact Support
              <Mail className="w-5 h-5" />
            </a>
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
            Don't wait - join our free beta program today and discover how AI can make
            finding perfect gifts effortless and enjoyable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Beta Program
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
            Free access • No credit card required • Full feature access
          </p>
        </div>
      </section>
    </>
  )
}

/**
 * SEO Metadata for Contact Page
 */
export const metadata: Metadata = {
  title: 'Contact Us - Get Support & Connect | aclue',
  description: 'Get in touch with the aclue team. Email support, beta program enquiries, business partnerships, and technical help. We\'re here to help with your gift discovery needs.',
  keywords: [
    'contact aclue',
    'customer support',
    'beta program help',
    'technical support',
    'business enquiries',
    'aclue team',
    'gift platform support'
  ],
  openGraph: {
    title: 'Contact Us - Get Support & Connect | aclue',
    description: 'Get in touch with our team for support, beta program access, business enquiries, and more. We\'re here to help!',
    url: 'https://aclue.app/contact',
    images: [
      {
        url: '/aclue_text_clean.png',
        width: 1200,
        height: 630,
        alt: 'Contact aclue - Customer Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Get Support & Connect | aclue',
    description: 'Get in touch with our team for support and enquiries. We\'re here to help!',
    images: ['/aclue_text_clean.png'],
  },
  alternates: {
    canonical: 'https://aclue.app/contact',
  },
}