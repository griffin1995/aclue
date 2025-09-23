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
import { Sparkles, Heart, Zap, Users, Brain, Target, Shield, Globe, Clock, TrendingUp, Smartphone, ArrowRight, CheckCircle, Bot, Gift, Search, Share, BarChart3 } from 'lucide-react';

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
  if (stryMutAct_9fa48("199")) {
    {}
  } else {
    stryCov_9fa48("199");
    // Core features data - perfect for server rendering
    const coreFeatures = stryMutAct_9fa48("200") ? [] : (stryCov_9fa48("200"), [stryMutAct_9fa48("201") ? {} : (stryCov_9fa48("201"), {
      icon: <Sparkles className="w-8 h-8" />,
      title: stryMutAct_9fa48("202") ? "" : (stryCov_9fa48("202"), 'AI-Powered Recommendations'),
      description: stryMutAct_9fa48("203") ? "" : (stryCov_9fa48("203"), 'Advanced machine learning algorithms analyse your preferences to suggest perfect gifts every time.'),
      benefits: stryMutAct_9fa48("204") ? [] : (stryCov_9fa48("204"), [stryMutAct_9fa48("205") ? "" : (stryCov_9fa48("205"), '95% accuracy in preference matching'), stryMutAct_9fa48("206") ? "" : (stryCov_9fa48("206"), 'Learns from every interaction'), stryMutAct_9fa48("207") ? "" : (stryCov_9fa48("207"), 'Personalised for each user'), stryMutAct_9fa48("208") ? "" : (stryCov_9fa48("208"), 'Improves over time')])
    }), stryMutAct_9fa48("209") ? {} : (stryCov_9fa48("209"), {
      icon: <Heart className="w-8 h-8" />,
      title: stryMutAct_9fa48("210") ? "" : (stryCov_9fa48("210"), 'Swipe-Based Discovery'),
      description: stryMutAct_9fa48("211") ? "" : (stryCov_9fa48("211"), 'Intuitive Tinder-style interface makes finding gifts as easy as swiping through your favourite social media.'),
      benefits: stryMutAct_9fa48("212") ? [] : (stryCov_9fa48("212"), [stryMutAct_9fa48("213") ? "" : (stryCov_9fa48("213"), 'Quick and engaging interaction'), stryMutAct_9fa48("214") ? "" : (stryCov_9fa48("214"), 'Trains AI with minimal effort'), stryMutAct_9fa48("215") ? "" : (stryCov_9fa48("215"), 'Mobile-optimised experience'), stryMutAct_9fa48("216") ? "" : (stryCov_9fa48("216"), 'Fun and addictive interface')])
    }), stryMutAct_9fa48("217") ? {} : (stryCov_9fa48("217"), {
      icon: <Zap className="w-8 h-8" />,
      title: stryMutAct_9fa48("218") ? "" : (stryCov_9fa48("218"), 'Instant Gift Links'),
      description: stryMutAct_9fa48("219") ? "" : (stryCov_9fa48("219"), 'Generate shareable gift links in seconds. Perfect for wishlists, gift exchanges, and special occasions.'),
      benefits: stryMutAct_9fa48("220") ? [] : (stryCov_9fa48("220"), [stryMutAct_9fa48("221") ? "" : (stryCov_9fa48("221"), 'One-click sharing'), stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), 'Works across all platforms'), stryMutAct_9fa48("223") ? "" : (stryCov_9fa48("223"), 'No registration required for recipients'), stryMutAct_9fa48("224") ? "" : (stryCov_9fa48("224"), 'Tracks gift preferences')])
    }), stryMutAct_9fa48("225") ? {} : (stryCov_9fa48("225"), {
      icon: <Users className="w-8 h-8" />,
      title: stryMutAct_9fa48("226") ? "" : (stryCov_9fa48("226"), 'Social Gifting'),
      description: stryMutAct_9fa48("227") ? "" : (stryCov_9fa48("227"), 'Collaborate with friends and family. Share preferences, create group wishlists, and never give duplicate gifts.'),
      benefits: stryMutAct_9fa48("228") ? [] : (stryCov_9fa48("228"), [stryMutAct_9fa48("229") ? "" : (stryCov_9fa48("229"), 'Group collaboration features'), stryMutAct_9fa48("230") ? "" : (stryCov_9fa48("230"), 'Shared preference insights'), stryMutAct_9fa48("231") ? "" : (stryCov_9fa48("231"), 'Duplicate gift prevention'), stryMutAct_9fa48("232") ? "" : (stryCov_9fa48("232"), 'Family and friend networks')])
    })]);
    const technicalFeatures = stryMutAct_9fa48("233") ? [] : (stryCov_9fa48("233"), [stryMutAct_9fa48("234") ? {} : (stryCov_9fa48("234"), {
      icon: <Brain className="w-6 h-6" />,
      title: stryMutAct_9fa48("235") ? "" : (stryCov_9fa48("235"), 'Machine Learning Engine'),
      description: stryMutAct_9fa48("236") ? "" : (stryCov_9fa48("236"), 'Neural networks trained on millions of gift preferences and purchasing patterns.'),
      detail: stryMutAct_9fa48("237") ? "" : (stryCov_9fa48("237"), 'Our ML models use collaborative filtering, content-based recommendation, and deep learning to understand complex preference patterns.')
    }), stryMutAct_9fa48("238") ? {} : (stryCov_9fa48("238"), {
      icon: <Target className="w-6 h-6" />,
      title: stryMutAct_9fa48("239") ? "" : (stryCov_9fa48("239"), 'Preference Mapping'),
      description: stryMutAct_9fa48("240") ? "" : (stryCov_9fa48("240"), 'Advanced algorithms that map personality traits to product characteristics.'),
      detail: stryMutAct_9fa48("241") ? "" : (stryCov_9fa48("241"), 'Psychological profiling combined with product analysis creates detailed preference maps for accurate matching.')
    }), stryMutAct_9fa48("242") ? {} : (stryCov_9fa48("242"), {
      icon: <Shield className="w-6 h-6" />,
      title: stryMutAct_9fa48("243") ? "" : (stryCov_9fa48("243"), 'Privacy Protection'),
      description: stryMutAct_9fa48("244") ? "" : (stryCov_9fa48("244"), 'Enterprise-grade security with privacy-by-design architecture.'),
      detail: stryMutAct_9fa48("245") ? "" : (stryCov_9fa48("245"), 'End-to-end encryption, GDPR compliance, and user-controlled data sharing ensure complete privacy protection.')
    }), stryMutAct_9fa48("246") ? {} : (stryCov_9fa48("246"), {
      icon: <Globe className="w-6 h-6" />,
      title: stryMutAct_9fa48("247") ? "" : (stryCov_9fa48("247"), 'Global Product Database'),
      description: stryMutAct_9fa48("248") ? "" : (stryCov_9fa48("248"), 'Curated catalogue of over 1 million products from trusted retailers.'),
      detail: stryMutAct_9fa48("249") ? "" : (stryCov_9fa48("249"), 'Real-time product data, pricing updates, and availability checks across multiple international marketplaces.')
    }), stryMutAct_9fa48("250") ? {} : (stryCov_9fa48("250"), {
      icon: <Clock className="w-6 h-6" />,
      title: stryMutAct_9fa48("251") ? "" : (stryCov_9fa48("251"), 'Real-Time Processing'),
      description: stryMutAct_9fa48("252") ? "" : (stryCov_9fa48("252"), 'Lightning-fast recommendations powered by cloud infrastructure.'),
      detail: stryMutAct_9fa48("253") ? "" : (stryCov_9fa48("253"), 'Sub-second response times using distributed computing and edge caching for optimal user experience.')
    }), stryMutAct_9fa48("254") ? {} : (stryCov_9fa48("254"), {
      icon: <TrendingUp className="w-6 h-6" />,
      title: stryMutAct_9fa48("255") ? "" : (stryCov_9fa48("255"), 'Trend Analysis'),
      description: stryMutAct_9fa48("256") ? "" : (stryCov_9fa48("256"), 'Seasonal and cultural trend integration for timely suggestions.'),
      detail: stryMutAct_9fa48("257") ? "" : (stryCov_9fa48("257"), 'Real-time trend analysis incorporating social media, market data, and seasonal patterns for relevant recommendations.')
    })]);
    const useCases = stryMutAct_9fa48("258") ? [] : (stryCov_9fa48("258"), [stryMutAct_9fa48("259") ? {} : (stryCov_9fa48("259"), {
      icon: <Gift className="w-8 h-8" />,
      title: stryMutAct_9fa48("260") ? "" : (stryCov_9fa48("260"), 'Birthday Gifts'),
      scenario: stryMutAct_9fa48("261") ? "" : (stryCov_9fa48("261"), 'Your best friend\'s birthday is next week'),
      solution: stryMutAct_9fa48("262") ? "" : (stryCov_9fa48("262"), 'Swipe through personalised options based on their interests, age, and your relationship history.'),
      outcome: stryMutAct_9fa48("263") ? "" : (stryCov_9fa48("263"), 'Find the perfect gift in under 5 minutes with 95% satisfaction guarantee.')
    }), stryMutAct_9fa48("264") ? {} : (stryCov_9fa48("264"), {
      icon: <Search className="w-8 h-8" />,
      title: stryMutAct_9fa48("265") ? "" : (stryCov_9fa48("265"), 'Holiday Shopping'),
      scenario: stryMutAct_9fa48("266") ? "" : (stryCov_9fa48("266"), 'Christmas shopping for the entire family'),
      solution: stryMutAct_9fa48("267") ? "" : (stryCov_9fa48("267"), 'Create individual profiles for each family member and get tailored recommendations for everyone.'),
      outcome: stryMutAct_9fa48("268") ? "" : (stryCov_9fa48("268"), 'Complete your holiday shopping efficiently with gifts everyone will love.')
    }), stryMutAct_9fa48("269") ? {} : (stryCov_9fa48("269"), {
      icon: <Share className="w-8 h-8" />,
      title: stryMutAct_9fa48("270") ? "" : (stryCov_9fa48("270"), 'Group Events'),
      scenario: stryMutAct_9fa48("271") ? "" : (stryCov_9fa48("271"), 'Office secret Santa or group wedding gift'),
      solution: stryMutAct_9fa48("272") ? "" : (stryCov_9fa48("272"), 'Collaborate with colleagues or friends to find the perfect group gift within budget.'),
      outcome: stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), 'Seamless group coordination with shared preferences and budget management.')
    })]);
    const comparisonFeatures = stryMutAct_9fa48("274") ? [] : (stryCov_9fa48("274"), [stryMutAct_9fa48("275") ? {} : (stryCov_9fa48("275"), {
      feature: stryMutAct_9fa48("276") ? "" : (stryCov_9fa48("276"), 'AI-Powered Recommendations'),
      aclue: stryMutAct_9fa48("277") ? false : (stryCov_9fa48("277"), true),
      traditional: stryMutAct_9fa48("278") ? true : (stryCov_9fa48("278"), false),
      description: stryMutAct_9fa48("279") ? "" : (stryCov_9fa48("279"), 'Personalised suggestions based on machine learning')
    }), stryMutAct_9fa48("280") ? {} : (stryCov_9fa48("280"), {
      feature: stryMutAct_9fa48("281") ? "" : (stryCov_9fa48("281"), 'Swipe Interface'),
      aclue: stryMutAct_9fa48("282") ? false : (stryCov_9fa48("282"), true),
      traditional: stryMutAct_9fa48("283") ? true : (stryCov_9fa48("283"), false),
      description: stryMutAct_9fa48("284") ? "" : (stryCov_9fa48("284"), 'Engaging, mobile-first discovery experience')
    }), stryMutAct_9fa48("285") ? {} : (stryCov_9fa48("285"), {
      feature: stryMutAct_9fa48("286") ? "" : (stryCov_9fa48("286"), 'Preference Learning'),
      aclue: stryMutAct_9fa48("287") ? false : (stryCov_9fa48("287"), true),
      traditional: stryMutAct_9fa48("288") ? true : (stryCov_9fa48("288"), false),
      description: stryMutAct_9fa48("289") ? "" : (stryCov_9fa48("289"), 'Continuous improvement through user interaction')
    }), stryMutAct_9fa48("290") ? {} : (stryCov_9fa48("290"), {
      feature: stryMutAct_9fa48("291") ? "" : (stryCov_9fa48("291"), 'Social Collaboration'),
      aclue: stryMutAct_9fa48("292") ? false : (stryCov_9fa48("292"), true),
      traditional: stryMutAct_9fa48("293") ? true : (stryCov_9fa48("293"), false),
      description: stryMutAct_9fa48("294") ? "" : (stryCov_9fa48("294"), 'Share and collaborate on gift ideas')
    }), stryMutAct_9fa48("295") ? {} : (stryCov_9fa48("295"), {
      feature: stryMutAct_9fa48("296") ? "" : (stryCov_9fa48("296"), 'Real-Time Updates'),
      aclue: stryMutAct_9fa48("297") ? false : (stryCov_9fa48("297"), true),
      traditional: stryMutAct_9fa48("298") ? true : (stryCov_9fa48("298"), false),
      description: stryMutAct_9fa48("299") ? "" : (stryCov_9fa48("299"), 'Live pricing and availability information')
    }), stryMutAct_9fa48("300") ? {} : (stryCov_9fa48("300"), {
      feature: stryMutAct_9fa48("301") ? "" : (stryCov_9fa48("301"), 'Manual Browsing Required'),
      aclue: stryMutAct_9fa48("302") ? true : (stryCov_9fa48("302"), false),
      traditional: stryMutAct_9fa48("303") ? false : (stryCov_9fa48("303"), true),
      description: stryMutAct_9fa48("304") ? "" : (stryCov_9fa48("304"), 'Time-consuming manual product search')
    })]);
    return <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Features That Make{stryMutAct_9fa48("305") ? "" : (stryCov_9fa48("305"), ' ')}
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
            {coreFeatures.map(stryMutAct_9fa48("306") ? () => undefined : (stryCov_9fa48("306"), (feature, index) => <div key={feature.title} className="flex gap-6">
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
                    {feature.benefits.map(stryMutAct_9fa48("307") ? () => undefined : (stryCov_9fa48("307"), (benefit, benefitIndex) => <li key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>))}
                  </ul>
                </div>
              </div>))}
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
            {technicalFeatures.map(stryMutAct_9fa48("308") ? () => undefined : (stryCov_9fa48("308"), (feature, index) => <div key={feature.title} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
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
              </div>))}
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
            {useCases.map(stryMutAct_9fa48("309") ? () => undefined : (stryCov_9fa48("309"), (useCase, index) => <div key={useCase.title} className={stryMutAct_9fa48("310") ? `` : (stryCov_9fa48("310"), `grid lg:grid-cols-3 gap-8 items-center ${(stryMutAct_9fa48("313") ? index % 2 !== 1 : stryMutAct_9fa48("312") ? false : stryMutAct_9fa48("311") ? true : (stryCov_9fa48("311", "312", "313"), (stryMutAct_9fa48("314") ? index * 2 : (stryCov_9fa48("314"), index % 2)) === 1)) ? stryMutAct_9fa48("315") ? "" : (stryCov_9fa48("315"), 'lg:grid-flow-col-dense') : stryMutAct_9fa48("316") ? "Stryker was here!" : (stryCov_9fa48("316"), '')}`)}>
                <div className={stryMutAct_9fa48("317") ? `` : (stryCov_9fa48("317"), `${(stryMutAct_9fa48("320") ? index % 2 !== 1 : stryMutAct_9fa48("319") ? false : stryMutAct_9fa48("318") ? true : (stryCov_9fa48("318", "319", "320"), (stryMutAct_9fa48("321") ? index * 2 : (stryCov_9fa48("321"), index % 2)) === 1)) ? stryMutAct_9fa48("322") ? "" : (stryCov_9fa48("322"), 'lg:col-start-3') : stryMutAct_9fa48("323") ? "Stryker was here!" : (stryCov_9fa48("323"), '')}`)}>
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                    {useCase.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {useCase.title}
                  </h3>
                </div>
                <div className={stryMutAct_9fa48("324") ? `` : (stryCov_9fa48("324"), `lg:col-span-2 space-y-6 ${(stryMutAct_9fa48("327") ? index % 2 !== 1 : stryMutAct_9fa48("326") ? false : stryMutAct_9fa48("325") ? true : (stryCov_9fa48("325", "326", "327"), (stryMutAct_9fa48("328") ? index * 2 : (stryCov_9fa48("328"), index % 2)) === 1)) ? stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), 'lg:col-start-1 lg:row-start-1') : stryMutAct_9fa48("330") ? "Stryker was here!" : (stryCov_9fa48("330"), '')}`)}>
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
              </div>))}
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

            {comparisonFeatures.map(stryMutAct_9fa48("331") ? () => undefined : (stryCov_9fa48("331"), (item, index) => <div key={item.feature} className={stryMutAct_9fa48("332") ? `` : (stryCov_9fa48("332"), `grid grid-cols-3 items-center py-4 px-6 ${(stryMutAct_9fa48("335") ? index % 2 !== 0 : stryMutAct_9fa48("334") ? false : stryMutAct_9fa48("333") ? true : (stryCov_9fa48("333", "334", "335"), (stryMutAct_9fa48("336") ? index * 2 : (stryCov_9fa48("336"), index % 2)) === 0)) ? stryMutAct_9fa48("337") ? "" : (stryCov_9fa48("337"), 'bg-gray-50') : stryMutAct_9fa48("338") ? "" : (stryCov_9fa48("338"), 'bg-white')}`)}>
                <div>
                  <div className="font-medium text-gray-900 mb-1">{item.feature}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
                <div className="text-center">
                  {item.aclue ? <CheckCircle className="w-6 h-6 text-green-500 mx-auto" /> : <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>}
                </div>
                <div className="text-center">
                  {item.traditional ? <CheckCircle className="w-6 h-6 text-green-500 mx-auto" /> : <div className="w-6 h-6 border-2 border-gray-300 rounded-full mx-auto"></div>}
                </div>
              </div>))}
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
                <Link href="/discover" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
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
            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/discover" className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Try Demo
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>;
  }
}

/**
 * SEO Metadata for Features Page
 */
export const metadata: Metadata = stryMutAct_9fa48("339") ? {} : (stryCov_9fa48("339"), {
  title: stryMutAct_9fa48("340") ? "" : (stryCov_9fa48("340"), 'Features - AI-Powered Gift Discovery Platform'),
  description: stryMutAct_9fa48("341") ? "" : (stryCov_9fa48("341"), 'Explore aclue\'s powerful features: AI recommendations, swipe discovery, instant gift links, and social gifting. See how technology transforms gift-giving.'),
  keywords: stryMutAct_9fa48("342") ? [] : (stryCov_9fa48("342"), [stryMutAct_9fa48("343") ? "" : (stryCov_9fa48("343"), 'ai gift features'), stryMutAct_9fa48("344") ? "" : (stryCov_9fa48("344"), 'gift discovery platform'), stryMutAct_9fa48("345") ? "" : (stryCov_9fa48("345"), 'machine learning gifts'), stryMutAct_9fa48("346") ? "" : (stryCov_9fa48("346"), 'swipe interface gifts'), stryMutAct_9fa48("347") ? "" : (stryCov_9fa48("347"), 'personalised recommendations'), stryMutAct_9fa48("348") ? "" : (stryCov_9fa48("348"), 'gift technology features'), stryMutAct_9fa48("349") ? "" : (stryCov_9fa48("349"), 'social gifting platform')]),
  openGraph: stryMutAct_9fa48("350") ? {} : (stryCov_9fa48("350"), {
    title: stryMutAct_9fa48("351") ? "" : (stryCov_9fa48("351"), 'Features - AI-Powered Gift Discovery Platform'),
    description: stryMutAct_9fa48("352") ? "" : (stryCov_9fa48("352"), 'Discover how AI recommendations, swipe discovery, and social gifting transform the way you find perfect gifts.'),
    url: stryMutAct_9fa48("353") ? "" : (stryCov_9fa48("353"), 'https://aclue.app/features'),
    images: stryMutAct_9fa48("354") ? [] : (stryCov_9fa48("354"), [stryMutAct_9fa48("355") ? {} : (stryCov_9fa48("355"), {
      url: stryMutAct_9fa48("356") ? "" : (stryCov_9fa48("356"), '/aclue_text_clean.png'),
      width: 1200,
      height: 630,
      alt: stryMutAct_9fa48("357") ? "" : (stryCov_9fa48("357"), 'aclue Features - AI Gift Discovery')
    })])
  }),
  twitter: stryMutAct_9fa48("358") ? {} : (stryCov_9fa48("358"), {
    card: stryMutAct_9fa48("359") ? "" : (stryCov_9fa48("359"), 'summary_large_image'),
    title: stryMutAct_9fa48("360") ? "" : (stryCov_9fa48("360"), 'Features - AI-Powered Gift Discovery Platform'),
    description: stryMutAct_9fa48("361") ? "" : (stryCov_9fa48("361"), 'Discover how AI recommendations and swipe discovery transform gift-giving.'),
    images: stryMutAct_9fa48("362") ? [] : (stryCov_9fa48("362"), [stryMutAct_9fa48("363") ? "" : (stryCov_9fa48("363"), '/aclue_text_clean.png')])
  }),
  alternates: stryMutAct_9fa48("364") ? {} : (stryCov_9fa48("364"), {
    canonical: stryMutAct_9fa48("365") ? "" : (stryCov_9fa48("365"), 'https://aclue.app/features')
  })
});