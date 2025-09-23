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
import Link from 'next/link';
import Image from 'next/image';

/**
 * Server Footer Component
 *
 * Site footer rendered on the server for optimal performance.
 * Provides company information, legal links, and secondary navigation.
 *
 * Features:
 * - Server-side rendering for SEO
 * - Comprehensive site links
 * - Company branding
 * - Legal compliance links
 */
export default function ServerFooter() {
  if (stryMutAct_9fa48("5503")) {
    {}
  } else {
    stryCov_9fa48("5503");
    const currentYear = new Date().getFullYear();
    const footerSections = stryMutAct_9fa48("5504") ? [] : (stryCov_9fa48("5504"), [stryMutAct_9fa48("5505") ? {} : (stryCov_9fa48("5505"), {
      title: stryMutAct_9fa48("5506") ? "" : (stryCov_9fa48("5506"), 'Product'),
      links: stryMutAct_9fa48("5507") ? [] : (stryCov_9fa48("5507"), [stryMutAct_9fa48("5508") ? {} : (stryCov_9fa48("5508"), {
        name: stryMutAct_9fa48("5509") ? "" : (stryCov_9fa48("5509"), 'How It Works'),
        href: stryMutAct_9fa48("5510") ? "" : (stryCov_9fa48("5510"), '/about')
      }), stryMutAct_9fa48("5511") ? {} : (stryCov_9fa48("5511"), {
        name: stryMutAct_9fa48("5512") ? "" : (stryCov_9fa48("5512"), 'Discover Gifts'),
        href: stryMutAct_9fa48("5513") ? "" : (stryCov_9fa48("5513"), '/discover')
      }), stryMutAct_9fa48("5514") ? {} : (stryCov_9fa48("5514"), {
        name: stryMutAct_9fa48("5515") ? "" : (stryCov_9fa48("5515"), 'Pricing'),
        href: stryMutAct_9fa48("5516") ? "" : (stryCov_9fa48("5516"), '/pricing')
      }), stryMutAct_9fa48("5517") ? {} : (stryCov_9fa48("5517"), {
        name: stryMutAct_9fa48("5518") ? "" : (stryCov_9fa48("5518"), 'Help Centre'),
        href: stryMutAct_9fa48("5519") ? "" : (stryCov_9fa48("5519"), '/help')
      })])
    }), stryMutAct_9fa48("5520") ? {} : (stryCov_9fa48("5520"), {
      title: stryMutAct_9fa48("5521") ? "" : (stryCov_9fa48("5521"), 'Company'),
      links: stryMutAct_9fa48("5522") ? [] : (stryCov_9fa48("5522"), [stryMutAct_9fa48("5523") ? {} : (stryCov_9fa48("5523"), {
        name: stryMutAct_9fa48("5524") ? "" : (stryCov_9fa48("5524"), 'About Us'),
        href: stryMutAct_9fa48("5525") ? "" : (stryCov_9fa48("5525"), '/about')
      }), stryMutAct_9fa48("5526") ? {} : (stryCov_9fa48("5526"), {
        name: stryMutAct_9fa48("5527") ? "" : (stryCov_9fa48("5527"), 'Careers'),
        href: stryMutAct_9fa48("5528") ? "" : (stryCov_9fa48("5528"), '/careers')
      }), stryMutAct_9fa48("5529") ? {} : (stryCov_9fa48("5529"), {
        name: stryMutAct_9fa48("5530") ? "" : (stryCov_9fa48("5530"), 'Press Kit'),
        href: stryMutAct_9fa48("5531") ? "" : (stryCov_9fa48("5531"), '/press-kit')
      }), stryMutAct_9fa48("5532") ? {} : (stryCov_9fa48("5532"), {
        name: stryMutAct_9fa48("5533") ? "" : (stryCov_9fa48("5533"), 'Contact'),
        href: stryMutAct_9fa48("5534") ? "" : (stryCov_9fa48("5534"), '/contact')
      })])
    }), stryMutAct_9fa48("5535") ? {} : (stryCov_9fa48("5535"), {
      title: stryMutAct_9fa48("5536") ? "" : (stryCov_9fa48("5536"), 'Legal'),
      links: stryMutAct_9fa48("5537") ? [] : (stryCov_9fa48("5537"), [stryMutAct_9fa48("5538") ? {} : (stryCov_9fa48("5538"), {
        name: stryMutAct_9fa48("5539") ? "" : (stryCov_9fa48("5539"), 'Privacy Policy'),
        href: stryMutAct_9fa48("5540") ? "" : (stryCov_9fa48("5540"), '/privacy')
      }), stryMutAct_9fa48("5541") ? {} : (stryCov_9fa48("5541"), {
        name: stryMutAct_9fa48("5542") ? "" : (stryCov_9fa48("5542"), 'Terms of Service'),
        href: stryMutAct_9fa48("5543") ? "" : (stryCov_9fa48("5543"), '/terms')
      }), stryMutAct_9fa48("5544") ? {} : (stryCov_9fa48("5544"), {
        name: stryMutAct_9fa48("5545") ? "" : (stryCov_9fa48("5545"), 'Cookie Policy'),
        href: stryMutAct_9fa48("5546") ? "" : (stryCov_9fa48("5546"), '/cookie-policy')
      }), stryMutAct_9fa48("5547") ? {} : (stryCov_9fa48("5547"), {
        name: stryMutAct_9fa48("5548") ? "" : (stryCov_9fa48("5548"), 'Data Protection'),
        href: stryMutAct_9fa48("5549") ? "" : (stryCov_9fa48("5549"), '/data-protection')
      })])
    })]);
    return <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image src="/aclue_text_clean.png" alt="aclue Logo" width={120} height={40} className="h-8 w-auto" />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI-powered gifting platform that helps you discover perfect gifts
              for every occasion and recipient.
            </p>
          </div>

          {/* Navigation Sections */}
          {footerSections.map(stryMutAct_9fa48("5550") ? () => undefined : (stryCov_9fa48("5550"), section => <div key={section.title}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(stryMutAct_9fa48("5551") ? () => undefined : (stryCov_9fa48("5551"), link => <li key={link.name}>
                    <Link href={link.href} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>))}
              </ul>
            </div>))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} aclue Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
              Terms
            </Link>
            <Link href="/accessibility" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>;
  }
}