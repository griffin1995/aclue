/**
 * Product Actions - Client Component
 *
 * Interactive product action buttons for cart, wishlist, and sharing.
 * Handles user authentication and provides feedback for all actions.
 */
// @ts-nocheck


'use client';

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
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Share2, ExternalLink, Plus } from 'lucide-react';
import { toggleWishlistAction } from '@/app/actions/products';
import { generateAffiliateLink, isValidAmazonUrl } from '@/lib/affiliate';
import toast from 'react-hot-toast';
interface Product {
  id: string;
  title: string;
  name?: string;
  price: number;
  currency?: string;
  affiliate_url?: string;
  url?: string;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
}
interface ProductActionsProps {
  product: Product;
  isAuthenticated: boolean;
}
export function ProductActions({
  product,
  isAuthenticated
}: ProductActionsProps) {
  if (stryMutAct_9fa48("5869")) {
    {}
  } else {
    stryCov_9fa48("5869");
    const router = useRouter();
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(stryMutAct_9fa48("5870") ? true : (stryCov_9fa48("5870"), false));
    const [isInWishlist, setIsInWishlist] = useState(stryMutAct_9fa48("5871") ? true : (stryCov_9fa48("5871"), false)); // This would normally come from props

    const productName = stryMutAct_9fa48("5874") ? (product.title || product.name) && 'Product' : stryMutAct_9fa48("5873") ? false : stryMutAct_9fa48("5872") ? true : (stryCov_9fa48("5872", "5873", "5874"), (stryMutAct_9fa48("5876") ? product.title && product.name : stryMutAct_9fa48("5875") ? false : (stryCov_9fa48("5875", "5876"), product.title || product.name)) || (stryMutAct_9fa48("5877") ? "" : (stryCov_9fa48("5877"), 'Product')));
    const handleAddToWishlist = async () => {
      if (stryMutAct_9fa48("5878")) {
        {}
      } else {
        stryCov_9fa48("5878");
        if (stryMutAct_9fa48("5881") ? false : stryMutAct_9fa48("5880") ? true : stryMutAct_9fa48("5879") ? isAuthenticated : (stryCov_9fa48("5879", "5880", "5881"), !isAuthenticated)) {
          if (stryMutAct_9fa48("5882")) {
            {}
          } else {
            stryCov_9fa48("5882");
            toast.error(stryMutAct_9fa48("5883") ? "" : (stryCov_9fa48("5883"), 'Please sign in to save items to wishlist'));
            router.push(stryMutAct_9fa48("5884") ? `` : (stryCov_9fa48("5884"), `/auth/login?redirect=/products/${product.id}`));
            return;
          }
        }
        await handleToggleWishlist();
      }
    };
    const handleToggleWishlist = async () => {
      if (stryMutAct_9fa48("5885")) {
        {}
      } else {
        stryCov_9fa48("5885");
        if (stryMutAct_9fa48("5888") ? false : stryMutAct_9fa48("5887") ? true : stryMutAct_9fa48("5886") ? isAuthenticated : (stryCov_9fa48("5886", "5887", "5888"), !isAuthenticated)) {
          if (stryMutAct_9fa48("5889")) {
            {}
          } else {
            stryCov_9fa48("5889");
            toast.error(stryMutAct_9fa48("5890") ? "" : (stryCov_9fa48("5890"), 'Please sign in to save items to wishlist'));
            router.push(stryMutAct_9fa48("5891") ? `` : (stryCov_9fa48("5891"), `/auth/login?redirect=/products/${product.id}`));
            return;
          }
        }
        setIsTogglingWishlist(stryMutAct_9fa48("5892") ? false : (stryCov_9fa48("5892"), true));
        try {
          if (stryMutAct_9fa48("5893")) {
            {}
          } else {
            stryCov_9fa48("5893");
            const result = await toggleWishlistAction(product.id);
            if (stryMutAct_9fa48("5895") ? false : stryMutAct_9fa48("5894") ? true : (stryCov_9fa48("5894", "5895"), result.success)) {
              if (stryMutAct_9fa48("5896")) {
                {}
              } else {
                stryCov_9fa48("5896");
                setIsInWishlist(stryMutAct_9fa48("5899") ? result.added && false : stryMutAct_9fa48("5898") ? false : stryMutAct_9fa48("5897") ? true : (stryCov_9fa48("5897", "5898", "5899"), result.added || (stryMutAct_9fa48("5900") ? true : (stryCov_9fa48("5900"), false))));
                toast.success(stryMutAct_9fa48("5903") ? result.message && 'Wishlist updated!' : stryMutAct_9fa48("5902") ? false : stryMutAct_9fa48("5901") ? true : (stryCov_9fa48("5901", "5902", "5903"), result.message || (stryMutAct_9fa48("5904") ? "" : (stryCov_9fa48("5904"), 'Wishlist updated!'))));
              }
            } else {
              if (stryMutAct_9fa48("5905")) {
                {}
              } else {
                stryCov_9fa48("5905");
                toast.error(stryMutAct_9fa48("5908") ? result.error && 'Failed to update wishlist' : stryMutAct_9fa48("5907") ? false : stryMutAct_9fa48("5906") ? true : (stryCov_9fa48("5906", "5907", "5908"), result.error || (stryMutAct_9fa48("5909") ? "" : (stryCov_9fa48("5909"), 'Failed to update wishlist'))));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("5910")) {
            {}
          } else {
            stryCov_9fa48("5910");
            console.error(stryMutAct_9fa48("5911") ? "" : (stryCov_9fa48("5911"), 'Error updating wishlist:'), error);
            toast.error(stryMutAct_9fa48("5912") ? "" : (stryCov_9fa48("5912"), 'Failed to update wishlist. Please try again.'));
          }
        } finally {
          if (stryMutAct_9fa48("5913")) {
            {}
          } else {
            stryCov_9fa48("5913");
            setIsTogglingWishlist(stryMutAct_9fa48("5914") ? true : (stryCov_9fa48("5914"), false));
          }
        }
      }
    };
    const handleShare = async () => {
      if (stryMutAct_9fa48("5915")) {
        {}
      } else {
        stryCov_9fa48("5915");
        const shareData = stryMutAct_9fa48("5916") ? {} : (stryCov_9fa48("5916"), {
          title: productName,
          text: stryMutAct_9fa48("5917") ? `` : (stryCov_9fa48("5917"), `Check out this product: ${productName}`),
          url: window.location.href
        });
        if (stryMutAct_9fa48("5920") ? navigator.share || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : stryMutAct_9fa48("5919") ? false : stryMutAct_9fa48("5918") ? true : (stryCov_9fa48("5918", "5919", "5920"), navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
          if (stryMutAct_9fa48("5921")) {
            {}
          } else {
            stryCov_9fa48("5921");
            try {
              if (stryMutAct_9fa48("5922")) {
                {}
              } else {
                stryCov_9fa48("5922");
                await navigator.share(shareData);
              }
            } catch (error) {
              if (stryMutAct_9fa48("5923")) {
                {}
              } else {
                stryCov_9fa48("5923");
                // User cancelled sharing or error occurred
                if (stryMutAct_9fa48("5926") ? error instanceof Error || error.name !== 'AbortError' : stryMutAct_9fa48("5925") ? false : stryMutAct_9fa48("5924") ? true : (stryCov_9fa48("5924", "5925", "5926"), error instanceof Error && (stryMutAct_9fa48("5928") ? error.name === 'AbortError' : stryMutAct_9fa48("5927") ? true : (stryCov_9fa48("5927", "5928"), error.name !== (stryMutAct_9fa48("5929") ? "" : (stryCov_9fa48("5929"), 'AbortError')))))) {
                  if (stryMutAct_9fa48("5930")) {
                    {}
                  } else {
                    stryCov_9fa48("5930");
                    await fallbackShare();
                  }
                }
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("5931")) {
            {}
          } else {
            stryCov_9fa48("5931");
            await fallbackShare();
          }
        }
      }
    };
    const fallbackShare = async () => {
      if (stryMutAct_9fa48("5932")) {
        {}
      } else {
        stryCov_9fa48("5932");
        try {
          if (stryMutAct_9fa48("5933")) {
            {}
          } else {
            stryCov_9fa48("5933");
            await navigator.clipboard.writeText(window.location.href);
            toast.success(stryMutAct_9fa48("5934") ? "" : (stryCov_9fa48("5934"), 'Product link copied to clipboard!'));
          }
        } catch (error) {
          if (stryMutAct_9fa48("5935")) {
            {}
          } else {
            stryCov_9fa48("5935");
            console.error(stryMutAct_9fa48("5936") ? "" : (stryCov_9fa48("5936"), 'Error copying to clipboard:'), error);
            toast.error(stryMutAct_9fa48("5937") ? "" : (stryCov_9fa48("5937"), 'Failed to copy link. Please try again.'));
          }
        }
      }
    };
    const handleViewOnAmazon = () => {
      if (stryMutAct_9fa48("5938")) {
        {}
      } else {
        stryCov_9fa48("5938");
        const productUrl = stryMutAct_9fa48("5941") ? product.affiliate_url && product.url : stryMutAct_9fa48("5940") ? false : stryMutAct_9fa48("5939") ? true : (stryCov_9fa48("5939", "5940", "5941"), product.affiliate_url || product.url);
        if (stryMutAct_9fa48("5944") ? false : stryMutAct_9fa48("5943") ? true : stryMutAct_9fa48("5942") ? productUrl : (stryCov_9fa48("5942", "5943", "5944"), !productUrl)) {
          if (stryMutAct_9fa48("5945")) {
            {}
          } else {
            stryCov_9fa48("5945");
            toast.error(stryMutAct_9fa48("5946") ? "" : (stryCov_9fa48("5946"), 'Amazon link not available for this product'));
            return;
          }
        }

        // Generate affiliate tracking for revenue
        if (stryMutAct_9fa48("5948") ? false : stryMutAct_9fa48("5947") ? true : (stryCov_9fa48("5947", "5948"), isValidAmazonUrl(productUrl))) {
          if (stryMutAct_9fa48("5949")) {
            {}
          } else {
            stryCov_9fa48("5949");
            const affiliateUrl = generateAffiliateLink(productUrl, stryMutAct_9fa48("5950") ? {} : (stryCov_9fa48("5950"), {
              campaign: stryMutAct_9fa48("5951") ? "" : (stryCov_9fa48("5951"), 'wishlist_redirect'),
              medium: stryMutAct_9fa48("5952") ? "" : (stryCov_9fa48("5952"), 'view_on_amazon_button'),
              source: stryMutAct_9fa48("5953") ? "" : (stryCov_9fa48("5953"), 'product_page')
            }));

            // Track the affiliate click for analytics
            console.log(stryMutAct_9fa48("5954") ? "" : (stryCov_9fa48("5954"), 'Amazon affiliate click tracked:'), stryMutAct_9fa48("5955") ? {} : (stryCov_9fa48("5955"), {
              productId: product.id,
              productName,
              affiliateUrl,
              timestamp: new Date().toISOString()
            }));
            window.open(affiliateUrl, stryMutAct_9fa48("5956") ? "" : (stryCov_9fa48("5956"), '_blank'), stryMutAct_9fa48("5957") ? "" : (stryCov_9fa48("5957"), 'noopener,noreferrer'));
            toast.success(stryMutAct_9fa48("5958") ? "" : (stryCov_9fa48("5958"), 'Redirecting to Amazon...'));
          }
        } else {
          if (stryMutAct_9fa48("5959")) {
            {}
          } else {
            stryCov_9fa48("5959");
            window.open(productUrl, stryMutAct_9fa48("5960") ? "" : (stryCov_9fa48("5960"), '_blank'), stryMutAct_9fa48("5961") ? "" : (stryCov_9fa48("5961"), 'noopener,noreferrer'));
          }
        }
      }
    };
    const formatPrice = (price: number, currency: string = stryMutAct_9fa48("5962") ? "" : (stryCov_9fa48("5962"), 'GBP')) => {
      if (stryMutAct_9fa48("5963")) {
        {}
      } else {
        stryCov_9fa48("5963");
        return new Intl.NumberFormat(stryMutAct_9fa48("5964") ? "" : (stryCov_9fa48("5964"), 'en-GB'), stryMutAct_9fa48("5965") ? {} : (stryCov_9fa48("5965"), {
          style: stryMutAct_9fa48("5966") ? "" : (stryCov_9fa48("5966"), 'currency'),
          currency: currency
        })).format(price);
      }
    };
    return <div className="space-y-4">
      {/* Price Display */}
      <div className="border-t border-gray-200 pt-6">
        <div className="text-3xl font-bold text-gray-900">
          {formatPrice(product.price, product.currency)}
        </div>
      </div>

      {/* Product Availability Status */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-sm font-medium text-blue-700">
          Available on Amazon
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Primary Action: View on Amazon */}
        {stryMutAct_9fa48("5969") ? product.affiliate_url || product.url || <button onClick={handleViewOnAmazon} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#ff9900] text-white rounded-lg hover:bg-[#e88800] font-medium transition-colors">
            <ExternalLink className="w-5 h-5" />
            Buy on Amazon
          </button> : stryMutAct_9fa48("5968") ? false : stryMutAct_9fa48("5967") ? true : (stryCov_9fa48("5967", "5968", "5969"), (stryMutAct_9fa48("5971") ? product.affiliate_url && product.url : stryMutAct_9fa48("5970") ? true : (stryCov_9fa48("5970", "5971"), product.affiliate_url || product.url)) && <button onClick={handleViewOnAmazon} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#ff9900] text-white rounded-lg hover:bg-[#e88800] font-medium transition-colors">
            <ExternalLink className="w-5 h-5" />
            Buy on Amazon
          </button>)}

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Add to Wishlist Button */}
          <button onClick={handleAddToWishlist} disabled={isTogglingWishlist} className={stryMutAct_9fa48("5972") ? `` : (stryCov_9fa48("5972"), `flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${isInWishlist ? stryMutAct_9fa48("5973") ? "" : (stryCov_9fa48("5973"), 'border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100') : stryMutAct_9fa48("5974") ? "" : (stryCov_9fa48("5974"), 'border-gray-300 text-gray-700 hover:bg-gray-50')} disabled:opacity-50`)}>
            {isTogglingWishlist ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : isInWishlist ? <Heart className="w-4 h-4 fill-current" /> : <Plus className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isInWishlist ? stryMutAct_9fa48("5975") ? "" : (stryCov_9fa48("5975"), 'In Wishlist') : stryMutAct_9fa48("5976") ? "" : (stryCov_9fa48("5976"), 'Add to Wishlist')}
            </span>
          </button>

          {/* Share Button */}
          <button onClick={handleShare} className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Authentication Prompt */}
      {stryMutAct_9fa48("5979") ? !isAuthenticated || <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <strong>Sign in</strong> to save items to wishlists, share with friends, and get personalised recommendations.
          </p>
          <div className="mt-2 space-x-3">
            <button onClick={() => router.push(`/auth/login?redirect=/products/${product.id}`)} className="text-sm font-medium text-blue-800 underline hover:no-underline">
              Sign In
            </button>
            <button onClick={() => router.push(`/auth/register?redirect=/products/${product.id}`)} className="text-sm font-medium text-blue-800 underline hover:no-underline">
              Sign Up
            </button>
          </div>
        </div> : stryMutAct_9fa48("5978") ? false : stryMutAct_9fa48("5977") ? true : (stryCov_9fa48("5977", "5978", "5979"), (stryMutAct_9fa48("5980") ? isAuthenticated : (stryCov_9fa48("5980"), !isAuthenticated)) && <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <strong>Sign in</strong> to save items to wishlists, share with friends, and get personalised recommendations.
          </p>
          <div className="mt-2 space-x-3">
            <button onClick={stryMutAct_9fa48("5981") ? () => undefined : (stryCov_9fa48("5981"), () => router.push(stryMutAct_9fa48("5982") ? `` : (stryCov_9fa48("5982"), `/auth/login?redirect=/products/${product.id}`)))} className="text-sm font-medium text-blue-800 underline hover:no-underline">
              Sign In
            </button>
            <button onClick={stryMutAct_9fa48("5983") ? () => undefined : (stryCov_9fa48("5983"), () => router.push(stryMutAct_9fa48("5984") ? `` : (stryCov_9fa48("5984"), `/auth/register?redirect=/products/${product.id}`)))} className="text-sm font-medium text-blue-800 underline hover:no-underline">
              Sign Up
            </button>
          </div>
        </div>)}
    </div>;
  }
}