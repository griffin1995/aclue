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
import { Sparkles, Heart, Zap, Users } from 'lucide-react';

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
  icon: React.ReactNode;
  title: string;
  description: string;
}
export default function ServerFeaturesSection() {
  if (stryMutAct_9fa48("4001")) {
    {}
  } else {
    stryCov_9fa48("4001");
    const features: Feature[] = stryMutAct_9fa48("4002") ? [] : (stryCov_9fa48("4002"), [stryMutAct_9fa48("4003") ? {} : (stryCov_9fa48("4003"), {
      icon: <Sparkles className="w-6 h-6" />,
      title: stryMutAct_9fa48("4004") ? "" : (stryCov_9fa48("4004"), 'AI-Powered Recommendations'),
      description: stryMutAct_9fa48("4005") ? "" : (stryCov_9fa48("4005"), 'Our advanced ML algorithms learn your preferences to suggest perfect gifts every time.')
    }), stryMutAct_9fa48("4006") ? {} : (stryCov_9fa48("4006"), {
      icon: <Heart className="w-6 h-6" />,
      title: stryMutAct_9fa48("4007") ? "" : (stryCov_9fa48("4007"), 'Swipe-Based Discovery'),
      description: stryMutAct_9fa48("4008") ? "" : (stryCov_9fa48("4008"), 'Like Tinder for gifts! Swipe through products to train our AI and discover what you love.')
    }), stryMutAct_9fa48("4009") ? {} : (stryCov_9fa48("4009"), {
      icon: <Zap className="w-6 h-6" />,
      title: stryMutAct_9fa48("4010") ? "" : (stryCov_9fa48("4010"), 'Instant Gift Links'),
      description: stryMutAct_9fa48("4011") ? "" : (stryCov_9fa48("4011"), 'Create shareable gift links in seconds. Perfect for wishlists and gift exchanges.')
    }), stryMutAct_9fa48("4012") ? {} : (stryCov_9fa48("4012"), {
      icon: <Users className="w-6 h-6" />,
      title: stryMutAct_9fa48("4013") ? "" : (stryCov_9fa48("4013"), 'Social Gifting'),
      description: stryMutAct_9fa48("4014") ? "" : (stryCov_9fa48("4014"), 'Share with friends and family. Collaborate on gift ideas and never give duplicate gifts.')
    })]);
    return <section id="features" className="py-20 bg-white">
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
          {features.map(stryMutAct_9fa48("4015") ? () => undefined : (stryCov_9fa48("4015"), (feature, index) => <div key={feature.title} className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>))}
        </div>
      </div>
    </section>;
  }
}