/**
 * Breadcrumb Navigation - Server/Client Component
 *
 * Provides navigation breadcrumbs for better user orientation.
 * Can be used as both server and client component.
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
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
interface BreadcrumbItem {
  label: string;
  href: string;
}
interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
}
export function BreadcrumbNavigation({
  items
}: BreadcrumbNavigationProps) {
  if (stryMutAct_9fa48("5658")) {
    {}
  } else {
    stryCov_9fa48("5658");
    return <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map(stryMutAct_9fa48("5659") ? () => undefined : (stryCov_9fa48("5659"), (item, index) => <React.Fragment key={index}>
          {stryMutAct_9fa48("5662") ? index > 0 || <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" /> : stryMutAct_9fa48("5661") ? false : stryMutAct_9fa48("5660") ? true : (stryCov_9fa48("5660", "5661", "5662"), (stryMutAct_9fa48("5665") ? index <= 0 : stryMutAct_9fa48("5664") ? index >= 0 : stryMutAct_9fa48("5663") ? true : (stryCov_9fa48("5663", "5664", "5665"), index > 0)) && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />)}

          {(stryMutAct_9fa48("5668") ? index !== items.length - 1 : stryMutAct_9fa48("5667") ? false : stryMutAct_9fa48("5666") ? true : (stryCov_9fa48("5666", "5667", "5668"), index === (stryMutAct_9fa48("5669") ? items.length + 1 : (stryCov_9fa48("5669"), items.length - 1)))) ?
        // Current page (not linked)
        <span className="text-gray-900 font-medium truncate">
              {item.label}
            </span> :
        // Linked breadcrumb item
        <Link href={item.href} className="text-gray-600 hover:text-primary-600 transition-colors truncate">
              {item.label}
            </Link>}
        </React.Fragment>))}
    </nav>;
  }
}