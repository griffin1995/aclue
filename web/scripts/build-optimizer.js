/**
 * Build Optimizer Script for Aclue Platform
 *
 * Provides comprehensive build-time optimizations for the Next.js application.
 * Implements bundle analysis, asset optimization, and performance monitoring.
 *
 * Key Features:
 *   - Bundle size analysis and reporting
 *   - Asset compression and optimization
 *   - Build performance metrics
 *   - Dependency analysis
 *   - Build artifact validation
 *
 * Usage:
 *   npm run build:optimized
 *   node scripts/build-optimizer.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { gzip } = require('zlib');
const { promisify } = require('util');

// ==============================================================================
// CONFIGURATION
// ==============================================================================

const OPTIMIZE_CONFIG = {
  // Build optimization settings
  enableBundleAnalysis: true,
  enableAssetOptimization: true,
  enablePerformanceReporting: true,
  enableDependencyAnalysis: true,

  // Size thresholds (in KB)
  thresholds: {
    bundleSize: 1024,        // 1MB bundle size warning
    chunkSize: 500,          // 500KB chunk size warning
    assetSize: 200,          // 200KB asset size warning
    totalSize: 5120,         // 5MB total size warning
  },

  // Paths
  buildDir: '.next',
  outputDir: 'build-reports',
  staticDir: 'static',
};

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================

/**
 * Execute shell command and return output.
 */
function executeCommand(command, options = {}) {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      ...options,
    }).trim();
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return null;
  }
}

/**
 * Get file size in bytes.
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Get gzipped file size.
 */
async function getGzipSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const gzipAsync = promisify(gzip);
    const compressed = await gzipAsync(content);
    return compressed.length;
  } catch (error) {
    return 0;
  }
}

/**
 * Format bytes to human readable format.
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Create directory if it doesn't exist.
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Get all files recursively from directory.
 */
function getAllFiles(dirPath, extension = null) {
  const files = [];

  function traverseDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDir(fullPath);
      } else if (!extension || path.extname(item) === extension) {
        files.push(fullPath);
      }
    }
  }

  if (fs.existsSync(dirPath)) {
    traverseDir(dirPath);
  }

  return files;
}

// ==============================================================================
// ANALYSIS FUNCTIONS
// ==============================================================================

/**
 * Analyze bundle sizes and performance.
 */
async function analyzeBundleSizes() {
  console.log('📊 Analyzing bundle sizes...');

  const buildPath = path.join(process.cwd(), OPTIMIZE_CONFIG.buildDir);
  const staticPath = path.join(buildPath, 'static');

  if (!fs.existsSync(staticPath)) {
    console.warn('Static build directory not found. Run build first.');
    return null;
  }

  // Get all JavaScript and CSS files
  const jsFiles = getAllFiles(staticPath, '.js');
  const cssFiles = getAllFiles(staticPath, '.css');
  const allFiles = [...jsFiles, ...cssFiles];

  const analysis = {
    files: [],
    totalSize: 0,
    totalGzipSize: 0,
    fileCount: allFiles.length,
    largestFiles: [],
    warnings: [],
  };

  // Analyze each file
  for (const filePath of allFiles) {
    const size = getFileSize(filePath);
    const gzipSize = await getGzipSize(filePath);
    const relativePath = path.relative(staticPath, filePath);

    const fileInfo = {
      path: relativePath,
      size,
      gzipSize,
      sizeFormatted: formatBytes(size),
      gzipSizeFormatted: formatBytes(gzipSize),
      type: path.extname(filePath).substring(1),
    };

    analysis.files.push(fileInfo);
    analysis.totalSize += size;
    analysis.totalGzipSize += gzipSize;

    // Check size thresholds
    if (size > OPTIMIZE_CONFIG.thresholds.chunkSize * 1024) {
      analysis.warnings.push({
        type: 'large-chunk',
        file: relativePath,
        size: formatBytes(size),
        threshold: formatBytes(OPTIMIZE_CONFIG.thresholds.chunkSize * 1024),
      });
    }
  }

  // Sort files by size (largest first)
  analysis.files.sort((a, b) => b.size - a.size);
  analysis.largestFiles = analysis.files.slice(0, 10);

  // Check total size threshold
  if (analysis.totalSize > OPTIMIZE_CONFIG.thresholds.totalSize * 1024) {
    analysis.warnings.push({
      type: 'large-total',
      size: formatBytes(analysis.totalSize),
      threshold: formatBytes(OPTIMIZE_CONFIG.thresholds.totalSize * 1024),
    });
  }

  analysis.totalSizeFormatted = formatBytes(analysis.totalSize);
  analysis.totalGzipSizeFormatted = formatBytes(analysis.totalGzipSize);

  return analysis;
}

/**
 * Analyze package dependencies.
 */
function analyzeDependencies() {
  console.log('📦 Analyzing dependencies...');

  const packagePath = path.join(process.cwd(), 'package.json');
  const lockfilePath = path.join(process.cwd(), 'package-lock.json');

  if (!fs.existsSync(packagePath)) {
    console.warn('package.json not found');
    return null;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const analysis = {
    totalDependencies: Object.keys(dependencies).length,
    prodDependencies: Object.keys(packageJson.dependencies || {}).length,
    devDependencies: Object.keys(packageJson.devDependencies || {}).length,
    outdatedPackages: [],
    heavyPackages: [],
    duplicatePackages: [],
  };

  // Check for outdated packages
  try {
    const outdatedOutput = executeCommand('npm outdated --json');
    if (outdatedOutput) {
      const outdated = JSON.parse(outdatedOutput);
      analysis.outdatedPackages = Object.keys(outdated);
    }
  } catch (error) {
    console.warn('Could not check for outdated packages');
  }

  // Analyze bundle impact using require.resolve (basic analysis)
  const heavyPackages = [
    'react', 'react-dom', 'next', 'framer-motion',
    '@headlessui/react', 'lucide-react'
  ];

  analysis.heavyPackages = heavyPackages.filter(pkg =>
    dependencies[pkg]
  ).map(pkg => ({
    name: pkg,
    version: dependencies[pkg],
  }));

  return analysis;
}

/**
 * Generate performance report.
 */
function generatePerformanceReport(bundleAnalysis, dependencyAnalysis) {
  console.log('📈 Generating performance report...');

  const report = {
    timestamp: new Date().toISOString(),
    buildTime: process.env.BUILD_TIME || 'Unknown',
    nodeVersion: process.version,
    nextVersion: dependencyAnalysis ? dependencyAnalysis.heavyPackages.find(p => p.name === 'next')?.version : 'Unknown',
    bundle: bundleAnalysis,
    dependencies: dependencyAnalysis,
    recommendations: [],
    score: 0,
  };

  // Generate recommendations
  if (bundleAnalysis) {
    if (bundleAnalysis.warnings.length > 0) {
      report.recommendations.push({
        type: 'bundle-optimization',
        message: `${bundleAnalysis.warnings.length} bundle size warnings found`,
        suggestions: [
          'Consider code splitting for large chunks',
          'Use dynamic imports for non-critical components',
          'Enable tree shaking for unused code elimination',
          'Optimize images and assets',
        ],
      });
    }

    // Calculate performance score (0-100)
    let score = 100;

    // Penalty for large total size
    if (bundleAnalysis.totalSize > 2 * 1024 * 1024) { // > 2MB
      score -= 20;
    }

    // Penalty for large chunks
    const largeChunks = bundleAnalysis.files.filter(f => f.size > 500 * 1024).length;
    score -= largeChunks * 10;

    // Penalty for many files
    if (bundleAnalysis.fileCount > 50) {
      score -= 10;
    }

    report.score = Math.max(0, Math.min(100, score));
  }

  if (dependencyAnalysis) {
    if (dependencyAnalysis.outdatedPackages.length > 0) {
      report.recommendations.push({
        type: 'dependency-updates',
        message: `${dependencyAnalysis.outdatedPackages.length} outdated packages found`,
        suggestions: [
          'Update outdated packages for security and performance improvements',
          'Review breaking changes before updating',
          'Consider removing unused dependencies',
        ],
      });
    }
  }

  return report;
}

/**
 * Save report to file.
 */
function saveReport(report) {
  const outputDir = path.join(process.cwd(), OPTIMIZE_CONFIG.outputDir);
  ensureDir(outputDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(outputDir, `build-report-${timestamp}.json`);

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Also save as latest report
  const latestPath = path.join(outputDir, 'latest-build-report.json');
  fs.writeFileSync(latestPath, JSON.stringify(report, null, 2));

  console.log(`📄 Report saved to: ${reportPath}`);
  console.log(`📄 Latest report: ${latestPath}`);

  return reportPath;
}

/**
 * Display summary in console.
 */
function displaySummary(report) {
  console.log('\\n' + '='.repeat(60));
  console.log('🚀 BUILD OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));

  if (report.bundle) {
    console.log(`📦 Bundle Size: ${report.bundle.totalSizeFormatted} (${report.bundle.totalGzipSizeFormatted} gzipped)`);
    console.log(`📁 File Count: ${report.bundle.fileCount}`);
    console.log(`⚠️  Warnings: ${report.bundle.warnings.length}`);
  }

  if (report.dependencies) {
    console.log(`📚 Dependencies: ${report.dependencies.totalDependencies} total (${report.dependencies.prodDependencies} prod, ${report.dependencies.devDependencies} dev)`);
    console.log(`🔄 Outdated: ${report.dependencies.outdatedPackages.length}`);
  }

  console.log(`🎯 Performance Score: ${report.score}/100`);

  if (report.recommendations.length > 0) {
    console.log('\\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.message}`);
      rec.suggestions.forEach(suggestion => {
        console.log(`   • ${suggestion}`);
      });
    });
  }

  if (report.bundle && report.bundle.warnings.length > 0) {
    console.log('\\n⚠️  WARNINGS:');
    report.bundle.warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning.type}: ${warning.file || ''} (${warning.size || warning.threshold})`);
    });
  }

  console.log('\\n' + '='.repeat(60));
}

// ==============================================================================
// MAIN EXECUTION
// ==============================================================================

/**
 * Main build optimization function.
 */
async function optimizeBuild() {
  console.log('🔧 Starting build optimization...');
  const startTime = process.hrtime();

  let bundleAnalysis = null;
  let dependencyAnalysis = null;

  try {
    // Analyze bundle sizes
    if (OPTIMIZE_CONFIG.enableBundleAnalysis) {
      bundleAnalysis = await analyzeBundleSizes();
    }

    // Analyze dependencies
    if (OPTIMIZE_CONFIG.enableDependencyAnalysis) {
      dependencyAnalysis = analyzeDependencies();
    }

    // Generate performance report
    if (OPTIMIZE_CONFIG.enablePerformanceReporting) {
      const report = generatePerformanceReport(bundleAnalysis, dependencyAnalysis);

      // Calculate build time
      const [seconds, nanoseconds] = process.hrtime(startTime);
      report.buildTime = `${seconds}.${Math.round(nanoseconds / 1000000)}s`;

      // Save and display report
      saveReport(report);
      displaySummary(report);

      // Exit with error code if score is too low
      if (report.score < 70) {
        console.error('\\n❌ Build optimization score is below threshold (70). Consider implementing recommendations.');
        process.exit(1);
      }
    }

    console.log('\\n✅ Build optimization completed successfully!');
  } catch (error) {
    console.error('\\n❌ Build optimization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  optimizeBuild();
}

module.exports = {
  optimizeBuild,
  analyzeBundleSizes,
  analyzeDependencies,
  generatePerformanceReport,
};