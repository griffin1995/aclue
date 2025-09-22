import { NextRequest, NextResponse } from 'next/server'

/**
 * Test API route to debug newsletter connectivity
 * This will help us isolate if the issue is with server actions specifically
 * or with the entire Next.js server environment
 */

export async function POST(request: NextRequest) {
  console.log('🧪 API Route: Testing newsletter connectivity...');

  try {
    const BACKEND_URL = 'https://aclue-backend-production.up.railway.app';
    const endpoint = '/api/v1/newsletter/signup';
    const fullUrl = `${BACKEND_URL}${endpoint}`;

    const payload = {
      email: 'api-route-test@example.com',
      source: 'api_route_test',
      user_agent: 'Next.js API Route',
      marketing_consent: true,
    };

    console.log('📡 API Route calling:', fullUrl);
    console.log('📋 API Route payload:', payload);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Aclue-Web-Server/1.0',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    console.log('✅ API Route response status:', response.status);

    const data = await response.json();
    console.log('📦 API Route response data:', data);

    return NextResponse.json({
      success: true,
      backendResponse: data,
      status: response.status,
      message: 'API route connectivity test successful'
    });

  } catch (error: any) {
    console.error('💥 API Route error:', error);

    return NextResponse.json({
      success: false,
      error: error.message,
      name: error.name,
      message: 'API route connectivity test failed'
    }, { status: 500 });
  }
}