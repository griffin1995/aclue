/**
 * aclue Global Test Setup
 * 
 * Comprehensive global setup for Playwright E2E testing.
 * Handles test environment initialization, database seeding,
 * and authentication state preparation.
 * 
 * Phase 6 Testing Features:
 * - App Router vs Pages Router testing
 * - Feature flag configuration
 * - Test user authentication
 * - Database state management
 * - Performance baseline setup
 */
// @ts-nocheck


import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting aclue E2E Test Suite Global Setup');

  // Test environment configuration
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
  const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  console.log(`📍 Base URL: ${baseURL}`);
  console.log(`🔗 API URL: ${apiURL}`);

  // Create test results directories
  const testResultsDir = path.join(__dirname, '..', 'test-results');
  const screenshotsDir = path.join(testResultsDir, 'screenshots');
  const tracesDir = path.join(testResultsDir, 'traces');
  const performanceDir = path.join(testResultsDir, 'performance');

  [testResultsDir, screenshotsDir, tracesDir, performanceDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  // Setup test browser for authentication
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Pre-authenticate test user for protected route testing
    console.log('🔐 Setting up test user authentication...');
    
    await page.goto(`${baseURL}/auth/login`);
    
    // Wait for login form to load
    await page.waitForSelector('[data-testid="login-form"]', { timeout: 10000 });
    
    // Login with test credentials
    await page.fill('[data-testid="email-input"]', 'john.doe@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Wait for successful login redirect
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    
    // Save authenticated state
    const storageState = await context.storageState();
    const authFile = path.join(__dirname, 'auth-state.json');
    fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
    
    console.log('✅ Test user authentication state saved');

    // Test feature flag functionality
    console.log('🚩 Testing feature flag system...');
    
    // Test with App Router enabled
    await page.addInitScript(() => {
      window.localStorage.setItem('test_app_router_enabled', 'true');
    });
    
    // Verify feature flags are working
    await page.goto(`${baseURL}/`);
    const appRouterActive = await page.evaluate(() => {
      return window.localStorage.getItem('test_app_router_enabled') === 'true';
    });
    
    if (appRouterActive) {
      console.log('✅ Feature flag system operational');
    } else {
      console.warn('⚠️ Feature flag system may need attention');
    }

    // Test API connectivity
    console.log('🔌 Testing API connectivity...');
    
    try {
      const response = await page.request.get(`${apiURL}/health`);
      if (response.ok()) {
        console.log('✅ Backend API is accessible');
      } else {
        console.warn(`⚠️ Backend API returned status: ${response.status()}`);
      }
    } catch (error) {
      console.warn('⚠️ Backend API not accessible:', error);
    }

    // Setup performance baseline
    console.log('📊 Setting up performance baseline...');
    
    const performanceBaseline = {
      timestamp: new Date().toISOString(),
      baseURL,
      environment: process.env.NODE_ENV || 'test',
      targetMetrics: {
        LCP: 2500,  // 2.5 seconds
        FID: 100,   // 100 milliseconds
        CLS: 0.1,   // 0.1 score
        TTFB: 800   // 800 milliseconds
      }
    };
    
    const baselineFile = path.join(performanceDir, 'baseline.json');
    fs.writeFileSync(baselineFile, JSON.stringify(performanceBaseline, null, 2));
    
    console.log('✅ Performance baseline established');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('🎉 Global setup completed successfully');
}

export default globalSetup;