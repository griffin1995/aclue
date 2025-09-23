import { NextRequest, NextResponse } from 'next/server';

const POSTHOG_HOST = 'https://eu.i.posthog.com';

export async function POST(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const decideEndpoint = `${POSTHOG_HOST}/decide/`;
    
    // Prepare request body
    const bodyData = await request.json();
    
    // Ensure API key is included
    if (!bodyData.api_key && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      bodyData.api_key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    }

    console.log('[PostHog Decide Proxy] Processing decide request', {
      hasDistinctId: !!bodyData.distinct_id,
      hasToken: !!bodyData.token,
    });

    // Forward request to PostHog
    const response = await fetch(decideEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'aclue-Analytics/1.0',
      },
      body: JSON.stringify(bodyData),
    });

    const responseData = await response.json();

    console.log('[PostHog Decide Proxy] Response received', {
      status: response.status,
      hasFeatureFlags: !!responseData.featureFlags,
      hasToolbarParams: !!responseData.toolbarParams,
    });

    return NextResponse.json(responseData, {
      status: response.status,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('[PostHog Decide Proxy] Error:', error);
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        error: 'PostHog decide proxy failed',
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}