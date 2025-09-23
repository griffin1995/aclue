/**
 * aclue Global Test Teardown
 * 
 * Comprehensive global teardown for Playwright E2E testing.
 * Handles cleanup, report generation, and test artifact organization.
 * 
 * Features:
 * - Test results compilation
 * - Performance metrics aggregation
 * - Cleanup of temporary files
 * - Test summary generation
 */

import { FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting aclue E2E Test Suite Global Teardown');

  const testResultsDir = path.join(__dirname, '..', 'test-results');
  const performanceDir = path.join(testResultsDir, 'performance');
  const summaryFile = path.join(testResultsDir, 'test-summary.json');

  try {
    // Collect test results
    console.log('📊 Collecting test results...');
    
    const resultsFile = path.join(testResultsDir, 'results.json');
    let testResults = null;
    
    if (fs.existsSync(resultsFile)) {
      const resultsContent = fs.readFileSync(resultsFile, 'utf-8');
      testResults = JSON.parse(resultsContent);
    }

    // Generate test summary
    const summary = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'test',
      baseURL: config.projects[0].use.baseURL || 'http://localhost:3000',
      testResults: testResults ? {
        totalTests: testResults.suites?.reduce((total: number, suite: any) => 
          total + (suite.specs?.length || 0), 0) || 0,
        passed: testResults.suites?.reduce((total: number, suite: any) =>
          total + (suite.specs?.filter((spec: any) => spec.ok).length || 0), 0) || 0,
        failed: testResults.suites?.reduce((total: number, suite: any) =>
          total + (suite.specs?.filter((spec: any) => !spec.ok).length || 0), 0) || 0,
        duration: testResults.stats?.duration || 0
      } : null,
      artifacts: {
        screenshots: fs.existsSync(path.join(testResultsDir, 'screenshots')),
        traces: fs.existsSync(path.join(testResultsDir, 'traces')),
        performance: fs.existsSync(performanceDir)
      }
    };

    // Save test summary
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log('✅ Test summary generated');

    // Clean up temporary auth files
    const authFile = path.join(__dirname, 'auth-state.json');
    if (fs.existsSync(authFile)) {
      fs.unlinkSync(authFile);
      console.log('🗑️ Cleaned up authentication state file');
    }

    // Performance metrics summary
    if (fs.existsSync(performanceDir)) {
      const performanceFiles = fs.readdirSync(performanceDir)
        .filter(file => file.endsWith('.json') && file !== 'baseline.json');
      
      if (performanceFiles.length > 0) {
        console.log(`📈 Collected ${performanceFiles.length} performance measurement(s)`);
      }
    }

    console.log('🎯 Test Results Summary:');
    if (summary.testResults) {
      console.log(`   Total Tests: ${summary.testResults.totalTests}`);
      console.log(`   Passed: ${summary.testResults.passed}`);
      console.log(`   Failed: ${summary.testResults.failed}`);
      console.log(`   Duration: ${Math.round(summary.testResults.duration / 1000)}s`);
    }

  } catch (error) {
    console.error('❌ Global teardown encountered an error:', error);
  }

  console.log('✨ Global teardown completed');
}

export default globalTeardown;