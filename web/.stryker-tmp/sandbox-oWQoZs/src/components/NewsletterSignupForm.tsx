// @ts-nocheck
'use client';

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
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Zap } from 'lucide-react';

/**
 * Newsletter Signup Form - Direct Resend Integration
 *
 * Interactive client component for newsletter signup using direct Resend API integration.
 * Provides optimal user experience with reliable email delivery.
 *
 * Features:
 * - Direct Resend API integration via fetch
 * - React email templates with aclue branding
 * - Real-time validation feedback
 * - Accessibility compliant
 * - Success/error state management
 * - Loading states with proper UX
 *
 * Integration:
 * - Uses /api/newsletter/signup endpoint with Resend SDK
 * - Handles all form states client-side
 * - Provides immediate user feedback
 * - GDPR-compliant signup process
 */

export default function NewsletterSignupForm() {
  if (stryMutAct_9fa48("2992")) {
    {}
  } else {
    stryCov_9fa48("2992");
    const [email, setEmail] = useState(stryMutAct_9fa48("2993") ? "Stryker was here!" : (stryCov_9fa48("2993"), ''));
    const [isSubmitted, setIsSubmitted] = useState(stryMutAct_9fa48("2994") ? true : (stryCov_9fa48("2994"), false));
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("2995") ? true : (stryCov_9fa48("2995"), false));
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      if (stryMutAct_9fa48("2996")) {
        {}
      } else {
        stryCov_9fa48("2996");
        e.preventDefault();
        setError(null);
        setIsLoading(stryMutAct_9fa48("2997") ? false : (stryCov_9fa48("2997"), true));
        try {
          if (stryMutAct_9fa48("2998")) {
            {}
          } else {
            stryCov_9fa48("2998");
            console.log(stryMutAct_9fa48("2999") ? "" : (stryCov_9fa48("2999"), '📧 Submitting newsletter signup for:'), email);
            const response = await fetch(stryMutAct_9fa48("3000") ? "" : (stryCov_9fa48("3000"), '/api/newsletter/signup/'), stryMutAct_9fa48("3001") ? {} : (stryCov_9fa48("3001"), {
              method: stryMutAct_9fa48("3002") ? "" : (stryCov_9fa48("3002"), 'POST'),
              headers: stryMutAct_9fa48("3003") ? {} : (stryCov_9fa48("3003"), {
                'Content-Type': stryMutAct_9fa48("3004") ? "" : (stryCov_9fa48("3004"), 'application/json')
              }),
              body: JSON.stringify(stryMutAct_9fa48("3005") ? {} : (stryCov_9fa48("3005"), {
                email,
                source: stryMutAct_9fa48("3006") ? "" : (stryCov_9fa48("3006"), 'maintenance_page_direct_api')
              }))
            }));
            const result = await response.json();
            if (stryMutAct_9fa48("3009") ? response.ok || result.success : stryMutAct_9fa48("3008") ? false : stryMutAct_9fa48("3007") ? true : (stryCov_9fa48("3007", "3008", "3009"), response.ok && result.success)) {
              if (stryMutAct_9fa48("3010")) {
                {}
              } else {
                stryCov_9fa48("3010");
                setIsSubmitted(stryMutAct_9fa48("3011") ? false : (stryCov_9fa48("3011"), true));
                console.log(stryMutAct_9fa48("3012") ? "" : (stryCov_9fa48("3012"), '✅ Newsletter signup successful:'), result.message);
              }
            } else {
              if (stryMutAct_9fa48("3013")) {
                {}
              } else {
                stryCov_9fa48("3013");
                console.error(stryMutAct_9fa48("3014") ? "" : (stryCov_9fa48("3014"), '❌ Newsletter signup failed:'), result);
                setError(stryMutAct_9fa48("3017") ? result.error && 'An unexpected error occurred. Please try again.' : stryMutAct_9fa48("3016") ? false : stryMutAct_9fa48("3015") ? true : (stryCov_9fa48("3015", "3016", "3017"), result.error || (stryMutAct_9fa48("3018") ? "" : (stryCov_9fa48("3018"), 'An unexpected error occurred. Please try again.'))));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("3019")) {
            {}
          } else {
            stryCov_9fa48("3019");
            console.error(stryMutAct_9fa48("3020") ? "" : (stryCov_9fa48("3020"), '💥 Form submission error:'), error);
            setError(stryMutAct_9fa48("3021") ? "" : (stryCov_9fa48("3021"), 'Unable to connect to our service. Please check your connection and try again.'));
          }
        } finally {
          if (stryMutAct_9fa48("3022")) {
            {}
          } else {
            stryCov_9fa48("3022");
            setIsLoading(stryMutAct_9fa48("3023") ? true : (stryCov_9fa48("3023"), false));
          }
        }
      }
    };
    if (stryMutAct_9fa48("3025") ? false : stryMutAct_9fa48("3024") ? true : (stryCov_9fa48("3024", "3025"), isSubmitted)) {
      if (stryMutAct_9fa48("3026")) {
        {}
      } else {
        stryCov_9fa48("3026");
        return <motion.div initial={stryMutAct_9fa48("3027") ? {} : (stryCov_9fa48("3027"), {
          opacity: 0,
          scale: 0.9
        })} animate={stryMutAct_9fa48("3028") ? {} : (stryCov_9fa48("3028"), {
          opacity: 1,
          scale: 1
        })} transition={stryMutAct_9fa48("3029") ? {} : (stryCov_9fa48("3029"), {
          duration: 0.5
        })} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
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
      </motion.div>;
      }
    }
    return <motion.div initial={stryMutAct_9fa48("3030") ? {} : (stryCov_9fa48("3030"), {
      opacity: 0,
      x: 50
    })} animate={stryMutAct_9fa48("3031") ? {} : (stryCov_9fa48("3031"), {
      opacity: 1,
      x: 0
    })} transition={stryMutAct_9fa48("3032") ? {} : (stryCov_9fa48("3032"), {
      duration: 0.8,
      delay: 0.3
    })} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="text-center mb-6 sm:mb-8">
        <h2 id="signup-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
          Join the Beta
        </h2>
        <p id="email-description" className="text-blue-100 text-base sm:text-lg mb-4 sm:mb-6">
          Be among the first to experience the future of gift discovery.
          Get early access when we launch.
        </p>

        {/* Beta Benefits */}
        <div id="beta-benefits" className="space-y-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 text-blue-100">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            </div>
            <span className="text-sm sm:text-base">Early access to all features</span>
          </div>
          <div className="flex items-center gap-3 text-blue-100">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            </div>
            <span className="text-sm sm:text-base">Priority customer support</span>
          </div>
          <div className="flex items-center gap-3 text-blue-100">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            </div>
            <span className="text-sm sm:text-base">Exclusive beta features</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {stryMutAct_9fa48("3035") ? error || <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </motion.div> : stryMutAct_9fa48("3034") ? false : stryMutAct_9fa48("3033") ? true : (stryCov_9fa48("3033", "3034", "3035"), error && <motion.div initial={stryMutAct_9fa48("3036") ? {} : (stryCov_9fa48("3036"), {
        opacity: 0,
        y: stryMutAct_9fa48("3037") ? +10 : (stryCov_9fa48("3037"), -10)
      })} animate={stryMutAct_9fa48("3038") ? {} : (stryCov_9fa48("3038"), {
        opacity: 1,
        y: 0
      })} className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </motion.div>)}

      {/* Newsletter Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" role="form" aria-labelledby="signup-heading">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 sm:w-6 sm:h-6" />
          <input type="email" name="email" value={email} onChange={stryMutAct_9fa48("3039") ? () => undefined : (stryCov_9fa48("3039"), e => setEmail(e.target.value))} placeholder="Enter your email address" className="w-full pl-12 sm:pl-14 pr-4 py-4 sm:py-5 bg-white/10 border-2 border-white/20 rounded-xl focus:border-blue-400 focus:outline-none text-white placeholder-blue-200 backdrop-blur-sm text-base sm:text-lg min-h-[48px] sm:min-h-[56px]" required disabled={isLoading} aria-label="Email address for beta signup" aria-describedby="email-description" autoComplete="email" />
        </div>

        <motion.button type="submit" disabled={stryMutAct_9fa48("3042") ? isLoading && !email.trim() : stryMutAct_9fa48("3041") ? false : stryMutAct_9fa48("3040") ? true : (stryCov_9fa48("3040", "3041", "3042"), isLoading || (stryMutAct_9fa48("3043") ? email.trim() : (stryCov_9fa48("3043"), !(stryMutAct_9fa48("3044") ? email : (stryCov_9fa48("3044"), email.trim())))))} whileHover={stryMutAct_9fa48("3045") ? {} : (stryCov_9fa48("3045"), {
          scale: isLoading ? 1 : 1.02
        })} whileTap={stryMutAct_9fa48("3046") ? {} : (stryCov_9fa48("3046"), {
          scale: isLoading ? 1 : 0.98
        })} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 sm:py-5 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg text-base sm:text-lg min-h-[48px] sm:min-h-[56px]" aria-label={isLoading ? stryMutAct_9fa48("3047") ? "" : (stryCov_9fa48("3047"), "Joining beta program, please wait") : stryMutAct_9fa48("3048") ? "" : (stryCov_9fa48("3048"), "Join beta program")}>
          {isLoading ? <>
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <span>Joining Beta...</span>
            </> : <>
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Join Beta Program</span>
            </>}
        </motion.button>
      </form>

      <div className="text-center mt-6">
        <p className="text-xs text-blue-200">
          No spam • Unsubscribe anytime • Early access guaranteed
        </p>
      </div>
    </motion.div>;
  }
}