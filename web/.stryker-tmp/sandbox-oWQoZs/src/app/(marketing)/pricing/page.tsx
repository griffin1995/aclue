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
import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, Star, Sparkles, Zap, Users, Shield, ArrowRight, Gift, Crown, Infinity, Clock, Heart, TrendingUp } from 'lucide-react';

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
  if (stryMutAct_9fa48("433")) {
    {}
  } else {
    stryCov_9fa48("433");
    // Current beta program details
    const betaProgram = stryMutAct_9fa48("434") ? {} : (stryCov_9fa48("434"), {
      title: stryMutAct_9fa48("435") ? "" : (stryCov_9fa48("435"), 'Free Beta Access'),
      subtitle: stryMutAct_9fa48("436") ? "" : (stryCov_9fa48("436"), 'Full Platform Access'),
      price: stryMutAct_9fa48("437") ? "" : (stryCov_9fa48("437"), 'Free'),
      duration: stryMutAct_9fa48("438") ? "" : (stryCov_9fa48("438"), 'Limited Time'),
      description: stryMutAct_9fa48("439") ? "" : (stryCov_9fa48("439"), 'Join our exclusive beta program and help shape the future of gift discovery'),
      features: stryMutAct_9fa48("440") ? [] : (stryCov_9fa48("440"), [stryMutAct_9fa48("441") ? "" : (stryCov_9fa48("441"), 'Unlimited AI recommendations'), stryMutAct_9fa48("442") ? "" : (stryCov_9fa48("442"), 'Full swipe interface access'), stryMutAct_9fa48("443") ? "" : (stryCov_9fa48("443"), 'Social gifting features'), stryMutAct_9fa48("444") ? "" : (stryCov_9fa48("444"), 'Premium customer support'), stryMutAct_9fa48("445") ? "" : (stryCov_9fa48("445"), 'Early access to new features'), stryMutAct_9fa48("446") ? "" : (stryCov_9fa48("446"), 'Beta program exclusive benefits'), stryMutAct_9fa48("447") ? "" : (stryCov_9fa48("447"), 'No payment required'), stryMutAct_9fa48("448") ? "" : (stryCov_9fa48("448"), 'Cancel anytime')]),
      badge: stryMutAct_9fa48("449") ? "" : (stryCov_9fa48("449"), 'Beta Program'),
      popular: stryMutAct_9fa48("450") ? false : (stryCov_9fa48("450"), true)
    });

    // Future pricing plans (for transparency)
    const futurePlans = stryMutAct_9fa48("451") ? [] : (stryCov_9fa48("451"), [stryMutAct_9fa48("452") ? {} : (stryCov_9fa48("452"), {
      name: stryMutAct_9fa48("453") ? "" : (stryCov_9fa48("453"), 'Free'),
      price: stryMutAct_9fa48("454") ? "" : (stryCov_9fa48("454"), '£0'),
      period: stryMutAct_9fa48("455") ? "" : (stryCov_9fa48("455"), 'forever'),
      description: stryMutAct_9fa48("456") ? "" : (stryCov_9fa48("456"), 'Perfect for casual gift-givers'),
      features: stryMutAct_9fa48("457") ? [] : (stryCov_9fa48("457"), [stryMutAct_9fa48("458") ? "" : (stryCov_9fa48("458"), '10 AI recommendations per month'), stryMutAct_9fa48("459") ? "" : (stryCov_9fa48("459"), 'Basic swipe interface'), stryMutAct_9fa48("460") ? "" : (stryCov_9fa48("460"), 'Standard customer support'), stryMutAct_9fa48("461") ? "" : (stryCov_9fa48("461"), 'Basic gift links'), stryMutAct_9fa48("462") ? "" : (stryCov_9fa48("462"), 'Mobile app access')]),
      limitations: stryMutAct_9fa48("463") ? [] : (stryCov_9fa48("463"), [stryMutAct_9fa48("464") ? "" : (stryCov_9fa48("464"), 'Limited monthly recommendations'), stryMutAct_9fa48("465") ? "" : (stryCov_9fa48("465"), 'Basic features only'), stryMutAct_9fa48("466") ? "" : (stryCov_9fa48("466"), 'Standard support')]),
      cta: stryMutAct_9fa48("467") ? "" : (stryCov_9fa48("467"), 'Get Started'),
      popular: stryMutAct_9fa48("468") ? true : (stryCov_9fa48("468"), false)
    }), stryMutAct_9fa48("469") ? {} : (stryCov_9fa48("469"), {
      name: stryMutAct_9fa48("470") ? "" : (stryCov_9fa48("470"), 'Premium'),
      price: stryMutAct_9fa48("471") ? "" : (stryCov_9fa48("471"), '£9.99'),
      period: stryMutAct_9fa48("472") ? "" : (stryCov_9fa48("472"), 'per month'),
      description: stryMutAct_9fa48("473") ? "" : (stryCov_9fa48("473"), 'For frequent gift-givers and families'),
      features: stryMutAct_9fa48("474") ? [] : (stryCov_9fa48("474"), [stryMutAct_9fa48("475") ? "" : (stryCov_9fa48("475"), 'Unlimited AI recommendations'), stryMutAct_9fa48("476") ? "" : (stryCov_9fa48("476"), 'Advanced preference learning'), stryMutAct_9fa48("477") ? "" : (stryCov_9fa48("477"), 'Social gifting features'), stryMutAct_9fa48("478") ? "" : (stryCov_9fa48("478"), 'Priority customer support'), stryMutAct_9fa48("479") ? "" : (stryCov_9fa48("479"), 'Advanced analytics'), stryMutAct_9fa48("480") ? "" : (stryCov_9fa48("480"), 'Family account sharing'), stryMutAct_9fa48("481") ? "" : (stryCov_9fa48("481"), 'Premium gift links'), stryMutAct_9fa48("482") ? "" : (stryCov_9fa48("482"), 'Early feature access')]),
      limitations: stryMutAct_9fa48("483") ? ["Stryker was here"] : (stryCov_9fa48("483"), []),
      cta: stryMutAct_9fa48("484") ? "" : (stryCov_9fa48("484"), 'Start Free Trial'),
      popular: stryMutAct_9fa48("485") ? false : (stryCov_9fa48("485"), true)
    }), stryMutAct_9fa48("486") ? {} : (stryCov_9fa48("486"), {
      name: stryMutAct_9fa48("487") ? "" : (stryCov_9fa48("487"), 'Enterprise'),
      price: stryMutAct_9fa48("488") ? "" : (stryCov_9fa48("488"), 'Custom'),
      period: stryMutAct_9fa48("489") ? "" : (stryCov_9fa48("489"), 'contact us'),
      description: stryMutAct_9fa48("490") ? "" : (stryCov_9fa48("490"), 'For businesses and large organisations'),
      features: stryMutAct_9fa48("491") ? [] : (stryCov_9fa48("491"), [stryMutAct_9fa48("492") ? "" : (stryCov_9fa48("492"), 'Everything in Premium'), stryMutAct_9fa48("493") ? "" : (stryCov_9fa48("493"), 'Custom integrations'), stryMutAct_9fa48("494") ? "" : (stryCov_9fa48("494"), 'Dedicated account manager'), stryMutAct_9fa48("495") ? "" : (stryCov_9fa48("495"), 'Advanced analytics dashboard'), stryMutAct_9fa48("496") ? "" : (stryCov_9fa48("496"), 'White-label options'), stryMutAct_9fa48("497") ? "" : (stryCov_9fa48("497"), 'API access'), stryMutAct_9fa48("498") ? "" : (stryCov_9fa48("498"), 'Custom training'), stryMutAct_9fa48("499") ? "" : (stryCov_9fa48("499"), 'SLA guarantees')]),
      limitations: stryMutAct_9fa48("500") ? ["Stryker was here"] : (stryCov_9fa48("500"), []),
      cta: stryMutAct_9fa48("501") ? "" : (stryCov_9fa48("501"), 'Contact Sales'),
      popular: stryMutAct_9fa48("502") ? true : (stryCov_9fa48("502"), false)
    })]);
    const faqs = stryMutAct_9fa48("503") ? [] : (stryCov_9fa48("503"), [stryMutAct_9fa48("504") ? {} : (stryCov_9fa48("504"), {
      question: stryMutAct_9fa48("505") ? "" : (stryCov_9fa48("505"), 'What is the beta program?'),
      answer: stryMutAct_9fa48("506") ? "" : (stryCov_9fa48("506"), 'Our beta program gives you full access to aclue\'s platform completely free while we refine the service based on user feedback. Beta users get exclusive benefits and help shape the product\'s future.')
    }), stryMutAct_9fa48("507") ? {} : (stryCov_9fa48("507"), {
      question: stryMutAct_9fa48("508") ? "" : (stryCov_9fa48("508"), 'How long does the beta program last?'),
      answer: stryMutAct_9fa48("509") ? "" : (stryCov_9fa48("509"), 'The beta program will run until we officially launch our paid tiers. Beta users will receive advance notice and special pricing when we transition to our full pricing model.')
    }), stryMutAct_9fa48("510") ? {} : (stryCov_9fa48("510"), {
      question: stryMutAct_9fa48("511") ? "" : (stryCov_9fa48("511"), 'Will I need to pay after the beta?'),
      answer: stryMutAct_9fa48("512") ? "" : (stryCov_9fa48("512"), 'Not necessarily! We\'ll always offer a free tier. Beta participants will receive exclusive pricing and grandfathered benefits as a thank you for helping us improve the platform.')
    }), stryMutAct_9fa48("513") ? {} : (stryCov_9fa48("513"), {
      question: stryMutAct_9fa48("514") ? "" : (stryCov_9fa48("514"), 'What happens to my data after beta?'),
      answer: stryMutAct_9fa48("515") ? "" : (stryCov_9fa48("515"), 'Your preferences, gift history, and account data remain yours. We\'ll seamlessly transition your account to our full platform with all your data intact.')
    }), stryMutAct_9fa48("516") ? {} : (stryCov_9fa48("516"), {
      question: stryMutAct_9fa48("517") ? "" : (stryCov_9fa48("517"), 'Can I cancel during the beta?'),
      answer: stryMutAct_9fa48("518") ? "" : (stryCov_9fa48("518"), 'Absolutely! There\'s no commitment during the beta program. You can stop using the service at any time, though we\'d love feedback on how we can improve.')
    }), stryMutAct_9fa48("519") ? {} : (stryCov_9fa48("519"), {
      question: stryMutAct_9fa48("520") ? "" : (stryCov_9fa48("520"), 'Are there any limitations during beta?'),
      answer: stryMutAct_9fa48("521") ? "" : (stryCov_9fa48("521"), 'Beta users get access to our full feature set with no artificial limitations. You might occasionally encounter new features being tested or minor bugs as we improve the platform.')
    })]);
    return <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Free Beta Program Active
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Join Our{stryMutAct_9fa48("522") ? "" : (stryCov_9fa48("522"), ' ')}
              <span className="text-primary-600">Free Beta Program</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get full access to aclue's AI-powered gift discovery platform completely free.
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
                {betaProgram.features.map(stryMutAct_9fa48("523") ? () => undefined : (stryCov_9fa48("523"), (feature, index) => <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-primary-100">{feature}</span>
                  </div>))}
              </div>

              <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg">
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
            {futurePlans.map(stryMutAct_9fa48("524") ? () => undefined : (stryCov_9fa48("524"), (plan, index) => <div key={plan.name} className={stryMutAct_9fa48("525") ? `` : (stryCov_9fa48("525"), `bg-white rounded-2xl p-8 ${plan.popular ? stryMutAct_9fa48("526") ? "" : (stryCov_9fa48("526"), 'ring-2 ring-primary-500 relative') : stryMutAct_9fa48("527") ? "Stryker was here!" : (stryCov_9fa48("527"), '')}`)}>
                {stryMutAct_9fa48("530") ? plan.popular || <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div> : stryMutAct_9fa48("529") ? false : stryMutAct_9fa48("528") ? true : (stryCov_9fa48("528", "529", "530"), plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>)}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    {stryMutAct_9fa48("533") ? plan.period !== 'contact us' || <span className="text-lg text-gray-500 font-normal">
                        /{plan.period}
                      </span> : stryMutAct_9fa48("532") ? false : stryMutAct_9fa48("531") ? true : (stryCov_9fa48("531", "532", "533"), (stryMutAct_9fa48("535") ? plan.period === 'contact us' : stryMutAct_9fa48("534") ? true : (stryCov_9fa48("534", "535"), plan.period !== (stryMutAct_9fa48("536") ? "" : (stryCov_9fa48("536"), 'contact us')))) && <span className="text-lg text-gray-500 font-normal">
                        /{plan.period}
                      </span>)}
                  </div>
                  <p className="text-gray-600">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map(stryMutAct_9fa48("537") ? () => undefined : (stryCov_9fa48("537"), (feature, featureIndex) => <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>))}

                  {stryMutAct_9fa48("540") ? plan.limitations.length > 0 || <div className="border-t pt-4 mt-4">
                      {plan.limitations.map((limitation, limitIndex) => <div key={limitIndex} className="flex items-start gap-3 mb-2">
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500">{limitation}</span>
                        </div>)}
                    </div> : stryMutAct_9fa48("539") ? false : stryMutAct_9fa48("538") ? true : (stryCov_9fa48("538", "539", "540"), (stryMutAct_9fa48("543") ? plan.limitations.length <= 0 : stryMutAct_9fa48("542") ? plan.limitations.length >= 0 : stryMutAct_9fa48("541") ? true : (stryCov_9fa48("541", "542", "543"), plan.limitations.length > 0)) && <div className="border-t pt-4 mt-4">
                      {plan.limitations.map(stryMutAct_9fa48("544") ? () => undefined : (stryCov_9fa48("544"), (limitation, limitIndex) => <div key={limitIndex} className="flex items-start gap-3 mb-2">
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500">{limitation}</span>
                        </div>))}
                    </div>)}
                </div>

                <button className={stryMutAct_9fa48("545") ? `` : (stryCov_9fa48("545"), `w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.popular ? stryMutAct_9fa48("546") ? "" : (stryCov_9fa48("546"), 'bg-primary-600 text-white hover:bg-primary-700') : stryMutAct_9fa48("547") ? "" : (stryCov_9fa48("547"), 'bg-gray-100 text-gray-700 hover:bg-gray-200')} opacity-60 cursor-not-allowed`)} disabled>
                  {plan.cta} (Coming Soon)
                </button>
              </div>))}
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

            {(stryMutAct_9fa48("548") ? [] : (stryCov_9fa48("548"), [stryMutAct_9fa48("549") ? [] : (stryCov_9fa48("549"), [stryMutAct_9fa48("550") ? "" : (stryCov_9fa48("550"), 'AI Recommendations'), stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), 'Unlimited'), stryMutAct_9fa48("552") ? "" : (stryCov_9fa48("552"), '10/month'), stryMutAct_9fa48("553") ? "" : (stryCov_9fa48("553"), 'Unlimited')]), stryMutAct_9fa48("554") ? [] : (stryCov_9fa48("554"), [stryMutAct_9fa48("555") ? "" : (stryCov_9fa48("555"), 'Swipe Interface'), stryMutAct_9fa48("556") ? "" : (stryCov_9fa48("556"), 'Full Access'), stryMutAct_9fa48("557") ? "" : (stryCov_9fa48("557"), 'Basic'), stryMutAct_9fa48("558") ? "" : (stryCov_9fa48("558"), 'Advanced')]), stryMutAct_9fa48("559") ? [] : (stryCov_9fa48("559"), [stryMutAct_9fa48("560") ? "" : (stryCov_9fa48("560"), 'Social Gifting'), stryMutAct_9fa48("561") ? "" : (stryCov_9fa48("561"), 'Included'), stryMutAct_9fa48("562") ? "" : (stryCov_9fa48("562"), 'Limited'), stryMutAct_9fa48("563") ? "" : (stryCov_9fa48("563"), 'Full')]), stryMutAct_9fa48("564") ? [] : (stryCov_9fa48("564"), [stryMutAct_9fa48("565") ? "" : (stryCov_9fa48("565"), 'Customer Support'), stryMutAct_9fa48("566") ? "" : (stryCov_9fa48("566"), 'Premium'), stryMutAct_9fa48("567") ? "" : (stryCov_9fa48("567"), 'Standard'), stryMutAct_9fa48("568") ? "" : (stryCov_9fa48("568"), 'Priority')]), stryMutAct_9fa48("569") ? [] : (stryCov_9fa48("569"), [stryMutAct_9fa48("570") ? "" : (stryCov_9fa48("570"), 'Gift Analytics'), stryMutAct_9fa48("571") ? "" : (stryCov_9fa48("571"), 'Included'), stryMutAct_9fa48("572") ? "" : (stryCov_9fa48("572"), '❌'), stryMutAct_9fa48("573") ? "" : (stryCov_9fa48("573"), 'Advanced')]), stryMutAct_9fa48("574") ? [] : (stryCov_9fa48("574"), [stryMutAct_9fa48("575") ? "" : (stryCov_9fa48("575"), 'Family Sharing'), stryMutAct_9fa48("576") ? "" : (stryCov_9fa48("576"), 'Included'), stryMutAct_9fa48("577") ? "" : (stryCov_9fa48("577"), '❌'), stryMutAct_9fa48("578") ? "" : (stryCov_9fa48("578"), 'Included')]), stryMutAct_9fa48("579") ? [] : (stryCov_9fa48("579"), [stryMutAct_9fa48("580") ? "" : (stryCov_9fa48("580"), 'API Access'), stryMutAct_9fa48("581") ? "" : (stryCov_9fa48("581"), 'Beta Testing'), stryMutAct_9fa48("582") ? "" : (stryCov_9fa48("582"), '❌'), stryMutAct_9fa48("583") ? "" : (stryCov_9fa48("583"), 'Limited')]), stryMutAct_9fa48("584") ? [] : (stryCov_9fa48("584"), [stryMutAct_9fa48("585") ? "" : (stryCov_9fa48("585"), 'Early Features'), stryMutAct_9fa48("586") ? "" : (stryCov_9fa48("586"), 'First Access'), stryMutAct_9fa48("587") ? "" : (stryCov_9fa48("587"), '❌'), stryMutAct_9fa48("588") ? "" : (stryCov_9fa48("588"), 'Included')])])).map(stryMutAct_9fa48("589") ? () => undefined : (stryCov_9fa48("589"), (row, index) => <div key={row[0]} className={stryMutAct_9fa48("590") ? `` : (stryCov_9fa48("590"), `grid grid-cols-4 items-center py-4 px-6 ${(stryMutAct_9fa48("593") ? index % 2 !== 0 : stryMutAct_9fa48("592") ? false : stryMutAct_9fa48("591") ? true : (stryCov_9fa48("591", "592", "593"), (stryMutAct_9fa48("594") ? index * 2 : (stryCov_9fa48("594"), index % 2)) === 0)) ? stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), 'bg-gray-50') : stryMutAct_9fa48("596") ? "" : (stryCov_9fa48("596"), 'bg-white')}`)}>
                <div className="font-medium text-gray-900">{row[0]}</div>
                <div className="text-center text-green-600 font-semibold">{row[1]}</div>
                <div className="text-center text-gray-600">{row[2]}</div>
                <div className="text-center text-primary-600 font-semibold">{row[3]}</div>
              </div>))}
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
            {faqs.map(stryMutAct_9fa48("597") ? () => undefined : (stryCov_9fa48("597"), (faq, index) => <div key={index} className="bg-white rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>))}
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
            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Join Beta Program
              <Gift className="w-5 h-5" />
            </Link>
            <Link href="/discover" className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Try Demo First
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-sm text-primary-200 mt-6">
            Beta access includes all premium features • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </>;
  }
}

/**
 * SEO Metadata for Pricing Page
 */
export const metadata: Metadata = stryMutAct_9fa48("598") ? {} : (stryCov_9fa48("598"), {
  title: stryMutAct_9fa48("599") ? "" : (stryCov_9fa48("599"), 'Pricing - Free Beta Program | aclue'),
  description: stryMutAct_9fa48("600") ? "" : (stryCov_9fa48("600"), 'Join aclue\'s free beta program and get full access to AI-powered gift discovery. No payment required, all premium features included. Limited time offer.'),
  keywords: stryMutAct_9fa48("601") ? [] : (stryCov_9fa48("601"), [stryMutAct_9fa48("602") ? "" : (stryCov_9fa48("602"), 'aclue pricing'), stryMutAct_9fa48("603") ? "" : (stryCov_9fa48("603"), 'free beta program'), stryMutAct_9fa48("604") ? "" : (stryCov_9fa48("604"), 'ai gift platform pricing'), stryMutAct_9fa48("605") ? "" : (stryCov_9fa48("605"), 'gift discovery free trial'), stryMutAct_9fa48("606") ? "" : (stryCov_9fa48("606"), 'beta program access'), stryMutAct_9fa48("607") ? "" : (stryCov_9fa48("607"), 'free gift recommendations'), stryMutAct_9fa48("608") ? "" : (stryCov_9fa48("608"), 'pricing plans')]),
  openGraph: stryMutAct_9fa48("609") ? {} : (stryCov_9fa48("609"), {
    title: stryMutAct_9fa48("610") ? "" : (stryCov_9fa48("610"), 'Pricing - Free Beta Program | aclue'),
    description: stryMutAct_9fa48("611") ? "" : (stryCov_9fa48("611"), 'Join our free beta program and experience AI-powered gift discovery at no cost. Full feature access, no payment required.'),
    url: stryMutAct_9fa48("612") ? "" : (stryCov_9fa48("612"), 'https://aclue.app/pricing'),
    images: stryMutAct_9fa48("613") ? [] : (stryCov_9fa48("613"), [stryMutAct_9fa48("614") ? {} : (stryCov_9fa48("614"), {
      url: stryMutAct_9fa48("615") ? "" : (stryCov_9fa48("615"), '/aclue_text_clean.png'),
      width: 1200,
      height: 630,
      alt: stryMutAct_9fa48("616") ? "" : (stryCov_9fa48("616"), 'aclue Pricing - Free Beta Program')
    })])
  }),
  twitter: stryMutAct_9fa48("617") ? {} : (stryCov_9fa48("617"), {
    card: stryMutAct_9fa48("618") ? "" : (stryCov_9fa48("618"), 'summary_large_image'),
    title: stryMutAct_9fa48("619") ? "" : (stryCov_9fa48("619"), 'Pricing - Free Beta Program | aclue'),
    description: stryMutAct_9fa48("620") ? "" : (stryCov_9fa48("620"), 'Join our free beta program for AI-powered gift discovery. No payment required.'),
    images: stryMutAct_9fa48("621") ? [] : (stryCov_9fa48("621"), [stryMutAct_9fa48("622") ? "" : (stryCov_9fa48("622"), '/aclue_text_clean.png')])
  }),
  alternates: stryMutAct_9fa48("623") ? {} : (stryCov_9fa48("623"), {
    canonical: stryMutAct_9fa48("624") ? "" : (stryCov_9fa48("624"), 'https://aclue.app/pricing')
  })
});