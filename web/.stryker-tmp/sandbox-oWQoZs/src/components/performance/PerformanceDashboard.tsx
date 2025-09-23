/**
 * aclue Performance Dashboard Component
 *
 * Real-time performance monitoring dashboard displaying Core Web Vitals,
 * application metrics, and system health indicators.
 *
 * Features:
 *   - Core Web Vitals visualization
 *   - Real-time metrics updates
 *   - Performance trend analysis
 *   - Alert notifications for degradation
 *   - Export capabilities for reports
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
import React, { useEffect, useState, useCallback } from 'react';
import { getPerformanceSummary } from '@/lib/performance-monitoring';
import { Activity, AlertTriangle, CheckCircle, Clock, Database, Download, Gauge, HardDrive, RefreshCw, Server, Zap } from 'lucide-react';
interface MetricData {
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}
interface PerformanceData {
  LCP?: MetricData;
  FID?: MetricData;
  CLS?: MetricData;
  FCP?: MetricData;
  TTFB?: MetricData;
  bundleSize?: MetricData;
  [key: string]: MetricData | undefined;
}
interface BackendMetrics {
  endpoints: Record<string, {
    count: number;
    mean: number;
    p50: number;
    p95: number;
    p99: number;
  }>;
  database: {
    total_queries: number;
    mean_time: number;
    slow_queries: number;
  };
  system: {
    memory: {
      current_mb: number;
      mean_mb: number;
      max_mb: number;
    };
    cpu: {
      current_percent: number;
      mean_percent: number;
      max_percent: number;
    };
  };
  errors: Record<string, {
    count: number;
    types: string[];
  }>;
}
export const PerformanceDashboard: React.FC = () => {
  if (stryMutAct_9fa48("4325")) {
    {}
  } else {
    stryCov_9fa48("4325");
    const [performanceData, setPerformanceData] = useState<PerformanceData>({});
    const [backendMetrics, setBackendMetrics] = useState<BackendMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("4326") ? false : (stryCov_9fa48("4326"), true));
    const [autoRefresh, setAutoRefresh] = useState(stryMutAct_9fa48("4327") ? false : (stryCov_9fa48("4327"), true));
    const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    /**
     * Fetch frontend performance metrics
     */
    const fetchFrontendMetrics = useCallback(() => {
      if (stryMutAct_9fa48("4328")) {
        {}
      } else {
        stryCov_9fa48("4328");
        const summary = getPerformanceSummary();
        setPerformanceData(summary);
        setLastUpdate(new Date());
      }
    }, stryMutAct_9fa48("4329") ? ["Stryker was here"] : (stryCov_9fa48("4329"), []));

    /**
     * Fetch backend performance metrics
     */
    const fetchBackendMetrics = useCallback(async () => {
      if (stryMutAct_9fa48("4330")) {
        {}
      } else {
        stryCov_9fa48("4330");
        try {
          if (stryMutAct_9fa48("4331")) {
            {}
          } else {
            stryCov_9fa48("4331");
            const response = await fetch(stryMutAct_9fa48("4332") ? "" : (stryCov_9fa48("4332"), '/api/performance/summary'));
            if (stryMutAct_9fa48("4334") ? false : stryMutAct_9fa48("4333") ? true : (stryCov_9fa48("4333", "4334"), response.ok)) {
              if (stryMutAct_9fa48("4335")) {
                {}
              } else {
                stryCov_9fa48("4335");
                const data = await response.json();
                setBackendMetrics(data);
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("4336")) {
            {}
          } else {
            stryCov_9fa48("4336");
            console.error(stryMutAct_9fa48("4337") ? "" : (stryCov_9fa48("4337"), 'Failed to fetch backend metrics:'), error);
          }
        }
      }
    }, stryMutAct_9fa48("4338") ? ["Stryker was here"] : (stryCov_9fa48("4338"), []));

    /**
     * Refresh all metrics
     */
    const refreshMetrics = useCallback(() => {
      if (stryMutAct_9fa48("4339")) {
        {}
      } else {
        stryCov_9fa48("4339");
        fetchFrontendMetrics();
        fetchBackendMetrics();
        setIsLoading(stryMutAct_9fa48("4340") ? true : (stryCov_9fa48("4340"), false));
      }
    }, stryMutAct_9fa48("4341") ? [] : (stryCov_9fa48("4341"), [fetchFrontendMetrics, fetchBackendMetrics]));

    /**
     * Set up auto-refresh
     */
    useEffect(() => {
      if (stryMutAct_9fa48("4342")) {
        {}
      } else {
        stryCov_9fa48("4342");
        // Initial load
        refreshMetrics();

        // Set up interval if auto-refresh is enabled
        if (stryMutAct_9fa48("4344") ? false : stryMutAct_9fa48("4343") ? true : (stryCov_9fa48("4343", "4344"), autoRefresh)) {
          if (stryMutAct_9fa48("4345")) {
            {}
          } else {
            stryCov_9fa48("4345");
            const interval = setInterval(refreshMetrics, refreshInterval);
            return stryMutAct_9fa48("4346") ? () => undefined : (stryCov_9fa48("4346"), () => clearInterval(interval));
          }
        }
        return undefined;
      }
    }, stryMutAct_9fa48("4347") ? [] : (stryCov_9fa48("4347"), [autoRefresh, refreshInterval, refreshMetrics]));

    /**
     * Format metric value for display
     */
    const formatMetricValue = (name: string, value: number): string => {
      if (stryMutAct_9fa48("4348")) {
        {}
      } else {
        stryCov_9fa48("4348");
        if (stryMutAct_9fa48("4351") ? name !== 'CLS' : stryMutAct_9fa48("4350") ? false : stryMutAct_9fa48("4349") ? true : (stryCov_9fa48("4349", "4350", "4351"), name === (stryMutAct_9fa48("4352") ? "" : (stryCov_9fa48("4352"), 'CLS')))) {
          if (stryMutAct_9fa48("4353")) {
            {}
          } else {
            stryCov_9fa48("4353");
            return value.toFixed(3);
          }
        }
        if (stryMutAct_9fa48("4356") ? name !== 'bundleSize' : stryMutAct_9fa48("4355") ? false : stryMutAct_9fa48("4354") ? true : (stryCov_9fa48("4354", "4355", "4356"), name === (stryMutAct_9fa48("4357") ? "" : (stryCov_9fa48("4357"), 'bundleSize')))) {
          if (stryMutAct_9fa48("4358")) {
            {}
          } else {
            stryCov_9fa48("4358");
            return stryMutAct_9fa48("4359") ? `` : (stryCov_9fa48("4359"), `${(stryMutAct_9fa48("4360") ? value / 1024 * 1024 : (stryCov_9fa48("4360"), (stryMutAct_9fa48("4361") ? value * 1024 : (stryCov_9fa48("4361"), value / 1024)) / 1024)).toFixed(2)}MB`);
          }
        }
        return stryMutAct_9fa48("4362") ? `` : (stryCov_9fa48("4362"), `${Math.round(value)}ms`);
      }
    };

    /**
     * Get status color based on rating
     */
    // const getStatusColor = (rating: string): string => {
    //   switch (rating) {
    //     case 'good':
    //       return 'text-green-600 bg-green-100';
    //     case 'needs-improvement':
    //       return 'text-yellow-600 bg-yellow-100';
    //     case 'poor':
    //       return 'text-red-600 bg-red-100';
    //     default:
    //       return 'text-gray-600 bg-gray-100';
    //   }
    // };

    /**
     * Get status icon based on rating
     */
    const getStatusIcon = (rating: string) => {
      if (stryMutAct_9fa48("4363")) {
        {}
      } else {
        stryCov_9fa48("4363");
        switch (rating) {
          case stryMutAct_9fa48("4365") ? "" : (stryCov_9fa48("4365"), 'good'):
            if (stryMutAct_9fa48("4364")) {} else {
              stryCov_9fa48("4364");
              return <CheckCircle className="w-5 h-5" />;
            }
          case stryMutAct_9fa48("4367") ? "" : (stryCov_9fa48("4367"), 'needs-improvement'):
            if (stryMutAct_9fa48("4366")) {} else {
              stryCov_9fa48("4366");
              return <AlertTriangle className="w-5 h-5" />;
            }
          case stryMutAct_9fa48("4369") ? "" : (stryCov_9fa48("4369"), 'poor'):
            if (stryMutAct_9fa48("4368")) {} else {
              stryCov_9fa48("4368");
              return <AlertTriangle className="w-5 h-5" />;
            }
          default:
            if (stryMutAct_9fa48("4370")) {} else {
              stryCov_9fa48("4370");
              return <Activity className="w-5 h-5" />;
            }
        }
      }
    };

    /**
     * Export performance report
     */
    const exportReport = () => {
      if (stryMutAct_9fa48("4371")) {
        {}
      } else {
        stryCov_9fa48("4371");
        const report = stryMutAct_9fa48("4372") ? {} : (stryCov_9fa48("4372"), {
          timestamp: new Date().toISOString(),
          frontend: performanceData,
          backend: backendMetrics
        });
        const blob = new Blob(stryMutAct_9fa48("4373") ? [] : (stryCov_9fa48("4373"), [JSON.stringify(report, null, 2)]), stryMutAct_9fa48("4374") ? {} : (stryCov_9fa48("4374"), {
          type: stryMutAct_9fa48("4375") ? "" : (stryCov_9fa48("4375"), 'application/json')
        }));
        const url = URL.createObjectURL(blob);
        const a = document.createElement(stryMutAct_9fa48("4376") ? "" : (stryCov_9fa48("4376"), 'a'));
        a.href = url;
        a.download = stryMutAct_9fa48("4377") ? `` : (stryCov_9fa48("4377"), `performance-report-${Date.now()}.json`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };
    if (stryMutAct_9fa48("4379") ? false : stryMutAct_9fa48("4378") ? true : (stryCov_9fa48("4378", "4379"), isLoading)) {
      if (stryMutAct_9fa48("4380")) {
        {}
      } else {
        stryCov_9fa48("4380");
        return <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading performance metrics...</span>
      </div>;
      }
    }
    return <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Auto-refresh toggle */}
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={autoRefresh} onChange={stryMutAct_9fa48("4381") ? () => undefined : (stryCov_9fa48("4381"), e => setAutoRefresh(e.target.checked))} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>

          {/* Refresh interval selector */}
          {stryMutAct_9fa48("4384") ? autoRefresh || <select value={refreshInterval} onChange={e => setRefreshInterval(Number(e.target.value))} className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
            </select> : stryMutAct_9fa48("4383") ? false : stryMutAct_9fa48("4382") ? true : (stryCov_9fa48("4382", "4383", "4384"), autoRefresh && <select value={refreshInterval} onChange={stryMutAct_9fa48("4385") ? () => undefined : (stryCov_9fa48("4385"), e => setRefreshInterval(Number(e.target.value)))} className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
            </select>)}

          {/* Manual refresh */}
          <button onClick={refreshMetrics} className="p-2 text-gray-600 hover:text-gray-900 transition-colors" title="Refresh now">
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Export report */}
          <button onClick={exportReport} className="p-2 text-gray-600 hover:text-gray-900 transition-colors" title="Export report">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Core Web Vitals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* LCP - Largest Contentful Paint */}
          {stryMutAct_9fa48("4388") ? performanceData.LCP || <MetricCard title="LCP" description="Largest Contentful Paint" value={formatMetricValue('LCP', performanceData.LCP.value)} rating={performanceData.LCP.rating} target="< 2.5s" icon={<Clock className="w-8 h-8" />} /> : stryMutAct_9fa48("4387") ? false : stryMutAct_9fa48("4386") ? true : (stryCov_9fa48("4386", "4387", "4388"), performanceData.LCP && <MetricCard title="LCP" description="Largest Contentful Paint" value={formatMetricValue(stryMutAct_9fa48("4389") ? "" : (stryCov_9fa48("4389"), 'LCP'), performanceData.LCP.value)} rating={performanceData.LCP.rating} target="< 2.5s" icon={<Clock className="w-8 h-8" />} />)}

          {/* FID - First Input Delay */}
          {stryMutAct_9fa48("4392") ? performanceData.FID || <MetricCard title="FID" description="First Input Delay" value={formatMetricValue('FID', performanceData.FID.value)} rating={performanceData.FID.rating} target="< 100ms" icon={<Activity className="w-8 h-8" />} /> : stryMutAct_9fa48("4391") ? false : stryMutAct_9fa48("4390") ? true : (stryCov_9fa48("4390", "4391", "4392"), performanceData.FID && <MetricCard title="FID" description="First Input Delay" value={formatMetricValue(stryMutAct_9fa48("4393") ? "" : (stryCov_9fa48("4393"), 'FID'), performanceData.FID.value)} rating={performanceData.FID.rating} target="< 100ms" icon={<Activity className="w-8 h-8" />} />)}

          {/* CLS - Cumulative Layout Shift */}
          {stryMutAct_9fa48("4396") ? performanceData.CLS || <MetricCard title="CLS" description="Cumulative Layout Shift" value={formatMetricValue('CLS', performanceData.CLS.value)} rating={performanceData.CLS.rating} target="< 0.1" icon={<Gauge className="w-8 h-8" />} /> : stryMutAct_9fa48("4395") ? false : stryMutAct_9fa48("4394") ? true : (stryCov_9fa48("4394", "4395", "4396"), performanceData.CLS && <MetricCard title="CLS" description="Cumulative Layout Shift" value={formatMetricValue(stryMutAct_9fa48("4397") ? "" : (stryCov_9fa48("4397"), 'CLS'), performanceData.CLS.value)} rating={performanceData.CLS.rating} target="< 0.1" icon={<Gauge className="w-8 h-8" />} />)}

          {/* FCP - First Contentful Paint */}
          {stryMutAct_9fa48("4400") ? performanceData.FCP || <MetricCard title="FCP" description="First Contentful Paint" value={formatMetricValue('FCP', performanceData.FCP.value)} rating={performanceData.FCP.rating} target="< 1.8s" icon={<Zap className="w-8 h-8" />} /> : stryMutAct_9fa48("4399") ? false : stryMutAct_9fa48("4398") ? true : (stryCov_9fa48("4398", "4399", "4400"), performanceData.FCP && <MetricCard title="FCP" description="First Contentful Paint" value={formatMetricValue(stryMutAct_9fa48("4401") ? "" : (stryCov_9fa48("4401"), 'FCP'), performanceData.FCP.value)} rating={performanceData.FCP.rating} target="< 1.8s" icon={<Zap className="w-8 h-8" />} />)}

          {/* TTFB - Time to First Byte */}
          {stryMutAct_9fa48("4404") ? performanceData.TTFB || <MetricCard title="TTFB" description="Time to First Byte" value={formatMetricValue('TTFB', performanceData.TTFB.value)} rating={performanceData.TTFB.rating} target="< 600ms" icon={<Server className="w-8 h-8" />} /> : stryMutAct_9fa48("4403") ? false : stryMutAct_9fa48("4402") ? true : (stryCov_9fa48("4402", "4403", "4404"), performanceData.TTFB && <MetricCard title="TTFB" description="Time to First Byte" value={formatMetricValue(stryMutAct_9fa48("4405") ? "" : (stryCov_9fa48("4405"), 'TTFB'), performanceData.TTFB.value)} rating={performanceData.TTFB.rating} target="< 600ms" icon={<Server className="w-8 h-8" />} />)}
        </div>
      </div>

      {/* Application Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Application Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bundle Size */}
          {stryMutAct_9fa48("4408") ? performanceData.bundleSize || <MetricCard title="Bundle Size" description="JavaScript bundle size" value={formatMetricValue('bundleSize', performanceData.bundleSize.value)} rating={performanceData.bundleSize.rating} target="< 500KB" icon={<HardDrive className="w-8 h-8" />} /> : stryMutAct_9fa48("4407") ? false : stryMutAct_9fa48("4406") ? true : (stryCov_9fa48("4406", "4407", "4408"), performanceData.bundleSize && <MetricCard title="Bundle Size" description="JavaScript bundle size" value={formatMetricValue(stryMutAct_9fa48("4409") ? "" : (stryCov_9fa48("4409"), 'bundleSize'), performanceData.bundleSize.value)} rating={performanceData.bundleSize.rating} target="< 500KB" icon={<HardDrive className="w-8 h-8" />} />)}

          {/* API Response Time */}
          {stryMutAct_9fa48("4412") ? backendMetrics?.endpoints && Object.keys(backendMetrics.endpoints).length > 0 || <MetricCard title="API Response" description="Average response time" value={`${Math.round(Object.values(backendMetrics.endpoints).reduce((sum, ep) => sum + ep.mean, 0) / Object.keys(backendMetrics.endpoints).length * 1000)}ms`} rating={Object.values(backendMetrics.endpoints).reduce((sum, ep) => sum + ep.mean, 0) / Object.keys(backendMetrics.endpoints).length < 0.2 ? 'good' : 'needs-improvement'} target="< 200ms" icon={<Server className="w-8 h-8" />} /> : stryMutAct_9fa48("4411") ? false : stryMutAct_9fa48("4410") ? true : (stryCov_9fa48("4410", "4411", "4412"), (stryMutAct_9fa48("4414") ? backendMetrics?.endpoints || Object.keys(backendMetrics.endpoints).length > 0 : stryMutAct_9fa48("4413") ? true : (stryCov_9fa48("4413", "4414"), (stryMutAct_9fa48("4415") ? backendMetrics.endpoints : (stryCov_9fa48("4415"), backendMetrics?.endpoints)) && (stryMutAct_9fa48("4418") ? Object.keys(backendMetrics.endpoints).length <= 0 : stryMutAct_9fa48("4417") ? Object.keys(backendMetrics.endpoints).length >= 0 : stryMutAct_9fa48("4416") ? true : (stryCov_9fa48("4416", "4417", "4418"), Object.keys(backendMetrics.endpoints).length > 0)))) && <MetricCard title="API Response" description="Average response time" value={stryMutAct_9fa48("4419") ? `` : (stryCov_9fa48("4419"), `${Math.round(stryMutAct_9fa48("4420") ? Object.values(backendMetrics.endpoints).reduce((sum, ep) => sum + ep.mean, 0) / Object.keys(backendMetrics.endpoints).length / 1000 : (stryCov_9fa48("4420"), (stryMutAct_9fa48("4421") ? Object.values(backendMetrics.endpoints).reduce((sum, ep) => sum + ep.mean, 0) * Object.keys(backendMetrics.endpoints).length : (stryCov_9fa48("4421"), Object.values(backendMetrics.endpoints).reduce(stryMutAct_9fa48("4422") ? () => undefined : (stryCov_9fa48("4422"), (sum, ep) => stryMutAct_9fa48("4423") ? sum - ep.mean : (stryCov_9fa48("4423"), sum + ep.mean)), 0) / Object.keys(backendMetrics.endpoints).length)) * 1000))}ms`)} rating={(stryMutAct_9fa48("4427") ? Object.values(backendMetrics.endpoints).reduce((sum, ep) => sum + ep.mean, 0) / Object.keys(backendMetrics.endpoints).length >= 0.2 : stryMutAct_9fa48("4426") ? Object.values(backendMetrics.endpoints).reduce((sum, ep) => sum + ep.mean, 0) / Object.keys(backendMetrics.endpoints).length <= 0.2 : stryMutAct_9fa48("4425") ? false : stryMutAct_9fa48("4424") ? true : (stryCov_9fa48("4424", "4425", "4426", "4427"), (stryMutAct_9fa48("4428") ? Object.values(backendMetrics.endpoints).reduce((sum, ep) => sum + ep.mean, 0) * Object.keys(backendMetrics.endpoints).length : (stryCov_9fa48("4428"), Object.values(backendMetrics.endpoints).reduce(stryMutAct_9fa48("4429") ? () => undefined : (stryCov_9fa48("4429"), (sum, ep) => stryMutAct_9fa48("4430") ? sum - ep.mean : (stryCov_9fa48("4430"), sum + ep.mean)), 0) / Object.keys(backendMetrics.endpoints).length)) < 0.2)) ? stryMutAct_9fa48("4431") ? "" : (stryCov_9fa48("4431"), 'good') : stryMutAct_9fa48("4432") ? "" : (stryCov_9fa48("4432"), 'needs-improvement')} target="< 200ms" icon={<Server className="w-8 h-8" />} />)}

          {/* Database Performance */}
          {stryMutAct_9fa48("4435") ? backendMetrics?.database || <MetricCard title="Database" description="Query response time" value={`${Math.round(backendMetrics.database.mean_time * 1000)}ms`} rating={backendMetrics.database.mean_time < 0.05 ? 'good' : backendMetrics.database.mean_time < 0.1 ? 'needs-improvement' : 'poor'} target="< 50ms" icon={<Database className="w-8 h-8" />} /> : stryMutAct_9fa48("4434") ? false : stryMutAct_9fa48("4433") ? true : (stryCov_9fa48("4433", "4434", "4435"), (stryMutAct_9fa48("4436") ? backendMetrics.database : (stryCov_9fa48("4436"), backendMetrics?.database)) && <MetricCard title="Database" description="Query response time" value={stryMutAct_9fa48("4437") ? `` : (stryCov_9fa48("4437"), `${Math.round(stryMutAct_9fa48("4438") ? backendMetrics.database.mean_time / 1000 : (stryCov_9fa48("4438"), backendMetrics.database.mean_time * 1000))}ms`)} rating={(stryMutAct_9fa48("4442") ? backendMetrics.database.mean_time >= 0.05 : stryMutAct_9fa48("4441") ? backendMetrics.database.mean_time <= 0.05 : stryMutAct_9fa48("4440") ? false : stryMutAct_9fa48("4439") ? true : (stryCov_9fa48("4439", "4440", "4441", "4442"), backendMetrics.database.mean_time < 0.05)) ? stryMutAct_9fa48("4443") ? "" : (stryCov_9fa48("4443"), 'good') : (stryMutAct_9fa48("4447") ? backendMetrics.database.mean_time >= 0.1 : stryMutAct_9fa48("4446") ? backendMetrics.database.mean_time <= 0.1 : stryMutAct_9fa48("4445") ? false : stryMutAct_9fa48("4444") ? true : (stryCov_9fa48("4444", "4445", "4446", "4447"), backendMetrics.database.mean_time < 0.1)) ? stryMutAct_9fa48("4448") ? "" : (stryCov_9fa48("4448"), 'needs-improvement') : stryMutAct_9fa48("4449") ? "" : (stryCov_9fa48("4449"), 'poor')} target="< 50ms" icon={<Database className="w-8 h-8" />} />)}

          {/* Error Rate */}
          {stryMutAct_9fa48("4452") ? backendMetrics?.errors || <MetricCard title="Error Rate" description="Application errors" value={`${Object.values(backendMetrics.errors).reduce((sum, err) => sum + err.count, 0)} errors`} rating={Object.keys(backendMetrics.errors).length === 0 ? 'good' : Object.values(backendMetrics.errors).reduce((sum, err) => sum + err.count, 0) < 5 ? 'needs-improvement' : 'poor'} target="< 0.1%" icon={<AlertTriangle className="w-8 h-8" />} /> : stryMutAct_9fa48("4451") ? false : stryMutAct_9fa48("4450") ? true : (stryCov_9fa48("4450", "4451", "4452"), (stryMutAct_9fa48("4453") ? backendMetrics.errors : (stryCov_9fa48("4453"), backendMetrics?.errors)) && <MetricCard title="Error Rate" description="Application errors" value={stryMutAct_9fa48("4454") ? `` : (stryCov_9fa48("4454"), `${Object.values(backendMetrics.errors).reduce(stryMutAct_9fa48("4455") ? () => undefined : (stryCov_9fa48("4455"), (sum, err) => stryMutAct_9fa48("4456") ? sum - err.count : (stryCov_9fa48("4456"), sum + err.count)), 0)} errors`)} rating={(stryMutAct_9fa48("4459") ? Object.keys(backendMetrics.errors).length !== 0 : stryMutAct_9fa48("4458") ? false : stryMutAct_9fa48("4457") ? true : (stryCov_9fa48("4457", "4458", "4459"), Object.keys(backendMetrics.errors).length === 0)) ? stryMutAct_9fa48("4460") ? "" : (stryCov_9fa48("4460"), 'good') : (stryMutAct_9fa48("4464") ? Object.values(backendMetrics.errors).reduce((sum, err) => sum + err.count, 0) >= 5 : stryMutAct_9fa48("4463") ? Object.values(backendMetrics.errors).reduce((sum, err) => sum + err.count, 0) <= 5 : stryMutAct_9fa48("4462") ? false : stryMutAct_9fa48("4461") ? true : (stryCov_9fa48("4461", "4462", "4463", "4464"), Object.values(backendMetrics.errors).reduce(stryMutAct_9fa48("4465") ? () => undefined : (stryCov_9fa48("4465"), (sum, err) => stryMutAct_9fa48("4466") ? sum - err.count : (stryCov_9fa48("4466"), sum + err.count)), 0) < 5)) ? stryMutAct_9fa48("4467") ? "" : (stryCov_9fa48("4467"), 'needs-improvement') : stryMutAct_9fa48("4468") ? "" : (stryCov_9fa48("4468"), 'poor')} target="< 0.1%" icon={<AlertTriangle className="w-8 h-8" />} />)}
        </div>
      </div>

      {/* System Resources */}
      {stryMutAct_9fa48("4471") ? backendMetrics?.system || <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            System Resources
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-medium text-gray-900 mb-4">Memory Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.memory.current_mb.toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.memory.mean_mb.toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Peak</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.memory.max_mb.toFixed(2)} MB
                  </span>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{
                    width: `${Math.min(backendMetrics.system.memory.current_mb / 512 * 100, 100)}%`
                  }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target: &lt; 512MB</p>
                </div>
              </div>
            </div>

            {/* CPU Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-medium text-gray-900 mb-4">CPU Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.cpu.current_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.cpu.mean_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Peak</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.cpu.max_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${backendMetrics.system.cpu.current_percent < 50 ? 'bg-green-500' : backendMetrics.system.cpu.current_percent < 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                    width: `${Math.min(backendMetrics.system.cpu.current_percent, 100)}%`
                  }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target: &lt; 70%</p>
                </div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("4470") ? false : stryMutAct_9fa48("4469") ? true : (stryCov_9fa48("4469", "4470", "4471"), (stryMutAct_9fa48("4472") ? backendMetrics.system : (stryCov_9fa48("4472"), backendMetrics?.system)) && <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            System Resources
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Memory Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-medium text-gray-900 mb-4">Memory Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.memory.current_mb.toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.memory.mean_mb.toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Peak</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.memory.max_mb.toFixed(2)} MB
                  </span>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={stryMutAct_9fa48("4473") ? {} : (stryCov_9fa48("4473"), {
                    width: stryMutAct_9fa48("4474") ? `` : (stryCov_9fa48("4474"), `${stryMutAct_9fa48("4475") ? Math.max(backendMetrics.system.memory.current_mb / 512 * 100, 100) : (stryCov_9fa48("4475"), Math.min(stryMutAct_9fa48("4476") ? backendMetrics.system.memory.current_mb / 512 / 100 : (stryCov_9fa48("4476"), (stryMutAct_9fa48("4477") ? backendMetrics.system.memory.current_mb * 512 : (stryCov_9fa48("4477"), backendMetrics.system.memory.current_mb / 512)) * 100), 100))}%`)
                  })} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target: &lt; 512MB</p>
                </div>
              </div>
            </div>

            {/* CPU Usage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="font-medium text-gray-900 mb-4">CPU Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.cpu.current_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.cpu.mean_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Peak</span>
                  <span className="text-sm font-medium">
                    {backendMetrics.system.cpu.max_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className={stryMutAct_9fa48("4478") ? `` : (stryCov_9fa48("4478"), `h-2 rounded-full transition-all ${(stryMutAct_9fa48("4482") ? backendMetrics.system.cpu.current_percent >= 50 : stryMutAct_9fa48("4481") ? backendMetrics.system.cpu.current_percent <= 50 : stryMutAct_9fa48("4480") ? false : stryMutAct_9fa48("4479") ? true : (stryCov_9fa48("4479", "4480", "4481", "4482"), backendMetrics.system.cpu.current_percent < 50)) ? stryMutAct_9fa48("4483") ? "" : (stryCov_9fa48("4483"), 'bg-green-500') : (stryMutAct_9fa48("4487") ? backendMetrics.system.cpu.current_percent >= 70 : stryMutAct_9fa48("4486") ? backendMetrics.system.cpu.current_percent <= 70 : stryMutAct_9fa48("4485") ? false : stryMutAct_9fa48("4484") ? true : (stryCov_9fa48("4484", "4485", "4486", "4487"), backendMetrics.system.cpu.current_percent < 70)) ? stryMutAct_9fa48("4488") ? "" : (stryCov_9fa48("4488"), 'bg-yellow-500') : stryMutAct_9fa48("4489") ? "" : (stryCov_9fa48("4489"), 'bg-red-500')}`)} style={stryMutAct_9fa48("4490") ? {} : (stryCov_9fa48("4490"), {
                    width: stryMutAct_9fa48("4491") ? `` : (stryCov_9fa48("4491"), `${stryMutAct_9fa48("4492") ? Math.max(backendMetrics.system.cpu.current_percent, 100) : (stryCov_9fa48("4492"), Math.min(backendMetrics.system.cpu.current_percent, 100))}%`)
                  })} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target: &lt; 70%</p>
                </div>
              </div>
            </div>
          </div>
        </div>)}

      {/* Endpoint Performance */}
      {stryMutAct_9fa48("4495") ? backendMetrics?.endpoints && Object.keys(backendMetrics.endpoints).length > 0 || <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Endpoint Performance
          </h3>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mean
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P50
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P95
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P99
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(backendMetrics.endpoints).sort(([, a], [, b]) => b.count - a.count).slice(0, 10).map(([endpoint, metrics]) => <tr key={endpoint}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metrics.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.mean * 1000)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.p50 * 1000)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.p95 * 1000)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.p99 * 1000)}ms
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>
        </div> : stryMutAct_9fa48("4494") ? false : stryMutAct_9fa48("4493") ? true : (stryCov_9fa48("4493", "4494", "4495"), (stryMutAct_9fa48("4497") ? backendMetrics?.endpoints || Object.keys(backendMetrics.endpoints).length > 0 : stryMutAct_9fa48("4496") ? true : (stryCov_9fa48("4496", "4497"), (stryMutAct_9fa48("4498") ? backendMetrics.endpoints : (stryCov_9fa48("4498"), backendMetrics?.endpoints)) && (stryMutAct_9fa48("4501") ? Object.keys(backendMetrics.endpoints).length <= 0 : stryMutAct_9fa48("4500") ? Object.keys(backendMetrics.endpoints).length >= 0 : stryMutAct_9fa48("4499") ? true : (stryCov_9fa48("4499", "4500", "4501"), Object.keys(backendMetrics.endpoints).length > 0)))) && <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Endpoint Performance
          </h3>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mean
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P50
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P95
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P99
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stryMutAct_9fa48("4503") ? Object.entries(backendMetrics.endpoints).slice(0, 10).map(([endpoint, metrics]) => <tr key={endpoint}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metrics.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.mean * 1000)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.p50 * 1000)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.p95 * 1000)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.p99 * 1000)}ms
                      </td>
                    </tr>) : stryMutAct_9fa48("4502") ? Object.entries(backendMetrics.endpoints).sort(([, a], [, b]) => b.count - a.count).map(([endpoint, metrics]) => <tr key={endpoint}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metrics.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.mean * 1000)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.p50 * 1000)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.p95 * 1000)}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(metrics.p99 * 1000)}ms
                      </td>
                    </tr>) : (stryCov_9fa48("4502", "4503"), Object.entries(backendMetrics.endpoints).sort(stryMutAct_9fa48("4504") ? () => undefined : (stryCov_9fa48("4504"), ([, a], [, b]) => stryMutAct_9fa48("4505") ? b.count + a.count : (stryCov_9fa48("4505"), b.count - a.count))).slice(0, 10).map(stryMutAct_9fa48("4506") ? () => undefined : (stryCov_9fa48("4506"), ([endpoint, metrics]) => <tr key={endpoint}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {endpoint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metrics.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(stryMutAct_9fa48("4507") ? metrics.mean / 1000 : (stryCov_9fa48("4507"), metrics.mean * 1000))}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(stryMutAct_9fa48("4508") ? metrics.p50 / 1000 : (stryCov_9fa48("4508"), metrics.p50 * 1000))}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(stryMutAct_9fa48("4509") ? metrics.p95 / 1000 : (stryCov_9fa48("4509"), metrics.p95 * 1000))}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.round(stryMutAct_9fa48("4510") ? metrics.p99 / 1000 : (stryCov_9fa48("4510"), metrics.p99 * 1000))}ms
                      </td>
                    </tr>)))}
              </tbody>
            </table>
          </div>
        </div>)}
    </div>;
  }
};

/**
 * Metric Card Component
 */
interface MetricCardProps {
  title: string;
  description: string;
  value: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  target: string;
  icon: React.ReactNode;
}
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  description,
  value,
  rating,
  target,
  icon
}) => {
  if (stryMutAct_9fa48("4511")) {
    {}
  } else {
    stryCov_9fa48("4511");
    const statusColors = stryMutAct_9fa48("4512") ? {} : (stryCov_9fa48("4512"), {
      good: stryMutAct_9fa48("4513") ? "" : (stryCov_9fa48("4513"), 'bg-green-50 border-green-200'),
      'needs-improvement': stryMutAct_9fa48("4514") ? "" : (stryCov_9fa48("4514"), 'bg-yellow-50 border-yellow-200'),
      poor: stryMutAct_9fa48("4515") ? "" : (stryCov_9fa48("4515"), 'bg-red-50 border-red-200')
    });
    const textColors = stryMutAct_9fa48("4516") ? {} : (stryCov_9fa48("4516"), {
      good: stryMutAct_9fa48("4517") ? "" : (stryCov_9fa48("4517"), 'text-green-800'),
      'needs-improvement': stryMutAct_9fa48("4518") ? "" : (stryCov_9fa48("4518"), 'text-yellow-800'),
      poor: stryMutAct_9fa48("4519") ? "" : (stryCov_9fa48("4519"), 'text-red-800')
    });
    const iconColors = stryMutAct_9fa48("4520") ? {} : (stryCov_9fa48("4520"), {
      good: stryMutAct_9fa48("4521") ? "" : (stryCov_9fa48("4521"), 'text-green-500'),
      'needs-improvement': stryMutAct_9fa48("4522") ? "" : (stryCov_9fa48("4522"), 'text-yellow-500'),
      poor: stryMutAct_9fa48("4523") ? "" : (stryCov_9fa48("4523"), 'text-red-500')
    });
    return <div className={stryMutAct_9fa48("4524") ? `` : (stryCov_9fa48("4524"), `rounded-lg border p-4 ${statusColors[rating]}`)}>
      <div className="flex items-start justify-between mb-2">
        <div className={iconColors[rating]}>{icon}</div>
        <div className="flex items-center">
          {stryMutAct_9fa48("4527") ? rating === 'good' || <CheckCircle className="w-4 h-4 text-green-500" /> : stryMutAct_9fa48("4526") ? false : stryMutAct_9fa48("4525") ? true : (stryCov_9fa48("4525", "4526", "4527"), (stryMutAct_9fa48("4529") ? rating !== 'good' : stryMutAct_9fa48("4528") ? true : (stryCov_9fa48("4528", "4529"), rating === (stryMutAct_9fa48("4530") ? "" : (stryCov_9fa48("4530"), 'good')))) && <CheckCircle className="w-4 h-4 text-green-500" />)}
          {stryMutAct_9fa48("4533") ? rating === 'needs-improvement' || <AlertTriangle className="w-4 h-4 text-yellow-500" /> : stryMutAct_9fa48("4532") ? false : stryMutAct_9fa48("4531") ? true : (stryCov_9fa48("4531", "4532", "4533"), (stryMutAct_9fa48("4535") ? rating !== 'needs-improvement' : stryMutAct_9fa48("4534") ? true : (stryCov_9fa48("4534", "4535"), rating === (stryMutAct_9fa48("4536") ? "" : (stryCov_9fa48("4536"), 'needs-improvement')))) && <AlertTriangle className="w-4 h-4 text-yellow-500" />)}
          {stryMutAct_9fa48("4539") ? rating === 'poor' || <AlertTriangle className="w-4 h-4 text-red-500" /> : stryMutAct_9fa48("4538") ? false : stryMutAct_9fa48("4537") ? true : (stryCov_9fa48("4537", "4538", "4539"), (stryMutAct_9fa48("4541") ? rating !== 'poor' : stryMutAct_9fa48("4540") ? true : (stryCov_9fa48("4540", "4541"), rating === (stryMutAct_9fa48("4542") ? "" : (stryCov_9fa48("4542"), 'poor')))) && <AlertTriangle className="w-4 h-4 text-red-500" />)}
        </div>
      </div>

      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-xs text-gray-600 mt-1">{description}</p>

      <div className="mt-3">
        <p className={stryMutAct_9fa48("4543") ? `` : (stryCov_9fa48("4543"), `text-2xl font-bold ${textColors[rating]}`)}>{value}</p>
        <p className="text-xs text-gray-500 mt-1">Target: {target}</p>
      </div>
    </div>;
  }
};
export default PerformanceDashboard;