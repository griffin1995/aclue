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
  src: string; // Image source URL
  alt: string; // Alt text for accessibility
  width?: number; // Image width
  height?: number; // Image height
  className?: string; // CSS classes
  priority?: boolean; // Load with high priority
  quality?: number; // Image quality (1-100)
  placeholder?: 'blur' | 'empty'; // Placeholder type
  blurDataURL?: string; // Custom blur placeholder
  sizes?: string; // Responsive sizes
  fill?: boolean; // Fill container
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'; // Object fit
  objectPosition?: string; // Object position
  loading?: 'lazy' | 'eager'; // Loading strategy
  fallbackSrc?: string; // Fallback image URL
  showLoadingSpinner?: boolean; // Show loading indicator
  trackPerformance?: boolean; // Track loading performance
  onLoad?: () => void; // Load callback
  onError?: () => void; // Error callback
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
  className = stryMutAct_9fa48("3595") ? "Stryker was here!" : (stryCov_9fa48("3595"), ''),
  priority = stryMutAct_9fa48("3596") ? true : (stryCov_9fa48("3596"), false),
  quality = 80,
  placeholder = stryMutAct_9fa48("3597") ? "" : (stryCov_9fa48("3597"), 'blur'),
  blurDataURL,
  sizes,
  fill = stryMutAct_9fa48("3598") ? true : (stryCov_9fa48("3598"), false),
  objectFit = stryMutAct_9fa48("3599") ? "" : (stryCov_9fa48("3599"), 'cover'),
  objectPosition = stryMutAct_9fa48("3600") ? "" : (stryCov_9fa48("3600"), 'center'),
  loading = stryMutAct_9fa48("3601") ? "" : (stryCov_9fa48("3601"), 'lazy'),
  fallbackSrc = stryMutAct_9fa48("3602") ? "" : (stryCov_9fa48("3602"), '/images/placeholder.png'),
  showLoadingSpinner = stryMutAct_9fa48("3603") ? false : (stryCov_9fa48("3603"), true),
  trackPerformance = stryMutAct_9fa48("3604") ? true : (stryCov_9fa48("3604"), false),
  onLoad,
  onError
}) => {
  if (stryMutAct_9fa48("3605")) {
    {}
  } else {
    stryCov_9fa48("3605");
    // State management
    const [loadingState, setLoadingState] = useState<ImageLoadingState>(stryMutAct_9fa48("3606") ? "" : (stryCov_9fa48("3606"), 'loading'));
    const [currentSrc, setCurrentSrc] = useState(src);
    const [performanceMetrics, setPerformanceMetrics] = useState<ImagePerformanceMetrics>(stryMutAct_9fa48("3607") ? {} : (stryCov_9fa48("3607"), {
      loadStartTime: 0
    }));

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
      if (stryMutAct_9fa48("3608")) {
        {}
      } else {
        stryCov_9fa48("3608");
        if (stryMutAct_9fa48("3611") ? false : stryMutAct_9fa48("3610") ? true : stryMutAct_9fa48("3609") ? trackPerformance : (stryCov_9fa48("3609", "3610", "3611"), !trackPerformance)) return;
        setPerformanceMetrics(stryMutAct_9fa48("3612") ? () => undefined : (stryCov_9fa48("3612"), prev => stryMutAct_9fa48("3613") ? {} : (stryCov_9fa48("3613"), {
          ...prev,
          loadStartTime: performance.now()
        })));
      }
    }, stryMutAct_9fa48("3614") ? [] : (stryCov_9fa48("3614"), [trackPerformance]));

    /**
     * End performance tracking and report metrics.
     */
    const endPerformanceTracking = useCallback((success: boolean) => {
      if (stryMutAct_9fa48("3615")) {
        {}
      } else {
        stryCov_9fa48("3615");
        if (stryMutAct_9fa48("3618") ? false : stryMutAct_9fa48("3617") ? true : stryMutAct_9fa48("3616") ? trackPerformance : (stryCov_9fa48("3616", "3617", "3618"), !trackPerformance)) return;
        const loadEndTime = performance.now();
        const loadDuration = stryMutAct_9fa48("3619") ? loadEndTime + performanceMetrics.loadStartTime : (stryCov_9fa48("3619"), loadEndTime - performanceMetrics.loadStartTime);
        const metrics = stryMutAct_9fa48("3620") ? {} : (stryCov_9fa48("3620"), {
          ...performanceMetrics,
          loadEndTime,
          loadDuration
        });

        // Get image dimensions if available
        if (stryMutAct_9fa48("3623") ? imageRef.current || success : stryMutAct_9fa48("3622") ? false : stryMutAct_9fa48("3621") ? true : (stryCov_9fa48("3621", "3622", "3623"), imageRef.current && success)) {
          if (stryMutAct_9fa48("3624")) {
            {}
          } else {
            stryCov_9fa48("3624");
            metrics.naturalWidth = imageRef.current.naturalWidth;
            metrics.naturalHeight = imageRef.current.naturalHeight;
            metrics.renderedWidth = imageRef.current.width;
            metrics.renderedHeight = imageRef.current.height;

            // Calculate compression ratio estimate
            if (stryMutAct_9fa48("3627") ? width && height && metrics.naturalWidth || metrics.naturalHeight : stryMutAct_9fa48("3626") ? false : stryMutAct_9fa48("3625") ? true : (stryCov_9fa48("3625", "3626", "3627"), (stryMutAct_9fa48("3629") ? width && height || metrics.naturalWidth : stryMutAct_9fa48("3628") ? true : (stryCov_9fa48("3628", "3629"), (stryMutAct_9fa48("3631") ? width || height : stryMutAct_9fa48("3630") ? true : (stryCov_9fa48("3630", "3631"), width && height)) && metrics.naturalWidth)) && metrics.naturalHeight)) {
              if (stryMutAct_9fa48("3632")) {
                {}
              } else {
                stryCov_9fa48("3632");
                const requestedPixels = stryMutAct_9fa48("3633") ? width / height : (stryCov_9fa48("3633"), width * height);
                const naturalPixels = stryMutAct_9fa48("3634") ? metrics.naturalWidth / metrics.naturalHeight : (stryCov_9fa48("3634"), metrics.naturalWidth * metrics.naturalHeight);
                metrics.compressionRatio = stryMutAct_9fa48("3635") ? naturalPixels * requestedPixels : (stryCov_9fa48("3635"), naturalPixels / requestedPixels);
              }
            }
          }
        }
        setPerformanceMetrics(metrics);

        // Report performance metrics
        if (stryMutAct_9fa48("3638") ? typeof window === 'undefined' : stryMutAct_9fa48("3637") ? false : stryMutAct_9fa48("3636") ? true : (stryCov_9fa48("3636", "3637", "3638"), typeof window !== (stryMutAct_9fa48("3639") ? "" : (stryCov_9fa48("3639"), 'undefined')))) {
          if (stryMutAct_9fa48("3640")) {
            {}
          } else {
            stryCov_9fa48("3640");
            import(stryMutAct_9fa48("3641") ? "" : (stryCov_9fa48("3641"), '@/lib/analytics')).then(({
              trackEvent
            }) => {
              if (stryMutAct_9fa48("3642")) {
                {}
              } else {
                stryCov_9fa48("3642");
                trackEvent(stryMutAct_9fa48("3643") ? "" : (stryCov_9fa48("3643"), 'image_load_performance'), stryMutAct_9fa48("3644") ? {} : (stryCov_9fa48("3644"), {
                  src: currentSrc,
                  success,
                  loadDuration,
                  naturalWidth: metrics.naturalWidth,
                  naturalHeight: metrics.naturalHeight,
                  compressionRatio: metrics.compressionRatio,
                  quality,
                  objectFit
                }));
              }
            });
          }
        }

        // Log slow image loads
        if (stryMutAct_9fa48("3648") ? loadDuration <= 3000 : stryMutAct_9fa48("3647") ? loadDuration >= 3000 : stryMutAct_9fa48("3646") ? false : stryMutAct_9fa48("3645") ? true : (stryCov_9fa48("3645", "3646", "3647", "3648"), loadDuration > 3000)) {
          if (stryMutAct_9fa48("3649")) {
            {}
          } else {
            stryCov_9fa48("3649");
            // More than 3 seconds
            console.warn(stryMutAct_9fa48("3650") ? `` : (stryCov_9fa48("3650"), `Slow image load detected: ${currentSrc} (${loadDuration.toFixed(2)}ms)`));
          }
        }
      }
    }, stryMutAct_9fa48("3651") ? [] : (stryCov_9fa48("3651"), [trackPerformance, performanceMetrics.loadStartTime, currentSrc, quality, objectFit, width, height]));

    // ===========================================================================
    // EVENT HANDLERS
    // ===========================================================================

    /**
     * Handle successful image load.
     */
    const handleLoad = useCallback(() => {
      if (stryMutAct_9fa48("3652")) {
        {}
      } else {
        stryCov_9fa48("3652");
        setLoadingState(stryMutAct_9fa48("3653") ? "" : (stryCov_9fa48("3653"), 'loaded'));
        endPerformanceTracking(stryMutAct_9fa48("3654") ? false : (stryCov_9fa48("3654"), true));
        stryMutAct_9fa48("3655") ? onLoad() : (stryCov_9fa48("3655"), onLoad?.());
      }
    }, stryMutAct_9fa48("3656") ? [] : (stryCov_9fa48("3656"), [endPerformanceTracking, onLoad]));

    /**
     * Handle image load error.
     */
    const handleError = useCallback(() => {
      if (stryMutAct_9fa48("3657")) {
        {}
      } else {
        stryCov_9fa48("3657");
        console.warn(stryMutAct_9fa48("3658") ? `` : (stryCov_9fa48("3658"), `Failed to load image: ${currentSrc}`));

        // Try fallback image if available and not already using it
        if (stryMutAct_9fa48("3661") ? fallbackSrc || currentSrc !== fallbackSrc : stryMutAct_9fa48("3660") ? false : stryMutAct_9fa48("3659") ? true : (stryCov_9fa48("3659", "3660", "3661"), fallbackSrc && (stryMutAct_9fa48("3663") ? currentSrc === fallbackSrc : stryMutAct_9fa48("3662") ? true : (stryCov_9fa48("3662", "3663"), currentSrc !== fallbackSrc)))) {
          if (stryMutAct_9fa48("3664")) {
            {}
          } else {
            stryCov_9fa48("3664");
            console.log(stryMutAct_9fa48("3665") ? `` : (stryCov_9fa48("3665"), `Attempting fallback image: ${fallbackSrc}`));
            setCurrentSrc(fallbackSrc);
            setLoadingState(stryMutAct_9fa48("3666") ? "" : (stryCov_9fa48("3666"), 'loading'));
            return;
          }
        }
        setLoadingState(stryMutAct_9fa48("3667") ? "" : (stryCov_9fa48("3667"), 'error'));
        endPerformanceTracking(stryMutAct_9fa48("3668") ? true : (stryCov_9fa48("3668"), false));
        stryMutAct_9fa48("3669") ? onError() : (stryCov_9fa48("3669"), onError?.());
      }
    }, stryMutAct_9fa48("3670") ? [] : (stryCov_9fa48("3670"), [currentSrc, fallbackSrc, endPerformanceTracking, onError]));

    /**
     * Handle image load start.
     */
    const handleLoadStart = useCallback(() => {
      if (stryMutAct_9fa48("3671")) {
        {}
      } else {
        stryCov_9fa48("3671");
        setLoadingState(stryMutAct_9fa48("3672") ? "" : (stryCov_9fa48("3672"), 'loading'));
        startPerformanceTracking();
      }
    }, stryMutAct_9fa48("3673") ? [] : (stryCov_9fa48("3673"), [startPerformanceTracking]));

    // ===========================================================================
    // RESPONSIVE SIZES GENERATION
    // ===========================================================================

    /**
     * Generate responsive sizes string based on common breakpoints.
     */
    const generateResponsiveSizes = useCallback(() => {
      if (stryMutAct_9fa48("3674")) {
        {}
      } else {
        stryCov_9fa48("3674");
        if (stryMutAct_9fa48("3676") ? false : stryMutAct_9fa48("3675") ? true : (stryCov_9fa48("3675", "3676"), sizes)) return sizes;
        if (stryMutAct_9fa48("3679") ? false : stryMutAct_9fa48("3678") ? true : stryMutAct_9fa48("3677") ? width : (stryCov_9fa48("3677", "3678", "3679"), !width)) return undefined;

        // Generate sizes based on common breakpoints
        const breakpoints = stryMutAct_9fa48("3680") ? [] : (stryCov_9fa48("3680"), [stryMutAct_9fa48("3681") ? {} : (stryCov_9fa48("3681"), {
          size: 640,
          viewport: stryMutAct_9fa48("3682") ? "" : (stryCov_9fa48("3682"), '100vw')
        }), // Mobile
        stryMutAct_9fa48("3683") ? {} : (stryCov_9fa48("3683"), {
          size: 768,
          viewport: stryMutAct_9fa48("3684") ? "" : (stryCov_9fa48("3684"), '50vw')
        }), // Tablet
        stryMutAct_9fa48("3685") ? {} : (stryCov_9fa48("3685"), {
          size: 1024,
          viewport: stryMutAct_9fa48("3686") ? "" : (stryCov_9fa48("3686"), '33vw')
        }), // Desktop
        stryMutAct_9fa48("3687") ? {} : (stryCov_9fa48("3687"), {
          size: 1280,
          viewport: stryMutAct_9fa48("3688") ? "" : (stryCov_9fa48("3688"), '25vw')
        }) // Large desktop
        ]);
        const sizeString = breakpoints.map(stryMutAct_9fa48("3689") ? () => undefined : (stryCov_9fa48("3689"), bp => stryMutAct_9fa48("3690") ? `` : (stryCov_9fa48("3690"), `(max-width: ${bp.size}px) ${bp.viewport}`))).join(stryMutAct_9fa48("3691") ? "" : (stryCov_9fa48("3691"), ', '));
        return stryMutAct_9fa48("3692") ? `` : (stryCov_9fa48("3692"), `${sizeString}, ${width}px`);
      }
    }, stryMutAct_9fa48("3693") ? [] : (stryCov_9fa48("3693"), [sizes, width]));

    // ===========================================================================
    // BLUR PLACEHOLDER GENERATION
    // ===========================================================================

    /**
     * Generate a simple blur placeholder if none provided.
     */
    const generateBlurPlaceholder = useCallback(() => {
      if (stryMutAct_9fa48("3694")) {
        {}
      } else {
        stryCov_9fa48("3694");
        if (stryMutAct_9fa48("3696") ? false : stryMutAct_9fa48("3695") ? true : (stryCov_9fa48("3695", "3696"), blurDataURL)) return blurDataURL;
        if (stryMutAct_9fa48("3699") ? placeholder === 'blur' : stryMutAct_9fa48("3698") ? false : stryMutAct_9fa48("3697") ? true : (stryCov_9fa48("3697", "3698", "3699"), placeholder !== (stryMutAct_9fa48("3700") ? "" : (stryCov_9fa48("3700"), 'blur')))) return undefined;

        // Generate a simple 1x1 pixel placeholder in the dominant color
        const canvas = document.createElement(stryMutAct_9fa48("3701") ? "" : (stryCov_9fa48("3701"), 'canvas'));
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext(stryMutAct_9fa48("3702") ? "" : (stryCov_9fa48("3702"), '2d'));
        if (stryMutAct_9fa48("3704") ? false : stryMutAct_9fa48("3703") ? true : (stryCov_9fa48("3703", "3704"), ctx)) {
          if (stryMutAct_9fa48("3705")) {
            {}
          } else {
            stryCov_9fa48("3705");
            // Use a neutral gray color
            ctx.fillStyle = stryMutAct_9fa48("3706") ? "" : (stryCov_9fa48("3706"), '#f3f4f6');
            ctx.fillRect(0, 0, 1, 1);
            return canvas.toDataURL();
          }
        }
        return undefined;
      }
    }, stryMutAct_9fa48("3707") ? [] : (stryCov_9fa48("3707"), [blurDataURL, placeholder]));

    // ===========================================================================
    // INTERSECTION OBSERVER
    // ===========================================================================

    /**
     * Set up intersection observer for lazy loading optimization.
     */
    useEffect(() => {
      if (stryMutAct_9fa48("3708")) {
        {}
      } else {
        stryCov_9fa48("3708");
        if (stryMutAct_9fa48("3711") ? priority && loading === 'eager' : stryMutAct_9fa48("3710") ? false : stryMutAct_9fa48("3709") ? true : (stryCov_9fa48("3709", "3710", "3711"), priority || (stryMutAct_9fa48("3713") ? loading !== 'eager' : stryMutAct_9fa48("3712") ? false : (stryCov_9fa48("3712", "3713"), loading === (stryMutAct_9fa48("3714") ? "" : (stryCov_9fa48("3714"), 'eager')))))) return;
        if (stryMutAct_9fa48("3717") ? 'IntersectionObserver' in window || imageRef.current : stryMutAct_9fa48("3716") ? false : stryMutAct_9fa48("3715") ? true : (stryCov_9fa48("3715", "3716", "3717"), (stryMutAct_9fa48("3718") ? "" : (stryCov_9fa48("3718"), 'IntersectionObserver')) in window && imageRef.current)) {
          if (stryMutAct_9fa48("3719")) {
            {}
          } else {
            stryCov_9fa48("3719");
            intersectionObserverRef.current = new IntersectionObserver(entries => {
              if (stryMutAct_9fa48("3720")) {
                {}
              } else {
                stryCov_9fa48("3720");
                entries.forEach(entry => {
                  if (stryMutAct_9fa48("3721")) {
                    {}
                  } else {
                    stryCov_9fa48("3721");
                    if (stryMutAct_9fa48("3723") ? false : stryMutAct_9fa48("3722") ? true : (stryCov_9fa48("3722", "3723"), entry.isIntersecting)) {
                      if (stryMutAct_9fa48("3724")) {
                        {}
                      } else {
                        stryCov_9fa48("3724");
                        // Image is about to become visible, prefetch if needed
                        if (stryMutAct_9fa48("3726") ? false : stryMutAct_9fa48("3725") ? true : (stryCov_9fa48("3725", "3726"), trackPerformance)) {
                          if (stryMutAct_9fa48("3727")) {
                            {}
                          } else {
                            stryCov_9fa48("3727");
                            console.log(stryMutAct_9fa48("3728") ? `` : (stryCov_9fa48("3728"), `Image entering viewport: ${currentSrc}`));
                          }
                        }
                      }
                    }
                  }
                });
              }
            }, stryMutAct_9fa48("3729") ? {} : (stryCov_9fa48("3729"), {
              rootMargin: stryMutAct_9fa48("3730") ? "" : (stryCov_9fa48("3730"), '50px'),
              // Start loading 50px before image enters viewport
              threshold: 0.1
            }));
            intersectionObserverRef.current.observe(imageRef.current);
          }
        }
        return () => {
          if (stryMutAct_9fa48("3731")) {
            {}
          } else {
            stryCov_9fa48("3731");
            if (stryMutAct_9fa48("3733") ? false : stryMutAct_9fa48("3732") ? true : (stryCov_9fa48("3732", "3733"), intersectionObserverRef.current)) {
              if (stryMutAct_9fa48("3734")) {
                {}
              } else {
                stryCov_9fa48("3734");
                intersectionObserverRef.current.disconnect();
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("3735") ? [] : (stryCov_9fa48("3735"), [priority, loading, trackPerformance, currentSrc]));

    // ===========================================================================
    // RENDER LOADING STATE
    // ===========================================================================

    /**
     * Render loading spinner overlay.
     */
    const renderLoadingSpinner = () => {
      if (stryMutAct_9fa48("3736")) {
        {}
      } else {
        stryCov_9fa48("3736");
        if (stryMutAct_9fa48("3739") ? !showLoadingSpinner && loadingState !== 'loading' : stryMutAct_9fa48("3738") ? false : stryMutAct_9fa48("3737") ? true : (stryCov_9fa48("3737", "3738", "3739"), (stryMutAct_9fa48("3740") ? showLoadingSpinner : (stryCov_9fa48("3740"), !showLoadingSpinner)) || (stryMutAct_9fa48("3742") ? loadingState === 'loading' : stryMutAct_9fa48("3741") ? false : (stryCov_9fa48("3741", "3742"), loadingState !== (stryMutAct_9fa48("3743") ? "" : (stryCov_9fa48("3743"), 'loading')))))) return null;
        return <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>;
      }
    };

    /**
     * Render error state.
     */
    const renderErrorState = () => {
      if (stryMutAct_9fa48("3744")) {
        {}
      } else {
        stryCov_9fa48("3744");
        if (stryMutAct_9fa48("3747") ? loadingState === 'error' : stryMutAct_9fa48("3746") ? false : stryMutAct_9fa48("3745") ? true : (stryCov_9fa48("3745", "3746", "3747"), loadingState !== (stryMutAct_9fa48("3748") ? "" : (stryCov_9fa48("3748"), 'error')))) return null;
        return <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>;
      }
    };

    // ===========================================================================
    // RENDER MAIN COMPONENT
    // ===========================================================================

    // Container classes
    const containerClasses = stryMutAct_9fa48("3749") ? `
    relative overflow-hidden
    ${className}
    ${loadingState === 'loading' ? 'bg-gray-100' : ''}
  ` : (stryCov_9fa48("3749"), (stryMutAct_9fa48("3750") ? `` : (stryCov_9fa48("3750"), `
    relative overflow-hidden
    ${className}
    ${(stryMutAct_9fa48("3753") ? loadingState !== 'loading' : stryMutAct_9fa48("3752") ? false : stryMutAct_9fa48("3751") ? true : (stryCov_9fa48("3751", "3752", "3753"), loadingState === (stryMutAct_9fa48("3754") ? "" : (stryCov_9fa48("3754"), 'loading')))) ? stryMutAct_9fa48("3755") ? "" : (stryCov_9fa48("3755"), 'bg-gray-100') : stryMutAct_9fa48("3756") ? "Stryker was here!" : (stryCov_9fa48("3756"), '')}
  `)).trim());

    // Image props for Next.js Image component
    const imageProps = stryMutAct_9fa48("3757") ? {} : (stryCov_9fa48("3757"), {
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
      style: stryMutAct_9fa48("3758") ? {} : (stryCov_9fa48("3758"), {
        objectFit,
        objectPosition
      }),
      className: stryMutAct_9fa48("3759") ? `
      transition-opacity duration-300
      ${loadingState === 'loaded' ? 'opacity-100' : 'opacity-0'}
    ` : (stryCov_9fa48("3759"), (stryMutAct_9fa48("3760") ? `` : (stryCov_9fa48("3760"), `
      transition-opacity duration-300
      ${(stryMutAct_9fa48("3763") ? loadingState !== 'loaded' : stryMutAct_9fa48("3762") ? false : stryMutAct_9fa48("3761") ? true : (stryCov_9fa48("3761", "3762", "3763"), loadingState === (stryMutAct_9fa48("3764") ? "" : (stryCov_9fa48("3764"), 'loaded')))) ? stryMutAct_9fa48("3765") ? "" : (stryCov_9fa48("3765"), 'opacity-100') : stryMutAct_9fa48("3766") ? "" : (stryCov_9fa48("3766"), 'opacity-0')}
    `)).trim())
    });

    // Add width/height or fill prop
    if (stryMutAct_9fa48("3768") ? false : stryMutAct_9fa48("3767") ? true : (stryCov_9fa48("3767", "3768"), fill)) {
      if (stryMutAct_9fa48("3769")) {
        {}
      } else {
        stryCov_9fa48("3769");
        (imageProps as any).fill = stryMutAct_9fa48("3770") ? false : (stryCov_9fa48("3770"), true);
      }
    } else if (stryMutAct_9fa48("3773") ? width || height : stryMutAct_9fa48("3772") ? false : stryMutAct_9fa48("3771") ? true : (stryCov_9fa48("3771", "3772", "3773"), width && height)) {
      if (stryMutAct_9fa48("3774")) {
        {}
      } else {
        stryCov_9fa48("3774");
        (imageProps as any).width = width;
        (imageProps as any).height = height;
      }
    }
    return <div className={containerClasses}>
      {/* Main image */}
      <Image {...imageProps} alt={stryMutAct_9fa48("3777") ? imageProps.alt && '' : stryMutAct_9fa48("3776") ? false : stryMutAct_9fa48("3775") ? true : (stryCov_9fa48("3775", "3776", "3777"), imageProps.alt || (stryMutAct_9fa48("3778") ? "Stryker was here!" : (stryCov_9fa48("3778"), '')))} ref={imageRef} />

      {/* Loading spinner */}
      {renderLoadingSpinner()}

      {/* Error state */}
      {renderErrorState()}

      {/* Performance metrics (development only) */}
      {stryMutAct_9fa48("3781") ? process.env.NODE_ENV === 'development' && trackPerformance && performanceMetrics.loadDuration || <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {performanceMetrics.loadDuration.toFixed(0)}ms
        </div> : stryMutAct_9fa48("3780") ? false : stryMutAct_9fa48("3779") ? true : (stryCov_9fa48("3779", "3780", "3781"), (stryMutAct_9fa48("3783") ? process.env.NODE_ENV === 'development' && trackPerformance || performanceMetrics.loadDuration : stryMutAct_9fa48("3782") ? true : (stryCov_9fa48("3782", "3783"), (stryMutAct_9fa48("3785") ? process.env.NODE_ENV === 'development' || trackPerformance : stryMutAct_9fa48("3784") ? true : (stryCov_9fa48("3784", "3785"), (stryMutAct_9fa48("3787") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("3786") ? true : (stryCov_9fa48("3786", "3787"), process.env.NODE_ENV === (stryMutAct_9fa48("3788") ? "" : (stryCov_9fa48("3788"), 'development')))) && trackPerformance)) && performanceMetrics.loadDuration)) && <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {performanceMetrics.loadDuration.toFixed(0)}ms
        </div>)}
    </div>;
  }
};

// ==============================================================================
// HIGHER-ORDER COMPONENT
// ==============================================================================

/**
 * Higher-order component that wraps OptimizedImage with default props.
 */
export const withImageOptimization = (defaultProps: Partial<OptimizedImageProps> = {}) => {
  if (stryMutAct_9fa48("3789")) {
    {}
  } else {
    stryCov_9fa48("3789");
    const WithImageOptimization = stryMutAct_9fa48("3790") ? () => undefined : (stryCov_9fa48("3790"), (() => {
      const WithImageOptimization = (props: OptimizedImageProps) => <OptimizedImage {...defaultProps} {...props} />;
      return WithImageOptimization;
    })());
    WithImageOptimization.displayName = stryMutAct_9fa48("3791") ? "" : (stryCov_9fa48("3791"), 'WithImageOptimization');
    return WithImageOptimization;
  }
};

// ==============================================================================
// PRESET CONFIGURATIONS
// ==============================================================================

/**
 * Product image component with optimized settings.
 */
export const ProductImage: React.FC<Omit<OptimizedImageProps, 'quality' | 'objectFit'>> = stryMutAct_9fa48("3792") ? () => undefined : (stryCov_9fa48("3792"), (() => {
  const ProductImage: React.FC<Omit<OptimizedImageProps, 'quality' | 'objectFit'>> = props => <OptimizedImage quality={85} objectFit="cover" trackPerformance={stryMutAct_9fa48("3793") ? false : (stryCov_9fa48("3793"), true)} showLoadingSpinner={stryMutAct_9fa48("3794") ? false : (stryCov_9fa48("3794"), true)} {...props} />;
  return ProductImage;
})());

/**
 * Avatar image component with optimized settings.
 */
export const AvatarImage: React.FC<Omit<OptimizedImageProps, 'quality' | 'objectFit' | 'placeholder'>> = stryMutAct_9fa48("3795") ? () => undefined : (stryCov_9fa48("3795"), (() => {
  const AvatarImage: React.FC<Omit<OptimizedImageProps, 'quality' | 'objectFit' | 'placeholder'>> = props => <OptimizedImage quality={90} objectFit="cover" placeholder="blur" trackPerformance={stryMutAct_9fa48("3796") ? true : (stryCov_9fa48("3796"), false)} showLoadingSpinner={stryMutAct_9fa48("3797") ? true : (stryCov_9fa48("3797"), false)} {...props} />;
  return AvatarImage;
})());

/**
 * Hero image component with optimized settings.
 */
export const HeroImage: React.FC<Omit<OptimizedImageProps, 'priority' | 'quality' | 'loading'>> = stryMutAct_9fa48("3798") ? () => undefined : (stryCov_9fa48("3798"), (() => {
  const HeroImage: React.FC<Omit<OptimizedImageProps, 'priority' | 'quality' | 'loading'>> = props => <OptimizedImage priority={stryMutAct_9fa48("3799") ? false : (stryCov_9fa48("3799"), true)} quality={90} loading="eager" trackPerformance={stryMutAct_9fa48("3800") ? false : (stryCov_9fa48("3800"), true)} {...props} />;
  return HeroImage;
})());
export default OptimizedImage;