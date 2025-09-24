#!/usr/bin/env node
/**
 * =============================================================================
 * aclue Platform Security Headers Validator
 * =============================================================================
 *
 * Validates that the deployed application has proper security headers configured.
 * This script can be run locally or in CI/CD pipeline to verify security posture.
 *
 * Usage: node scripts/security-headers-validator.js [URL]
 *
 * =============================================================================
 */

const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  timeout: 10000,
  userAgent: 'aclue-security-validator/1.0',
  outputDir: 'security-reports',
  requiredHeaders: {
    'strict-transport-security': {
      required: true,
      severity: 'critical',
      validate: (value) => {
        if (!value) return { valid: false, message: 'HSTS header missing' };
        const maxAge = value.match(/max-age=(\d+)/);
        if (!maxAge) return { valid: false, message: 'max-age directive missing' };
        const age = parseInt(maxAge[1]);
        if (age < 31536000) return { valid: false, message: 'max-age should be at least 31536000 (1 year)' };
        return { valid: true, message: 'HSTS properly configured' };
      }
    },
    'content-security-policy': {
      required: true,
      severity: 'critical',
      validate: (value) => {
        if (!value) return { valid: false, message: 'CSP header missing' };
        if (value.includes('unsafe-inline') || value.includes('unsafe-eval')) {
          return { valid: false, message: 'CSP contains unsafe directives' };
        }
        if (!value.includes("default-src")) {
          return { valid: false, message: 'CSP should include default-src directive' };
        }
        return { valid: true, message: 'CSP properly configured' };
      }
    },
    'x-frame-options': {
      required: true,
      severity: 'high',
      validate: (value) => {
        if (!value) return { valid: false, message: 'X-Frame-Options header missing' };
        if (!['DENY', 'SAMEORIGIN'].includes(value.toUpperCase())) {
          return { valid: false, message: 'X-Frame-Options should be DENY or SAMEORIGIN' };
        }
        return { valid: true, message: 'X-Frame-Options properly configured' };
      }
    },
    'x-content-type-options': {
      required: true,
      severity: 'high',
      validate: (value) => {
        if (!value) return { valid: false, message: 'X-Content-Type-Options header missing' };
        if (value.toLowerCase() !== 'nosniff') {
          return { valid: false, message: 'X-Content-Type-Options should be nosniff' };
        }
        return { valid: true, message: 'X-Content-Type-Options properly configured' };
      }
    },
    'referrer-policy': {
      required: true,
      severity: 'medium',
      validate: (value) => {
        if (!value) return { valid: false, message: 'Referrer-Policy header missing' };
        const validPolicies = [
          'no-referrer', 'no-referrer-when-downgrade', 'origin',
          'origin-when-cross-origin', 'same-origin', 'strict-origin',
          'strict-origin-when-cross-origin', 'unsafe-url'
        ];
        if (!validPolicies.includes(value.toLowerCase())) {
          return { valid: false, message: 'Invalid Referrer-Policy value' };
        }
        return { valid: true, message: 'Referrer-Policy properly configured' };
      }
    },
    'permissions-policy': {
      required: false,
      severity: 'medium',
      validate: (value) => {
        if (!value) return { valid: true, message: 'Permissions-Policy header optional' };
        // Basic validation - should not be empty if present
        if (value.trim().length === 0) {
          return { valid: false, message: 'Permissions-Policy header should not be empty if present' };
        }
        return { valid: true, message: 'Permissions-Policy configured' };
      }
    }
  },
  discouragedHeaders: {
    'server': 'Server header reveals server information',
    'x-powered-by': 'X-Powered-By header reveals technology stack',
    'x-aspnet-version': 'X-AspNet-Version reveals framework version',
    'x-generator': 'X-Generator reveals framework/CMS information'
  }
};

/**
 * Log messages with colors and timestamps
 */
class Logger {
  static colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
  };

  static log(message, color = 'reset') {
    const timestamp = new Date().toISOString();
    console.log(`${this.colors[color]}[${timestamp}] ${message}${this.colors.reset}`);
  }

  static info(message) { this.log(`ℹ️  ${message}`, 'blue'); }
  static success(message) { this.log(`✅ ${message}`, 'green'); }
  static warning(message) { this.log(`⚠️  ${message}`, 'yellow'); }
  static error(message) { this.log(`❌ ${message}`, 'red'); }
  static critical(message) { this.log(`🚨 ${message}`, 'magenta'); }
}

/**
 * Make HTTP/HTTPS request and return headers
 */
function makeRequest(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(targetUrl);
    const requestModule = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.path || '/',
      method: 'GET',
      timeout: CONFIG.timeout,
      headers: {
        'User-Agent': CONFIG.userAgent
      }
    };

    const request = requestModule.request(options, (response) => {
      resolve({
        statusCode: response.statusCode,
        headers: response.headers,
        url: targetUrl
      });
    });

    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Request timeout after ${CONFIG.timeout}ms`));
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
}

/**
 * Validate security headers
 */
function validateHeaders(headers) {
  const results = {
    passed: [],
    failed: [],
    warnings: [],
    informationDisclosure: [],
    summary: {
      totalChecks: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0
    }
  };

  // Check required security headers
  Object.entries(CONFIG.requiredHeaders).forEach(([headerName, config]) => {
    const headerValue = headers[headerName.toLowerCase()];
    const validation = config.validate(headerValue);

    results.summary.totalChecks++;

    const result = {
      header: headerName,
      present: !!headerValue,
      value: headerValue || null,
      severity: config.severity,
      required: config.required,
      validation: validation
    };

    if (validation.valid) {
      results.passed.push(result);
      results.summary.passed++;
      Logger.success(`${headerName}: ${validation.message}`);
    } else {
      if (config.required) {
        results.failed.push(result);
        results.summary.failed++;

        // Count by severity
        if (config.severity === 'critical') results.summary.criticalIssues++;
        else if (config.severity === 'high') results.summary.highIssues++;
        else if (config.severity === 'medium') results.summary.mediumIssues++;

        Logger.error(`${headerName}: ${validation.message}`);
      } else {
        results.warnings.push(result);
        results.summary.warnings++;
        Logger.warning(`${headerName}: ${validation.message}`);
      }
    }
  });

  // Check for information disclosure headers
  Object.entries(CONFIG.discouragedHeaders).forEach(([headerName, reason]) => {
    const headerValue = headers[headerName.toLowerCase()];
    if (headerValue) {
      const disclosure = {
        header: headerName,
        value: headerValue,
        reason: reason
      };
      results.informationDisclosure.push(disclosure);
      Logger.warning(`Information disclosure - ${headerName}: ${headerValue} (${reason})`);
    }
  });

  return results;
}

/**
 * Generate security report
 */
function generateReport(results, targetUrl) {
  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const report = {
    metadata: {
      timestamp: timestamp,
      target_url: targetUrl,
      scan_type: 'security_headers_validation',
      tool: 'aclue-security-headers-validator',
      version: '1.0.0'
    },
    results: results,
    recommendations: generateRecommendations(results)
  };

  // Save JSON report
  const jsonReportPath = path.join(CONFIG.outputDir, 'security-headers-report.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
  Logger.success(`JSON report saved: ${jsonReportPath}`);

  // Save HTML report
  const htmlReportPath = path.join(CONFIG.outputDir, 'security-headers-report.html');
  const htmlContent = generateHtmlReport(report);
  fs.writeFileSync(htmlReportPath, htmlContent);
  Logger.success(`HTML report saved: ${htmlReportPath}`);

  return report;
}

/**
 * Generate recommendations based on results
 */
function generateRecommendations(results) {
  const recommendations = [];

  if (results.summary.criticalIssues > 0) {
    recommendations.push({
      priority: 'critical',
      action: 'Immediately implement missing critical security headers',
      details: 'Critical security headers protect against serious attacks and should be implemented without delay.'
    });
  }

  if (results.summary.highIssues > 0) {
    recommendations.push({
      priority: 'high',
      action: 'Implement missing high-priority security headers',
      details: 'High-priority headers provide important protection against common web vulnerabilities.'
    });
  }

  if (results.informationDisclosure.length > 0) {
    recommendations.push({
      priority: 'medium',
      action: 'Remove or mask information disclosure headers',
      details: 'Headers revealing server information should be removed to reduce attack surface.'
    });
  }

  recommendations.push({
    priority: 'low',
    action: 'Regularly review and update security headers',
    details: 'Security headers should be reviewed and updated as part of regular security maintenance.'
  });

  return recommendations;
}

/**
 * Generate HTML report
 */
function generateHtmlReport(report) {
  const { results, metadata } = report;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>aclue Security Headers Report</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #007acc; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid; }
        .metric.passed { border-color: #28a745; }
        .metric.failed { border-color: #dc3545; }
        .metric.warning { border-color: #ffc107; }
        .metric-value { font-size: 2rem; font-weight: bold; margin-bottom: 5px; }
        .metric-label { color: #666; font-size: 0.9rem; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .header-item { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 5px; border-left: 4px solid; }
        .header-passed { border-color: #28a745; }
        .header-failed { border-color: #dc3545; }
        .header-warning { border-color: #ffc107; }
        .header-name { font-weight: bold; color: #333; }
        .header-value { font-family: monospace; background: #e9ecef; padding: 5px 8px; border-radius: 3px; margin: 8px 0; }
        .severity { display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; color: white; }
        .severity.critical { background: #dc3545; }
        .severity.high { background: #fd7e14; }
        .severity.medium { background: #ffc107; color: #333; }
        .severity.low { background: #28a745; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Security Headers Report</h1>
            <p>Target: <strong>${metadata.target_url}</strong></p>
            <p>Generated: ${metadata.timestamp}</p>
        </div>

        <div class="summary">
            <div class="metric passed">
                <div class="metric-value">${results.summary.passed}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric failed">
                <div class="metric-value">${results.summary.failed}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric warning">
                <div class="metric-value">${results.summary.warnings}</div>
                <div class="metric-label">Warnings</div>
            </div>
        </div>

        ${results.failed.length > 0 ? `
        <div class="section">
            <h2>❌ Failed Checks</h2>
            ${results.failed.map(item => `
                <div class="header-item header-failed">
                    <div class="header-name">${item.header}</div>
                    <span class="severity ${item.severity}">${item.severity}</span>
                    <div>Status: ${item.validation.message}</div>
                    ${item.value ? `<div class="header-value">${item.value}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${results.passed.length > 0 ? `
        <div class="section">
            <h2>✅ Passed Checks</h2>
            ${results.passed.map(item => `
                <div class="header-item header-passed">
                    <div class="header-name">${item.header}</div>
                    <span class="severity ${item.severity}">${item.severity}</span>
                    <div>Status: ${item.validation.message}</div>
                    ${item.value ? `<div class="header-value">${item.value}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${results.informationDisclosure.length > 0 ? `
        <div class="section">
            <h2>⚠️ Information Disclosure</h2>
            ${results.informationDisclosure.map(item => `
                <div class="header-item header-warning">
                    <div class="header-name">${item.header}</div>
                    <div>Reason: ${item.reason}</div>
                    <div class="header-value">${item.value}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>📋 Recommendations</h2>
            ${report.recommendations.map(rec => `
                <div class="header-item">
                    <span class="severity ${rec.priority}">${rec.priority}</span>
                    <div class="header-name">${rec.action}</div>
                    <div>${rec.details}</div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
}

/**
 * Main execution
 */
async function main() {
  const targetUrl = process.argv[2] || process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';

  Logger.info(`Starting security headers validation for: ${targetUrl}`);

  try {
    Logger.info('Making request to target URL...');
    const response = await makeRequest(targetUrl);

    Logger.info(`Response received: ${response.statusCode}`);
    Logger.info('Validating security headers...');

    const results = validateHeaders(response.headers);

    // Generate reports
    Logger.info('Generating security reports...');
    const report = generateReport(results, targetUrl);

    // Summary
    console.log('\n' + '='.repeat(60));
    Logger.info(`Security Headers Validation Summary:`);
    Logger.info(`Total Checks: ${results.summary.totalChecks}`);
    Logger.success(`Passed: ${results.summary.passed}`);
    Logger.error(`Failed: ${results.summary.failed}`);
    Logger.warning(`Warnings: ${results.summary.warnings}`);
    Logger.info(`Critical Issues: ${results.summary.criticalIssues}`);
    Logger.info(`High Issues: ${results.summary.highIssues}`);
    Logger.info(`Medium Issues: ${results.summary.mediumIssues}`);
    console.log('='.repeat(60));

    // Exit code based on results
    if (results.summary.criticalIssues > 0) {
      Logger.critical('Critical security header issues found!');
      process.exit(1);
    } else if (results.summary.highIssues > 0) {
      Logger.warning('High-priority security header issues found');
      process.exit(2);
    } else if (results.summary.failed > 0) {
      Logger.warning('Some security header checks failed');
      process.exit(2);
    } else {
      Logger.success('All security header validations passed!');
      process.exit(0);
    }

  } catch (error) {
    Logger.error(`Security headers validation failed: ${error.message}`);
    process.exit(3);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    Logger.error(`Unexpected error: ${error.message}`);
    process.exit(3);
  });
}

module.exports = { validateHeaders, makeRequest, CONFIG };
