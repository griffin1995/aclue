/**
 * Affiliate Disclosure Component
 * 
 * Industry-standard affiliate disclosure component that meets FTC guidelines
 * and Amazon Associates Operating Agreement requirements. Provides clear,
 * prominent disclosure of affiliate relationships.
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
import { AlertCircle, ExternalLink, Info } from 'lucide-react';
export interface AffiliateDisclosureProps {
  variant?: 'banner' | 'inline' | 'footer' | 'product' | 'modal';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  customText?: string;
  productName?: string;
  isDismissible?: boolean;
  onDismiss?: () => void;
}
const disclosureTexts = stryMutAct_9fa48("7241") ? {} : (stryCov_9fa48("7241"), {
  banner: stryMutAct_9fa48("7242") ? {} : (stryCov_9fa48("7242"), {
    title: stryMutAct_9fa48("7243") ? "" : (stryCov_9fa48("7243"), 'Amazon Associate Disclosure'),
    content: stryMutAct_9fa48("7244") ? "" : (stryCov_9fa48("7244"), 'As an Amazon Associate, aclue earns from qualifying purchases. This means we may receive a small commission when you click on our Amazon links and make a purchase, at no additional cost to you. This helps support our platform and allows us to continue providing free gift recommendations.')
  }),
  inline: stryMutAct_9fa48("7245") ? {} : (stryCov_9fa48("7245"), {
    title: stryMutAct_9fa48("7246") ? "Stryker was here!" : (stryCov_9fa48("7246"), ''),
    content: stryMutAct_9fa48("7247") ? "" : (stryCov_9fa48("7247"), 'As an Amazon Associate, we earn from qualifying purchases.')
  }),
  footer: stryMutAct_9fa48("7248") ? {} : (stryCov_9fa48("7248"), {
    title: stryMutAct_9fa48("7249") ? "Stryker was here!" : (stryCov_9fa48("7249"), ''),
    content: stryMutAct_9fa48("7250") ? "" : (stryCov_9fa48("7250"), 'aclue is a participant in the Amazon Associates Programme, an affiliate advertising programme designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.co.uk.')
  }),
  product: stryMutAct_9fa48("7251") ? {} : (stryCov_9fa48("7251"), {
    title: stryMutAct_9fa48("7252") ? "" : (stryCov_9fa48("7252"), 'Affiliate Link Notice'),
    content: stryMutAct_9fa48("7253") ? "" : (stryCov_9fa48("7253"), 'This product link is an affiliate link. If you purchase through this link, we may earn a small commission at no additional cost to you.')
  }),
  modal: stryMutAct_9fa48("7254") ? {} : (stryCov_9fa48("7254"), {
    title: stryMutAct_9fa48("7255") ? "" : (stryCov_9fa48("7255"), 'About Our Affiliate Links'),
    content: stryMutAct_9fa48("7256") ? "" : (stryCov_9fa48("7256"), 'aclue participates in the Amazon Associates Programme and other affiliate programs. When you click on product links from our recommendations and make a purchase, we may earn a commission. This commission comes at no additional cost to you and helps us maintain and improve our free service. Our recommendations are based on our AI analysis of your preferences and are not influenced by commission rates.')
  })
});
export const AffiliateDisclosure: React.FC<AffiliateDisclosureProps> = ({
  variant = stryMutAct_9fa48("7257") ? "" : (stryCov_9fa48("7257"), 'banner'),
  size = stryMutAct_9fa48("7258") ? "" : (stryCov_9fa48("7258"), 'md'),
  showIcon = stryMutAct_9fa48("7259") ? false : (stryCov_9fa48("7259"), true),
  className = stryMutAct_9fa48("7260") ? "Stryker was here!" : (stryCov_9fa48("7260"), ''),
  customText,
  productName,
  isDismissible = stryMutAct_9fa48("7261") ? true : (stryCov_9fa48("7261"), false),
  onDismiss
}) => {
  if (stryMutAct_9fa48("7262")) {
    {}
  } else {
    stryCov_9fa48("7262");
    const [isDismissed, setIsDismissed] = React.useState(stryMutAct_9fa48("7263") ? true : (stryCov_9fa48("7263"), false));
    React.useEffect(() => {
      if (stryMutAct_9fa48("7264")) {
        {}
      } else {
        stryCov_9fa48("7264");
        // Check if user has previously dismissed this disclosure
        if (stryMutAct_9fa48("7267") ? isDismissible || typeof window !== 'undefined' : stryMutAct_9fa48("7266") ? false : stryMutAct_9fa48("7265") ? true : (stryCov_9fa48("7265", "7266", "7267"), isDismissible && (stryMutAct_9fa48("7269") ? typeof window === 'undefined' : stryMutAct_9fa48("7268") ? true : (stryCov_9fa48("7268", "7269"), typeof window !== (stryMutAct_9fa48("7270") ? "" : (stryCov_9fa48("7270"), 'undefined')))))) {
          if (stryMutAct_9fa48("7271")) {
            {}
          } else {
            stryCov_9fa48("7271");
            const dismissed = localStorage.getItem(stryMutAct_9fa48("7272") ? "" : (stryCov_9fa48("7272"), 'aclue_affiliate_disclosure_dismissed'));
            if (stryMutAct_9fa48("7275") ? dismissed !== 'true' : stryMutAct_9fa48("7274") ? false : stryMutAct_9fa48("7273") ? true : (stryCov_9fa48("7273", "7274", "7275"), dismissed === (stryMutAct_9fa48("7276") ? "" : (stryCov_9fa48("7276"), 'true')))) {
              if (stryMutAct_9fa48("7277")) {
                {}
              } else {
                stryCov_9fa48("7277");
                setIsDismissed(stryMutAct_9fa48("7278") ? false : (stryCov_9fa48("7278"), true));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("7279") ? [] : (stryCov_9fa48("7279"), [isDismissible]));
    const handleDismiss = () => {
      if (stryMutAct_9fa48("7280")) {
        {}
      } else {
        stryCov_9fa48("7280");
        if (stryMutAct_9fa48("7282") ? false : stryMutAct_9fa48("7281") ? true : (stryCov_9fa48("7281", "7282"), isDismissible)) {
          if (stryMutAct_9fa48("7283")) {
            {}
          } else {
            stryCov_9fa48("7283");
            setIsDismissed(stryMutAct_9fa48("7284") ? false : (stryCov_9fa48("7284"), true));
            localStorage.setItem(stryMutAct_9fa48("7285") ? "" : (stryCov_9fa48("7285"), 'aclue_affiliate_disclosure_dismissed'), stryMutAct_9fa48("7286") ? "" : (stryCov_9fa48("7286"), 'true'));
            stryMutAct_9fa48("7287") ? onDismiss() : (stryCov_9fa48("7287"), onDismiss?.());
          }
        }
      }
    };
    if (stryMutAct_9fa48("7289") ? false : stryMutAct_9fa48("7288") ? true : (stryCov_9fa48("7288", "7289"), isDismissed)) {
      if (stryMutAct_9fa48("7290")) {
        {}
      } else {
        stryCov_9fa48("7290");
        return null;
      }
    }
    const disclosure = disclosureTexts[variant];
    const text = stryMutAct_9fa48("7293") ? customText && disclosure.content : stryMutAct_9fa48("7292") ? false : stryMutAct_9fa48("7291") ? true : (stryCov_9fa48("7291", "7292", "7293"), customText || disclosure.content);
    const title = disclosure.title;

    // Replace placeholder text if product name is provided
    const finalText = productName ? text.replace(/this product/gi, productName) : text;
    const baseClasses = stryMutAct_9fa48("7294") ? "" : (stryCov_9fa48("7294"), 'affiliate-disclosure');
    const sizeClasses = stryMutAct_9fa48("7295") ? {} : (stryCov_9fa48("7295"), {
      sm: stryMutAct_9fa48("7296") ? "" : (stryCov_9fa48("7296"), 'text-xs p-2'),
      md: stryMutAct_9fa48("7297") ? "" : (stryCov_9fa48("7297"), 'text-sm p-3'),
      lg: stryMutAct_9fa48("7298") ? "" : (stryCov_9fa48("7298"), 'text-base p-4')
    });
    const variantClasses = stryMutAct_9fa48("7299") ? {} : (stryCov_9fa48("7299"), {
      banner: stryMutAct_9fa48("7300") ? "" : (stryCov_9fa48("7300"), 'bg-blue-50 border-l-4 border-blue-400 rounded-r-lg'),
      inline: stryMutAct_9fa48("7301") ? "" : (stryCov_9fa48("7301"), 'bg-gray-50 rounded-md border border-gray-200'),
      footer: stryMutAct_9fa48("7302") ? "" : (stryCov_9fa48("7302"), 'bg-transparent border-t border-gray-200 pt-4'),
      product: stryMutAct_9fa48("7303") ? "" : (stryCov_9fa48("7303"), 'bg-yellow-50 border border-yellow-200 rounded-lg'),
      modal: stryMutAct_9fa48("7304") ? "" : (stryCov_9fa48("7304"), 'bg-white rounded-lg shadow-lg border border-gray-200')
    });
    const iconMap = stryMutAct_9fa48("7305") ? {} : (stryCov_9fa48("7305"), {
      banner: AlertCircle,
      inline: Info,
      footer: Info,
      product: AlertCircle,
      modal: Info
    });
    const Icon = iconMap[variant];
    const combinedClasses = stryMutAct_9fa48("7306") ? `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  ` : (stryCov_9fa48("7306"), (stryMutAct_9fa48("7307") ? `` : (stryCov_9fa48("7307"), `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `)).trim());
    if (stryMutAct_9fa48("7310") ? variant !== 'inline' : stryMutAct_9fa48("7309") ? false : stryMutAct_9fa48("7308") ? true : (stryCov_9fa48("7308", "7309", "7310"), variant === (stryMutAct_9fa48("7311") ? "" : (stryCov_9fa48("7311"), 'inline')))) {
      if (stryMutAct_9fa48("7312")) {
        {}
      } else {
        stryCov_9fa48("7312");
        return <div className={combinedClasses}>
        <div className="flex items-start gap-2">
          {stryMutAct_9fa48("7315") ? showIcon || <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" /> : stryMutAct_9fa48("7314") ? false : stryMutAct_9fa48("7313") ? true : (stryCov_9fa48("7313", "7314", "7315"), showIcon && <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />)}
          <span className="text-gray-700 text-xs italic">
            {finalText}
            <Link href="/affiliate-disclosure" className="ml-1 text-blue-600 hover:text-blue-800 underline">
              Learn more
            </Link>
          </span>
        </div>
      </div>;
      }
    }
    if (stryMutAct_9fa48("7318") ? variant !== 'footer' : stryMutAct_9fa48("7317") ? false : stryMutAct_9fa48("7316") ? true : (stryCov_9fa48("7316", "7317", "7318"), variant === (stryMutAct_9fa48("7319") ? "" : (stryCov_9fa48("7319"), 'footer')))) {
      if (stryMutAct_9fa48("7320")) {
        {}
      } else {
        stryCov_9fa48("7320");
        return <div className={combinedClasses}>
        <div className="text-center text-gray-600">
          <p className="text-sm">
            {finalText}
          </p>
          <div className="mt-2 flex justify-center items-center gap-4 text-xs">
            <Link href="/affiliate-disclosure" className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
              Full Disclosure <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>;
      }
    }
    return <div className={combinedClasses}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {stryMutAct_9fa48("7323") ? showIcon || <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" /> : stryMutAct_9fa48("7322") ? false : stryMutAct_9fa48("7321") ? true : (stryCov_9fa48("7321", "7322", "7323"), showIcon && <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />)}
          <div className="flex-1">
            {stryMutAct_9fa48("7326") ? title || <h4 className="font-semibold text-gray-900 mb-1">{title}</h4> : stryMutAct_9fa48("7325") ? false : stryMutAct_9fa48("7324") ? true : (stryCov_9fa48("7324", "7325", "7326"), title && <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>)}
            <p className="text-gray-700 leading-relaxed">
              {finalText}
            </p>
            <div className="mt-2">
              <Link href="/affiliate-disclosure" className="text-blue-600 hover:text-blue-800 underline text-sm flex items-center gap-1">
                Read our full affiliate disclosure <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
        
        {stryMutAct_9fa48("7329") ? isDismissible || <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" aria-label="Dismiss disclosure">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button> : stryMutAct_9fa48("7328") ? false : stryMutAct_9fa48("7327") ? true : (stryCov_9fa48("7327", "7328", "7329"), isDismissible && <button onClick={handleDismiss} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0" aria-label="Dismiss disclosure">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>)}
      </div>
    </div>;
  }
};
export default AffiliateDisclosure;