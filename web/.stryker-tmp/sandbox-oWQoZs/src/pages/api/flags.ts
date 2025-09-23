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
const POSTHOG_HOST = stryMutAct_9fa48("12388") ? "" : (stryCov_9fa48("12388"), 'https://eu.i.posthog.com');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (stryMutAct_9fa48("12389")) {
    {}
  } else {
    stryCov_9fa48("12389");
    // Handle CORS preflight requests
    if (stryMutAct_9fa48("12392") ? req.method !== 'OPTIONS' : stryMutAct_9fa48("12391") ? false : stryMutAct_9fa48("12390") ? true : (stryCov_9fa48("12390", "12391", "12392"), req.method === (stryMutAct_9fa48("12393") ? "" : (stryCov_9fa48("12393"), 'OPTIONS')))) {
      if (stryMutAct_9fa48("12394")) {
        {}
      } else {
        stryCov_9fa48("12394");
        res.setHeader(stryMutAct_9fa48("12395") ? "" : (stryCov_9fa48("12395"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12396") ? "" : (stryCov_9fa48("12396"), '*'));
        res.setHeader(stryMutAct_9fa48("12397") ? "" : (stryCov_9fa48("12397"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12398") ? "" : (stryCov_9fa48("12398"), 'GET, POST, OPTIONS'));
        res.setHeader(stryMutAct_9fa48("12399") ? "" : (stryCov_9fa48("12399"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12400") ? "" : (stryCov_9fa48("12400"), 'Content-Type, Authorization'));
        res.setHeader(stryMutAct_9fa48("12401") ? "" : (stryCov_9fa48("12401"), 'Access-Control-Max-Age'), stryMutAct_9fa48("12402") ? "" : (stryCov_9fa48("12402"), '86400'));
        return res.status(200).end();
      }
    }

    // Set CORS headers
    res.setHeader(stryMutAct_9fa48("12403") ? "" : (stryCov_9fa48("12403"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12404") ? "" : (stryCov_9fa48("12404"), '*'));
    res.setHeader(stryMutAct_9fa48("12405") ? "" : (stryCov_9fa48("12405"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12406") ? "" : (stryCov_9fa48("12406"), 'GET, POST, OPTIONS'));
    res.setHeader(stryMutAct_9fa48("12407") ? "" : (stryCov_9fa48("12407"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12408") ? "" : (stryCov_9fa48("12408"), 'Content-Type, Authorization'));
    try {
      if (stryMutAct_9fa48("12409")) {
        {}
      } else {
        stryCov_9fa48("12409");
        // Construct PostHog flags endpoint URL
        const url = new URL(stryMutAct_9fa48("12410") ? `` : (stryCov_9fa48("12410"), `${POSTHOG_HOST}/flags/`));

        // Add query parameters
        Object.entries(req.query).forEach(([key, value]) => {
          if (stryMutAct_9fa48("12411")) {
            {}
          } else {
            stryCov_9fa48("12411");
            if (stryMutAct_9fa48("12413") ? false : stryMutAct_9fa48("12412") ? true : (stryCov_9fa48("12412", "12413"), value)) {
              if (stryMutAct_9fa48("12414")) {
                {}
              } else {
                stryCov_9fa48("12414");
                url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
              }
            }
          }
        });
        console.log(stryMutAct_9fa48("12415") ? "" : (stryCov_9fa48("12415"), '[PostHog Flags Proxy]'), req.method, url.toString());

        // Prepare request body for POST requests
        let body: string | undefined;
        if (stryMutAct_9fa48("12418") ? req.method === 'POST' || req.body : stryMutAct_9fa48("12417") ? false : stryMutAct_9fa48("12416") ? true : (stryCov_9fa48("12416", "12417", "12418"), (stryMutAct_9fa48("12420") ? req.method !== 'POST' : stryMutAct_9fa48("12419") ? true : (stryCov_9fa48("12419", "12420"), req.method === (stryMutAct_9fa48("12421") ? "" : (stryCov_9fa48("12421"), 'POST')))) && req.body)) {
          if (stryMutAct_9fa48("12422")) {
            {}
          } else {
            stryCov_9fa48("12422");
            const bodyData = (stryMutAct_9fa48("12425") ? typeof req.body !== 'string' : stryMutAct_9fa48("12424") ? false : stryMutAct_9fa48("12423") ? true : (stryCov_9fa48("12423", "12424", "12425"), typeof req.body === (stryMutAct_9fa48("12426") ? "" : (stryCov_9fa48("12426"), 'string')))) ? JSON.parse(req.body) : req.body;

            // Ensure API key is included
            if (stryMutAct_9fa48("12429") ? !bodyData.api_key || process.env.NEXT_PUBLIC_POSTHOG_KEY : stryMutAct_9fa48("12428") ? false : stryMutAct_9fa48("12427") ? true : (stryCov_9fa48("12427", "12428", "12429"), (stryMutAct_9fa48("12430") ? bodyData.api_key : (stryCov_9fa48("12430"), !bodyData.api_key)) && process.env.NEXT_PUBLIC_POSTHOG_KEY)) {
              if (stryMutAct_9fa48("12431")) {
                {}
              } else {
                stryCov_9fa48("12431");
                bodyData.api_key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
              }
            }
            body = JSON.stringify(bodyData);
          }
        }

        // Forward request to PostHog
        const response = await fetch(url.toString(), stryMutAct_9fa48("12432") ? {} : (stryCov_9fa48("12432"), {
          method: stryMutAct_9fa48("12435") ? req.method && 'GET' : stryMutAct_9fa48("12434") ? false : stryMutAct_9fa48("12433") ? true : (stryCov_9fa48("12433", "12434", "12435"), req.method || (stryMutAct_9fa48("12436") ? "" : (stryCov_9fa48("12436"), 'GET'))),
          headers: stryMutAct_9fa48("12437") ? {} : (stryCov_9fa48("12437"), {
            'Content-Type': stryMutAct_9fa48("12438") ? "" : (stryCov_9fa48("12438"), 'application/json'),
            'User-Agent': stryMutAct_9fa48("12441") ? req.headers['user-agent'] && 'aclue-Analytics/1.0' : stryMutAct_9fa48("12440") ? false : stryMutAct_9fa48("12439") ? true : (stryCov_9fa48("12439", "12440", "12441"), req.headers[stryMutAct_9fa48("12442") ? "" : (stryCov_9fa48("12442"), 'user-agent')] || (stryMutAct_9fa48("12443") ? "" : (stryCov_9fa48("12443"), 'aclue-Analytics/1.0')))
          }),
          ...(stryMutAct_9fa48("12446") ? body || {
            body
          } : stryMutAct_9fa48("12445") ? false : stryMutAct_9fa48("12444") ? true : (stryCov_9fa48("12444", "12445", "12446"), body && (stryMutAct_9fa48("12447") ? {} : (stryCov_9fa48("12447"), {
            body
          }))))
        }));

        // Handle response based on content type
        const contentType = response.headers.get(stryMutAct_9fa48("12448") ? "" : (stryCov_9fa48("12448"), 'content-type'));
        let responseData: any;
        if (stryMutAct_9fa48("12451") ? contentType || contentType.includes('application/json') : stryMutAct_9fa48("12450") ? false : stryMutAct_9fa48("12449") ? true : (stryCov_9fa48("12449", "12450", "12451"), contentType && contentType.includes(stryMutAct_9fa48("12452") ? "" : (stryCov_9fa48("12452"), 'application/json')))) {
          if (stryMutAct_9fa48("12453")) {
            {}
          } else {
            stryCov_9fa48("12453");
            responseData = await response.json();
          }
        } else {
          if (stryMutAct_9fa48("12454")) {
            {}
          } else {
            stryCov_9fa48("12454");
            const text = await response.text();
            // Try to parse as JSON, fallback to text
            try {
              if (stryMutAct_9fa48("12455")) {
                {}
              } else {
                stryCov_9fa48("12455");
                responseData = JSON.parse(text);
              }
            } catch {
              if (stryMutAct_9fa48("12456")) {
                {}
              } else {
                stryCov_9fa48("12456");
                responseData = stryMutAct_9fa48("12457") ? {} : (stryCov_9fa48("12457"), {
                  status: stryMutAct_9fa48("12458") ? "" : (stryCov_9fa48("12458"), 'error'),
                  message: text
                });
              }
            }
          }
        }
        console.log(stryMutAct_9fa48("12459") ? "" : (stryCov_9fa48("12459"), '[PostHog Flags Proxy] Response'), stryMutAct_9fa48("12460") ? {} : (stryCov_9fa48("12460"), {
          status: response.status,
          contentType,
          hasFeatureFlags: stryMutAct_9fa48("12461") ? !responseData?.featureFlags : (stryCov_9fa48("12461"), !(stryMutAct_9fa48("12462") ? responseData?.featureFlags : (stryCov_9fa48("12462"), !(stryMutAct_9fa48("12463") ? responseData.featureFlags : (stryCov_9fa48("12463"), responseData?.featureFlags))))),
          flagCount: (stryMutAct_9fa48("12464") ? responseData.featureFlags : (stryCov_9fa48("12464"), responseData?.featureFlags)) ? Object.keys(responseData.featureFlags).length : 0
        }));
        return res.status(response.status).json(responseData);
      }
    } catch (error) {
      if (stryMutAct_9fa48("12465")) {
        {}
      } else {
        stryCov_9fa48("12465");
        console.error(stryMutAct_9fa48("12466") ? "" : (stryCov_9fa48("12466"), '[PostHog Flags Proxy] Error:'), error);
        if (stryMutAct_9fa48("12469") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("12468") ? false : stryMutAct_9fa48("12467") ? true : (stryCov_9fa48("12467", "12468", "12469"), process.env.NODE_ENV === (stryMutAct_9fa48("12470") ? "" : (stryCov_9fa48("12470"), 'development')))) {
          if (stryMutAct_9fa48("12471")) {
            {}
          } else {
            stryCov_9fa48("12471");
            return res.status(500).json(stryMutAct_9fa48("12472") ? {} : (stryCov_9fa48("12472"), {
              error: stryMutAct_9fa48("12473") ? "" : (stryCov_9fa48("12473"), 'PostHog flags proxy failed'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("12474") ? "" : (stryCov_9fa48("12474"), 'Unknown error')
            }));
          }
        }
        return res.status(500).json(stryMutAct_9fa48("12475") ? {} : (stryCov_9fa48("12475"), {
          error: stryMutAct_9fa48("12476") ? "" : (stryCov_9fa48("12476"), 'Feature flags service temporarily unavailable')
        }));
      }
    }
  }
}
export const config = stryMutAct_9fa48("12477") ? {} : (stryCov_9fa48("12477"), {
  api: stryMutAct_9fa48("12478") ? {} : (stryCov_9fa48("12478"), {
    bodyParser: stryMutAct_9fa48("12479") ? {} : (stryCov_9fa48("12479"), {
      sizeLimit: stryMutAct_9fa48("12480") ? "" : (stryCov_9fa48("12480"), '1mb')
    })
  })
});