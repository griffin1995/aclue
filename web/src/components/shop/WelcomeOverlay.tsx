/**
 * Welcome Overlay - Client Component
 *
 * Modal overlay that introduces new users to the swipe interface.
 * Provides instructions and encourages engagement with the discovery process.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface WelcomeOverlayProps {
  onDismiss: () => void;
  isAuthenticated: boolean;
}

export function WelcomeOverlay({ onDismiss, isAuthenticated }: WelcomeOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift className="w-8 h-8 text-primary-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Gift Discovery!
        </h2>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Swipe through products to help our AI learn your preferences.
          Like what you see? Swipe right. Not your style? Swipe left.
        </p>

        <div className="space-y-3 text-sm text-gray-500 mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Swipe left to dislike</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <ArrowRight className="w-4 h-4" />
            </div>
            <span>Swipe right to like</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <ArrowUp className="w-4 h-4" />
            </div>
            <span>Swipe up to super like</span>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-amber-800">
              💡 <strong>Tip:</strong> Sign up to save your preferences and get personalised recommendations!
            </p>
          </div>
        )}

        <button
          onClick={onDismiss}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Start Discovering
        </button>
      </motion.div>
    </motion.div>
  );
}