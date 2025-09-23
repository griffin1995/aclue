// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Star } from 'lucide-react';

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
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}
export default function ServerTestimonialsSection() {
  if (stryMutAct_9fa48("4020")) {
    {}
  } else {
    stryCov_9fa48("4020");
    const testimonials: Testimonial[] = stryMutAct_9fa48("4021") ? [] : (stryCov_9fa48("4021"), [stryMutAct_9fa48("4022") ? {} : (stryCov_9fa48("4022"), {
      name: stryMutAct_9fa48("4023") ? "" : (stryCov_9fa48("4023"), 'Sarah Johnson'),
      role: stryMutAct_9fa48("4024") ? "" : (stryCov_9fa48("4024"), 'Gift Enthusiast'),
      avatar: stryMutAct_9fa48("4025") ? "" : (stryCov_9fa48("4025"), '/images/testimonials/sarah.jpg'),
      content: stryMutAct_9fa48("4026") ? "" : (stryCov_9fa48("4026"), 'aclue helped me find the perfect birthday gift for my sister. The AI-powered insights were spot-on!'),
      rating: 5
    }), stryMutAct_9fa48("4027") ? {} : (stryCov_9fa48("4027"), {
      name: stryMutAct_9fa48("4028") ? "" : (stryCov_9fa48("4028"), 'Mike Chen'),
      role: stryMutAct_9fa48("4029") ? "" : (stryCov_9fa48("4029"), 'Busy Professional'),
      avatar: stryMutAct_9fa48("4030") ? "" : (stryCov_9fa48("4030"), '/images/testimonials/mike.jpg'),
      content: stryMutAct_9fa48("4031") ? "" : (stryCov_9fa48("4031"), 'As someone who struggles with gift-giving, this app is a lifesaver. Quick, easy, and always great suggestions.'),
      rating: 5
    }), stryMutAct_9fa48("4032") ? {} : (stryCov_9fa48("4032"), {
      name: stryMutAct_9fa48("4033") ? "" : (stryCov_9fa48("4033"), 'Emma Davis'),
      role: stryMutAct_9fa48("4034") ? "" : (stryCov_9fa48("4034"), 'Mother of 3'),
      avatar: stryMutAct_9fa48("4035") ? "" : (stryCov_9fa48("4035"), '/images/testimonials/emma.jpg'),
      content: stryMutAct_9fa48("4036") ? "" : (stryCov_9fa48("4036"), 'Love how it learns what my kids like. No more guessing what toys they actually want!'),
      rating: 5
    })]);
    return <section id="testimonials" className="py-20 bg-white">
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
          {testimonials.map(stryMutAct_9fa48("4037") ? () => undefined : (stryCov_9fa48("4037"), (testimonial, index) => <div key={testimonial.name} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {(stryMutAct_9fa48("4038") ? [] : (stryCov_9fa48("4038"), [...(stryMutAct_9fa48("4039") ? Array() : (stryCov_9fa48("4039"), Array(testimonial.rating)))])).map(stryMutAct_9fa48("4040") ? () => undefined : (stryCov_9fa48("4040"), (_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                  <span className="text-primary-800 font-semibold">
                    {stryMutAct_9fa48("4041") ? testimonial.name : (stryCov_9fa48("4041"), testimonial.name.charAt(0))}
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
            </div>))}
        </div>
      </div>
    </section>;
  }
}