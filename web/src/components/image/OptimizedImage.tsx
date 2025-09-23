/**
 * Optimized Image Component for aclue Platform
 *
 * Provides enterprise-grade image optimization with lazy loading, responsive sizing,
 * and performance monitoring. Extends Next.js Image component with additional features.
 *
 * Key Features:
 *   - Automatic responsive sizing
 *   - Progressive loading with blur placeholder
 *   - Error handling and fallback images
 *   - Performance monitoring
 *   - Accessibility optimizations
 *   - WebP/AVIF format support
 *
 * Usage:
 *   <OptimizedImage
 *     src="/images/product.jpg"
 *     alt="Product image"
 *     width={400}
 *     height={300}
 *     priority={false}
 *   />
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

/**
 * Props for OptimizedImage component.
 */
interface OptimizedImageProps {
  src: string;                    // Image source URL
  alt: string;                    // Alt text for accessibility
  width?: number;                 // Image width
  height?: number;                // Image height
  className?: string;             // CSS classes
  priority?: boolean;             // Load with high priority
  quality?: number;               // Image quality (1-100)
  placeholder?: 'blur' | 'empty'; // Placeholder type
  blurDataURL?: string;           // Custom blur placeholder
  sizes?: string;                 // Responsive sizes
  fill?: boolean;                 // Fill container
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'; // Object fit
  objectPosition?: string;        // Object position
  loading?: 'lazy' | 'eager';     // Loading strategy
  fallbackSrc?: string;           // Fallback image URL
  showLoadingSpinner?: boolean;   // Show loading indicator
  trackPerformance?: boolean;     // Track loading performance
  onLoad?: () => void;            // Load callback
  onError?: () => void;           // Error callback
}

/**
 * Image loading states.
 */
type ImageLoadingState = 'loading' | 'loaded' | 'error';

/**
 * Image performance metrics.
 */
interface ImagePerformanceMetrics {
  loadStartTime: number;
  loadEndTime?: number;
  loadDuration?: number;
  naturalWidth?: number;
  naturalHeight?: number;
  renderedWidth?: number;
  renderedHeight?: number;
  compressionRatio?: number;
}

// ==============================================================================
// OPTIMIZED IMAGE COMPONENT
// ==============================================================================

/**
 * OptimizedImage component with enhanced performance and accessibility features.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  fallbackSrc = '/images/placeholder.png',
  showLoadingSpinner = true,
  trackPerformance = false,
  onLoad,
  onError,
}) => {
  // State management
  const [loadingState, setLoadingState] = useState<ImageLoadingState>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);
  const [performanceMetrics, setPerformanceMetrics] = useState<ImagePerformanceMetrics>({
    loadStartTime: 0,
  });

  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // ===========================================================================
  // PERFORMANCE TRACKING
  // ===========================================================================

  /**
   * Start performance tracking.
   */
  const startPerformanceTracking = useCallback(() => {
    if (!trackPerformance) return;

    setPerformanceMetrics(prev => ({
      ...prev,
      loadStartTime: performance.now(),
    }));
  }, [trackPerformance]);

  /**
   * End performance tracking and report metrics.
   */
  const endPerformanceTracking = useCallback((success: boolean) => {
    if (!trackPerformance) return;

    const loadEndTime = performance.now();
    const loadDuration = loadEndTime - performanceMetrics.loadStartTime;

    const metrics = {
      ...performanceMetrics,
      loadEndTime,
      loadDuration,
    };

    // Get image dimensions if available
    if (imageRef.current && success) {
      metrics.naturalWidth = imageRef.current.naturalWidth;
      metrics.naturalHeight = imageRef.current.naturalHeight;
      metrics.renderedWidth = imageRef.current.width;
      metrics.renderedHeight = imageRef.current.height;

      // Calculate compression ratio estimate
      if (width && height && metrics.naturalWidth && metrics.naturalHeight) {
        const requestedPixels = width * height;
        const naturalPixels = metrics.naturalWidth * metrics.naturalHeight;
        metrics.compressionRatio = naturalPixels / requestedPixels;
      }
    }

    setPerformanceMetrics(metrics);

    // Report performance metrics
    if (typeof window !== 'undefined') {
      import('@/lib/analytics').then(({ trackEvent }) => {
        trackEvent('image_load_performance', {
          src: currentSrc,
          success,
          loadDuration,
          naturalWidth: metrics.naturalWidth,
          naturalHeight: metrics.naturalHeight,
          compressionRatio: metrics.compressionRatio,
          quality,
          objectFit,
        });
      });
    }

    // Log slow image loads
    if (loadDuration > 3000) { // More than 3 seconds
      console.warn(`Slow image load detected: ${currentSrc} (${loadDuration.toFixed(2)}ms)`);
    }
  }, [trackPerformance, performanceMetrics.loadStartTime, currentSrc, quality, objectFit, width, height]);

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * Handle successful image load.
   */
  const handleLoad = useCallback(() => {
    setLoadingState('loaded');
    endPerformanceTracking(true);
    onLoad?.();
  }, [endPerformanceTracking, onLoad]);

  /**
   * Handle image load error.
   */
  const handleError = useCallback(() => {
    console.warn(`Failed to load image: ${currentSrc}`);

    // Try fallback image if available and not already using it
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      console.log(`Attempting fallback image: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setLoadingState('loading');
      return;
    }

    setLoadingState('error');
    endPerformanceTracking(false);
    onError?.();
  }, [currentSrc, fallbackSrc, endPerformanceTracking, onError]);

  /**
   * Handle image load start.
   */
  const handleLoadStart = useCallback(() => {
    setLoadingState('loading');
    startPerformanceTracking();
  }, [startPerformanceTracking]);

  // ===========================================================================
  // RESPONSIVE SIZES GENERATION
  // ===========================================================================

  /**
   * Generate responsive sizes string based on common breakpoints.
   */
  const generateResponsiveSizes = useCallback(() => {
    if (sizes) return sizes;
    if (!width) return undefined;

    // Generate sizes based on common breakpoints
    const breakpoints = [
      { size: 640, viewport: '100vw' },   // Mobile
      { size: 768, viewport: '50vw' },    // Tablet
      { size: 1024, viewport: '33vw' },   // Desktop
      { size: 1280, viewport: '25vw' },   // Large desktop
    ];

    const sizeString = breakpoints
      .map(bp => `(max-width: ${bp.size}px) ${bp.viewport}`)
      .join(', ');

    return `${sizeString}, ${width}px`;
  }, [sizes, width]);

  // ===========================================================================
  // BLUR PLACEHOLDER GENERATION
  // ===========================================================================

  /**
   * Generate a simple blur placeholder if none provided.
   */
  const generateBlurPlaceholder = useCallback(() => {
    if (blurDataURL) return blurDataURL;
    if (placeholder !== 'blur') return undefined;

    // Generate a simple 1x1 pixel placeholder in the dominant color
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Use a neutral gray color
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, 1, 1);
      return canvas.toDataURL();
    }

    return undefined;
  }, [blurDataURL, placeholder]);

  // ===========================================================================
  // INTERSECTION OBSERVER
  // ===========================================================================

  /**
   * Set up intersection observer for lazy loading optimization.
   */
  useEffect(() => {
    if (priority || loading === 'eager') return;

    if ('IntersectionObserver' in window && imageRef.current) {
      intersectionObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Image is about to become visible, prefetch if needed
              if (trackPerformance) {
                console.log(`Image entering viewport: ${currentSrc}`);
              }
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before image enters viewport
          threshold: 0.1,
        }
      );

      intersectionObserverRef.current.observe(imageRef.current);
    }

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [priority, loading, trackPerformance, currentSrc]);

  // ===========================================================================
  // RENDER LOADING STATE
  // ===========================================================================

  /**
   * Render loading spinner overlay.
   */
  const renderLoadingSpinner = () => {
    if (!showLoadingSpinner || loadingState !== 'loading') return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  };

  /**
   * Render error state.
   */
  const renderErrorState = () => {
    if (loadingState !== 'error') return null;

    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>
    );
  };

  // ===========================================================================
  // RENDER MAIN COMPONENT
  // ===========================================================================

  // Container classes
  const containerClasses = `
    relative overflow-hidden
    ${className}
    ${loadingState === 'loading' ? 'bg-gray-100' : ''}
  `.trim();

  // Image props for Next.js Image component
  const imageProps = {
    src: currentSrc,
    alt,
    quality,
    priority,
    loading,
    onLoad: handleLoad,
    onError: handleError,
    onLoadStart: handleLoadStart,
    sizes: generateResponsiveSizes(),
    placeholder: placeholder as any,
    blurDataURL: generateBlurPlaceholder(),
    style: {
      objectFit,
      objectPosition,
    },
    className: `
      transition-opacity duration-300
      ${loadingState === 'loaded' ? 'opacity-100' : 'opacity-0'}
    `.trim(),
  };

  // Add width/height or fill prop
  if (fill) {
    (imageProps as any).fill = true;
  } else if (width && height) {
    (imageProps as any).width = width;
    (imageProps as any).height = height;
  }

  return (
    <div className={containerClasses}>
      {/* Main image */}
      <Image
        {...imageProps}
        alt={imageProps.alt || ''}
        ref={imageRef}
      />

      {/* Loading spinner */}
      {renderLoadingSpinner()}

      {/* Error state */}
      {renderErrorState()}

      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && trackPerformance && performanceMetrics.loadDuration && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {performanceMetrics.loadDuration.toFixed(0)}ms
        </div>
      )}
    </div>
  );
};

// ==============================================================================
// HIGHER-ORDER COMPONENT
// ==============================================================================

/**
 * Higher-order component that wraps OptimizedImage with default props.
 */
export const withImageOptimization = (defaultProps: Partial<OptimizedImageProps> = {}) => {
  const WithImageOptimization = (props: OptimizedImageProps) => (
    <OptimizedImage {...defaultProps} {...props} />
  );
  WithImageOptimization.displayName = 'WithImageOptimization';
  return WithImageOptimization;
};

// ==============================================================================
// PRESET CONFIGURATIONS
// ==============================================================================

/**
 * Product image component with optimized settings.
 */
export const ProductImage: React.FC<Omit<OptimizedImageProps, 'quality' | 'objectFit'>> = (props) => (
  <OptimizedImage
    quality={85}
    objectFit="cover"
    trackPerformance={true}
    showLoadingSpinner={true}
    {...props}
  />
);

/**
 * Avatar image component with optimized settings.
 */
export const AvatarImage: React.FC<Omit<OptimizedImageProps, 'quality' | 'objectFit' | 'placeholder'>> = (props) => (
  <OptimizedImage
    quality={90}
    objectFit="cover"
    placeholder="blur"
    trackPerformance={false}
    showLoadingSpinner={false}
    {...props}
  />
);

/**
 * Hero image component with optimized settings.
 */
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'priority' | 'quality' | 'loading'>> = (props) => (
  <OptimizedImage
    priority={true}
    quality={90}
    loading="eager"
    trackPerformance={true}
    {...props}
  />
);

export default OptimizedImage;