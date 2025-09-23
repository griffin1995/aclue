/**
 * Admin Maintenance Mode Toggle
 * 
 * This is a simple admin interface to toggle maintenance mode
 * for testing and production control.
 * 
 * NOTE: In production, this should be protected with proper authentication
 */
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
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Settings, ToggleLeft, ToggleRight, CheckCircle, AlertTriangle } from 'lucide-react';
const MaintenanceAdmin: React.FC = () => {
  if (stryMutAct_9fa48("12181")) {
    {}
  } else {
    stryCov_9fa48("12181");
    const [maintenanceMode, setMaintenanceMode] = useState<boolean>(stryMutAct_9fa48("12182") ? true : (stryCov_9fa48("12182"), false));
    const [loading, setLoading] = useState<boolean>(stryMutAct_9fa48("12183") ? false : (stryCov_9fa48("12183"), true));
    useEffect(() => {
      if (stryMutAct_9fa48("12184")) {
        {}
      } else {
        stryCov_9fa48("12184");
        // Get current maintenance mode status from environment variable
        const currentMode = stryMutAct_9fa48("12187") ? process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== 'true' : stryMutAct_9fa48("12186") ? false : stryMutAct_9fa48("12185") ? true : (stryCov_9fa48("12185", "12186", "12187"), process.env.NEXT_PUBLIC_MAINTENANCE_MODE === (stryMutAct_9fa48("12188") ? "" : (stryCov_9fa48("12188"), 'true')));
        setMaintenanceMode(currentMode);
        setLoading(stryMutAct_9fa48("12189") ? true : (stryCov_9fa48("12189"), false));
      }
    }, stryMutAct_9fa48("12190") ? ["Stryker was here"] : (stryCov_9fa48("12190"), []));
    const handleToggle = async () => {
      if (stryMutAct_9fa48("12191")) {
        {}
      } else {
        stryCov_9fa48("12191");
        // Note: This is a demo interface. In a real implementation,
        // you would make an API call to update the environment variable
        // or database setting, then restart the application.

        alert(stryMutAct_9fa48("12192") ? `` : (stryCov_9fa48("12192"), `To toggle maintenance mode:\n\n1. Update NEXT_PUBLIC_MAINTENANCE_MODE in .env.local\n2. Restart the development server\n\nCurrent value: ${maintenanceMode ? stryMutAct_9fa48("12193") ? "" : (stryCov_9fa48("12193"), 'true') : stryMutAct_9fa48("12194") ? "" : (stryCov_9fa48("12194"), 'false')}`));
      }
    };
    if (stryMutAct_9fa48("12196") ? false : stryMutAct_9fa48("12195") ? true : (stryCov_9fa48("12195", "12196"), loading)) {
      if (stryMutAct_9fa48("12197")) {
        {}
      } else {
        stryCov_9fa48("12197");
        return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>;
      }
    }
    return <>
      <Head>
        <title>Maintenance Mode Admin - aclue</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={stryMutAct_9fa48("12198") ? {} : (stryCov_9fa48("12198"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("12199") ? {} : (stryCov_9fa48("12199"), {
            opacity: 1,
            y: 0
          })} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full mb-4">
              <Settings className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Mode Control</h1>
            <p className="text-gray-600">Manage site maintenance status and user access</p>
          </motion.div>

          {/* Status Card */}
          <motion.div initial={stryMutAct_9fa48("12200") ? {} : (stryCov_9fa48("12200"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("12201") ? {} : (stryCov_9fa48("12201"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12202") ? {} : (stryCov_9fa48("12202"), {
            delay: 0.1
          })} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Status</h2>
                <p className="text-gray-600">
                  Environment variable: <code className="bg-gray-100 px-2 py-1 rounded text-sm">NEXT_PUBLIC_MAINTENANCE_MODE</code>
                </p>
              </div>
              <div className={stryMutAct_9fa48("12203") ? `` : (stryCov_9fa48("12203"), `flex items-center gap-3 px-4 py-2 rounded-full ${maintenanceMode ? stryMutAct_9fa48("12204") ? "" : (stryCov_9fa48("12204"), 'bg-orange-100 text-orange-800') : stryMutAct_9fa48("12205") ? "" : (stryCov_9fa48("12205"), 'bg-green-100 text-green-800')}`)}>
                {maintenanceMode ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                <span className="font-medium">
                  {maintenanceMode ? stryMutAct_9fa48("12206") ? "" : (stryCov_9fa48("12206"), 'Maintenance Active') : stryMutAct_9fa48("12207") ? "" : (stryCov_9fa48("12207"), 'Site Active')}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">When Enabled</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Users see maintenance page by default</li>
                  <li>• <code>/landingpage</code> allows alpha access</li>
                  <li>• API routes remain functional</li>
                  <li>• No content flashing or redirects</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">When Disabled</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Full site access for all users</li>
                  <li>• All routes work normally</li>
                  <li>• Maintenance page redirects to home</li>
                  <li>• Standard production behavior</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Control Panel */}
          <motion.div initial={stryMutAct_9fa48("12208") ? {} : (stryCov_9fa48("12208"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("12209") ? {} : (stryCov_9fa48("12209"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12210") ? {} : (stryCov_9fa48("12210"), {
            delay: 0.2
          })} className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Toggle Maintenance Mode</h2>
            
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900 mb-1">Maintenance Mode</div>
                <div className="text-sm text-gray-600">
                  {maintenanceMode ? stryMutAct_9fa48("12211") ? "" : (stryCov_9fa48("12211"), 'Site is in maintenance mode') : stryMutAct_9fa48("12212") ? "" : (stryCov_9fa48("12212"), 'Site is fully operational')}
                </div>
              </div>
              
              <button onClick={handleToggle} className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                {maintenanceMode ? <ToggleRight /> : <ToggleLeft />}
                <span>{maintenanceMode ? stryMutAct_9fa48("12213") ? "" : (stryCov_9fa48("12213"), 'Disable') : stryMutAct_9fa48("12214") ? "" : (stryCov_9fa48("12214"), 'Enable')}</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a demo interface. To actually toggle maintenance mode, 
                update the <code>NEXT_PUBLIC_MAINTENANCE_MODE</code> environment variable and restart the server.
              </p>
            </div>
          </motion.div>

          {/* Test Links */}
          <motion.div initial={stryMutAct_9fa48("12215") ? {} : (stryCov_9fa48("12215"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("12216") ? {} : (stryCov_9fa48("12216"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12217") ? {} : (stryCov_9fa48("12217"), {
            delay: 0.3
          })} className="mt-8 grid md:grid-cols-3 gap-4">
            <a href="/" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center">
              <div className="font-medium text-gray-900 mb-1">Home Page</div>
              <div className="text-sm text-gray-600">Test main route behavior</div>
            </a>
            <a href="/landingpage" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center">
              <div className="font-medium text-gray-900 mb-1">Landing Page</div>
              <div className="text-sm text-gray-600">Alpha version access</div>
            </a>
            <a href="/maintenance" target="_blank" rel="noopener noreferrer" className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center">
              <div className="font-medium text-gray-900 mb-1">Maintenance</div>
              <div className="text-sm text-gray-600">Maintenance page direct</div>
            </a>
          </motion.div>
        </div>
      </div>
    </>;
  }
};
export default MaintenanceAdmin;