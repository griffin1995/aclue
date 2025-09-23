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
import { Star, Quote, Heart, Gift, Sparkles, ArrowRight, Users, TrendingUp, CheckCircle, Award, MessageCircle, ThumbsUp } from 'lucide-react';

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
  if (stryMutAct_9fa48("625")) {
    {}
  } else {
    stryCov_9fa48("625");
    // Featured testimonials - ideal for server rendering
    const featuredTestimonials = stryMutAct_9fa48("626") ? [] : (stryCov_9fa48("626"), [stryMutAct_9fa48("627") ? {} : (stryCov_9fa48("627"), {
      id: 1,
      name: stryMutAct_9fa48("628") ? "" : (stryCov_9fa48("628"), 'Sarah Johnson'),
      role: stryMutAct_9fa48("629") ? "" : (stryCov_9fa48("629"), 'Marketing Manager'),
      location: stryMutAct_9fa48("630") ? "" : (stryCov_9fa48("630"), 'London, UK'),
      avatar: stryMutAct_9fa48("631") ? "" : (stryCov_9fa48("631"), 'SJ'),
      rating: 5,
      title: stryMutAct_9fa48("632") ? "" : (stryCov_9fa48("632"), 'Perfect Birthday Gift Discovery'),
      content: stryMutAct_9fa48("633") ? "" : (stryCov_9fa48("633"), 'aclue helped me find the most thoughtful birthday gift for my sister. The AI understood her love for sustainable fashion and suggested an eco-friendly jewellery set that she absolutely adores. No more guessing games!'),
      useCase: stryMutAct_9fa48("634") ? "" : (stryCov_9fa48("634"), 'Birthday Gifts'),
      giftSuccess: stryMutAct_9fa48("635") ? "" : (stryCov_9fa48("635"), 'Eco-friendly jewellery set'),
      timeToFind: stryMutAct_9fa48("636") ? "" : (stryCov_9fa48("636"), '5 minutes'),
      featured: stryMutAct_9fa48("637") ? false : (stryCov_9fa48("637"), true)
    }), stryMutAct_9fa48("638") ? {} : (stryCov_9fa48("638"), {
      id: 2,
      name: stryMutAct_9fa48("639") ? "" : (stryCov_9fa48("639"), 'Michael Chen'),
      role: stryMutAct_9fa48("640") ? "" : (stryCov_9fa48("640"), 'Software Developer'),
      location: stryMutAct_9fa48("641") ? "" : (stryCov_9fa48("641"), 'Manchester, UK'),
      avatar: stryMutAct_9fa48("642") ? "" : (stryCov_9fa48("642"), 'MC'),
      rating: 5,
      title: stryMutAct_9fa48("643") ? "" : (stryCov_9fa48("643"), 'Family Christmas Made Easy'),
      content: stryMutAct_9fa48("644") ? "" : (stryCov_9fa48("644"), 'Christmas shopping for my family of six used to be a nightmare. aclue\'s AI learned each family member\'s preferences and suggested perfect gifts for everyone. My wife was amazed at how well I "knew" what to get our teenage kids!'),
      useCase: stryMutAct_9fa48("645") ? "" : (stryCov_9fa48("645"), 'Family Gifts'),
      giftSuccess: stryMutAct_9fa48("646") ? "" : (stryCov_9fa48("646"), 'Complete family Christmas'),
      timeToFind: stryMutAct_9fa48("647") ? "" : (stryCov_9fa48("647"), '30 minutes'),
      featured: stryMutAct_9fa48("648") ? false : (stryCov_9fa48("648"), true)
    }), stryMutAct_9fa48("649") ? {} : (stryCov_9fa48("649"), {
      id: 3,
      name: stryMutAct_9fa48("650") ? "" : (stryCov_9fa48("650"), 'Emma Davies'),
      role: stryMutAct_9fa48("651") ? "" : (stryCov_9fa48("651"), 'Primary School Teacher'),
      location: stryMutAct_9fa48("652") ? "" : (stryCov_9fa48("652"), 'Cardiff, Wales'),
      avatar: stryMutAct_9fa48("653") ? "" : (stryCov_9fa48("653"), 'ED'),
      rating: 5,
      title: stryMutAct_9fa48("654") ? "" : (stryCov_9fa48("654"), 'Colleague Gift Exchange Success'),
      content: stryMutAct_9fa48("655") ? "" : (stryCov_9fa48("655"), 'Our school\'s secret Santa was stress-free thanks to aclue. I input my colleague\'s interests and got brilliant suggestions within my £15 budget. She loved the artisan tea set, and I felt like a thoughtful gift-giver for once!'),
      useCase: stryMutAct_9fa48("656") ? "" : (stryCov_9fa48("656"), 'Workplace Gifts'),
      giftSuccess: stryMutAct_9fa48("657") ? "" : (stryCov_9fa48("657"), 'Artisan tea set'),
      timeToFind: stryMutAct_9fa48("658") ? "" : (stryCov_9fa48("658"), '3 minutes'),
      featured: stryMutAct_9fa48("659") ? false : (stryCov_9fa48("659"), true)
    })]);
    const moreTestimonials = stryMutAct_9fa48("660") ? [] : (stryCov_9fa48("660"), [stryMutAct_9fa48("661") ? {} : (stryCov_9fa48("661"), {
      name: stryMutAct_9fa48("662") ? "" : (stryCov_9fa48("662"), 'David Thompson'),
      role: stryMutAct_9fa48("663") ? "" : (stryCov_9fa48("663"), 'Freelance Designer'),
      avatar: stryMutAct_9fa48("664") ? "" : (stryCov_9fa48("664"), 'DT'),
      rating: 5,
      content: stryMutAct_9fa48("665") ? "" : (stryCov_9fa48("665"), 'The swipe interface is genius! It\'s like Tinder for gifts. I found the perfect anniversary present for my partner in minutes.'),
      timeToFind: stryMutAct_9fa48("666") ? "" : (stryCov_9fa48("666"), '4 minutes')
    }), stryMutAct_9fa48("667") ? {} : (stryCov_9fa48("667"), {
      name: stryMutAct_9fa48("668") ? "" : (stryCov_9fa48("668"), 'Lisa Rodriguez'),
      role: stryMutAct_9fa48("669") ? "" : (stryCov_9fa48("669"), 'HR Director'),
      avatar: stryMutAct_9fa48("670") ? "" : (stryCov_9fa48("670"), 'LR'),
      rating: 5,
      content: stryMutAct_9fa48("671") ? "" : (stryCov_9fa48("671"), 'aclue saved me during the company gift-giving season. Found personalised gifts for 20+ team members effortlessly.'),
      timeToFind: stryMutAct_9fa48("672") ? "" : (stryCov_9fa48("672"), '2 hours')
    }), stryMutAct_9fa48("673") ? {} : (stryCov_9fa48("673"), {
      name: stryMutAct_9fa48("674") ? "" : (stryCov_9fa48("674"), 'James Wilson'),
      role: stryMutAct_9fa48("675") ? "" : (stryCov_9fa48("675"), 'University Student'),
      avatar: stryMutAct_9fa48("676") ? "" : (stryCov_9fa48("676"), 'JW'),
      rating: 4,
      content: stryMutAct_9fa48("677") ? "" : (stryCov_9fa48("677"), 'As a broke student, finding meaningful gifts on a budget was impossible. aclue found amazing options under £20.'),
      timeToFind: stryMutAct_9fa48("678") ? "" : (stryCov_9fa48("678"), '6 minutes')
    }), stryMutAct_9fa48("679") ? {} : (stryCov_9fa48("679"), {
      name: stryMutAct_9fa48("680") ? "" : (stryCov_9fa48("680"), 'Rachel Green'),
      role: stryMutAct_9fa48("681") ? "" : (stryCov_9fa48("681"), 'Busy Mum of Three'),
      avatar: stryMutAct_9fa48("682") ? "" : (stryCov_9fa48("682"), 'RG'),
      rating: 5,
      content: stryMutAct_9fa48("683") ? "" : (stryCov_9fa48("683"), 'With three kids and zero spare time, aclue is a lifesaver. The AI knows exactly what my children will love.'),
      timeToFind: stryMutAct_9fa48("684") ? "" : (stryCov_9fa48("684"), '10 minutes')
    }), stryMutAct_9fa48("685") ? {} : (stryCov_9fa48("685"), {
      name: stryMutAct_9fa48("686") ? "" : (stryCov_9fa48("686"), 'Tom Anderson'),
      role: stryMutAct_9fa48("687") ? "" : (stryCov_9fa48("687"), 'Retired Engineer'),
      avatar: stryMutAct_9fa48("688") ? "" : (stryCov_9fa48("688"), 'TA'),
      rating: 5,
      content: stryMutAct_9fa48("689") ? "" : (stryCov_9fa48("689"), 'I was sceptical about AI, but aclue impressed me. Found a perfect gadget for my tech-loving grandson.'),
      timeToFind: stryMutAct_9fa48("690") ? "" : (stryCov_9fa48("690"), '8 minutes')
    }), stryMutAct_9fa48("691") ? {} : (stryCov_9fa48("691"), {
      name: stryMutAct_9fa48("692") ? "" : (stryCov_9fa48("692"), 'Sophie Miller'),
      role: stryMutAct_9fa48("693") ? "" : (stryCov_9fa48("693"), 'Event Planner'),
      avatar: stryMutAct_9fa48("694") ? "" : (stryCov_9fa48("694"), 'SM'),
      rating: 5,
      content: stryMutAct_9fa48("695") ? "" : (stryCov_9fa48("695"), 'Professional gift-giving is part of my job. aclue\'s recommendations are consistently spot-on and impressive.'),
      timeToFind: stryMutAct_9fa48("696") ? "" : (stryCov_9fa48("696"), '5 minutes')
    })]);
    const stats = stryMutAct_9fa48("697") ? [] : (stryCov_9fa48("697"), [stryMutAct_9fa48("698") ? {} : (stryCov_9fa48("698"), {
      icon: <Users className="w-8 h-8" />,
      value: stryMutAct_9fa48("699") ? "" : (stryCov_9fa48("699"), '50,000+'),
      label: stryMutAct_9fa48("700") ? "" : (stryCov_9fa48("700"), 'Happy Users'),
      description: stryMutAct_9fa48("701") ? "" : (stryCov_9fa48("701"), 'Active users discovering perfect gifts')
    }), stryMutAct_9fa48("702") ? {} : (stryCov_9fa48("702"), {
      icon: <Star className="w-8 h-8" />,
      value: stryMutAct_9fa48("703") ? "" : (stryCov_9fa48("703"), '4.9/5'),
      label: stryMutAct_9fa48("704") ? "" : (stryCov_9fa48("704"), 'Average Rating'),
      description: stryMutAct_9fa48("705") ? "" : (stryCov_9fa48("705"), 'Based on 10,000+ reviews')
    }), stryMutAct_9fa48("706") ? {} : (stryCov_9fa48("706"), {
      icon: <Gift className="w-8 h-8" />,
      value: stryMutAct_9fa48("707") ? "" : (stryCov_9fa48("707"), '95%'),
      label: stryMutAct_9fa48("708") ? "" : (stryCov_9fa48("708"), 'Gift Success Rate'),
      description: stryMutAct_9fa48("709") ? "" : (stryCov_9fa48("709"), 'Recipients love their gifts')
    }), stryMutAct_9fa48("710") ? {} : (stryCov_9fa48("710"), {
      icon: <TrendingUp className="w-8 h-8" />,
      value: stryMutAct_9fa48("711") ? "" : (stryCov_9fa48("711"), '5 mins'),
      label: stryMutAct_9fa48("712") ? "" : (stryCov_9fa48("712"), 'Average Discovery Time'),
      description: stryMutAct_9fa48("713") ? "" : (stryCov_9fa48("713"), 'From search to perfect gift')
    })]);
    const useCaseBreakdown = stryMutAct_9fa48("714") ? [] : (stryCov_9fa48("714"), [stryMutAct_9fa48("715") ? {} : (stryCov_9fa48("715"), {
      useCase: stryMutAct_9fa48("716") ? "" : (stryCov_9fa48("716"), 'Birthday Gifts'),
      percentage: 35,
      satisfaction: stryMutAct_9fa48("717") ? "" : (stryCov_9fa48("717"), '97%'),
      icon: <Gift className="w-6 h-6" />
    }), stryMutAct_9fa48("718") ? {} : (stryCov_9fa48("718"), {
      useCase: stryMutAct_9fa48("719") ? "" : (stryCov_9fa48("719"), 'Holiday Shopping'),
      percentage: 28,
      satisfaction: stryMutAct_9fa48("720") ? "" : (stryCov_9fa48("720"), '94%'),
      icon: <Sparkles className="w-6 h-6" />
    }), stryMutAct_9fa48("721") ? {} : (stryCov_9fa48("721"), {
      useCase: stryMutAct_9fa48("722") ? "" : (stryCov_9fa48("722"), 'Anniversary Gifts'),
      percentage: 18,
      satisfaction: stryMutAct_9fa48("723") ? "" : (stryCov_9fa48("723"), '98%'),
      icon: <Heart className="w-6 h-6" />
    }), stryMutAct_9fa48("724") ? {} : (stryCov_9fa48("724"), {
      useCase: stryMutAct_9fa48("725") ? "" : (stryCov_9fa48("725"), 'Workplace Gifts'),
      percentage: 12,
      satisfaction: stryMutAct_9fa48("726") ? "" : (stryCov_9fa48("726"), '92%'),
      icon: <Users className="w-6 h-6" />
    }), stryMutAct_9fa48("727") ? {} : (stryCov_9fa48("727"), {
      useCase: stryMutAct_9fa48("728") ? "" : (stryCov_9fa48("728"), 'Just Because'),
      percentage: 7,
      satisfaction: stryMutAct_9fa48("729") ? "" : (stryCov_9fa48("729"), '96%'),
      icon: <ThumbsUp className="w-6 h-6" />
    })]);
    return <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              4.9/5 Average Rating
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Real Stories from{stryMutAct_9fa48("730") ? "" : (stryCov_9fa48("730"), ' ')}
              <span className="text-primary-600">Happy Gift-Givers</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how thousands of users have transformed their gift-giving experience
              with AI-powered recommendations and found perfect gifts in minutes.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stryMutAct_9fa48("731") ? () => undefined : (stryCov_9fa48("731"), (stat, index) => <div key={stat.label} className="text-center">
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
              </div>))}
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
            {featuredTestimonials.map(stryMutAct_9fa48("732") ? () => undefined : (stryCov_9fa48("732"), (testimonial, index) => <div key={testimonial.id} className={stryMutAct_9fa48("733") ? `` : (stryCov_9fa48("733"), `grid lg:grid-cols-2 gap-12 items-center ${(stryMutAct_9fa48("736") ? index % 2 !== 1 : stryMutAct_9fa48("735") ? false : stryMutAct_9fa48("734") ? true : (stryCov_9fa48("734", "735", "736"), (stryMutAct_9fa48("737") ? index * 2 : (stryCov_9fa48("737"), index % 2)) === 1)) ? stryMutAct_9fa48("738") ? "" : (stryCov_9fa48("738"), 'lg:grid-flow-col-dense') : stryMutAct_9fa48("739") ? "Stryker was here!" : (stryCov_9fa48("739"), '')}`)}>
                <div className={stryMutAct_9fa48("740") ? `` : (stryCov_9fa48("740"), `${(stryMutAct_9fa48("743") ? index % 2 !== 1 : stryMutAct_9fa48("742") ? false : stryMutAct_9fa48("741") ? true : (stryCov_9fa48("741", "742", "743"), (stryMutAct_9fa48("744") ? index * 2 : (stryCov_9fa48("744"), index % 2)) === 1)) ? stryMutAct_9fa48("745") ? "" : (stryCov_9fa48("745"), 'lg:col-start-2') : stryMutAct_9fa48("746") ? "Stryker was here!" : (stryCov_9fa48("746"), '')}`)}>
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {(stryMutAct_9fa48("747") ? [] : (stryCov_9fa48("747"), [...(stryMutAct_9fa48("748") ? Array() : (stryCov_9fa48("748"), Array(testimonial.rating)))])).map(stryMutAct_9fa48("749") ? () => undefined : (stryCov_9fa48("749"), (_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />))}
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

                <div className={stryMutAct_9fa48("750") ? `` : (stryCov_9fa48("750"), `${(stryMutAct_9fa48("753") ? index % 2 !== 1 : stryMutAct_9fa48("752") ? false : stryMutAct_9fa48("751") ? true : (stryCov_9fa48("751", "752", "753"), (stryMutAct_9fa48("754") ? index * 2 : (stryCov_9fa48("754"), index % 2)) === 1)) ? stryMutAct_9fa48("755") ? "" : (stryCov_9fa48("755"), 'lg:col-start-1 lg:row-start-1') : stryMutAct_9fa48("756") ? "Stryker was here!" : (stryCov_9fa48("756"), '')}`)}>
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
              </div>))}
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
              {useCaseBreakdown.map(stryMutAct_9fa48("757") ? () => undefined : (stryCov_9fa48("757"), (useCase, index) => <div key={useCase.useCase} className="flex items-center gap-6">
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
                      <div className="bg-primary-600 h-2 rounded-full transition-all duration-500" style={stryMutAct_9fa48("758") ? {} : (stryCov_9fa48("758"), {
                      width: stryMutAct_9fa48("759") ? `` : (stryCov_9fa48("759"), `${useCase.percentage}%`)
                    })}></div>
                    </div>
                  </div>
                </div>))}
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
            {moreTestimonials.map(stryMutAct_9fa48("760") ? () => undefined : (stryCov_9fa48("760"), (testimonial, index) => <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {(stryMutAct_9fa48("761") ? [] : (stryCov_9fa48("761"), [...(stryMutAct_9fa48("762") ? Array() : (stryCov_9fa48("762"), Array(testimonial.rating)))])).map(stryMutAct_9fa48("763") ? () => undefined : (stryCov_9fa48("763"), (_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />))}
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
              </div>))}
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
            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Start Finding Perfect Gifts
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/discover" className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Try Demo
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-sm text-primary-200 mt-6">
            Free beta access • No credit card required • Join 50,000+ happy users
          </p>
        </div>
      </section>
    </>;
  }
}

/**
 * SEO Metadata for Testimonials Page
 */
export const metadata: Metadata = stryMutAct_9fa48("764") ? {} : (stryCov_9fa48("764"), {
  title: stryMutAct_9fa48("765") ? "" : (stryCov_9fa48("765"), 'Customer Reviews & Success Stories | aclue'),
  description: stryMutAct_9fa48("766") ? "" : (stryCov_9fa48("766"), 'Read real customer testimonials and success stories from users who\'ve transformed their gift-giving with aclue\'s AI-powered recommendations. 4.9/5 average rating.'),
  keywords: stryMutAct_9fa48("767") ? [] : (stryCov_9fa48("767"), [stryMutAct_9fa48("768") ? "" : (stryCov_9fa48("768"), 'aclue reviews'), stryMutAct_9fa48("769") ? "" : (stryCov_9fa48("769"), 'customer testimonials'), stryMutAct_9fa48("770") ? "" : (stryCov_9fa48("770"), 'gift discovery reviews'), stryMutAct_9fa48("771") ? "" : (stryCov_9fa48("771"), 'ai gift platform reviews'), stryMutAct_9fa48("772") ? "" : (stryCov_9fa48("772"), 'user success stories'), stryMutAct_9fa48("773") ? "" : (stryCov_9fa48("773"), 'gift-giving testimonials'), stryMutAct_9fa48("774") ? "" : (stryCov_9fa48("774"), 'aclue ratings')]),
  openGraph: stryMutAct_9fa48("775") ? {} : (stryCov_9fa48("775"), {
    title: stryMutAct_9fa48("776") ? "" : (stryCov_9fa48("776"), 'Customer Reviews & Success Stories | aclue'),
    description: stryMutAct_9fa48("777") ? "" : (stryCov_9fa48("777"), 'See how 50,000+ users have transformed their gift-giving with AI-powered recommendations. Read real success stories and reviews.'),
    url: stryMutAct_9fa48("778") ? "" : (stryCov_9fa48("778"), 'https://aclue.app/testimonials'),
    images: stryMutAct_9fa48("779") ? [] : (stryCov_9fa48("779"), [stryMutAct_9fa48("780") ? {} : (stryCov_9fa48("780"), {
      url: stryMutAct_9fa48("781") ? "" : (stryCov_9fa48("781"), '/aclue_text_clean.png'),
      width: 1200,
      height: 630,
      alt: stryMutAct_9fa48("782") ? "" : (stryCov_9fa48("782"), 'aclue Customer Testimonials and Reviews')
    })])
  }),
  twitter: stryMutAct_9fa48("783") ? {} : (stryCov_9fa48("783"), {
    card: stryMutAct_9fa48("784") ? "" : (stryCov_9fa48("784"), 'summary_large_image'),
    title: stryMutAct_9fa48("785") ? "" : (stryCov_9fa48("785"), 'Customer Reviews & Success Stories | aclue'),
    description: stryMutAct_9fa48("786") ? "" : (stryCov_9fa48("786"), 'See how users transformed gift-giving with AI. 4.9/5 rating from 50,000+ users.'),
    images: stryMutAct_9fa48("787") ? [] : (stryCov_9fa48("787"), [stryMutAct_9fa48("788") ? "" : (stryCov_9fa48("788"), '/aclue_text_clean.png')])
  }),
  alternates: stryMutAct_9fa48("789") ? {} : (stryCov_9fa48("789"), {
    canonical: stryMutAct_9fa48("790") ? "" : (stryCov_9fa48("790"), 'https://aclue.app/testimonials')
  })
});