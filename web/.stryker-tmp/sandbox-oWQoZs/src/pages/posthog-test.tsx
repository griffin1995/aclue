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
import { analytics } from '@/lib/analytics';
import { config } from '@/config';
export default function PostHogTest() {
  if (stryMutAct_9fa48("14326")) {
    {}
  } else {
    stryCov_9fa48("14326");
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(stryMutAct_9fa48("14327") ? "" : (stryCov_9fa48("14327"), 'loading'));
    const [logs, setLogs] = useState<string[]>(stryMutAct_9fa48("14328") ? ["Stryker was here"] : (stryCov_9fa48("14328"), []));
    const addLog = (message: string) => {
      if (stryMutAct_9fa48("14329")) {
        {}
      } else {
        stryCov_9fa48("14329");
        setLogs(stryMutAct_9fa48("14330") ? () => undefined : (stryCov_9fa48("14330"), prev => stryMutAct_9fa48("14331") ? [] : (stryCov_9fa48("14331"), [...prev, stryMutAct_9fa48("14332") ? `` : (stryCov_9fa48("14332"), `${new Date().toISOString()}: ${message}`)])));
      }
    };
    useEffect(() => {
      if (stryMutAct_9fa48("14333")) {
        {}
      } else {
        stryCov_9fa48("14333");
        const testPostHog = async () => {
          if (stryMutAct_9fa48("14334")) {
            {}
          } else {
            stryCov_9fa48("14334");
            try {
              if (stryMutAct_9fa48("14335")) {
                {}
              } else {
                stryCov_9fa48("14335");
                addLog(stryMutAct_9fa48("14336") ? "" : (stryCov_9fa48("14336"), 'Starting PostHog test...'));

                // Check environment variables
                addLog(stryMutAct_9fa48("14337") ? `` : (stryCov_9fa48("14337"), `PostHog Key: ${config.posthogKey ? stryMutAct_9fa48("14338") ? "" : (stryCov_9fa48("14338"), 'Present') : stryMutAct_9fa48("14339") ? "" : (stryCov_9fa48("14339"), 'Missing')}`));
                addLog(stryMutAct_9fa48("14340") ? `` : (stryCov_9fa48("14340"), `PostHog Host: ${stryMutAct_9fa48("14343") ? config.posthogHost && 'Using default' : stryMutAct_9fa48("14342") ? false : stryMutAct_9fa48("14341") ? true : (stryCov_9fa48("14341", "14342", "14343"), config.posthogHost || (stryMutAct_9fa48("14344") ? "" : (stryCov_9fa48("14344"), 'Using default')))}`));

                // Initialize analytics
                analytics.init();
                addLog(stryMutAct_9fa48("14345") ? "" : (stryCov_9fa48("14345"), 'Analytics initialized'));

                // Test tracking
                analytics.track(stryMutAct_9fa48("14346") ? "" : (stryCov_9fa48("14346"), 'test_event'), stryMutAct_9fa48("14347") ? {} : (stryCov_9fa48("14347"), {
                  test_property: stryMutAct_9fa48("14348") ? "" : (stryCov_9fa48("14348"), 'test_value'),
                  timestamp: new Date().toISOString()
                }));
                addLog(stryMutAct_9fa48("14349") ? "" : (stryCov_9fa48("14349"), 'Test event tracked'));

                // Test identification
                analytics.identify(stryMutAct_9fa48("14350") ? "" : (stryCov_9fa48("14350"), 'test_user_123'), stryMutAct_9fa48("14351") ? {} : (stryCov_9fa48("14351"), {
                  email: stryMutAct_9fa48("14352") ? "" : (stryCov_9fa48("14352"), 'test@example.com'),
                  name: stryMutAct_9fa48("14353") ? "" : (stryCov_9fa48("14353"), 'Test User')
                }));
                addLog(stryMutAct_9fa48("14354") ? "" : (stryCov_9fa48("14354"), 'User identified'));
                setStatus(stryMutAct_9fa48("14355") ? "" : (stryCov_9fa48("14355"), 'success'));
                addLog(stryMutAct_9fa48("14356") ? "" : (stryCov_9fa48("14356"), 'PostHog test completed successfully!'));
              }
            } catch (error) {
              if (stryMutAct_9fa48("14357")) {
                {}
              } else {
                stryCov_9fa48("14357");
                addLog(stryMutAct_9fa48("14358") ? `` : (stryCov_9fa48("14358"), `Error: ${error instanceof Error ? error.message : stryMutAct_9fa48("14359") ? "" : (stryCov_9fa48("14359"), 'Unknown error')}`));
                setStatus(stryMutAct_9fa48("14360") ? "" : (stryCov_9fa48("14360"), 'error'));
              }
            }
          }
        };
        testPostHog();
      }
    }, stryMutAct_9fa48("14361") ? ["Stryker was here"] : (stryCov_9fa48("14361"), []));
    return <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PostHog Configuration Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Status</h2>
          <div className={stryMutAct_9fa48("14362") ? `` : (stryCov_9fa48("14362"), `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${(stryMutAct_9fa48("14365") ? status !== 'loading' : stryMutAct_9fa48("14364") ? false : stryMutAct_9fa48("14363") ? true : (stryCov_9fa48("14363", "14364", "14365"), status === (stryMutAct_9fa48("14366") ? "" : (stryCov_9fa48("14366"), 'loading')))) ? stryMutAct_9fa48("14367") ? "" : (stryCov_9fa48("14367"), 'bg-yellow-100 text-yellow-800') : (stryMutAct_9fa48("14370") ? status !== 'success' : stryMutAct_9fa48("14369") ? false : stryMutAct_9fa48("14368") ? true : (stryCov_9fa48("14368", "14369", "14370"), status === (stryMutAct_9fa48("14371") ? "" : (stryCov_9fa48("14371"), 'success')))) ? stryMutAct_9fa48("14372") ? "" : (stryCov_9fa48("14372"), 'bg-green-100 text-green-800') : stryMutAct_9fa48("14373") ? "" : (stryCov_9fa48("14373"), 'bg-red-100 text-red-800')}`)}>
            {(stryMutAct_9fa48("14376") ? status !== 'loading' : stryMutAct_9fa48("14375") ? false : stryMutAct_9fa48("14374") ? true : (stryCov_9fa48("14374", "14375", "14376"), status === (stryMutAct_9fa48("14377") ? "" : (stryCov_9fa48("14377"), 'loading')))) ? stryMutAct_9fa48("14378") ? "" : (stryCov_9fa48("14378"), 'Testing...') : (stryMutAct_9fa48("14381") ? status !== 'success' : stryMutAct_9fa48("14380") ? false : stryMutAct_9fa48("14379") ? true : (stryCov_9fa48("14379", "14380", "14381"), status === (stryMutAct_9fa48("14382") ? "" : (stryCov_9fa48("14382"), 'success')))) ? stryMutAct_9fa48("14383") ? "" : (stryCov_9fa48("14383"), 'Configuration OK') : stryMutAct_9fa48("14384") ? "" : (stryCov_9fa48("14384"), 'Configuration Error')}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
          <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {logs.join(stryMutAct_9fa48("14385") ? "" : (stryCov_9fa48("14385"), '\n'))}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Manual Test</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to manually test PostHog tracking:
          </p>
          <button onClick={() => {
            if (stryMutAct_9fa48("14386")) {
              {}
            } else {
              stryCov_9fa48("14386");
              analytics.track(stryMutAct_9fa48("14387") ? "" : (stryCov_9fa48("14387"), 'manual_test_click'), stryMutAct_9fa48("14388") ? {} : (stryCov_9fa48("14388"), {
                button: stryMutAct_9fa48("14389") ? "" : (stryCov_9fa48("14389"), 'Manual Test Button'),
                timestamp: new Date().toISOString()
              }));
              addLog(stryMutAct_9fa48("14390") ? "" : (stryCov_9fa48("14390"), 'Manual test event tracked'));
            }
          }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Send Test Event
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div><strong>NEXT_PUBLIC_POSTHOG_KEY:</strong> {config.posthogKey ? stryMutAct_9fa48("14391") ? "" : (stryCov_9fa48("14391"), '✓ Set') : stryMutAct_9fa48("14392") ? "" : (stryCov_9fa48("14392"), '✗ Missing')}</div>
            <div><strong>NEXT_PUBLIC_POSTHOG_HOST:</strong> {stryMutAct_9fa48("14395") ? config.posthogHost && 'Using default' : stryMutAct_9fa48("14394") ? false : stryMutAct_9fa48("14393") ? true : (stryCov_9fa48("14393", "14394", "14395"), config.posthogHost || (stryMutAct_9fa48("14396") ? "" : (stryCov_9fa48("14396"), 'Using default')))}</div>
            <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
            <div><strong>Development Mode:</strong> {config.isDevelopment ? stryMutAct_9fa48("14397") ? "" : (stryCov_9fa48("14397"), 'Yes') : stryMutAct_9fa48("14398") ? "" : (stryCov_9fa48("14398"), 'No')}</div>
            <div><strong>Production Mode:</strong> {config.isProduction ? stryMutAct_9fa48("14399") ? "" : (stryCov_9fa48("14399"), 'Yes') : stryMutAct_9fa48("14400") ? "" : (stryCov_9fa48("14400"), 'No')}</div>
          </div>
        </div>
      </div>
    </div>;
  }
}