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
export default function TestPage() {
  if (stryMutAct_9fa48("14414")) {
    {}
  } else {
    stryCov_9fa48("14414");
    return <div style={stryMutAct_9fa48("14415") ? {} : (stryCov_9fa48("14415"), {
      padding: stryMutAct_9fa48("14416") ? "" : (stryCov_9fa48("14416"), '20px'),
      fontFamily: stryMutAct_9fa48("14417") ? "" : (stryCov_9fa48("14417"), 'Arial, sans-serif')
    })}>
      <h1>aclue Web App - Test Page</h1>
      <p>✅ Web app is running successfully!</p>
      <p>Available pages:</p>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/discover">Discover (Swipe Interface)</a></li>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
      </ul>
      <div style={stryMutAct_9fa48("14418") ? {} : (stryCov_9fa48("14418"), {
        marginTop: stryMutAct_9fa48("14419") ? "" : (stryCov_9fa48("14419"), '20px'),
        padding: stryMutAct_9fa48("14420") ? "" : (stryCov_9fa48("14420"), '10px'),
        backgroundColor: stryMutAct_9fa48("14421") ? "" : (stryCov_9fa48("14421"), '#f0f8ff'),
        border: stryMutAct_9fa48("14422") ? "" : (stryCov_9fa48("14422"), '1px solid #ccc')
      })}>
        <h3>Backend API Status</h3>
        <p>API URL: http://localhost:8000</p>
        <p>Backend running: ✅ (confirmed via E2E tests)</p>
      </div>
    </div>;
  }
}