import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift, Mail, CheckCircle, Sparkles, Brain, Zap, ArrowRight, Users, Clock, Star } from 'lucide-react';
import NeuralNetworkBackground from '@/components/ui/NeuralNetworkBackground';

export default function MaintenanceMode() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      // Call the newsletter signup API endpoint (always use backend directly)
      const backendUrl = 'https://aclue-backend-production.up.railway.app';
      const response = await fetch(`${backendUrl}/api/v1/newsletter/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'maintenance_page',
          user_agent: navigator.userAgent
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
    <>
      <Head>
        <title>aclue - AI-Powered Gift Discovery</title>
        <meta
          name="description"
          content="aclue is getting ready to launch! Sign up for early access to our AI-powered gift recommendation platform."
        />
        <meta name="keywords" content="gifts, AI recommendations, gift ideas, coming soon, beta signup, neural network" />
        <meta property="og:title" content="aclue - AI-Powered Gift Discovery" />
        <meta
          property="og:description"
          content="aclue is getting ready to launch! Sign up for early access to our AI-powered gift recommendation platform."
        />
        <meta property="og:image" content="/logo.png" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex relative overflow-hidden">
        {/* Neural Network Background */}
        <NeuralNetworkBackground 
          nodeCount={100}
          connectionDistance={150}
          animationSpeed={0.4}
          colors={{
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#06b6d4',
            connections: '#3b82f6'
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

        {/* Main Content Container */}
        <div className="relative z-10 w-full flex flex-col lg:flex-row max-w-7xl mx-auto px-6 lg:px-8">
          {/* Left Column - Hero Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-xl animate-pulse"></div>
              </div>
              <span className="text-4xl font-bold text-white tracking-tight">aclue</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                The Future of
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Gift Discovery
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                Our AI-powered platform is learning to understand your unique gift preferences. 
                Experience personalised recommendations that actually understand what you and your loved ones want.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 gap-6 mb-8"
            >
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm">AI-Powered Learning</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm">Smart Recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-sm">Social Integration</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm">Curated Quality</span>
              </div>
            </motion.div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-flex items-center gap-3 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-200 px-6 py-3 rounded-full text-sm font-medium mb-6 max-w-fit"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Training</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>

            {/* CTA Link */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link
                href="/landingpage"
                className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-medium transition-colors group"
              >
                <span>Explore Alpha Version</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Signup Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 lg:py-20">
            {/* Email Signup Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Join the Beta
                    </h2>
                    <p className="text-blue-100 text-lg mb-6">
                      Be among the first to experience the future of gift discovery. 
                      Get early access when we launch.
                    </p>
                    
                    {/* Beta Benefits */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-blue-100">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-sm">Early access to all features</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-sm">Priority customer support</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-sm">Exclusive beta features</span>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl focus:border-blue-400 focus:outline-none text-white placeholder-blue-200 backdrop-blur-sm"
                        required
                      />
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Joining Beta...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>Join Beta Program</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                  
                  <div className="text-center mt-6">
                    <p className="text-xs text-blue-200">
                      No spam • Unsubscribe anytime • Early access guaranteed
                    </p>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Welcome to the Future! 🚀
                  </h3>
                  <p className="text-blue-100 mb-6">
                    You're now part of our exclusive beta program. We'll notify you 
                    the moment our AI is ready to transform your gift-giving experience.
                  </p>
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                    <p className="text-sm text-blue-200">
                      Check your email for beta access details and updates.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Legal Statement - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="text-xs text-white/60 text-right leading-tight">
            <div>© 2025 HITSENSE LTD</div>
            <div className="text-white/40">Company No. 14659276</div>
          </div>
        </div>
      </div>
    </>
  );
}