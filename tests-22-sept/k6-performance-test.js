import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend, Counter, Gauge } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')
const apiTrend = new Trend('api_response_time')
const requestCount = new Counter('requests')
const activeUsers = new Gauge('active_users')

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up to 100 users
    { duration: '5m', target: 100 },   // Stay at 100 users
    { duration: '3m', target: 200 },   // Ramp up to 200 users
    { duration: '5m', target: 200 },   // Stay at 200 users
    { duration: '3m', target: 300 },   // Ramp up to 300 users
    { duration: '5m', target: 300 },   // Stay at 300 users
    { duration: '5m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1500'],
    'http_req_failed': ['rate<0.1'],
    'errors': ['rate<0.1'],
    'api_response_time': ['p(95)<300'],
  },
  ext: {
    loadimpact: {
      projectID: 'aclue-performance',
      name: 'Aclue Platform Load Test',
    },
  },
}

const BASE_URL = 'https://aclue-backend-production.up.railway.app'
const FRONTEND_URL = 'https://aclue.app'

export function setup() {
  // Setup test data
  return {
    testUser: {
      email: 'john.doe@example.com',
      password: 'password123',
    },
    timestamp: new Date().toISOString(),
  }
}

export default function (data) {
  activeUsers.add(1)

  // Test 1: Homepage Load
  let homepageRes = http.get(FRONTEND_URL)
  check(homepageRes, {
    'Homepage status is 200': (r) => r.status === 200,
    'Homepage loads quickly': (r) => r.timings.duration < 3000,
  })
  requestCount.add(1)
  errorRate.add(homepageRes.status !== 200)
  sleep(1)

  // Test 2: API Health Check
  let healthRes = http.get(`${BASE_URL}/health`)
  check(healthRes, {
    'API is healthy': (r) => r.status === 200,
    'API response time < 100ms': (r) => r.timings.duration < 100,
  })
  apiTrend.add(healthRes.timings.duration)
  requestCount.add(1)
  errorRate.add(healthRes.status !== 200)
  sleep(0.5)

  // Test 3: Login Flow
  let loginPayload = JSON.stringify({
    email: data.testUser.email,
    password: data.testUser.password,
  })

  let loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  let loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, loginPayload, loginParams)
  check(loginRes, {
    'Login successful': (r) => r.status === 200,
    'Login returns token': (r) => r.json('access_token') !== undefined,
    'Login response time < 500ms': (r) => r.timings.duration < 500,
  })
  apiTrend.add(loginRes.timings.duration)
  requestCount.add(1)
  errorRate.add(loginRes.status !== 200)

  let token = loginRes.json('access_token')

  // Test 4: Protected Route Access
  if (token) {
    let authParams = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }

    // Get user profile
    let profileRes = http.get(`${BASE_URL}/api/v1/auth/me`, authParams)
    check(profileRes, {
      'Profile fetch successful': (r) => r.status === 200,
      'Profile contains user data': (r) => r.json('email') !== undefined,
    })
    apiTrend.add(profileRes.timings.duration)
    requestCount.add(1)
    errorRate.add(profileRes.status !== 200)
    sleep(0.5)

    // Get products
    let productsRes = http.get(`${BASE_URL}/api/v1/products/`, authParams)
    check(productsRes, {
      'Products fetch successful': (r) => r.status === 200,
      'Products array returned': (r) => Array.isArray(r.json()),
    })
    apiTrend.add(productsRes.timings.duration)
    requestCount.add(1)
    errorRate.add(productsRes.status !== 200)
    sleep(0.5)

    // Get recommendations
    let recommendationsRes = http.get(`${BASE_URL}/api/v1/recommendations/`, authParams)
    check(recommendationsRes, {
      'Recommendations fetch successful': (r) => r.status === 200,
      'Recommendations response valid': (r) => r.json() !== null,
    })
    apiTrend.add(recommendationsRes.timings.duration)
    requestCount.add(1)
    errorRate.add(recommendationsRes.status !== 200)
  }

  // Test 5: Newsletter Subscription
  let newsletterPayload = JSON.stringify({
    email: `test_${Date.now()}@example.com`,
  })

  let newsletterRes = http.post(
    `${BASE_URL}/api/v1/newsletter/subscribe`,
    newsletterPayload,
    loginParams
  )
  check(newsletterRes, {
    'Newsletter subscription works': (r) => r.status === 200 || r.status === 201,
  })
  apiTrend.add(newsletterRes.timings.duration)
  requestCount.add(1)
  errorRate.add(newsletterRes.status >= 400)

  // Test 6: Static Assets Loading
  let assetsToTest = [
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',
  ]

  for (let asset of assetsToTest) {
    let assetRes = http.get(FRONTEND_URL + asset)
    check(assetRes, {
      [`${asset} loads successfully`]: (r) => r.status === 200,
      [`${asset} loads quickly`]: (r) => r.timings.duration < 1000,
    })
    requestCount.add(1)
    errorRate.add(assetRes.status !== 200)
  }

  activeUsers.add(-1)
  sleep(2)
}

export function teardown(data) {
  // Cleanup and generate report
  console.log(`Test completed at: ${new Date().toISOString()}`)
  console.log(`Initial timestamp: ${data.timestamp}`)
}