import { NextRequest, NextResponse } from 'next/server';

const POSTHOG_HOST = 'https://eu.i.posthog.com';

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handlePostHogArray(request, 'POST', params.path);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handlePostHogArray(request, 'GET', params.path);
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

async function handlePostHogArray(request: NextRequest, method: string, pathArray: string[]) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const fullPath = pathArray.join('/');
    
    // Construct PostHog array endpoint URL
    const posthogUrl = `${POSTHOG_HOST}/array/${fullPath}`;
    
    // Add query parameters from the request URL
    const url = new URL(posthogUrl);
    const requestUrl = new URL(request.url);
    
    requestUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    console.log('[PostHog Array Proxy]', method, url.toString());

    // Prepare request body for POST requests
    let body: string | undefined;
    if (method === 'POST') {
      try {
        const requestBody = await request.json();
        body = JSON.stringify(requestBody);
      } catch (error) {
        console.warn('[PostHog Array Proxy] Failed to parse request body:', error);
      }
    }

    // Forward request to PostHog
    const response = await fetch(url.toString(), {
      method,
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'aclue-Analytics/1.0',
        ...(method === 'POST' && { 'Content-Type': 'application/json' }),
      },
      ...(body && { body }),
    });

    // Forward response
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/javascript') || contentType?.includes('text/javascript')) {
      const text = await response.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/javascript',
        },
      });
    } else if (contentType?.includes('application/json')) {
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
    console.error('[PostHog Array Proxy] Error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        error: 'PostHog array proxy failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        path: pathArray,
      }, {
        status: 500,
        headers: corsHeaders,
      });
    }
    
    return NextResponse.json({ error: 'Analytics configuration unavailable' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}