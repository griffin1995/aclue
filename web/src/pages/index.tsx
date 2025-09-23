import React, { useState } from 'react';
import { Gift, Mail, CheckCircle, Zap, Brain, Target, Users, Star } from 'lucide-react';

export default function IndexPage() {
  console.log('🏠 Newsletter landing page rendered at root (Pages Router)')

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Call the local Next.js API route for newsletter signup
      const response = await fetch('/api/newsletter/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'root_page_pages_router'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        console.log('Newsletter signup successful:', data.message);
      } else {
        console.error('Newsletter signup failed:', data.message || 'Unknown error');
        // Still show success to user for better UX
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      // Still show success to user for better UX
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex relative overflow-hidden">
      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50" />
      <div className="absolute inset-0 bg-black/30" />

      {/* Main Content Container */}
      <main className="relative z-10 w-full flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="main">
        {/* Left Column - Hero Content */}
        <section className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-20">
          {/* Logo */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <img
                  src="/aclue_text_clean.png"
                  alt="aclue Logo"
                  className="w-14 h-14 sm:w-20 sm:h-20 object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load, showing fallback');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallbackDiv = target.nextElementSibling as HTMLElement;
                    if (fallbackDiv) fallbackDiv.style.display = 'flex';
                  }}
                />
                <Gift className="hidden w-14 h-14 sm:w-20 sm:h-20 text-white" />
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              The Future of
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Gift Discovery
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
              Our AI-powered platform is learning to understand your unique gift preferences.
              Experience personalised recommendations that actually understand what you and your loved ones want.
            </p>

            {/* System Training Badge */}
            <div className="mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-3 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-amber-400/60 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-amber-400/30 rounded-full animate-pulse delay-200"></div>
                </div>
                <span className="text-amber-200 font-medium text-sm">System Training In Progress</span>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">AI-Powered Learning</h3>
                </div>
                <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">
                  Advanced algorithms that learn from your preferences and behaviour patterns.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">Smart Recommendations</h3>
                </div>
                <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">
                  Personalised gift suggestions that match your style and budget perfectly.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">Social Integration</h3>
                </div>
                <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">
                  Connect with friends and family to discover shared gift preferences.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">Curated Quality</h3>
                </div>
                <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed">
                  Hand-picked products from trusted retailers ensuring exceptional quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column - Signup Form */}
        <section className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-20">
          {/* Email Signup Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                    Join the Beta
                  </h2>
                  <p className="text-blue-100 text-base sm:text-lg mb-4 sm:mb-6">
                    Be among the first to experience the future of gift discovery.
                    Get early access when we launch.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 sm:w-6 sm:h-6" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 sm:pl-14 pr-4 py-4 sm:py-5 bg-white/10 border-2 border-white/20 rounded-xl focus:border-blue-400 focus:outline-none text-white placeholder-blue-200 backdrop-blur-sm text-base sm:text-lg min-h-[48px] sm:min-h-[56px]"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 sm:py-5 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg text-base sm:text-lg min-h-[48px] sm:min-h-[56px]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Joining Beta...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Join Beta Program</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-xs text-blue-200">
                    No spam • Unsubscribe anytime • Early access guaranteed
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                  Welcome to the Future! 🚀
                </h3>
                <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">
                  You're now part of our exclusive beta program. We'll notify you
                  the moment our AI is ready to transform your gift-giving experience.
                </p>
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-blue-200">
                    Check your email for beta access details and updates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Legal Statement - Bottom Right */}
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-20">
        <div className="text-xs text-white/60 text-right leading-tight">
          <div>© 2025 ACLUE LTD</div>
          <div className="text-white/40">Company No. 14659276</div>
        </div>
      </div>
    </div>
  )
}