/**
 * Maintenance Mode Wrapper
 * 
 * This component handles maintenance mode logic at the component level
 * to prevent any content flashing by checking maintenance mode before rendering
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
import React, { type ReactNode } from 'react';
import { useRouter } from 'next/router';
import MaintenanceMode from '@/components/MaintenanceMode';
interface MaintenanceWrapperProps {
  children: ReactNode;
}
const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({
  children
}) => {
  if (stryMutAct_9fa48("2961")) {
    {}
  } else {
    stryCov_9fa48("2961");
    const router = useRouter();
    // Check maintenance mode from environment variable (now properly configured in vercel.json)
    const maintenanceMode = stryMutAct_9fa48("2964") ? process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== 'true' : stryMutAct_9fa48("2963") ? false : stryMutAct_9fa48("2962") ? true : (stryCov_9fa48("2962", "2963", "2964"), process.env.NEXT_PUBLIC_MAINTENANCE_MODE === (stryMutAct_9fa48("2965") ? "" : (stryCov_9fa48("2965"), 'true')));
    const currentPath = router.pathname;

    // Routes that are allowed even in maintenance mode
    const allowedInMaintenance = stryMutAct_9fa48("2966") ? [] : (stryCov_9fa48("2966"), [stryMutAct_9fa48("2967") ? "" : (stryCov_9fa48("2967"), '/maintenance'), stryMutAct_9fa48("2968") ? "" : (stryCov_9fa48("2968"), '/maintenance/index'), stryMutAct_9fa48("2969") ? "" : (stryCov_9fa48("2969"), '/landingpage'), // Allow alpha version access
    stryMutAct_9fa48("2970") ? "" : (stryCov_9fa48("2970"), '/api'), // Allow API routes
    stryMutAct_9fa48("2971") ? "" : (stryCov_9fa48("2971"), '/auth'), // Allow authentication routes for testing
    stryMutAct_9fa48("2972") ? "" : (stryCov_9fa48("2972"), '/dashboard'), // Allow dashboard routes for testing
    stryMutAct_9fa48("2973") ? "" : (stryCov_9fa48("2973"), '/profile') // Allow profile routes for testing
    ]);

    // Check if current path is allowed in maintenance mode
    const isAllowedPath = stryMutAct_9fa48("2974") ? allowedInMaintenance.every(path => currentPath.startsWith(path)) : (stryCov_9fa48("2974"), allowedInMaintenance.some(stryMutAct_9fa48("2975") ? () => undefined : (stryCov_9fa48("2975"), path => stryMutAct_9fa48("2976") ? currentPath.endsWith(path) : (stryCov_9fa48("2976"), currentPath.startsWith(path)))));

    // If maintenance mode is active and we're not on an allowed path
    if (stryMutAct_9fa48("2979") ? maintenanceMode || !isAllowedPath : stryMutAct_9fa48("2978") ? false : stryMutAct_9fa48("2977") ? true : (stryCov_9fa48("2977", "2978", "2979"), maintenanceMode && (stryMutAct_9fa48("2980") ? isAllowedPath : (stryCov_9fa48("2980"), !isAllowedPath)))) {
      if (stryMutAct_9fa48("2981")) {
        {}
      } else {
        stryCov_9fa48("2981");
        return <MaintenanceMode />;
      }
    }

    // Otherwise render the normal content
    return <>{children}</>;
  }
};
export default MaintenanceWrapper;