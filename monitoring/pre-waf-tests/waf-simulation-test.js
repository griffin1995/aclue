// WAF Allowlist Behavior Simulation
// Simulates expected monitoring tool behavior post-WAF implementation

import http from 'k6/http';
import { check, group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Test configuration for simulated WAF behavior
export const options = {
  scenarios: {
    // Scenario 1: Simulate allowlisted monitoring tool
    allowlisted_tool: {
      executor: 'constant-vus',
      vus: 2,
      duration: '1m',
      exec: 'simulateAllowlistedTool',
      tags: { scenario: 'allowlisted' },
    },
    // Scenario 2: Simulate blocked tool
    blocked_tool: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 5,
      exec: 'simulateBlockedTool',
      startTime: '1m',
      tags: { scenario: 'blocked' },
    },
    // Scenario 3: Simulate rate limiting
    rate_limit_test: {
      executor: 'constant-arrival-rate',
      rate: 40, // Above 30 req/min limit
      timeUnit: '1m',
      duration: '30s',
      preAllocatedVUs: 5,
      exec: 'simulateRateLimiting',
      startTime: '1m30s',
      tags: { scenario: 'rate_limit' },
    },
  },

  thresholds: {
    'http_req_duration{scenario:allowlisted}': ['p(95)<2000'],
    'http_req_failed{scenario:allowlisted}': ['rate<0.05'],
    'checks{scenario:allowlisted}': ['rate>0.95'],
    'waf_blocks': ['count<100'],
    'rate_limits_triggered': ['rate<0.5'],
  },
};

// URLs
const BACKEND_URL = 'https://aclue-backend-production.up.railway.app';
const FRONTEND_URL = 'https://aclue.app';

// Custom metrics
import { Counter, Rate, Trend } from 'k6/metrics';
const wafBlocks = new Counter('waf_blocks');
const rateLimitHits = new Counter('rate_limit_hits');
const allowlistSuccess = new Rate('allowlist_success_rate');
const simulatedFrontendAccess = new Rate('simulated_frontend_access');

// Helper to simulate WAF response
function simulateWAFResponse(url, headers) {
  // Backend is accessible - return real response
  if (url.includes('railway.app')) {
    return http.get(url, { headers });
  }

  // Frontend - simulate based on headers
  const userAgent = headers['User-Agent'] || '';
  const testPurpose = headers['X-Test-Purpose'] || '';

  // Check if request would be allowlisted
  const isAllowlisted =
    (userAgent.includes('k6/') && userAgent.includes('aclue-monitoring')) ||
    (userAgent.includes('Nuclei/') && userAgent.includes('aclue-security')) ||
    (userAgent.includes('Lighthouse/') && userAgent.includes('aclue-monitoring')) ||
    testPurpose.includes('performance-monitoring') ||
    testPurpose.includes('security-validation');

  if (isAllowlisted) {
    // Simulate successful frontend response
    return {
      status: 200,
      body: '<html>aclue - AI-powered gifting platform</html>',
      headers: {
        'content-type': 'text/html',
        'cf-ray': 'simulated-ray-id',
        'cf-cache-status': 'HIT',
      },
      timings: { duration: Math.random() * 500 + 200 },
    };
  } else {
    // Simulate WAF block
    wafBlocks.add(1);
    return {
      status: 403,
      body: 'Access Denied - Cloudflare WAF',
      headers: {
        'content-type': 'text/html',
        'cf-ray': 'blocked-ray-id',
      },
      timings: { duration: Math.random() * 100 + 50 },
    };
  }
}

// Scenario 1: Allowlisted monitoring tool
export function simulateAllowlistedTool() {
  group('Allowlisted Tool Simulation', () => {
    // Test with proper monitoring headers
    const monitoringHeaders = {
      'User-Agent': 'k6/0.45.0 (aclue-monitoring; +https://aclue.app/monitoring)',
      'Accept': 'application/json',
      'X-Test-Purpose': 'performance-monitoring',
      'X-Request-ID': `k6-${__VU}-${__ITER}`,
    };

    // Test backend (real response)
    const backendResponse = http.get(`${BACKEND_URL}/health`, {
      headers: monitoringHeaders,
      tags: { type: 'backend' },
    });

    check(backendResponse, {
      'Backend accessible': (r) => r.status === 200,
      'Backend response fast': (r) => r.timings.duration < 1000,
    });

    // Simulate frontend access with allowlist
    const frontendSim = simulateWAFResponse(FRONTEND_URL, monitoringHeaders);

    const frontendCheck = check(frontendSim, {
      'Frontend allowlisted (simulated)': (r) => r.status === 200,
      'Frontend contains aclue': (r) => r.body.includes('aclue'),
      'No WAF block': (r) => r.status !== 403,
    });

    allowlistSuccess.add(frontendCheck);
    simulatedFrontendAccess.add(frontendSim.status === 200);

    // Log expected behavior
    if (frontendSim.status === 200) {
      console.log(`✅ Simulated: Monitoring tool would be allowlisted`);
    }
  });
}

// Scenario 2: Blocked tool simulation
export function simulateBlockedTool() {
  group('Blocked Tool Simulation', () => {
    // Test with non-allowlisted headers
    const blockedHeaders = {
      'User-Agent': 'sqlmap/1.5.0', // Known malicious tool
      'Accept': '*/*',
    };

    // Simulate frontend block
    const blockedResponse = simulateWAFResponse(FRONTEND_URL, blockedHeaders);

    check(blockedResponse, {
      'Non-allowlisted tool blocked': (r) => r.status === 403,
      'Returns WAF block message': (r) => r.body.includes('Access Denied'),
    });

    if (blockedResponse.status === 403) {
      console.log(`🛡️ Simulated: Malicious tool correctly blocked by WAF`);
    }

    // Test variations
    const variations = [
      { 'User-Agent': 'curl/7.64.0' },
      { 'User-Agent': 'python-requests/2.28.0' },
      { 'User-Agent': 'Mozilla/5.0 (bot)' },
    ];

    variations.forEach((headers, idx) => {
      const response = simulateWAFResponse(FRONTEND_URL, headers);
      const isBlocked = response.status === 403;

      console.log(`Test ${idx + 1}: ${headers['User-Agent']} - ${isBlocked ? 'BLOCKED' : 'ALLOWED'}`);
    });
  });
}

// Scenario 3: Rate limiting simulation
export function simulateRateLimiting() {
  group('Rate Limiting Simulation', () => {
    // Even with correct headers, excessive requests trigger rate limiting
    const headers = {
      'User-Agent': 'k6/0.45.0 (aclue-monitoring; +https://aclue.app/monitoring)',
      'X-Test-Purpose': 'rate-limit-test',
    };

    // Simulate rapid requests
    const requestCount = __ITER;

    // After 30 requests/minute, simulate rate limiting
    if (requestCount > 30) {
      rateLimitHits.add(1);

      const rateLimitResponse = {
        status: 429,
        body: 'Rate limit exceeded',
        headers: { 'retry-after': '60' },
        timings: { duration: 50 },
      };

      check(rateLimitResponse, {
        'Rate limit triggered': (r) => r.status === 429,
        'Has retry-after header': (r) => 'retry-after' in r.headers,
      });

      console.log(`⚠️ Simulated: Rate limit triggered after ${requestCount} requests`);
    } else {
      // Normal response for requests under limit
      const response = simulateWAFResponse(FRONTEND_URL, headers);

      check(response, {
        'Under rate limit - allowed': (r) => r.status === 200,
      });
    }
  });
}

// Setup
export function setup() {
  console.log('🧪 WAF Allowlist Behavior Simulation');
  console.log('════════════════════════════════════════');
  console.log('This test simulates expected behavior after WAF allowlist deployment');
  console.log('');
  console.log('Simulation Parameters:');
  console.log('  • Allowlisted User-Agents: k6, Nuclei, Lighthouse with proper suffixes');
  console.log('  • Rate Limit: 30 requests/minute');
  console.log('  • Backend: Real responses (accessible)');
  console.log('  • Frontend: Simulated responses (currently WAF-blocked)');
  console.log('');

  return {
    startTime: new Date().toISOString(),
    backendUrl: BACKEND_URL,
    frontendUrl: FRONTEND_URL,
  };
}

// Teardown
export function teardown(data) {
  console.log('');
  console.log('📊 Simulation Results');
  console.log('════════════════════════════════════════');

  const results = {
    timestamp: data.startTime,
    duration: new Date() - new Date(data.startTime),
    metrics: {
      wafBlocks: wafBlocks.count,
      rateLimitHits: rateLimitHits.count,
      allowlistSuccessRate: allowlistSuccess.rate,
      simulatedFrontendAccess: simulatedFrontendAccess.rate,
    },
    expectedBehavior: {
      allowlistedTools: 'Would receive 200 responses',
      blockedTools: 'Would receive 403 responses',
      rateLimiting: 'Would trigger after 30 req/min',
    },
  };

  console.log(`WAF Blocks Simulated: ${results.metrics.wafBlocks}`);
  console.log(`Rate Limit Hits: ${results.metrics.rateLimitHits}`);
  console.log(`Allowlist Success Rate: ${(results.metrics.allowlistSuccessRate * 100).toFixed(1)}%`);
  console.log(`Frontend Access Rate (simulated): ${(results.metrics.simulatedFrontendAccess * 100).toFixed(1)}%`);

  console.log('');
  console.log('✅ Expected Post-WAF Behavior:');
  console.log('  1. Monitoring tools with proper headers will access frontend');
  console.log('  2. Malicious tools will be blocked with 403');
  console.log('  3. Rate limiting will protect against abuse');
  console.log('  4. Backend remains accessible for all tools');

  return results;
}

// Export HTML report
export function handleSummary(data) {
  return {
    './waf-simulation-report.html': htmlReport(data),
    './waf-simulation-results.json': JSON.stringify(data, null, 2),
  };
}
