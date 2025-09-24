#!/usr/bin/env node

/**
 * Lighthouse Automation Script for aclue Platform
 * Configured for WAF allowlist compatibility
 *
 * This script runs Lighthouse audits against the aclue platform
 * with proper headers and configuration to work with Cloudflare WAF allowlist
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  urls: [
    'https://aclue.app',
    'https://aclue.app/newsletter',
    'https://aclue.app/landingpage',
  ],
  output: {
    directory: './lighthouse-reports',
    format: ['html', 'json'],
  },
  lighthouse: {
    // WAF-friendly configuration
    flags: {
      chromeFlags: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome-Lighthouse Chrome/120.0.0.0 Safari/537.36',
      ],
      // Rate limiting compliance
      throttlingMethod: 'devtools',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
      // WAF identification headers
      extraHeaders: JSON.stringify({
        'X-Test-Purpose': 'lighthouse-performance-audit',
        'X-Monitoring-Tool': 'lighthouse',
        'X-Request-Source': 'aclue-monitoring',
      }),
    },
    config: {
      extends: 'lighthouse:default',
      settings: {
        // Skip CPU-intensive audits to stay within rate limits
        skipAudits: [
          'uses-optimized-images',
          'modern-image-formats',
          'unused-css-rules',
        ],
        // Only run essential audits
        onlyAudits: [
          'first-contentful-paint',
          'largest-contentful-paint',
          'cumulative-layout-shift',
          'total-blocking-time',
          'speed-index',
          'interactive',
          'accessibility',
          'best-practices',
          'seo',
        ],
      },
    },
  },
};

// Utility functions
const createReportDirectory = () => {
  if (!fs.existsSync(config.output.directory)) {
    fs.mkdirSync(config.output.directory, { recursive: true });
  }
};

const generateTimestamp = () => {
  return new Date().toISOString().replace(/[:.]/g, '-');
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// WAF-compliant request function
const runLighthouseAudit = async (url, chrome) => {
  console.log(`🔍 Running Lighthouse audit for: ${url}`);

  try {
    const options = {
      logLevel: 'info',
      output: config.output.format,
      port: chrome.port,
      ...config.lighthouse.flags,
    };

    const runnerResult = await lighthouse(url, options, config.lighthouse.config);

    if (!runnerResult) {
      throw new Error('Lighthouse audit failed to generate results');
    }

    const timestamp = generateTimestamp();
    const urlSlug = url.replace(/https?:\/\//, '').replace(/[\/\.]/g, '-');

    // Save HTML report
    if (runnerResult.report && Array.isArray(runnerResult.report)) {
      const htmlReport = runnerResult.report[0];
      const htmlPath = path.join(config.output.directory, `lighthouse-${urlSlug}-${timestamp}.html`);
      fs.writeFileSync(htmlPath, htmlReport);
      console.log(`📄 HTML report saved: ${htmlPath}`);
    }

    // Save JSON report
    const jsonReport = runnerResult.lhr;
    const jsonPath = path.join(config.output.directory, `lighthouse-${urlSlug}-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonReport, null, 2));
    console.log(`📊 JSON report saved: ${jsonPath}`);

    return {
      url,
      timestamp,
      scores: {
        performance: Math.round(jsonReport.categories.performance?.score * 100) || 0,
        accessibility: Math.round(jsonReport.categories.accessibility?.score * 100) || 0,
        bestPractices: Math.round(jsonReport.categories['best-practices']?.score * 100) || 0,
        seo: Math.round(jsonReport.categories.seo?.score * 100) || 0,
      },
      metrics: {
        fcp: jsonReport.audits['first-contentful-paint']?.numericValue || 0,
        lcp: jsonReport.audits['largest-contentful-paint']?.numericValue || 0,
        cls: jsonReport.audits['cumulative-layout-shift']?.numericValue || 0,
        tbt: jsonReport.audits['total-blocking-time']?.numericValue || 0,
        si: jsonReport.audits['speed-index']?.numericValue || 0,
        tti: jsonReport.audits['interactive']?.numericValue || 0,
      },
    };
  } catch (error) {
    console.error(`❌ Lighthouse audit failed for ${url}:`, error.message);
    return {
      url,
      timestamp: generateTimestamp(),
      error: error.message,
      scores: null,
      metrics: null,
    };
  }
};

// WAF compliance check
const checkWAFAccess = async () => {
  console.log('🔒 Checking WAF allowlist access...');

  const testUrl = 'https://aclue.app';
  const chrome = await chromeLauncher.launch({
    chromeFlags: config.lighthouse.flags.chromeFlags,
  });

  try {
    const options = {
      logLevel: 'error',
      output: 'json',
      port: chrome.port,
      ...config.lighthouse.flags,
    };

    const result = await lighthouse(testUrl, options);

    if (result && result.lhr && result.lhr.fetchTime) {
      console.log('✅ WAF allowlist access verified');
      return true;
    } else {
      console.log('⚠️  WAF may be blocking requests');
      return false;
    }
  } catch (error) {
    console.error('❌ WAF access check failed:', error.message);
    return false;
  } finally {
    await chrome.kill();
  }
};

// Generate summary report
const generateSummaryReport = (results) => {
  const summary = {
    timestamp: generateTimestamp(),
    totalAudits: results.length,
    successfulAudits: results.filter(r => !r.error).length,
    failedAudits: results.filter(r => r.error).length,
    averageScores: {},
    results: results,
  };

  // Calculate average scores
  const successfulResults = results.filter(r => r.scores);
  if (successfulResults.length > 0) {
    const scoreCategories = ['performance', 'accessibility', 'bestPractices', 'seo'];
    scoreCategories.forEach(category => {
      const scores = successfulResults.map(r => r.scores[category]).filter(s => s > 0);
      summary.averageScores[category] = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    });
  }

  const summaryPath = path.join(config.output.directory, `lighthouse-summary-${summary.timestamp}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`📈 Summary report saved: ${summaryPath}`);

  return summary;
};

// Main execution function
const runLighthouseAudits = async () => {
  console.log('🚀 Starting Lighthouse audits for aclue platform');
  console.log(`URLs to audit: ${config.urls.join(', ')}`);

  // Check WAF access first
  const hasWAFAccess = await checkWAFAccess();
  if (!hasWAFAccess) {
    console.error('❌ WAF blocking detected. Please verify allowlist configuration.');
    process.exit(1);
  }

  createReportDirectory();

  const chrome = await chromeLauncher.launch({
    chromeFlags: config.lighthouse.flags.chromeFlags,
  });

  const results = [];

  try {
    for (const url of config.urls) {
      const result = await runLighthouseAudit(url, chrome);
      results.push(result);

      // WAF-friendly delay between requests (respect rate limits)
      if (config.urls.indexOf(url) < config.urls.length - 1) {
        console.log('⏳ Waiting 30 seconds to respect WAF rate limits...');
        await delay(30000); // 30 second delay
      }
    }
  } finally {
    await chrome.kill();
  }

  // Generate summary
  const summary = generateSummaryReport(results);

  // Console output
  console.log('\n📊 Lighthouse Audit Summary:');
  console.log(`Total audits: ${summary.totalAudits}`);
  console.log(`Successful: ${summary.successfulAudits}`);
  console.log(`Failed: ${summary.failedAudits}`);

  if (Object.keys(summary.averageScores).length > 0) {
    console.log('\nAverage Scores:');
    Object.entries(summary.averageScores).forEach(([category, score]) => {
      const emoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
      console.log(`${emoji} ${category}: ${score}/100`);
    });
  }

  console.log('\n✅ Lighthouse audits completed successfully');
  return summary;
};

// CI/CD integration
const runCIMode = async () => {
  try {
    const summary = await runLighthouseAudits();

    // Set exit code based on performance thresholds
    const minPerformanceScore = process.env.LIGHTHOUSE_MIN_PERFORMANCE || 70;
    const minAccessibilityScore = process.env.LIGHTHOUSE_MIN_ACCESSIBILITY || 90;

    if (summary.averageScores.performance < minPerformanceScore) {
      console.error(`❌ Performance score ${summary.averageScores.performance} below threshold ${minPerformanceScore}`);
      process.exit(1);
    }

    if (summary.averageScores.accessibility < minAccessibilityScore) {
      console.error(`❌ Accessibility score ${summary.averageScores.accessibility} below threshold ${minAccessibilityScore}`);
      process.exit(1);
    }

    console.log('✅ All quality gates passed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lighthouse CI failed:', error.message);
    process.exit(1);
  }
};

// Command line execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--ci')) {
    runCIMode();
  } else {
    runLighthouseAudits().catch(error => {
      console.error('❌ Lighthouse execution failed:', error);
      process.exit(1);
    });
  }
}

module.exports = {
  runLighthouseAudits,
  runCIMode,
  config,
};
