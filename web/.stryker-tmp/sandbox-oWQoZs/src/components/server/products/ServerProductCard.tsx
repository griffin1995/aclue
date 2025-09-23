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
import Image from 'next/image';
import Link from 'next/link';
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  category: string;
  rating?: number;
  affiliate_url?: string;
}
interface ServerProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

/**
 * Server Product Card Component
 *
 * Product card rendered on the server for optimal performance.
 * Displays product information with SEO optimisation.
 *
 * Features:
 * - Server-side rendering for SEO
 * - Optimised image loading
 * - Price formatting
 * - Structured data support
 *
 * @param product - Product data
 * @param priority - Whether to prioritise image loading
 * @param className - Additional CSS classes
 */
export default function ServerProductCard({
  product,
  priority = stryMutAct_9fa48("5579") ? true : (stryCov_9fa48("5579"), false),
  className = stryMutAct_9fa48("5580") ? "Stryker was here!" : (stryCov_9fa48("5580"), '')
}: ServerProductCardProps) {
  if (stryMutAct_9fa48("5581")) {
    {}
  } else {
    stryCov_9fa48("5581");
    const formatPrice = (price: number, currency: string) => {
      if (stryMutAct_9fa48("5582")) {
        {}
      } else {
        stryCov_9fa48("5582");
        return new Intl.NumberFormat(stryMutAct_9fa48("5583") ? "" : (stryCov_9fa48("5583"), 'en-GB'), stryMutAct_9fa48("5584") ? {} : (stryCov_9fa48("5584"), {
          style: stryMutAct_9fa48("5585") ? "" : (stryCov_9fa48("5585"), 'currency'),
          currency: stryMutAct_9fa48("5586") ? currency.toLowerCase() : (stryCov_9fa48("5586"), currency.toUpperCase())
        })).format(price);
      }
    };
    const renderStars = (rating?: number) => {
      if (stryMutAct_9fa48("5587")) {
        {}
      } else {
        stryCov_9fa48("5587");
        if (stryMutAct_9fa48("5590") ? false : stryMutAct_9fa48("5589") ? true : stryMutAct_9fa48("5588") ? rating : (stryCov_9fa48("5588", "5589", "5590"), !rating)) return null;
        const stars = stryMutAct_9fa48("5591") ? ["Stryker was here"] : (stryCov_9fa48("5591"), []);
        const fullStars = Math.floor(rating);
        const hasHalfStar = stryMutAct_9fa48("5594") ? rating % 1 === 0 : stryMutAct_9fa48("5593") ? false : stryMutAct_9fa48("5592") ? true : (stryCov_9fa48("5592", "5593", "5594"), (stryMutAct_9fa48("5595") ? rating * 1 : (stryCov_9fa48("5595"), rating % 1)) !== 0);
        for (let i = 0; stryMutAct_9fa48("5598") ? i >= fullStars : stryMutAct_9fa48("5597") ? i <= fullStars : stryMutAct_9fa48("5596") ? false : (stryCov_9fa48("5596", "5597", "5598"), i < fullStars); stryMutAct_9fa48("5599") ? i-- : (stryCov_9fa48("5599"), i++)) {
          if (stryMutAct_9fa48("5600")) {
            {}
          } else {
            stryCov_9fa48("5600");
            stars.push(<svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>);
          }
        }
        if (stryMutAct_9fa48("5602") ? false : stryMutAct_9fa48("5601") ? true : (stryCov_9fa48("5601", "5602"), hasHalfStar)) {
          if (stryMutAct_9fa48("5603")) {
            {}
          } else {
            stryCov_9fa48("5603");
            stars.push(<svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>);
          }
        }
        return <div className="flex items-center space-x-1">{stars}</div>;
      }
    };
    return <article className={stryMutAct_9fa48("5604") ? `` : (stryCov_9fa48("5604"), `bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`)} itemScope itemType="https://schema.org/Product">
      {/* Product Image */}
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover hover:scale-105 transition-transform duration-200" priority={priority} itemProp="image" />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm" itemProp="name">
            {product.name}
          </h3>
          <p className="text-gray-600 text-xs line-clamp-2" itemProp="description">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        {stryMutAct_9fa48("5607") ? product.rating || <div className="flex items-center space-x-2" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500" itemProp="ratingValue">{product.rating}</span>
          </div> : stryMutAct_9fa48("5606") ? false : stryMutAct_9fa48("5605") ? true : (stryCov_9fa48("5605", "5606", "5607"), product.rating && <div className="flex items-center space-x-2" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500" itemProp="ratingValue">{product.rating}</span>
          </div>)}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-gray-900" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <span itemProp="price">{formatPrice(product.price, product.currency)}</span>
            <meta itemProp="priceCurrency" content={stryMutAct_9fa48("5608") ? product.currency.toLowerCase() : (stryCov_9fa48("5608"), product.currency.toUpperCase())} />
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {product.affiliate_url ? <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 block text-center">
              View Product
            </a> : <Link href={stryMutAct_9fa48("5609") ? `` : (stryCov_9fa48("5609"), `/products/${product.id}`)} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 block text-center">
              View Details
            </Link>}
        </div>
      </div>
    </article>;
  }
}