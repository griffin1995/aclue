'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

const reportWebVitals = (metric: any) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value}`);
  }

  // Send to analytics endpoint
  const body = JSON.stringify({
    metric: metric.name,
    value: metric.value,
    delta: metric.delta,
    id: metric.id,
    rating: metric.rating,
    navigationType: metric.navigationType,
    url: window.location.href,
    timestamp: Date.now()
  });

  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    // Fallback to fetch
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      },
      keepalive: true
    }).catch(console.error);
  }
};

export default function WebVitalsReporter() {
  useEffect(() => {
    // Core Web Vitals (2024)
    onCLS(reportWebVitals); // Cumulative Layout Shift
    onINP(reportWebVitals); // Interaction to Next Paint (replaced deprecated FID)
    onLCP(reportWebVitals); // Largest Contentful Paint

    // Other Web Vitals
    onFCP(reportWebVitals); // First Contentful Paint
    onTTFB(reportWebVitals); // Time to First Byte
  }, []);

  return null;
}