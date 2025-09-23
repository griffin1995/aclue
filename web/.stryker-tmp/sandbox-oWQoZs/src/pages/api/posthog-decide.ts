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
import { NextApiRequest, NextApiResponse } from 'next';
const POSTHOG_HOST = stryMutAct_9fa48("12481") ? "" : (stryCov_9fa48("12481"), 'https://eu.i.posthog.com');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (stryMutAct_9fa48("12482")) {
    {}
  } else {
    stryCov_9fa48("12482");
    // Handle CORS preflight requests
    if (stryMutAct_9fa48("12485") ? req.method !== 'OPTIONS' : stryMutAct_9fa48("12484") ? false : stryMutAct_9fa48("12483") ? true : (stryCov_9fa48("12483", "12484", "12485"), req.method === (stryMutAct_9fa48("12486") ? "" : (stryCov_9fa48("12486"), 'OPTIONS')))) {
      if (stryMutAct_9fa48("12487")) {
        {}
      } else {
        stryCov_9fa48("12487");
        res.setHeader(stryMutAct_9fa48("12488") ? "" : (stryCov_9fa48("12488"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12489") ? "" : (stryCov_9fa48("12489"), '*'));
        res.setHeader(stryMutAct_9fa48("12490") ? "" : (stryCov_9fa48("12490"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12491") ? "" : (stryCov_9fa48("12491"), 'POST, OPTIONS'));
        res.setHeader(stryMutAct_9fa48("12492") ? "" : (stryCov_9fa48("12492"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12493") ? "" : (stryCov_9fa48("12493"), 'Content-Type, Authorization'));
        res.setHeader(stryMutAct_9fa48("12494") ? "" : (stryCov_9fa48("12494"), 'Access-Control-Max-Age'), stryMutAct_9fa48("12495") ? "" : (stryCov_9fa48("12495"), '86400'));
        return res.status(200).end();
      }
    }

    // Set CORS headers
    res.setHeader(stryMutAct_9fa48("12496") ? "" : (stryCov_9fa48("12496"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12497") ? "" : (stryCov_9fa48("12497"), '*'));
    res.setHeader(stryMutAct_9fa48("12498") ? "" : (stryCov_9fa48("12498"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12499") ? "" : (stryCov_9fa48("12499"), 'POST, OPTIONS'));
    res.setHeader(stryMutAct_9fa48("12500") ? "" : (stryCov_9fa48("12500"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12501") ? "" : (stryCov_9fa48("12501"), 'Content-Type, Authorization'));

    // Only allow POST requests for decide endpoint
    if (stryMutAct_9fa48("12504") ? req.method === 'POST' : stryMutAct_9fa48("12503") ? false : stryMutAct_9fa48("12502") ? true : (stryCov_9fa48("12502", "12503", "12504"), req.method !== (stryMutAct_9fa48("12505") ? "" : (stryCov_9fa48("12505"), 'POST')))) {
      if (stryMutAct_9fa48("12506")) {
        {}
      } else {
        stryCov_9fa48("12506");
        return res.status(405).json(stryMutAct_9fa48("12507") ? {} : (stryCov_9fa48("12507"), {
          error: stryMutAct_9fa48("12508") ? "" : (stryCov_9fa48("12508"), 'Method not allowed')
        }));
      }
    }
    try {
      if (stryMutAct_9fa48("12509")) {
        {}
      } else {
        stryCov_9fa48("12509");
        const decideEndpoint = stryMutAct_9fa48("12510") ? `` : (stryCov_9fa48("12510"), `${POSTHOG_HOST}/decide/`);

        // Prepare request body
        const bodyData = (stryMutAct_9fa48("12513") ? typeof req.body !== 'string' : stryMutAct_9fa48("12512") ? false : stryMutAct_9fa48("12511") ? true : (stryCov_9fa48("12511", "12512", "12513"), typeof req.body === (stryMutAct_9fa48("12514") ? "" : (stryCov_9fa48("12514"), 'string')))) ? JSON.parse(req.body) : req.body;

        // Ensure API key is included
        if (stryMutAct_9fa48("12517") ? !bodyData.api_key || process.env.NEXT_PUBLIC_POSTHOG_KEY : stryMutAct_9fa48("12516") ? false : stryMutAct_9fa48("12515") ? true : (stryCov_9fa48("12515", "12516", "12517"), (stryMutAct_9fa48("12518") ? bodyData.api_key : (stryCov_9fa48("12518"), !bodyData.api_key)) && process.env.NEXT_PUBLIC_POSTHOG_KEY)) {
          if (stryMutAct_9fa48("12519")) {
            {}
          } else {
            stryCov_9fa48("12519");
            bodyData.api_key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
          }
        }
        console.log(stryMutAct_9fa48("12520") ? "" : (stryCov_9fa48("12520"), '[PostHog Decide Proxy] Processing decide request'), stryMutAct_9fa48("12521") ? {} : (stryCov_9fa48("12521"), {
          hasDistinctId: stryMutAct_9fa48("12522") ? !bodyData.distinct_id : (stryCov_9fa48("12522"), !(stryMutAct_9fa48("12523") ? bodyData.distinct_id : (stryCov_9fa48("12523"), !bodyData.distinct_id))),
          hasToken: stryMutAct_9fa48("12524") ? !bodyData.token : (stryCov_9fa48("12524"), !(stryMutAct_9fa48("12525") ? bodyData.token : (stryCov_9fa48("12525"), !bodyData.token)))
        }));

        // Forward request to PostHog
        const response = await fetch(decideEndpoint, stryMutAct_9fa48("12526") ? {} : (stryCov_9fa48("12526"), {
          method: stryMutAct_9fa48("12527") ? "" : (stryCov_9fa48("12527"), 'POST'),
          headers: stryMutAct_9fa48("12528") ? {} : (stryCov_9fa48("12528"), {
            'Content-Type': stryMutAct_9fa48("12529") ? "" : (stryCov_9fa48("12529"), 'application/json'),
            'User-Agent': stryMutAct_9fa48("12532") ? req.headers['user-agent'] && 'aclue-Analytics/1.0' : stryMutAct_9fa48("12531") ? false : stryMutAct_9fa48("12530") ? true : (stryCov_9fa48("12530", "12531", "12532"), req.headers[stryMutAct_9fa48("12533") ? "" : (stryCov_9fa48("12533"), 'user-agent')] || (stryMutAct_9fa48("12534") ? "" : (stryCov_9fa48("12534"), 'aclue-Analytics/1.0')))
          }),
          body: JSON.stringify(bodyData)
        }));
        const responseData = await response.json();
        console.log(stryMutAct_9fa48("12535") ? "" : (stryCov_9fa48("12535"), '[PostHog Decide Proxy] Response received'), stryMutAct_9fa48("12536") ? {} : (stryCov_9fa48("12536"), {
          status: response.status,
          hasFeatureFlags: stryMutAct_9fa48("12537") ? !responseData.featureFlags : (stryCov_9fa48("12537"), !(stryMutAct_9fa48("12538") ? responseData.featureFlags : (stryCov_9fa48("12538"), !responseData.featureFlags))),
          hasToolbarParams: stryMutAct_9fa48("12539") ? !responseData.toolbarParams : (stryCov_9fa48("12539"), !(stryMutAct_9fa48("12540") ? responseData.toolbarParams : (stryCov_9fa48("12540"), !responseData.toolbarParams)))
        }));
        return res.status(response.status).json(responseData);
      }
    } catch (error) {
      if (stryMutAct_9fa48("12541")) {
        {}
      } else {
        stryCov_9fa48("12541");
        console.error(stryMutAct_9fa48("12542") ? "" : (stryCov_9fa48("12542"), '[PostHog Decide Proxy] Error:'), error);
        if (stryMutAct_9fa48("12545") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("12544") ? false : stryMutAct_9fa48("12543") ? true : (stryCov_9fa48("12543", "12544", "12545"), process.env.NODE_ENV === (stryMutAct_9fa48("12546") ? "" : (stryCov_9fa48("12546"), 'development')))) {
          if (stryMutAct_9fa48("12547")) {
            {}
          } else {
            stryCov_9fa48("12547");
            return res.status(500).json(stryMutAct_9fa48("12548") ? {} : (stryCov_9fa48("12548"), {
              error: stryMutAct_9fa48("12549") ? "" : (stryCov_9fa48("12549"), 'PostHog decide proxy failed'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("12550") ? "" : (stryCov_9fa48("12550"), 'Unknown error')
            }));
          }
        }
        return res.status(500).json(stryMutAct_9fa48("12551") ? {} : (stryCov_9fa48("12551"), {
          error: stryMutAct_9fa48("12552") ? "" : (stryCov_9fa48("12552"), 'Feature flags service temporarily unavailable')
        }));
      }
    }
  }
}
export const config = stryMutAct_9fa48("12553") ? {} : (stryCov_9fa48("12553"), {
  api: stryMutAct_9fa48("12554") ? {} : (stryCov_9fa48("12554"), {
    bodyParser: stryMutAct_9fa48("12555") ? {} : (stryCov_9fa48("12555"), {
      sizeLimit: stryMutAct_9fa48("12556") ? "" : (stryCov_9fa48("12556"), '1mb')
    })
  })
});