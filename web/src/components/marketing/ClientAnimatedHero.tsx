'use client'

import { motion } from 'framer-motion'
import { Gift, Heart } from 'lucide-react'

/**
 * Client Animated Hero - Client Component
 *
 * Client-side animations for hero section floating elements.
 * Provides enhanced user experience through motion without blocking initial render.
 *
 * Features:
 * - Framer Motion animations
 * - Floating decorative elements
 * - Progressive enhancement
 * - Performance-optimised animations
 */

export default function ClientAnimatedHero() {
  return (
    <>
      {/* Animated Floating Elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 -left-4 bg-yellow-400 rounded-full p-3 z-20"
      >
        <Gift className="w-6 h-6 text-white" />
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-10 -right-4 bg-pink-400 rounded-full p-3 z-20"
      >
        <Heart className="w-6 h-6 text-white" />
      </motion.div>
    </>
  )
}