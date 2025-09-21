/**
 * Aclue Performance Dashboard Component
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

import React, { useEffect, useState, useCallback } from 'react';
import { getPerformanceSummary } from '@/lib/performance-monitoring';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Download,
  Gauge,
  HardDrive,
  RefreshCw,
  Server,
  Zap
} from 'lucide-react';

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
  const [performanceData, setPerformanceData] = useState<PerformanceData>({});
  const [backendMetrics, setBackendMetrics] = useState<BackendMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  /**
   * Fetch frontend performance metrics
   */
  const fetchFrontendMetrics = useCallback(() => {
    const summary = getPerformanceSummary();
    setPerformanceData(summary);
    setLastUpdate(new Date());
  }, []);

  /**
   * Fetch backend performance metrics
   */
  const fetchBackendMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/performance/summary');
      if (response.ok) {
        const data = await response.json();
        setBackendMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch backend metrics:', error);
    }
  }, []);

  /**
   * Refresh all metrics
   */
  const refreshMetrics = useCallback(() => {
    fetchFrontendMetrics();
    fetchBackendMetrics();
    setIsLoading(false);
  }, [fetchFrontendMetrics, fetchBackendMetrics]);

  /**
   * Set up auto-refresh
   */
  useEffect(() => {
    // Initial load
    refreshMetrics();

    // Set up interval if auto-refresh is enabled
    if (autoRefresh) {
      const interval = setInterval(refreshMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh, refreshInterval, refreshMetrics]);

  /**
   * Format metric value for display
   */
  const formatMetricValue = (name: string, value: number): string => {
    if (name === 'CLS') {
      return value.toFixed(3);
    }
    if (name === 'bundleSize') {
      return `${(value / 1024 / 1024).toFixed(2)}MB`;
    }
    return `${Math.round(value)}ms`;
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
    switch (rating) {
      case 'good':
        return <CheckCircle className="w-5 h-5" />;
      case 'needs-improvement':
        return <AlertTriangle className="w-5 h-5" />;
      case 'poor':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  /**
   * Export performance report
   */
  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      frontend: performanceData,
      backend: backendMetrics,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading performance metrics...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>

          {/* Refresh interval selector */}
          {autoRefresh && (
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
              <option value={30000}>30s</option>
              <option value={60000}>1m</option>
            </select>
          )}

          {/* Manual refresh */}
          <button
            onClick={refreshMetrics}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Refresh now"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Export report */}
          <button
            onClick={exportReport}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            title="Export report"
          >
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
          {performanceData.LCP && (
            <MetricCard
              title="LCP"
              description="Largest Contentful Paint"
              value={formatMetricValue('LCP', performanceData.LCP.value)}
              rating={performanceData.LCP.rating}
              target="< 2.5s"
              icon={<Clock className="w-8 h-8" />}
            />
          )}

          {/* FID - First Input Delay */}
          {performanceData.FID && (
            <MetricCard
              title="FID"
              description="First Input Delay"
              value={formatMetricValue('FID', performanceData.FID.value)}
              rating={performanceData.FID.rating}
              target="< 100ms"
              icon={<Activity className="w-8 h-8" />}
            />
          )}

          {/* CLS - Cumulative Layout Shift */}
          {performanceData.CLS && (
            <MetricCard
              title="CLS"
              description="Cumulative Layout Shift"
              value={formatMetricValue('CLS', performanceData.CLS.value)}
              rating={performanceData.CLS.rating}
              target="< 0.1"
              icon={<Gauge className="w-8 h-8" />}
            />
          )}

          {/* FCP - First Contentful Paint */}
          {performanceData.FCP && (
            <MetricCard
              title="FCP"
              description="First Contentful Paint"
              value={formatMetricValue('FCP', performanceData.FCP.value)}
              rating={performanceData.FCP.rating}
              target="< 1.8s"
              icon={<Zap className="w-8 h-8" />}
            />
          )}

          {/* TTFB - Time to First Byte */}
          {performanceData.TTFB && (
            <MetricCard
              title="TTFB"
              description="Time to First Byte"
              value={formatMetricValue('TTFB', performanceData.TTFB.value)}
              rating={performanceData.TTFB.rating}
              target="< 600ms"
              icon={<Server className="w-8 h-8" />}
            />
          )}
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
          {performanceData.bundleSize && (
            <MetricCard
              title="Bundle Size"
              description="JavaScript bundle size"
              value={formatMetricValue('bundleSize', performanceData.bundleSize.value)}
              rating={performanceData.bundleSize.rating}
              target="< 500KB"
              icon={<HardDrive className="w-8 h-8" />}
            />
          )}

          {/* API Response Time */}
          {backendMetrics?.endpoints && Object.keys(backendMetrics.endpoints).length > 0 && (
            <MetricCard
              title="API Response"
              description="Average response time"
              value={`${Math.round(
                Object.values(backendMetrics.endpoints)
                  .reduce((sum, ep) => sum + ep.mean, 0) /
                Object.keys(backendMetrics.endpoints).length * 1000
              )}ms`}
              rating={
                Object.values(backendMetrics.endpoints)
                  .reduce((sum, ep) => sum + ep.mean, 0) /
                Object.keys(backendMetrics.endpoints).length < 0.2
                  ? 'good'
                  : 'needs-improvement'
              }
              target="< 200ms"
              icon={<Server className="w-8 h-8" />}
            />
          )}

          {/* Database Performance */}
          {backendMetrics?.database && (
            <MetricCard
              title="Database"
              description="Query response time"
              value={`${Math.round(backendMetrics.database.mean_time * 1000)}ms`}
              rating={
                backendMetrics.database.mean_time < 0.05
                  ? 'good'
                  : backendMetrics.database.mean_time < 0.1
                  ? 'needs-improvement'
                  : 'poor'
              }
              target="< 50ms"
              icon={<Database className="w-8 h-8" />}
            />
          )}

          {/* Error Rate */}
          {backendMetrics?.errors && (
            <MetricCard
              title="Error Rate"
              description="Application errors"
              value={`${Object.values(backendMetrics.errors)
                .reduce((sum, err) => sum + err.count, 0)} errors`}
              rating={
                Object.keys(backendMetrics.errors).length === 0
                  ? 'good'
                  : Object.values(backendMetrics.errors)
                      .reduce((sum, err) => sum + err.count, 0) < 5
                  ? 'needs-improvement'
                  : 'poor'
              }
              target="< 0.1%"
              icon={<AlertTriangle className="w-8 h-8" />}
            />
          )}
        </div>
      </div>

      {/* System Resources */}
      {backendMetrics?.system && (
        <div>
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
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (backendMetrics.system.memory.current_mb / 512) * 100,
                          100
                        )}%`
                      }}
                    />
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
                    <div
                      className={`h-2 rounded-full transition-all ${
                        backendMetrics.system.cpu.current_percent < 50
                          ? 'bg-green-500'
                          : backendMetrics.system.cpu.current_percent < 70
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(backendMetrics.system.cpu.current_percent, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target: &lt; 70%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoint Performance */}
      {backendMetrics?.endpoints && Object.keys(backendMetrics.endpoints).length > 0 && (
        <div>
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
                {Object.entries(backendMetrics.endpoints)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .slice(0, 10)
                  .map(([endpoint, metrics]) => (
                    <tr key={endpoint}>
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
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
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
  icon,
}) => {
  const statusColors = {
    good: 'bg-green-50 border-green-200',
    'needs-improvement': 'bg-yellow-50 border-yellow-200',
    poor: 'bg-red-50 border-red-200',
  };

  const textColors = {
    good: 'text-green-800',
    'needs-improvement': 'text-yellow-800',
    poor: 'text-red-800',
  };

  const iconColors = {
    good: 'text-green-500',
    'needs-improvement': 'text-yellow-500',
    poor: 'text-red-500',
  };

  return (
    <div className={`rounded-lg border p-4 ${statusColors[rating]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className={iconColors[rating]}>{icon}</div>
        <div className="flex items-center">
          {rating === 'good' && <CheckCircle className="w-4 h-4 text-green-500" />}
          {rating === 'needs-improvement' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
          {rating === 'poor' && <AlertTriangle className="w-4 h-4 text-red-500" />}
        </div>
      </div>

      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-xs text-gray-600 mt-1">{description}</p>

      <div className="mt-3">
        <p className={`text-2xl font-bold ${textColors[rating]}`}>{value}</p>
        <p className="text-xs text-gray-500 mt-1">Target: {target}</p>
      </div>
    </div>
  );
};

export default PerformanceDashboard;