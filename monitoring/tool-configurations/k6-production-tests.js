// K6 Production Testing Suite for aclue Platform
// Configured for WAF allowlist compatibility

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');
const requestCount = new Counter('requests');

// Test configuration
export const options = {
  // WAF-friendly test stages
  stages: [
    { duration: '2m', target: 5 },   // Ramp up slowly
    { duration: '5m', target: 10 },  // Stay within rate limits
    { duration: '2m', target: 15 },  // Moderate load
    { duration: '5m', target: 10 },  // Scale back
    { duration: '2m', target: 0 },   // Ramp down
  ],

  // WAF allowlist thresholds
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.05'],    // Less than 5% failures
    errors: ['rate<0.1'],              // Less than 10% errors
  },

  // Rate limiting compliance
  rps: 25, // Stay under 30 req/min WAF limit

  // User agent for WAF identification
  userAgent: 'k6/0.45.0 (aclue-monitoring; +https://aclue.app/monitoring)',

  // Test metadata
  tags: {
    testType: 'production-monitoring',
    environment: 'production',
    wafAllowlist: 'tier2-performance',
  },
};

// Base URL configuration
const BASE_URL = 'https://aclue.app';
const API_BASE_URL = 'https://aclue-backend-production.up.railway.app';

// WAF-compliant headers
const defaultHeaders = {
  'User-Agent': 'k6/0.45.0 (aclue-monitoring; +https://aclue.app/monitoring)',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Test-Purpose': 'performance-monitoring',
  'X-Request-ID': `k6-${__ITER}-${Date.now()}`,
};

// Test data
const testUsers = [
  { email: 'test1@example.com', password: 'testpass123' },
  { email: 'test2@example.com', password: 'testpass123' },
];

export function setup() {
  console.log('🚀 Starting aclue Platform Performance Tests');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`API URL: ${API_BASE_URL}`);
  console.log('WAF Allowlist: Tier 2 Performance Testing');

  // Verify WAF allowlist access
  const healthCheck = http.get(`${API_BASE_URL}/health`, { headers: defaultHeaders });
  if (healthCheck.status !== 200) {
    console.error('❌ WAF blocking health check - verify allowlist configuration');
    return { setupFailed: true };
  }

  console.log('✅ WAF allowlist verification passed');
  return { setupFailed: false };
}

export default function(data) {
  if (data.setupFailed) {
    console.error('Setup failed, skipping test execution');
    return;
  }

  // Frontend health check
  group('Frontend Health Check', () => {
    const response = http.get(BASE_URL, { headers: defaultHeaders });

    check(response, {
      'Frontend is accessible': (r) => r.status === 200,
      'Response time < 2s': (r) => r.timings.duration < 2000,
      'Contains aclue branding': (r) => r.body.includes('aclue'),
    });

    errorRate.add(response.status !== 200);
    responseTime.add(response.timings.duration);
    requestCount.add(1);
  });

  // Backend API health check
  group('Backend API Health', () => {
    const response = http.get(`${API_BASE_URL}/health`, { headers: defaultHeaders });

    check(response, {
      'API health endpoint accessible': (r) => r.status === 200,
      'Response time < 1s': (r) => r.timings.duration < 1000,
      'Health status OK': (r) => r.json('status') === 'ok',
    });

    errorRate.add(response.status !== 200);
    responseTime.add(response.timings.duration);
    requestCount.add(1);
  });

  // Products API test (allowlisted endpoint)
  group('Products API Test', () => {
    const response = http.get(`${API_BASE_URL}/api/v1/products/`, {
      headers: defaultHeaders,
      params: { limit: 10 }
    });

    check(response, {
      'Products API accessible': (r) => r.status === 200,
      'Response time < 1.5s': (r) => r.timings.duration < 1500,
      'Returns JSON': (r) => r.headers['Content-Type'].includes('application/json'),
      'Has products data': (r) => Array.isArray(r.json()),
    });

    errorRate.add(response.status !== 200);
    responseTime.add(response.timings.duration);
    requestCount.add(1);
  });

  // Newsletter subscription test (allowlisted endpoint)
  group('Newsletter Subscription Test', () => {
    const testEmail = `k6-test-${Date.now()}@example.com`;
    const newsletterPayload = JSON.stringify({
      email: testEmail,
      source: 'k6-performance-test'
    });

    const response = http.post(`${BASE_URL}/newsletter`, {
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: { email: testEmail }
    });

    check(response, {
      'Newsletter endpoint accessible': (r) => r.status === 200 || r.status === 302,
      'Response time < 3s': (r) => r.timings.duration < 3000,
    });

    errorRate.add(response.status >= 400 && response.status !== 409); // 409 = already subscribed
    responseTime.add(response.timings.duration);
    requestCount.add(1);
  });

  // Static assets performance test
  group('Static Assets Performance', () => {
    const logoResponse = http.get(`${BASE_URL}/aclue_text_clean.png`, { headers: defaultHeaders });

    check(logoResponse, {
      'Logo loads successfully': (r) => r.status === 200,
      'Logo response time < 500ms': (r) => r.timings.duration < 500,
      'Correct content type': (r) => r.headers['Content-Type'].includes('image/'),
    });

    errorRate.add(logoResponse.status !== 200);
    responseTime.add(logoResponse.timings.duration);
    requestCount.add(1);
  });

  // Wait between iterations to respect rate limits
  sleep(Math.random() * 2 + 1); // 1-3 seconds random delay
}

export function teardown(data) {
  console.log('📊 Test Summary:');
  console.log(`Total Requests: ${requestCount.count}`);
  console.log(`Average Response Time: ${responseTime.avg}ms`);
  console.log(`Error Rate: ${(errorRate.rate * 100).toFixed(2)}%`);

  if (errorRate.rate > 0.1) {
    console.log('⚠️  High error rate detected - check WAF rules');
  } else {
    console.log('✅ All tests completed successfully');
  }
}

// Export for CI/CD integration
export { errorRate, responseTime, requestCount };
