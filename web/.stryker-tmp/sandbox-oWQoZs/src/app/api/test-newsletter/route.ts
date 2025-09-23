// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { NextRequest, NextResponse } from 'next/server';

/**
 * Test API route to debug newsletter connectivity
 * This will help us isolate if the issue is with server actions specifically
 * or with the entire Next.js server environment
 */

export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("2526")) {
    {}
  } else {
    stryCov_9fa48("2526");
    console.log(stryMutAct_9fa48("2527") ? "" : (stryCov_9fa48("2527"), '🧪 API Route: Testing newsletter connectivity...'));
    try {
      if (stryMutAct_9fa48("2528")) {
        {}
      } else {
        stryCov_9fa48("2528");
        const BACKEND_URL = stryMutAct_9fa48("2529") ? "" : (stryCov_9fa48("2529"), 'https://aclue-backend-production.up.railway.app');
        const endpoint = stryMutAct_9fa48("2530") ? "" : (stryCov_9fa48("2530"), '/api/v1/newsletter/signup');
        const fullUrl = stryMutAct_9fa48("2531") ? `` : (stryCov_9fa48("2531"), `${BACKEND_URL}${endpoint}`);
        const payload = stryMutAct_9fa48("2532") ? {} : (stryCov_9fa48("2532"), {
          email: stryMutAct_9fa48("2533") ? "" : (stryCov_9fa48("2533"), 'api-route-test@example.com'),
          source: stryMutAct_9fa48("2534") ? "" : (stryCov_9fa48("2534"), 'api_route_test'),
          user_agent: stryMutAct_9fa48("2535") ? "" : (stryCov_9fa48("2535"), 'Next.js API Route'),
          marketing_consent: stryMutAct_9fa48("2536") ? false : (stryCov_9fa48("2536"), true)
        });
        console.log(stryMutAct_9fa48("2537") ? "" : (stryCov_9fa48("2537"), '📡 API Route calling:'), fullUrl);
        console.log(stryMutAct_9fa48("2538") ? "" : (stryCov_9fa48("2538"), '📋 API Route payload:'), payload);
        const response = await fetch(fullUrl, stryMutAct_9fa48("2539") ? {} : (stryCov_9fa48("2539"), {
          method: stryMutAct_9fa48("2540") ? "" : (stryCov_9fa48("2540"), 'POST'),
          headers: stryMutAct_9fa48("2541") ? {} : (stryCov_9fa48("2541"), {
            'Content-Type': stryMutAct_9fa48("2542") ? "" : (stryCov_9fa48("2542"), 'application/json'),
            'Accept': stryMutAct_9fa48("2543") ? "" : (stryCov_9fa48("2543"), 'application/json'),
            'User-Agent': stryMutAct_9fa48("2544") ? "" : (stryCov_9fa48("2544"), 'aclue-Web-Server/1.0')
          }),
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000)
        }));
        console.log(stryMutAct_9fa48("2545") ? "" : (stryCov_9fa48("2545"), '✅ API Route response status:'), response.status);
        const data = await response.json();
        console.log(stryMutAct_9fa48("2546") ? "" : (stryCov_9fa48("2546"), '📦 API Route response data:'), data);
        return NextResponse.json(stryMutAct_9fa48("2547") ? {} : (stryCov_9fa48("2547"), {
          success: stryMutAct_9fa48("2548") ? false : (stryCov_9fa48("2548"), true),
          backendResponse: data,
          status: response.status,
          message: stryMutAct_9fa48("2549") ? "" : (stryCov_9fa48("2549"), 'API route connectivity test successful')
        }));
      }
    } catch (error: any) {
      if (stryMutAct_9fa48("2550")) {
        {}
      } else {
        stryCov_9fa48("2550");
        console.error(stryMutAct_9fa48("2551") ? "" : (stryCov_9fa48("2551"), '💥 API Route error:'), error);
        return NextResponse.json(stryMutAct_9fa48("2552") ? {} : (stryCov_9fa48("2552"), {
          success: stryMutAct_9fa48("2553") ? true : (stryCov_9fa48("2553"), false),
          error: error.message,
          name: error.name,
          message: stryMutAct_9fa48("2554") ? "" : (stryCov_9fa48("2554"), 'API route connectivity test failed')
        }), stryMutAct_9fa48("2555") ? {} : (stryCov_9fa48("2555"), {
          status: 500
        }));
      }
    }
  }
}