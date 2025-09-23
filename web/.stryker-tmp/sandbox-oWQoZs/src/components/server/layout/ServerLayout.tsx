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
import { type ReactNode } from 'react';
import ServerHeader from './ServerHeader';
import ServerFooter from './ServerFooter';
interface ServerLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

/**
 * Server Layout Component
 *
 * Main layout wrapper that provides consistent structure across all pages.
 * This component is rendered on the server for optimal performance.
 *
 * Features:
 * - Server-side rendering for faster initial load
 * - Consistent header/footer structure
 * - Flexible content area
 * - SEO-optimised structure
 *
 * @param children - Page content
 * @param showHeader - Whether to show the header (default: true)
 * @param showFooter - Whether to show the footer (default: true)
 * @param className - Additional CSS classes
 */
export default function ServerLayout({
  children,
  showHeader = stryMutAct_9fa48("5553") ? false : (stryCov_9fa48("5553"), true),
  showFooter = stryMutAct_9fa48("5554") ? false : (stryCov_9fa48("5554"), true),
  className = stryMutAct_9fa48("5555") ? "Stryker was here!" : (stryCov_9fa48("5555"), '')
}: ServerLayoutProps) {
  if (stryMutAct_9fa48("5556")) {
    {}
  } else {
    stryCov_9fa48("5556");
    return <div className={stryMutAct_9fa48("5557") ? `` : (stryCov_9fa48("5557"), `min-h-screen flex flex-col ${className}`)}>
      {stryMutAct_9fa48("5560") ? showHeader || <ServerHeader /> : stryMutAct_9fa48("5559") ? false : stryMutAct_9fa48("5558") ? true : (stryCov_9fa48("5558", "5559", "5560"), showHeader && <ServerHeader />)}

      <main className="flex-1 w-full">
        {children}
      </main>

      {stryMutAct_9fa48("5563") ? showFooter || <ServerFooter /> : stryMutAct_9fa48("5562") ? false : stryMutAct_9fa48("5561") ? true : (stryCov_9fa48("5561", "5562", "5563"), showFooter && <ServerFooter />)}
    </div>;
  }
}