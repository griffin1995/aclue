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
import React, { useEffect, useState } from 'react';
import { config } from '@/config';
export default function DebugPostHog() {
  if (stryMutAct_9fa48("13807")) {
    {}
  } else {
    stryCov_9fa48("13807");
    const [logs, setLogs] = useState<string[]>(stryMutAct_9fa48("13808") ? ["Stryker was here"] : (stryCov_9fa48("13808"), []));
    const [posthogStatus, setPosthogStatus] = useState<'loading' | 'success' | 'error'>(stryMutAct_9fa48("13809") ? "" : (stryCov_9fa48("13809"), 'loading'));
    const addLog = (message: string) => {
      if (stryMutAct_9fa48("13810")) {
        {}
      } else {
        stryCov_9fa48("13810");
        console.log(message);
        setLogs(stryMutAct_9fa48("13811") ? () => undefined : (stryCov_9fa48("13811"), prev => stryMutAct_9fa48("13812") ? [] : (stryCov_9fa48("13812"), [...prev, stryMutAct_9fa48("13813") ? `` : (stryCov_9fa48("13813"), `${new Date().toISOString()}: ${message}`)])));
      }
    };
    useEffect(() => {
      if (stryMutAct_9fa48("13814")) {
        {}
      } else {
        stryCov_9fa48("13814");
        const testPostHog = async () => {
          if (stryMutAct_9fa48("13815")) {
            {}
          } else {
            stryCov_9fa48("13815");
            try {
              if (stryMutAct_9fa48("13816")) {
                {}
              } else {
                stryCov_9fa48("13816");
                addLog(stryMutAct_9fa48("13817") ? "" : (stryCov_9fa48("13817"), '=== PostHog Debug Test Starting ==='));

                // Check environment variables
                addLog(stryMutAct_9fa48("13818") ? `` : (stryCov_9fa48("13818"), `NODE_ENV: ${process.env.NODE_ENV}`));
                addLog(stryMutAct_9fa48("13819") ? `` : (stryCov_9fa48("13819"), `NEXT_PUBLIC_POSTHOG_KEY: ${config.posthogKey ? stryMutAct_9fa48("13820") ? "" : (stryCov_9fa48("13820"), 'SET') : stryMutAct_9fa48("13821") ? "" : (stryCov_9fa48("13821"), 'MISSING')}`));
                addLog(stryMutAct_9fa48("13822") ? `` : (stryCov_9fa48("13822"), `NEXT_PUBLIC_POSTHOG_HOST: ${stryMutAct_9fa48("13825") ? config.posthogHost && 'MISSING' : stryMutAct_9fa48("13824") ? false : stryMutAct_9fa48("13823") ? true : (stryCov_9fa48("13823", "13824", "13825"), config.posthogHost || (stryMutAct_9fa48("13826") ? "" : (stryCov_9fa48("13826"), 'MISSING')))}`));

                // Check if window and posthog exist
                if (stryMutAct_9fa48("13829") ? typeof window !== 'undefined' : stryMutAct_9fa48("13828") ? false : stryMutAct_9fa48("13827") ? true : (stryCov_9fa48("13827", "13828", "13829"), typeof window === (stryMutAct_9fa48("13830") ? "" : (stryCov_9fa48("13830"), 'undefined')))) {
                  if (stryMutAct_9fa48("13831")) {
                    {}
                  } else {
                    stryCov_9fa48("13831");
                    addLog(stryMutAct_9fa48("13832") ? "" : (stryCov_9fa48("13832"), 'ERROR: Running on server side'));
                    setPosthogStatus(stryMutAct_9fa48("13833") ? "" : (stryCov_9fa48("13833"), 'error'));
                    return;
                  }
                }
                addLog(stryMutAct_9fa48("13834") ? "" : (stryCov_9fa48("13834"), 'Window object available'));

                // Import PostHog dynamically
                const posthog = await import(stryMutAct_9fa48("13835") ? "" : (stryCov_9fa48("13835"), 'posthog-js'));
                addLog(stryMutAct_9fa48("13836") ? "" : (stryCov_9fa48("13836"), 'PostHog module imported successfully'));

                // Initialize PostHog manually for debugging
                if (stryMutAct_9fa48("13838") ? false : stryMutAct_9fa48("13837") ? true : (stryCov_9fa48("13837", "13838"), config.posthogKey)) {
                  if (stryMutAct_9fa48("13839")) {
                    {}
                  } else {
                    stryCov_9fa48("13839");
                    addLog(stryMutAct_9fa48("13840") ? "" : (stryCov_9fa48("13840"), 'Initializing PostHog...'));
                    posthog.default.init(config.posthogKey, stryMutAct_9fa48("13841") ? {} : (stryCov_9fa48("13841"), {
                      api_host: stryMutAct_9fa48("13844") ? config.posthogHost && 'https://app.posthog.com' : stryMutAct_9fa48("13843") ? false : stryMutAct_9fa48("13842") ? true : (stryCov_9fa48("13842", "13843", "13844"), config.posthogHost || (stryMutAct_9fa48("13845") ? "" : (stryCov_9fa48("13845"), 'https://app.posthog.com'))),
                      debug: stryMutAct_9fa48("13846") ? false : (stryCov_9fa48("13846"), true),
                      // Force debug mode
                      capture_pageview: stryMutAct_9fa48("13847") ? true : (stryCov_9fa48("13847"), false),
                      person_profiles: stryMutAct_9fa48("13848") ? "" : (stryCov_9fa48("13848"), 'identified_only')
                    }));
                    addLog(stryMutAct_9fa48("13849") ? "" : (stryCov_9fa48("13849"), 'PostHog initialized'));

                    // Wait a moment for initialization
                    await new Promise(stryMutAct_9fa48("13850") ? () => undefined : (stryCov_9fa48("13850"), resolve => setTimeout(resolve, 1000)));

                    // Check if PostHog is loaded
                    if (stryMutAct_9fa48("13852") ? false : stryMutAct_9fa48("13851") ? true : (stryCov_9fa48("13851", "13852"), window.posthog)) {
                      if (stryMutAct_9fa48("13853")) {
                        {}
                      } else {
                        stryCov_9fa48("13853");
                        addLog(stryMutAct_9fa48("13854") ? "" : (stryCov_9fa48("13854"), 'PostHog is available on window object'));

                        // Test capturing an event
                        addLog(stryMutAct_9fa48("13855") ? "" : (stryCov_9fa48("13855"), 'Sending test event...'));
                        window.posthog.capture(stryMutAct_9fa48("13856") ? "" : (stryCov_9fa48("13856"), 'debug_test_event'), stryMutAct_9fa48("13857") ? {} : (stryCov_9fa48("13857"), {
                          test: stryMutAct_9fa48("13858") ? false : (stryCov_9fa48("13858"), true),
                          timestamp: new Date().toISOString(),
                          source: stryMutAct_9fa48("13859") ? "" : (stryCov_9fa48("13859"), 'debug_page'),
                          url: window.location.href
                        }));
                        addLog(stryMutAct_9fa48("13860") ? "" : (stryCov_9fa48("13860"), 'Test event sent'));

                        // Test page view
                        addLog(stryMutAct_9fa48("13861") ? "" : (stryCov_9fa48("13861"), 'Sending page view...'));
                        window.posthog.capture(stryMutAct_9fa48("13862") ? "" : (stryCov_9fa48("13862"), '$pageview'), stryMutAct_9fa48("13863") ? {} : (stryCov_9fa48("13863"), {
                          $current_url: window.location.href
                        }));
                        addLog(stryMutAct_9fa48("13864") ? "" : (stryCov_9fa48("13864"), 'Page view sent'));
                        setPosthogStatus(stryMutAct_9fa48("13865") ? "" : (stryCov_9fa48("13865"), 'success'));
                        addLog(stryMutAct_9fa48("13866") ? "" : (stryCov_9fa48("13866"), '=== PostHog Debug Test Completed Successfully ==='));
                      }
                    } else {
                      if (stryMutAct_9fa48("13867")) {
                        {}
                      } else {
                        stryCov_9fa48("13867");
                        addLog(stryMutAct_9fa48("13868") ? "" : (stryCov_9fa48("13868"), 'ERROR: PostHog not available on window object'));
                        setPosthogStatus(stryMutAct_9fa48("13869") ? "" : (stryCov_9fa48("13869"), 'error'));
                      }
                    }
                  }
                } else {
                  if (stryMutAct_9fa48("13870")) {
                    {}
                  } else {
                    stryCov_9fa48("13870");
                    addLog(stryMutAct_9fa48("13871") ? "" : (stryCov_9fa48("13871"), 'ERROR: PostHog key not configured'));
                    setPosthogStatus(stryMutAct_9fa48("13872") ? "" : (stryCov_9fa48("13872"), 'error'));
                  }
                }
              }
            } catch (error) {
              if (stryMutAct_9fa48("13873")) {
                {}
              } else {
                stryCov_9fa48("13873");
                addLog(stryMutAct_9fa48("13874") ? `` : (stryCov_9fa48("13874"), `ERROR: ${error instanceof Error ? error.message : stryMutAct_9fa48("13875") ? "" : (stryCov_9fa48("13875"), 'Unknown error')}`));
                setPosthogStatus(stryMutAct_9fa48("13876") ? "" : (stryCov_9fa48("13876"), 'error'));
              }
            }
          }
        };
        testPostHog();
      }
    }, stryMutAct_9fa48("13877") ? ["Stryker was here"] : (stryCov_9fa48("13877"), []));
    const sendManualEvent = () => {
      if (stryMutAct_9fa48("13878")) {
        {}
      } else {
        stryCov_9fa48("13878");
        if (stryMutAct_9fa48("13880") ? false : stryMutAct_9fa48("13879") ? true : (stryCov_9fa48("13879", "13880"), window.posthog)) {
          if (stryMutAct_9fa48("13881")) {
            {}
          } else {
            stryCov_9fa48("13881");
            const eventName = stryMutAct_9fa48("13882") ? `` : (stryCov_9fa48("13882"), `manual_debug_${Date.now()}`);
            addLog(stryMutAct_9fa48("13883") ? `` : (stryCov_9fa48("13883"), `Sending manual event: ${eventName}`));
            window.posthog.capture(eventName, stryMutAct_9fa48("13884") ? {} : (stryCov_9fa48("13884"), {
              manual: stryMutAct_9fa48("13885") ? false : (stryCov_9fa48("13885"), true),
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent
            }));
            addLog(stryMutAct_9fa48("13886") ? "" : (stryCov_9fa48("13886"), 'Manual event sent'));
          }
        } else {
          if (stryMutAct_9fa48("13887")) {
            {}
          } else {
            stryCov_9fa48("13887");
            addLog(stryMutAct_9fa48("13888") ? "" : (stryCov_9fa48("13888"), 'ERROR: PostHog not available for manual event'));
          }
        }
      }
    };
    const sendPageviewEvent = () => {
      if (stryMutAct_9fa48("13889")) {
        {}
      } else {
        stryCov_9fa48("13889");
        if (stryMutAct_9fa48("13891") ? false : stryMutAct_9fa48("13890") ? true : (stryCov_9fa48("13890", "13891"), window.posthog)) {
          if (stryMutAct_9fa48("13892")) {
            {}
          } else {
            stryCov_9fa48("13892");
            addLog(stryMutAct_9fa48("13893") ? "" : (stryCov_9fa48("13893"), 'Sending manual $pageview event...'));
            window.posthog.capture(stryMutAct_9fa48("13894") ? "" : (stryCov_9fa48("13894"), '$pageview'), stryMutAct_9fa48("13895") ? {} : (stryCov_9fa48("13895"), {
              $current_url: window.location.href,
              $pathname: window.location.pathname,
              $host: window.location.host,
              $referrer: document.referrer,
              page_title: document.title,
              manual_pageview: stryMutAct_9fa48("13896") ? false : (stryCov_9fa48("13896"), true),
              timestamp: new Date().toISOString()
            }));
            addLog(stryMutAct_9fa48("13897") ? "" : (stryCov_9fa48("13897"), 'Manual $pageview event sent'));
          }
        } else {
          if (stryMutAct_9fa48("13898")) {
            {}
          } else {
            stryCov_9fa48("13898");
            addLog(stryMutAct_9fa48("13899") ? "" : (stryCov_9fa48("13899"), 'ERROR: PostHog not available for pageview event'));
          }
        }
      }
    };
    return <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PostHog Debug Page</h1>
        
        {/* Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className={stryMutAct_9fa48("13900") ? `` : (stryCov_9fa48("13900"), `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${(stryMutAct_9fa48("13903") ? posthogStatus !== 'loading' : stryMutAct_9fa48("13902") ? false : stryMutAct_9fa48("13901") ? true : (stryCov_9fa48("13901", "13902", "13903"), posthogStatus === (stryMutAct_9fa48("13904") ? "" : (stryCov_9fa48("13904"), 'loading')))) ? stryMutAct_9fa48("13905") ? "" : (stryCov_9fa48("13905"), 'bg-yellow-100 text-yellow-800') : (stryMutAct_9fa48("13908") ? posthogStatus !== 'success' : stryMutAct_9fa48("13907") ? false : stryMutAct_9fa48("13906") ? true : (stryCov_9fa48("13906", "13907", "13908"), posthogStatus === (stryMutAct_9fa48("13909") ? "" : (stryCov_9fa48("13909"), 'success')))) ? stryMutAct_9fa48("13910") ? "" : (stryCov_9fa48("13910"), 'bg-green-100 text-green-800') : stryMutAct_9fa48("13911") ? "" : (stryCov_9fa48("13911"), 'bg-red-100 text-red-800')}`)}>
            {(stryMutAct_9fa48("13914") ? posthogStatus !== 'loading' : stryMutAct_9fa48("13913") ? false : stryMutAct_9fa48("13912") ? true : (stryCov_9fa48("13912", "13913", "13914"), posthogStatus === (stryMutAct_9fa48("13915") ? "" : (stryCov_9fa48("13915"), 'loading')))) ? stryMutAct_9fa48("13916") ? "" : (stryCov_9fa48("13916"), 'Testing...') : (stryMutAct_9fa48("13919") ? posthogStatus !== 'success' : stryMutAct_9fa48("13918") ? false : stryMutAct_9fa48("13917") ? true : (stryCov_9fa48("13917", "13918", "13919"), posthogStatus === (stryMutAct_9fa48("13920") ? "" : (stryCov_9fa48("13920"), 'success')))) ? stryMutAct_9fa48("13921") ? "" : (stryCov_9fa48("13921"), 'PostHog Working') : stryMutAct_9fa48("13922") ? "" : (stryCov_9fa48("13922"), 'PostHog Error')}
          </div>
        </div>

        {/* Manual Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
          <button onClick={sendManualEvent} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4">
            Send Manual Event
          </button>
          <button onClick={sendPageviewEvent} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4">
            Send $pageview Event
          </button>
          <button onClick={() => {
            if (stryMutAct_9fa48("13923")) {
              {}
            } else {
              stryCov_9fa48("13923");
              if (stryMutAct_9fa48("13925") ? false : stryMutAct_9fa48("13924") ? true : (stryCov_9fa48("13924", "13925"), window.posthog)) {
                if (stryMutAct_9fa48("13926")) {
                  {}
                } else {
                  stryCov_9fa48("13926");
                  window.posthog.identify(stryMutAct_9fa48("13927") ? `` : (stryCov_9fa48("13927"), `debug_user_${Date.now()}`), stryMutAct_9fa48("13928") ? {} : (stryCov_9fa48("13928"), {
                    email: stryMutAct_9fa48("13929") ? "" : (stryCov_9fa48("13929"), 'debug@example.com'),
                    name: stryMutAct_9fa48("13930") ? "" : (stryCov_9fa48("13930"), 'Debug User')
                  }));
                  addLog(stryMutAct_9fa48("13931") ? "" : (stryCov_9fa48("13931"), 'User identified'));
                }
              }
            }
          }} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Identify User
          </button>
        </div>

        {/* Network Check */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Network Test</h2>
          <button onClick={async () => {
            if (stryMutAct_9fa48("13932")) {
              {}
            } else {
              stryCov_9fa48("13932");
              try {
                if (stryMutAct_9fa48("13933")) {
                  {}
                } else {
                  stryCov_9fa48("13933");
                  addLog(stryMutAct_9fa48("13934") ? "" : (stryCov_9fa48("13934"), 'Testing direct API call...'));
                  const response = await fetch(stryMutAct_9fa48("13935") ? "" : (stryCov_9fa48("13935"), 'https://eu.i.posthog.com/batch/'), stryMutAct_9fa48("13936") ? {} : (stryCov_9fa48("13936"), {
                    method: stryMutAct_9fa48("13937") ? "" : (stryCov_9fa48("13937"), 'POST'),
                    headers: stryMutAct_9fa48("13938") ? {} : (stryCov_9fa48("13938"), {
                      'Content-Type': stryMutAct_9fa48("13939") ? "" : (stryCov_9fa48("13939"), 'application/json')
                    }),
                    body: JSON.stringify(stryMutAct_9fa48("13940") ? {} : (stryCov_9fa48("13940"), {
                      api_key: config.posthogKey,
                      batch: stryMutAct_9fa48("13941") ? [] : (stryCov_9fa48("13941"), [stryMutAct_9fa48("13942") ? {} : (stryCov_9fa48("13942"), {
                        event: stryMutAct_9fa48("13943") ? "" : (stryCov_9fa48("13943"), 'direct_api_test'),
                        properties: stryMutAct_9fa48("13944") ? {} : (stryCov_9fa48("13944"), {
                          distinct_id: stryMutAct_9fa48("13945") ? "" : (stryCov_9fa48("13945"), 'debug_user'),
                          timestamp: new Date().toISOString()
                        })
                      })])
                    }))
                  }));
                  addLog(stryMutAct_9fa48("13946") ? `` : (stryCov_9fa48("13946"), `Direct API response: ${response.status} ${response.statusText}`));
                }
              } catch (error) {
                if (stryMutAct_9fa48("13947")) {
                  {}
                } else {
                  stryCov_9fa48("13947");
                  addLog(stryMutAct_9fa48("13948") ? `` : (stryCov_9fa48("13948"), `Direct API error: ${error instanceof Error ? error.message : stryMutAct_9fa48("13949") ? "" : (stryCov_9fa48("13949"), 'Unknown')}`));
                }
              }
            }
          }} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Test Direct API Call
          </button>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibent mb-4">Debug Logs</h2>
          <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {logs.join(stryMutAct_9fa48("13950") ? "" : (stryCov_9fa48("13950"), '\n'))}
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h2>
          <ol className="text-blue-800 space-y-1">
            <li>1. Open browser developer tools (F12)</li>
            <li>2. Go to Console tab to see any JavaScript errors</li>
            <li>3. Go to Network tab to see if requests are being made to PostHog</li>
            <li>4. Click the test buttons above</li>
            <li>5. Check your PostHog dashboard for events</li>
          </ol>
        </div>
      </div>
    </div>;
  }
}

// Make posthog available on window for debugging
declare global {
  interface Window {
    posthog: any;
  }
}