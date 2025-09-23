/**
 * Client-side performance monitoring for aclue frontend
 */

interface PerformanceMetrics {
  pageLoadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
}

interface ErrorMetrics {
  errorCount: number
  errorTypes: Record<string, number>
  lastError?: {
    message: string
    stack?: string
    timestamp: number
  }
}

class AclueMonitoring {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    timeToInteractive: 0
  }

  private errors: ErrorMetrics = {
    errorCount: 0,
    errorTypes: {}
  }

  private apiCalls = new Map<string, {
    count: number
    totalDuration: number
    errors: number
  }>()

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializePerformanceObserver()
      this.initializeErrorTracking()
      this.initializeAPITracking()
    }
  }

  private initializePerformanceObserver() {
    // Track page load metrics
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing
      this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart
    }

    // Track Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntriesByName('first-contentful-paint')
          if (entries.length > 0) {
            this.metrics.firstContentfulPaint = entries[0].startTime
          }
        })
        fcpObserver.observe({ entryTypes: ['paint'] })
      } catch (e) {
        console.warn('FCP observer not supported')
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1]
            this.metrics.largestContentfulPaint = lastEntry.startTime
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP observer not supported')
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          if (entries.length > 0) {
            this.metrics.firstInputDelay = entries[0].processingStart - entries[0].startTime
          }
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.warn('FID observer not supported')
      }

      // Cumulative Layout Shift
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
              this.metrics.cumulativeLayoutShift = clsValue
            }
          }
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS observer not supported')
      }
    }
  }

  private initializeErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.errors.errorCount++
      const errorType = event.error?.name || 'Unknown'
      this.errors.errorTypes[errorType] = (this.errors.errorTypes[errorType] || 0) + 1
      this.errors.lastError = {
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now()
      }

      // Send error to monitoring endpoint
      this.sendMetrics({
        type: 'error',
        error: {
          message: event.message,
          stack: event.error?.stack,
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      })
    })

    // Track promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.errors.errorCount++
      this.errors.errorTypes['UnhandledPromiseRejection'] =
        (this.errors.errorTypes['UnhandledPromiseRejection'] || 0) + 1

      this.sendMetrics({
        type: 'error',
        error: {
          message: event.reason?.message || String(event.reason),
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      })
    })
  }

  private initializeAPITracking() {
    // Intercept fetch calls
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      const url = args[0] as string

      try {
        const response = await originalFetch(...args)
        const duration = performance.now() - startTime

        this.trackAPICall(url, duration, response.ok)

        return response
      } catch (error) {
        const duration = performance.now() - startTime
        this.trackAPICall(url, duration, false)
        throw error
      }
    }
  }

  private trackAPICall(url: string, duration: number, success: boolean) {
    // Parse URL to get endpoint
    try {
      const urlObj = new URL(url, window.location.origin)
      const endpoint = urlObj.pathname

      if (!this.apiCalls.has(endpoint)) {
        this.apiCalls.set(endpoint, {
          count: 0,
          totalDuration: 0,
          errors: 0
        })
      }

      const stats = this.apiCalls.get(endpoint)!
      stats.count++
      stats.totalDuration += duration
      if (!success) {
        stats.errors++
      }
    } catch (e) {
      // Invalid URL, skip tracking
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  public getErrors(): ErrorMetrics {
    return { ...this.errors }
  }

  public getAPIMetrics() {
    const metrics: Record<string, any> = {}
    this.apiCalls.forEach((stats, endpoint) => {
      metrics[endpoint] = {
        count: stats.count,
        averageDuration: stats.totalDuration / stats.count,
        errorRate: stats.errors / stats.count
      }
    })
    return metrics
  }

  private async sendMetrics(data: any) {
    try {
      // Send to monitoring endpoint
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          timestamp: Date.now(),
          sessionId: this.getSessionId(),
          page: window.location.pathname
        })
      })
    } catch (error) {
      // Silently fail - don't want monitoring to break the app
      console.debug('Failed to send metrics:', error)
    }
  }

  private getSessionId(): string {
    // Get or create session ID
    let sessionId = sessionStorage.getItem('aclue_session_id')
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('aclue_session_id', sessionId)
    }
    return sessionId
  }

  public reportPageView() {
    this.sendMetrics({
      type: 'pageview',
      metrics: this.getMetrics(),
      api: this.getAPIMetrics()
    })
  }

  public reportCustomMetric(name: string, value: number, metadata?: any) {
    this.sendMetrics({
      type: 'custom',
      name,
      value,
      metadata
    })
  }
}

// Export singleton instance
export const monitoring = new AclueMonitoring()

// Auto-report page views
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      monitoring.reportPageView()
    }, 2000) // Wait for all metrics to be collected
  })
}