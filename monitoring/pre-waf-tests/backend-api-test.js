// Backend API Testing Suite (Pre-WAF Allowlist)
// Tests currently accessible Railway backend endpoints

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('backend_errors');
const apiResponseTime = new Trend('api_response_time');
const successfulRequests = new Counter('successful_requests');
const failedRequests = new Counter('failed_requests');
const healthStatus = new Gauge('health_status');
const payloadSize = new Trend('payload_size_bytes');

// Configuration
export const options = {
  stages: [
    { duration: '30s', target: 2 },  // Warm-up
    { duration: '1m', target: 5 },   // Baseline test
    { duration: '2m', target: 10 },  // Moderate load
    { duration: '1m', target: 5 },   // Scale down
    { duration: '30s', target: 0 },  // Cool down
  ],

  thresholds: {
    'backend_errors': ['rate<0.05'],
    'api_response_time': [
      'p(50)<500',  // 50% under 500ms
      'p(90)<1000', // 90% under 1s
      'p(95)<1500', // 95% under 1.5s
      'p(99)<3000', // 99% under 3s
    ],
    'http_req_duration': ['avg<1000', 'max<5000'],
    'http_req_failed': ['rate<0.05'],
  },

  tags: {
    testType: 'backend-validation',
    environment: 'production',
    preWafTest: 'true',
  },
};

// Backend API base URL (currently accessible)
const API_BASE = 'https://aclue-backend-production.up.railway.app';

// Test headers (simulating future WAF allowlist headers)
const headers = {
  'User-Agent': 'k6/0.45.0 (aclue-monitoring; +https://aclue.app/monitoring)',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Test-Purpose': 'performance-baseline',
  'X-Request-ID': () => `k6-backend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
};

// Helper function to measure endpoint performance
function testEndpoint(name, url, expectedStatus = 200, options = {}) {
  const startTime = new Date();
  const response = http.get(url, {
    headers: {
      ...headers,
      'X-Request-ID': headers['X-Request-ID'](),
    },
    ...options,
  });
  const endTime = new Date();
  const duration = endTime - startTime;

  const success = check(response, {
    [`${name}: Status ${expectedStatus}`]: (r) => r.status === expectedStatus,
    [`${name}: Has body`]: (r) => r.body && r.body.length > 0,
    [`${name}: Valid JSON`]: (r) => {
      if (!r.headers['Content-Type']?.includes('application/json')) return true;
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
    [`${name}: Response time < 2s`]: (r) => r.timings.duration < 2000,
  });

  // Record metrics
  apiResponseTime.add(duration);
  if (response.body) {
    payloadSize.add(response.body.length);
  }

  if (success) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
    errorRate.add(1);
  }

  return {
    response,
    success,
    duration,
    status: response.status,
    size: response.body ? response.body.length : 0,
  };
}

export function setup() {
  console.log('🔧 Backend API Pre-WAF Testing Suite');
  console.log(`📍 Target: ${API_BASE}`);
  console.log(`⏰ Start time: ${new Date().toISOString()}`);
  console.log('');

  // Initial connectivity check
  console.log('🔍 Performing initial connectivity check...');
  const healthCheck = http.get(`${API_BASE}/health`, {
    headers: {
      ...headers,
      'X-Request-ID': 'setup-health-check',
    },
    timeout: '10s',
  });

  if (healthCheck.status === 200) {
    console.log('✅ Backend API is accessible');
    console.log(`   Response time: ${healthCheck.timings.duration}ms`);
    console.log(`   Server: ${healthCheck.headers['Server'] || 'Not disclosed'}`);
    console.log('');
    return {
      accessible: true,
      baselineLatency: healthCheck.timings.duration,
      serverInfo: healthCheck.headers['Server'] || 'Unknown',
    };
  } else {
    console.error(`❌ Backend API not accessible: ${healthCheck.status}`);
    return { accessible: false };
  }
}

export default function(data) {
  if (!data.accessible) {
    console.error('Skipping tests - backend not accessible');
    return;
  }

  // Test 1: Health endpoint performance
  group('Health Endpoint Performance', () => {
    const result = testEndpoint('Health Check', `${API_BASE}/health`);
    healthStatus.add(result.status === 200 ? 1 : 0);

    if (result.response.status === 200) {
      try {
        const health = JSON.parse(result.response.body);
        console.log(`Health: ${health.status || 'ok'}, Latency: ${result.duration}ms`);
      } catch {}
    }
  });

  sleep(0.5);

  // Test 2: API Documentation endpoints
  group('API Documentation Endpoints', () => {
    // OpenAPI JSON endpoint
    const openApiResult = testEndpoint('OpenAPI JSON', `${API_BASE}/openapi.json`);

    if (openApiResult.success) {
      try {
        const spec = JSON.parse(openApiResult.response.body);
        console.log(`API Version: ${spec.info?.version || 'Unknown'}`);
        console.log(`Endpoints: ${Object.keys(spec.paths || {}).length}`);
      } catch {}
    }

    sleep(0.3);

    // Swagger UI endpoint
    const docsResult = testEndpoint('Swagger Docs', `${API_BASE}/docs`);
    check(docsResult.response, {
      'Docs contain Swagger UI': (r) => r.body && r.body.includes('swagger-ui'),
    });
  });

  sleep(0.5);

  // Test 3: Products API endpoint
  group('Products API Performance', () => {
    // Test with various query parameters
    const tests = [
      { params: {}, name: 'Default' },
      { params: { limit: 5 }, name: 'Limited to 5' },
      { params: { limit: 20 }, name: 'Limited to 20' },
      { params: { offset: 10, limit: 10 }, name: 'Paginated' },
    ];

    tests.forEach(test => {
      const url = `${API_BASE}/api/v1/products/${test.params ? '?' + new URLSearchParams(test.params) : ''}`;
      const result = testEndpoint(`Products ${test.name}`, url);

      if (result.success && result.response.status === 200) {
        try {
          const products = JSON.parse(result.response.body);
          console.log(`${test.name}: ${products.length} products, ${result.duration}ms`);
        } catch {}
      }

      sleep(0.2);
    });
  });

  sleep(0.5);

  // Test 4: Authentication endpoints
  group('Authentication Endpoints', () => {
    // Test login endpoint with invalid credentials (expected to fail)
    const loginPayload = JSON.stringify({
      email: 'test@example.com',
      password: 'testpassword123',
    });

    const loginResponse = http.post(`${API_BASE}/api/v1/auth/login`, loginPayload, {
      headers: {
        ...headers,
        'X-Request-ID': `login-test-${Date.now()}`,
      },
    });

    check(loginResponse, {
      'Login endpoint accessible': (r) => r.status === 401 || r.status === 200,
      'Returns JSON response': (r) => r.headers['Content-Type']?.includes('application/json'),
      'Response time < 2s': (r) => r.timings.duration < 2000,
    });

    apiResponseTime.add(loginResponse.timings.duration);

    // Test register endpoint structure
    const registerResponse = http.post(`${API_BASE}/api/v1/auth/register`, '{}', {
      headers: {
        ...headers,
        'X-Request-ID': `register-test-${Date.now()}`,
      },
    });

    check(registerResponse, {
      'Register endpoint accessible': (r) => r.status === 422 || r.status === 400, // Expected validation error
      'Returns error details': (r) => r.body && r.body.includes('detail'),
    });

    apiResponseTime.add(registerResponse.timings.duration);
  });

  sleep(0.5);

  // Test 5: Recommendations endpoint
  group('Recommendations API', () => {
    const recResult = testEndpoint(
      'Recommendations',
      `${API_BASE}/api/v1/recommendations/`,
      [200, 401] // May require auth
    );

    if (recResult.response.status === 401) {
      console.log('Recommendations API requires authentication (expected)');
    } else if (recResult.response.status === 200) {
      console.log(`Recommendations accessible: ${recResult.duration}ms`);
    }
  });

  sleep(0.5);

  // Test 6: Rate limiting behaviour
  group('Rate Limiting Test', () => {
    const rapidRequests = [];
    for (let i = 0; i < 5; i++) {
      const response = http.get(`${API_BASE}/health`, {
        headers: {
          ...headers,
          'X-Request-ID': `rate-test-${i}`,
        },
      });
      rapidRequests.push(response.status);
      // No sleep - testing rate limits
    }

    const rateLimited = rapidRequests.some(status => status === 429);
    console.log(`Rate limiting: ${rateLimited ? 'Active' : 'Not detected'}`);
  });

  // Random delay to simulate real user behaviour
  sleep(Math.random() * 2 + 1);
}

export function teardown(data) {
  console.log('\n📊 Backend API Test Summary');
  console.log('═══════════════════════════════');

  if (data.accessible) {
    console.log(`✅ Backend API Status: ACCESSIBLE`);
    console.log(`⏱️  Baseline Latency: ${data.baselineLatency}ms`);
    console.log(`🖥️  Server: ${data.serverInfo}`);
  } else {
    console.log(`❌ Backend API Status: NOT ACCESSIBLE`);
  }

  console.log(`\n📈 Performance Metrics:`);
  console.log(`   Total Requests: ${successfulRequests.count + failedRequests.count}`);
  console.log(`   Successful: ${successfulRequests.count}`);
  console.log(`   Failed: ${failedRequests.count}`);
  console.log(`   Error Rate: ${(errorRate.rate * 100).toFixed(2)}%`);
  console.log(`   Avg Response Time: ${Math.round(apiResponseTime.avg)}ms`);
  console.log(`   P95 Response Time: ${Math.round(apiResponseTime.p(0.95))}ms`);
  console.log(`   P99 Response Time: ${Math.round(apiResponseTime.p(0.99))}ms`);

  // Generate baseline report
  const report = {
    timestamp: new Date().toISOString(),
    backend: API_BASE,
    accessible: data.accessible,
    metrics: {
      totalRequests: successfulRequests.count + failedRequests.count,
      successful: successfulRequests.count,
      failed: failedRequests.count,
      errorRate: errorRate.rate,
      avgResponseTime: apiResponseTime.avg,
      p95ResponseTime: apiResponseTime.p(0.95),
      p99ResponseTime: apiResponseTime.p(0.99),
    },
  };

  console.log('\n📝 Baseline JSON Report:');
  console.log(JSON.stringify(report, null, 2));
}
