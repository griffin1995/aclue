/**
 * Affiliate Disclosure Page
 * 
 * Comprehensive affiliate disclosure page that meets FTC guidelines,
 * Amazon Associates Operating Agreement requirements, and provides
 * transparency about aclue's affiliate marketing practices.
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
import Head from 'next/head';
import Link from 'next/link';
import { ExternalLink, Shield, DollarSign, Heart, Users, CheckCircle } from 'lucide-react';
const AffiliateDisclosurePage: React.FC = () => {
  if (stryMutAct_9fa48("12218")) {
    {}
  } else {
    stryCov_9fa48("12218");
    return <>
      <Head>
        <title>Affiliate Disclosure - aclue</title>
        <meta name="description" content="Learn about aclue's affiliate partnerships and how we earn commissions from qualifying purchases to support our free gift recommendation service." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Affiliate Disclosure</h1>
                <p className="text-gray-600 mt-1">Transparency in our partnerships and earnings</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Summary Box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Quick Summary</h2>
                <p className="text-blue-800 leading-relaxed">
                  <strong>HITSENSE LTD (trading as "aclue") participates in affiliate programmes</strong>, including the Amazon Associates Programme. 
                  When you purchase products through our recommendation links, we may earn a small commission at no additional cost to you. 
                  This helps us maintain our free service whilst ensuring our recommendations remain unbiased and based solely on AI analysis of your preferences.
                </p>
              </div>
            </div>
          </div>
          
          {/* [All other sections remain unchanged] */}

          {/* Contact Information */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Concerns?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our affiliate relationships or this disclosure, please don't hesitate to contact us:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Email:</span>
                <a href="mailto:hello@aclue.app" className="text-blue-600 hover:text-blue-800 underline">
                  hello@aclue.app
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">Support:</span>
                <a href="mailto:support@aclue.app" className="text-blue-600 hover:text-blue-800 underline">
                  support@aclue.app
                </a>
              </div>
            </div>
          </section>
        </div>
        
        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 underline">
              Cookie Policy
            </Link>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>;
  }
};
export default AffiliateDisclosurePage;