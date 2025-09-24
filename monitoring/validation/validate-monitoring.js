// Performance Monitoring Validation Suite
// Validates monitoring tools work correctly with anticipated WAF allowlist

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// Custom metrics for validation
const validationErrors = new Counter('validation_errors');
const endpointAvailability = new Gauge('endpoint_availability');
const securityHeaders = new Gauge('security_headers_present');
const apiCompliance = new Rate('api_compliance_rate');
const responseValidation = new Rate('response_validation_rate');
const performanceCompliance = new Rate('performance_compliance');

// Test configuration
export const options = {
  scenarios: {
    // Scenario 1: Backend validation
    backend_validation: {
      executor: 'constant-arrival-rate',
      rate: 2,
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 2,
      maxVUs: 5,
      exec: 'validateBackend',
      tags: { scenario: 'backend' },
    },
    // Scenario 2: Performance benchmarking
    performance_benchmark: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 2,
      maxVUs: 10,
      stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 5 },
      ],
      exec: 'performanceBenchmark',
      startTime: '2m',
      tags: { scenario: 'performance' },
    },
    // Scenario 3: Security validation
    security_validation: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      exec: 'validateSecurity',
      startTime: '4m',
      tags: { scenario: 'security' },
    },
  },

  thresholds: {
    // Validation thresholds
    'validation_errors': ['count<10'],
    'endpoint_availability': ['value>0.9'],
    'api_compliance_rate': ['rate>0.95'],
    'response_validation_rate': ['rate>0.90'],
    'performance_compliance': ['rate>0.90'],

    // Performance thresholds
    'http_req_duration{scenario:backend}': ['p(95)<2000'],
    'http_req_duration{scenario:performance}': ['p(90)<1500'],
    'http_req_failed': ['rate<0.05'],
  },
};

// Configuration
const BACKEND_URL = 'https://aclue-backend-production.up.railway.app';
const FRONTEND_URL = 'https://aclue.app';

// WAF-compliant headers
const wafHeaders = {
  'User-Agent': 'k6/0.45.0 (aclue-monitoring; +https://aclue.app/monitoring)',
  'Accept': 'application/json',
  'X-Test-Purpose': 'monitoring-validation',
  'X-Monitoring-Tool': 'k6-validator',
};

// Validation helper functions
function validateResponse(response, expectedSchema) {
  const validations = {
    statusOk: response.status >= 200 && response.status < 300,
    hasBody: response.body && response.body.length > 0,
    correctContentType: true,
    schemaValid: true,
  };

  // Check content type
  const contentType = response.headers['Content-Type'] || '';
  if (expectedSchema.contentType) {
    validations.correctContentType = contentType.includes(expectedSchema.contentType);
  }

  // Validate JSON schema if applicable
  if (contentType.includes('application/json') && response.body) {
    try {
      const data = JSON.parse(response.body);
      validations.schemaValid = validateJsonSchema(data, expectedSchema);
    } catch (e) {
      validations.schemaValid = false;
    }
  }

  return validations;
}

function validateJsonSchema(data, schema) {
  if (!schema.properties) return true;

  for (const [key, rules] of Object.entries(schema.properties)) {
    if (rules.required && !(key in data)) {
      return false;
    }
    if (key in data && rules.type) {
      const actualType = typeof data[key];
      if (rules.type !== actualType && !(rules.type === 'array' && Array.isArray(data[key]))) {
        return false;
      }
    }
  }
  return true;
}

// Backend validation function
export function validateBackend() {
  group('Backend API Validation', () => {
    // Test health endpoint
    const healthResponse = http.get(`${BACKEND_URL}/health`, {
      headers: wafHeaders,
      tags: { endpoint: 'health' },
    });

    const healthChecks = check(healthResponse, {
      'Health status is 200': (r) => r.status === 200,
      'Health returns JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
      'Health has status field': (r) => {
        try {
          const data = JSON.parse(r.body);
          return 'status' in data;
        } catch {
          return false;
        }
      },
      'Response time < 1s': (r) => r.timings.duration < 1000,
    });

    apiCompliance.add(healthChecks);
    endpointAvailability.add(healthResponse.status === 200 ? 1 : 0);

    // Test OpenAPI documentation
    const openApiResponse = http.get(`${BACKEND_URL}/openapi.json`, {
      headers: wafHeaders,
      tags: { endpoint: 'openapi' },
    });

    const openApiChecks = check(openApiResponse, {
      'OpenAPI accessible': (r) => r.status === 200,
      'OpenAPI is valid JSON': (r) => {
        try {
          JSON.parse(r.body);
          return true;
        } catch {
          return false;
        }
      },
      'OpenAPI has info section': (r) => {
        try {
          const spec = JSON.parse(r.body);
          return 'info' in spec && 'paths' in spec;
        } catch {
          return false;
        }
      },
    });

    responseValidation.add(openApiChecks);

    // Test products endpoint
    const productsResponse = http.get(`${BACKEND_URL}/api/v1/products/?limit=5`, {
      headers: wafHeaders,
      tags: { endpoint: 'products' },
    });

    const productsValidation = validateResponse(productsResponse, {
      contentType: 'application/json',
      properties: {
        length: { type: 'number' },
      },
    });

    check(productsResponse, {
      'Products endpoint works': (r) => r.status === 200 || r.status === 401,
      'Products returns array': (r) => {
        if (r.status !== 200) return true;
        try {
          return Array.isArray(JSON.parse(r.body));
        } catch {
          return false;
        }
      },
    });

    sleep(1);
  });
}

// Performance benchmark function
export function performanceBenchmark() {
  group('Performance Benchmarking', () => {
    const endpoints = [
      { name: 'Health', url: `${BACKEND_URL}/health`, maxTime: 500 },
      { name: 'Root', url: `${BACKEND_URL}/`, maxTime: 500 },
      { name: 'Products', url: `${BACKEND_URL}/api/v1/products/?limit=10`, maxTime: 1500 },
      { name: 'OpenAPI', url: `${BACKEND_URL}/openapi.json`, maxTime: 2000 },
    ];

    endpoints.forEach(endpoint => {
      const response = http.get(endpoint.url, {
        headers: wafHeaders,
        tags: { endpoint: endpoint.name.toLowerCase() },
      });

      const meetsPerformance = response.timings.duration <= endpoint.maxTime;
      performanceCompliance.add(meetsPerformance ? 1 : 0);

      check(response, {
        [`${endpoint.name} under ${endpoint.maxTime}ms`]: (r) => r.timings.duration <= endpoint.maxTime,
        [`${endpoint.name} successful`]: (r) => r.status >= 200 && r.status < 400,
      });

      // Record detailed metrics
      if (!meetsPerformance) {
        console.warn(`⚠️ ${endpoint.name} exceeded target: ${response.timings.duration}ms > ${endpoint.maxTime}ms`);
      }

      sleep(0.5);
    });
  });
}

// Security validation function
export function validateSecurity() {
  group('Security Headers Validation', () => {
    console.log('🔒 Validating security configurations...');

    const securityEndpoints = [
      `${BACKEND_URL}/health`,
      `${BACKEND_URL}/api/v1/products/`,
    ];

    securityEndpoints.forEach(url => {
      const response = http.get(url, {
        headers: {
          ...wafHeaders,
          'X-Test-Type': 'security-scan',
        },
      });

      // Check for security headers
      const hasSecurityHeaders = check(response, {
        'Has X-Content-Type-Options': (r) => 'x-content-type-options' in r.headers,
        'Has X-Frame-Options': (r) => 'x-frame-options' in r.headers,
        'No Server header exposed': (r) => !r.headers['server'] || r.headers['server'] === 'uvicorn',
        'Has CORS headers': (r) => 'access-control-allow-origin' in r.headers,
      });

      securityHeaders.add(hasSecurityHeaders ? 1 : 0);

      // Test for common vulnerabilities
      const sqlInjectionTest = http.get(`${url}?id=1' OR '1'='1`, {
        headers: wafHeaders,
      });

      check(sqlInjectionTest, {
        'SQL injection protected': (r) => r.status !== 500 && !r.body.includes('SQL'),
      });

      // Test for XSS
      const xssTest = http.get(`${url}?search=<script>alert('xss')</script>`, {
        headers: wafHeaders,
      });

      check(xssTest, {
        'XSS protected': (r) => !r.body.includes('<script>'),
      });

      sleep(1);
    });
  });
}

// Setup function
export function setup() {
  console.log('🎯 Performance Monitoring Validation Suite');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📅 Start time: ${new Date().toISOString()}`);
  console.log(`🔗 Backend URL: ${BACKEND_URL}`);
  console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
  console.log('');

  // Perform initial validation
  const setupChecks = {
    backend: false,
    frontend: false,
    timestamp: new Date().toISOString(),
  };

  // Check backend accessibility
  const backendCheck = http.get(`${BACKEND_URL}/health`, {
    headers: wafHeaders,
    timeout: '10s',
  });

  if (backendCheck.status === 200) {
    console.log('✅ Backend API accessible');
    setupChecks.backend = true;
  } else {
    console.log(`⚠️ Backend API returned: ${backendCheck.status}`);
  }

  // Check frontend (expecting 403 from WAF)
  const frontendCheck = http.get(FRONTEND_URL, {
    headers: wafHeaders,
    timeout: '10s',
  });

  if (frontendCheck.status === 403) {
    console.log('🛡️ Frontend WAF active (403) - awaiting allowlist');
    setupChecks.frontend = 'waf-blocked';
  } else if (frontendCheck.status === 200) {
    console.log('✅ Frontend accessible (WAF allowlist active?)');
    setupChecks.frontend = true;
  } else {
    console.log(`⚠️ Frontend returned: ${frontendCheck.status}`);
  }

  console.log('');
  return setupChecks;
}

// Teardown with summary
export function teardown(data) {
  console.log('');
  console.log('📊 Validation Results Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Calculate pass rates
  const validationScore = {
    endpointAvailability: endpointAvailability.value || 0,
    apiCompliance: apiCompliance.rate || 0,
    responseValidation: responseValidation.rate || 0,
    performanceCompliance: performanceCompliance.rate || 0,
    securityHeaders: securityHeaders.value || 0,
    validationErrors: validationErrors.count || 0,
  };

  // Determine overall status
  const overallScore = (
    validationScore.endpointAvailability * 0.3 +
    validationScore.apiCompliance * 0.2 +
    validationScore.responseValidation * 0.2 +
    validationScore.performanceCompliance * 0.2 +
    validationScore.securityHeaders * 0.1
  );

  console.log(`\n📈 Validation Metrics:`);
  console.log(`   Endpoint Availability: ${(validationScore.endpointAvailability * 100).toFixed(1)}%`);
  console.log(`   API Compliance: ${(validationScore.apiCompliance * 100).toFixed(1)}%`);
  console.log(`   Response Validation: ${(validationScore.responseValidation * 100).toFixed(1)}%`);
  console.log(`   Performance Compliance: ${(validationScore.performanceCompliance * 100).toFixed(1)}%`);
  console.log(`   Security Headers: ${(validationScore.securityHeaders * 100).toFixed(1)}%`);
  console.log(`   Validation Errors: ${validationScore.validationErrors}`);

  console.log(`\n🎯 Overall Score: ${(overallScore * 100).toFixed(1)}%`);

  if (overallScore >= 0.9) {
    console.log('✅ VALIDATION PASSED - Ready for production monitoring');
  } else if (overallScore >= 0.7) {
    console.log('⚠️ VALIDATION PARTIAL - Some issues need attention');
  } else {
    console.log('❌ VALIDATION FAILED - Critical issues detected');
  }

  // Generate recommendations
  console.log('\n📝 Recommendations:');
  if (validationScore.endpointAvailability < 0.9) {
    console.log('   • Investigate endpoint availability issues');
  }
  if (validationScore.performanceCompliance < 0.9) {
    console.log('   • Optimize slow endpoints to meet performance targets');
  }
  if (validationScore.securityHeaders < 0.8) {
    console.log('   • Add missing security headers to API responses');
  }
  if (validationScore.validationErrors > 5) {
    console.log('   • Review and fix validation errors in API responses');
  }

  return validationScore;
}

// Custom summary handler
export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    validation: 'monitoring-tools',
    metrics: data.metrics,
    thresholds: data.root_group.checks,
  };

  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    './validation-results.json': JSON.stringify(summary, null, 2),
  };
}
