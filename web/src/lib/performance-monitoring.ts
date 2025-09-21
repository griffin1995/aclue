/**
 * Aclue Performance Monitoring Service
 *
 * Enterprise-grade performance monitoring for Core Web Vitals, application metrics,
 * and user experience tracking. Provides real-time insights into application performance
 * with actionable metrics and automated alerting.
 *
 * Core Web Vitals Tracked:
 *   - LCP (Largest Contentful Paint): Loading performance
 *   - FID (First Input Delay): Interactivity
 *   - CLS (Cumulative Layout Shift): Visual stability
 *   - FCP (First Contentful Paint): Initial render
 *   - TTFB (Time to First Byte): Server response time
 *   - INP (Interaction to Next Paint): Responsiveness
 *
 * Application Metrics:
 *   - Bundle size tracking
 *   - Network request performance
 *   - Memory usage patterns
 *   - JavaScript execution time
 *   - Resource loading performance
 *
 * Performance Budgets:
 *   - LCP: < 2.5s (good), < 4s (needs improvement)
 *   - FID: < 100ms (good), < 300ms (needs improvement)
 *   - CLS: < 0.1 (good), < 0.25 (needs improvement)
 *   - TTFB: < 600ms (good), < 1800ms (needs improvement)
 */

import { getCLS, getFCP, getFID, getLCP, getTTFB, Metric, ReportCallback } from 'web-vitals';

// Inline analytics tracking function to avoid circular dependencies
const trackEvent = (eventName: string, properties: Record<string, any>) => {
  // PostHog tracking if available
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(eventName, properties);
  }

  // Console logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}:`, properties);
  }
};

/**
 * Performance metric thresholds for classification
 */
const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals thresholds (in milliseconds or score)
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 600, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 },

  // Custom application metrics
  apiResponseTime: { good: 200, needsImprovement: 500 },
  bundleSize: { good: 500000, needsImprovement: 1000000 }, // bytes
  memoryUsage: { good: 50, needsImprovement: 75 }, // MB
};

/**
 * Performance metric classification
 */
export type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Extended performance metric with additional context
 */
export interface PerformanceMetric extends Metric {
  rating: PerformanceRating;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  viewportSize?: {
    width: number;
    height: number;
  };
}

/**
 * Performance monitoring configuration
 */
interface PerformanceConfig {
  enableDetailedLogging?: boolean;
  enableRealTimeReporting?: boolean;
  sampleRate?: number; // 0-1, percentage of users to track
  customMetrics?: boolean;
  alertThreshold?: number; // Number of poor metrics before alerting
}

/**
 * Performance Monitoring Service
 *
 * Comprehensive performance tracking with Core Web Vitals,
 * custom metrics, and real-time reporting capabilities.
 */
class PerformanceMonitoringService {
  private config: PerformanceConfig;
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private observer: PerformanceObserver | null = null;
  private resourceTimingBuffer: PerformanceResourceTiming[] = [];
  private navigationStart: number = 0;

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enableDetailedLogging: process.env.NODE_ENV === 'development',
      enableRealTimeReporting: true,
      sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1, // 10% in prod, 100% in dev
      customMetrics: true,
      alertThreshold: 3,
      ...config
    };

    // Ensure we're in a browser environment
    if (typeof window !== 'undefined') {
      this.navigationStart = performance.timeOrigin || performance.timing.navigationStart;
    }
  }

  /**
   * Initialize performance monitoring
   */
  public init(): void {
    if (typeof window === 'undefined') return;

    // Check if user should be sampled
    if (Math.random() > this.config.sampleRate!) return;

    // Initialize Core Web Vitals monitoring
    this.initializeCoreWebVitals();

    // Initialize custom metrics
    if (this.config.customMetrics) {
      this.initializeCustomMetrics();
    }

    // Set up performance observer for detailed tracking
    this.setupPerformanceObserver();

    // Monitor memory usage
    this.monitorMemoryUsage();

    // Track navigation timing
    this.trackNavigationTiming();

    // Set up unload handler for final reporting
    this.setupUnloadHandler();
  }

  /**
   * Initialize Core Web Vitals tracking
   */
  private initializeCoreWebVitals(): void {
    const reportHandler = this.createReportHandler.bind(this);

    // Largest Contentful Paint
    getLCP(reportHandler);

    // First Input Delay
    getFID(reportHandler);

    // Cumulative Layout Shift
    getCLS(reportHandler);

    // First Contentful Paint
    getFCP(reportHandler);

    // Time to First Byte
    getTTFB(reportHandler);
  }

  /**
   * Create a report handler for web vitals
   */
  private createReportHandler(metric: Metric): void {
    const performanceMetric = this.enrichMetric(metric);

    // Store metric
    if (!this.metrics.has(metric.name)) {
      this.metrics.set(metric.name, []);
    }
    this.metrics.get(metric.name)!.push(performanceMetric);

    // Report to analytics
    if (this.config.enableRealTimeReporting) {
      this.reportMetric(performanceMetric);
    }

    // Log in development
    if (this.config.enableDetailedLogging) {
      this.logMetric(performanceMetric);
    }

    // Check for performance degradation
    this.checkPerformanceDegradation(performanceMetric);
  }

  /**
   * Enrich metric with additional context
   */
  private enrichMetric(metric: Metric): PerformanceMetric {
    const rating = this.classifyMetric(metric);

    return {
      ...metric,
      rating,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  /**
   * Classify metric performance
   */
  private classifyMetric(metric: Metric): PerformanceRating {
    const thresholds = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS];

    if (!thresholds) return 'good';

    if (metric.value <= thresholds.good) {
      return 'good';
    } else if (metric.value <= thresholds.needsImprovement) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  }

  /**
   * Get network connection type
   */
  private getConnectionType(): string | undefined {
    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    return connection?.effectiveType;
  }

  /**
   * Report metric to analytics
   */
  private reportMetric(metric: PerformanceMetric): void {
    trackEvent('performance_metric', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      metric_id: metric.id,
      page_url: metric.url,
      connection_type: metric.connectionType,
      device_memory: metric.deviceMemory,
      viewport_width: metric.viewportSize?.width,
      viewport_height: metric.viewportSize?.height,
      timestamp: metric.timestamp
    });
  }

  /**
   * Log metric for debugging
   */
  private logMetric(metric: PerformanceMetric): void {
    const emoji = metric.rating === 'good' ? '✅' :
                  metric.rating === 'needs-improvement' ? '⚠️' : '❌';

    console.group(`${emoji} Performance Metric: ${metric.name}`);
    console.log(`Value: ${metric.value}ms`);
    console.log(`Rating: ${metric.rating}`);
    console.log(`URL: ${metric.url}`);
    if (metric.connectionType) {
      console.log(`Connection: ${metric.connectionType}`);
    }
    console.groupEnd();
  }

  /**
   * Check for performance degradation and alert if necessary
   */
  private checkPerformanceDegradation(metric: PerformanceMetric): void {
    if (metric.rating === 'poor') {
      const poorMetrics = Array.from(this.metrics.values())
        .flat()
        .filter(m => m.rating === 'poor');

      if (poorMetrics.length >= this.config.alertThreshold!) {
        this.alertPerformanceIssue(poorMetrics);
      }
    }
  }

  /**
   * Alert about performance issues
   */
  private alertPerformanceIssue(poorMetrics: PerformanceMetric[]): void {
    trackEvent('performance_alert', {
      poor_metrics_count: poorMetrics.length,
      metrics: poorMetrics.map(m => ({
        name: m.name,
        value: m.value,
        timestamp: m.timestamp
      })),
      alert_timestamp: Date.now(),
      page_url: window.location.href
    });

    if (this.config.enableDetailedLogging) {
      console.error('Performance Alert: Multiple poor metrics detected', poorMetrics);
    }
  }

  /**
   * Initialize custom application metrics
   */
  private initializeCustomMetrics(): void {
    // Track long tasks
    this.trackLongTasks();

    // Track resource timing
    this.trackResourceTiming();

    // Track paint timing
    this.trackPaintTiming();

    // Track bundle size
    this.trackBundleSize();
  }

  /**
   * Set up performance observer for detailed tracking
   */
  private setupPerformanceObserver(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Observe long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Long task threshold
            this.reportLongTask(entry as PerformanceEntry);
          }
        }
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.resourceTimingBuffer.push(entry as PerformanceResourceTiming);
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });

    } catch (error) {
      console.error('Failed to set up performance observer:', error);
    }
  }

  /**
   * Track long JavaScript tasks
   */
  private trackLongTasks(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackEvent('long_task', {
            duration: entry.duration,
            start_time: entry.startTime,
            name: entry.name,
            page_url: window.location.href
          });
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      // Long task API might not be supported
    }
  }

  /**
   * Report long task
   */
  private reportLongTask(entry: PerformanceEntry): void {
    trackEvent('performance_long_task', {
      task_duration: entry.duration,
      task_start_time: entry.startTime,
      task_name: entry.name,
      page_url: window.location.href,
      timestamp: Date.now()
    });

    if (this.config.enableDetailedLogging) {
      console.warn(`Long task detected: ${entry.duration}ms`, entry);
    }
  }

  /**
   * Track resource timing
   */
  private trackResourceTiming(): void {
    if (!performance.getEntriesByType) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    // Group resources by type
    const resourceGroups = this.groupResourcesByType(resources);

    // Report resource metrics
    Object.entries(resourceGroups).forEach(([type, resources]) => {
      const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalDuration = resources.reduce((sum, r) => sum + r.duration, 0);
      const avgDuration = totalDuration / resources.length;

      trackEvent('resource_timing', {
        resource_type: type,
        resource_count: resources.length,
        total_size: totalSize,
        total_duration: totalDuration,
        avg_duration: avgDuration,
        page_url: window.location.href
      });
    });
  }

  /**
   * Group resources by type
   */
  private groupResourcesByType(resources: PerformanceResourceTiming[]): Record<string, PerformanceResourceTiming[]> {
    const groups: Record<string, PerformanceResourceTiming[]> = {};

    resources.forEach(resource => {
      const type = this.getResourceType(resource);
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(resource);
    });

    return groups;
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(resource: PerformanceResourceTiming): string {
    const url = resource.name.toLowerCase();

    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'stylesheet';
    if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') ||
        url.includes('.gif') || url.includes('.webp') || url.includes('.svg')) return 'image';
    if (url.includes('.woff') || url.includes('.ttf') || url.includes('.otf')) return 'font';
    if (url.includes('/api/') || url.includes('json')) return 'api';

    return 'other';
  }

  /**
   * Track paint timing
   */
  private trackPaintTiming(): void {
    if (!performance.getEntriesByType) return;

    const paintEntries = performance.getEntriesByType('paint');

    paintEntries.forEach(entry => {
      trackEvent('paint_timing', {
        paint_type: entry.name,
        paint_time: entry.startTime,
        page_url: window.location.href
      });
    });
  }

  /**
   * Track JavaScript bundle size
   */
  private trackBundleSize(): void {
    if (!performance.getEntriesByType) return;

    const scripts = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsFiles = scripts.filter(s => s.name.includes('.js'));

    const totalSize = jsFiles.reduce((sum, script) => sum + (script.transferSize || 0), 0);
    const totalDecodedSize = jsFiles.reduce((sum, script) => sum + (script.decodedBodySize || 0), 0);

    const bundleMetric: Metric = {
      name: 'bundleSize',
      value: totalSize,
      delta: totalSize,
      id: `bundle-${Date.now()}`,
      entries: []
    };

    const enrichedMetric = this.enrichMetric(bundleMetric);

    trackEvent('bundle_size', {
      total_size: totalSize,
      total_decoded_size: totalDecodedSize,
      script_count: jsFiles.length,
      rating: enrichedMetric.rating,
      page_url: window.location.href
    });
  }

  /**
   * Monitor memory usage
   */
  private monitorMemoryUsage(): void {
    if (!(performance as any).memory) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1048576;
      const totalMB = memory.totalJSHeapSize / 1048576;
      const limitMB = memory.jsHeapSizeLimit / 1048576;

      const usagePercentage = (usedMB / limitMB) * 100;

      trackEvent('memory_usage', {
        used_mb: usedMB,
        total_mb: totalMB,
        limit_mb: limitMB,
        usage_percentage: usagePercentage,
        page_url: window.location.href
      });

      // Alert if memory usage is high
      if (usagePercentage > 75) {
        trackEvent('high_memory_usage', {
          used_mb: usedMB,
          usage_percentage: usagePercentage,
          page_url: window.location.href
        });
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);

    // Initial check
    checkMemory();
  }

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(): void {
    if (!performance.timing) return;

    // Wait for page load to complete
    if (document.readyState === 'complete') {
      this.reportNavigationTiming();
    } else {
      window.addEventListener('load', () => {
        this.reportNavigationTiming();
      });
    }
  }

  /**
   * Report navigation timing metrics
   */
  private reportNavigationTiming(): void {
    const timing = performance.timing;

    const metrics = {
      dns_lookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcp_connection: timing.connectEnd - timing.connectStart,
      request_time: timing.responseStart - timing.requestStart,
      response_time: timing.responseEnd - timing.responseStart,
      dom_processing: timing.domComplete - timing.domLoading,
      dom_content_loaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
      load_complete: timing.loadEventEnd - timing.loadEventStart,
      total_page_load: timing.loadEventEnd - timing.navigationStart
    };

    trackEvent('navigation_timing', {
      ...metrics,
      page_url: window.location.href
    });
  }

  /**
   * Set up unload handler for final reporting
   */
  private setupUnloadHandler(): void {
    const reportFinalMetrics = () => {
      // Report accumulated metrics
      this.reportAccumulatedMetrics();

      // Report resource timing summary
      this.reportResourceTimingSummary();
    };

    // Use visibilitychange as more reliable than unload
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportFinalMetrics();
      }
    });
  }

  /**
   * Report accumulated metrics
   */
  private reportAccumulatedMetrics(): void {
    const summary: Record<string, any> = {};

    this.metrics.forEach((metrics, name) => {
      const values = metrics.map(m => m.value);
      summary[name] = {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        poor_count: metrics.filter(m => m.rating === 'poor').length
      };
    });

    trackEvent('performance_session_summary', {
      metrics_summary: summary,
      session_duration: Date.now() - this.navigationStart,
      page_url: window.location.href
    });
  }

  /**
   * Report resource timing summary
   */
  private reportResourceTimingSummary(): void {
    if (this.resourceTimingBuffer.length === 0) return;

    const summary = this.groupResourcesByType(this.resourceTimingBuffer);

    Object.entries(summary).forEach(([type, resources]) => {
      trackEvent('resource_timing_summary', {
        resource_type: type,
        resource_count: resources.length,
        total_size: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        avg_duration: resources.reduce((sum, r) => sum + r.duration, 0) / resources.length,
        page_url: window.location.href
      });
    });
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): Map<string, PerformanceMetric[]> {
    return this.metrics;
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): Record<string, any> {
    const summary: Record<string, any> = {};

    this.metrics.forEach((metrics, name) => {
      if (metrics.length === 0) return;

      const latestMetric = metrics[metrics.length - 1];
      summary[name] = {
        value: latestMetric.value,
        rating: latestMetric.rating,
        timestamp: latestMetric.timestamp
      };
    });

    return summary;
  }

  /**
   * Clear metrics
   */
  public clearMetrics(): void {
    this.metrics.clear();
    this.resourceTimingBuffer = [];
  }
}

// Create singleton instance
export const performanceMonitoring = new PerformanceMonitoringService();

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  // Initialize on page load or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceMonitoring.init();
    });
  } else {
    performanceMonitoring.init();
  }
}

/**
 * Export convenience functions
 */
export const initPerformanceMonitoring = () => performanceMonitoring.init();
export const getPerformanceMetrics = () => performanceMonitoring.getMetrics();
export const getPerformanceSummary = () => performanceMonitoring.getPerformanceSummary();