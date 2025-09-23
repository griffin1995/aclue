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
const POSTHOG_HOST = stryMutAct_9fa48("12557") ? "" : (stryCov_9fa48("12557"), 'https://eu.i.posthog.com');
const ALLOWED_ORIGINS = stryMutAct_9fa48("12558") ? [] : (stryCov_9fa48("12558"), [stryMutAct_9fa48("12559") ? "" : (stryCov_9fa48("12559"), 'http://localhost:3000'), stryMutAct_9fa48("12560") ? "" : (stryCov_9fa48("12560"), 'http://localhost:3001')]);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (stryMutAct_9fa48("12561")) {
    {}
  } else {
    stryCov_9fa48("12561");
    // Handle CORS preflight requests
    if (stryMutAct_9fa48("12564") ? req.method !== 'OPTIONS' : stryMutAct_9fa48("12563") ? false : stryMutAct_9fa48("12562") ? true : (stryCov_9fa48("12562", "12563", "12564"), req.method === (stryMutAct_9fa48("12565") ? "" : (stryCov_9fa48("12565"), 'OPTIONS')))) {
      if (stryMutAct_9fa48("12566")) {
        {}
      } else {
        stryCov_9fa48("12566");
        res.setHeader(stryMutAct_9fa48("12567") ? "" : (stryCov_9fa48("12567"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12568") ? "" : (stryCov_9fa48("12568"), '*'));
        res.setHeader(stryMutAct_9fa48("12569") ? "" : (stryCov_9fa48("12569"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12570") ? "" : (stryCov_9fa48("12570"), 'GET, POST, PUT, DELETE, OPTIONS'));
        res.setHeader(stryMutAct_9fa48("12571") ? "" : (stryCov_9fa48("12571"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12572") ? "" : (stryCov_9fa48("12572"), 'Content-Type, Authorization, X-Requested-With'));
        res.setHeader(stryMutAct_9fa48("12573") ? "" : (stryCov_9fa48("12573"), 'Access-Control-Max-Age'), stryMutAct_9fa48("12574") ? "" : (stryCov_9fa48("12574"), '86400'));
        return res.status(200).end();
      }
    }

    // Set CORS headers for all requests
    res.setHeader(stryMutAct_9fa48("12575") ? "" : (stryCov_9fa48("12575"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12576") ? "" : (stryCov_9fa48("12576"), '*'));
    res.setHeader(stryMutAct_9fa48("12577") ? "" : (stryCov_9fa48("12577"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12578") ? "" : (stryCov_9fa48("12578"), 'GET, POST, PUT, DELETE, OPTIONS'));
    res.setHeader(stryMutAct_9fa48("12579") ? "" : (stryCov_9fa48("12579"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12580") ? "" : (stryCov_9fa48("12580"), 'Content-Type, Authorization, X-Requested-With'));
    try {
      if (stryMutAct_9fa48("12581")) {
        {}
      } else {
        stryCov_9fa48("12581");
        // Determine the PostHog endpoint based on the request
        let posthogEndpoint: string;
        let method = stryMutAct_9fa48("12584") ? req.method && 'POST' : stryMutAct_9fa48("12583") ? false : stryMutAct_9fa48("12582") ? true : (stryCov_9fa48("12582", "12583", "12584"), req.method || (stryMutAct_9fa48("12585") ? "" : (stryCov_9fa48("12585"), 'POST')));

        // Handle different PostHog endpoints
        if (stryMutAct_9fa48("12588") ? req.url.includes('decide') : stryMutAct_9fa48("12587") ? false : stryMutAct_9fa48("12586") ? true : (stryCov_9fa48("12586", "12587", "12588"), req.url?.includes(stryMutAct_9fa48("12589") ? "" : (stryCov_9fa48("12589"), 'decide')))) {
          if (stryMutAct_9fa48("12590")) {
            {}
          } else {
            stryCov_9fa48("12590");
            posthogEndpoint = stryMutAct_9fa48("12591") ? `` : (stryCov_9fa48("12591"), `${POSTHOG_HOST}/decide/`);
            method = stryMutAct_9fa48("12592") ? "" : (stryCov_9fa48("12592"), 'POST');
          }
        } else if (stryMutAct_9fa48("12595") ? req.url.includes('engage') : stryMutAct_9fa48("12594") ? false : stryMutAct_9fa48("12593") ? true : (stryCov_9fa48("12593", "12594", "12595"), req.url?.includes(stryMutAct_9fa48("12596") ? "" : (stryCov_9fa48("12596"), 'engage')))) {
          if (stryMutAct_9fa48("12597")) {
            {}
          } else {
            stryCov_9fa48("12597");
            posthogEndpoint = stryMutAct_9fa48("12598") ? `` : (stryCov_9fa48("12598"), `${POSTHOG_HOST}/engage/`);
            method = stryMutAct_9fa48("12599") ? "" : (stryCov_9fa48("12599"), 'POST');
          }
        } else if (stryMutAct_9fa48("12602") ? req.url.includes('capture') : stryMutAct_9fa48("12601") ? false : stryMutAct_9fa48("12600") ? true : (stryCov_9fa48("12600", "12601", "12602"), req.url?.includes(stryMutAct_9fa48("12603") ? "" : (stryCov_9fa48("12603"), 'capture')))) {
          if (stryMutAct_9fa48("12604")) {
            {}
          } else {
            stryCov_9fa48("12604");
            posthogEndpoint = stryMutAct_9fa48("12605") ? `` : (stryCov_9fa48("12605"), `${POSTHOG_HOST}/capture/`);
            method = stryMutAct_9fa48("12606") ? "" : (stryCov_9fa48("12606"), 'POST');
          }
        } else if (stryMutAct_9fa48("12609") ? req.url.includes('batch') : stryMutAct_9fa48("12608") ? false : stryMutAct_9fa48("12607") ? true : (stryCov_9fa48("12607", "12608", "12609"), req.url?.includes(stryMutAct_9fa48("12610") ? "" : (stryCov_9fa48("12610"), 'batch')))) {
          if (stryMutAct_9fa48("12611")) {
            {}
          } else {
            stryCov_9fa48("12611");
            posthogEndpoint = stryMutAct_9fa48("12612") ? `` : (stryCov_9fa48("12612"), `${POSTHOG_HOST}/batch/`);
            method = stryMutAct_9fa48("12613") ? "" : (stryCov_9fa48("12613"), 'POST');
          }
        } else {
          if (stryMutAct_9fa48("12614")) {
            {}
          } else {
            stryCov_9fa48("12614");
            // Default to batch endpoint for event capture
            posthogEndpoint = stryMutAct_9fa48("12615") ? `` : (stryCov_9fa48("12615"), `${POSTHOG_HOST}/batch/`);
            method = stryMutAct_9fa48("12616") ? "" : (stryCov_9fa48("12616"), 'POST');
          }
        }

        // Prepare headers for PostHog request
        const headers: Record<string, string> = stryMutAct_9fa48("12617") ? {} : (stryCov_9fa48("12617"), {
          'Content-Type': stryMutAct_9fa48("12618") ? "" : (stryCov_9fa48("12618"), 'application/json'),
          'User-Agent': stryMutAct_9fa48("12621") ? req.headers['user-agent'] && 'aclue-Analytics/1.0' : stryMutAct_9fa48("12620") ? false : stryMutAct_9fa48("12619") ? true : (stryCov_9fa48("12619", "12620", "12621"), req.headers[stryMutAct_9fa48("12622") ? "" : (stryCov_9fa48("12622"), 'user-agent')] || (stryMutAct_9fa48("12623") ? "" : (stryCov_9fa48("12623"), 'aclue-Analytics/1.0')))
        });

        // Forward authorization header if present
        if (stryMutAct_9fa48("12625") ? false : stryMutAct_9fa48("12624") ? true : (stryCov_9fa48("12624", "12625"), req.headers.authorization)) {
          if (stryMutAct_9fa48("12626")) {
            {}
          } else {
            stryCov_9fa48("12626");
            headers.Authorization = req.headers.authorization;
          }
        }

        // Prepare request body
        let body: string | undefined;
        if (stryMutAct_9fa48("12629") ? method === 'POST' || req.body : stryMutAct_9fa48("12628") ? false : stryMutAct_9fa48("12627") ? true : (stryCov_9fa48("12627", "12628", "12629"), (stryMutAct_9fa48("12631") ? method !== 'POST' : stryMutAct_9fa48("12630") ? true : (stryCov_9fa48("12630", "12631"), method === (stryMutAct_9fa48("12632") ? "" : (stryCov_9fa48("12632"), 'POST')))) && req.body)) {
          if (stryMutAct_9fa48("12633")) {
            {}
          } else {
            stryCov_9fa48("12633");
            // Ensure the body includes the correct API key
            const bodyData = (stryMutAct_9fa48("12636") ? typeof req.body !== 'string' : stryMutAct_9fa48("12635") ? false : stryMutAct_9fa48("12634") ? true : (stryCov_9fa48("12634", "12635", "12636"), typeof req.body === (stryMutAct_9fa48("12637") ? "" : (stryCov_9fa48("12637"), 'string')))) ? JSON.parse(req.body) : req.body;

            // Add API key if not present
            if (stryMutAct_9fa48("12640") ? !bodyData.api_key || process.env.NEXT_PUBLIC_POSTHOG_KEY : stryMutAct_9fa48("12639") ? false : stryMutAct_9fa48("12638") ? true : (stryCov_9fa48("12638", "12639", "12640"), (stryMutAct_9fa48("12641") ? bodyData.api_key : (stryCov_9fa48("12641"), !bodyData.api_key)) && process.env.NEXT_PUBLIC_POSTHOG_KEY)) {
              if (stryMutAct_9fa48("12642")) {
                {}
              } else {
                stryCov_9fa48("12642");
                bodyData.api_key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
              }
            }
            body = JSON.stringify(bodyData);
          }
        }
        console.log(stryMutAct_9fa48("12643") ? `` : (stryCov_9fa48("12643"), `[PostHog Proxy] ${method} ${posthogEndpoint}`), stryMutAct_9fa48("12644") ? {} : (stryCov_9fa48("12644"), {
          hasBody: stryMutAct_9fa48("12645") ? !body : (stryCov_9fa48("12645"), !(stryMutAct_9fa48("12646") ? body : (stryCov_9fa48("12646"), !body))),
          bodySize: stryMutAct_9fa48("12649") ? body?.length && 0 : stryMutAct_9fa48("12648") ? false : stryMutAct_9fa48("12647") ? true : (stryCov_9fa48("12647", "12648", "12649"), (stryMutAct_9fa48("12650") ? body.length : (stryCov_9fa48("12650"), body?.length)) || 0),
          hasPageview: stryMutAct_9fa48("12653") ? body?.includes('$pageview') && false : stryMutAct_9fa48("12652") ? false : stryMutAct_9fa48("12651") ? true : (stryCov_9fa48("12651", "12652", "12653"), (stryMutAct_9fa48("12654") ? body.includes('$pageview') : (stryCov_9fa48("12654"), body?.includes(stryMutAct_9fa48("12655") ? "" : (stryCov_9fa48("12655"), '$pageview')))) || (stryMutAct_9fa48("12656") ? true : (stryCov_9fa48("12656"), false)))
        }));

        // Make request to PostHog
        const response = await fetch(posthogEndpoint, stryMutAct_9fa48("12657") ? {} : (stryCov_9fa48("12657"), {
          method,
          headers,
          body
        }));

        // Get response data
        const contentType = response.headers.get(stryMutAct_9fa48("12658") ? "" : (stryCov_9fa48("12658"), 'content-type'));
        let responseData: string | object;
        if (stryMutAct_9fa48("12661") ? contentType || contentType.includes('application/json') : stryMutAct_9fa48("12660") ? false : stryMutAct_9fa48("12659") ? true : (stryCov_9fa48("12659", "12660", "12661"), contentType && contentType.includes(stryMutAct_9fa48("12662") ? "" : (stryCov_9fa48("12662"), 'application/json')))) {
          if (stryMutAct_9fa48("12663")) {
            {}
          } else {
            stryCov_9fa48("12663");
            responseData = await response.json();
          }
        } else {
          if (stryMutAct_9fa48("12664")) {
            {}
          } else {
            stryCov_9fa48("12664");
            responseData = await response.text();
          }
        }

        // Log response for debugging
        console.log(stryMutAct_9fa48("12665") ? `` : (stryCov_9fa48("12665"), `[PostHog Proxy] Response ${response.status}`), stryMutAct_9fa48("12666") ? {} : (stryCov_9fa48("12666"), {
          status: response.status,
          contentType,
          dataSize: (stryMutAct_9fa48("12669") ? typeof responseData !== 'string' : stryMutAct_9fa48("12668") ? false : stryMutAct_9fa48("12667") ? true : (stryCov_9fa48("12667", "12668", "12669"), typeof responseData === (stryMutAct_9fa48("12670") ? "" : (stryCov_9fa48("12670"), 'string')))) ? responseData.length : JSON.stringify(responseData).length
        }));

        // Forward the response
        if (stryMutAct_9fa48("12673") ? typeof responseData !== 'string' : stryMutAct_9fa48("12672") ? false : stryMutAct_9fa48("12671") ? true : (stryCov_9fa48("12671", "12672", "12673"), typeof responseData === (stryMutAct_9fa48("12674") ? "" : (stryCov_9fa48("12674"), 'string')))) {
          if (stryMutAct_9fa48("12675")) {
            {}
          } else {
            stryCov_9fa48("12675");
            return res.status(response.status).send(responseData);
          }
        } else {
          if (stryMutAct_9fa48("12676")) {
            {}
          } else {
            stryCov_9fa48("12676");
            return res.status(response.status).json(responseData);
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("12677")) {
        {}
      } else {
        stryCov_9fa48("12677");
        console.error(stryMutAct_9fa48("12678") ? "" : (stryCov_9fa48("12678"), '[PostHog Proxy] Error:'), error);

        // Return detailed error in development
        if (stryMutAct_9fa48("12681") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("12680") ? false : stryMutAct_9fa48("12679") ? true : (stryCov_9fa48("12679", "12680", "12681"), process.env.NODE_ENV === (stryMutAct_9fa48("12682") ? "" : (stryCov_9fa48("12682"), 'development')))) {
          if (stryMutAct_9fa48("12683")) {
            {}
          } else {
            stryCov_9fa48("12683");
            return res.status(500).json(stryMutAct_9fa48("12684") ? {} : (stryCov_9fa48("12684"), {
              error: stryMutAct_9fa48("12685") ? "" : (stryCov_9fa48("12685"), 'PostHog proxy request failed'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("12686") ? "" : (stryCov_9fa48("12686"), 'Unknown error'),
              endpoint: req.url,
              method: req.method
            }));
          }
        }
        return res.status(500).json(stryMutAct_9fa48("12687") ? {} : (stryCov_9fa48("12687"), {
          error: stryMutAct_9fa48("12688") ? "" : (stryCov_9fa48("12688"), 'Analytics service temporarily unavailable')
        }));
      }
    }
  }
}
export const config = stryMutAct_9fa48("12689") ? {} : (stryCov_9fa48("12689"), {
  api: stryMutAct_9fa48("12690") ? {} : (stryCov_9fa48("12690"), {
    bodyParser: stryMutAct_9fa48("12691") ? {} : (stryCov_9fa48("12691"), {
      sizeLimit: stryMutAct_9fa48("12692") ? "" : (stryCov_9fa48("12692"), '2mb') // Increased for larger event batches
    })
  })
});