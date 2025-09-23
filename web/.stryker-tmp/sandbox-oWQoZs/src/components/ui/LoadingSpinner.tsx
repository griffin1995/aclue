/**
 * aclue Loading Spinner UI Components
 * 
 * Provides animated loading indicators for the aclue application with
 * consistent styling and multiple variants. Includes specialized loading
 * states for different UI contexts and components.
 * 
 * Key Features:
 *   - Multiple sizes and color variants for different contexts
 *   - Animated sparkles icon with smooth rotation
 *   - Optional loading text with fade-in animation
 *   - Skeleton loading cards for swipe interface
 *   - Full-screen loading overlay with backdrop blur
 * 
 * Performance Considerations:
 *   - Uses Framer Motion for hardware-accelerated animations
 *   - CSS transforms for smooth 60fps rotation
 *   - Shimmer effects implemented with pure CSS
 *   - Minimal re-renders with React.memo potential
 * 
 * Usage Examples:
 *   - <LoadingSpinner size="lg" text="Loading products..." />
 *   - <LoadingCard /> for swipe interface placeholder
 *   - <LoadingOverlay isVisible={loading} text="Saving..." />
 * 
 * Design System Integration:
 *   - Follows aclue color palette and spacing
 *   - Consistent with overall animation timing (1s rotation)
 *   - Responsive sizing with Tailwind CSS classes
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
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Props interface for the main LoadingSpinner component.
 * 
 * Provides flexible configuration options for different loading contexts
 * throughout the application. Size and variant options match the design
 * system for consistent user experience.
 */
interface LoadingSpinnerProps {
  /** Size variant affecting icon dimensions */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Color variant for different backgrounds and contexts */
  variant?: 'primary' | 'secondary' | 'white';

  /** Optional text displayed below the spinner */
  text?: string;

  /** Additional CSS classes for custom styling */
  className?: string;
}

// Size mapping for consistent dimensions across the application
const sizeClasses = stryMutAct_9fa48("7330") ? {} : (stryCov_9fa48("7330"), {
  sm: stryMutAct_9fa48("7331") ? "" : (stryCov_9fa48("7331"), 'w-4 h-4'),
  // Small inline spinners
  md: stryMutAct_9fa48("7332") ? "" : (stryCov_9fa48("7332"), 'w-6 h-6'),
  // Default size for most contexts
  lg: stryMutAct_9fa48("7333") ? "" : (stryCov_9fa48("7333"), 'w-8 h-8'),
  // Larger loading states
  xl: stryMutAct_9fa48("7334") ? "" : (stryCov_9fa48("7334"), 'w-12 h-12') // Hero/modal loading indicators
});

// Color variants for different UI contexts and backgrounds
const variantClasses = stryMutAct_9fa48("7335") ? {} : (stryCov_9fa48("7335"), {
  primary: stryMutAct_9fa48("7336") ? "" : (stryCov_9fa48("7336"), 'text-primary-600'),
  // Default brand color
  secondary: stryMutAct_9fa48("7337") ? "" : (stryCov_9fa48("7337"), 'text-secondary-600'),
  // Secondary brand color
  white: stryMutAct_9fa48("7338") ? "" : (stryCov_9fa48("7338"), 'text-white') // For dark backgrounds
});

/**
 * Main loading spinner component with animated sparkles icon.
 * 
 * Provides a consistent loading indicator across the aclue application
 * with smooth rotation animation and optional loading text. Uses hardware-
 * accelerated CSS transforms for optimal performance.
 * 
 * Animation Details:
 *   - 360-degree rotation with linear easing
 *   - 1-second duration with infinite repeat
 *   - Text fades in after 200ms delay for polish
 * 
 * @param size - Icon size variant (sm, md, lg, xl)
 * @param variant - Color variant for different contexts
 * @param text - Optional descriptive text below spinner
 * @param className - Additional CSS classes for customization
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = stryMutAct_9fa48("7339") ? "" : (stryCov_9fa48("7339"), 'md'),
  variant = stryMutAct_9fa48("7340") ? "" : (stryCov_9fa48("7340"), 'primary'),
  text,
  className = stryMutAct_9fa48("7341") ? "Stryker was here!" : (stryCov_9fa48("7341"), '')
}) => {
  if (stryMutAct_9fa48("7342")) {
    {}
  } else {
    stryCov_9fa48("7342");
    return <div className={stryMutAct_9fa48("7343") ? `` : (stryCov_9fa48("7343"), `flex flex-col items-center justify-center gap-3 ${className}`)}>
      {/* Animated sparkles icon with smooth rotation */}
      <motion.div className={stryMutAct_9fa48("7344") ? `` : (stryCov_9fa48("7344"), `${sizeClasses[size]} ${variantClasses[variant]}`)} animate={stryMutAct_9fa48("7345") ? {} : (stryCov_9fa48("7345"), {
        rotate: 360
      })} transition={stryMutAct_9fa48("7346") ? {} : (stryCov_9fa48("7346"), {
        duration: 1,
        // 1-second full rotation
        repeat: Infinity,
        // Continuous animation
        ease: stryMutAct_9fa48("7347") ? "" : (stryCov_9fa48("7347"), 'linear') // Smooth constant speed
      })}>
        <Sparkles className="w-full h-full" />
      </motion.div>
      
      {/* Optional loading text with fade-in animation */}
      {stryMutAct_9fa48("7350") ? text || <motion.p className={`text-sm font-medium ${variantClasses[variant]} ${text.includes('...') ? 'loading-dots' : ''}`} initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2
      }} // Delay for polished appearance
      >
          {text}
        </motion.p> : stryMutAct_9fa48("7349") ? false : stryMutAct_9fa48("7348") ? true : (stryCov_9fa48("7348", "7349", "7350"), text && <motion.p className={stryMutAct_9fa48("7351") ? `` : (stryCov_9fa48("7351"), `text-sm font-medium ${variantClasses[variant]} ${text.includes(stryMutAct_9fa48("7352") ? "" : (stryCov_9fa48("7352"), '...')) ? stryMutAct_9fa48("7353") ? "" : (stryCov_9fa48("7353"), 'loading-dots') : stryMutAct_9fa48("7354") ? "Stryker was here!" : (stryCov_9fa48("7354"), '')}`)} initial={stryMutAct_9fa48("7355") ? {} : (stryCov_9fa48("7355"), {
        opacity: 0
      })} animate={stryMutAct_9fa48("7356") ? {} : (stryCov_9fa48("7356"), {
        opacity: 1
      })} transition={stryMutAct_9fa48("7357") ? {} : (stryCov_9fa48("7357"), {
        delay: 0.2
      })} // Delay for polished appearance
      >
          {text}
        </motion.p>)}
    </div>;
  }
};

/**
 * Skeleton loading card component for swipe interface.
 * 
 * Provides a realistic placeholder that matches the actual product card
 * layout while content is loading. Uses shimmer animations to indicate
 * active loading state and maintain user engagement.
 * 
 * Design Features:
 *   - Matches exact dimensions of real product cards (600px height)
 *   - Shimmer effect on all placeholder elements
 *   - Gradient background for visual interest
 *   - Skeleton elements for image, title, description, and actions
 * 
 * Performance Benefits:
 *   - Prevents layout shift when real content loads
 *   - Maintains user engagement during loading
 *   - Provides visual feedback of loading progress
 * 
 * Usage Context:
 *   - Swipe interface while fetching product data
 *   - First-time app load before API responses
 *   - Network retry scenarios with cached layout
 */
export const LoadingCard: React.FC = () => {
  if (stryMutAct_9fa48("7358")) {
    {}
  } else {
    stryCov_9fa48("7358");
    return <div className="swipe-card w-full max-w-sm mx-auto h-[600px] bg-white rounded-3xl shadow-large overflow-hidden">
      {/* Product image placeholder with gradient background */}
      <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        {/* Shimmer overlay for animated loading effect */}
        <div className="absolute inset-0 shimmer" />
        
        {/* Price tag placeholder */}
        <div className="absolute top-4 left-4">
          <div className="w-16 h-6 bg-gray-300 rounded-full shimmer" />
        </div>
        
        {/* Rating placeholder */}
        <div className="absolute top-4 right-4">
          <div className="w-12 h-6 bg-gray-300 rounded-full shimmer" />
        </div>
      </div>
      
      {/* Product information section */}
      <div className="p-6 space-y-4">
        {/* Title and description placeholders */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded shimmer" />          {/* Product title */}
          <div className="h-4 bg-gray-200 rounded shimmer w-3/4" />    {/* Description line 1 */}
          <div className="h-4 bg-gray-200 rounded shimmer w-1/2" />    {/* Description line 2 */}
        </div>
        
        {/* Feature tags/categories placeholders */}
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-gray-200 rounded-lg shimmer" />
          <div className="w-20 h-6 bg-gray-200 rounded-lg shimmer" />
          <div className="w-14 h-6 bg-gray-200 rounded-lg shimmer" />
        </div>
      </div>
      
      {/* Swipe action buttons placeholder */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full shimmer" />  {/* Dislike button */}
          <div className="w-12 h-12 bg-gray-200 rounded-full shimmer" />  {/* Info button */}
          <div className="w-14 h-14 bg-gray-200 rounded-full shimmer" />  {/* Like button */}
        </div>
      </div>
    </div>;
  }
};

/**
 * Full-screen loading overlay component with backdrop blur.
 * 
 * Provides a modal-style loading indicator that covers the entire viewport
 * during critical operations. Uses backdrop blur and smooth animations
 * for a polished user experience.
 * 
 * Design Features:
 *   - Semi-transparent black backdrop (50% opacity)
 *   - Backdrop blur effect for modern appearance
 *   - Centered white card with large spinner
 *   - Smooth scale and opacity animations
 * 
 * Animation Sequence:
 *   - Backdrop fades in from transparent
 *   - Card scales up from 90% to 100% with fade-in
 *   - Exit animations reverse the sequence
 * 
 * Usage Context:
 *   - Critical operations (user registration, data sync)
 *   - Modal forms with server submission
 *   - App-wide loading states
 * 
 * @param isVisible - Controls overlay visibility
 * @param text - Loading message displayed below spinner
 */
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  text?: string;
}> = ({
  isVisible,
  text = stryMutAct_9fa48("7359") ? "" : (stryCov_9fa48("7359"), 'Loading...')
}) => {
  if (stryMutAct_9fa48("7360")) {
    {}
  } else {
    stryCov_9fa48("7360");
    // Early return if overlay not visible (prevents unnecessary rendering)
    if (stryMutAct_9fa48("7363") ? false : stryMutAct_9fa48("7362") ? true : stryMutAct_9fa48("7361") ? isVisible : (stryCov_9fa48("7361", "7362", "7363"), !isVisible)) return null;
    return <motion.div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-100" initial={stryMutAct_9fa48("7364") ? {} : (stryCov_9fa48("7364"), {
      opacity: 0
    })} animate={stryMutAct_9fa48("7365") ? {} : (stryCov_9fa48("7365"), {
      opacity: 1
    })} exit={stryMutAct_9fa48("7366") ? {} : (stryCov_9fa48("7366"), {
      opacity: 0
    })}>
      {/* Centered loading card with smooth scale animation */}
      <motion.div className="bg-white rounded-2xl p-8 shadow-2xl" initial={stryMutAct_9fa48("7367") ? {} : (stryCov_9fa48("7367"), {
        scale: 0.9,
        opacity: 0
      })} animate={stryMutAct_9fa48("7368") ? {} : (stryCov_9fa48("7368"), {
        scale: 1,
        opacity: 1
      })} exit={stryMutAct_9fa48("7369") ? {} : (stryCov_9fa48("7369"), {
        scale: 0.9,
        opacity: 0
      })}>
        <LoadingSpinner size="lg" text={text} />
      </motion.div>
    </motion.div>;
  }
};