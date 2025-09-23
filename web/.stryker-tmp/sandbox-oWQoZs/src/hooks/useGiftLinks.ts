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
import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
export interface GiftLink {
  id: string;
  token: string;
  title: string;
  description: string;
  userId: string;
  products: Product[];
  preferences: any;
  isPublic: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  analytics: {
    views: number;
    clicks: number;
    shares: number;
    conversions: number;
  };
  customization: {
    theme: 'default' | 'minimal' | 'festive' | 'elegant';
    backgroundColor: string;
    accentColor: string;
    showBranding: boolean;
  };
}
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  affiliateUrl: string;
  brand: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}
export interface CreateGiftLinkRequest {
  title: string;
  description?: string;
  product_ids: string[];
  preferences?: any;
  isPublic?: boolean;
  expiresAt?: Date;
  customization?: Partial<GiftLink['customization']>;
}
export interface ShareOptions {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email' | 'copy' | 'qr';
  message?: string;
  hashtags?: string[];
}
interface UseGiftLinksReturn {
  giftLinks: GiftLink[];
  isLoading: boolean;
  error: string | null;
  createGiftLink: (data: CreateGiftLinkRequest) => Promise<GiftLink>;
  updateGiftLink: (id: string, data: Partial<GiftLink>) => Promise<GiftLink>;
  deleteGiftLink: (id: string) => Promise<void>;
  getGiftLink: (token: string) => Promise<GiftLink>;
  shareGiftLink: (giftLink: GiftLink, options: ShareOptions) => Promise<void>;
  generateQRCode: (giftLink: GiftLink) => Promise<string>;
  trackAnalytics: (token: string, event: 'view' | 'click' | 'share' | 'conversion') => Promise<void>;
  getShareUrl: (giftLink: GiftLink) => string;
  loadUserGiftLinks: () => Promise<void>;
}
export function useGiftLinks(): UseGiftLinksReturn {
  if (stryMutAct_9fa48("9134")) {
    {}
  } else {
    stryCov_9fa48("9134");
    const [giftLinks, setGiftLinks] = useState<GiftLink[]>(stryMutAct_9fa48("9135") ? ["Stryker was here"] : (stryCov_9fa48("9135"), []));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("9136") ? true : (stryCov_9fa48("9136"), false));
    const [error, setError] = useState<string | null>(null);
    const createGiftLink = useCallback(async (data: CreateGiftLinkRequest): Promise<GiftLink> => {
      if (stryMutAct_9fa48("9137")) {
        {}
      } else {
        stryCov_9fa48("9137");
        setIsLoading(stryMutAct_9fa48("9138") ? false : (stryCov_9fa48("9138"), true));
        setError(null);
        try {
          if (stryMutAct_9fa48("9139")) {
            {}
          } else {
            stryCov_9fa48("9139");
            const response = await api.giftLinks.create(data);
            const newGiftLink = response.giftLink;
            setGiftLinks(stryMutAct_9fa48("9140") ? () => undefined : (stryCov_9fa48("9140"), prev => stryMutAct_9fa48("9141") ? [] : (stryCov_9fa48("9141"), [newGiftLink, ...prev])));
            return newGiftLink;
          }
        } catch (err) {
          if (stryMutAct_9fa48("9142")) {
            {}
          } else {
            stryCov_9fa48("9142");
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("9143") ? "" : (stryCov_9fa48("9143"), 'Failed to create gift link');
            setError(errorMessage);
            throw new Error(errorMessage);
          }
        } finally {
          if (stryMutAct_9fa48("9144")) {
            {}
          } else {
            stryCov_9fa48("9144");
            setIsLoading(stryMutAct_9fa48("9145") ? true : (stryCov_9fa48("9145"), false));
          }
        }
      }
    }, stryMutAct_9fa48("9146") ? ["Stryker was here"] : (stryCov_9fa48("9146"), []));
    const updateGiftLink = useCallback(async (id: string, data: Partial<GiftLink>): Promise<GiftLink> => {
      if (stryMutAct_9fa48("9147")) {
        {}
      } else {
        stryCov_9fa48("9147");
        setIsLoading(stryMutAct_9fa48("9148") ? false : (stryCov_9fa48("9148"), true));
        setError(null);
        try {
          if (stryMutAct_9fa48("9149")) {
            {}
          } else {
            stryCov_9fa48("9149");
            const response = await api.giftLinks.update(id, data);
            const updatedGiftLink = response.giftLink;
            setGiftLinks(stryMutAct_9fa48("9150") ? () => undefined : (stryCov_9fa48("9150"), prev => prev.map(stryMutAct_9fa48("9151") ? () => undefined : (stryCov_9fa48("9151"), link => (stryMutAct_9fa48("9154") ? link.id !== id : stryMutAct_9fa48("9153") ? false : stryMutAct_9fa48("9152") ? true : (stryCov_9fa48("9152", "9153", "9154"), link.id === id)) ? updatedGiftLink : link))));
            return updatedGiftLink;
          }
        } catch (err) {
          if (stryMutAct_9fa48("9155")) {
            {}
          } else {
            stryCov_9fa48("9155");
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("9156") ? "" : (stryCov_9fa48("9156"), 'Failed to update gift link');
            setError(errorMessage);
            throw new Error(errorMessage);
          }
        } finally {
          if (stryMutAct_9fa48("9157")) {
            {}
          } else {
            stryCov_9fa48("9157");
            setIsLoading(stryMutAct_9fa48("9158") ? true : (stryCov_9fa48("9158"), false));
          }
        }
      }
    }, stryMutAct_9fa48("9159") ? ["Stryker was here"] : (stryCov_9fa48("9159"), []));
    const deleteGiftLink = useCallback(async (id: string): Promise<void> => {
      if (stryMutAct_9fa48("9160")) {
        {}
      } else {
        stryCov_9fa48("9160");
        setIsLoading(stryMutAct_9fa48("9161") ? false : (stryCov_9fa48("9161"), true));
        setError(null);
        try {
          if (stryMutAct_9fa48("9162")) {
            {}
          } else {
            stryCov_9fa48("9162");
            await api.giftLinks.delete(id);
            setGiftLinks(stryMutAct_9fa48("9163") ? () => undefined : (stryCov_9fa48("9163"), prev => stryMutAct_9fa48("9164") ? prev : (stryCov_9fa48("9164"), prev.filter(stryMutAct_9fa48("9165") ? () => undefined : (stryCov_9fa48("9165"), link => stryMutAct_9fa48("9168") ? link.id === id : stryMutAct_9fa48("9167") ? false : stryMutAct_9fa48("9166") ? true : (stryCov_9fa48("9166", "9167", "9168"), link.id !== id))))));
          }
        } catch (err) {
          if (stryMutAct_9fa48("9169")) {
            {}
          } else {
            stryCov_9fa48("9169");
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("9170") ? "" : (stryCov_9fa48("9170"), 'Failed to delete gift link');
            setError(errorMessage);
            throw new Error(errorMessage);
          }
        } finally {
          if (stryMutAct_9fa48("9171")) {
            {}
          } else {
            stryCov_9fa48("9171");
            setIsLoading(stryMutAct_9fa48("9172") ? true : (stryCov_9fa48("9172"), false));
          }
        }
      }
    }, stryMutAct_9fa48("9173") ? ["Stryker was here"] : (stryCov_9fa48("9173"), []));
    const getGiftLink = useCallback(async (token: string): Promise<GiftLink> => {
      if (stryMutAct_9fa48("9174")) {
        {}
      } else {
        stryCov_9fa48("9174");
        setIsLoading(stryMutAct_9fa48("9175") ? false : (stryCov_9fa48("9175"), true));
        setError(null);
        try {
          if (stryMutAct_9fa48("9176")) {
            {}
          } else {
            stryCov_9fa48("9176");
            const response = await api.giftLinks.getByToken(token);
            return response.giftLink;
          }
        } catch (err) {
          if (stryMutAct_9fa48("9177")) {
            {}
          } else {
            stryCov_9fa48("9177");
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("9178") ? "" : (stryCov_9fa48("9178"), 'Failed to load gift link');
            setError(errorMessage);
            throw new Error(errorMessage);
          }
        } finally {
          if (stryMutAct_9fa48("9179")) {
            {}
          } else {
            stryCov_9fa48("9179");
            setIsLoading(stryMutAct_9fa48("9180") ? true : (stryCov_9fa48("9180"), false));
          }
        }
      }
    }, stryMutAct_9fa48("9181") ? ["Stryker was here"] : (stryCov_9fa48("9181"), []));
    const loadUserGiftLinks = useCallback(async (): Promise<void> => {
      if (stryMutAct_9fa48("9182")) {
        {}
      } else {
        stryCov_9fa48("9182");
        setIsLoading(stryMutAct_9fa48("9183") ? false : (stryCov_9fa48("9183"), true));
        setError(null);
        try {
          if (stryMutAct_9fa48("9184")) {
            {}
          } else {
            stryCov_9fa48("9184");
            const response = await api.giftLinks.getUserGiftLinks();
            setGiftLinks(response.giftLinks);
          }
        } catch (err) {
          if (stryMutAct_9fa48("9185")) {
            {}
          } else {
            stryCov_9fa48("9185");
            const errorMessage = err instanceof Error ? err.message : stryMutAct_9fa48("9186") ? "" : (stryCov_9fa48("9186"), 'Failed to load gift links');
            setError(errorMessage);
          }
        } finally {
          if (stryMutAct_9fa48("9187")) {
            {}
          } else {
            stryCov_9fa48("9187");
            setIsLoading(stryMutAct_9fa48("9188") ? true : (stryCov_9fa48("9188"), false));
          }
        }
      }
    }, stryMutAct_9fa48("9189") ? ["Stryker was here"] : (stryCov_9fa48("9189"), []));
    const getShareUrl = useCallback((giftLink: GiftLink): string => {
      if (stryMutAct_9fa48("9190")) {
        {}
      } else {
        stryCov_9fa48("9190");
        const baseUrl = stryMutAct_9fa48("9193") ? process.env.NEXT_PUBLIC_WEB_URL && 'https://aclue.app' : stryMutAct_9fa48("9192") ? false : stryMutAct_9fa48("9191") ? true : (stryCov_9fa48("9191", "9192", "9193"), process.env.NEXT_PUBLIC_WEB_URL || (stryMutAct_9fa48("9194") ? "" : (stryCov_9fa48("9194"), 'https://aclue.app')));
        return stryMutAct_9fa48("9195") ? `` : (stryCov_9fa48("9195"), `${baseUrl}/gift/${giftLink.token}`);
      }
    }, stryMutAct_9fa48("9196") ? ["Stryker was here"] : (stryCov_9fa48("9196"), []));
    const shareGiftLink = useCallback(async (giftLink: GiftLink, options: ShareOptions): Promise<void> => {
      if (stryMutAct_9fa48("9197")) {
        {}
      } else {
        stryCov_9fa48("9197");
        const shareUrl = getShareUrl(giftLink);
        const defaultMessage = stryMutAct_9fa48("9198") ? `` : (stryCov_9fa48("9198"), `Check out these amazing gift recommendations I found on aclue: ${giftLink.title}`);
        const message = stryMutAct_9fa48("9201") ? options.message && defaultMessage : stryMutAct_9fa48("9200") ? false : stryMutAct_9fa48("9199") ? true : (stryCov_9fa48("9199", "9200", "9201"), options.message || defaultMessage);
        try {
          if (stryMutAct_9fa48("9202")) {
            {}
          } else {
            stryCov_9fa48("9202");
            switch (options.platform) {
              case stryMutAct_9fa48("9204") ? "" : (stryCov_9fa48("9204"), 'facebook'):
                if (stryMutAct_9fa48("9203")) {} else {
                  stryCov_9fa48("9203");
                  window.open(stryMutAct_9fa48("9205") ? `` : (stryCov_9fa48("9205"), `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`), stryMutAct_9fa48("9206") ? "" : (stryCov_9fa48("9206"), '_blank'), stryMutAct_9fa48("9207") ? "" : (stryCov_9fa48("9207"), 'width=600,height=400'));
                  break;
                }
              case stryMutAct_9fa48("9209") ? "" : (stryCov_9fa48("9209"), 'twitter'):
                if (stryMutAct_9fa48("9208")) {} else {
                  stryCov_9fa48("9208");
                  const hashtags = options.hashtags ? stryMutAct_9fa48("9210") ? `` : (stryCov_9fa48("9210"), `&hashtags=${options.hashtags.join(stryMutAct_9fa48("9211") ? "" : (stryCov_9fa48("9211"), ','))}`) : stryMutAct_9fa48("9212") ? "Stryker was here!" : (stryCov_9fa48("9212"), '');
                  window.open(stryMutAct_9fa48("9213") ? `` : (stryCov_9fa48("9213"), `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}${hashtags}`), stryMutAct_9fa48("9214") ? "" : (stryCov_9fa48("9214"), '_blank'), stryMutAct_9fa48("9215") ? "" : (stryCov_9fa48("9215"), 'width=600,height=400'));
                  break;
                }
              case stryMutAct_9fa48("9217") ? "" : (stryCov_9fa48("9217"), 'linkedin'):
                if (stryMutAct_9fa48("9216")) {} else {
                  stryCov_9fa48("9216");
                  window.open(stryMutAct_9fa48("9218") ? `` : (stryCov_9fa48("9218"), `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`), stryMutAct_9fa48("9219") ? "" : (stryCov_9fa48("9219"), '_blank'), stryMutAct_9fa48("9220") ? "" : (stryCov_9fa48("9220"), 'width=600,height=400'));
                  break;
                }
              case stryMutAct_9fa48("9222") ? "" : (stryCov_9fa48("9222"), 'whatsapp'):
                if (stryMutAct_9fa48("9221")) {} else {
                  stryCov_9fa48("9221");
                  window.open(stryMutAct_9fa48("9223") ? `` : (stryCov_9fa48("9223"), `https://wa.me/?text=${encodeURIComponent(stryMutAct_9fa48("9224") ? `` : (stryCov_9fa48("9224"), `${message} ${shareUrl}`))}`), stryMutAct_9fa48("9225") ? "" : (stryCov_9fa48("9225"), '_blank'));
                  break;
                }
              case stryMutAct_9fa48("9227") ? "" : (stryCov_9fa48("9227"), 'email'):
                if (stryMutAct_9fa48("9226")) {} else {
                  stryCov_9fa48("9226");
                  const subject = encodeURIComponent(giftLink.title);
                  const body = encodeURIComponent(stryMutAct_9fa48("9228") ? `` : (stryCov_9fa48("9228"), `${message}\n\n${shareUrl}`));
                  window.open(stryMutAct_9fa48("9229") ? `` : (stryCov_9fa48("9229"), `mailto:?subject=${subject}&body=${body}`));
                  break;
                }
              case stryMutAct_9fa48("9231") ? "" : (stryCov_9fa48("9231"), 'copy'):
                if (stryMutAct_9fa48("9230")) {} else {
                  stryCov_9fa48("9230");
                  await navigator.clipboard.writeText(shareUrl);
                  break;
                }
              case stryMutAct_9fa48("9233") ? "" : (stryCov_9fa48("9233"), 'qr'):
                if (stryMutAct_9fa48("9232")) {} else {
                  stryCov_9fa48("9232");
                  // QR code sharing handled separately
                  break;
                }
              default:
                if (stryMutAct_9fa48("9234")) {} else {
                  stryCov_9fa48("9234");
                  throw new Error(stryMutAct_9fa48("9235") ? `` : (stryCov_9fa48("9235"), `Unsupported platform: ${options.platform}`));
                }
            }

            // Track share analytics
            await trackAnalytics(giftLink.token, stryMutAct_9fa48("9236") ? "" : (stryCov_9fa48("9236"), 'share'));
          }
        } catch (err) {
          if (stryMutAct_9fa48("9237")) {
            {}
          } else {
            stryCov_9fa48("9237");
            throw new Error(stryMutAct_9fa48("9238") ? `` : (stryCov_9fa48("9238"), `Failed to share on ${options.platform}: ${err instanceof Error ? err.message : stryMutAct_9fa48("9239") ? "" : (stryCov_9fa48("9239"), 'Unknown error')}`));
          }
        }
      }
    }, stryMutAct_9fa48("9240") ? [] : (stryCov_9fa48("9240"), [getShareUrl]));
    const generateQRCode = useCallback(async (giftLink: GiftLink): Promise<string> => {
      if (stryMutAct_9fa48("9241")) {
        {}
      } else {
        stryCov_9fa48("9241");
        const shareUrl = getShareUrl(giftLink);
        try {
          if (stryMutAct_9fa48("9242")) {
            {}
          } else {
            stryCov_9fa48("9242");
            // Use a QR code generation service or library
            const response = await fetch(stryMutAct_9fa48("9243") ? `` : (stryCov_9fa48("9243"), `/api/qr-code?url=${encodeURIComponent(shareUrl)}`));
            if (stryMutAct_9fa48("9246") ? false : stryMutAct_9fa48("9245") ? true : stryMutAct_9fa48("9244") ? response.ok : (stryCov_9fa48("9244", "9245", "9246"), !response.ok)) {
              if (stryMutAct_9fa48("9247")) {
                {}
              } else {
                stryCov_9fa48("9247");
                throw new Error(stryMutAct_9fa48("9248") ? "" : (stryCov_9fa48("9248"), 'Failed to generate QR code'));
              }
            }
            const blob = await response.blob();
            return URL.createObjectURL(blob);
          }
        } catch (err) {
          if (stryMutAct_9fa48("9249")) {
            {}
          } else {
            stryCov_9fa48("9249");
            throw new Error(stryMutAct_9fa48("9250") ? `` : (stryCov_9fa48("9250"), `Failed to generate QR code: ${err instanceof Error ? err.message : stryMutAct_9fa48("9251") ? "" : (stryCov_9fa48("9251"), 'Unknown error')}`));
          }
        }
      }
    }, stryMutAct_9fa48("9252") ? [] : (stryCov_9fa48("9252"), [getShareUrl]));
    const trackAnalytics = useCallback(async (token: string, event: 'view' | 'click' | 'share' | 'conversion'): Promise<void> => {
      if (stryMutAct_9fa48("9253")) {
        {}
      } else {
        stryCov_9fa48("9253");
        try {
          if (stryMutAct_9fa48("9254")) {
            {}
          } else {
            stryCov_9fa48("9254");
            await api.giftLinks.trackAnalytics(token, stryMutAct_9fa48("9255") ? {} : (stryCov_9fa48("9255"), {
              event,
              timestamp: new Date()
            }));
          }
        } catch (err) {
          if (stryMutAct_9fa48("9256")) {
            {}
          } else {
            stryCov_9fa48("9256");
            // Silently fail analytics tracking
            console.warn(stryMutAct_9fa48("9257") ? "" : (stryCov_9fa48("9257"), 'Failed to track analytics:'), err);
          }
        }
      }
    }, stryMutAct_9fa48("9258") ? ["Stryker was here"] : (stryCov_9fa48("9258"), []));
    return stryMutAct_9fa48("9259") ? {} : (stryCov_9fa48("9259"), {
      giftLinks,
      isLoading,
      error,
      createGiftLink,
      updateGiftLink,
      deleteGiftLink,
      getGiftLink,
      shareGiftLink,
      generateQRCode,
      trackAnalytics,
      getShareUrl,
      loadUserGiftLinks
    });
  }
}