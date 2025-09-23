import { Star } from 'lucide-react'

/**
 * Server Testimonials Section - Server Component
 *
 * Server-rendered testimonials section for optimal SEO and performance.
 * Contains static testimonial content that loads immediately.
 *
 * Features:
 * - Server-side rendering for fast content delivery
 * - Static testimonial data
 * - SEO-optimised review markup
 * - Performance-focused implementation
 */

interface Testimonial {
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

export default function ServerTestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Gift Enthusiast',
      avatar: '/images/testimonials/sarah.jpg',
      content: 'aclue helped me find the perfect birthday gift for my sister. The AI-powered insights were spot-on!',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Busy Professional',
      avatar: '/images/testimonials/mike.jpg',
      content: 'As someone who struggles with gift-giving, this app is a lifesaver. Quick, easy, and always great suggestions.',
      rating: 5,
    },
    {
      name: 'Emma Davis',
      role: 'Mother of 3',
      avatar: '/images/testimonials/emma.jpg',
      content: 'Love how it learns what my kids like. No more guessing what toys they actually want!',
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy users who've discovered the joy of perfect gift-giving
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-primary-800 font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}