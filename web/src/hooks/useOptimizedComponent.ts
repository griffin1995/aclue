/**
 * React Component Optimization Hook for Aclue Platform
 *
 * Provides performance optimization utilities for React components.
 * Implements memoization, lazy loading, and rendering optimization patterns.
 *
 * Key Features:
 *   - Automatic component memoization
 *   - Lazy loading for heavy components
 *   - Virtual scrolling for large lists
 *   - Render optimization strategies
 *   - Performance monitoring integration
 *
 * Usage:
 *   const optimizedComponent = useOptimizedComponent(Component, options);
 */

import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

/**
 * Component optimization configuration.
 */
interface ComponentOptimizationOptions {
  memo?: boolean;                    // Enable React.memo wrapping
  lazyLoad?: boolean;               // Enable lazy loading
  virtualScroll?: boolean;          // Enable virtual scrolling for lists
  prefetch?: boolean;               // Prefetch component data
  errorBoundary?: boolean;          // Wrap with error boundary
  performanceTracking?: boolean;    // Track component render performance
}

/**
 * Performance metrics for components.
 */
interface ComponentPerformanceMetrics {
  renderCount: number;              // Number of renders
  averageRenderTime: number;        // Average render time in ms
  lastRenderTime: number;           // Last render time
  mountTime: number;                // Component mount time
  updateCount: number;              // Number of updates
}

/**
 * Virtual scrolling configuration.
 */
interface VirtualScrollConfig {
  itemHeight: number;               // Height of each item
  containerHeight: number;          // Height of the scroll container
  overscan?: number;               // Number of items to render outside visible area
}

// ==============================================================================
// COMPONENT OPTIMIZATION HOOK
// ==============================================================================

/**
 * Hook for optimizing React component performance.
 */
export const useOptimizedComponent = (
  options: ComponentOptimizationOptions = {}
) => {
  const router = useRouter();
  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);
  const mountTimeRef = useRef<number>(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<ComponentPerformanceMetrics>({
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    mountTime: 0,
    updateCount: 0,
  });

  // ===========================================================================
  // PERFORMANCE TRACKING
  // ===========================================================================

  /**
   * Track component render performance.
   */
  const trackRenderPerformance = useCallback(() => {
    if (!options.performanceTracking) return;

    const renderStart = performance.now();

    return () => {
      const renderTime = performance.now() - renderStart;
      renderCountRef.current += 1;
      renderTimesRef.current.push(renderTime);

      // Keep only last 100 render times for moving average
      if (renderTimesRef.current.length > 100) {
        renderTimesRef.current = renderTimesRef.current.slice(-100);
      }

      const averageRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;

      setPerformanceMetrics(prev => ({
        ...prev,
        renderCount: renderCountRef.current,
        lastRenderTime: renderTime,
        averageRenderTime,
        updateCount: prev.updateCount + 1,
      }));

      // Alert if render time is slow
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);

        // Track slow render event
        if (typeof window !== 'undefined') {
          import('@/lib/analytics').then(({ trackEvent }) => {
            trackEvent('slow_component_render', {
              renderTime,
              averageRenderTime,
              renderCount: renderCountRef.current,
              component: 'useOptimizedComponent',
              page: router.pathname,
            });
          });
        }
      }
    };
  }, [options.performanceTracking, router.pathname]);

  // ===========================================================================
  // MOUNT TRACKING
  // ===========================================================================

  useEffect(() => {
    mountTimeRef.current = performance.now();

    setPerformanceMetrics(prev => ({
      ...prev,
      mountTime: mountTimeRef.current,
    }));

    return () => {
      const unmountTime = performance.now();
      const componentLifetime = unmountTime - mountTimeRef.current;

      // Track component lifetime
      if (options.performanceTracking && typeof window !== 'undefined') {
        import('@/lib/analytics').then(({ trackEvent }) => {
          trackEvent('component_lifetime', {
            lifetime: componentLifetime,
            renderCount: renderCountRef.current,
            averageRenderTime: renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length,
            page: router.pathname,
          });
        });
      }
    };
  }, [options.performanceTracking, router.pathname]);

  // ===========================================================================
  // MEMOIZATION UTILITIES
  // ===========================================================================

  /**
   * Create optimized memoized callback.
   */
  const useOptimizedCallback = useCallback(
    <T extends (...args: any[]) => any>(
      callback: T,
      deps: React.DependencyList
    ): T => {
      return useCallback(callback, deps);
    },
    []
  );

  /**
   * Create optimized memoized value.
   */
  const useOptimizedMemo = useCallback(
    <T>(factory: () => T, deps: React.DependencyList): T => {
      return useMemo(factory, deps);
    },
    []
  );

  // ===========================================================================
  // LAZY LOADING UTILITIES
  // ===========================================================================

  /**
   * Create lazy-loaded component.
   */
  const createLazyComponent = useCallback(
    (
      importFn: () => Promise<{ default: React.ComponentType<any> }>,
      fallback?: React.ComponentType
    ) => {
      const LazyComponent = React.lazy(importFn);

      return React.forwardRef<any, any>((props, ref) => {
        const fallbackElement = fallback ? React.createElement(fallback) : React.createElement('div', {}, 'Loading...');
        return (
          <React.Suspense fallback={fallbackElement}>
            <LazyComponent {...props} ref={ref} />
          </React.Suspense>
        );
      });
    },
    []
  );

  // ===========================================================================
  // VIRTUAL SCROLLING
  // ===========================================================================

  /**
   * Create virtual scroll utilities for large lists.
   */
  const createVirtualScroll = useCallback(
    (items: any[], config: VirtualScrollConfig) => {
      const [scrollTop, setScrollTop] = useState(0);
      const [containerHeight] = useState(config.containerHeight);
      const itemHeight = config.itemHeight;
      const overscan = config.overscan || 5;

      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const endIndex = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      );

      const visibleItems = items.slice(startIndex, endIndex + 1);
      const totalHeight = items.length * itemHeight;
      const offsetY = startIndex * itemHeight;

      const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(event.currentTarget.scrollTop);
      }, []);

      return {
        visibleItems,
        totalHeight,
        offsetY,
        handleScroll,
        startIndex,
        endIndex,
      };
    },
    []
  );

  // ===========================================================================
  // INTERSECTION OBSERVER
  // ===========================================================================

  /**
   * Create intersection observer for lazy loading.
   */
  const useIntersectionObserver = useCallback(
    (options: IntersectionObserverInit = {}) => {
      const [isIntersecting, setIsIntersecting] = useState(false);
      const [element, setElement] = useState<Element | null>(null);

      useEffect(() => {
        if (!element) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsIntersecting(entry.isIntersecting);
          },
          {
            threshold: 0.1,
            rootMargin: '50px',
            ...options,
          }
        );

        observer.observe(element);

        return () => {
          observer.disconnect();
        };
      }, [element, options]);

      return [setElement, isIntersecting] as const;
    },
    []
  );

  // ===========================================================================
  // DEBOUNCED STATE
  // ===========================================================================

  /**
   * Create debounced state for performance optimization.
   */
  const useDebouncedState = useCallback(
    <T>(initialValue: T, delay: number = 300) => {
      const [value, setValue] = useState(initialValue);
      const [debouncedValue, setDebouncedValue] = useState(initialValue);
      const timeoutRef = useRef<NodeJS.Timeout>();

      useEffect(() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }, [value, delay]);

      return [value, setValue, debouncedValue] as const;
    },
    []
  );

  // ===========================================================================
  // RENDER OPTIMIZATION
  // ===========================================================================

  /**
   * Optimize component rendering with various strategies.
   */
  const optimizeRendering = useCallback(
    <P extends object>(
      Component: React.ComponentType<P>
    ): React.ComponentType<P> => {
      let OptimizedComponent = Component;

      // Apply React.memo if requested
      if (options.memo) {
        OptimizedComponent = React.memo(OptimizedComponent);
      }

      // Wrap with performance tracking
      if (options.performanceTracking) {
        const PerformanceWrapper: React.FC<P> = (props) => {
          const endTracking = trackRenderPerformance();

          useEffect(() => {
            return endTracking;
          });

          return <OptimizedComponent {...props} />;
        };

        OptimizedComponent = PerformanceWrapper as React.ComponentType<P>;
      }

      // Wrap with error boundary if requested
      if (options.errorBoundary) {
        const ErrorBoundaryWrapper: React.FC<P> = (props) => {
          const { ComponentErrorBoundary } = require('@/components/error/ErrorBoundary');
          return (
            <ComponentErrorBoundary>
              <OptimizedComponent {...props} />
            </ComponentErrorBoundary>
          );
        };

        OptimizedComponent = ErrorBoundaryWrapper as React.ComponentType<P>;
      }

      return OptimizedComponent;
    },
    [options, trackRenderPerformance]
  );

  // ===========================================================================
  // RETURN OPTIMIZATION UTILITIES
  // ===========================================================================

  return {
    // Performance tracking
    performanceMetrics,
    trackRenderPerformance,

    // Memoization utilities
    useOptimizedCallback,
    useOptimizedMemo,

    // Lazy loading
    createLazyComponent,

    // Virtual scrolling
    createVirtualScroll,

    // Intersection observer
    useIntersectionObserver,

    // Debounced state
    useDebouncedState,

    // Component optimization
    optimizeRendering,
  };
};

// ==============================================================================
// HIGHER-ORDER COMPONENT FOR OPTIMIZATION
// ==============================================================================

/**
 * Higher-order component that applies optimization strategies.
 */
export const withOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  options: ComponentOptimizationOptions = {}
) => {
  const OptimizedComponent: React.FC<P> = (props) => {
    const { optimizeRendering } = useOptimizedComponent(options);
    const EnhancedComponent = useMemo(
      () => optimizeRendering(Component),
      [Component, optimizeRendering]
    );

    return <EnhancedComponent {...props} />;
  };

  OptimizedComponent.displayName = `withOptimization(${Component.displayName || Component.name})`;

  return OptimizedComponent;
};

export default useOptimizedComponent;