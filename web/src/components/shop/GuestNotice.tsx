/**
 * Guest Notice - Client Component
 *
 * Notification banner for guest users encouraging authentication.
 * Shows benefits of signing up while allowing dismissal.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

export function GuestNotice() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-amber-50 border-b border-amber-200 px-6 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">
              You're browsing as a guest.{' '}
              <Link
                href="/auth/register"
                className="font-medium underline hover:no-underline"
              >
                Sign up
              </Link>{' '}
              to save your preferences and get personalised recommendations.
            </span>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-amber-600 hover:text-amber-800 ml-4 flex-shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}