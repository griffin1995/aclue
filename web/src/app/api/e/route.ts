import { NextRequest, NextResponse } from 'next/server';

const POSTHOG_HOST = 'https://eu.i.posthog.com';

export async function POST(request: NextRequest) {
  return handlePostHogEvents(request, 'POST');
}

export async function GET(request: NextRequest) {
  return handlePostHogEvents(request, 'GET');
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

async function handlePostHogEvents(request: NextRequest, method: string) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // Construct PostHog event endpoint URL
    const url = new URL(`${POSTHOG_HOST}/e/`);
    
    // Add query parameters from the request URL
    const requestUrl = new URL(request.url);
    requestUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    console.log('[PostHog Events Proxy]', method, url.toString());

    // Prepare headers for PostHog request
    const headers: Record<string, string> = {
      'User-Agent': request.headers.get('user-agent') || 'aclue-Analytics/1.0',
    };

    // Forward referer header if present
    const refererHeader = request.headers.get('referer');
    if (refererHeader) {
      headers.Referer = refererHeader;
    }

    // Forward request to PostHog
    const response = await fetch(url.toString(), {
      method,
      headers,
    });

    // Handle different response types
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, {
        status: response.status,
        headers: corsHeaders,
      });
    } else {
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': contentType || 'text/plain',
        },
      });
    }

  } catch (error) {
    console.error('[PostHog Events Proxy] Error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        error: 'PostHog events proxy failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, {
        status: 500,
        headers: corsHeaders,
      });
    }
    
    return NextResponse.json({ error: 'Event tracking temporarily unavailable' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}