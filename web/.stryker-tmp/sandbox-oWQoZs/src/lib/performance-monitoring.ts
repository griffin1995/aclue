/**
 * aclue Performance Monitoring Service
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
import { getCLS, getFCP, getFID, getLCP, getTTFB, Metric, ReportCallback } from 'web-vitals';

// Inline analytics tracking function to avoid circular dependencies
const trackEvent = (eventName: string, properties: Record<string, any>) => {
  if (stryMutAct_9fa48("11017")) {
    {}
  } else {
    stryCov_9fa48("11017");
    // PostHog tracking if available
    if (stryMutAct_9fa48("11020") ? typeof window !== 'undefined' || (window as any).posthog : stryMutAct_9fa48("11019") ? false : stryMutAct_9fa48("11018") ? true : (stryCov_9fa48("11018", "11019", "11020"), (stryMutAct_9fa48("11022") ? typeof window === 'undefined' : stryMutAct_9fa48("11021") ? true : (stryCov_9fa48("11021", "11022"), typeof window !== (stryMutAct_9fa48("11023") ? "" : (stryCov_9fa48("11023"), 'undefined')))) && (window as any).posthog)) {
      if (stryMutAct_9fa48("11024")) {
        {}
      } else {
        stryCov_9fa48("11024");
        (window as any).posthog.capture(eventName, properties);
      }
    }

    // Console logging in development
    if (stryMutAct_9fa48("11027") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("11026") ? false : stryMutAct_9fa48("11025") ? true : (stryCov_9fa48("11025", "11026", "11027"), process.env.NODE_ENV === (stryMutAct_9fa48("11028") ? "" : (stryCov_9fa48("11028"), 'development')))) {
      if (stryMutAct_9fa48("11029")) {
        {}
      } else {
        stryCov_9fa48("11029");
        console.log(stryMutAct_9fa48("11030") ? `` : (stryCov_9fa48("11030"), `[Analytics] ${eventName}:`), properties);
      }
    }
  }
};

/**
 * Performance metric thresholds for classification
 */
const PERFORMANCE_THRESHOLDS = stryMutAct_9fa48("11031") ? {} : (stryCov_9fa48("11031"), {
  // Core Web Vitals thresholds (in milliseconds or score)
  LCP: stryMutAct_9fa48("11032") ? {} : (stryCov_9fa48("11032"), {
    good: 2500,
    needsImprovement: 4000
  }),
  FID: stryMutAct_9fa48("11033") ? {} : (stryCov_9fa48("11033"), {
    good: 100,
    needsImprovement: 300
  }),
  CLS: stryMutAct_9fa48("11034") ? {} : (stryCov_9fa48("11034"), {
    good: 0.1,
    needsImprovement: 0.25
  }),
  FCP: stryMutAct_9fa48("11035") ? {} : (stryCov_9fa48("11035"), {
    good: 1800,
    needsImprovement: 3000
  }),
  TTFB: stryMutAct_9fa48("11036") ? {} : (stryCov_9fa48("11036"), {
    good: 600,
    needsImprovement: 1800
  }),
  INP: stryMutAct_9fa48("11037") ? {} : (stryCov_9fa48("11037"), {
    good: 200,
    needsImprovement: 500
  }),
  // Custom application metrics
  apiResponseTime: stryMutAct_9fa48("11038") ? {} : (stryCov_9fa48("11038"), {
    good: 200,
    needsImprovement: 500
  }),
  bundleSize: stryMutAct_9fa48("11039") ? {} : (stryCov_9fa48("11039"), {
    good: 500000,
    needsImprovement: 1000000
  }),
  // bytes
  memoryUsage: stryMutAct_9fa48("11040") ? {} : (stryCov_9fa48("11040"), {
    good: 50,
    needsImprovement: 75
  }) // MB
});

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
  private resourceTimingBuffer: PerformanceResourceTiming[] = stryMutAct_9fa48("11041") ? ["Stryker was here"] : (stryCov_9fa48("11041"), []);
  private navigationStart: number = 0;
  constructor(config: PerformanceConfig = {}) {
    if (stryMutAct_9fa48("11042")) {
      {}
    } else {
      stryCov_9fa48("11042");
      this.config = stryMutAct_9fa48("11043") ? {} : (stryCov_9fa48("11043"), {
        enableDetailedLogging: stryMutAct_9fa48("11046") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("11045") ? false : stryMutAct_9fa48("11044") ? true : (stryCov_9fa48("11044", "11045", "11046"), process.env.NODE_ENV === (stryMutAct_9fa48("11047") ? "" : (stryCov_9fa48("11047"), 'development'))),
        enableRealTimeReporting: stryMutAct_9fa48("11048") ? false : (stryCov_9fa48("11048"), true),
        sampleRate: (stryMutAct_9fa48("11051") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("11050") ? false : stryMutAct_9fa48("11049") ? true : (stryCov_9fa48("11049", "11050", "11051"), process.env.NODE_ENV === (stryMutAct_9fa48("11052") ? "" : (stryCov_9fa48("11052"), 'production')))) ? 0.1 : 1,
        // 10% in prod, 100% in dev
        customMetrics: stryMutAct_9fa48("11053") ? false : (stryCov_9fa48("11053"), true),
        alertThreshold: 3,
        ...config
      });

      // Ensure we're in a browser environment
      if (stryMutAct_9fa48("11056") ? typeof window === 'undefined' : stryMutAct_9fa48("11055") ? false : stryMutAct_9fa48("11054") ? true : (stryCov_9fa48("11054", "11055", "11056"), typeof window !== (stryMutAct_9fa48("11057") ? "" : (stryCov_9fa48("11057"), 'undefined')))) {
        if (stryMutAct_9fa48("11058")) {
          {}
        } else {
          stryCov_9fa48("11058");
          this.navigationStart = stryMutAct_9fa48("11061") ? performance.timeOrigin && performance.timing.navigationStart : stryMutAct_9fa48("11060") ? false : stryMutAct_9fa48("11059") ? true : (stryCov_9fa48("11059", "11060", "11061"), performance.timeOrigin || performance.timing.navigationStart);
        }
      }
    }
  }

  /**
   * Initialize performance monitoring
   */
  public init(): void {
    if (stryMutAct_9fa48("11062")) {
      {}
    } else {
      stryCov_9fa48("11062");
      if (stryMutAct_9fa48("11065") ? typeof window !== 'undefined' : stryMutAct_9fa48("11064") ? false : stryMutAct_9fa48("11063") ? true : (stryCov_9fa48("11063", "11064", "11065"), typeof window === (stryMutAct_9fa48("11066") ? "" : (stryCov_9fa48("11066"), 'undefined')))) return;

      // Check if user should be sampled
      if (stryMutAct_9fa48("11070") ? Math.random() <= this.config.sampleRate! : stryMutAct_9fa48("11069") ? Math.random() >= this.config.sampleRate! : stryMutAct_9fa48("11068") ? false : stryMutAct_9fa48("11067") ? true : (stryCov_9fa48("11067", "11068", "11069", "11070"), Math.random() > this.config.sampleRate!)) return;

      // Initialize Core Web Vitals monitoring
      this.initializeCoreWebVitals();

      // Initialize custom metrics
      if (stryMutAct_9fa48("11072") ? false : stryMutAct_9fa48("11071") ? true : (stryCov_9fa48("11071", "11072"), this.config.customMetrics)) {
        if (stryMutAct_9fa48("11073")) {
          {}
        } else {
          stryCov_9fa48("11073");
          this.initializeCustomMetrics();
        }
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
  }

  /**
   * Initialize Core Web Vitals tracking
   */
  private initializeCoreWebVitals(): void {
    if (stryMutAct_9fa48("11074")) {
      {}
    } else {
      stryCov_9fa48("11074");
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
  }

  /**
   * Create a report handler for web vitals
   */
  private createReportHandler(metric: Metric): void {
    if (stryMutAct_9fa48("11075")) {
      {}
    } else {
      stryCov_9fa48("11075");
      const performanceMetric = this.enrichMetric(metric);

      // Store metric
      if (stryMutAct_9fa48("11078") ? false : stryMutAct_9fa48("11077") ? true : stryMutAct_9fa48("11076") ? this.metrics.has(metric.name) : (stryCov_9fa48("11076", "11077", "11078"), !this.metrics.has(metric.name))) {
        if (stryMutAct_9fa48("11079")) {
          {}
        } else {
          stryCov_9fa48("11079");
          this.metrics.set(metric.name, stryMutAct_9fa48("11080") ? ["Stryker was here"] : (stryCov_9fa48("11080"), []));
        }
      }
      this.metrics.get(metric.name)!.push(performanceMetric);

      // Report to analytics
      if (stryMutAct_9fa48("11082") ? false : stryMutAct_9fa48("11081") ? true : (stryCov_9fa48("11081", "11082"), this.config.enableRealTimeReporting)) {
        if (stryMutAct_9fa48("11083")) {
          {}
        } else {
          stryCov_9fa48("11083");
          this.reportMetric(performanceMetric);
        }
      }

      // Log in development
      if (stryMutAct_9fa48("11085") ? false : stryMutAct_9fa48("11084") ? true : (stryCov_9fa48("11084", "11085"), this.config.enableDetailedLogging)) {
        if (stryMutAct_9fa48("11086")) {
          {}
        } else {
          stryCov_9fa48("11086");
          this.logMetric(performanceMetric);
        }
      }

      // Check for performance degradation
      this.checkPerformanceDegradation(performanceMetric);
    }
  }

  /**
   * Enrich metric with additional context
   */
  private enrichMetric(metric: Metric): PerformanceMetric {
    if (stryMutAct_9fa48("11087")) {
      {}
    } else {
      stryCov_9fa48("11087");
      const rating = this.classifyMetric(metric);
      return stryMutAct_9fa48("11088") ? {} : (stryCov_9fa48("11088"), {
        ...metric,
        rating,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connectionType: this.getConnectionType(),
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        viewportSize: stryMutAct_9fa48("11089") ? {} : (stryCov_9fa48("11089"), {
          width: window.innerWidth,
          height: window.innerHeight
        })
      });
    }
  }

  /**
   * Classify metric performance
   */
  private classifyMetric(metric: Metric): PerformanceRating {
    if (stryMutAct_9fa48("11090")) {
      {}
    } else {
      stryCov_9fa48("11090");
      const thresholds = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS];
      if (stryMutAct_9fa48("11093") ? false : stryMutAct_9fa48("11092") ? true : stryMutAct_9fa48("11091") ? thresholds : (stryCov_9fa48("11091", "11092", "11093"), !thresholds)) return stryMutAct_9fa48("11094") ? "" : (stryCov_9fa48("11094"), 'good');
      if (stryMutAct_9fa48("11098") ? metric.value > thresholds.good : stryMutAct_9fa48("11097") ? metric.value < thresholds.good : stryMutAct_9fa48("11096") ? false : stryMutAct_9fa48("11095") ? true : (stryCov_9fa48("11095", "11096", "11097", "11098"), metric.value <= thresholds.good)) {
        if (stryMutAct_9fa48("11099")) {
          {}
        } else {
          stryCov_9fa48("11099");
          return stryMutAct_9fa48("11100") ? "" : (stryCov_9fa48("11100"), 'good');
        }
      } else if (stryMutAct_9fa48("11104") ? metric.value > thresholds.needsImprovement : stryMutAct_9fa48("11103") ? metric.value < thresholds.needsImprovement : stryMutAct_9fa48("11102") ? false : stryMutAct_9fa48("11101") ? true : (stryCov_9fa48("11101", "11102", "11103", "11104"), metric.value <= thresholds.needsImprovement)) {
        if (stryMutAct_9fa48("11105")) {
          {}
        } else {
          stryCov_9fa48("11105");
          return stryMutAct_9fa48("11106") ? "" : (stryCov_9fa48("11106"), 'needs-improvement');
        }
      } else {
        if (stryMutAct_9fa48("11107")) {
          {}
        } else {
          stryCov_9fa48("11107");
          return stryMutAct_9fa48("11108") ? "" : (stryCov_9fa48("11108"), 'poor');
        }
      }
    }
  }

  /**
   * Get network connection type
   */
  private getConnectionType(): string | undefined {
    if (stryMutAct_9fa48("11109")) {
      {}
    } else {
      stryCov_9fa48("11109");
      const connection = stryMutAct_9fa48("11112") ? ((navigator as any).connection || (navigator as any).mozConnection) && (navigator as any).webkitConnection : stryMutAct_9fa48("11111") ? false : stryMutAct_9fa48("11110") ? true : (stryCov_9fa48("11110", "11111", "11112"), (stryMutAct_9fa48("11114") ? (navigator as any).connection && (navigator as any).mozConnection : stryMutAct_9fa48("11113") ? false : (stryCov_9fa48("11113", "11114"), (navigator as any).connection || (navigator as any).mozConnection)) || (navigator as any).webkitConnection);
      return stryMutAct_9fa48("11115") ? connection.effectiveType : (stryCov_9fa48("11115"), connection?.effectiveType);
    }
  }

  /**
   * Report metric to analytics
   */
  private reportMetric(metric: PerformanceMetric): void {
    if (stryMutAct_9fa48("11116")) {
      {}
    } else {
      stryCov_9fa48("11116");
      trackEvent(stryMutAct_9fa48("11117") ? "" : (stryCov_9fa48("11117"), 'performance_metric'), stryMutAct_9fa48("11118") ? {} : (stryCov_9fa48("11118"), {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_id: metric.id,
        page_url: metric.url,
        connection_type: metric.connectionType,
        device_memory: metric.deviceMemory,
        viewport_width: stryMutAct_9fa48("11119") ? metric.viewportSize.width : (stryCov_9fa48("11119"), metric.viewportSize?.width),
        viewport_height: stryMutAct_9fa48("11120") ? metric.viewportSize.height : (stryCov_9fa48("11120"), metric.viewportSize?.height),
        timestamp: metric.timestamp
      }));
    }
  }

  /**
   * Log metric for debugging
   */
  private logMetric(metric: PerformanceMetric): void {
    if (stryMutAct_9fa48("11121")) {
      {}
    } else {
      stryCov_9fa48("11121");
      const emoji = (stryMutAct_9fa48("11124") ? metric.rating !== 'good' : stryMutAct_9fa48("11123") ? false : stryMutAct_9fa48("11122") ? true : (stryCov_9fa48("11122", "11123", "11124"), metric.rating === (stryMutAct_9fa48("11125") ? "" : (stryCov_9fa48("11125"), 'good')))) ? stryMutAct_9fa48("11126") ? "" : (stryCov_9fa48("11126"), '✅') : (stryMutAct_9fa48("11129") ? metric.rating !== 'needs-improvement' : stryMutAct_9fa48("11128") ? false : stryMutAct_9fa48("11127") ? true : (stryCov_9fa48("11127", "11128", "11129"), metric.rating === (stryMutAct_9fa48("11130") ? "" : (stryCov_9fa48("11130"), 'needs-improvement')))) ? stryMutAct_9fa48("11131") ? "" : (stryCov_9fa48("11131"), '⚠️') : stryMutAct_9fa48("11132") ? "" : (stryCov_9fa48("11132"), '❌');
      console.group(stryMutAct_9fa48("11133") ? `` : (stryCov_9fa48("11133"), `${emoji} Performance Metric: ${metric.name}`));
      console.log(stryMutAct_9fa48("11134") ? `` : (stryCov_9fa48("11134"), `Value: ${metric.value}ms`));
      console.log(stryMutAct_9fa48("11135") ? `` : (stryCov_9fa48("11135"), `Rating: ${metric.rating}`));
      console.log(stryMutAct_9fa48("11136") ? `` : (stryCov_9fa48("11136"), `URL: ${metric.url}`));
      if (stryMutAct_9fa48("11138") ? false : stryMutAct_9fa48("11137") ? true : (stryCov_9fa48("11137", "11138"), metric.connectionType)) {
        if (stryMutAct_9fa48("11139")) {
          {}
        } else {
          stryCov_9fa48("11139");
          console.log(stryMutAct_9fa48("11140") ? `` : (stryCov_9fa48("11140"), `Connection: ${metric.connectionType}`));
        }
      }
      console.groupEnd();
    }
  }

  /**
   * Check for performance degradation and alert if necessary
   */
  private checkPerformanceDegradation(metric: PerformanceMetric): void {
    if (stryMutAct_9fa48("11141")) {
      {}
    } else {
      stryCov_9fa48("11141");
      if (stryMutAct_9fa48("11144") ? metric.rating !== 'poor' : stryMutAct_9fa48("11143") ? false : stryMutAct_9fa48("11142") ? true : (stryCov_9fa48("11142", "11143", "11144"), metric.rating === (stryMutAct_9fa48("11145") ? "" : (stryCov_9fa48("11145"), 'poor')))) {
        if (stryMutAct_9fa48("11146")) {
          {}
        } else {
          stryCov_9fa48("11146");
          const poorMetrics = stryMutAct_9fa48("11147") ? Array.from(this.metrics.values()).flat() : (stryCov_9fa48("11147"), Array.from(this.metrics.values()).flat().filter(stryMutAct_9fa48("11148") ? () => undefined : (stryCov_9fa48("11148"), m => stryMutAct_9fa48("11151") ? m.rating !== 'poor' : stryMutAct_9fa48("11150") ? false : stryMutAct_9fa48("11149") ? true : (stryCov_9fa48("11149", "11150", "11151"), m.rating === (stryMutAct_9fa48("11152") ? "" : (stryCov_9fa48("11152"), 'poor'))))));
          if (stryMutAct_9fa48("11156") ? poorMetrics.length < this.config.alertThreshold! : stryMutAct_9fa48("11155") ? poorMetrics.length > this.config.alertThreshold! : stryMutAct_9fa48("11154") ? false : stryMutAct_9fa48("11153") ? true : (stryCov_9fa48("11153", "11154", "11155", "11156"), poorMetrics.length >= this.config.alertThreshold!)) {
            if (stryMutAct_9fa48("11157")) {
              {}
            } else {
              stryCov_9fa48("11157");
              this.alertPerformanceIssue(poorMetrics);
            }
          }
        }
      }
    }
  }

  /**
   * Alert about performance issues
   */
  private alertPerformanceIssue(poorMetrics: PerformanceMetric[]): void {
    if (stryMutAct_9fa48("11158")) {
      {}
    } else {
      stryCov_9fa48("11158");
      trackEvent(stryMutAct_9fa48("11159") ? "" : (stryCov_9fa48("11159"), 'performance_alert'), stryMutAct_9fa48("11160") ? {} : (stryCov_9fa48("11160"), {
        poor_metrics_count: poorMetrics.length,
        metrics: poorMetrics.map(stryMutAct_9fa48("11161") ? () => undefined : (stryCov_9fa48("11161"), m => stryMutAct_9fa48("11162") ? {} : (stryCov_9fa48("11162"), {
          name: m.name,
          value: m.value,
          timestamp: m.timestamp
        }))),
        alert_timestamp: Date.now(),
        page_url: window.location.href
      }));
      if (stryMutAct_9fa48("11164") ? false : stryMutAct_9fa48("11163") ? true : (stryCov_9fa48("11163", "11164"), this.config.enableDetailedLogging)) {
        if (stryMutAct_9fa48("11165")) {
          {}
        } else {
          stryCov_9fa48("11165");
          console.error(stryMutAct_9fa48("11166") ? "" : (stryCov_9fa48("11166"), 'Performance Alert: Multiple poor metrics detected'), poorMetrics);
        }
      }
    }
  }

  /**
   * Initialize custom application metrics
   */
  private initializeCustomMetrics(): void {
    if (stryMutAct_9fa48("11167")) {
      {}
    } else {
      stryCov_9fa48("11167");
      // Track long tasks
      this.trackLongTasks();

      // Track resource timing
      this.trackResourceTiming();

      // Track paint timing
      this.trackPaintTiming();

      // Track bundle size
      this.trackBundleSize();
    }
  }

  /**
   * Set up performance observer for detailed tracking
   */
  private setupPerformanceObserver(): void {
    if (stryMutAct_9fa48("11168")) {
      {}
    } else {
      stryCov_9fa48("11168");
      if (stryMutAct_9fa48("11171") ? false : stryMutAct_9fa48("11170") ? true : stryMutAct_9fa48("11169") ? 'PerformanceObserver' in window : (stryCov_9fa48("11169", "11170", "11171"), !((stryMutAct_9fa48("11172") ? "" : (stryCov_9fa48("11172"), 'PerformanceObserver')) in window))) return;
      try {
        if (stryMutAct_9fa48("11173")) {
          {}
        } else {
          stryCov_9fa48("11173");
          // Observe long tasks
          const longTaskObserver = new PerformanceObserver(list => {
            if (stryMutAct_9fa48("11174")) {
              {}
            } else {
              stryCov_9fa48("11174");
              for (const entry of list.getEntries()) {
                if (stryMutAct_9fa48("11175")) {
                  {}
                } else {
                  stryCov_9fa48("11175");
                  if (stryMutAct_9fa48("11179") ? entry.duration <= 50 : stryMutAct_9fa48("11178") ? entry.duration >= 50 : stryMutAct_9fa48("11177") ? false : stryMutAct_9fa48("11176") ? true : (stryCov_9fa48("11176", "11177", "11178", "11179"), entry.duration > 50)) {
                    if (stryMutAct_9fa48("11180")) {
                      {}
                    } else {
                      stryCov_9fa48("11180");
                      // Long task threshold
                      this.reportLongTask(entry as PerformanceEntry);
                    }
                  }
                }
              }
            }
          });
          longTaskObserver.observe(stryMutAct_9fa48("11181") ? {} : (stryCov_9fa48("11181"), {
            entryTypes: stryMutAct_9fa48("11182") ? [] : (stryCov_9fa48("11182"), [stryMutAct_9fa48("11183") ? "" : (stryCov_9fa48("11183"), 'longtask')])
          }));

          // Observe resource timing
          const resourceObserver = new PerformanceObserver(list => {
            if (stryMutAct_9fa48("11184")) {
              {}
            } else {
              stryCov_9fa48("11184");
              for (const entry of list.getEntries()) {
                if (stryMutAct_9fa48("11185")) {
                  {}
                } else {
                  stryCov_9fa48("11185");
                  this.resourceTimingBuffer.push(entry as PerformanceResourceTiming);
                }
              }
            }
          });
          resourceObserver.observe(stryMutAct_9fa48("11186") ? {} : (stryCov_9fa48("11186"), {
            entryTypes: stryMutAct_9fa48("11187") ? [] : (stryCov_9fa48("11187"), [stryMutAct_9fa48("11188") ? "" : (stryCov_9fa48("11188"), 'resource')])
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("11189")) {
          {}
        } else {
          stryCov_9fa48("11189");
          console.error(stryMutAct_9fa48("11190") ? "" : (stryCov_9fa48("11190"), 'Failed to set up performance observer:'), error);
        }
      }
    }
  }

  /**
   * Track long JavaScript tasks
   */
  private trackLongTasks(): void {
    if (stryMutAct_9fa48("11191")) {
      {}
    } else {
      stryCov_9fa48("11191");
      if (stryMutAct_9fa48("11194") ? false : stryMutAct_9fa48("11193") ? true : stryMutAct_9fa48("11192") ? 'PerformanceObserver' in window : (stryCov_9fa48("11192", "11193", "11194"), !((stryMutAct_9fa48("11195") ? "" : (stryCov_9fa48("11195"), 'PerformanceObserver')) in window))) return;
      try {
        if (stryMutAct_9fa48("11196")) {
          {}
        } else {
          stryCov_9fa48("11196");
          const observer = new PerformanceObserver(list => {
            if (stryMutAct_9fa48("11197")) {
              {}
            } else {
              stryCov_9fa48("11197");
              for (const entry of list.getEntries()) {
                if (stryMutAct_9fa48("11198")) {
                  {}
                } else {
                  stryCov_9fa48("11198");
                  trackEvent(stryMutAct_9fa48("11199") ? "" : (stryCov_9fa48("11199"), 'long_task'), stryMutAct_9fa48("11200") ? {} : (stryCov_9fa48("11200"), {
                    duration: entry.duration,
                    start_time: entry.startTime,
                    name: entry.name,
                    page_url: window.location.href
                  }));
                }
              }
            }
          });
          observer.observe(stryMutAct_9fa48("11201") ? {} : (stryCov_9fa48("11201"), {
            entryTypes: stryMutAct_9fa48("11202") ? [] : (stryCov_9fa48("11202"), [stryMutAct_9fa48("11203") ? "" : (stryCov_9fa48("11203"), 'longtask')])
          }));
        }
      } catch (error) {
        // Long task API might not be supported
      }
    }
  }

  /**
   * Report long task
   */
  private reportLongTask(entry: PerformanceEntry): void {
    if (stryMutAct_9fa48("11204")) {
      {}
    } else {
      stryCov_9fa48("11204");
      trackEvent(stryMutAct_9fa48("11205") ? "" : (stryCov_9fa48("11205"), 'performance_long_task'), stryMutAct_9fa48("11206") ? {} : (stryCov_9fa48("11206"), {
        task_duration: entry.duration,
        task_start_time: entry.startTime,
        task_name: entry.name,
        page_url: window.location.href,
        timestamp: Date.now()
      }));
      if (stryMutAct_9fa48("11208") ? false : stryMutAct_9fa48("11207") ? true : (stryCov_9fa48("11207", "11208"), this.config.enableDetailedLogging)) {
        if (stryMutAct_9fa48("11209")) {
          {}
        } else {
          stryCov_9fa48("11209");
          console.warn(stryMutAct_9fa48("11210") ? `` : (stryCov_9fa48("11210"), `Long task detected: ${entry.duration}ms`), entry);
        }
      }
    }
  }

  /**
   * Track resource timing
   */
  private trackResourceTiming(): void {
    if (stryMutAct_9fa48("11211")) {
      {}
    } else {
      stryCov_9fa48("11211");
      if (stryMutAct_9fa48("11214") ? false : stryMutAct_9fa48("11213") ? true : stryMutAct_9fa48("11212") ? performance.getEntriesByType : (stryCov_9fa48("11212", "11213", "11214"), !performance.getEntriesByType)) return;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      // Group resources by type
      const resourceGroups = this.groupResourcesByType(resources);

      // Report resource metrics
      Object.entries(resourceGroups).forEach(([type, resources]) => {
        if (stryMutAct_9fa48("11215")) {
          {}
        } else {
          stryCov_9fa48("11215");
          const totalSize = resources.reduce(stryMutAct_9fa48("11216") ? () => undefined : (stryCov_9fa48("11216"), (sum, r) => stryMutAct_9fa48("11217") ? sum - (r.transferSize || 0) : (stryCov_9fa48("11217"), sum + (stryMutAct_9fa48("11220") ? r.transferSize && 0 : stryMutAct_9fa48("11219") ? false : stryMutAct_9fa48("11218") ? true : (stryCov_9fa48("11218", "11219", "11220"), r.transferSize || 0)))), 0);
          const totalDuration = resources.reduce(stryMutAct_9fa48("11221") ? () => undefined : (stryCov_9fa48("11221"), (sum, r) => stryMutAct_9fa48("11222") ? sum - r.duration : (stryCov_9fa48("11222"), sum + r.duration)), 0);
          const avgDuration = stryMutAct_9fa48("11223") ? totalDuration * resources.length : (stryCov_9fa48("11223"), totalDuration / resources.length);
          trackEvent(stryMutAct_9fa48("11224") ? "" : (stryCov_9fa48("11224"), 'resource_timing'), stryMutAct_9fa48("11225") ? {} : (stryCov_9fa48("11225"), {
            resource_type: type,
            resource_count: resources.length,
            total_size: totalSize,
            total_duration: totalDuration,
            avg_duration: avgDuration,
            page_url: window.location.href
          }));
        }
      });
    }
  }

  /**
   * Group resources by type
   */
  private groupResourcesByType(resources: PerformanceResourceTiming[]): Record<string, PerformanceResourceTiming[]> {
    if (stryMutAct_9fa48("11226")) {
      {}
    } else {
      stryCov_9fa48("11226");
      const groups: Record<string, PerformanceResourceTiming[]> = {};
      resources.forEach(resource => {
        if (stryMutAct_9fa48("11227")) {
          {}
        } else {
          stryCov_9fa48("11227");
          const type = this.getResourceType(resource);
          if (stryMutAct_9fa48("11230") ? false : stryMutAct_9fa48("11229") ? true : stryMutAct_9fa48("11228") ? groups[type] : (stryCov_9fa48("11228", "11229", "11230"), !groups[type])) {
            if (stryMutAct_9fa48("11231")) {
              {}
            } else {
              stryCov_9fa48("11231");
              groups[type] = stryMutAct_9fa48("11232") ? ["Stryker was here"] : (stryCov_9fa48("11232"), []);
            }
          }
          groups[type].push(resource);
        }
      });
      return groups;
    }
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(resource: PerformanceResourceTiming): string {
    if (stryMutAct_9fa48("11233")) {
      {}
    } else {
      stryCov_9fa48("11233");
      const url = stryMutAct_9fa48("11234") ? resource.name.toUpperCase() : (stryCov_9fa48("11234"), resource.name.toLowerCase());
      if (stryMutAct_9fa48("11236") ? false : stryMutAct_9fa48("11235") ? true : (stryCov_9fa48("11235", "11236"), url.includes(stryMutAct_9fa48("11237") ? "" : (stryCov_9fa48("11237"), '.js')))) return stryMutAct_9fa48("11238") ? "" : (stryCov_9fa48("11238"), 'script');
      if (stryMutAct_9fa48("11240") ? false : stryMutAct_9fa48("11239") ? true : (stryCov_9fa48("11239", "11240"), url.includes(stryMutAct_9fa48("11241") ? "" : (stryCov_9fa48("11241"), '.css')))) return stryMutAct_9fa48("11242") ? "" : (stryCov_9fa48("11242"), 'stylesheet');
      if (stryMutAct_9fa48("11245") ? (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif') || url.includes('.webp')) && url.includes('.svg') : stryMutAct_9fa48("11244") ? false : stryMutAct_9fa48("11243") ? true : (stryCov_9fa48("11243", "11244", "11245"), (stryMutAct_9fa48("11247") ? (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif')) && url.includes('.webp') : stryMutAct_9fa48("11246") ? false : (stryCov_9fa48("11246", "11247"), (stryMutAct_9fa48("11249") ? (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) && url.includes('.gif') : stryMutAct_9fa48("11248") ? false : (stryCov_9fa48("11248", "11249"), (stryMutAct_9fa48("11251") ? (url.includes('.jpg') || url.includes('.jpeg')) && url.includes('.png') : stryMutAct_9fa48("11250") ? false : (stryCov_9fa48("11250", "11251"), (stryMutAct_9fa48("11253") ? url.includes('.jpg') && url.includes('.jpeg') : stryMutAct_9fa48("11252") ? false : (stryCov_9fa48("11252", "11253"), url.includes(stryMutAct_9fa48("11254") ? "" : (stryCov_9fa48("11254"), '.jpg')) || url.includes(stryMutAct_9fa48("11255") ? "" : (stryCov_9fa48("11255"), '.jpeg')))) || url.includes(stryMutAct_9fa48("11256") ? "" : (stryCov_9fa48("11256"), '.png')))) || url.includes(stryMutAct_9fa48("11257") ? "" : (stryCov_9fa48("11257"), '.gif')))) || url.includes(stryMutAct_9fa48("11258") ? "" : (stryCov_9fa48("11258"), '.webp')))) || url.includes(stryMutAct_9fa48("11259") ? "" : (stryCov_9fa48("11259"), '.svg')))) return stryMutAct_9fa48("11260") ? "" : (stryCov_9fa48("11260"), 'image');
      if (stryMutAct_9fa48("11263") ? (url.includes('.woff') || url.includes('.ttf')) && url.includes('.otf') : stryMutAct_9fa48("11262") ? false : stryMutAct_9fa48("11261") ? true : (stryCov_9fa48("11261", "11262", "11263"), (stryMutAct_9fa48("11265") ? url.includes('.woff') && url.includes('.ttf') : stryMutAct_9fa48("11264") ? false : (stryCov_9fa48("11264", "11265"), url.includes(stryMutAct_9fa48("11266") ? "" : (stryCov_9fa48("11266"), '.woff')) || url.includes(stryMutAct_9fa48("11267") ? "" : (stryCov_9fa48("11267"), '.ttf')))) || url.includes(stryMutAct_9fa48("11268") ? "" : (stryCov_9fa48("11268"), '.otf')))) return stryMutAct_9fa48("11269") ? "" : (stryCov_9fa48("11269"), 'font');
      if (stryMutAct_9fa48("11272") ? url.includes('/api/') && url.includes('json') : stryMutAct_9fa48("11271") ? false : stryMutAct_9fa48("11270") ? true : (stryCov_9fa48("11270", "11271", "11272"), url.includes(stryMutAct_9fa48("11273") ? "" : (stryCov_9fa48("11273"), '/api/')) || url.includes(stryMutAct_9fa48("11274") ? "" : (stryCov_9fa48("11274"), 'json')))) return stryMutAct_9fa48("11275") ? "" : (stryCov_9fa48("11275"), 'api');
      return stryMutAct_9fa48("11276") ? "" : (stryCov_9fa48("11276"), 'other');
    }
  }

  /**
   * Track paint timing
   */
  private trackPaintTiming(): void {
    if (stryMutAct_9fa48("11277")) {
      {}
    } else {
      stryCov_9fa48("11277");
      if (stryMutAct_9fa48("11280") ? false : stryMutAct_9fa48("11279") ? true : stryMutAct_9fa48("11278") ? performance.getEntriesByType : (stryCov_9fa48("11278", "11279", "11280"), !performance.getEntriesByType)) return;
      const paintEntries = performance.getEntriesByType(stryMutAct_9fa48("11281") ? "" : (stryCov_9fa48("11281"), 'paint'));
      paintEntries.forEach(entry => {
        if (stryMutAct_9fa48("11282")) {
          {}
        } else {
          stryCov_9fa48("11282");
          trackEvent(stryMutAct_9fa48("11283") ? "" : (stryCov_9fa48("11283"), 'paint_timing'), stryMutAct_9fa48("11284") ? {} : (stryCov_9fa48("11284"), {
            paint_type: entry.name,
            paint_time: entry.startTime,
            page_url: window.location.href
          }));
        }
      });
    }
  }

  /**
   * Track JavaScript bundle size
   */
  private trackBundleSize(): void {
    if (stryMutAct_9fa48("11285")) {
      {}
    } else {
      stryCov_9fa48("11285");
      if (stryMutAct_9fa48("11288") ? false : stryMutAct_9fa48("11287") ? true : stryMutAct_9fa48("11286") ? performance.getEntriesByType : (stryCov_9fa48("11286", "11287", "11288"), !performance.getEntriesByType)) return;
      const scripts = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsFiles = stryMutAct_9fa48("11289") ? scripts : (stryCov_9fa48("11289"), scripts.filter(stryMutAct_9fa48("11290") ? () => undefined : (stryCov_9fa48("11290"), s => s.name.includes(stryMutAct_9fa48("11291") ? "" : (stryCov_9fa48("11291"), '.js')))));
      const totalSize = jsFiles.reduce(stryMutAct_9fa48("11292") ? () => undefined : (stryCov_9fa48("11292"), (sum, script) => stryMutAct_9fa48("11293") ? sum - (script.transferSize || 0) : (stryCov_9fa48("11293"), sum + (stryMutAct_9fa48("11296") ? script.transferSize && 0 : stryMutAct_9fa48("11295") ? false : stryMutAct_9fa48("11294") ? true : (stryCov_9fa48("11294", "11295", "11296"), script.transferSize || 0)))), 0);
      const totalDecodedSize = jsFiles.reduce(stryMutAct_9fa48("11297") ? () => undefined : (stryCov_9fa48("11297"), (sum, script) => stryMutAct_9fa48("11298") ? sum - (script.decodedBodySize || 0) : (stryCov_9fa48("11298"), sum + (stryMutAct_9fa48("11301") ? script.decodedBodySize && 0 : stryMutAct_9fa48("11300") ? false : stryMutAct_9fa48("11299") ? true : (stryCov_9fa48("11299", "11300", "11301"), script.decodedBodySize || 0)))), 0);
      const bundleMetric: Metric = stryMutAct_9fa48("11302") ? {} : (stryCov_9fa48("11302"), {
        name: stryMutAct_9fa48("11303") ? "" : (stryCov_9fa48("11303"), 'bundleSize'),
        value: totalSize,
        delta: totalSize,
        id: stryMutAct_9fa48("11304") ? `` : (stryCov_9fa48("11304"), `bundle-${Date.now()}`),
        entries: stryMutAct_9fa48("11305") ? ["Stryker was here"] : (stryCov_9fa48("11305"), [])
      });
      const enrichedMetric = this.enrichMetric(bundleMetric);
      trackEvent(stryMutAct_9fa48("11306") ? "" : (stryCov_9fa48("11306"), 'bundle_size'), stryMutAct_9fa48("11307") ? {} : (stryCov_9fa48("11307"), {
        total_size: totalSize,
        total_decoded_size: totalDecodedSize,
        script_count: jsFiles.length,
        rating: enrichedMetric.rating,
        page_url: window.location.href
      }));
    }
  }

  /**
   * Monitor memory usage
   */
  private monitorMemoryUsage(): void {
    if (stryMutAct_9fa48("11308")) {
      {}
    } else {
      stryCov_9fa48("11308");
      if (stryMutAct_9fa48("11311") ? false : stryMutAct_9fa48("11310") ? true : stryMutAct_9fa48("11309") ? (performance as any).memory : (stryCov_9fa48("11309", "11310", "11311"), !(performance as any).memory)) return;
      const checkMemory = () => {
        if (stryMutAct_9fa48("11312")) {
          {}
        } else {
          stryCov_9fa48("11312");
          const memory = (performance as any).memory;
          const usedMB = stryMutAct_9fa48("11313") ? memory.usedJSHeapSize * 1048576 : (stryCov_9fa48("11313"), memory.usedJSHeapSize / 1048576);
          const totalMB = stryMutAct_9fa48("11314") ? memory.totalJSHeapSize * 1048576 : (stryCov_9fa48("11314"), memory.totalJSHeapSize / 1048576);
          const limitMB = stryMutAct_9fa48("11315") ? memory.jsHeapSizeLimit * 1048576 : (stryCov_9fa48("11315"), memory.jsHeapSizeLimit / 1048576);
          const usagePercentage = stryMutAct_9fa48("11316") ? usedMB / limitMB / 100 : (stryCov_9fa48("11316"), (stryMutAct_9fa48("11317") ? usedMB * limitMB : (stryCov_9fa48("11317"), usedMB / limitMB)) * 100);
          trackEvent(stryMutAct_9fa48("11318") ? "" : (stryCov_9fa48("11318"), 'memory_usage'), stryMutAct_9fa48("11319") ? {} : (stryCov_9fa48("11319"), {
            used_mb: usedMB,
            total_mb: totalMB,
            limit_mb: limitMB,
            usage_percentage: usagePercentage,
            page_url: window.location.href
          }));

          // Alert if memory usage is high
          if (stryMutAct_9fa48("11323") ? usagePercentage <= 75 : stryMutAct_9fa48("11322") ? usagePercentage >= 75 : stryMutAct_9fa48("11321") ? false : stryMutAct_9fa48("11320") ? true : (stryCov_9fa48("11320", "11321", "11322", "11323"), usagePercentage > 75)) {
            if (stryMutAct_9fa48("11324")) {
              {}
            } else {
              stryCov_9fa48("11324");
              trackEvent(stryMutAct_9fa48("11325") ? "" : (stryCov_9fa48("11325"), 'high_memory_usage'), stryMutAct_9fa48("11326") ? {} : (stryCov_9fa48("11326"), {
                used_mb: usedMB,
                usage_percentage: usagePercentage,
                page_url: window.location.href
              }));
            }
          }
        }
      };

      // Check memory every 30 seconds
      setInterval(checkMemory, 30000);

      // Initial check
      checkMemory();
    }
  }

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(): void {
    if (stryMutAct_9fa48("11327")) {
      {}
    } else {
      stryCov_9fa48("11327");
      if (stryMutAct_9fa48("11330") ? false : stryMutAct_9fa48("11329") ? true : stryMutAct_9fa48("11328") ? performance.timing : (stryCov_9fa48("11328", "11329", "11330"), !performance.timing)) return;

      // Wait for page load to complete
      if (stryMutAct_9fa48("11333") ? document.readyState !== 'complete' : stryMutAct_9fa48("11332") ? false : stryMutAct_9fa48("11331") ? true : (stryCov_9fa48("11331", "11332", "11333"), document.readyState === (stryMutAct_9fa48("11334") ? "" : (stryCov_9fa48("11334"), 'complete')))) {
        if (stryMutAct_9fa48("11335")) {
          {}
        } else {
          stryCov_9fa48("11335");
          this.reportNavigationTiming();
        }
      } else {
        if (stryMutAct_9fa48("11336")) {
          {}
        } else {
          stryCov_9fa48("11336");
          window.addEventListener(stryMutAct_9fa48("11337") ? "" : (stryCov_9fa48("11337"), 'load'), () => {
            if (stryMutAct_9fa48("11338")) {
              {}
            } else {
              stryCov_9fa48("11338");
              this.reportNavigationTiming();
            }
          });
        }
      }
    }
  }

  /**
   * Report navigation timing metrics
   */
  private reportNavigationTiming(): void {
    if (stryMutAct_9fa48("11339")) {
      {}
    } else {
      stryCov_9fa48("11339");
      const timing = performance.timing;
      const metrics = stryMutAct_9fa48("11340") ? {} : (stryCov_9fa48("11340"), {
        dns_lookup: stryMutAct_9fa48("11341") ? timing.domainLookupEnd + timing.domainLookupStart : (stryCov_9fa48("11341"), timing.domainLookupEnd - timing.domainLookupStart),
        tcp_connection: stryMutAct_9fa48("11342") ? timing.connectEnd + timing.connectStart : (stryCov_9fa48("11342"), timing.connectEnd - timing.connectStart),
        request_time: stryMutAct_9fa48("11343") ? timing.responseStart + timing.requestStart : (stryCov_9fa48("11343"), timing.responseStart - timing.requestStart),
        response_time: stryMutAct_9fa48("11344") ? timing.responseEnd + timing.responseStart : (stryCov_9fa48("11344"), timing.responseEnd - timing.responseStart),
        dom_processing: stryMutAct_9fa48("11345") ? timing.domComplete + timing.domLoading : (stryCov_9fa48("11345"), timing.domComplete - timing.domLoading),
        dom_content_loaded: stryMutAct_9fa48("11346") ? timing.domContentLoadedEventEnd + timing.domContentLoadedEventStart : (stryCov_9fa48("11346"), timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart),
        load_complete: stryMutAct_9fa48("11347") ? timing.loadEventEnd + timing.loadEventStart : (stryCov_9fa48("11347"), timing.loadEventEnd - timing.loadEventStart),
        total_page_load: stryMutAct_9fa48("11348") ? timing.loadEventEnd + timing.navigationStart : (stryCov_9fa48("11348"), timing.loadEventEnd - timing.navigationStart)
      });
      trackEvent(stryMutAct_9fa48("11349") ? "" : (stryCov_9fa48("11349"), 'navigation_timing'), stryMutAct_9fa48("11350") ? {} : (stryCov_9fa48("11350"), {
        ...metrics,
        page_url: window.location.href
      }));
    }
  }

  /**
   * Set up unload handler for final reporting
   */
  private setupUnloadHandler(): void {
    if (stryMutAct_9fa48("11351")) {
      {}
    } else {
      stryCov_9fa48("11351");
      const reportFinalMetrics = () => {
        if (stryMutAct_9fa48("11352")) {
          {}
        } else {
          stryCov_9fa48("11352");
          // Report accumulated metrics
          this.reportAccumulatedMetrics();

          // Report resource timing summary
          this.reportResourceTimingSummary();
        }
      };

      // Use visibilitychange as more reliable than unload
      document.addEventListener(stryMutAct_9fa48("11353") ? "" : (stryCov_9fa48("11353"), 'visibilitychange'), () => {
        if (stryMutAct_9fa48("11354")) {
          {}
        } else {
          stryCov_9fa48("11354");
          if (stryMutAct_9fa48("11357") ? document.visibilityState !== 'hidden' : stryMutAct_9fa48("11356") ? false : stryMutAct_9fa48("11355") ? true : (stryCov_9fa48("11355", "11356", "11357"), document.visibilityState === (stryMutAct_9fa48("11358") ? "" : (stryCov_9fa48("11358"), 'hidden')))) {
            if (stryMutAct_9fa48("11359")) {
              {}
            } else {
              stryCov_9fa48("11359");
              reportFinalMetrics();
            }
          }
        }
      });
    }
  }

  /**
   * Report accumulated metrics
   */
  private reportAccumulatedMetrics(): void {
    if (stryMutAct_9fa48("11360")) {
      {}
    } else {
      stryCov_9fa48("11360");
      const summary: Record<string, any> = {};
      this.metrics.forEach((metrics, name) => {
        if (stryMutAct_9fa48("11361")) {
          {}
        } else {
          stryCov_9fa48("11361");
          const values = metrics.map(stryMutAct_9fa48("11362") ? () => undefined : (stryCov_9fa48("11362"), m => m.value));
          summary[name] = stryMutAct_9fa48("11363") ? {} : (stryCov_9fa48("11363"), {
            count: values.length,
            min: stryMutAct_9fa48("11364") ? Math.max(...values) : (stryCov_9fa48("11364"), Math.min(...values)),
            max: stryMutAct_9fa48("11365") ? Math.min(...values) : (stryCov_9fa48("11365"), Math.max(...values)),
            avg: stryMutAct_9fa48("11366") ? values.reduce((a, b) => a + b, 0) * values.length : (stryCov_9fa48("11366"), values.reduce(stryMutAct_9fa48("11367") ? () => undefined : (stryCov_9fa48("11367"), (a, b) => stryMutAct_9fa48("11368") ? a - b : (stryCov_9fa48("11368"), a + b)), 0) / values.length),
            poor_count: stryMutAct_9fa48("11369") ? metrics.length : (stryCov_9fa48("11369"), metrics.filter(stryMutAct_9fa48("11370") ? () => undefined : (stryCov_9fa48("11370"), m => stryMutAct_9fa48("11373") ? m.rating !== 'poor' : stryMutAct_9fa48("11372") ? false : stryMutAct_9fa48("11371") ? true : (stryCov_9fa48("11371", "11372", "11373"), m.rating === (stryMutAct_9fa48("11374") ? "" : (stryCov_9fa48("11374"), 'poor'))))).length)
          });
        }
      });
      trackEvent(stryMutAct_9fa48("11375") ? "" : (stryCov_9fa48("11375"), 'performance_session_summary'), stryMutAct_9fa48("11376") ? {} : (stryCov_9fa48("11376"), {
        metrics_summary: summary,
        session_duration: stryMutAct_9fa48("11377") ? Date.now() + this.navigationStart : (stryCov_9fa48("11377"), Date.now() - this.navigationStart),
        page_url: window.location.href
      }));
    }
  }

  /**
   * Report resource timing summary
   */
  private reportResourceTimingSummary(): void {
    if (stryMutAct_9fa48("11378")) {
      {}
    } else {
      stryCov_9fa48("11378");
      if (stryMutAct_9fa48("11381") ? this.resourceTimingBuffer.length !== 0 : stryMutAct_9fa48("11380") ? false : stryMutAct_9fa48("11379") ? true : (stryCov_9fa48("11379", "11380", "11381"), this.resourceTimingBuffer.length === 0)) return;
      const summary = this.groupResourcesByType(this.resourceTimingBuffer);
      Object.entries(summary).forEach(([type, resources]) => {
        if (stryMutAct_9fa48("11382")) {
          {}
        } else {
          stryCov_9fa48("11382");
          trackEvent(stryMutAct_9fa48("11383") ? "" : (stryCov_9fa48("11383"), 'resource_timing_summary'), stryMutAct_9fa48("11384") ? {} : (stryCov_9fa48("11384"), {
            resource_type: type,
            resource_count: resources.length,
            total_size: resources.reduce(stryMutAct_9fa48("11385") ? () => undefined : (stryCov_9fa48("11385"), (sum, r) => stryMutAct_9fa48("11386") ? sum - (r.transferSize || 0) : (stryCov_9fa48("11386"), sum + (stryMutAct_9fa48("11389") ? r.transferSize && 0 : stryMutAct_9fa48("11388") ? false : stryMutAct_9fa48("11387") ? true : (stryCov_9fa48("11387", "11388", "11389"), r.transferSize || 0)))), 0),
            avg_duration: stryMutAct_9fa48("11390") ? resources.reduce((sum, r) => sum + r.duration, 0) * resources.length : (stryCov_9fa48("11390"), resources.reduce(stryMutAct_9fa48("11391") ? () => undefined : (stryCov_9fa48("11391"), (sum, r) => stryMutAct_9fa48("11392") ? sum - r.duration : (stryCov_9fa48("11392"), sum + r.duration)), 0) / resources.length),
            page_url: window.location.href
          }));
        }
      });
    }
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): Map<string, PerformanceMetric[]> {
    if (stryMutAct_9fa48("11393")) {
      {}
    } else {
      stryCov_9fa48("11393");
      return this.metrics;
    }
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): Record<string, any> {
    if (stryMutAct_9fa48("11394")) {
      {}
    } else {
      stryCov_9fa48("11394");
      const summary: Record<string, any> = {};
      this.metrics.forEach((metrics, name) => {
        if (stryMutAct_9fa48("11395")) {
          {}
        } else {
          stryCov_9fa48("11395");
          if (stryMutAct_9fa48("11398") ? metrics.length !== 0 : stryMutAct_9fa48("11397") ? false : stryMutAct_9fa48("11396") ? true : (stryCov_9fa48("11396", "11397", "11398"), metrics.length === 0)) return;
          const latestMetric = metrics[stryMutAct_9fa48("11399") ? metrics.length + 1 : (stryCov_9fa48("11399"), metrics.length - 1)];
          summary[name] = stryMutAct_9fa48("11400") ? {} : (stryCov_9fa48("11400"), {
            value: latestMetric.value,
            rating: latestMetric.rating,
            timestamp: latestMetric.timestamp
          });
        }
      });
      return summary;
    }
  }

  /**
   * Clear metrics
   */
  public clearMetrics(): void {
    if (stryMutAct_9fa48("11401")) {
      {}
    } else {
      stryCov_9fa48("11401");
      this.metrics.clear();
      this.resourceTimingBuffer = stryMutAct_9fa48("11402") ? ["Stryker was here"] : (stryCov_9fa48("11402"), []);
    }
  }
}

// Create singleton instance
export const performanceMonitoring = new PerformanceMonitoringService();

// Auto-initialize if in browser
if (stryMutAct_9fa48("11405") ? typeof window === 'undefined' : stryMutAct_9fa48("11404") ? false : stryMutAct_9fa48("11403") ? true : (stryCov_9fa48("11403", "11404", "11405"), typeof window !== (stryMutAct_9fa48("11406") ? "" : (stryCov_9fa48("11406"), 'undefined')))) {
  if (stryMutAct_9fa48("11407")) {
    {}
  } else {
    stryCov_9fa48("11407");
    // Initialize on page load or immediately if already loaded
    if (stryMutAct_9fa48("11410") ? document.readyState !== 'loading' : stryMutAct_9fa48("11409") ? false : stryMutAct_9fa48("11408") ? true : (stryCov_9fa48("11408", "11409", "11410"), document.readyState === (stryMutAct_9fa48("11411") ? "" : (stryCov_9fa48("11411"), 'loading')))) {
      if (stryMutAct_9fa48("11412")) {
        {}
      } else {
        stryCov_9fa48("11412");
        document.addEventListener(stryMutAct_9fa48("11413") ? "" : (stryCov_9fa48("11413"), 'DOMContentLoaded'), () => {
          if (stryMutAct_9fa48("11414")) {
            {}
          } else {
            stryCov_9fa48("11414");
            performanceMonitoring.init();
          }
        });
      }
    } else {
      if (stryMutAct_9fa48("11415")) {
        {}
      } else {
        stryCov_9fa48("11415");
        performanceMonitoring.init();
      }
    }
  }
}

/**
 * Export convenience functions
 */
export const initPerformanceMonitoring = stryMutAct_9fa48("11416") ? () => undefined : (stryCov_9fa48("11416"), (() => {
  const initPerformanceMonitoring = () => performanceMonitoring.init();
  return initPerformanceMonitoring;
})());
export const getPerformanceMetrics = stryMutAct_9fa48("11417") ? () => undefined : (stryCov_9fa48("11417"), (() => {
  const getPerformanceMetrics = () => performanceMonitoring.getMetrics();
  return getPerformanceMetrics;
})());
export const getPerformanceSummary = stryMutAct_9fa48("11418") ? () => undefined : (stryCov_9fa48("11418"), (() => {
  const getPerformanceSummary = () => performanceMonitoring.getPerformanceSummary();
  return getPerformanceSummary;
})());