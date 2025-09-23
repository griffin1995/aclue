#!/usr/bin/env node

/**
 * Performance Testing Suite for aclue Platform
 *
 * Automated performance testing using Puppeteer and Lighthouse
 * Measures Core Web Vitals, resource usage, and custom metrics
 *
 * Usage:
 *   npm run perf:test
 *   node scripts/performance-test.js [options]
 *
 * Options:
 *   --url <url>         URL to test (default: http://localhost:3000)
 *   --runs <number>     Number of test runs (default: 3)
 *   --device <type>     Device type: desktop|mobile|tablet (default: desktop)
 *   --throttle <type>   Network throttling: none|3g|4g (default: none)
 *   --output <path>     Output directory for reports (default: ./performance-reports)
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const { URL } = require('url');
const fs = require('fs').promises;
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const index = args.indexOf(`--${name}`);
  return index > -1 && args[index + 1] ? args[index + 1] : defaultValue;
};

const CONFIG = {
  url: getArg('url', 'http://localhost:3000'),
  runs: parseInt(getArg('runs', '3')),
  device: getArg('device', 'desktop'),
  throttle: getArg('throttle', 'none'),
  outputDir: getArg('output', './performance-reports'),
};

// Device configurations
const DEVICES = {
  desktop: {
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    deviceScaleFactor: 1,
  },
  mobile: {
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    deviceScaleFactor: 3,
  },
  tablet: {
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
    deviceScaleFactor: 2,
  },
};

// Network throttling configurations
const THROTTLING = {
  none: null,
  '3g': {
    downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
    uploadThroughput: (768 * 1024) / 8, // 768 Kbps
    latency: 150,
  },
  '4g': {
    downloadThroughput: (10 * 1024 * 1024) / 8, // 10 Mbps
    uploadThroughput: (3 * 1024 * 1024) / 8, // 3 Mbps
    latency: 40,
  },
};

/**
 * Run Lighthouse audit
 */
async function runLighthouse(url, options = {}) {
  const chrome = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const port = new URL(chrome.wsEndpoint()).port;

  const lighthouseOptions = {
    port,
    output: 'json',
    onlyCategories: ['performance'],
    throttlingMethod: 'devtools',
    ...options,
  };

  const runnerResult = await lighthouse(url, lighthouseOptions);
  await chrome.close();

  return runnerResult;
}

/**
 * Run custom performance tests with Puppeteer
 */
async function runCustomTests(url, device) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set device configuration
  await page.setViewport(DEVICES[device].viewport);
  await page.setUserAgent(DEVICES[device].userAgent);

  // Enable performance monitoring
  await page.evaluateOnNewDocument(() => {
    window.__PERF_METRICS = {
      startTime: Date.now(),
      marks: [],
      measures: [],
      resources: [],
    };

    // Override performance.mark
    const originalMark = performance.mark.bind(performance);
    performance.mark = function(name) {
      window.__PERF_METRICS.marks.push({
        name,
        time: Date.now() - window.__PERF_METRICS.startTime,
      });
      return originalMark(name);
    };
  });

  // Start CDP session for network throttling
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');

  if (THROTTLING[CONFIG.throttle]) {
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      ...THROTTLING[CONFIG.throttle],
    });
  }

  // Collect performance metrics
  const metrics = {
    navigation: null,
    resources: [],
    coverage: null,
    memory: null,
    cpu: null,
    customMetrics: null,
  };

  // Navigate and measure
  const startTime = Date.now();

  try {
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for any animations to settle
    await page.waitForTimeout(2000);

    // Get navigation timing
    metrics.navigation = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      return {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ssl: timing.requestStart - timing.secureConnectionStart,
        ttfb: timing.responseStart - timing.requestStart,
        download: timing.responseEnd - timing.responseStart,
        domInteractive: timing.domInteractive - timing.fetchStart,
        domComplete: timing.domComplete - timing.fetchStart,
        loadComplete: timing.loadEventEnd - timing.fetchStart,
      };
    });

    // Get resource timing
    metrics.resources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources.map(r => ({
        name: r.name.split('/').pop() || r.name,
        type: r.initiatorType,
        duration: r.duration,
        size: r.transferSize || 0,
      })).sort((a, b) => b.duration - a.duration).slice(0, 10);
    });

    // Get memory usage (Chrome only)
    metrics.memory = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        };
      }
      return null;
    });

    // Get CPU metrics
    const cpuMetrics = await client.send('Performance.getMetrics');
    metrics.cpu = cpuMetrics.metrics.find(m => m.name === 'TaskDuration');

    // Get custom metrics
    metrics.customMetrics = await page.evaluate(() => window.__PERF_METRICS);

    // Measure animation performance
    metrics.animation = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frameTimings = [];
        let frameCount = 0;
        const maxFrames = 60;

        function measureFrame(timestamp) {
          if (frameCount === 0) {
            frameTimings.push(timestamp);
          } else {
            const delta = timestamp - frameTimings[frameTimings.length - 1];
            frameTimings.push(timestamp);
          }

          frameCount++;

          if (frameCount < maxFrames) {
            requestAnimationFrame(measureFrame);
          } else {
            // Calculate FPS and frame time stats
            const deltas = [];
            for (let i = 1; i < frameTimings.length; i++) {
              deltas.push(frameTimings[i] - frameTimings[i - 1]);
            }

            const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
            const maxDelta = Math.max(...deltas);
            const minDelta = Math.min(...deltas);

            resolve({
              avgFPS: Math.round(1000 / avgDelta),
              minFPS: Math.round(1000 / maxDelta),
              maxFPS: Math.round(1000 / minDelta),
              avgFrameTime: avgDelta.toFixed(2),
              droppedFrames: deltas.filter(d => d > 16.67).length,
            });
          }
        }

        requestAnimationFrame(measureFrame);
      });
    });

  } catch (error) {
    console.error('Error during performance test:', error);
    metrics.error = error.message;
  }

  metrics.totalTime = Date.now() - startTime;

  await browser.close();

  return metrics;
}

/**
 * Calculate statistics from multiple runs
 */
function calculateStats(results) {
  const stats = {};

  // Get all metric keys from first result
  const metrics = Object.keys(results[0]);

  metrics.forEach(metric => {
    if (typeof results[0][metric] === 'number') {
      const values = results.map(r => r[metric]);
      stats[metric] = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
      };
    }
  });

  return stats;
}

/**
 * Generate HTML report
 */
async function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aclue Performance Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #333; margin-bottom: 20px; }
    .summary { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
    .metric-card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric-title { font-size: 14px; color: #666; margin-bottom: 5px; }
    .metric-value { font-size: 24px; font-weight: bold; color: #333; }
    .metric-unit { font-size: 14px; color: #999; }
    .score { display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
    .score.good { background: #4ade80; color: white; }
    .score.average { background: #fbbf24; color: white; }
    .score.poor { background: #f87171; color: white; }
    table { width: 100%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f9f9f9; font-weight: 600; }
    .chart { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 aclue Performance Report</h1>

    <div class="summary">
      <h2>Test Configuration</h2>
      <p><strong>URL:</strong> ${CONFIG.url}</p>
      <p><strong>Device:</strong> ${CONFIG.device}</p>
      <p><strong>Network:</strong> ${CONFIG.throttle}</p>
      <p><strong>Runs:</strong> ${CONFIG.runs}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    </div>

    <div class="metric-grid">
      ${Object.entries(results.lighthouse.categories.performance.auditRefs)
        .slice(0, 6)
        .map(([key, audit]) => {
          const auditData = results.lighthouse.audits[audit.id];
          if (!auditData || !auditData.numericValue) return '';
          return `
            <div class="metric-card">
              <div class="metric-title">${auditData.title}</div>
              <div class="metric-value">
                ${auditData.displayValue}
                <span class="score ${auditData.score >= 0.9 ? 'good' : auditData.score >= 0.5 ? 'average' : 'poor'}">
                  ${Math.round(auditData.score * 100)}
                </span>
              </div>
            </div>
          `;
        }).join('')}
    </div>

    <div class="chart">
      <h2>Resource Loading Performance</h2>
      <table>
        <thead>
          <tr>
            <th>Resource</th>
            <th>Type</th>
            <th>Duration (ms)</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          ${results.custom.resources.map(r => `
            <tr>
              <td>${r.name}</td>
              <td>${r.type}</td>
              <td>${r.duration.toFixed(2)}</td>
              <td>${(r.size / 1024).toFixed(2)} KB</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="chart">
      <h2>Animation Performance</h2>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-title">Average FPS</div>
          <div class="metric-value">${results.custom.animation.avgFPS}</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Min FPS</div>
          <div class="metric-value">${results.custom.animation.minFPS}</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Dropped Frames</div>
          <div class="metric-value">${results.custom.animation.droppedFrames}</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Frame Time</div>
          <div class="metric-value">${results.custom.animation.avgFrameTime}<span class="metric-unit">ms</span></div>
        </div>
      </div>
    </div>

    ${results.custom.memory ? `
      <div class="chart">
        <h2>Memory Usage</h2>
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-title">JS Heap Size</div>
            <div class="metric-value">${(results.custom.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}<span class="metric-unit">MB</span></div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Total Heap</div>
            <div class="metric-value">${(results.custom.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}<span class="metric-unit">MB</span></div>
          </div>
        </div>
      </div>
    ` : ''}

  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Main test runner
 */
async function main() {
  console.log('🚀 Starting performance tests...\n');
  console.log(`URL: ${CONFIG.url}`);
  console.log(`Device: ${CONFIG.device}`);
  console.log(`Network: ${CONFIG.throttle}`);
  console.log(`Runs: ${CONFIG.runs}\n`);

  const results = {
    lighthouse: null,
    custom: null,
    stats: null,
  };

  // Ensure output directory exists
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  try {
    // Run Lighthouse audit
    console.log('📊 Running Lighthouse audit...');
    const lighthouseResult = await runLighthouse(CONFIG.url, {
      emulatedFormFactor: CONFIG.device === 'mobile' ? 'mobile' : 'desktop',
      throttling: THROTTLING[CONFIG.throttle] ? {
        cpuSlowdownMultiplier: CONFIG.throttle === '3g' ? 4 : 2,
        ...THROTTLING[CONFIG.throttle],
      } : null,
    });

    results.lighthouse = lighthouseResult.lhr;

    // Display Lighthouse scores
    const perfScore = Math.round(lighthouseResult.lhr.categories.performance.score * 100);
    console.log(`\nLighthouse Performance Score: ${perfScore}/100`);

    // Display key metrics
    const metrics = {
      'First Contentful Paint': lighthouseResult.lhr.audits['first-contentful-paint'],
      'Largest Contentful Paint': lighthouseResult.lhr.audits['largest-contentful-paint'],
      'Total Blocking Time': lighthouseResult.lhr.audits['total-blocking-time'],
      'Cumulative Layout Shift': lighthouseResult.lhr.audits['cumulative-layout-shift'],
      'Speed Index': lighthouseResult.lhr.audits['speed-index'],
    };

    Object.entries(metrics).forEach(([name, audit]) => {
      if (audit && audit.displayValue) {
        console.log(`  ${name}: ${audit.displayValue}`);
      }
    });

    // Run custom tests
    console.log('\n🔬 Running custom performance tests...');
    const customRuns = [];

    for (let i = 0; i < CONFIG.runs; i++) {
      console.log(`  Run ${i + 1}/${CONFIG.runs}...`);
      const result = await runCustomTests(CONFIG.url, CONFIG.device);
      customRuns.push(result);
    }

    // Calculate statistics
    if (customRuns.length > 0) {
      results.custom = customRuns[0]; // Use first run for detailed data

      // Display animation performance
      if (results.custom.animation) {
        console.log('\n🎮 Animation Performance:');
        console.log(`  Average FPS: ${results.custom.animation.avgFPS}`);
        console.log(`  Min FPS: ${results.custom.animation.minFPS}`);
        console.log(`  Dropped Frames: ${results.custom.animation.droppedFrames}/60`);
      }

      // Display memory usage
      if (results.custom.memory) {
        console.log('\n💾 Memory Usage:');
        console.log(`  JS Heap: ${(results.custom.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      }

      // Display slowest resources
      if (results.custom.resources.length > 0) {
        console.log('\n📦 Slowest Resources:');
        results.custom.resources.slice(0, 5).forEach(r => {
          console.log(`  ${r.name}: ${r.duration.toFixed(0)}ms`);
        });
      }
    }

    // Generate reports
    console.log('\n📄 Generating reports...');

    // Save JSON report
    const jsonPath = path.join(CONFIG.outputDir, `performance-report-${Date.now()}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));
    console.log(`  JSON report: ${jsonPath}`);

    // Save HTML report
    const htmlPath = path.join(CONFIG.outputDir, `performance-report-${Date.now()}.html`);
    const htmlContent = await generateHTMLReport(results);
    await fs.writeFile(htmlPath, htmlContent);
    console.log(`  HTML report: ${htmlPath}`);

    // Performance recommendations
    console.log('\n💡 Recommendations:');

    if (perfScore < 90) {
      const audits = lighthouseResult.lhr.audits;

      if (audits['first-contentful-paint'].numericValue > 1800) {
        console.log('  ⚠️ Improve First Contentful Paint (currently > 1.8s)');
        console.log('     - Reduce server response time');
        console.log('     - Eliminate render-blocking resources');
      }

      if (audits['largest-contentful-paint'].numericValue > 2500) {
        console.log('  ⚠️ Optimize Largest Contentful Paint (currently > 2.5s)');
        console.log('     - Optimize images and fonts');
        console.log('     - Use resource hints (preload/prefetch)');
      }

      if (audits['total-blocking-time'].numericValue > 300) {
        console.log('  ⚠️ Reduce Total Blocking Time (currently > 300ms)');
        console.log('     - Split long JavaScript tasks');
        console.log('     - Reduce third-party script impact');
      }

      if (results.custom.animation && results.custom.animation.avgFPS < 50) {
        console.log('  ⚠️ Improve animation performance (currently < 50 FPS)');
        console.log('     - Reduce animation complexity');
        console.log('     - Use CSS transforms instead of JavaScript');
        console.log('     - Implement frame rate throttling');
      }
    } else {
      console.log('  ✅ Performance is good! Consider A/B testing further optimizations.');
    }

    console.log('\n✅ Performance testing complete!');

  } catch (error) {
    console.error('\n❌ Error during testing:', error);
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runLighthouse, runCustomTests, calculateStats };