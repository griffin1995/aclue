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
import React, { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { config } from '@/config';
export default function PostHogLiveTest() {
  if (stryMutAct_9fa48("14231")) {
    {}
  } else {
    stryCov_9fa48("14231");
    const [events, setEvents] = useState<Array<{
      id: string;
      name: string;
      timestamp: string;
      status: 'sent' | 'error';
    }>>(stryMutAct_9fa48("14232") ? ["Stryker was here"] : (stryCov_9fa48("14232"), []));
    const [isInitialized, setIsInitialized] = useState(stryMutAct_9fa48("14233") ? true : (stryCov_9fa48("14233"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("14234")) {
        {}
      } else {
        stryCov_9fa48("14234");
        // Initialize PostHog
        analytics.init();
        setIsInitialized(stryMutAct_9fa48("14235") ? false : (stryCov_9fa48("14235"), true));

        // Send an automatic page view event
        addEvent(stryMutAct_9fa48("14236") ? "" : (stryCov_9fa48("14236"), 'page_view_test'), stryMutAct_9fa48("14237") ? "" : (stryCov_9fa48("14237"), 'Page Load Event'));
      }
    }, stryMutAct_9fa48("14238") ? ["Stryker was here"] : (stryCov_9fa48("14238"), []));
    const addEvent = (eventName: string, displayName: string) => {
      if (stryMutAct_9fa48("14239")) {
        {}
      } else {
        stryCov_9fa48("14239");
        const eventId = stryMutAct_9fa48("14240") ? Math.random().toString(36) : (stryCov_9fa48("14240"), Math.random().toString(36).substr(2, 9));
        try {
          if (stryMutAct_9fa48("14241")) {
            {}
          } else {
            stryCov_9fa48("14241");
            analytics.track(eventName, stryMutAct_9fa48("14242") ? {} : (stryCov_9fa48("14242"), {
              test_session: stryMutAct_9fa48("14243") ? "" : (stryCov_9fa48("14243"), 'posthog_live_test'),
              timestamp: new Date().toISOString(),
              event_id: eventId,
              page: stryMutAct_9fa48("14244") ? "" : (stryCov_9fa48("14244"), 'PostHog Live Test'),
              user_agent: navigator.userAgent
            }));
            setEvents(stryMutAct_9fa48("14245") ? () => undefined : (stryCov_9fa48("14245"), prev => stryMutAct_9fa48("14246") ? [] : (stryCov_9fa48("14246"), [...prev, stryMutAct_9fa48("14247") ? {} : (stryCov_9fa48("14247"), {
              id: eventId,
              name: displayName,
              timestamp: new Date().toLocaleTimeString(),
              status: stryMutAct_9fa48("14248") ? "" : (stryCov_9fa48("14248"), 'sent')
            })])));
          }
        } catch (error) {
          if (stryMutAct_9fa48("14249")) {
            {}
          } else {
            stryCov_9fa48("14249");
            setEvents(stryMutAct_9fa48("14250") ? () => undefined : (stryCov_9fa48("14250"), prev => stryMutAct_9fa48("14251") ? [] : (stryCov_9fa48("14251"), [...prev, stryMutAct_9fa48("14252") ? {} : (stryCov_9fa48("14252"), {
              id: eventId,
              name: displayName,
              timestamp: new Date().toLocaleTimeString(),
              status: stryMutAct_9fa48("14253") ? "" : (stryCov_9fa48("14253"), 'error')
            })])));
          }
        }
      }
    };
    const testEvents = stryMutAct_9fa48("14254") ? [] : (stryCov_9fa48("14254"), [stryMutAct_9fa48("14255") ? {} : (stryCov_9fa48("14255"), {
      name: stryMutAct_9fa48("14256") ? "" : (stryCov_9fa48("14256"), 'button_click_test'),
      display: stryMutAct_9fa48("14257") ? "" : (stryCov_9fa48("14257"), 'Button Click Test'),
      description: stryMutAct_9fa48("14258") ? "" : (stryCov_9fa48("14258"), 'Tests basic button click tracking')
    }), stryMutAct_9fa48("14259") ? {} : (stryCov_9fa48("14259"), {
      name: stryMutAct_9fa48("14260") ? "" : (stryCov_9fa48("14260"), 'form_submit_test'),
      display: stryMutAct_9fa48("14261") ? "" : (stryCov_9fa48("14261"), 'Form Submit Test'),
      description: stryMutAct_9fa48("14262") ? "" : (stryCov_9fa48("14262"), 'Tests form submission tracking')
    }), stryMutAct_9fa48("14263") ? {} : (stryCov_9fa48("14263"), {
      name: stryMutAct_9fa48("14264") ? "" : (stryCov_9fa48("14264"), 'user_action_test'),
      display: stryMutAct_9fa48("14265") ? "" : (stryCov_9fa48("14265"), 'User Action Test'),
      description: stryMutAct_9fa48("14266") ? "" : (stryCov_9fa48("14266"), 'Tests custom user action tracking')
    }), stryMutAct_9fa48("14267") ? {} : (stryCov_9fa48("14267"), {
      name: stryMutAct_9fa48("14268") ? "" : (stryCov_9fa48("14268"), 'feature_usage_test'),
      display: stryMutAct_9fa48("14269") ? "" : (stryCov_9fa48("14269"), 'Feature Usage Test'),
      description: stryMutAct_9fa48("14270") ? "" : (stryCov_9fa48("14270"), 'Tests feature usage tracking')
    }), stryMutAct_9fa48("14271") ? {} : (stryCov_9fa48("14271"), {
      name: stryMutAct_9fa48("14272") ? "" : (stryCov_9fa48("14272"), 'error_simulation_test'),
      display: stryMutAct_9fa48("14273") ? "" : (stryCov_9fa48("14273"), 'Error Simulation Test'),
      description: stryMutAct_9fa48("14274") ? "" : (stryCov_9fa48("14274"), 'Tests error event tracking')
    })]);
    const identifyTestUser = () => {
      if (stryMutAct_9fa48("14275")) {
        {}
      } else {
        stryCov_9fa48("14275");
        const userId = stryMutAct_9fa48("14276") ? `` : (stryCov_9fa48("14276"), `test_user_${Date.now()}`);
        analytics.identify(userId, stryMutAct_9fa48("14277") ? {} : (stryCov_9fa48("14277"), {
          email: stryMutAct_9fa48("14278") ? "" : (stryCov_9fa48("14278"), 'test@aclue.app'),
          name: stryMutAct_9fa48("14279") ? "" : (stryCov_9fa48("14279"), 'PostHog Test User'),
          test_session: stryMutAct_9fa48("14280") ? false : (stryCov_9fa48("14280"), true),
          created_at: new Date().toISOString(),
          subscription_tier: stryMutAct_9fa48("14281") ? "" : (stryCov_9fa48("14281"), 'free')
        }));
        addEvent(stryMutAct_9fa48("14282") ? "" : (stryCov_9fa48("14282"), 'user_identify_test'), stryMutAct_9fa48("14283") ? "" : (stryCov_9fa48("14283"), 'User Identification Test'));
      }
    };
    const clearEvents = () => {
      if (stryMutAct_9fa48("14284")) {
        {}
      } else {
        stryCov_9fa48("14284");
        setEvents(stryMutAct_9fa48("14285") ? ["Stryker was here"] : (stryCov_9fa48("14285"), []));
      }
    };
    return <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">PostHog Live Test Dashboard</h1>
          
          {/* Status */}
          <div className="mb-8 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Configuration Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">PostHog Key:</span> 
                <span className={config.posthogKey ? stryMutAct_9fa48("14286") ? "" : (stryCov_9fa48("14286"), 'text-green-600 ml-2') : stryMutAct_9fa48("14287") ? "" : (stryCov_9fa48("14287"), 'text-red-600 ml-2')}>
                  {config.posthogKey ? stryMutAct_9fa48("14288") ? "" : (stryCov_9fa48("14288"), '✓ Configured') : stryMutAct_9fa48("14289") ? "" : (stryCov_9fa48("14289"), '✗ Missing')}
                </span>
              </div>
              <div>
                <span className="font-medium">PostHog Host:</span> 
                <span className="text-gray-600 ml-2">{config.posthogHost}</span>
              </div>
              <div>
                <span className="font-medium">Environment:</span> 
                <span className="text-gray-600 ml-2">{config.isDevelopment ? stryMutAct_9fa48("14290") ? "" : (stryCov_9fa48("14290"), 'Development') : stryMutAct_9fa48("14291") ? "" : (stryCov_9fa48("14291"), 'Production')}</span>
              </div>
              <div>
                <span className="font-medium">Analytics Initialized:</span> 
                <span className={isInitialized ? stryMutAct_9fa48("14292") ? "" : (stryCov_9fa48("14292"), 'text-green-600 ml-2') : stryMutAct_9fa48("14293") ? "" : (stryCov_9fa48("14293"), 'text-yellow-600 ml-2')}>
                  {isInitialized ? stryMutAct_9fa48("14294") ? "" : (stryCov_9fa48("14294"), '✓ Ready') : stryMutAct_9fa48("14295") ? "" : (stryCov_9fa48("14295"), '⏳ Initializing...')}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">📝 Instructions</h2>
            <p className="text-yellow-800 mb-2">
              1. Click the buttons below to send test events to PostHog
            </p>
            <p className="text-yellow-800 mb-2">
              2. Go to your PostHog dashboard: <a href="https://eu.i.posthog.com" target="_blank" rel="noopener noreferrer" className="underline">https://eu.i.posthog.com</a>
            </p>
            <p className="text-yellow-800 mb-2">
              3. Navigate to "Live events" or "Activity" tab to see events in real-time
            </p>
            <p className="text-yellow-800">
              4. Look for events starting with "test_" to identify your test events
            </p>
          </div>

          {/* User Identification */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Identification</h2>
            <p className="text-gray-600 mb-4">Identify yourself to PostHog for better event tracking:</p>
            <button onClick={identifyTestUser} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              🔍 Identify Test User
            </button>
          </div>

          {/* Test Events */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Test Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testEvents.map(stryMutAct_9fa48("14296") ? () => undefined : (stryCov_9fa48("14296"), (event, index) => <div key={event.name} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-1">{event.display}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <button onClick={stryMutAct_9fa48("14297") ? () => undefined : (stryCov_9fa48("14297"), () => addEvent(event.name, event.display))} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium">
                    Send Event #{stryMutAct_9fa48("14298") ? index - 1 : (stryCov_9fa48("14298"), index + 1)}
                  </button>
                </div>))}
            </div>
          </div>

          {/* Special Test: Batch Events */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch Test</h2>
            <button onClick={() => {
              if (stryMutAct_9fa48("14299")) {
                {}
              } else {
                stryCov_9fa48("14299");
                // Send multiple events in succession
                const batchId = Date.now();
                for (let i = 1; stryMutAct_9fa48("14302") ? i > 5 : stryMutAct_9fa48("14301") ? i < 5 : stryMutAct_9fa48("14300") ? false : (stryCov_9fa48("14300", "14301", "14302"), i <= 5); stryMutAct_9fa48("14303") ? i-- : (stryCov_9fa48("14303"), i++)) {
                  if (stryMutAct_9fa48("14304")) {
                    {}
                  } else {
                    stryCov_9fa48("14304");
                    setTimeout(() => {
                      if (stryMutAct_9fa48("14305")) {
                        {}
                      } else {
                        stryCov_9fa48("14305");
                        addEvent(stryMutAct_9fa48("14306") ? `` : (stryCov_9fa48("14306"), `batch_event_${i}`), stryMutAct_9fa48("14307") ? `` : (stryCov_9fa48("14307"), `Batch Event ${i}/5`));
                      }
                    }, stryMutAct_9fa48("14308") ? i / 200 : (stryCov_9fa48("14308"), i * 200));
                  }
                }
              }
            }} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              🚀 Send Batch of 5 Events
            </button>
          </div>

          {/* Event Log */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Event Log</h2>
              <button onClick={clearEvents} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm">
                Clear Log
              </button>
            </div>
            
            {(stryMutAct_9fa48("14311") ? events.length !== 0 : stryMutAct_9fa48("14310") ? false : stryMutAct_9fa48("14309") ? true : (stryCov_9fa48("14309", "14310", "14311"), events.length === 0)) ? <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                No events sent yet. Click a button above to send test events.
              </div> : <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {events.map(stryMutAct_9fa48("14312") ? () => undefined : (stryCov_9fa48("14312"), event => <div key={event.id} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div>
                        <span className="font-medium text-gray-900">{event.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({event.timestamp})</span>
                      </div>
                      <span className={stryMutAct_9fa48("14313") ? `` : (stryCov_9fa48("14313"), `px-2 py-1 rounded text-xs font-medium ${(stryMutAct_9fa48("14316") ? event.status !== 'sent' : stryMutAct_9fa48("14315") ? false : stryMutAct_9fa48("14314") ? true : (stryCov_9fa48("14314", "14315", "14316"), event.status === (stryMutAct_9fa48("14317") ? "" : (stryCov_9fa48("14317"), 'sent')))) ? stryMutAct_9fa48("14318") ? "" : (stryCov_9fa48("14318"), 'bg-green-100 text-green-800') : stryMutAct_9fa48("14319") ? "" : (stryCov_9fa48("14319"), 'bg-red-100 text-red-800')}`)}>
                        {(stryMutAct_9fa48("14322") ? event.status !== 'sent' : stryMutAct_9fa48("14321") ? false : stryMutAct_9fa48("14320") ? true : (stryCov_9fa48("14320", "14321", "14322"), event.status === (stryMutAct_9fa48("14323") ? "" : (stryCov_9fa48("14323"), 'sent')))) ? stryMutAct_9fa48("14324") ? "" : (stryCov_9fa48("14324"), '✓ Sent') : stryMutAct_9fa48("14325") ? "" : (stryCov_9fa48("14325"), '✗ Error')}
                      </span>
                    </div>))}
                </div>
              </div>}
          </div>

          {/* Dashboard Link */}
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <h2 className="text-lg font-semibold text-green-900 mb-2">🎯 Check Your PostHog Dashboard</h2>
            <p className="text-green-800 mb-3">
              After sending events above, check your PostHog dashboard to see them appear in real-time:
            </p>
            <a href="https://eu.i.posthog.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
              🔗 Open PostHog Dashboard
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>;
  }
}