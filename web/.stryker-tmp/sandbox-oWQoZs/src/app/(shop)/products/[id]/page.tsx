/**
 * Product Detail Page - Server Component
 *
 * Individual product detail page with server-side rendering.
 * This demonstrates 75% server components with client-side interactivity.
 *
 * Server Components:
 * - Product data fetching
 * - SEO metadata generation
 * - Static product information
 * - Structured data for search engines
 * - Related products server-side rendering
 *
 * Client Components:
 * - Add to cart functionality
 * - Wishlist toggle
 * - Image gallery interactions
 * - Social sharing
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
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getProductById, getProducts } from '@/app/actions/products';
import { ProductImageGallery } from '@/components/shop/ProductImageGallery';
import { ProductActions } from '@/components/shop/ProductActions';
import { RelatedProducts } from '@/components/shop/RelatedProducts';
import { ProductReviews } from '@/components/shop/ProductReviews';
import { BreadcrumbNavigation } from '@/components/shop/BreadcrumbNavigation';
import { Star, Award, Shield, Truck } from 'lucide-react';

// ==============================================================================
// TYPES
// ==============================================================================

interface Product {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  currency?: string;
  original_price?: number;
  image_url: string;
  images?: string[];
  brand?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  rating?: number;
  review_count?: number;
  affiliate_url?: string;
  url?: string;
  features?: string[];
  specifications?: Record<string, string>;
  is_featured?: boolean;
  is_trending?: boolean;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
  availability?: string;
}
interface PageProps {
  params: {
    id: string;
  };
}

// ==============================================================================
// METADATA GENERATION (SERVER-SIDE)
// ==============================================================================

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  if (stryMutAct_9fa48("903")) {
    {}
  } else {
    stryCov_9fa48("903");
    try {
      if (stryMutAct_9fa48("904")) {
        {}
      } else {
        stryCov_9fa48("904");
        const result = await getProductById(params.id);
        if (stryMutAct_9fa48("907") ? !result.success && !result.data : stryMutAct_9fa48("906") ? false : stryMutAct_9fa48("905") ? true : (stryCov_9fa48("905", "906", "907"), (stryMutAct_9fa48("908") ? result.success : (stryCov_9fa48("908"), !result.success)) || (stryMutAct_9fa48("909") ? result.data : (stryCov_9fa48("909"), !result.data)))) {
          if (stryMutAct_9fa48("910")) {
            {}
          } else {
            stryCov_9fa48("910");
            return stryMutAct_9fa48("911") ? {} : (stryCov_9fa48("911"), {
              title: stryMutAct_9fa48("912") ? "" : (stryCov_9fa48("912"), 'Product Not Found'),
              description: stryMutAct_9fa48("913") ? "" : (stryCov_9fa48("913"), 'The requested product could not be found.')
            });
          }
        }
        const product: Product = result.data;
        const productName = stryMutAct_9fa48("916") ? (product.title || product.name) && 'Product' : stryMutAct_9fa48("915") ? false : stryMutAct_9fa48("914") ? true : (stryCov_9fa48("914", "915", "916"), (stryMutAct_9fa48("918") ? product.title && product.name : stryMutAct_9fa48("917") ? false : (stryCov_9fa48("917", "918"), product.title || product.name)) || (stryMutAct_9fa48("919") ? "" : (stryCov_9fa48("919"), 'Product')));
        return stryMutAct_9fa48("920") ? {} : (stryCov_9fa48("920"), {
          title: stryMutAct_9fa48("921") ? `` : (stryCov_9fa48("921"), `${productName} | aclue`),
          description: stryMutAct_9fa48("924") ? product.description && `Discover ${productName} and more amazing gifts with AI-powered recommendations on aclue.` : stryMutAct_9fa48("923") ? false : stryMutAct_9fa48("922") ? true : (stryCov_9fa48("922", "923", "924"), product.description || (stryMutAct_9fa48("925") ? `` : (stryCov_9fa48("925"), `Discover ${productName} and more amazing gifts with AI-powered recommendations on aclue.`))),
          keywords: stryMutAct_9fa48("926") ? [productName, product.brand, product.category?.name, 'gifts', 'shopping', 'aclue'] : (stryCov_9fa48("926"), (stryMutAct_9fa48("927") ? [] : (stryCov_9fa48("927"), [productName, product.brand, stryMutAct_9fa48("928") ? product.category.name : (stryCov_9fa48("928"), product.category?.name), stryMutAct_9fa48("929") ? "" : (stryCov_9fa48("929"), 'gifts'), stryMutAct_9fa48("930") ? "" : (stryCov_9fa48("930"), 'shopping'), stryMutAct_9fa48("931") ? "" : (stryCov_9fa48("931"), 'aclue')])).filter(Boolean)),
          openGraph: stryMutAct_9fa48("932") ? {} : (stryCov_9fa48("932"), {
            title: stryMutAct_9fa48("933") ? `` : (stryCov_9fa48("933"), `${productName} | aclue`),
            description: product.description,
            images: stryMutAct_9fa48("934") ? [] : (stryCov_9fa48("934"), [stryMutAct_9fa48("935") ? {} : (stryCov_9fa48("935"), {
              url: product.image_url,
              width: 1200,
              height: 630,
              alt: productName
            })]),
            type: stryMutAct_9fa48("936") ? "" : (stryCov_9fa48("936"), 'product'),
            locale: stryMutAct_9fa48("937") ? "" : (stryCov_9fa48("937"), 'en_GB')
          }),
          twitter: stryMutAct_9fa48("938") ? {} : (stryCov_9fa48("938"), {
            card: stryMutAct_9fa48("939") ? "" : (stryCov_9fa48("939"), 'summary_large_image'),
            title: stryMutAct_9fa48("940") ? `` : (stryCov_9fa48("940"), `${productName} | aclue`),
            description: product.description,
            images: stryMutAct_9fa48("941") ? [] : (stryCov_9fa48("941"), [product.image_url])
          }),
          robots: stryMutAct_9fa48("942") ? {} : (stryCov_9fa48("942"), {
            index: stryMutAct_9fa48("943") ? true : (stryCov_9fa48("943"), false),
            follow: stryMutAct_9fa48("944") ? true : (stryCov_9fa48("944"), false)
          })
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("945")) {
        {}
      } else {
        stryCov_9fa48("945");
        console.error(stryMutAct_9fa48("946") ? "" : (stryCov_9fa48("946"), 'Error generating metadata:'), error);
        return stryMutAct_9fa48("947") ? {} : (stryCov_9fa48("947"), {
          title: stryMutAct_9fa48("948") ? "" : (stryCov_9fa48("948"), 'Product | aclue'),
          description: stryMutAct_9fa48("949") ? "" : (stryCov_9fa48("949"), 'Discover amazing gifts with AI-powered recommendations.')
        });
      }
    }
  }
}

// ==============================================================================
// SERVER HELPER FUNCTIONS
// ==============================================================================

/**
 * Check authentication status server-side
 */
async function getAuthenticationStatus(): Promise<boolean> {
  if (stryMutAct_9fa48("950")) {
    {}
  } else {
    stryCov_9fa48("950");
    try {
      if (stryMutAct_9fa48("951")) {
        {}
      } else {
        stryCov_9fa48("951");
        const cookieStore = cookies();
        const accessToken = cookieStore.get(stryMutAct_9fa48("952") ? "" : (stryCov_9fa48("952"), 'access_token'));
        return stryMutAct_9fa48("953") ? !accessToken?.value : (stryCov_9fa48("953"), !(stryMutAct_9fa48("954") ? accessToken?.value : (stryCov_9fa48("954"), !(stryMutAct_9fa48("955") ? accessToken.value : (stryCov_9fa48("955"), accessToken?.value)))));
      }
    } catch (error) {
      if (stryMutAct_9fa48("956")) {
        {}
      } else {
        stryCov_9fa48("956");
        console.error(stryMutAct_9fa48("957") ? "" : (stryCov_9fa48("957"), 'Error checking authentication:'), error);
        return stryMutAct_9fa48("958") ? true : (stryCov_9fa48("958"), false);
      }
    }
  }
}

/**
 * Get related products based on category
 */
async function getRelatedProducts(product: Product): Promise<Product[]> {
  if (stryMutAct_9fa48("959")) {
    {}
  } else {
    stryCov_9fa48("959");
    try {
      if (stryMutAct_9fa48("960")) {
        {}
      } else {
        stryCov_9fa48("960");
        if (stryMutAct_9fa48("963") ? false : stryMutAct_9fa48("962") ? true : stryMutAct_9fa48("961") ? product.category?.name : (stryCov_9fa48("961", "962", "963"), !(stryMutAct_9fa48("964") ? product.category.name : (stryCov_9fa48("964"), product.category?.name)))) return stryMutAct_9fa48("965") ? ["Stryker was here"] : (stryCov_9fa48("965"), []);
        const result = await getProducts(stryMutAct_9fa48("966") ? {} : (stryCov_9fa48("966"), {
          category: product.category.name,
          limit: 4
        }));
        if (stryMutAct_9fa48("969") ? result.success || result.data : stryMutAct_9fa48("968") ? false : stryMutAct_9fa48("967") ? true : (stryCov_9fa48("967", "968", "969"), result.success && result.data)) {
          if (stryMutAct_9fa48("970")) {
            {}
          } else {
            stryCov_9fa48("970");
            // Filter out the current product
            return stryMutAct_9fa48("972") ? result.data.slice(0, 4) : stryMutAct_9fa48("971") ? result.data.filter((p: Product) => p.id !== product.id) : (stryCov_9fa48("971", "972"), result.data.filter(stryMutAct_9fa48("973") ? () => undefined : (stryCov_9fa48("973"), (p: Product) => stryMutAct_9fa48("976") ? p.id === product.id : stryMutAct_9fa48("975") ? false : stryMutAct_9fa48("974") ? true : (stryCov_9fa48("974", "975", "976"), p.id !== product.id))).slice(0, 4));
          }
        }
        return stryMutAct_9fa48("977") ? ["Stryker was here"] : (stryCov_9fa48("977"), []);
      }
    } catch (error) {
      if (stryMutAct_9fa48("978")) {
        {}
      } else {
        stryCov_9fa48("978");
        console.error(stryMutAct_9fa48("979") ? "" : (stryCov_9fa48("979"), 'Error fetching related products:'), error);
        return stryMutAct_9fa48("980") ? ["Stryker was here"] : (stryCov_9fa48("980"), []);
      }
    }
  }
}

/**
 * Format price with currency
 */
function formatPrice(price: number, currency: string = stryMutAct_9fa48("981") ? "" : (stryCov_9fa48("981"), 'GBP')): string {
  if (stryMutAct_9fa48("982")) {
    {}
  } else {
    stryCov_9fa48("982");
    return new Intl.NumberFormat(stryMutAct_9fa48("983") ? "" : (stryCov_9fa48("983"), 'en-GB'), stryMutAct_9fa48("984") ? {} : (stryCov_9fa48("984"), {
      style: stryMutAct_9fa48("985") ? "" : (stryCov_9fa48("985"), 'currency'),
      currency: currency
    })).format(price);
  }
}

/**
 * Calculate discount percentage
 */
function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (stryMutAct_9fa48("986")) {
    {}
  } else {
    stryCov_9fa48("986");
    return Math.round(stryMutAct_9fa48("987") ? (originalPrice - currentPrice) / originalPrice / 100 : (stryCov_9fa48("987"), (stryMutAct_9fa48("988") ? (originalPrice - currentPrice) * originalPrice : (stryCov_9fa48("988"), (stryMutAct_9fa48("989") ? originalPrice + currentPrice : (stryCov_9fa48("989"), originalPrice - currentPrice)) / originalPrice)) * 100));
  }
}

// ==============================================================================
// MAIN PAGE COMPONENT (SERVER)
// ==============================================================================

export default async function ProductDetailPage({
  params
}: PageProps) {
  if (stryMutAct_9fa48("990")) {
    {}
  } else {
    stryCov_9fa48("990");
    // Server-side data fetching
    const [productResult, isAuthenticated] = await Promise.all(stryMutAct_9fa48("991") ? [] : (stryCov_9fa48("991"), [getProductById(params.id), getAuthenticationStatus()]));

    // Handle product not found
    if (stryMutAct_9fa48("994") ? !productResult.success && !productResult.data : stryMutAct_9fa48("993") ? false : stryMutAct_9fa48("992") ? true : (stryCov_9fa48("992", "993", "994"), (stryMutAct_9fa48("995") ? productResult.success : (stryCov_9fa48("995"), !productResult.success)) || (stryMutAct_9fa48("996") ? productResult.data : (stryCov_9fa48("996"), !productResult.data)))) {
      if (stryMutAct_9fa48("997")) {
        {}
      } else {
        stryCov_9fa48("997");
        notFound();
      }
    }
    const product: Product = productResult.data;
    const productName = stryMutAct_9fa48("1000") ? (product.title || product.name) && 'Product' : stryMutAct_9fa48("999") ? false : stryMutAct_9fa48("998") ? true : (stryCov_9fa48("998", "999", "1000"), (stryMutAct_9fa48("1002") ? product.title && product.name : stryMutAct_9fa48("1001") ? false : (stryCov_9fa48("1001", "1002"), product.title || product.name)) || (stryMutAct_9fa48("1003") ? "" : (stryCov_9fa48("1003"), 'Product')));

    // Get related products
    const relatedProducts = await getRelatedProducts(product);

    // Prepare product images
    const productImages = stryMutAct_9fa48("1006") ? product.images && [product.image_url] : stryMutAct_9fa48("1005") ? false : stryMutAct_9fa48("1004") ? true : (stryCov_9fa48("1004", "1005", "1006"), product.images || (stryMutAct_9fa48("1007") ? [] : (stryCov_9fa48("1007"), [product.image_url])));

    // Calculate discount if applicable
    const hasDiscount = stryMutAct_9fa48("1010") ? product.original_price || product.original_price > product.price : stryMutAct_9fa48("1009") ? false : stryMutAct_9fa48("1008") ? true : (stryCov_9fa48("1008", "1009", "1010"), product.original_price && (stryMutAct_9fa48("1013") ? product.original_price <= product.price : stryMutAct_9fa48("1012") ? product.original_price >= product.price : stryMutAct_9fa48("1011") ? true : (stryCov_9fa48("1011", "1012", "1013"), product.original_price > product.price)));
    const discountPercentage = hasDiscount ? calculateDiscount(product.original_price!, product.price) : 0;
    return <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <BreadcrumbNavigation items={stryMutAct_9fa48("1014") ? [] : (stryCov_9fa48("1014"), [stryMutAct_9fa48("1015") ? {} : (stryCov_9fa48("1015"), {
            label: stryMutAct_9fa48("1016") ? "" : (stryCov_9fa48("1016"), 'Discover'),
            href: stryMutAct_9fa48("1017") ? "" : (stryCov_9fa48("1017"), '/discover')
          }), ...(product.category ? stryMutAct_9fa48("1018") ? [] : (stryCov_9fa48("1018"), [stryMutAct_9fa48("1019") ? {} : (stryCov_9fa48("1019"), {
            label: product.category.name,
            href: stryMutAct_9fa48("1020") ? `` : (stryCov_9fa48("1020"), `/category/${product.category.slug}`)
          })]) : stryMutAct_9fa48("1021") ? ["Stryker was here"] : (stryCov_9fa48("1021"), [])), stryMutAct_9fa48("1022") ? {} : (stryCov_9fa48("1022"), {
            label: productName,
            href: stryMutAct_9fa48("1023") ? "Stryker was here!" : (stryCov_9fa48("1023"), '')
          })])} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images - Client Component for Gallery Interactions */}
          <div className="space-y-4">
            <ProductImageGallery images={productImages} productName={productName} />
          </div>

          {/* Product Information - Server Component */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              {/* Brand */}
              {stryMutAct_9fa48("1026") ? product.brand || <p className="text-sm text-gray-600 mb-2">{product.brand}</p> : stryMutAct_9fa48("1025") ? false : stryMutAct_9fa48("1024") ? true : (stryCov_9fa48("1024", "1025", "1026"), product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>)}

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {productName}
              </h1>

              {/* Rating and Reviews */}
              {stryMutAct_9fa48("1029") ? product.rating || <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {product.rating.toFixed(1)}
                  </span>
                  {product.review_count && <span className="text-sm text-gray-600">
                      ({product.review_count} reviews)
                    </span>}
                </div> : stryMutAct_9fa48("1028") ? false : stryMutAct_9fa48("1027") ? true : (stryCov_9fa48("1027", "1028", "1029"), product.rating && <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {(stryMutAct_9fa48("1030") ? [] : (stryCov_9fa48("1030"), [...(stryMutAct_9fa48("1031") ? Array() : (stryCov_9fa48("1031"), Array(5)))])).map(stryMutAct_9fa48("1032") ? () => undefined : (stryCov_9fa48("1032"), (_, i) => <Star key={i} className={stryMutAct_9fa48("1033") ? `` : (stryCov_9fa48("1033"), `w-4 h-4 ${(stryMutAct_9fa48("1037") ? i >= Math.floor(product.rating!) : stryMutAct_9fa48("1036") ? i <= Math.floor(product.rating!) : stryMutAct_9fa48("1035") ? false : stryMutAct_9fa48("1034") ? true : (stryCov_9fa48("1034", "1035", "1036", "1037"), i < Math.floor(product.rating!))) ? stryMutAct_9fa48("1038") ? "" : (stryCov_9fa48("1038"), 'text-yellow-400 fill-yellow-400') : stryMutAct_9fa48("1039") ? "" : (stryCov_9fa48("1039"), 'text-gray-300')}`)} />))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {product.rating.toFixed(1)}
                  </span>
                  {stryMutAct_9fa48("1042") ? product.review_count || <span className="text-sm text-gray-600">
                      ({product.review_count} reviews)
                    </span> : stryMutAct_9fa48("1041") ? false : stryMutAct_9fa48("1040") ? true : (stryCov_9fa48("1040", "1041", "1042"), product.review_count && <span className="text-sm text-gray-600">
                      ({product.review_count} reviews)
                    </span>)}
                </div>)}

              {/* Product Badges */}
              <div className="flex items-center gap-2 mb-4">
                {stryMutAct_9fa48("1045") ? product.is_featured || <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Featured
                  </span> : stryMutAct_9fa48("1044") ? false : stryMutAct_9fa48("1043") ? true : (stryCov_9fa48("1043", "1044", "1045"), product.is_featured && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Featured
                  </span>)}
                {stryMutAct_9fa48("1048") ? product.is_trending || <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    🔥 Trending
                  </span> : stryMutAct_9fa48("1047") ? false : stryMutAct_9fa48("1046") ? true : (stryCov_9fa48("1046", "1047", "1048"), product.is_trending && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    🔥 Trending
                  </span>)}
                {stryMutAct_9fa48("1051") ? product.stock_status === 'low_stock' || <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    Low Stock
                  </span> : stryMutAct_9fa48("1050") ? false : stryMutAct_9fa48("1049") ? true : (stryCov_9fa48("1049", "1050", "1051"), (stryMutAct_9fa48("1053") ? product.stock_status !== 'low_stock' : stryMutAct_9fa48("1052") ? true : (stryCov_9fa48("1052", "1053"), product.stock_status === (stryMutAct_9fa48("1054") ? "" : (stryCov_9fa48("1054"), 'low_stock')))) && <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    Low Stock
                  </span>)}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </span>
                {stryMutAct_9fa48("1057") ? hasDiscount || <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.original_price!, product.currency)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {discountPercentage}% off
                    </span>
                  </> : stryMutAct_9fa48("1056") ? false : stryMutAct_9fa48("1055") ? true : (stryCov_9fa48("1055", "1056", "1057"), hasDiscount && <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.original_price!, product.currency)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {discountPercentage}% off
                    </span>
                  </>)}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {stryMutAct_9fa48("1060") ? product.features && product.features.length > 0 || <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>)}
                </ul>
              </div> : stryMutAct_9fa48("1059") ? false : stryMutAct_9fa48("1058") ? true : (stryCov_9fa48("1058", "1059", "1060"), (stryMutAct_9fa48("1062") ? product.features || product.features.length > 0 : stryMutAct_9fa48("1061") ? true : (stryCov_9fa48("1061", "1062"), product.features && (stryMutAct_9fa48("1065") ? product.features.length <= 0 : stryMutAct_9fa48("1064") ? product.features.length >= 0 : stryMutAct_9fa48("1063") ? true : (stryCov_9fa48("1063", "1064", "1065"), product.features.length > 0)))) && <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map(stryMutAct_9fa48("1066") ? () => undefined : (stryCov_9fa48("1066"), (feature, index) => <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      {feature}
                    </li>))}
                </ul>
              </div>)}

            {/* Trust Indicators */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Product Actions - Client Component */}
            <ProductActions product={product} isAuthenticated={isAuthenticated} />
          </div>
        </div>

        {/* Specifications */}
        {stryMutAct_9fa48("1069") ? product.specifications && Object.keys(product.specifications).length > 0 || <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-gray-700">{value}</span>
                </div>)}
            </div>
          </div> : stryMutAct_9fa48("1068") ? false : stryMutAct_9fa48("1067") ? true : (stryCov_9fa48("1067", "1068", "1069"), (stryMutAct_9fa48("1071") ? product.specifications || Object.keys(product.specifications).length > 0 : stryMutAct_9fa48("1070") ? true : (stryCov_9fa48("1070", "1071"), product.specifications && (stryMutAct_9fa48("1074") ? Object.keys(product.specifications).length <= 0 : stryMutAct_9fa48("1073") ? Object.keys(product.specifications).length >= 0 : stryMutAct_9fa48("1072") ? true : (stryCov_9fa48("1072", "1073", "1074"), Object.keys(product.specifications).length > 0)))) && <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(stryMutAct_9fa48("1075") ? () => undefined : (stryCov_9fa48("1075"), ([key, value]) => <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-900 capitalize">
                    {key.replace(/_/g, stryMutAct_9fa48("1076") ? "" : (stryCov_9fa48("1076"), ' '))}
                  </span>
                  <span className="text-gray-700">{value}</span>
                </div>))}
            </div>
          </div>)}

        {/* Related Products */}
        {stryMutAct_9fa48("1079") ? relatedProducts.length > 0 || <div className="mt-12 border-t border-gray-200 pt-8">
            <RelatedProducts products={relatedProducts} currentProductId={product.id} />
          </div> : stryMutAct_9fa48("1078") ? false : stryMutAct_9fa48("1077") ? true : (stryCov_9fa48("1077", "1078", "1079"), (stryMutAct_9fa48("1082") ? relatedProducts.length <= 0 : stryMutAct_9fa48("1081") ? relatedProducts.length >= 0 : stryMutAct_9fa48("1080") ? true : (stryCov_9fa48("1080", "1081", "1082"), relatedProducts.length > 0)) && <div className="mt-12 border-t border-gray-200 pt-8">
            <RelatedProducts products={relatedProducts} currentProductId={product.id} />
          </div>)}
      </div>

      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={stryMutAct_9fa48("1083") ? {} : (stryCov_9fa48("1083"), {
        __html: JSON.stringify(stryMutAct_9fa48("1084") ? {} : (stryCov_9fa48("1084"), {
          '@context': stryMutAct_9fa48("1085") ? "" : (stryCov_9fa48("1085"), 'https://schema.org'),
          '@type': stryMutAct_9fa48("1086") ? "" : (stryCov_9fa48("1086"), 'Product'),
          name: productName,
          description: product.description,
          brand: stryMutAct_9fa48("1087") ? {} : (stryCov_9fa48("1087"), {
            '@type': stryMutAct_9fa48("1088") ? "" : (stryCov_9fa48("1088"), 'Brand'),
            name: stryMutAct_9fa48("1091") ? product.brand && 'aclue' : stryMutAct_9fa48("1090") ? false : stryMutAct_9fa48("1089") ? true : (stryCov_9fa48("1089", "1090", "1091"), product.brand || (stryMutAct_9fa48("1092") ? "" : (stryCov_9fa48("1092"), 'aclue')))
          }),
          image: productImages,
          offers: stryMutAct_9fa48("1093") ? {} : (stryCov_9fa48("1093"), {
            '@type': stryMutAct_9fa48("1094") ? "" : (stryCov_9fa48("1094"), 'Offer'),
            price: product.price,
            priceCurrency: stryMutAct_9fa48("1097") ? product.currency && 'GBP' : stryMutAct_9fa48("1096") ? false : stryMutAct_9fa48("1095") ? true : (stryCov_9fa48("1095", "1096", "1097"), product.currency || (stryMutAct_9fa48("1098") ? "" : (stryCov_9fa48("1098"), 'GBP'))),
            availability: (stryMutAct_9fa48("1101") ? product.stock_status !== 'in_stock' : stryMutAct_9fa48("1100") ? false : stryMutAct_9fa48("1099") ? true : (stryCov_9fa48("1099", "1100", "1101"), product.stock_status === (stryMutAct_9fa48("1102") ? "" : (stryCov_9fa48("1102"), 'in_stock')))) ? stryMutAct_9fa48("1103") ? "" : (stryCov_9fa48("1103"), 'https://schema.org/InStock') : stryMutAct_9fa48("1104") ? "" : (stryCov_9fa48("1104"), 'https://schema.org/OutOfStock')
          }),
          ...(stryMutAct_9fa48("1107") ? product.rating || {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.review_count || 1
            }
          } : stryMutAct_9fa48("1106") ? false : stryMutAct_9fa48("1105") ? true : (stryCov_9fa48("1105", "1106", "1107"), product.rating && (stryMutAct_9fa48("1108") ? {} : (stryCov_9fa48("1108"), {
            aggregateRating: stryMutAct_9fa48("1109") ? {} : (stryCov_9fa48("1109"), {
              '@type': stryMutAct_9fa48("1110") ? "" : (stryCov_9fa48("1110"), 'AggregateRating'),
              ratingValue: product.rating,
              reviewCount: stryMutAct_9fa48("1113") ? product.review_count && 1 : stryMutAct_9fa48("1112") ? false : stryMutAct_9fa48("1111") ? true : (stryCov_9fa48("1111", "1112", "1113"), product.review_count || 1)
            })
          }))))
        }))
      })} />
    </div>;
  }
}

// ==============================================================================
// PERFORMANCE OPTIMIZATIONS
// ==============================================================================

/**
 * Enable static generation for better performance
 */
export const revalidate = 600; // 10 minutes

/**
 * Generate static params for popular products
 */
export async function generateStaticParams() {
  if (stryMutAct_9fa48("1114")) {
    {}
  } else {
    stryCov_9fa48("1114");
    try {
      if (stryMutAct_9fa48("1115")) {
        {}
      } else {
        stryCov_9fa48("1115");
        const result = await getProducts(stryMutAct_9fa48("1116") ? {} : (stryCov_9fa48("1116"), {
          limit: 10
        }));
        if (stryMutAct_9fa48("1119") ? result.success || result.data : stryMutAct_9fa48("1118") ? false : stryMutAct_9fa48("1117") ? true : (stryCov_9fa48("1117", "1118", "1119"), result.success && result.data)) {
          if (stryMutAct_9fa48("1120")) {
            {}
          } else {
            stryCov_9fa48("1120");
            return result.data.map(stryMutAct_9fa48("1121") ? () => undefined : (stryCov_9fa48("1121"), (product: Product) => stryMutAct_9fa48("1122") ? {} : (stryCov_9fa48("1122"), {
              id: product.id
            })));
          }
        }
        return stryMutAct_9fa48("1123") ? ["Stryker was here"] : (stryCov_9fa48("1123"), []);
      }
    } catch (error) {
      if (stryMutAct_9fa48("1124")) {
        {}
      } else {
        stryCov_9fa48("1124");
        console.error(stryMutAct_9fa48("1125") ? "" : (stryCov_9fa48("1125"), 'Error generating static params:'), error);
        return stryMutAct_9fa48("1126") ? ["Stryker was here"] : (stryCov_9fa48("1126"), []);
      }
    }
  }
}