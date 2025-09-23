// Simple Load Test for Aclue Platform
// This is a lightweight version that can run with basic Node.js

const https = require('https');
const fs = require('fs');

const results = {
  timestamp: new Date().toISOString(),
  tests: [],
  summary: {
    total_requests: 0,
    successful_requests: 0,
    failed_requests: 0,
    average_response_time: 0,
    max_response_time: 0,
    min_response_time: Infinity
  }
};

// Test endpoints
const endpoints = [
  { name: 'Homepage', url: 'https://aclue.app/' },
  { name: 'API Health', url: 'https://aclue-backend-production.up.railway.app/health' },
  { name: 'API Docs', url: 'https://aclue-backend-production.up.railway.app/docs' },
  { name: 'API Products', url: 'https://aclue-backend-production.up.railway.app/api/v1/products/' }
];

async function testEndpoint(endpoint, iterations = 5) {
  console.log(`Testing ${endpoint.name}...`);

  const testResults = {
    name: endpoint.name,
    url: endpoint.url,
    iterations,
    response_times: [],
    status_codes: [],
    success_rate: 0,
    average_response_time: 0
  };

  for (let i = 0; i < iterations; i++) {
    try {
      const startTime = Date.now();

      await new Promise((resolve, reject) => {
        const request = https.get(endpoint.url, (response) => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;

          testResults.response_times.push(responseTime);
          testResults.status_codes.push(response.statusCode);

          results.summary.total_requests++;
          if (response.statusCode === 200) {
            results.summary.successful_requests++;
          } else {
            results.summary.failed_requests++;
          }

          // Update global stats
          results.summary.max_response_time = Math.max(results.summary.max_response_time, responseTime);
          results.summary.min_response_time = Math.min(results.summary.min_response_time, responseTime);

          resolve();
        });

        request.on('error', (error) => {
          const responseTime = Date.now() - startTime;
          testResults.response_times.push(responseTime);
          testResults.status_codes.push(0);
          results.summary.total_requests++;
          results.summary.failed_requests++;
          resolve();
        });

        request.setTimeout(10000, () => {
          request.destroy();
          reject(new Error('Timeout'));
        });
      });

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      console.log(`  Request ${i + 1} failed: ${error.message}`);
      testResults.response_times.push(10000);
      testResults.status_codes.push(0);
      results.summary.total_requests++;
      results.summary.failed_requests++;
    }
  }

  // Calculate metrics for this endpoint
  testResults.average_response_time = testResults.response_times.reduce((a, b) => a + b, 0) / testResults.response_times.length;
  testResults.success_rate = (testResults.status_codes.filter(code => code === 200).length / testResults.status_codes.length) * 100;

  console.log(`  Average response time: ${testResults.average_response_time.toFixed(2)}ms`);
  console.log(`  Success rate: ${testResults.success_rate.toFixed(1)}%`);

  results.tests.push(testResults);
}

async function runLoadTest() {
  console.log('🚀 Starting Aclue Performance Load Test');
  console.log('==========================================');

  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    console.log('');
  }

  // Calculate overall average response time
  const allResponseTimes = results.tests.flatMap(test => test.response_times);
  results.summary.average_response_time = allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length;

  // Generate final report
  console.log('📊 PERFORMANCE TEST SUMMARY');
  console.log('============================');
  console.log(`Total Requests: ${results.summary.total_requests}`);
  console.log(`Successful: ${results.summary.successful_requests}`);
  console.log(`Failed: ${results.summary.failed_requests}`);
  console.log(`Success Rate: ${((results.summary.successful_requests / results.summary.total_requests) * 100).toFixed(1)}%`);
  console.log(`Average Response Time: ${results.summary.average_response_time.toFixed(2)}ms`);
  console.log(`Max Response Time: ${results.summary.max_response_time}ms`);
  console.log(`Min Response Time: ${results.summary.min_response_time}ms`);

  // Save results to file
  fs.writeFileSync('./load-test-results.json', JSON.stringify(results, null, 2));
  console.log('\n📁 Results saved to: load-test-results.json');
}

runLoadTest().catch(console.error);