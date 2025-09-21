/**
 * Performance Monitor Component for Aclue Platform
 *
 * Provides comprehensive performance monitoring and optimization for React components.
 * Tracks Core Web Vitals, component render times, and user interaction metrics.
 *
 * Key Features:
 *   - Core Web Vitals tracking (LCP, FID, CLS, FCP, TTFB)
 *   - Component render performance monitoring
 *   - Memory usage tracking
 *   - Bundle size analysis reporting
 *   - User interaction timing
 *   - Automatic performance alerts
 *
 * Usage:
 *   // In _app.tsx
 *   <PerformanceMonitor>
 *     <Component {...pageProps} />
 *   </PerformanceMonitor>
 */

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

/**
 * Performance metrics interface.
 */
interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number;        // Largest Contentful Paint
  fid?: number;        // First Input Delay
  cls?: number;        // Cumulative Layout Shift
  fcp?: number;        // First Contentful Paint
  ttfb?: number;       // Time to First Byte

  // Custom metrics
  renderTime?: number;    // Component render time
  memoryUsage?: number;   // Memory usage in MB
  bundleSize?: number;    // JavaScript bundle size

  // Page metrics
  pageLoadTime?: number;  // Total page load time
  domContentLoaded?: number; // DOM content loaded time
  timeToInteractive?: number; // Time to interactive
}

/**
 * Performance threshold configuration.
 */
interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  cls: { good: number; needsImprovement: number };
  fcp: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
}

/**
 * Props for PerformanceMonitor component.
 */
interface PerformanceMonitorProps {
  children: ReactNode;
  enabled?: boolean;           // Enable/disable monitoring
  reportingInterval?: number;  // Reporting interval in milliseconds
  trackWebVitals?: boolean;    // Enable Core Web Vitals tracking
  trackMemory?: boolean;       // Enable memory monitoring
  alertThresholds?: Partial<PerformanceThresholds>; // Custom alert thresholds
}

// ==============================================================================
// PERFORMANCE THRESHOLDS
// ==============================================================================

/**
 * Default performance thresholds based on Google's Core Web Vitals.
 */
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },      // Largest Contentful Paint
  fid: { good: 100, needsImprovement: 300 },        // First Input Delay
  cls: { good: 0.1, needsImprovement: 0.25 },       // Cumulative Layout Shift
  fcp: { good: 1800, needsImprovement: 3000 },      // First Contentful Paint
  ttfb: { good: 800, needsImprovement: 1800 },      // Time to First Byte
};

// ==============================================================================
// PERFORMANCE MONITOR COMPONENT
// ==============================================================================

/**
 * PerformanceMonitor component for tracking application performance.
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  children,
  enabled = process.env.NODE_ENV === 'production',
  reportingInterval = 30000, // 30 seconds
  trackWebVitals = true,
  trackMemory = true,
  alertThresholds = {},
}) => {
  const router = useRouter();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const reportingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigationStartTime = useRef<number>(0);
  const thresholds = { ...DEFAULT_THRESHOLDS, ...alertThresholds };

  // ===========================================================================
  // CORE WEB VITALS TRACKING
  // ===========================================================================

  /**
   * Track Core Web Vitals using the Web Vitals API.
   */
  const trackWebVitalsMetrics = () => {
    if (!trackWebVitals || typeof window === 'undefined') return;

    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Largest Contentful Paint
      getLCP((metric) => {
        updateMetric('lcp', metric.value);
        checkPerformanceAlert('lcp', metric.value);
      });

      // First Input Delay
      getFID((metric) => {
        updateMetric('fid', metric.value);
        checkPerformanceAlert('fid', metric.value);
      });

      // Cumulative Layout Shift
      getCLS((metric) => {
        updateMetric('cls', metric.value);
        checkPerformanceAlert('cls', metric.value);
      });

      // First Contentful Paint
      getFCP((metric) => {
        updateMetric('fcp', metric.value);
        checkPerformanceAlert('fcp', metric.value);
      });

      // Time to First Byte
      getTTFB((metric) => {
        updateMetric('ttfb', metric.value);
        checkPerformanceAlert('ttfb', metric.value);
      });
    }).catch((error) => {
      console.warn('Failed to load web-vitals library:', error);
    });
  };

  // ===========================================================================
  // CUSTOM PERFORMANCE METRICS
  // ===========================================================================

  /**
   * Track page load performance.
   */
  const trackPageLoadMetrics = () => {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      const timeToInteractive = navigation.domInteractive - navigation.fetchStart;

      updateMetric('pageLoadTime', pageLoadTime);
      updateMetric('domContentLoaded', domContentLoaded);
      updateMetric('timeToInteractive', timeToInteractive);
    }
  };

  /**
   * Track memory usage if available.
   */
  const trackMemoryUsage = () => {
    if (!trackMemory || typeof window === 'undefined') return;

    // @ts-ignore - memory API is experimental
    if ('memory' in performance) {
      // @ts-ignore
      const memoryInfo = performance.memory as any;
      const memoryUsageMB = memoryInfo?.usedJSHeapSize ? memoryInfo.usedJSHeapSize / (1024 * 1024) : 0;
      updateMetric('memoryUsage', memoryUsageMB);

      // Alert if memory usage is high (>100MB)
      if (memoryUsageMB > 100) {
        console.warn(`High memory usage detected: ${memoryUsageMB.toFixed(2)}MB`);
        reportPerformanceAlert('memory', memoryUsageMB, 'High memory usage detected');
      }
    }
  };

  /**
   * Track bundle size and resource loading.
   */
  const trackBundleSize = () => {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource');
    let totalJSSize = 0;

    resources.forEach((resource) => {
      if (resource.name.includes('.js') && resource.name.includes('/_next/')) {
        totalJSSize += (resource as PerformanceResourceTiming).transferSize || 0;
      }
    });

    const bundleSizeKB = totalJSSize / 1024;
    updateMetric('bundleSize', bundleSizeKB);

    // Alert if bundle size is large (>1MB)
    if (bundleSizeKB > 1024) {
      console.warn(`Large bundle size detected: ${bundleSizeKB.toFixed(2)}KB`);
      reportPerformanceAlert('bundle', bundleSizeKB, 'Large bundle size detected');
    }
  };

  // ===========================================================================
  // PERFORMANCE UTILITIES
  // ===========================================================================

  /**
   * Update a specific performance metric.
   */
  const updateMetric = (key: keyof PerformanceMetrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Check if a metric exceeds performance thresholds.
   */
  const checkPerformanceAlert = (metric: keyof PerformanceThresholds, value: number) => {
    const threshold = thresholds[metric];
    let status: 'good' | 'needs-improvement' | 'poor';

    if (value <= threshold.good) {
      status = 'good';
    } else if (value <= threshold.needsImprovement) {
      status = 'needs-improvement';
    } else {
      status = 'poor';
    }

    if (status === 'poor') {
      console.warn(`Poor ${metric.toUpperCase()} detected: ${value}ms`);
      reportPerformanceAlert(metric, value, `Poor ${metric.toUpperCase()} performance`);
    }

    // Track metric in analytics
    trackPerformanceMetric(metric, value, status);
  };

  /**
   * Track performance metric in analytics.
   */
  const trackPerformanceMetric = async (
    metric: string,
    value: number,
    status: 'good' | 'needs-improvement' | 'poor'
  ) => {
    try {
      const { trackEvent } = await import('@/lib/analytics');

      trackEvent('performance_metric', {
        metric,
        value,
        status,
        page: router.pathname,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Failed to track performance metric:', error);
    }
  };

  /**
   * Report performance alert to monitoring systems.
   */
  const reportPerformanceAlert = async (
    metric: string,
    value: number,
    message: string
  ) => {
    try {
      const { trackEvent } = await import('@/lib/analytics');

      trackEvent('performance_alert', {
        metric,
        value,
        message,
        page: router.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      // Report to Sentry if configured
      if (process.env['NEXT_PUBLIC_SENTRY_DSN']) {
        const Sentry = await import('@sentry/react');
        Sentry.addBreadcrumb({
          category: 'performance',
          message: `Performance alert: ${message}`,
          level: 'warning',
          data: { metric, value },
        });
      }
    } catch (error) {
      console.warn('Failed to report performance alert:', error);
    }
  };

  /**
   * Generate performance report for debugging.
   */
  const generatePerformanceReport = () => {
    if (process.env.NODE_ENV === 'development') {
      console.group('🏃‍♂️ Performance Report');
      console.table(metrics);

      // Resource timing summary
      const resources = performance.getEntriesByType('resource');
      const resourceSummary = resources.reduce((acc, resource) => {
        const type = resource.name.split('.').pop() || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('Resource Summary:', resourceSummary);
      console.groupEnd();
    }
  };

  // ===========================================================================
  // LIFECYCLE EFFECTS
  // ===========================================================================

  /**
   * Initialize performance monitoring on mount.
   */
  useEffect(() => {
    if (!enabled) return;

    navigationStartTime.current = performance.now();

    // Track initial metrics
    setTimeout(() => {
      trackWebVitalsMetrics();
      trackPageLoadMetrics();
      trackMemoryUsage();
      trackBundleSize();
    }, 1000);

    // Set up periodic reporting
    reportingIntervalRef.current = setInterval(() => {
      trackMemoryUsage();
      generatePerformanceReport();
    }, reportingInterval);

    return () => {
      if (reportingIntervalRef.current) {
        clearInterval(reportingIntervalRef.current);
      }
    };
  }, [enabled, reportingInterval]);

  /**
   * Track route changes for SPA navigation performance.
   */
  useEffect(() => {
    if (!enabled) return;

    const handleRouteChangeStart = () => {
      navigationStartTime.current = performance.now();
    };

    const handleRouteChangeComplete = () => {
      const navigationTime = performance.now() - navigationStartTime.current;

      trackPerformanceMetric('spa_navigation', navigationTime,
        navigationTime < 1000 ? 'good' : navigationTime < 3000 ? 'needs-improvement' : 'poor'
      );
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events, enabled]);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <>
      {children}
      {process.env.NODE_ENV === 'development' && enabled && (
        <PerformanceDevTools metrics={metrics} />
      )}
    </>
  );
};

// ==============================================================================
// DEVELOPMENT TOOLS
// ==============================================================================

/**
 * Development-only performance visualization component.
 */
const PerformanceDevTools: React.FC<{ metrics: PerformanceMetrics }> = ({ metrics }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors"
      >
        🏃‍♂️ Perf
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h3>

          <div className="space-y-2 text-xs">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-gray-900 font-mono">
                  {typeof value === 'number' ?
                    (key.includes('Size') ? `${value.toFixed(1)}KB` : `${value.toFixed(1)}ms`) :
                    'N/A'
                  }
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => window.performance.mark('manual-performance-check')}
            className="mt-3 w-full bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs hover:bg-gray-200 transition-colors"
          >
            Mark Performance Point
          </button>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;