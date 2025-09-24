#!/usr/bin/env node
/**
 * =============================================================================
 * aclue Frontend Security Report Generator
 * =============================================================================
 *
 * Generates comprehensive security reports for the aclue frontend application
 * by consolidating results from multiple security scanning tools and providing
 * actionable insights for developers and security teams.
 *
 * Usage: node scripts/security-report-generator.js [--format=html|json] [--output=path]
 *
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  outputFormats: ['html', 'json'],
  defaultFormat: 'html',
  outputDir: '../security-reports',
  reportSources: {
    npmAudit: 'npm-audit*.json',
    eslintSecurity: 'eslint-security*.json',
    bundleAnalysis: 'bundle-analysis*.json',
    securityHeaders: 'security-headers*.json',
    dependencyCheck: 'dependency-check*.json'
  },
  severityLevels: ['critical', 'high', 'medium', 'low', 'info'],
  colors: {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m'
  }
};

/**
 * Logger utility
 */
class Logger {
  static log(message, color = 'reset') {
    const timestamp = new Date().toISOString();
    console.log(`${CONFIG.colors[color]}[${timestamp}] ${message}${CONFIG.colors.reset}`);
  }

  static info(message) { this.log(`ℹ️  ${message}`, 'blue'); }
  static success(message) { this.log(`✅ ${message}`, 'green'); }
  static warning(message) { this.log(`⚠️  ${message}`, 'yellow'); }
  static error(message) { this.log(`❌ ${message}`, 'red'); }
  static critical(message) { this.log(`🚨 ${message}`, 'magenta'); }
}

/**
 * Security Report Generator
 */
class SecurityReportGenerator {
  constructor(options = {}) {
    this.format = options.format || CONFIG.defaultFormat;
    this.outputDir = path.resolve(options.output || CONFIG.outputDir);
    this.projectRoot = path.resolve(__dirname, '..');
    this.results = {
      metadata: {},
      summary: {},
      findings: [],
      recommendations: [],
      metrics: {}
    };
  }

  /**
   * Initialize the report generation process
   */
  async initialize() {
    Logger.info('Initializing security report generation...');

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      Logger.info(`Created output directory: ${this.outputDir}`);
    }

    // Collect metadata
    this.results.metadata = {
      timestamp: new Date().toISOString(),
      project: 'aclue-frontend',
      generator: 'aclue-security-report-generator',
      version: '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      workingDirectory: this.projectRoot
    };

    // Add Git information if available
    try {
      this.results.metadata.git = {
        commit: execSync('git rev-parse HEAD', { encoding: 'utf8', cwd: this.projectRoot }).trim(),
        branch: execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: this.projectRoot }).trim(),
        author: execSync('git log -1 --pretty=format:"%an"', { encoding: 'utf8', cwd: this.projectRoot }).trim(),
        date: execSync('git log -1 --pretty=format:"%ai"', { encoding: 'utf8', cwd: this.projectRoot }).trim()
      };
    } catch (error) {
      Logger.warning('Git information not available');
      this.results.metadata.git = null;
    }

    Logger.success('Initialization completed');
  }

  /**
   * Collect results from various security scan reports
   */
  async collectResults() {
    Logger.info('Collecting security scan results...');

    const collectedData = {};
    let totalFindings = 0;

    // Process each report source
    for (const [sourceName, pattern] of Object.entries(CONFIG.reportSources)) {
      try {
        const files = this.findReportFiles(pattern);
        if (files.length > 0) {
          Logger.info(`Found ${files.length} report file(s) for ${sourceName}`);
          collectedData[sourceName] = [];

          for (const filePath of files) {
            try {
              const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
              collectedData[sourceName].push({
                file: path.basename(filePath),
                data: data,
                size: fs.statSync(filePath).size
              });

              // Extract findings based on source type
              const findings = this.extractFindings(sourceName, data);
              this.results.findings.push(...findings);
              totalFindings += findings.length;

            } catch (parseError) {
              Logger.warning(`Failed to parse ${filePath}: ${parseError.message}`);
            }
          }
        } else {
          Logger.info(`No report files found for ${sourceName}`);
          collectedData[sourceName] = [];
        }
      } catch (error) {
        Logger.error(`Error processing ${sourceName}: ${error.message}`);
        collectedData[sourceName] = [];
      }
    }

    this.results.rawData = collectedData;
    Logger.success(`Collected ${totalFindings} security findings from all sources`);
  }

  /**
   * Find report files matching a pattern
   */
  findReportFiles(pattern) {
    const files = [];

    try {
      const entries = fs.readdirSync(this.outputDir);
      const regex = new RegExp(pattern.replace('*', '.*'));

      for (const entry of entries) {
        if (regex.test(entry)) {
          const fullPath = path.join(this.outputDir, entry);
          if (fs.statSync(fullPath).isFile()) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      Logger.warning(`Error reading directory ${this.outputDir}: ${error.message}`);
    }

    return files;
  }

  /**
   * Extract findings from specific report types
   */
  extractFindings(sourceName, data) {
    const findings = [];

    switch (sourceName) {
      case 'npmAudit':
        if (data.vulnerabilities) {
          for (const [name, vuln] of Object.entries(data.vulnerabilities)) {
            findings.push({
              source: 'npm-audit',
              type: 'dependency-vulnerability',
              severity: vuln.severity,
              title: vuln.title || `Vulnerability in ${name}`,
              description: vuln.overview || 'No description available',
              package: name,
              version: vuln.versions || 'unknown',
              recommendation: vuln.recommendation || 'Update package to latest version',
              references: vuln.url ? [vuln.url] : []
            });
          }
        }
        break;

      case 'eslintSecurity':
        if (Array.isArray(data)) {
          for (const result of data) {
            if (result.messages) {
              for (const message of result.messages) {
                findings.push({
                  source: 'eslint-security',
                  type: 'code-security-issue',
                  severity: message.severity === 2 ? 'high' : 'medium',
                  title: message.message,
                  description: `${message.ruleId}: ${message.message}`,
                  file: result.filePath,
                  line: message.line,
                  column: message.column,
                  rule: message.ruleId,
                  recommendation: 'Review and fix the security issue according to the rule documentation'
                });
              }
            }
          }
        }
        break;

      case 'securityHeaders':
        if (data.results && data.results.failed) {
          for (const header of data.results.failed) {
            findings.push({
              source: 'security-headers',
              type: 'configuration-issue',
              severity: header.severity,
              title: `Missing security header: ${header.header}`,
              description: header.validation.message,
              recommendation: 'Configure the missing security header in your web server or application',
              header: header.header,
              required: header.required
            });
          }
        }
        break;

      case 'bundleAnalysis':
        // Extract large bundle findings or potential security issues
        if (data.bundles) {
          for (const bundle of data.bundles) {
            if (bundle.size > 1000000) { // 1MB threshold
              findings.push({
                source: 'bundle-analysis',
                type: 'performance-security',
                severity: 'low',
                title: 'Large bundle size detected',
                description: `Bundle ${bundle.name} is ${Math.round(bundle.size / 1024)}KB`,
                recommendation: 'Consider code splitting or removing unused dependencies',
                bundle: bundle.name,
                size: bundle.size
              });
            }
          }
        }
        break;
    }

    return findings;
  }

  /**
   * Analyze findings and generate summary
   */
  async analyzeFindings() {
    Logger.info('Analyzing security findings...');

    const summary = {
      totalFindings: this.results.findings.length,
      bySeverity: {},
      byType: {},
      bySource: {},
      riskScore: 0,
      riskLevel: 'low'
    };

    // Initialize counters
    CONFIG.severityLevels.forEach(severity => {
      summary.bySeverity[severity] = 0;
    });

    // Analyze findings
    for (const finding of this.results.findings) {
      // Count by severity
      if (summary.bySeverity.hasOwnProperty(finding.severity)) {
        summary.bySeverity[finding.severity]++;
      }

      // Count by type
      if (!summary.byType[finding.type]) {
        summary.byType[finding.type] = 0;
      }
      summary.byType[finding.type]++;

      // Count by source
      if (!summary.bySource[finding.source]) {
        summary.bySource[finding.source] = 0;
      }
      summary.bySource[finding.source]++;
    }

    // Calculate risk score (0-100)
    summary.riskScore = Math.min(100,
      summary.bySeverity.critical * 25 +
      summary.bySeverity.high * 10 +
      summary.bySeverity.medium * 3 +
      summary.bySeverity.low * 1
    );

    // Determine risk level
    if (summary.bySeverity.critical > 0) {
      summary.riskLevel = 'critical';
    } else if (summary.bySeverity.high > 5) {
      summary.riskLevel = 'high';
    } else if (summary.bySeverity.high > 0 || summary.bySeverity.medium > 10) {
      summary.riskLevel = 'medium';
    } else {
      summary.riskLevel = 'low';
    }

    this.results.summary = summary;

    // Generate recommendations
    this.generateRecommendations();

    Logger.success(`Analysis completed: ${summary.totalFindings} findings, risk level: ${summary.riskLevel}`);
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    const summary = this.results.summary;

    // Critical recommendations
    if (summary.bySeverity.critical > 0) {
      recommendations.push({
        priority: 'critical',
        category: 'immediate-action',
        title: 'Address Critical Security Vulnerabilities',
        description: `${summary.bySeverity.critical} critical security issues require immediate attention`,
        action: 'Review and fix all critical findings before deployment',
        impact: 'High - Critical vulnerabilities can lead to security breaches'
      });
    }

    // High priority recommendations
    if (summary.bySeverity.high > 0) {
      recommendations.push({
        priority: 'high',
        category: 'security-improvement',
        title: 'Fix High-Priority Security Issues',
        description: `${summary.bySeverity.high} high-priority security issues identified`,
        action: 'Address high-priority findings in the next sprint',
        impact: 'Medium - High-priority issues should be resolved promptly'
      });
    }

    // Dependency-specific recommendations
    if (summary.bySource['npm-audit'] > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'dependency-management',
        title: 'Update Vulnerable Dependencies',
        description: 'Package vulnerabilities detected in npm dependencies',
        action: 'Run "npm audit fix" and update packages to latest secure versions',
        impact: 'Medium - Outdated packages may contain known vulnerabilities'
      });
    }

    // Code quality recommendations
    if (summary.bySource['eslint-security'] > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'code-quality',
        title: 'Address Code Security Issues',
        description: 'ESLint security plugin identified potential code security issues',
        action: 'Review and fix ESLint security warnings in the codebase',
        impact: 'Medium - Code security issues can introduce vulnerabilities'
      });
    }

    // General security recommendations
    recommendations.push({
      priority: 'low',
      category: 'process-improvement',
      title: 'Implement Continuous Security Monitoring',
      description: 'Regular security scanning should be part of the development process',
      action: 'Integrate security scanning into CI/CD pipeline',
      impact: 'Low - Preventive measure to catch issues early'
    });

    recommendations.push({
      priority: 'low',
      category: 'documentation',
      title: 'Maintain Security Documentation',
      description: 'Keep security practices and procedures up to date',
      action: 'Document security requirements and review procedures',
      impact: 'Low - Improves security awareness and compliance'
    });

    this.results.recommendations = recommendations;
  }

  /**
   * Generate HTML report
   */
  generateHtmlReport() {
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>aclue Frontend Security Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 30px; text-align: center; }
        .header h1 { color: #007acc; margin-bottom: 10px; }
        .header .subtitle { color: #666; font-size: 1.1em; }
        .header .meta { margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; text-align: left; }
        .meta-item { background: #f8f9fa; padding: 15px; border-radius: 5px; }
        .meta-item strong { color: #007acc; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        .summary-value { font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }
        .summary-label { color: #666; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .risk-critical .summary-value { color: #dc3545; }
        .risk-high .summary-value { color: #fd7e14; }
        .risk-medium .summary-value { color: #ffc107; }
        .risk-low .summary-value { color: #28a745; }
        .section { background: white; margin-bottom: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .section-header { background: #007acc; color: white; padding: 20px; font-size: 1.2em; font-weight: bold; }
        .section-content { padding: 25px; }
        .findings-grid { display: grid; gap: 15px; }
        .finding { background: #f8f9fa; border-left: 4px solid; padding: 20px; border-radius: 0 5px 5px 0; }
        .finding.critical { border-color: #dc3545; background: #ffeaea; }
        .finding.high { border-color: #fd7e14; background: #fff4e6; }
        .finding.medium { border-color: #ffc107; background: #fff8e1; }
        .finding.low { border-color: #28a745; background: #f0f9f0; }
        .finding-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .finding-title { font-weight: bold; font-size: 1.1em; }
        .severity-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8em; font-weight: bold; text-transform: uppercase; color: white; }
        .severity-badge.critical { background: #dc3545; }
        .severity-badge.high { background: #fd7e14; }
        .severity-badge.medium { background: #ffc107; color: #333; }
        .severity-badge.low { background: #28a745; }
        .finding-meta { margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 0.9em; color: #666; }
        .recommendations { display: grid; gap: 15px; }
        .recommendation { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; border-radius: 0 5px 5px 0; }
        .recommendation.critical { background: #ffebee; border-color: #f44336; }
        .recommendation.high { background: #fff3e0; border-color: #ff9800; }
        .recommendation.medium { background: #fffde7; border-color: #ffc107; }
        .chart { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ddd; }
        .chart-title { font-weight: bold; margin-bottom: 15px; }
        .bar-chart { display: grid; gap: 10px; }
        .bar { display: flex; align-items: center; }
        .bar-label { width: 120px; font-weight: 500; }
        .bar-visual { flex: 1; height: 25px; background: #e0e0e0; border-radius: 12px; overflow: hidden; position: relative; margin: 0 10px; }
        .bar-fill { height: 100%; border-radius: 12px; transition: width 0.3s ease; }
        .bar-fill.critical { background: #dc3545; }
        .bar-fill.high { background: #fd7e14; }
        .bar-fill.medium { background: #ffc107; }
        .bar-fill.low { background: #28a745; }
        .bar-count { min-width: 30px; font-weight: bold; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ aclue Frontend Security Report</h1>
            <p class="subtitle">Comprehensive Security Analysis Report</p>
            <div class="meta">
                <div class="meta-item">
                    <strong>Generated:</strong><br>
                    ${new Date(this.results.metadata.timestamp).toLocaleString()}
                </div>
                <div class="meta-item">
                    <strong>Project:</strong><br>
                    ${this.results.metadata.project}
                </div>
                <div class="meta-item">
                    <strong>Branch:</strong><br>
                    ${this.results.metadata.git?.branch || 'Unknown'}
                </div>
                <div class="meta-item">
                    <strong>Commit:</strong><br>
                    ${this.results.metadata.git?.commit?.substring(0, 8) || 'Unknown'}
                </div>
            </div>
        </div>

        <div class="summary">
            <div class="summary-card">
                <div class="summary-value">${this.results.summary.totalFindings}</div>
                <div class="summary-label">Total Findings</div>
            </div>
            <div class="summary-card risk-${this.results.summary.riskLevel}">
                <div class="summary-value">${this.results.summary.riskScore}</div>
                <div class="summary-label">Risk Score</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${this.results.summary.bySeverity.critical}</div>
                <div class="summary-label">Critical</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${this.results.summary.bySeverity.high}</div>
                <div class="summary-label">High Priority</div>
            </div>
        </div>

        <div class="chart">
            <div class="chart-title">Findings by Severity</div>
            <div class="bar-chart">
                ${CONFIG.severityLevels.filter(sev => this.results.summary.bySeverity[sev] > 0).map(severity => {
                  const count = this.results.summary.bySeverity[severity];
                  const maxCount = Math.max(...Object.values(this.results.summary.bySeverity));
                  const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return `
                    <div class="bar">
                        <div class="bar-label">${severity.charAt(0).toUpperCase() + severity.slice(1)}</div>
                        <div class="bar-visual">
                            <div class="bar-fill ${severity}" style="width: ${width}%"></div>
                        </div>
                        <div class="bar-count">${count}</div>
                    </div>
                  `;
                }).join('')}
            </div>
        </div>

        ${this.results.findings.length > 0 ? `
        <div class="section">
            <div class="section-header">🔍 Security Findings</div>
            <div class="section-content">
                <div class="findings-grid">
                    ${this.results.findings.slice(0, 20).map(finding => `
                        <div class="finding ${finding.severity}">
                            <div class="finding-header">
                                <div class="finding-title">${finding.title}</div>
                                <span class="severity-badge ${finding.severity}">${finding.severity}</span>
                            </div>
                            <div class="finding-description">${finding.description}</div>
                            ${finding.recommendation ? `<div style="margin-top: 10px;"><strong>Recommendation:</strong> ${finding.recommendation}</div>` : ''}
                            <div class="finding-meta">
                                <strong>Source:</strong> ${finding.source} |
                                <strong>Type:</strong> ${finding.type}
                                ${finding.file ? ` | <strong>File:</strong> ${finding.file}` : ''}
                                ${finding.package ? ` | <strong>Package:</strong> ${finding.package}` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${this.results.findings.length > 20 ? `<p style="margin-top: 20px; text-align: center; color: #666;">Showing top 20 findings. See JSON report for complete list.</p>` : ''}
            </div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-header">📋 Recommendations</div>
            <div class="section-content">
                <div class="recommendations">
                    ${this.results.recommendations.map(rec => `
                        <div class="recommendation ${rec.priority}">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <strong>${rec.title}</strong>
                                <span class="severity-badge ${rec.priority}">${rec.priority} priority</span>
                            </div>
                            <p style="margin-bottom: 10px;">${rec.description}</p>
                            <div><strong>Action:</strong> ${rec.action}</div>
                            <div><strong>Impact:</strong> ${rec.impact}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="footer">
            <p>This report was automatically generated by the aclue security scanning pipeline.</p>
            <p>For technical details and raw data, refer to the JSON report.</p>
        </div>
    </div>
</body>
</html>`;

    return template;
  }

  /**
   * Generate the final report
   */
  async generateReport() {
    Logger.info(`Generating ${this.format.toUpperCase()} security report...`);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFileName = `frontend-security-report-${timestamp}`;

    if (this.format === 'html' || this.format === 'both') {
      const htmlContent = this.generateHtmlReport();
      const htmlPath = path.join(this.outputDir, `${baseFileName}.html`);
      fs.writeFileSync(htmlPath, htmlContent);
      Logger.success(`HTML report generated: ${htmlPath}`);
    }

    if (this.format === 'json' || this.format === 'both') {
      const jsonPath = path.join(this.outputDir, `${baseFileName}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));
      Logger.success(`JSON report generated: ${jsonPath}`);
    }

    // Generate summary metrics
    this.generateMetrics();

    return {
      summary: this.results.summary,
      totalFindings: this.results.findings.length,
      riskLevel: this.results.summary.riskLevel,
      riskScore: this.results.summary.riskScore
    };
  }

  /**
   * Generate security metrics
   */
  generateMetrics() {
    const metrics = {
      securityScore: Math.max(0, 100 - this.results.summary.riskScore),
      coverageScore: this.calculateCoverageScore(),
      trendsData: this.generateTrendsData(),
      complianceScore: this.calculateComplianceScore()
    };

    this.results.metrics = metrics;

    // Save metrics separately for dashboard consumption
    const metricsPath = path.join(this.outputDir, 'security-metrics.json');
    fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
  }

  /**
   * Calculate security coverage score
   */
  calculateCoverageScore() {
    const sources = Object.keys(CONFIG.reportSources);
    const activeSources = Object.keys(this.results.summary.bySource);
    return Math.round((activeSources.length / sources.length) * 100);
  }

  /**
   * Generate trends data (placeholder for historical comparison)
   */
  generateTrendsData() {
    return {
      timestamp: new Date().toISOString(),
      totalFindings: this.results.summary.totalFindings,
      riskScore: this.results.summary.riskScore,
      criticalCount: this.results.summary.bySeverity.critical,
      highCount: this.results.summary.bySeverity.high
    };
  }

  /**
   * Calculate compliance score based on security standards
   */
  calculateComplianceScore() {
    let score = 100;

    // Deduct points for critical and high findings
    score -= this.results.summary.bySeverity.critical * 20;
    score -= this.results.summary.bySeverity.high * 5;
    score -= this.results.summary.bySeverity.medium * 1;

    return Math.max(0, score);
  }

  /**
   * Run the complete report generation process
   */
  async run() {
    try {
      await this.initialize();
      await this.collectResults();
      await this.analyzeFindings();
      const result = await this.generateReport();

      Logger.success('Security report generation completed successfully!');
      Logger.info(`Total findings: ${result.totalFindings}`);
      Logger.info(`Risk level: ${result.riskLevel}`);
      Logger.info(`Risk score: ${result.riskScore}/100`);

      return result;

    } catch (error) {
      Logger.error(`Report generation failed: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Parse command line arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {};

  for (const arg of args) {
    if (arg.startsWith('--format=')) {
      options.format = arg.split('=')[1];
    } else if (arg.startsWith('--output=')) {
      options.output = arg.split('=')[1];
    } else if (arg === '--help') {
      console.log(`
aclue Frontend Security Report Generator

Usage: node scripts/security-report-generator.js [OPTIONS]

Options:
  --format=FORMAT    Output format: html, json, both (default: html)
  --output=PATH      Output directory (default: ../security-reports)
  --help             Show this help message

Examples:
  node scripts/security-report-generator.js --format=html
  node scripts/security-report-generator.js --format=both --output=/tmp/reports
`);
      process.exit(0);
    }
  }

  return options;
}

/**
 * Main execution
 */
async function main() {
  try {
    const options = parseArguments();
    const generator = new SecurityReportGenerator(options);
    const result = await generator.run();

    // Exit with appropriate code based on risk level
    if (result.riskLevel === 'critical') {
      process.exit(1);
    } else if (result.riskLevel === 'high') {
      process.exit(2);
    } else {
      process.exit(0);
    }

  } catch (error) {
    Logger.error(`Security report generation failed: ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
    process.exit(3);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { SecurityReportGenerator, CONFIG };
