#!/usr/bin/env node
// @ts-nocheck

/**
 * Test script to debug server-side fetch issues
 * This simulates the exact same environment as the Next.js server action
 */

async function testServerFetch() {
  console.log('🧪 Testing server-side fetch to backend...');

  const BACKEND_URL = 'https://aclue-backend-production.up.railway.app';
  const endpoint = '/api/v1/newsletter/signup';
  const fullUrl = `${BACKEND_URL}${endpoint}`;

  const payload = {
    email: 'server-test@example.com',
    source: 'server_test',
    user_agent: 'Node.js Test Script',
    marketing_consent: true,
  };

  console.log('📡 Calling:', fullUrl);
  console.log('📋 Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'aclue-Web-Server/1.0',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    console.log('✅ Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('📦 Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('🎉 Server-side fetch successful!');
    } else {
      console.log('❌ Server-side fetch failed with status:', response.status);
    }

  } catch (error) {
    console.error('💥 Server-side fetch error:', error.name, error.message);

    if (error.name === 'AbortError') {
      console.error('⏰ Request timed out');
    } else if (error.message?.includes('fetch')) {
      console.error('🌐 Network connection failed');
    }

    console.error('🔍 Full error:', error);
  }
}

// Run the test
testServerFetch().catch(console.error);