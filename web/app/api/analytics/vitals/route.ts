import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define metric types
interface WebVitalMetric {
  metric: string;
  value: number;
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  navigationType: string;
  url: string;
  timestamp: number;
}

// Performance thresholds based on Core Web Vitals standards
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 }
};

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals API] Received metric:', metric);
    }

    // Store metrics in a log file (in production, this would go to a database or analytics service)
    const logsDir = path.join(process.cwd(), 'tests-22-sept', 'automated', 'performance', 'web-vitals-logs');
    await fs.mkdir(logsDir, { recursive: true });

    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `vitals_${today}.jsonl`);

    // Append metric to log file
    await fs.appendFile(logFile, JSON.stringify(metric) + '\n');

    // Check if metric exceeds thresholds
    const threshold = THRESHOLDS[metric.metric as keyof typeof THRESHOLDS];
    if (threshold) {
      const isGood = metric.value <= threshold.good;
      const isPoor = metric.value > threshold.poor;

      if (isPoor) {
        console.warn(`⚠️ Poor ${metric.metric}: ${metric.value}ms exceeds threshold of ${threshold.poor}ms`);
      }
    }

    // Generate performance insights
    const insights = generateInsights(metric);

    return NextResponse.json({
      success: true,
      metric: metric.metric,
      value: metric.value,
      rating: metric.rating,
      insights
    });

  } catch (error) {
    console.error('[Web Vitals API] Error processing metric:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process metric' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return aggregated metrics for monitoring dashboard
    const logsDir = path.join(process.cwd(), 'tests-22-sept', 'automated', 'performance', 'web-vitals-logs');
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `vitals_${today}.jsonl`);

    let metrics: WebVitalMetric[] = [];
    try {
      const content = await fs.readFile(logFile, 'utf-8');
      metrics = content
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
    } catch (error) {
      // Log file doesn't exist yet
      return NextResponse.json({
        date: today,
        metrics: [],
        summary: {
          totalEvents: 0,
          averageScores: {}
        }
      });
    }

    // Calculate aggregated statistics
    const summary = calculateSummary(metrics);

    return NextResponse.json({
      date: today,
      metrics: metrics.slice(-100), // Return last 100 metrics
      summary
    });

  } catch (error) {
    console.error('[Web Vitals API] Error fetching metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

function generateInsights(metric: WebVitalMetric): string[] {
  const insights: string[] = [];

  switch (metric.metric) {
    case 'LCP':
      if (metric.value > 2500) {
        insights.push('Consider optimising largest content element');
        insights.push('Check image sizes and loading strategies');
      }
      break;
    case 'CLS':
      if (metric.value > 0.1) {
        insights.push('Layout shifts detected - review dynamic content loading');
        insights.push('Ensure images and embeds have explicit dimensions');
      }
      break;
    case 'INP':
    case 'FID':
      if (metric.value > 200) {
        insights.push('Interaction delays detected - optimise JavaScript execution');
        insights.push('Consider code splitting and lazy loading');
      }
      break;
    case 'FCP':
      if (metric.value > 1800) {
        insights.push('Slow first paint - review critical rendering path');
        insights.push('Optimise CSS delivery and reduce render-blocking resources');
      }
      break;
    case 'TTFB':
      if (metric.value > 800) {
        insights.push('High server response time - check backend performance');
        insights.push('Consider CDN usage and caching strategies');
      }
      break;
  }

  return insights;
}

function calculateSummary(metrics: WebVitalMetric[]) {
  const metricGroups = metrics.reduce((acc, m) => {
    if (!acc[m.metric]) {
      acc[m.metric] = [];
    }
    acc[m.metric].push(m.value);
    return acc;
  }, {} as Record<string, number[]>);

  const averageScores = Object.entries(metricGroups).reduce((acc, [metric, values]) => {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const p75 = values.sort((a, b) => a - b)[Math.floor(values.length * 0.75)] || avg;
    const p95 = values.sort((a, b) => a - b)[Math.floor(values.length * 0.95)] || avg;

    acc[metric] = {
      average: Math.round(avg),
      p75: Math.round(p75),
      p95: Math.round(p95),
      count: values.length
    };
    return acc;
  }, {} as Record<string, any>);

  const ratingCounts = metrics.reduce((acc, m) => {
    acc[m.rating] = (acc[m.rating] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalEvents: metrics.length,
    averageScores,
    ratingCounts,
    lastUpdated: new Date().toISOString()
  };
}