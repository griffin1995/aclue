/**
 * Enhanced UI Component Library - Server-First Patterns
 *
 * Optimized component library with 50% server-first architecture.
 * Components are designed for performance, SEO, and progressive enhancement.
 *
 * Export structure:
 * - Server components: Immediate rendering, SEO optimized
 * - Client components: Interactive features, animations
 * - Hybrid components: Best of both approaches
 */
// @ts-nocheck


// Server-First UI Components
export { default as ServerButton } from './ServerButton';
export { default as ServerCard, ServerCardHeader, ServerCardContent, ServerCardFooter } from './ServerCard';
export { default as ServerBadge } from './ServerBadge';
export { default as ServerIcon } from './ServerIcon';

// Existing Client Components
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as PageLoader } from './PageLoader';
export { default as AffiliateDisclosure } from './AffiliateDisclosure';
export { default as NeuralNetworkBackground } from './NeuralNetworkBackground';
export { default as NeuralNetworkBackgroundOptimized } from './NeuralNetworkBackgroundOptimized';