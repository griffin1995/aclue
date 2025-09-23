/**
 * Help Centre Page
 * 
 * Comprehensive help and support page providing users with guides,
 * FAQs, and support resources for using aclue effectively.
 */
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
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { HelpCircle, Search, Gift, Heart, Settings, User, Shield, MessageCircle, ExternalLink, ChevronDown, ChevronUp, Book, Zap, Target } from 'lucide-react';
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
const faqs: FAQItem[] = stryMutAct_9fa48("13951") ? [] : (stryCov_9fa48("13951"), [stryMutAct_9fa48("13952") ? {} : (stryCov_9fa48("13952"), {
  id: stryMutAct_9fa48("13953") ? "" : (stryCov_9fa48("13953"), "how-it-works"),
  question: stryMutAct_9fa48("13954") ? "" : (stryCov_9fa48("13954"), "How does aclue work?"),
  answer: stryMutAct_9fa48("13955") ? "" : (stryCov_9fa48("13955"), "aclue uses AI-powered recommendations based on your preferences. Simply swipe through products to help our algorithm learn your taste, then receive personalised gift suggestions for yourself or others."),
  category: stryMutAct_9fa48("13956") ? "" : (stryCov_9fa48("13956"), "Getting Started")
}), stryMutAct_9fa48("13957") ? {} : (stryCov_9fa48("13957"), {
  id: stryMutAct_9fa48("13958") ? "" : (stryCov_9fa48("13958"), "create-account"),
  question: stryMutAct_9fa48("13959") ? "" : (stryCov_9fa48("13959"), "How do I create an account?"),
  answer: stryMutAct_9fa48("13960") ? "" : (stryCov_9fa48("13960"), "Click 'Sign Up' on the homepage, enter your email and create a password. You'll receive a confirmation email to verify your account."),
  category: stryMutAct_9fa48("13961") ? "" : (stryCov_9fa48("13961"), "Getting Started")
}), stryMutAct_9fa48("13962") ? {} : (stryCov_9fa48("13962"), {
  id: stryMutAct_9fa48("13963") ? "" : (stryCov_9fa48("13963"), "swipe-system"),
  question: stryMutAct_9fa48("13964") ? "" : (stryCov_9fa48("13964"), "How does the swipe system work?"),
  answer: stryMutAct_9fa48("13965") ? "" : (stryCov_9fa48("13965"), "Swipe right on products you like, left on products you don't. The more you swipe, the better our AI understands your preferences and improves recommendations."),
  category: stryMutAct_9fa48("13966") ? "" : (stryCov_9fa48("13966"), "Using aclue")
}), stryMutAct_9fa48("13967") ? {} : (stryCov_9fa48("13967"), {
  id: stryMutAct_9fa48("13968") ? "" : (stryCov_9fa48("13968"), "recommendations"),
  question: stryMutAct_9fa48("13969") ? "" : (stryCov_9fa48("13969"), "How are recommendations generated?"),
  answer: stryMutAct_9fa48("13970") ? "" : (stryCov_9fa48("13970"), "Our AI analyses your swipe patterns, preferred categories, and interaction history to generate personalised recommendations with confidence scores."),
  category: stryMutAct_9fa48("13971") ? "" : (stryCov_9fa48("13971"), "Using aclue")
}), stryMutAct_9fa48("13972") ? {} : (stryCov_9fa48("13972"), {
  id: stryMutAct_9fa48("13973") ? "" : (stryCov_9fa48("13973"), "affiliate-links"),
  question: stryMutAct_9fa48("13974") ? "" : (stryCov_9fa48("13974"), "What are affiliate links?"),
  answer: stryMutAct_9fa48("13975") ? "" : (stryCov_9fa48("13975"), "Some product links earn us a small commission when you make a purchase, at no extra cost to you. This helps keep aclue free whilst supporting quality recommendations."),
  category: stryMutAct_9fa48("13976") ? "" : (stryCov_9fa48("13976"), "Shopping")
}), stryMutAct_9fa48("13977") ? {} : (stryCov_9fa48("13977"), {
  id: stryMutAct_9fa48("13978") ? "" : (stryCov_9fa48("13978"), "data-privacy"),
  question: stryMutAct_9fa48("13979") ? "" : (stryCov_9fa48("13979"), "How is my data protected?"),
  answer: stryMutAct_9fa48("13980") ? "" : (stryCov_9fa48("13980"), "We follow GDPR guidelines and only collect necessary data to improve your experience. You can view, export, or delete your data anytime in your account settings."),
  category: stryMutAct_9fa48("13981") ? "" : (stryCov_9fa48("13981"), "Privacy & Security")
}), stryMutAct_9fa48("13982") ? {} : (stryCov_9fa48("13982"), {
  id: stryMutAct_9fa48("13983") ? "" : (stryCov_9fa48("13983"), "delete-account"),
  question: stryMutAct_9fa48("13984") ? "" : (stryCov_9fa48("13984"), "How do I delete my account?"),
  answer: stryMutAct_9fa48("13985") ? "" : (stryCov_9fa48("13985"), "Go to Account Settings > Privacy & Data > Delete Account. This will permanently remove all your data from our systems."),
  category: stryMutAct_9fa48("13986") ? "" : (stryCov_9fa48("13986"), "Privacy & Security")
}), stryMutAct_9fa48("13987") ? {} : (stryCov_9fa48("13987"), {
  id: stryMutAct_9fa48("13988") ? "" : (stryCov_9fa48("13988"), "recommendation-accuracy"),
  question: stryMutAct_9fa48("13989") ? "" : (stryCov_9fa48("13989"), "Why aren't my recommendations accurate?"),
  answer: stryMutAct_9fa48("13990") ? "" : (stryCov_9fa48("13990"), "Recommendations improve with more swipe data. Try swiping through more products in different categories to help our algorithm better understand your preferences."),
  category: stryMutAct_9fa48("13991") ? "" : (stryCov_9fa48("13991"), "Troubleshooting")
})]);
const categories = stryMutAct_9fa48("13992") ? [] : (stryCov_9fa48("13992"), [stryMutAct_9fa48("13993") ? "" : (stryCov_9fa48("13993"), "All"), stryMutAct_9fa48("13994") ? "" : (stryCov_9fa48("13994"), "Getting Started"), stryMutAct_9fa48("13995") ? "" : (stryCov_9fa48("13995"), "Using aclue"), stryMutAct_9fa48("13996") ? "" : (stryCov_9fa48("13996"), "Shopping"), stryMutAct_9fa48("13997") ? "" : (stryCov_9fa48("13997"), "Privacy & Security"), stryMutAct_9fa48("13998") ? "" : (stryCov_9fa48("13998"), "Troubleshooting")]);
const HelpCentrePage: React.FC = () => {
  if (stryMutAct_9fa48("13999")) {
    {}
  } else {
    stryCov_9fa48("13999");
    const [selectedCategory, setSelectedCategory] = useState(stryMutAct_9fa48("14000") ? "" : (stryCov_9fa48("14000"), "All"));
    const [searchQuery, setSearchQuery] = useState(stryMutAct_9fa48("14001") ? "Stryker was here!" : (stryCov_9fa48("14001"), ""));
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
    const filteredFAQs = stryMutAct_9fa48("14002") ? faqs : (stryCov_9fa48("14002"), faqs.filter(faq => {
      if (stryMutAct_9fa48("14003")) {
        {}
      } else {
        stryCov_9fa48("14003");
        const matchesCategory = stryMutAct_9fa48("14006") ? selectedCategory === "All" && faq.category === selectedCategory : stryMutAct_9fa48("14005") ? false : stryMutAct_9fa48("14004") ? true : (stryCov_9fa48("14004", "14005", "14006"), (stryMutAct_9fa48("14008") ? selectedCategory !== "All" : stryMutAct_9fa48("14007") ? false : (stryCov_9fa48("14007", "14008"), selectedCategory === (stryMutAct_9fa48("14009") ? "" : (stryCov_9fa48("14009"), "All")))) || (stryMutAct_9fa48("14011") ? faq.category !== selectedCategory : stryMutAct_9fa48("14010") ? false : (stryCov_9fa48("14010", "14011"), faq.category === selectedCategory)));
        const matchesSearch = stryMutAct_9fa48("14014") ? (searchQuery === "" || faq.question.toLowerCase().includes(searchQuery.toLowerCase())) && faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("14013") ? false : stryMutAct_9fa48("14012") ? true : (stryCov_9fa48("14012", "14013", "14014"), (stryMutAct_9fa48("14016") ? searchQuery === "" && faq.question.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("14015") ? false : (stryCov_9fa48("14015", "14016"), (stryMutAct_9fa48("14018") ? searchQuery !== "" : stryMutAct_9fa48("14017") ? false : (stryCov_9fa48("14017", "14018"), searchQuery === (stryMutAct_9fa48("14019") ? "Stryker was here!" : (stryCov_9fa48("14019"), "")))) || (stryMutAct_9fa48("14020") ? faq.question.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("14020"), faq.question.toLowerCase().includes(stryMutAct_9fa48("14021") ? searchQuery.toUpperCase() : (stryCov_9fa48("14021"), searchQuery.toLowerCase())))))) || (stryMutAct_9fa48("14022") ? faq.answer.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("14022"), faq.answer.toLowerCase().includes(stryMutAct_9fa48("14023") ? searchQuery.toUpperCase() : (stryCov_9fa48("14023"), searchQuery.toLowerCase())))));
        return stryMutAct_9fa48("14026") ? matchesCategory || matchesSearch : stryMutAct_9fa48("14025") ? false : stryMutAct_9fa48("14024") ? true : (stryCov_9fa48("14024", "14025", "14026"), matchesCategory && matchesSearch);
      }
    }));
    const toggleFAQ = (id: string) => {
      if (stryMutAct_9fa48("14027")) {
        {}
      } else {
        stryCov_9fa48("14027");
        setExpandedFAQ((stryMutAct_9fa48("14030") ? expandedFAQ !== id : stryMutAct_9fa48("14029") ? false : stryMutAct_9fa48("14028") ? true : (stryCov_9fa48("14028", "14029", "14030"), expandedFAQ === id)) ? null : id);
      }
    };
    return <>
      <Head>
        <title>Help Centre - aclue</title>
        <meta name="description" content="Get help with aclue - find answers to common questions, learn how to use our AI-powered gift recommendation system, and get support." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://aclue.app/help" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Help Centre</h1>
                <p className="text-gray-600">Find answers and get support</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search for help articles..." value={searchQuery} onChange={stryMutAct_9fa48("14031") ? () => undefined : (stryCov_9fa48("14031"), e => setSearchQuery(e.target.value))} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Quick Help Cards */}
            <div className="lg:col-span-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Help</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/auth/register" className="group">
                  <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
                    <p className="text-gray-600 text-sm">Create your account and start discovering personalised gift recommendations</p>
                  </div>
                </Link>

                <Link href="/dashboard" className="group">
                  <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Using aclue</h3>
                    <p className="text-gray-600 text-sm">Learn how to swipe, get recommendations, and find perfect gifts</p>
                  </div>
                </Link>

                <Link href="/contact" className="group">
                  <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                    <p className="text-gray-600 text-sm">Get personalised help from our support team</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map(stryMutAct_9fa48("14032") ? () => undefined : (stryCov_9fa48("14032"), category => <button key={category} onClick={stryMutAct_9fa48("14033") ? () => undefined : (stryCov_9fa48("14033"), () => setSelectedCategory(category))} className={stryMutAct_9fa48("14034") ? `` : (stryCov_9fa48("14034"), `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${(stryMutAct_9fa48("14037") ? selectedCategory !== category : stryMutAct_9fa48("14036") ? false : stryMutAct_9fa48("14035") ? true : (stryCov_9fa48("14035", "14036", "14037"), selectedCategory === category)) ? stryMutAct_9fa48("14038") ? "" : (stryCov_9fa48("14038"), 'bg-primary-600 text-white') : stryMutAct_9fa48("14039") ? "" : (stryCov_9fa48("14039"), 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`)}>
                      {category}
                    </button>))}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.map(stryMutAct_9fa48("14040") ? () => undefined : (stryCov_9fa48("14040"), faq => <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button onClick={stryMutAct_9fa48("14041") ? () => undefined : (stryCov_9fa48("14041"), () => toggleFAQ(faq.id))} className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {(stryMutAct_9fa48("14044") ? expandedFAQ !== faq.id : stryMutAct_9fa48("14043") ? false : stryMutAct_9fa48("14042") ? true : (stryCov_9fa48("14042", "14043", "14044"), expandedFAQ === faq.id)) ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                      </button>
                      {stryMutAct_9fa48("14047") ? expandedFAQ === faq.id || <div className="px-4 pb-4 text-gray-600">
                          {faq.answer}
                        </div> : stryMutAct_9fa48("14046") ? false : stryMutAct_9fa48("14045") ? true : (stryCov_9fa48("14045", "14046", "14047"), (stryMutAct_9fa48("14049") ? expandedFAQ !== faq.id : stryMutAct_9fa48("14048") ? true : (stryCov_9fa48("14048", "14049"), expandedFAQ === faq.id)) && <div className="px-4 pb-4 text-gray-600">
                          {faq.answer}
                        </div>)}
                    </div>))}
                </div>

                {stryMutAct_9fa48("14052") ? filteredFAQs.length === 0 || <div className="text-center py-8">
                    <p className="text-gray-500">No articles found matching your search.</p>
                  </div> : stryMutAct_9fa48("14051") ? false : stryMutAct_9fa48("14050") ? true : (stryCov_9fa48("14050", "14051", "14052"), (stryMutAct_9fa48("14054") ? filteredFAQs.length !== 0 : stryMutAct_9fa48("14053") ? true : (stryCov_9fa48("14053", "14054"), filteredFAQs.length === 0)) && <div className="text-center py-8">
                    <p className="text-gray-500">No articles found matching your search.</p>
                  </div>)}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Support */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Need More Help?</h3>
                <div className="space-y-3">
                  <Link href="/contact" className="flex items-center gap-3 text-primary-600 hover:text-primary-700 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>Contact Support</span>
                  </Link>
                  <Link href="mailto:support@aclue.app" className="flex items-center gap-3 text-primary-600 hover:text-primary-700 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                    <span>Email Support</span>
                  </Link>
                </div>
              </div>

              {/* Legal Links */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Legal & Privacy</h3>
                <div className="space-y-3">
                  <Link href="/privacy" className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors">
                    <Shield className="w-5 h-5" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link href="/terms" className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors">
                    <Book className="w-5 h-5" />
                    <span>Terms of Service</span>
                  </Link>
                  <Link href="/data-protection" className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors">
                    <User className="w-5 h-5" />
                    <span>Data Protection Rights</span>
                  </Link>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">💡 Pro Tips</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Swipe through at least 20 products for better recommendations</p>
                  <p>• Update your preferences regularly as your tastes change</p>
                  <p>• Use specific search terms to find targeted gift ideas</p>
                  <p>• Check back regularly for new product recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top */}
        <div className="text-center py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors">
            ← Back to aclue
          </Link>
        </div>
      </div>
    </>;
  }
};
export default HelpCentrePage;