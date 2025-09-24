/**
 * Performance monitoring for aclue frontend
 * Tracks Core Web Vitals and custom metrics
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals'

// Performance metrics storage
interface PerformanceMetrics {
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
  inp?: number // Interaction to Next Paint
  customMetrics: Record<string, number>
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    customMetrics: {}
  }

  private metricsEndpoint = '/api/metrics'
  private batchSize = 10
  private flushInterval = 30000 // 30 seconds
  private metricsBuffer: any[] = []
  private flushTimer: NodeJS.Timeout | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWebVitals()
      this.initializeCustomMetrics()
      this.startFlushTimer()
    }
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  private initializeWebVitals() {
    // Largest Contentful Paint
    onLCP((metric) => {
      this.metrics.lcp = metric.value
      this.recordMetric('web_vitals_lcp', metric.value / 1000, {
        rating: metric.rating
      })
    })

    // First Input Delay
    onFID((metric) => {
      this.metrics.fid = metric.value
      this.recordMetric('web_vitals_fid', metric.value, {
        rating: metric.rating
      })
    })

    // Cumulative Layout Shift
    onCLS((metric) => {
      this.metrics.cls = metric.value
      this.recordMetric('web_vitals_cls', metric.value, {
        rating: metric.rating
      })
    })

    // First Contentful Paint
    onFCP((metric) => {
      this.metrics.fcp = metric.value
      this.recordMetric('web_vitals_fcp', metric.value / 1000, {
        rating: metric.rating
      })
    })

    // Time to First Byte
    onTTFB((metric) => {
      this.metrics.ttfb = metric.value
      this.recordMetric('web_vitals_ttfb', metric.value / 1000, {
        rating: metric.rating
      })
    })

    // Interaction to Next Paint
    onINP((metric) => {
      this.metrics.inp = metric.value
      this.recordMetric('web_vitals_inp', metric.value, {
        rating: metric.rating
      })
    })
  }

  /**
   * Initialize custom application metrics
   */
  private initializeCustomMetrics() {
    // Track page navigation timing
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      if (navigation) {
        // DNS lookup time
        this.recordMetric('navigation_dns_time',
          navigation.domainLookupEnd - navigation.domainLookupStart)

        // TCP connection time
        this.recordMetric('navigation_tcp_time',
          navigation.connectEnd - navigation.connectStart)

        // Request time
        this.recordMetric('navigation_request_time',
          navigation.responseStart - navigation.requestStart)

        // Response time
        this.recordMetric('navigation_response_time',
          navigation.responseEnd - navigation.responseStart)

        // DOM processing time
        this.recordMetric('navigation_dom_processing_time',
          navigation.domComplete - navigation.domInteractive)

        // Page load time
        this.recordMetric('navigation_page_load_time',
          navigation.loadEventEnd - navigation.loadEventStart)
      }
    }

    // Track resource loading
    this.trackResourceTiming()

    // Track JavaScript errors
    this.trackJavaScriptErrors()

    // Track long tasks
    this.trackLongTasks()
  }

  /**
   * Track resource loading performance
   */
  private trackResourceTiming() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming

          // Group resources by type
          const resourceType = this.getResourceType(resourceEntry.name)

          this.recordMetric('resource_load_time', resourceEntry.duration, {
            type: resourceType,
            name: resourceEntry.name.substring(0, 100) // Truncate long URLs
          })

          // Track slow resources
          if (resourceEntry.duration > 1000) {
            this.recordMetric('slow_resource_count', 1, {
              type: resourceType,
              duration: Math.round(resourceEntry.duration)
            })
          }
        }
      })

      try {
        observer.observe({ entryTypes: ['resource'] })
      } catch (e) {
        console.warn('Resource timing observer not supported', e)
      }
    }
  }

  /**
   * Track JavaScript errors
   */
  private trackJavaScriptErrors() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.recordMetric('javascript_errors_total', 1, {
          message: event.message?.substring(0, 100),
          source: event.filename?.substring(0, 100),
          line: event.lineno,
          column: event.colno
        })
      })

      window.addEventListener('unhandledrejection', (event) => {
        this.recordMetric('unhandled_promise_rejections_total', 1, {
          reason: String(event.reason).substring(0, 100)
        })
      })
    }
  }

  /**
   * Track long tasks that block the main thread
   */
  private trackLongTasks() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('long_task_duration', entry.duration, {
              name: entry.name
            })

            // Track tasks over 50ms (Chrome's threshold)
            if (entry.duration > 50) {
              this.recordMetric('long_tasks_count', 1, {
                duration_bucket: this.getDurationBucket(entry.duration)
              })
            }
          }
        })

        observer.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        console.warn('Long task observer not supported', e)
      }
    }
  }

  /**
   * Record a custom metric
   */
  public recordMetric(name: string, value: number, labels?: Record<string, any>) {
    const metric = {
      name,
      value,
      labels: {
        ...labels,
        page: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        timestamp: Date.now()
      }
    }

    this.metricsBuffer.push(metric)

    // Flush if buffer is full
    if (this.metricsBuffer.length >= this.batchSize) {
      this.flush()
    }
  }

  /**
   * Track user interactions
   */
  public trackInteraction(action: string, category: string, value?: number) {
    this.recordMetric('user_interactions_total', 1, {
      action,
      category,
      value
    })
  }

  /**
   * Track API calls
   */
  public trackApiCall(endpoint: string, method: string, duration: number, status: number) {
    this.recordMetric('api_call_duration', duration, {
      endpoint,
      method,
      status: String(status)
    })

    // Track errors separately
    if (status >= 400) {
      this.recordMetric('api_errors_total', 1, {
        endpoint,
        method,
        status: String(status)
      })
    }
  }

  /**
   * Track newsletter subscriptions
   */
  public trackNewsletterSubscription(success: boolean) {
    this.recordMetric('newsletter_subscriptions_frontend', 1, {
      status: success ? 'success' : 'failure'
    })
  }

  /**
   * Track product recommendations
   */
  public trackProductRecommendation(action: 'view' | 'click', productId: string) {
    this.recordMetric(`product_recommendations_${action}s_frontend`, 1, {
      product_id: productId
    })
  }

  /**
   * Flush metrics to backend
   */
  private async flush() {
    if (this.metricsBuffer.length === 0) return

    const metricsToSend = [...this.metricsBuffer]
    this.metricsBuffer = []

    try {
      await fetch(this.metricsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metrics: metricsToSend,
          session: this.getSessionInfo()
        })
      })
    } catch (error) {
      console.error('Failed to send metrics', error)
      // Put metrics back in buffer for retry
      this.metricsBuffer.unshift(...metricsToSend)
    }
  }

  /**
   * Start periodic flush timer
   */
  private startFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.flushInterval)

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush()
      })

      // Also flush on visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.flush()
        }
      })
    }
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script'
    if (url.includes('.css')) return 'stylesheet'
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.gif') || url.includes('.webp')) return 'image'
    if (url.includes('.woff') || url.includes('.ttf')) return 'font'
    if (url.includes('/api/')) return 'api'
    return 'other'
  }

  /**
   * Get duration bucket for categorization
   */
  private getDurationBucket(duration: number): string {
    if (duration < 100) return '50-100ms'
    if (duration < 250) return '100-250ms'
    if (duration < 500) return '250-500ms'
    if (duration < 1000) return '500-1000ms'
    return '1000ms+'
  }

  /**
   * Get session information
   */
  private getSessionInfo() {
    return {
      sessionId: this.getOrCreateSessionId(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      screenResolution: typeof window !== 'undefined' ?
        `${window.screen.width}x${window.screen.height}` : 'unknown',
      viewport: typeof window !== 'undefined' ?
        `${window.innerWidth}x${window.innerHeight}` : 'unknown',
      connection: this.getConnectionInfo()
    }
  }

  /**
   * Get or create session ID
   */
  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server'

    let sessionId = sessionStorage.getItem('aclue_session_id')
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('aclue_session_id', sessionId)
    }
    return sessionId
  }

  /**
   * Get connection information
   */
  private getConnectionInfo() {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as any).connection
      return {
        effectiveType: conn?.effectiveType,
        rtt: conn?.rtt,
        downlink: conn?.downlink,
        saveData: conn?.saveData
      }
    }
    return null
  }

  /**
   * Get current metrics snapshot
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Clear metrics
   */
  public clearMetrics() {
    this.metrics = {
      customMetrics: {}
    }
    this.metricsBuffer = []
  }

  /**
   * Destroy monitor and clean up
   */
  public destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
    this.flush()
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Export types and utilities
export type { PerformanceMetrics }

// Export convenience functions
export const trackInteraction = (action: string, category: string, value?: number) =>
  performanceMonitor.trackInteraction(action, category, value)

export const trackApiCall = (endpoint: string, method: string, duration: number, status: number) =>
  performanceMonitor.trackApiCall(endpoint, method, duration, status)

export const trackNewsletterSubscription = (success: boolean) =>
  performanceMonitor.trackNewsletterSubscription(success)

export const trackProductRecommendation = (action: 'view' | 'click', productId: string) =>
  performanceMonitor.trackProductRecommendation(action, productId)

export const recordMetric = (name: string, value: number, labels?: Record<string, any>) =>
  performanceMonitor.recordMetric(name, value, labels)
