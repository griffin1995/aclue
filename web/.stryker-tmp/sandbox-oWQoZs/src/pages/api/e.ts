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
const POSTHOG_HOST = stryMutAct_9fa48("12317") ? "" : (stryCov_9fa48("12317"), 'https://eu.i.posthog.com');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (stryMutAct_9fa48("12318")) {
    {}
  } else {
    stryCov_9fa48("12318");
    // Handle CORS preflight requests
    if (stryMutAct_9fa48("12321") ? req.method !== 'OPTIONS' : stryMutAct_9fa48("12320") ? false : stryMutAct_9fa48("12319") ? true : (stryCov_9fa48("12319", "12320", "12321"), req.method === (stryMutAct_9fa48("12322") ? "" : (stryCov_9fa48("12322"), 'OPTIONS')))) {
      if (stryMutAct_9fa48("12323")) {
        {}
      } else {
        stryCov_9fa48("12323");
        res.setHeader(stryMutAct_9fa48("12324") ? "" : (stryCov_9fa48("12324"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12325") ? "" : (stryCov_9fa48("12325"), '*'));
        res.setHeader(stryMutAct_9fa48("12326") ? "" : (stryCov_9fa48("12326"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12327") ? "" : (stryCov_9fa48("12327"), 'GET, POST, OPTIONS'));
        res.setHeader(stryMutAct_9fa48("12328") ? "" : (stryCov_9fa48("12328"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12329") ? "" : (stryCov_9fa48("12329"), 'Content-Type, Authorization'));
        res.setHeader(stryMutAct_9fa48("12330") ? "" : (stryCov_9fa48("12330"), 'Access-Control-Max-Age'), stryMutAct_9fa48("12331") ? "" : (stryCov_9fa48("12331"), '86400'));
        return res.status(200).end();
      }
    }

    // Set CORS headers
    res.setHeader(stryMutAct_9fa48("12332") ? "" : (stryCov_9fa48("12332"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12333") ? "" : (stryCov_9fa48("12333"), '*'));
    res.setHeader(stryMutAct_9fa48("12334") ? "" : (stryCov_9fa48("12334"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12335") ? "" : (stryCov_9fa48("12335"), 'GET, POST, OPTIONS'));
    res.setHeader(stryMutAct_9fa48("12336") ? "" : (stryCov_9fa48("12336"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12337") ? "" : (stryCov_9fa48("12337"), 'Content-Type, Authorization'));
    try {
      if (stryMutAct_9fa48("12338")) {
        {}
      } else {
        stryCov_9fa48("12338");
        // Construct PostHog event endpoint URL
        const url = new URL(stryMutAct_9fa48("12339") ? `` : (stryCov_9fa48("12339"), `${POSTHOG_HOST}/e/`));

        // Add query parameters
        Object.entries(req.query).forEach(([key, value]) => {
          if (stryMutAct_9fa48("12340")) {
            {}
          } else {
            stryCov_9fa48("12340");
            if (stryMutAct_9fa48("12342") ? false : stryMutAct_9fa48("12341") ? true : (stryCov_9fa48("12341", "12342"), value)) {
              if (stryMutAct_9fa48("12343")) {
                {}
              } else {
                stryCov_9fa48("12343");
                url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
              }
            }
          }
        });
        console.log(stryMutAct_9fa48("12344") ? "" : (stryCov_9fa48("12344"), '[PostHog Events Proxy]'), req.method, url.toString());

        // Forward request to PostHog
        const response = await fetch(url.toString(), stryMutAct_9fa48("12345") ? {} : (stryCov_9fa48("12345"), {
          method: stryMutAct_9fa48("12348") ? req.method && 'GET' : stryMutAct_9fa48("12347") ? false : stryMutAct_9fa48("12346") ? true : (stryCov_9fa48("12346", "12347", "12348"), req.method || (stryMutAct_9fa48("12349") ? "" : (stryCov_9fa48("12349"), 'GET'))),
          headers: stryMutAct_9fa48("12350") ? {} : (stryCov_9fa48("12350"), {
            'User-Agent': stryMutAct_9fa48("12353") ? req.headers['user-agent'] && 'aclue-Analytics/1.0' : stryMutAct_9fa48("12352") ? false : stryMutAct_9fa48("12351") ? true : (stryCov_9fa48("12351", "12352", "12353"), req.headers[stryMutAct_9fa48("12354") ? "" : (stryCov_9fa48("12354"), 'user-agent')] || (stryMutAct_9fa48("12355") ? "" : (stryCov_9fa48("12355"), 'aclue-Analytics/1.0'))),
            ...(stryMutAct_9fa48("12358") ? req.headers.referer || {
              'Referer': req.headers.referer
            } : stryMutAct_9fa48("12357") ? false : stryMutAct_9fa48("12356") ? true : (stryCov_9fa48("12356", "12357", "12358"), req.headers.referer && (stryMutAct_9fa48("12359") ? {} : (stryCov_9fa48("12359"), {
              'Referer': req.headers.referer
            }))))
          })
        }));

        // Handle different response types
        const contentType = response.headers.get(stryMutAct_9fa48("12360") ? "" : (stryCov_9fa48("12360"), 'content-type'));
        if (stryMutAct_9fa48("12363") ? contentType.includes('application/json') : stryMutAct_9fa48("12362") ? false : stryMutAct_9fa48("12361") ? true : (stryCov_9fa48("12361", "12362", "12363"), contentType?.includes(stryMutAct_9fa48("12364") ? "" : (stryCov_9fa48("12364"), 'application/json')))) {
          if (stryMutAct_9fa48("12365")) {
            {}
          } else {
            stryCov_9fa48("12365");
            const data = await response.json();
            return res.status(response.status).json(data);
          }
        } else {
          if (stryMutAct_9fa48("12366")) {
            {}
          } else {
            stryCov_9fa48("12366");
            const text = await response.text();
            res.setHeader(stryMutAct_9fa48("12367") ? "" : (stryCov_9fa48("12367"), 'Content-Type'), stryMutAct_9fa48("12370") ? contentType && 'text/plain' : stryMutAct_9fa48("12369") ? false : stryMutAct_9fa48("12368") ? true : (stryCov_9fa48("12368", "12369", "12370"), contentType || (stryMutAct_9fa48("12371") ? "" : (stryCov_9fa48("12371"), 'text/plain'))));
            return res.status(response.status).send(text);
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("12372")) {
        {}
      } else {
        stryCov_9fa48("12372");
        console.error(stryMutAct_9fa48("12373") ? "" : (stryCov_9fa48("12373"), '[PostHog Events Proxy] Error:'), error);
        if (stryMutAct_9fa48("12376") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("12375") ? false : stryMutAct_9fa48("12374") ? true : (stryCov_9fa48("12374", "12375", "12376"), process.env.NODE_ENV === (stryMutAct_9fa48("12377") ? "" : (stryCov_9fa48("12377"), 'development')))) {
          if (stryMutAct_9fa48("12378")) {
            {}
          } else {
            stryCov_9fa48("12378");
            return res.status(500).json(stryMutAct_9fa48("12379") ? {} : (stryCov_9fa48("12379"), {
              error: stryMutAct_9fa48("12380") ? "" : (stryCov_9fa48("12380"), 'PostHog events proxy failed'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("12381") ? "" : (stryCov_9fa48("12381"), 'Unknown error')
            }));
          }
        }
        return res.status(500).json(stryMutAct_9fa48("12382") ? {} : (stryCov_9fa48("12382"), {
          error: stryMutAct_9fa48("12383") ? "" : (stryCov_9fa48("12383"), 'Event tracking temporarily unavailable')
        }));
      }
    }
  }
}
export const config = stryMutAct_9fa48("12384") ? {} : (stryCov_9fa48("12384"), {
  api: stryMutAct_9fa48("12385") ? {} : (stryCov_9fa48("12385"), {
    bodyParser: stryMutAct_9fa48("12386") ? {} : (stryCov_9fa48("12386"), {
      sizeLimit: stryMutAct_9fa48("12387") ? "" : (stryCov_9fa48("12387"), '1mb')
    })
  })
});