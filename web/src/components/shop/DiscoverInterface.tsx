/**
 * Discover Interface - Client Component
 *
 * Interactive product discovery interface using the swipe paradigm.
 * This client component handles all user interactions and state management
 * while receiving initial data from the server component.
 *
 * Features:
 * - Tinder-style swipe interface
 * - Keyboard navigation
 * - Mobile touch gestures
 * - Progress tracking
 * - Session completion handling
 * - Preference recording via server actions
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, X, ArrowUp, RotateCcw, Info } from 'lucide-react';
import { recordSwipe } from '@/app/actions/products';
import { WelcomeOverlay } from './WelcomeOverlay';
import { ProductCard } from './ProductCard';
import { useMobileOptimizations, useHapticFeedback } from '@/hooks/useMobileOptimizations';
import toast from 'react-hot-toast';

// ==============================================================================
// TYPES
// ==============================================================================

interface Product {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  currency?: string;
  image_url: string;
  brand?: string;
  category?: {
    name: string;
  };
  rating?: number;
  affiliate_url?: string;
  url?: string;
}

interface DiscoverInterfaceProps {
  initialProducts: Product[];
  isAuthenticated: boolean;
  sessionType?: string;
}

type SwipeDirection = 'left' | 'right' | 'up';

// ==============================================================================
// MAIN COMPONENT
// ==============================================================================

export function DiscoverInterface({
  initialProducts,
  isAuthenticated,
  sessionType = 'discovery'
}: DiscoverInterfaceProps) {
  const router = useRouter();
  const [products] = useState<Product[]>(initialProducts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [swipeCount, setSwipeCount] = useState(0);

  // Mobile optimisations
  const mobileOptimizations = useMobileOptimizations();
  const haptics = useHapticFeedback();

  // Current product
  const currentProduct = products[currentIndex];
  const isSessionComplete = currentIndex >= products.length;

  // ==============================================================================
  // EFFECTS
  // ==============================================================================

  // Auto-hide welcome overlay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showWelcome || isSessionComplete) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handleSwipe('left');
          break;
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          handleSwipe('right');
          break;
        case 'ArrowUp':
          event.preventDefault();
          handleSwipe('up');
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleResetSession();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showWelcome, isSessionComplete, currentIndex]);

  // ==============================================================================
  // SWIPE HANDLERS
  // ==============================================================================

  const handleSwipe = useCallback(async (direction: SwipeDirection) => {
    if (!currentProduct || isLoading) return;

    setIsLoading(true);

    try {
      // Provide haptic feedback for mobile users
      if (mobileOptimizations.isMobile) {
        if (direction === 'right') {
          haptics.mediumTap();
        } else if (direction === 'up') {
          haptics.doubleTap();
        } else {
          haptics.lightTap();
        }
      }

      // Record swipe preference if authenticated
      if (isAuthenticated) {
        const swipeDirection = direction === 'left' ? 'dislike' :
                              direction === 'up' ? 'super_like' : 'like';

        const result = await recordSwipe({
          productId: currentProduct.id,
          direction: swipeDirection,
          sessionType,
          timestamp: new Date(),
        });

        if (!result.success) {
          console.warn('Failed to record swipe:', result.error);
        }
      }

      // Show feedback toast
      const productName = currentProduct.title || currentProduct.name || 'this product';

      if (direction === 'right') {
        toast.success(`❤️ Added ${productName} to your likes!`);
      } else if (direction === 'up') {
        toast.success(`⚡ Super liked ${productName}!`);
      } else {
        toast(`👍 Thanks for the feedback!`);
      }

      setSwipeCount(prev => prev + 1);

      // Move to next product with delay for animation
      setTimeout(() => {
        if (currentIndex < products.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          handleSessionComplete();
        }
        setIsLoading(false);
      }, 300);

    } catch (error) {
      console.error('Error handling swipe:', error);
      toast.error('Failed to record preference. Please try again.');
      setIsLoading(false);
    }
  }, [currentProduct, isLoading, isAuthenticated, currentIndex, products.length, sessionType, mobileOptimizations.isMobile, haptics]);

  // ==============================================================================
  // SESSION HANDLERS
  // ==============================================================================

  const handleSessionComplete = useCallback(() => {
    toast.success('🎉 Great job! Your session is complete.');

    if (isAuthenticated) {
      // Redirect to recommendations
      setTimeout(() => {
        router.push('/dashboard/recommendations');
      }, 1500);
    } else {
      // Encourage sign up
      toast.success('Sign up to save your preferences and get personalised recommendations!');
      setTimeout(() => {
        router.push('/auth/register?redirect=/dashboard/recommendations');
      }, 2000);
    }
  }, [isAuthenticated, router]);

  const handleResetSession = useCallback(() => {
    setCurrentIndex(0);
    setSwipeCount(0);
    toast.success('Session reset! Starting over.');
  }, []);

  // ==============================================================================
  // RENDER COMPONENTS
  // ==============================================================================

  if (isSessionComplete) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Session Complete!
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {isAuthenticated
              ? "Great job! We've learned about your preferences. Redirecting to your personalised recommendations..."
              : "Thanks for trying our discovery! Sign up to save your preferences and get personalised recommendations."
            }
          </p>

          <div className="space-y-3">
            <button
              onClick={handleResetSession}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Start New Session
            </button>

            {!isAuthenticated && (
              <button
                onClick={() => router.push('/auth/register')}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Sign Up for Recommendations
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Welcome Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeOverlay
            onDismiss={() => setShowWelcome(false)}
            isAuthenticated={isAuthenticated}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-primary-600" />
            <div>
              <h1 className="font-semibold text-gray-900">Discover Products</h1>
              <p className="text-sm text-gray-600">
                {currentIndex + 1} of {products.length} • {swipeCount} preferences recorded
              </p>
            </div>
          </div>

          <button
            onClick={handleResetSession}
            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            title="Reset session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Swipe Interface */}
      <div className="flex-1 relative overflow-hidden p-6">
        <AnimatePresence mode="wait">
          {currentProduct && (
            <motion.div
              key={currentProduct.id}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full flex items-center justify-center"
            >
              <div className="w-full max-w-md">
                <ProductCard
                  product={currentProduct}
                  onSwipe={handleSwipe}
                  isLoading={isLoading}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swipe Action Buttons */}
        {currentProduct && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSwipe('left')}
              disabled={isLoading}
              className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSwipe('up')}
              disabled={isLoading}
              className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSwipe('right')}
              disabled={isLoading}
              className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              <Heart className="w-6 h-6" />
            </motion.button>
          </div>
        )}

        {/* Instructions Hint */}
        {currentIndex < 3 && currentProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs"
          >
            <p className="flex items-center gap-2">
              <span>←</span> Dislike • <span>→</span> Like • <span>↑</span> Super Like
            </p>
            <p className="text-xs opacity-75 mt-1">Or use the buttons below</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}