import { NextRequest, NextResponse } from 'next/server';

const POSTHOG_HOST = 'https://eu.i.posthog.com';

export async function POST(request: NextRequest) {
  return handlePostHogProxy(request, 'POST');
}

export async function GET(request: NextRequest) {
  return handlePostHogProxy(request, 'GET');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
}

async function handlePostHogProxy(request: NextRequest, method: string) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };

  try {
    // Determine the PostHog endpoint based on the request
    let posthogEndpoint: string;
    const url = request.url;

    // Handle different PostHog endpoints
    if (url.includes('decide')) {
      posthogEndpoint = `${POSTHOG_HOST}/decide/`;
      method = 'POST';
    } else if (url.includes('engage')) {
      posthogEndpoint = `${POSTHOG_HOST}/engage/`;
      method = 'POST';
    } else if (url.includes('capture')) {
      posthogEndpoint = `${POSTHOG_HOST}/capture/`;
      method = 'POST';
    } else if (url.includes('batch')) {
      posthogEndpoint = `${POSTHOG_HOST}/batch/`;
      method = 'POST';
    } else {
      // Default to batch endpoint for event capture
      posthogEndpoint = `${POSTHOG_HOST}/batch/`;
      method = 'POST';
    }

    // Prepare headers for PostHog request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': request.headers.get('user-agent') || 'aclue-Analytics/1.0',
    };

    // Forward authorisation header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    // Prepare request body
    let body: string | undefined;
    if (method === 'POST') {
      try {
        const requestBody = await request.json();
        
        // Add API key if not present
        if (!requestBody.api_key && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
          requestBody.api_key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        }

        body = JSON.stringify(requestBody);
      } catch (error) {
        console.warn('[PostHog Proxy] Failed to parse request body:', error);
      }
    }

    console.log(`[PostHog Proxy] ${method} ${posthogEndpoint}`, {
      hasBody: !!body,
      bodySize: body?.length || 0,
      hasPageview: body?.includes('$pageview') || false,
    });

    // Make request to PostHog
    const response = await fetch(posthogEndpoint, {
      method,
      headers,
      body,
    });

    // Get response data
    const contentType = response.headers.get('content-type');
    let responseData: string | object;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Log response for debugging
    console.log(`[PostHog Proxy] Response ${response.status}`, {
      status: response.status,
      contentType,
      dataSize: typeof responseData === 'string' ? responseData.length : JSON.stringify(responseData).length,
    });

    // Forward the response
    if (typeof responseData === 'string') {
      return new NextResponse(responseData, {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': contentType || 'text/plain' },
      });
    } else {
      return NextResponse.json(responseData, {
        status: response.status,
        headers: corsHeaders,
      });
    }

  } catch (error) {
    console.error('[PostHog Proxy] Error:', error);
    
    // Return detailed error in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        error: 'PostHog proxy request failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        endpoint: request.url,
        method: request.method,
      }, { 
        status: 500,
        headers: corsHeaders,
      });
    }
    
    return NextResponse.json({ error: 'Analytics service temporarily unavailable' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}