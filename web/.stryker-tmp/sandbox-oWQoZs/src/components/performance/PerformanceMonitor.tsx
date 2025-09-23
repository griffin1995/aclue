/**
 * Performance Monitor Component for aclue Platform
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
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte

  // Custom metrics
  renderTime?: number; // Component render time
  memoryUsage?: number; // Memory usage in MB
  bundleSize?: number; // JavaScript bundle size

  // Page metrics
  pageLoadTime?: number; // Total page load time
  domContentLoaded?: number; // DOM content loaded time
  timeToInteractive?: number; // Time to interactive
}

/**
 * Performance threshold configuration.
 */
interface PerformanceThresholds {
  lcp: {
    good: number;
    needsImprovement: number;
  };
  fid: {
    good: number;
    needsImprovement: number;
  };
  cls: {
    good: number;
    needsImprovement: number;
  };
  fcp: {
    good: number;
    needsImprovement: number;
  };
  ttfb: {
    good: number;
    needsImprovement: number;
  };
}

/**
 * Props for PerformanceMonitor component.
 */
interface PerformanceMonitorProps {
  children: ReactNode;
  enabled?: boolean; // Enable/disable monitoring
  reportingInterval?: number; // Reporting interval in milliseconds
  trackWebVitals?: boolean; // Enable Core Web Vitals tracking
  trackMemory?: boolean; // Enable memory monitoring
  alertThresholds?: Partial<PerformanceThresholds>; // Custom alert thresholds
}

// ==============================================================================
// PERFORMANCE THRESHOLDS
// ==============================================================================

/**
 * Default performance thresholds based on Google's Core Web Vitals.
 */
const DEFAULT_THRESHOLDS: PerformanceThresholds = stryMutAct_9fa48("4544") ? {} : (stryCov_9fa48("4544"), {
  lcp: stryMutAct_9fa48("4545") ? {} : (stryCov_9fa48("4545"), {
    good: 2500,
    needsImprovement: 4000
  }),
  // Largest Contentful Paint
  fid: stryMutAct_9fa48("4546") ? {} : (stryCov_9fa48("4546"), {
    good: 100,
    needsImprovement: 300
  }),
  // First Input Delay
  cls: stryMutAct_9fa48("4547") ? {} : (stryCov_9fa48("4547"), {
    good: 0.1,
    needsImprovement: 0.25
  }),
  // Cumulative Layout Shift
  fcp: stryMutAct_9fa48("4548") ? {} : (stryCov_9fa48("4548"), {
    good: 1800,
    needsImprovement: 3000
  }),
  // First Contentful Paint
  ttfb: stryMutAct_9fa48("4549") ? {} : (stryCov_9fa48("4549"), {
    good: 800,
    needsImprovement: 1800
  }) // Time to First Byte
});

// ==============================================================================
// PERFORMANCE MONITOR COMPONENT
// ==============================================================================

/**
 * PerformanceMonitor component for tracking application performance.
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  children,
  enabled = stryMutAct_9fa48("4552") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("4551") ? false : stryMutAct_9fa48("4550") ? true : (stryCov_9fa48("4550", "4551", "4552"), process.env.NODE_ENV === (stryMutAct_9fa48("4553") ? "" : (stryCov_9fa48("4553"), 'production'))),
  reportingInterval = 30000,
  // 30 seconds
  trackWebVitals = stryMutAct_9fa48("4554") ? false : (stryCov_9fa48("4554"), true),
  trackMemory = stryMutAct_9fa48("4555") ? false : (stryCov_9fa48("4555"), true),
  alertThresholds = {}
}) => {
  if (stryMutAct_9fa48("4556")) {
    {}
  } else {
    stryCov_9fa48("4556");
    const router = useRouter();
    const [metrics, setMetrics] = useState<PerformanceMetrics>({});
    const reportingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const navigationStartTime = useRef<number>(0);
    const thresholds = stryMutAct_9fa48("4557") ? {} : (stryCov_9fa48("4557"), {
      ...DEFAULT_THRESHOLDS,
      ...alertThresholds
    });

    // ===========================================================================
    // CORE WEB VITALS TRACKING
    // ===========================================================================

    /**
     * Track Core Web Vitals using the Web Vitals API.
     */
    const trackWebVitalsMetrics = () => {
      if (stryMutAct_9fa48("4558")) {
        {}
      } else {
        stryCov_9fa48("4558");
        if (stryMutAct_9fa48("4561") ? !trackWebVitals && typeof window === 'undefined' : stryMutAct_9fa48("4560") ? false : stryMutAct_9fa48("4559") ? true : (stryCov_9fa48("4559", "4560", "4561"), (stryMutAct_9fa48("4562") ? trackWebVitals : (stryCov_9fa48("4562"), !trackWebVitals)) || (stryMutAct_9fa48("4564") ? typeof window !== 'undefined' : stryMutAct_9fa48("4563") ? false : (stryCov_9fa48("4563", "4564"), typeof window === (stryMutAct_9fa48("4565") ? "" : (stryCov_9fa48("4565"), 'undefined')))))) return;

        // Dynamically import web-vitals to avoid SSR issues
        import(stryMutAct_9fa48("4566") ? "" : (stryCov_9fa48("4566"), 'web-vitals')).then(({
          getCLS,
          getFID,
          getFCP,
          getLCP,
          getTTFB
        }) => {
          if (stryMutAct_9fa48("4567")) {
            {}
          } else {
            stryCov_9fa48("4567");
            // Largest Contentful Paint
            getLCP(metric => {
              if (stryMutAct_9fa48("4568")) {
                {}
              } else {
                stryCov_9fa48("4568");
                updateMetric(stryMutAct_9fa48("4569") ? "" : (stryCov_9fa48("4569"), 'lcp'), metric.value);
                checkPerformanceAlert(stryMutAct_9fa48("4570") ? "" : (stryCov_9fa48("4570"), 'lcp'), metric.value);
              }
            });

            // First Input Delay
            getFID(metric => {
              if (stryMutAct_9fa48("4571")) {
                {}
              } else {
                stryCov_9fa48("4571");
                updateMetric(stryMutAct_9fa48("4572") ? "" : (stryCov_9fa48("4572"), 'fid'), metric.value);
                checkPerformanceAlert(stryMutAct_9fa48("4573") ? "" : (stryCov_9fa48("4573"), 'fid'), metric.value);
              }
            });

            // Cumulative Layout Shift
            getCLS(metric => {
              if (stryMutAct_9fa48("4574")) {
                {}
              } else {
                stryCov_9fa48("4574");
                updateMetric(stryMutAct_9fa48("4575") ? "" : (stryCov_9fa48("4575"), 'cls'), metric.value);
                checkPerformanceAlert(stryMutAct_9fa48("4576") ? "" : (stryCov_9fa48("4576"), 'cls'), metric.value);
              }
            });

            // First Contentful Paint
            getFCP(metric => {
              if (stryMutAct_9fa48("4577")) {
                {}
              } else {
                stryCov_9fa48("4577");
                updateMetric(stryMutAct_9fa48("4578") ? "" : (stryCov_9fa48("4578"), 'fcp'), metric.value);
                checkPerformanceAlert(stryMutAct_9fa48("4579") ? "" : (stryCov_9fa48("4579"), 'fcp'), metric.value);
              }
            });

            // Time to First Byte
            getTTFB(metric => {
              if (stryMutAct_9fa48("4580")) {
                {}
              } else {
                stryCov_9fa48("4580");
                updateMetric(stryMutAct_9fa48("4581") ? "" : (stryCov_9fa48("4581"), 'ttfb'), metric.value);
                checkPerformanceAlert(stryMutAct_9fa48("4582") ? "" : (stryCov_9fa48("4582"), 'ttfb'), metric.value);
              }
            });
          }
        }).catch(error => {
          if (stryMutAct_9fa48("4583")) {
            {}
          } else {
            stryCov_9fa48("4583");
            console.warn(stryMutAct_9fa48("4584") ? "" : (stryCov_9fa48("4584"), 'Failed to load web-vitals library:'), error);
          }
        });
      }
    };

    // ===========================================================================
    // CUSTOM PERFORMANCE METRICS
    // ===========================================================================

    /**
     * Track page load performance.
     */
    const trackPageLoadMetrics = () => {
      if (stryMutAct_9fa48("4585")) {
        {}
      } else {
        stryCov_9fa48("4585");
        if (stryMutAct_9fa48("4588") ? typeof window !== 'undefined' : stryMutAct_9fa48("4587") ? false : stryMutAct_9fa48("4586") ? true : (stryCov_9fa48("4586", "4587", "4588"), typeof window === (stryMutAct_9fa48("4589") ? "" : (stryCov_9fa48("4589"), 'undefined')))) return;
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (stryMutAct_9fa48("4591") ? false : stryMutAct_9fa48("4590") ? true : (stryCov_9fa48("4590", "4591"), navigation)) {
          if (stryMutAct_9fa48("4592")) {
            {}
          } else {
            stryCov_9fa48("4592");
            const pageLoadTime = stryMutAct_9fa48("4593") ? navigation.loadEventEnd + navigation.fetchStart : (stryCov_9fa48("4593"), navigation.loadEventEnd - navigation.fetchStart);
            const domContentLoaded = stryMutAct_9fa48("4594") ? navigation.domContentLoadedEventEnd + navigation.fetchStart : (stryCov_9fa48("4594"), navigation.domContentLoadedEventEnd - navigation.fetchStart);
            const timeToInteractive = stryMutAct_9fa48("4595") ? navigation.domInteractive + navigation.fetchStart : (stryCov_9fa48("4595"), navigation.domInteractive - navigation.fetchStart);
            updateMetric(stryMutAct_9fa48("4596") ? "" : (stryCov_9fa48("4596"), 'pageLoadTime'), pageLoadTime);
            updateMetric(stryMutAct_9fa48("4597") ? "" : (stryCov_9fa48("4597"), 'domContentLoaded'), domContentLoaded);
            updateMetric(stryMutAct_9fa48("4598") ? "" : (stryCov_9fa48("4598"), 'timeToInteractive'), timeToInteractive);
          }
        }
      }
    };

    /**
     * Track memory usage if available.
     */
    const trackMemoryUsage = () => {
      if (stryMutAct_9fa48("4599")) {
        {}
      } else {
        stryCov_9fa48("4599");
        if (stryMutAct_9fa48("4602") ? !trackMemory && typeof window === 'undefined' : stryMutAct_9fa48("4601") ? false : stryMutAct_9fa48("4600") ? true : (stryCov_9fa48("4600", "4601", "4602"), (stryMutAct_9fa48("4603") ? trackMemory : (stryCov_9fa48("4603"), !trackMemory)) || (stryMutAct_9fa48("4605") ? typeof window !== 'undefined' : stryMutAct_9fa48("4604") ? false : (stryCov_9fa48("4604", "4605"), typeof window === (stryMutAct_9fa48("4606") ? "" : (stryCov_9fa48("4606"), 'undefined')))))) return;

        //  - memory API is experimental
        if (stryMutAct_9fa48("4608") ? false : stryMutAct_9fa48("4607") ? true : (stryCov_9fa48("4607", "4608"), (stryMutAct_9fa48("4609") ? "" : (stryCov_9fa48("4609"), 'memory')) in performance)) {
          if (stryMutAct_9fa48("4610")) {
            {}
          } else {
            stryCov_9fa48("4610");
            // 
            const memoryInfo = performance.memory as any;
            const memoryUsageMB = (stryMutAct_9fa48("4611") ? memoryInfo.usedJSHeapSize : (stryCov_9fa48("4611"), memoryInfo?.usedJSHeapSize)) ? stryMutAct_9fa48("4612") ? memoryInfo.usedJSHeapSize * (1024 * 1024) : (stryCov_9fa48("4612"), memoryInfo.usedJSHeapSize / (stryMutAct_9fa48("4613") ? 1024 / 1024 : (stryCov_9fa48("4613"), 1024 * 1024))) : 0;
            updateMetric(stryMutAct_9fa48("4614") ? "" : (stryCov_9fa48("4614"), 'memoryUsage'), memoryUsageMB);

            // Alert if memory usage is high (>100MB)
            if (stryMutAct_9fa48("4618") ? memoryUsageMB <= 100 : stryMutAct_9fa48("4617") ? memoryUsageMB >= 100 : stryMutAct_9fa48("4616") ? false : stryMutAct_9fa48("4615") ? true : (stryCov_9fa48("4615", "4616", "4617", "4618"), memoryUsageMB > 100)) {
              if (stryMutAct_9fa48("4619")) {
                {}
              } else {
                stryCov_9fa48("4619");
                console.warn(stryMutAct_9fa48("4620") ? `` : (stryCov_9fa48("4620"), `High memory usage detected: ${memoryUsageMB.toFixed(2)}MB`));
                reportPerformanceAlert(stryMutAct_9fa48("4621") ? "" : (stryCov_9fa48("4621"), 'memory'), memoryUsageMB, stryMutAct_9fa48("4622") ? "" : (stryCov_9fa48("4622"), 'High memory usage detected'));
              }
            }
          }
        }
      }
    };

    /**
     * Track bundle size and resource loading.
     */
    const trackBundleSize = () => {
      if (stryMutAct_9fa48("4623")) {
        {}
      } else {
        stryCov_9fa48("4623");
        if (stryMutAct_9fa48("4626") ? typeof window !== 'undefined' : stryMutAct_9fa48("4625") ? false : stryMutAct_9fa48("4624") ? true : (stryCov_9fa48("4624", "4625", "4626"), typeof window === (stryMutAct_9fa48("4627") ? "" : (stryCov_9fa48("4627"), 'undefined')))) return;
        const resources = performance.getEntriesByType(stryMutAct_9fa48("4628") ? "" : (stryCov_9fa48("4628"), 'resource'));
        let totalJSSize = 0;
        resources.forEach(resource => {
          if (stryMutAct_9fa48("4629")) {
            {}
          } else {
            stryCov_9fa48("4629");
            if (stryMutAct_9fa48("4632") ? resource.name.includes('.js') || resource.name.includes('/_next/') : stryMutAct_9fa48("4631") ? false : stryMutAct_9fa48("4630") ? true : (stryCov_9fa48("4630", "4631", "4632"), resource.name.includes(stryMutAct_9fa48("4633") ? "" : (stryCov_9fa48("4633"), '.js')) && resource.name.includes(stryMutAct_9fa48("4634") ? "" : (stryCov_9fa48("4634"), '/_next/')))) {
              if (stryMutAct_9fa48("4635")) {
                {}
              } else {
                stryCov_9fa48("4635");
                stryMutAct_9fa48("4636") ? totalJSSize -= (resource as PerformanceResourceTiming).transferSize || 0 : (stryCov_9fa48("4636"), totalJSSize += stryMutAct_9fa48("4639") ? (resource as PerformanceResourceTiming).transferSize && 0 : stryMutAct_9fa48("4638") ? false : stryMutAct_9fa48("4637") ? true : (stryCov_9fa48("4637", "4638", "4639"), (resource as PerformanceResourceTiming).transferSize || 0));
              }
            }
          }
        });
        const bundleSizeKB = stryMutAct_9fa48("4640") ? totalJSSize * 1024 : (stryCov_9fa48("4640"), totalJSSize / 1024);
        updateMetric(stryMutAct_9fa48("4641") ? "" : (stryCov_9fa48("4641"), 'bundleSize'), bundleSizeKB);

        // Alert if bundle size is large (>1MB)
        if (stryMutAct_9fa48("4645") ? bundleSizeKB <= 1024 : stryMutAct_9fa48("4644") ? bundleSizeKB >= 1024 : stryMutAct_9fa48("4643") ? false : stryMutAct_9fa48("4642") ? true : (stryCov_9fa48("4642", "4643", "4644", "4645"), bundleSizeKB > 1024)) {
          if (stryMutAct_9fa48("4646")) {
            {}
          } else {
            stryCov_9fa48("4646");
            console.warn(stryMutAct_9fa48("4647") ? `` : (stryCov_9fa48("4647"), `Large bundle size detected: ${bundleSizeKB.toFixed(2)}KB`));
            reportPerformanceAlert(stryMutAct_9fa48("4648") ? "" : (stryCov_9fa48("4648"), 'bundle'), bundleSizeKB, stryMutAct_9fa48("4649") ? "" : (stryCov_9fa48("4649"), 'Large bundle size detected'));
          }
        }
      }
    };

    // ===========================================================================
    // PERFORMANCE UTILITIES
    // ===========================================================================

    /**
     * Update a specific performance metric.
     */
    const updateMetric = (key: keyof PerformanceMetrics, value: number) => {
      if (stryMutAct_9fa48("4650")) {
        {}
      } else {
        stryCov_9fa48("4650");
        setMetrics(stryMutAct_9fa48("4651") ? () => undefined : (stryCov_9fa48("4651"), prev => stryMutAct_9fa48("4652") ? {} : (stryCov_9fa48("4652"), {
          ...prev,
          [key]: value
        })));
      }
    };

    /**
     * Check if a metric exceeds performance thresholds.
     */
    const checkPerformanceAlert = (metric: keyof PerformanceThresholds, value: number) => {
      if (stryMutAct_9fa48("4653")) {
        {}
      } else {
        stryCov_9fa48("4653");
        const threshold = thresholds[metric];
        let status: 'good' | 'needs-improvement' | 'poor';
        if (stryMutAct_9fa48("4657") ? value > threshold.good : stryMutAct_9fa48("4656") ? value < threshold.good : stryMutAct_9fa48("4655") ? false : stryMutAct_9fa48("4654") ? true : (stryCov_9fa48("4654", "4655", "4656", "4657"), value <= threshold.good)) {
          if (stryMutAct_9fa48("4658")) {
            {}
          } else {
            stryCov_9fa48("4658");
            status = stryMutAct_9fa48("4659") ? "" : (stryCov_9fa48("4659"), 'good');
          }
        } else if (stryMutAct_9fa48("4663") ? value > threshold.needsImprovement : stryMutAct_9fa48("4662") ? value < threshold.needsImprovement : stryMutAct_9fa48("4661") ? false : stryMutAct_9fa48("4660") ? true : (stryCov_9fa48("4660", "4661", "4662", "4663"), value <= threshold.needsImprovement)) {
          if (stryMutAct_9fa48("4664")) {
            {}
          } else {
            stryCov_9fa48("4664");
            status = stryMutAct_9fa48("4665") ? "" : (stryCov_9fa48("4665"), 'needs-improvement');
          }
        } else {
          if (stryMutAct_9fa48("4666")) {
            {}
          } else {
            stryCov_9fa48("4666");
            status = stryMutAct_9fa48("4667") ? "" : (stryCov_9fa48("4667"), 'poor');
          }
        }
        if (stryMutAct_9fa48("4670") ? status !== 'poor' : stryMutAct_9fa48("4669") ? false : stryMutAct_9fa48("4668") ? true : (stryCov_9fa48("4668", "4669", "4670"), status === (stryMutAct_9fa48("4671") ? "" : (stryCov_9fa48("4671"), 'poor')))) {
          if (stryMutAct_9fa48("4672")) {
            {}
          } else {
            stryCov_9fa48("4672");
            console.warn(stryMutAct_9fa48("4673") ? `` : (stryCov_9fa48("4673"), `Poor ${stryMutAct_9fa48("4674") ? metric.toLowerCase() : (stryCov_9fa48("4674"), metric.toUpperCase())} detected: ${value}ms`));
            reportPerformanceAlert(metric, value, stryMutAct_9fa48("4675") ? `` : (stryCov_9fa48("4675"), `Poor ${stryMutAct_9fa48("4676") ? metric.toLowerCase() : (stryCov_9fa48("4676"), metric.toUpperCase())} performance`));
          }
        }

        // Track metric in analytics
        trackPerformanceMetric(metric, value, status);
      }
    };

    /**
     * Track performance metric in analytics.
     */
    const trackPerformanceMetric = async (metric: string, value: number, status: 'good' | 'needs-improvement' | 'poor') => {
      if (stryMutAct_9fa48("4677")) {
        {}
      } else {
        stryCov_9fa48("4677");
        try {
          if (stryMutAct_9fa48("4678")) {
            {}
          } else {
            stryCov_9fa48("4678");
            const {
              trackEvent
            } = await import(stryMutAct_9fa48("4679") ? "" : (stryCov_9fa48("4679"), '@/lib/analytics'));
            trackEvent(stryMutAct_9fa48("4680") ? "" : (stryCov_9fa48("4680"), 'performance_metric'), stryMutAct_9fa48("4681") ? {} : (stryCov_9fa48("4681"), {
              metric,
              value,
              status,
              page: router.pathname,
              timestamp: new Date().toISOString()
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("4682")) {
            {}
          } else {
            stryCov_9fa48("4682");
            console.warn(stryMutAct_9fa48("4683") ? "" : (stryCov_9fa48("4683"), 'Failed to track performance metric:'), error);
          }
        }
      }
    };

    /**
     * Report performance alert to monitoring systems.
     */
    const reportPerformanceAlert = async (metric: string, value: number, message: string) => {
      if (stryMutAct_9fa48("4684")) {
        {}
      } else {
        stryCov_9fa48("4684");
        try {
          if (stryMutAct_9fa48("4685")) {
            {}
          } else {
            stryCov_9fa48("4685");
            const {
              trackEvent
            } = await import(stryMutAct_9fa48("4686") ? "" : (stryCov_9fa48("4686"), '@/lib/analytics'));
            trackEvent(stryMutAct_9fa48("4687") ? "" : (stryCov_9fa48("4687"), 'performance_alert'), stryMutAct_9fa48("4688") ? {} : (stryCov_9fa48("4688"), {
              metric,
              value,
              message,
              page: router.pathname,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString()
            }));

            // Report to Sentry if configured
            if (stryMutAct_9fa48("4690") ? false : stryMutAct_9fa48("4689") ? true : (stryCov_9fa48("4689", "4690"), process.env[stryMutAct_9fa48("4691") ? "" : (stryCov_9fa48("4691"), 'NEXT_PUBLIC_SENTRY_DSN')])) {
              if (stryMutAct_9fa48("4692")) {
                {}
              } else {
                stryCov_9fa48("4692");
                const Sentry = await import(stryMutAct_9fa48("4693") ? "" : (stryCov_9fa48("4693"), '@sentry/react'));
                Sentry.addBreadcrumb(stryMutAct_9fa48("4694") ? {} : (stryCov_9fa48("4694"), {
                  category: stryMutAct_9fa48("4695") ? "" : (stryCov_9fa48("4695"), 'performance'),
                  message: stryMutAct_9fa48("4696") ? `` : (stryCov_9fa48("4696"), `Performance alert: ${message}`),
                  level: stryMutAct_9fa48("4697") ? "" : (stryCov_9fa48("4697"), 'warning'),
                  data: stryMutAct_9fa48("4698") ? {} : (stryCov_9fa48("4698"), {
                    metric,
                    value
                  })
                }));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("4699")) {
            {}
          } else {
            stryCov_9fa48("4699");
            console.warn(stryMutAct_9fa48("4700") ? "" : (stryCov_9fa48("4700"), 'Failed to report performance alert:'), error);
          }
        }
      }
    };

    /**
     * Generate performance report for debugging.
     */
    const generatePerformanceReport = () => {
      if (stryMutAct_9fa48("4701")) {
        {}
      } else {
        stryCov_9fa48("4701");
        if (stryMutAct_9fa48("4704") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("4703") ? false : stryMutAct_9fa48("4702") ? true : (stryCov_9fa48("4702", "4703", "4704"), process.env.NODE_ENV === (stryMutAct_9fa48("4705") ? "" : (stryCov_9fa48("4705"), 'development')))) {
          if (stryMutAct_9fa48("4706")) {
            {}
          } else {
            stryCov_9fa48("4706");
            console.group(stryMutAct_9fa48("4707") ? "" : (stryCov_9fa48("4707"), '🏃‍♂️ Performance Report'));
            console.table(metrics);

            // Resource timing summary
            const resources = performance.getEntriesByType(stryMutAct_9fa48("4708") ? "" : (stryCov_9fa48("4708"), 'resource'));
            const resourceSummary = resources.reduce((acc, resource) => {
              if (stryMutAct_9fa48("4709")) {
                {}
              } else {
                stryCov_9fa48("4709");
                const type = stryMutAct_9fa48("4712") ? resource.name.split('.').pop() && 'unknown' : stryMutAct_9fa48("4711") ? false : stryMutAct_9fa48("4710") ? true : (stryCov_9fa48("4710", "4711", "4712"), resource.name.split(stryMutAct_9fa48("4713") ? "" : (stryCov_9fa48("4713"), '.')).pop() || (stryMutAct_9fa48("4714") ? "" : (stryCov_9fa48("4714"), 'unknown')));
                acc[type] = stryMutAct_9fa48("4715") ? (acc[type] || 0) - 1 : (stryCov_9fa48("4715"), (stryMutAct_9fa48("4718") ? acc[type] && 0 : stryMutAct_9fa48("4717") ? false : stryMutAct_9fa48("4716") ? true : (stryCov_9fa48("4716", "4717", "4718"), acc[type] || 0)) + 1);
                return acc;
              }
            }, {} as Record<string, number>);
            console.log(stryMutAct_9fa48("4719") ? "" : (stryCov_9fa48("4719"), 'Resource Summary:'), resourceSummary);
            console.groupEnd();
          }
        }
      }
    };

    // ===========================================================================
    // LIFECYCLE EFFECTS
    // ===========================================================================

    /**
     * Initialize performance monitoring on mount.
     */
    useEffect(() => {
      if (stryMutAct_9fa48("4720")) {
        {}
      } else {
        stryCov_9fa48("4720");
        if (stryMutAct_9fa48("4723") ? false : stryMutAct_9fa48("4722") ? true : stryMutAct_9fa48("4721") ? enabled : (stryCov_9fa48("4721", "4722", "4723"), !enabled)) return;
        navigationStartTime.current = performance.now();

        // Track initial metrics
        setTimeout(() => {
          if (stryMutAct_9fa48("4724")) {
            {}
          } else {
            stryCov_9fa48("4724");
            trackWebVitalsMetrics();
            trackPageLoadMetrics();
            trackMemoryUsage();
            trackBundleSize();
          }
        }, 1000);

        // Set up periodic reporting
        reportingIntervalRef.current = setInterval(() => {
          if (stryMutAct_9fa48("4725")) {
            {}
          } else {
            stryCov_9fa48("4725");
            trackMemoryUsage();
            generatePerformanceReport();
          }
        }, reportingInterval);
        return () => {
          if (stryMutAct_9fa48("4726")) {
            {}
          } else {
            stryCov_9fa48("4726");
            if (stryMutAct_9fa48("4728") ? false : stryMutAct_9fa48("4727") ? true : (stryCov_9fa48("4727", "4728"), reportingIntervalRef.current)) {
              if (stryMutAct_9fa48("4729")) {
                {}
              } else {
                stryCov_9fa48("4729");
                clearInterval(reportingIntervalRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("4730") ? [] : (stryCov_9fa48("4730"), [enabled, reportingInterval]));

    /**
     * Track route changes for SPA navigation performance.
     */
    useEffect(() => {
      if (stryMutAct_9fa48("4731")) {
        {}
      } else {
        stryCov_9fa48("4731");
        if (stryMutAct_9fa48("4734") ? false : stryMutAct_9fa48("4733") ? true : stryMutAct_9fa48("4732") ? enabled : (stryCov_9fa48("4732", "4733", "4734"), !enabled)) return;
        const handleRouteChangeStart = () => {
          if (stryMutAct_9fa48("4735")) {
            {}
          } else {
            stryCov_9fa48("4735");
            navigationStartTime.current = performance.now();
          }
        };
        const handleRouteChangeComplete = () => {
          if (stryMutAct_9fa48("4736")) {
            {}
          } else {
            stryCov_9fa48("4736");
            const navigationTime = stryMutAct_9fa48("4737") ? performance.now() + navigationStartTime.current : (stryCov_9fa48("4737"), performance.now() - navigationStartTime.current);
            trackPerformanceMetric(stryMutAct_9fa48("4738") ? "" : (stryCov_9fa48("4738"), 'spa_navigation'), navigationTime, (stryMutAct_9fa48("4742") ? navigationTime >= 1000 : stryMutAct_9fa48("4741") ? navigationTime <= 1000 : stryMutAct_9fa48("4740") ? false : stryMutAct_9fa48("4739") ? true : (stryCov_9fa48("4739", "4740", "4741", "4742"), navigationTime < 1000)) ? stryMutAct_9fa48("4743") ? "" : (stryCov_9fa48("4743"), 'good') : (stryMutAct_9fa48("4747") ? navigationTime >= 3000 : stryMutAct_9fa48("4746") ? navigationTime <= 3000 : stryMutAct_9fa48("4745") ? false : stryMutAct_9fa48("4744") ? true : (stryCov_9fa48("4744", "4745", "4746", "4747"), navigationTime < 3000)) ? stryMutAct_9fa48("4748") ? "" : (stryCov_9fa48("4748"), 'needs-improvement') : stryMutAct_9fa48("4749") ? "" : (stryCov_9fa48("4749"), 'poor'));
          }
        };
        router.events.on(stryMutAct_9fa48("4750") ? "" : (stryCov_9fa48("4750"), 'routeChangeStart'), handleRouteChangeStart);
        router.events.on(stryMutAct_9fa48("4751") ? "" : (stryCov_9fa48("4751"), 'routeChangeComplete'), handleRouteChangeComplete);
        return () => {
          if (stryMutAct_9fa48("4752")) {
            {}
          } else {
            stryCov_9fa48("4752");
            router.events.off(stryMutAct_9fa48("4753") ? "" : (stryCov_9fa48("4753"), 'routeChangeStart'), handleRouteChangeStart);
            router.events.off(stryMutAct_9fa48("4754") ? "" : (stryCov_9fa48("4754"), 'routeChangeComplete'), handleRouteChangeComplete);
          }
        };
      }
    }, stryMutAct_9fa48("4755") ? [] : (stryCov_9fa48("4755"), [router.events, enabled]));

    // ===========================================================================
    // RENDER
    // ===========================================================================

    return <>
      {children}
      {stryMutAct_9fa48("4758") ? process.env.NODE_ENV === 'development' && enabled || <PerformanceDevTools metrics={metrics} /> : stryMutAct_9fa48("4757") ? false : stryMutAct_9fa48("4756") ? true : (stryCov_9fa48("4756", "4757", "4758"), (stryMutAct_9fa48("4760") ? process.env.NODE_ENV === 'development' || enabled : stryMutAct_9fa48("4759") ? true : (stryCov_9fa48("4759", "4760"), (stryMutAct_9fa48("4762") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("4761") ? true : (stryCov_9fa48("4761", "4762"), process.env.NODE_ENV === (stryMutAct_9fa48("4763") ? "" : (stryCov_9fa48("4763"), 'development')))) && enabled)) && <PerformanceDevTools metrics={metrics} />)}
    </>;
  }
};

// ==============================================================================
// DEVELOPMENT TOOLS
// ==============================================================================

/**
 * Development-only performance visualization component.
 */
const PerformanceDevTools: React.FC<{
  metrics: PerformanceMetrics;
}> = ({
  metrics
}) => {
  if (stryMutAct_9fa48("4764")) {
    {}
  } else {
    stryCov_9fa48("4764");
    const [isVisible, setIsVisible] = useState(stryMutAct_9fa48("4765") ? true : (stryCov_9fa48("4765"), false));
    return <div className="fixed bottom-4 right-4 z-50">
      <button onClick={stryMutAct_9fa48("4766") ? () => undefined : (stryCov_9fa48("4766"), () => setIsVisible(stryMutAct_9fa48("4767") ? isVisible : (stryCov_9fa48("4767"), !isVisible)))} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors">
        🏃‍♂️ Perf
      </button>

      {stryMutAct_9fa48("4770") ? isVisible || <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h3>

          <div className="space-y-2 text-xs">
            {Object.entries(metrics).map(([key, value]) => <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-gray-900 font-mono">
                  {typeof value === 'number' ? key.includes('Size') ? `${value.toFixed(1)}KB` : `${value.toFixed(1)}ms` : 'N/A'}
                </span>
              </div>)}
          </div>

          <button onClick={() => window.performance.mark('manual-performance-check')} className="mt-3 w-full bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs hover:bg-gray-200 transition-colors">
            Mark Performance Point
          </button>
        </div> : stryMutAct_9fa48("4769") ? false : stryMutAct_9fa48("4768") ? true : (stryCov_9fa48("4768", "4769", "4770"), isVisible && <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Metrics</h3>

          <div className="space-y-2 text-xs">
            {Object.entries(metrics).map(stryMutAct_9fa48("4771") ? () => undefined : (stryCov_9fa48("4771"), ([key, value]) => <div key={key} className="flex justify-between">
                <span className="text-gray-600 capitalize">{stryMutAct_9fa48("4772") ? key.replace(/([A-Z])/g, ' $1') : (stryCov_9fa48("4772"), key.replace(stryMutAct_9fa48("4773") ? /([^A-Z])/g : (stryCov_9fa48("4773"), /([A-Z])/g), stryMutAct_9fa48("4774") ? "" : (stryCov_9fa48("4774"), ' $1')).trim())}:</span>
                <span className="text-gray-900 font-mono">
                  {(stryMutAct_9fa48("4777") ? typeof value !== 'number' : stryMutAct_9fa48("4776") ? false : stryMutAct_9fa48("4775") ? true : (stryCov_9fa48("4775", "4776", "4777"), typeof value === (stryMutAct_9fa48("4778") ? "" : (stryCov_9fa48("4778"), 'number')))) ? key.includes(stryMutAct_9fa48("4779") ? "" : (stryCov_9fa48("4779"), 'Size')) ? stryMutAct_9fa48("4780") ? `` : (stryCov_9fa48("4780"), `${value.toFixed(1)}KB`) : stryMutAct_9fa48("4781") ? `` : (stryCov_9fa48("4781"), `${value.toFixed(1)}ms`) : stryMutAct_9fa48("4782") ? "" : (stryCov_9fa48("4782"), 'N/A')}
                </span>
              </div>))}
          </div>

          <button onClick={stryMutAct_9fa48("4783") ? () => undefined : (stryCov_9fa48("4783"), () => window.performance.mark(stryMutAct_9fa48("4784") ? "" : (stryCov_9fa48("4784"), 'manual-performance-check')))} className="mt-3 w-full bg-gray-100 text-gray-700 px-3 py-2 rounded text-xs hover:bg-gray-200 transition-colors">
            Mark Performance Point
          </button>
        </div>)}
    </div>;
  }
};
export default PerformanceMonitor;