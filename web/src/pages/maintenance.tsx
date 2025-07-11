import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, Mail, CheckCircle, Sparkles, Brain, Zap } from 'lucide-react';
import NeuralNetworkBackground from '@/components/ui/NeuralNetworkBackground';

export default function MaintenancePage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>GiftSync - AI-Powered Gift Discovery</title>
        <meta
          name="description"
          content="GiftSync is getting ready to launch! Sign up for early access to our AI-powered gift recommendation platform."
        />
        <meta name="keywords" content="gifts, AI recommendations, gift ideas, coming soon, beta signup, neural network" />
        <meta property="og:title" content="GiftSync - AI-Powered Gift Discovery" />
        <meta
          property="og:description"
          content="GiftSync is getting ready to launch! Sign up for early access to our AI-powered gift recommendation platform."
        />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        {/* Neural Network Background */}
        <NeuralNetworkBackground 
          nodeCount={120}
          connectionDistance={180}
          animationSpeed={0.3}
          colors={{
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            accent: '#06b6d4',
            connections: '#3b82f6'
          }}
        />

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl opacity-20 blur-xl animate-pulse"></div>
            </div>
            <span className="text-5xl font-bold text-white tracking-tight">GiftSync</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              AI-Powered Gift
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Discovery
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Our neural network is learning to understand your perfect gift preferences. 
              Join the beta and experience the future of personalised recommendations.
            </p>
            
            <div className="inline-flex items-center gap-3 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-200 px-6 py-3 rounded-full text-lg font-medium mb-8">
              <Brain className="w-5 h-5" />
              <span>Neural Network Training</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Email Signup Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 max-w-2xl mx-auto mb-12 shadow-2xl"
          >
            {!isSubmitted ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Join the Beta Programme
                </h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Be among the first to experience AI that actually understands your gift preferences.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-6 h-6" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-14 pr-4 py-5 bg-white/10 border-2 border-white/20 rounded-2xl focus:border-blue-400 focus:outline-none text-lg text-white placeholder-blue-200 backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-5 px-8 rounded-2xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting to Neural Network...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" />
                        <span>Join Beta Programme</span>
                      </>
                    )}
                  </motion.button>
                </form>
                
                <p className="text-sm text-blue-200 mt-6">
                  Early access • No spam • Priority support
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-green-500/20 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Welcome to the Future! 🎉
                </h3>
                <p className="text-blue-100 mb-6 text-lg">
                  You're now part of our exclusive beta programme. We'll notify you as soon as our AI is ready to learn your preferences.
                </p>
                <p className="text-sm text-blue-200">
                  Check your email for beta access details and updates.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Alpha Site Link */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-medium transition-colors text-lg group"
            >
              <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>View Alpha Site</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}