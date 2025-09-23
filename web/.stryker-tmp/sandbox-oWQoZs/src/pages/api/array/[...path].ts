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
const POSTHOG_HOST = stryMutAct_9fa48("12219") ? "" : (stryCov_9fa48("12219"), 'https://eu.i.posthog.com');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (stryMutAct_9fa48("12220")) {
    {}
  } else {
    stryCov_9fa48("12220");
    // Handle CORS preflight requests
    if (stryMutAct_9fa48("12223") ? req.method !== 'OPTIONS' : stryMutAct_9fa48("12222") ? false : stryMutAct_9fa48("12221") ? true : (stryCov_9fa48("12221", "12222", "12223"), req.method === (stryMutAct_9fa48("12224") ? "" : (stryCov_9fa48("12224"), 'OPTIONS')))) {
      if (stryMutAct_9fa48("12225")) {
        {}
      } else {
        stryCov_9fa48("12225");
        res.setHeader(stryMutAct_9fa48("12226") ? "" : (stryCov_9fa48("12226"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12227") ? "" : (stryCov_9fa48("12227"), '*'));
        res.setHeader(stryMutAct_9fa48("12228") ? "" : (stryCov_9fa48("12228"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12229") ? "" : (stryCov_9fa48("12229"), 'GET, POST, OPTIONS'));
        res.setHeader(stryMutAct_9fa48("12230") ? "" : (stryCov_9fa48("12230"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12231") ? "" : (stryCov_9fa48("12231"), 'Content-Type, Authorization'));
        res.setHeader(stryMutAct_9fa48("12232") ? "" : (stryCov_9fa48("12232"), 'Access-Control-Max-Age'), stryMutAct_9fa48("12233") ? "" : (stryCov_9fa48("12233"), '86400'));
        return res.status(200).end();
      }
    }

    // Set CORS headers
    res.setHeader(stryMutAct_9fa48("12234") ? "" : (stryCov_9fa48("12234"), 'Access-Control-Allow-Origin'), stryMutAct_9fa48("12235") ? "" : (stryCov_9fa48("12235"), '*'));
    res.setHeader(stryMutAct_9fa48("12236") ? "" : (stryCov_9fa48("12236"), 'Access-Control-Allow-Methods'), stryMutAct_9fa48("12237") ? "" : (stryCov_9fa48("12237"), 'GET, POST, OPTIONS'));
    res.setHeader(stryMutAct_9fa48("12238") ? "" : (stryCov_9fa48("12238"), 'Access-Control-Allow-Headers'), stryMutAct_9fa48("12239") ? "" : (stryCov_9fa48("12239"), 'Content-Type, Authorization'));
    try {
      if (stryMutAct_9fa48("12240")) {
        {}
      } else {
        stryCov_9fa48("12240");
        const {
          path
        } = req.query;
        const pathArray = Array.isArray(path) ? path : stryMutAct_9fa48("12241") ? [] : (stryCov_9fa48("12241"), [path]);
        const fullPath = pathArray.join(stryMutAct_9fa48("12242") ? "" : (stryCov_9fa48("12242"), '/'));

        // Construct PostHog array endpoint URL
        const posthogUrl = stryMutAct_9fa48("12243") ? `` : (stryCov_9fa48("12243"), `${POSTHOG_HOST}/array/${fullPath}`);

        // Add query parameters
        const url = new URL(posthogUrl);
        Object.entries(req.query).forEach(([key, value]) => {
          if (stryMutAct_9fa48("12244")) {
            {}
          } else {
            stryCov_9fa48("12244");
            if (stryMutAct_9fa48("12247") ? key !== 'path' || value : stryMutAct_9fa48("12246") ? false : stryMutAct_9fa48("12245") ? true : (stryCov_9fa48("12245", "12246", "12247"), (stryMutAct_9fa48("12249") ? key === 'path' : stryMutAct_9fa48("12248") ? true : (stryCov_9fa48("12248", "12249"), key !== (stryMutAct_9fa48("12250") ? "" : (stryCov_9fa48("12250"), 'path')))) && value)) {
              if (stryMutAct_9fa48("12251")) {
                {}
              } else {
                stryCov_9fa48("12251");
                url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
              }
            }
          }
        });
        console.log(stryMutAct_9fa48("12252") ? "" : (stryCov_9fa48("12252"), '[PostHog Array Proxy]'), req.method, url.toString());

        // Forward request to PostHog
        const response = await fetch(url.toString(), stryMutAct_9fa48("12253") ? {} : (stryCov_9fa48("12253"), {
          method: stryMutAct_9fa48("12256") ? req.method && 'GET' : stryMutAct_9fa48("12255") ? false : stryMutAct_9fa48("12254") ? true : (stryCov_9fa48("12254", "12255", "12256"), req.method || (stryMutAct_9fa48("12257") ? "" : (stryCov_9fa48("12257"), 'GET'))),
          headers: stryMutAct_9fa48("12258") ? {} : (stryCov_9fa48("12258"), {
            'User-Agent': stryMutAct_9fa48("12261") ? req.headers['user-agent'] && 'aclue-Analytics/1.0' : stryMutAct_9fa48("12260") ? false : stryMutAct_9fa48("12259") ? true : (stryCov_9fa48("12259", "12260", "12261"), req.headers[stryMutAct_9fa48("12262") ? "" : (stryCov_9fa48("12262"), 'user-agent')] || (stryMutAct_9fa48("12263") ? "" : (stryCov_9fa48("12263"), 'aclue-Analytics/1.0'))),
            ...(stryMutAct_9fa48("12266") ? req.method === 'POST' || {
              'Content-Type': 'application/json'
            } : stryMutAct_9fa48("12265") ? false : stryMutAct_9fa48("12264") ? true : (stryCov_9fa48("12264", "12265", "12266"), (stryMutAct_9fa48("12268") ? req.method !== 'POST' : stryMutAct_9fa48("12267") ? true : (stryCov_9fa48("12267", "12268"), req.method === (stryMutAct_9fa48("12269") ? "" : (stryCov_9fa48("12269"), 'POST')))) && (stryMutAct_9fa48("12270") ? {} : (stryCov_9fa48("12270"), {
              'Content-Type': stryMutAct_9fa48("12271") ? "" : (stryCov_9fa48("12271"), 'application/json')
            }))))
          }),
          ...(stryMutAct_9fa48("12274") ? req.method === 'POST' || {
            body: JSON.stringify(req.body)
          } : stryMutAct_9fa48("12273") ? false : stryMutAct_9fa48("12272") ? true : (stryCov_9fa48("12272", "12273", "12274"), (stryMutAct_9fa48("12276") ? req.method !== 'POST' : stryMutAct_9fa48("12275") ? true : (stryCov_9fa48("12275", "12276"), req.method === (stryMutAct_9fa48("12277") ? "" : (stryCov_9fa48("12277"), 'POST')))) && (stryMutAct_9fa48("12278") ? {} : (stryCov_9fa48("12278"), {
            body: JSON.stringify(req.body)
          }))))
        }));

        // Forward response
        const contentType = response.headers.get(stryMutAct_9fa48("12279") ? "" : (stryCov_9fa48("12279"), 'content-type'));
        if (stryMutAct_9fa48("12282") ? contentType?.includes('application/javascript') && contentType?.includes('text/javascript') : stryMutAct_9fa48("12281") ? false : stryMutAct_9fa48("12280") ? true : (stryCov_9fa48("12280", "12281", "12282"), (stryMutAct_9fa48("12283") ? contentType.includes('application/javascript') : (stryCov_9fa48("12283"), contentType?.includes(stryMutAct_9fa48("12284") ? "" : (stryCov_9fa48("12284"), 'application/javascript')))) || (stryMutAct_9fa48("12285") ? contentType.includes('text/javascript') : (stryCov_9fa48("12285"), contentType?.includes(stryMutAct_9fa48("12286") ? "" : (stryCov_9fa48("12286"), 'text/javascript')))))) {
          if (stryMutAct_9fa48("12287")) {
            {}
          } else {
            stryCov_9fa48("12287");
            const text = await response.text();
            res.setHeader(stryMutAct_9fa48("12288") ? "" : (stryCov_9fa48("12288"), 'Content-Type'), stryMutAct_9fa48("12289") ? "" : (stryCov_9fa48("12289"), 'application/javascript'));
            return res.status(response.status).send(text);
          }
        } else if (stryMutAct_9fa48("12292") ? contentType.includes('application/json') : stryMutAct_9fa48("12291") ? false : stryMutAct_9fa48("12290") ? true : (stryCov_9fa48("12290", "12291", "12292"), contentType?.includes(stryMutAct_9fa48("12293") ? "" : (stryCov_9fa48("12293"), 'application/json')))) {
          if (stryMutAct_9fa48("12294")) {
            {}
          } else {
            stryCov_9fa48("12294");
            const data = await response.json();
            return res.status(response.status).json(data);
          }
        } else {
          if (stryMutAct_9fa48("12295")) {
            {}
          } else {
            stryCov_9fa48("12295");
            const text = await response.text();
            res.setHeader(stryMutAct_9fa48("12296") ? "" : (stryCov_9fa48("12296"), 'Content-Type'), stryMutAct_9fa48("12299") ? contentType && 'text/plain' : stryMutAct_9fa48("12298") ? false : stryMutAct_9fa48("12297") ? true : (stryCov_9fa48("12297", "12298", "12299"), contentType || (stryMutAct_9fa48("12300") ? "" : (stryCov_9fa48("12300"), 'text/plain'))));
            return res.status(response.status).send(text);
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("12301")) {
        {}
      } else {
        stryCov_9fa48("12301");
        console.error(stryMutAct_9fa48("12302") ? "" : (stryCov_9fa48("12302"), '[PostHog Array Proxy] Error:'), error);
        if (stryMutAct_9fa48("12305") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("12304") ? false : stryMutAct_9fa48("12303") ? true : (stryCov_9fa48("12303", "12304", "12305"), process.env.NODE_ENV === (stryMutAct_9fa48("12306") ? "" : (stryCov_9fa48("12306"), 'development')))) {
          if (stryMutAct_9fa48("12307")) {
            {}
          } else {
            stryCov_9fa48("12307");
            return res.status(500).json(stryMutAct_9fa48("12308") ? {} : (stryCov_9fa48("12308"), {
              error: stryMutAct_9fa48("12309") ? "" : (stryCov_9fa48("12309"), 'PostHog array proxy failed'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("12310") ? "" : (stryCov_9fa48("12310"), 'Unknown error'),
              path: req.query.path
            }));
          }
        }
        return res.status(500).json(stryMutAct_9fa48("12311") ? {} : (stryCov_9fa48("12311"), {
          error: stryMutAct_9fa48("12312") ? "" : (stryCov_9fa48("12312"), 'Analytics configuration unavailable')
        }));
      }
    }
  }
}
export const config = stryMutAct_9fa48("12313") ? {} : (stryCov_9fa48("12313"), {
  api: stryMutAct_9fa48("12314") ? {} : (stryCov_9fa48("12314"), {
    bodyParser: stryMutAct_9fa48("12315") ? {} : (stryCov_9fa48("12315"), {
      sizeLimit: stryMutAct_9fa48("12316") ? "" : (stryCov_9fa48("12316"), '1mb')
    })
  })
});