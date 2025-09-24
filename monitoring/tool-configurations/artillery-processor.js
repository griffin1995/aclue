/**
 * Artillery Custom Processor for aclue Platform
 * Handles WAF-specific metrics and validation
 */

module.exports = {
  // Initialize processor
  init: function(options, events) {
    // Custom metrics tracking
    this.wafBlockCounter = 0;
    this.slowResponseCounter = 0;
    this.errorsByType = {};
    this.responseTimesByEndpoint = {};

    console.log('🚀 Artillery processor initialized for aclue platform');
    console.log('WAF Allowlist: Tier 2 Performance Testing');
  },

  // Process each response
  afterResponse: function(requestParams, response, context, events, done) {
    // Track WAF blocking (403 responses)
    if (response.statusCode === 403) {
      this.wafBlockCounter++;
      console.warn(`⚠️  WAF block detected: ${requestParams.url}`);
      events.emit('counter', 'waf.blocks', 1);
    }

    // Track slow responses (>2 seconds)
    const responseTime = response.timingPhases?.total || 0;
    if (responseTime > 2000) {
      this.slowResponseCounter++;
      events.emit('counter', 'performance.slow_responses', 1);
    }

    // Track response times by endpoint
    const endpoint = this.extractEndpoint(requestParams.url);
    if (!this.responseTimesByEndpoint[endpoint]) {
      this.responseTimesByEndpoint[endpoint] = [];
    }
    this.responseTimesByEndpoint[endpoint].push(responseTime);

    // Track error types
    if (response.statusCode >= 400) {
      const errorType = `${Math.floor(response.statusCode / 100)}xx`;
      this.errorsByType[errorType] = (this.errorsByType[errorType] || 0) + 1;
      events.emit('counter', `errors.${errorType}`, 1);
    }

    // Emit custom metrics
    events.emit('histogram', 'response.time.total', responseTime);
    events.emit('histogram', `response.time.${endpoint}`, responseTime);

    return done();
  },

  // Process errors
  onError: function(error, context, events, done) {
    console.error(`❌ Artillery error: ${error.message}`);

    // Check if error might be WAF-related
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn('⚠️  Connection error - possible WAF blocking');
      events.emit('counter', 'waf.connection_errors', 1);
    }

    events.emit('counter', 'errors.network', 1);
    return done();
  },

  // Generate final summary
  done: function(allStats, done) {
    console.log('\n📊 Artillery Test Summary for aclue Platform:');
    console.log(`WAF Blocks Detected: ${this.wafBlockCounter}`);
    console.log(`Slow Responses (>2s): ${this.slowResponseCounter}`);

    // Log error breakdown
    if (Object.keys(this.errorsByType).length > 0) {
      console.log('\nError Breakdown:');
      Object.entries(this.errorsByType).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    }

    // Log performance by endpoint
    console.log('\nResponse Times by Endpoint:');
    Object.entries(this.responseTimesByEndpoint).forEach(([endpoint, times]) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const p95 = this.calculatePercentile(times, 0.95);
      console.log(`  ${endpoint}: avg=${Math.round(avg)}ms, p95=${Math.round(p95)}ms`);
    });

    // WAF compliance check
    if (this.wafBlockCounter > 0) {
      console.warn('\n⚠️  WAF blocking detected - review allowlist configuration');
    } else {
      console.log('\n✅ No WAF blocking detected - allowlist working correctly');
    }

    return done();
  },

  // Utility functions
  extractEndpoint: function(url) {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;

      // Normalize common endpoints
      if (path === '/') return 'homepage';
      if (path.startsWith('/newsletter')) return 'newsletter';
      if (path.startsWith('/api/health')) return 'api-health';
      if (path.startsWith('/landingpage')) return 'landing';
      if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.ico')) return 'static-assets';

      return path.split('/')[1] || 'unknown';
    } catch (e) {
      return 'unknown';
    }
  },

  calculatePercentile: function(values, percentile) {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[index] || 0;
  }
};
