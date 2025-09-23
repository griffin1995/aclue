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
import React from 'react';
interface SimpleSwipeInterfaceProps {
  className?: string;
}
export const SimpleSwipeInterface: React.FC<SimpleSwipeInterfaceProps> = ({
  className = stryMutAct_9fa48("6567") ? "Stryker was here!" : (stryCov_9fa48("6567"), '')
}) => {
  if (stryMutAct_9fa48("6568")) {
    {}
  } else {
    stryCov_9fa48("6568");
    return <div className={stryMutAct_9fa48("6569") ? `` : (stryCov_9fa48("6569"), `relative w-full h-full flex flex-col ${className}`)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Simple Swipe Test</h2>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="absolute inset-4">
          <div className="w-full h-96 bg-white rounded-xl shadow-lg p-4 border">
            <h3 className="text-lg font-bold">Test Product</h3>
            <p className="text-gray-600">This is a test product to verify the interface works</p>
            <p className="text-primary-600 font-bold">£25.00</p>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-red-500 text-white rounded">
                Pass
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded">
                Like
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
};
export default SimpleSwipeInterface;