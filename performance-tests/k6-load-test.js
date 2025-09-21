/**
 * Aclue Load Testing Configuration
 *
 * Comprehensive k6 load testing script for performance validation and stress testing.
 * Includes scenarios for authentication, API endpoints, and user journey simulation.
 *
 * Performance Targets:
 *   - API response time < 200ms (p95)
 *   - Error rate < 0.1%
 *   - Throughput > 1000 req/s
 *   - Concurrent users: 100-500
 *
 * Test Scenarios:
 *   1. Smoke Test: Minimal load to verify system functionality
 *   2. Load Test: Normal expected load
 *   3. Stress Test: Beyond normal load to find breaking point
 *   4. Spike Test: Sudden load increases
 *   5. Soak Test: Extended duration for memory leaks
 *
 * Usage:
 *   k6 run k6-load-test.js                    # Run default scenario
 *   k6 run --env SCENARIO=stress k6-load-test.js  # Run stress test
 *   k6 run --out cloud k6-load-test.js        # Send results to k6 Cloud
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';
import { randomItem, randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

// Configuration
const BASE_URL = __ENV.BASE_URL || 'https://aclue-backend-production.up.railway.app';
const SCENARIO = __ENV.SCENARIO || 'load'; // smoke, load, stress, spike, soak

// Custom metrics
const errorRate = new Rate('errors');
const apiResponseTime = new Trend('api_response_time');
const authSuccessRate = new Rate('auth_success');
const recommendationLatency = new Trend('recommendation_latency');
const databaseQueryTime = new Trend('database_query_time');
const cacheHitRate = new Rate('cache_hits');

// Test data
const testUsers = [
  { email: 'john.doe@example.com', password: 'password123' },
  { email: 'test1@aclue.app', password: 'TestPass123!' },
  { email: 'test2@aclue.app', password: 'TestPass123!' },
];

const productIds = ['prod_1', 'prod_2', 'prod_3', 'prod_4', 'prod_5'];
const categories = ['electronics', 'books', 'clothing', 'home', 'sports'];

// Scenario configurations
const scenarios = {
  // Smoke test: Minimal load to verify system works
  smoke: {
    executor: 'constant-vus',
    vus: 1,
    duration: '1m',
  },

  // Load test: Normal expected load
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 50 },   // Ramp up to 50 users
      { duration: '5m', target: 50 },   // Stay at 50 users
      { duration: '2m', target: 100 },  // Ramp up to 100 users
      { duration: '5m', target: 100 },  // Stay at 100 users
      { duration: '2m', target: 0 },    // Ramp down to 0
    ],
    gracefulRampDown: '30s',
  },

  // Stress test: Beyond normal load
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '2m', target: 100 },  // Ramp up to 100 users
      { duration: '5m', target: 100 },  // Stay at 100 users
      { duration: '2m', target: 200 },  // Ramp up to 200 users
      { duration: '5m', target: 200 },  // Stay at 200 users
      { duration: '2m', target: 300 },  // Ramp up to 300 users
      { duration: '5m', target: 300 },  // Stay at 300 users
      { duration: '10m', target: 0 },   // Ramp down to 0
    ],
    gracefulRampDown: '30s',
  },

  // Spike test: Sudden load increase
  spike: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '10s', target: 50 },   // Normal load
      { duration: '1m', target: 50 },    // Stay at normal
      { duration: '10s', target: 500 },  // Spike to 500 users
      { duration: '3m', target: 500 },   // Stay at spike
      { duration: '10s', target: 50 },   // Back to normal
      { duration: '3m', target: 50 },    // Stay at normal
      { duration: '10s', target: 0 },    // Ramp down
    ],
    gracefulRampDown: '30s',
  },

  // Soak test: Extended duration for memory leaks
  soak: {
    executor: 'constant-vus',
    vus: 100,
    duration: '2h',
  },
};

// Configure test options
export const options = {
  scenarios: {
    [SCENARIO]: scenarios[SCENARIO]
  },
  thresholds: {
    // Response time thresholds
    http_req_duration: [
      'p(95)<500', // 95% of requests should be below 500ms
      'p(99)<1000', // 99% of requests should be below 1000ms
    ],
    // Error rate threshold
    errors: ['rate<0.01'], // Error rate should be below 1%
    // Authentication success rate
    auth_success: ['rate>0.95'], // 95% of auth attempts should succeed
    // Custom API response time
    api_response_time: ['p(95)<200'], // 95% of API responses below 200ms
    // Recommendation latency
    recommendation_latency: ['p(95)<300'], // 95% below 300ms
    // Cache hit rate
    cache_hits: ['rate>0.8'], // 80% cache hit rate
  },
};

// Setup function - runs once before the test
export function setup() {
  console.log(`Starting ${SCENARIO} test against ${BASE_URL}`);

  // Verify API is accessible
  const healthCheck = http.get(`${BASE_URL}/health`);
  check(healthCheck, {
    'API is reachable': (r) => r.status === 200,
  });

  if (healthCheck.status !== 200) {
    throw new Error('API health check failed');
  }

  return { startTime: Date.now() };
}

// Main test function - runs for each virtual user
export default function (data) {
  // User authentication flow
  group('Authentication', () => {
    const user = randomItem(testUsers);

    // Login
    const loginStart = Date.now();
    const loginResponse = http.post(
      `${BASE_URL}/api/v1/auth/login`,
      JSON.stringify(user),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'login' },
      }
    );

    const loginSuccess = check(loginResponse, {
      'login successful': (r) => r.status === 200,
      'login returns token': (r) => r.json('access_token') !== undefined,
      'login response time OK': (r) => r.timings.duration < 500,
    });

    authSuccessRate.add(loginSuccess);
    apiResponseTime.add(Date.now() - loginStart);

    if (!loginSuccess) {
      errorRate.add(1);
      return; // Skip rest of test if login failed
    }

    const token = loginResponse.json('access_token');
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    sleep(randomIntBetween(1, 3));

    // Get user profile
    group('User Profile', () => {
      const profileStart = Date.now();
      const profileResponse = http.get(
        `${BASE_URL}/api/v1/auth/me`,
        { headers: authHeaders, tags: { name: 'profile' } }
      );

      check(profileResponse, {
        'profile fetch successful': (r) => r.status === 200,
        'profile contains user data': (r) => r.json('email') !== undefined,
      });

      apiResponseTime.add(Date.now() - profileStart);
      errorRate.add(profileResponse.status !== 200);
    });

    sleep(randomIntBetween(1, 2));

    // Product operations
    group('Product Operations', () => {
      // List products
      const productsStart = Date.now();
      const productsResponse = http.get(
        `${BASE_URL}/api/v1/products?limit=10&offset=0`,
        { headers: authHeaders, tags: { name: 'products_list' } }
      );

      check(productsResponse, {
        'products fetch successful': (r) => r.status === 200,
        'products response is array': (r) => Array.isArray(r.json()),
        'products response time OK': (r) => r.timings.duration < 300,
      });

      apiResponseTime.add(Date.now() - productsStart);
      databaseQueryTime.add(productsResponse.timings.duration);
      errorRate.add(productsResponse.status !== 200);

      // Check if response was from cache
      const cacheHeader = productsResponse.headers['X-Cache-Status'];
      cacheHitRate.add(cacheHeader === 'HIT');

      sleep(randomIntBetween(1, 2));

      // Get single product
      const productId = randomItem(productIds);
      const productStart = Date.now();
      const productResponse = http.get(
        `${BASE_URL}/api/v1/products/${productId}`,
        { headers: authHeaders, tags: { name: 'product_detail' } }
      );

      check(productResponse, {
        'product fetch successful': (r) => r.status === 200 || r.status === 404,
        'product response time OK': (r) => r.timings.duration < 200,
      });

      apiResponseTime.add(Date.now() - productStart);
      errorRate.add(productResponse.status >= 500);
    });

    sleep(randomIntBetween(2, 4));

    // Recommendations
    group('Recommendations', () => {
      const recStart = Date.now();
      const category = randomItem(categories);

      const recResponse = http.get(
        `${BASE_URL}/api/v1/recommendations?category=${category}&limit=5`,
        { headers: authHeaders, tags: { name: 'recommendations' } }
      );

      check(recResponse, {
        'recommendations fetch successful': (r) => r.status === 200,
        'recommendations response time OK': (r) => r.timings.duration < 500,
        'recommendations contains items': (r) => {
          const body = r.json();
          return body && body.length > 0;
        },
      });

      recommendationLatency.add(Date.now() - recStart);
      errorRate.add(recResponse.status !== 200);

      // Check cache status
      const cacheStatus = recResponse.headers['X-Cache-Status'];
      cacheHitRate.add(cacheStatus === 'HIT');
    });

    sleep(randomIntBetween(2, 4));

    // Swipe operations (simulating user interaction)
    group('Swipe Operations', () => {
      const swipeData = {
        product_id: randomItem(productIds),
        direction: randomItem(['left', 'right']),
        interaction_time: randomIntBetween(500, 3000),
      };

      const swipeStart = Date.now();
      const swipeResponse = http.post(
        `${BASE_URL}/api/v1/swipes`,
        JSON.stringify(swipeData),
        { headers: authHeaders, tags: { name: 'swipe' } }
      );

      check(swipeResponse, {
        'swipe recorded successfully': (r) => r.status === 201 || r.status === 200,
        'swipe response time OK': (r) => r.timings.duration < 100,
      });

      apiResponseTime.add(Date.now() - swipeStart);
      errorRate.add(swipeResponse.status >= 400);
    });

    sleep(randomIntBetween(1, 3));

    // Search operations
    group('Search', () => {
      const searchTerms = ['electronics', 'gift', 'birthday', 'christmas', 'anniversary'];
      const searchTerm = randomItem(searchTerms);

      const searchStart = Date.now();
      const searchResponse = http.get(
        `${BASE_URL}/api/v1/search?q=${searchTerm}&limit=10`,
        { headers: authHeaders, tags: { name: 'search' } }
      );

      check(searchResponse, {
        'search successful': (r) => r.status === 200,
        'search returns results': (r) => {
          const body = r.json();
          return body && Array.isArray(body.results);
        },
        'search response time OK': (r) => r.timings.duration < 300,
      });

      apiResponseTime.add(Date.now() - searchStart);
      errorRate.add(searchResponse.status !== 200);
    });

    sleep(randomIntBetween(3, 7));
  });

  // Simulate user think time between iterations
  sleep(randomIntBetween(5, 10));
}

// Teardown function - runs once after the test
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`Test completed in ${duration} seconds`);

  // Send final metrics to monitoring system
  const finalMetrics = {
    scenario: SCENARIO,
    duration: duration,
    timestamp: new Date().toISOString(),
  };

  http.post(
    `${BASE_URL}/api/v1/performance/report`,
    JSON.stringify(finalMetrics),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

// Helper function for complex user journeys
export function userJourney() {
  group('Complete User Journey', () => {
    // 1. Landing page
    http.get(`${BASE_URL}/`);
    sleep(2);

    // 2. Browse products
    http.get(`${BASE_URL}/api/v1/products`);
    sleep(3);

    // 3. View product details
    const productId = randomItem(productIds);
    http.get(`${BASE_URL}/api/v1/products/${productId}`);
    sleep(2);

    // 4. Add to wishlist
    http.post(`${BASE_URL}/api/v1/wishlist/${productId}`);
    sleep(1);

    // 5. Get recommendations
    http.get(`${BASE_URL}/api/v1/recommendations`);
    sleep(2);

    // 6. Checkout flow (simulated)
    http.post(`${BASE_URL}/api/v1/checkout/init`);
    sleep(1);
  });
}