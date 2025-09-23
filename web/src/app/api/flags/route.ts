import { NextRequest, NextResponse } from 'next/server';

const POSTHOG_HOST = 'https://eu.i.posthog.com';

export async function POST(request: NextRequest) {
  return handlePostHogFlags(request, 'POST');
}

export async function GET(request: NextRequest) {
  return handlePostHogFlags(request, 'GET');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

async function handlePostHogFlags(request: NextRequest, method: string) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // Construct PostHog flags endpoint URL
    const url = new URL(`${POSTHOG_HOST}/flags/`);
    
    // Add query parameters from the request URL
    const requestUrl = new URL(request.url);
    requestUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    console.log('[PostHog Flags Proxy]', method, url.toString());

    // Prepare request body for POST requests
    let body: string | undefined;
    if (method === 'POST') {
      try {
        const bodyData = await request.json();
        
        // Ensure API key is included
        if (!bodyData.api_key && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
          bodyData.api_key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        }

        body = JSON.stringify(bodyData);
      } catch (error) {
        console.warn('[PostHog Flags Proxy] Failed to parse request body:', error);
      }
    }

    // Forward request to PostHog
    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'aclue-Analytics/1.0',
      },
      ...(body && { body }),
    });

    // Handle response based on content type
    const contentType = response.headers.get('content-type');
    let responseData: any;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      // Try to parse as JSON, fallback to text
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { status: 'error', message: text };
      }
    }

    console.log('[PostHog Flags Proxy] Response', {
      status: response.status,
      contentType,
      hasFeatureFlags: !!responseData?.featureFlags,
      flagCount: responseData?.featureFlags ? Object.keys(responseData.featureFlags).length : 0,
    });

    return NextResponse.json(responseData, {
      status: response.status,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('[PostHog Flags Proxy] Error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        error: 'PostHog flags proxy failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, {
        status: 500,
        headers: corsHeaders,
      });
    }
    
    return NextResponse.json({ error: 'Feature flags service temporarily unavailable' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}