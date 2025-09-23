/**
 * Wishlist Actions Component - Client Component
 *
 * Interactive dropdown menu for wishlist management actions.
 * Provides edit, share, delete, and other actions for individual wishlists.
 * 
 * Client Component Features:
 * - Dropdown menu interaction
 * - Modal dialogs for actions
 * - Server action integration
 * - Optimistic updates
 * - Loading states and error handling
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
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Share2, Trash2, Copy, ExternalLink } from 'lucide-react';
import { deleteWishlistAction, generateShareLinkAction } from '@/app/actions/wishlists';
import { useRouter } from 'next/navigation';

// ==============================================================================
// TYPES
// ==============================================================================

interface Wishlist {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
  share_token?: string;
}
interface WishlistActionsProps {
  wishlist: Wishlist;
}

// ==============================================================================
// COMPONENT
// ==============================================================================

/**
 * WishlistActions Client Component
 * 
 * Renders an action dropdown menu for wishlist management.
 * Handles edit, share, delete, and other wishlist operations.
 */
export function WishlistActions({
  wishlist
}: WishlistActionsProps) {
  if (stryMutAct_9fa48("8100")) {
    {}
  } else {
    stryCov_9fa48("8100");
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(stryMutAct_9fa48("8101") ? true : (stryCov_9fa48("8101"), false));
    const [isDeleting, setIsDeleting] = useState(stryMutAct_9fa48("8102") ? true : (stryCov_9fa48("8102"), false));
    const [isGeneratingLink, setIsGeneratingLink] = useState(stryMutAct_9fa48("8103") ? true : (stryCov_9fa48("8103"), false));
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(stryMutAct_9fa48("8104") ? true : (stryCov_9fa48("8104"), false));

    // ==============================================================================
    // EFFECTS
    // ==============================================================================

    // Close dropdown when clicking outside
    useEffect(() => {
      if (stryMutAct_9fa48("8105")) {
        {}
      } else {
        stryCov_9fa48("8105");
        function handleClickOutside(event: MouseEvent) {
          if (stryMutAct_9fa48("8106")) {
            {}
          } else {
            stryCov_9fa48("8106");
            if (stryMutAct_9fa48("8109") ? dropdownRef.current || !dropdownRef.current.contains(event.target as Node) : stryMutAct_9fa48("8108") ? false : stryMutAct_9fa48("8107") ? true : (stryCov_9fa48("8107", "8108", "8109"), dropdownRef.current && (stryMutAct_9fa48("8110") ? dropdownRef.current.contains(event.target as Node) : (stryCov_9fa48("8110"), !dropdownRef.current.contains(event.target as Node))))) {
              if (stryMutAct_9fa48("8111")) {
                {}
              } else {
                stryCov_9fa48("8111");
                setIsDropdownOpen(stryMutAct_9fa48("8112") ? true : (stryCov_9fa48("8112"), false));
              }
            }
          }
        }
        if (stryMutAct_9fa48("8114") ? false : stryMutAct_9fa48("8113") ? true : (stryCov_9fa48("8113", "8114"), isDropdownOpen)) {
          if (stryMutAct_9fa48("8115")) {
            {}
          } else {
            stryCov_9fa48("8115");
            document.addEventListener(stryMutAct_9fa48("8116") ? "" : (stryCov_9fa48("8116"), 'mousedown'), handleClickOutside);
            return stryMutAct_9fa48("8117") ? () => undefined : (stryCov_9fa48("8117"), () => document.removeEventListener(stryMutAct_9fa48("8118") ? "" : (stryCov_9fa48("8118"), 'mousedown'), handleClickOutside));
          }
        }
      }
    }, stryMutAct_9fa48("8119") ? [] : (stryCov_9fa48("8119"), [isDropdownOpen]));

    // ==============================================================================
    // HANDLERS
    // ==============================================================================

    const toggleDropdown = useCallback(() => {
      if (stryMutAct_9fa48("8120")) {
        {}
      } else {
        stryCov_9fa48("8120");
        setIsDropdownOpen(stryMutAct_9fa48("8121") ? () => undefined : (stryCov_9fa48("8121"), prev => stryMutAct_9fa48("8122") ? prev : (stryCov_9fa48("8122"), !prev)));
      }
    }, stryMutAct_9fa48("8123") ? ["Stryker was here"] : (stryCov_9fa48("8123"), []));
    const closeDropdown = useCallback(() => {
      if (stryMutAct_9fa48("8124")) {
        {}
      } else {
        stryCov_9fa48("8124");
        setIsDropdownOpen(stryMutAct_9fa48("8125") ? true : (stryCov_9fa48("8125"), false));
      }
    }, stryMutAct_9fa48("8126") ? ["Stryker was here"] : (stryCov_9fa48("8126"), []));
    const handleEdit = useCallback(() => {
      if (stryMutAct_9fa48("8127")) {
        {}
      } else {
        stryCov_9fa48("8127");
        closeDropdown();
        router.push(stryMutAct_9fa48("8128") ? `` : (stryCov_9fa48("8128"), `/wishlists/${wishlist.id}/edit`));
      }
    }, stryMutAct_9fa48("8129") ? [] : (stryCov_9fa48("8129"), [closeDropdown, router, wishlist.id]));
    const handleView = useCallback(() => {
      if (stryMutAct_9fa48("8130")) {
        {}
      } else {
        stryCov_9fa48("8130");
        closeDropdown();
        router.push(stryMutAct_9fa48("8131") ? `` : (stryCov_9fa48("8131"), `/wishlists/${wishlist.id}`));
      }
    }, stryMutAct_9fa48("8132") ? [] : (stryCov_9fa48("8132"), [closeDropdown, router, wishlist.id]));
    const handleGenerateShareLink = useCallback(async () => {
      if (stryMutAct_9fa48("8133")) {
        {}
      } else {
        stryCov_9fa48("8133");
        if (stryMutAct_9fa48("8136") ? false : stryMutAct_9fa48("8135") ? true : stryMutAct_9fa48("8134") ? wishlist.is_public : (stryCov_9fa48("8134", "8135", "8136"), !wishlist.is_public)) {
          if (stryMutAct_9fa48("8137")) {
            {}
          } else {
            stryCov_9fa48("8137");
            return;
          }
        }
        setIsGeneratingLink(stryMutAct_9fa48("8138") ? false : (stryCov_9fa48("8138"), true));
        closeDropdown();
        try {
          if (stryMutAct_9fa48("8139")) {
            {}
          } else {
            stryCov_9fa48("8139");
            const result = await generateShareLinkAction(wishlist.id);
            if (stryMutAct_9fa48("8142") ? result.success || result.data : stryMutAct_9fa48("8141") ? false : stryMutAct_9fa48("8140") ? true : (stryCov_9fa48("8140", "8141", "8142"), result.success && result.data)) {
              if (stryMutAct_9fa48("8143")) {
                {}
              } else {
                stryCov_9fa48("8143");
                setShareUrl(result.data.shareUrl);
              }
            } else {
              if (stryMutAct_9fa48("8144")) {
                {}
              } else {
                stryCov_9fa48("8144");
                console.error(stryMutAct_9fa48("8145") ? "" : (stryCov_9fa48("8145"), 'Failed to generate share link:'), result.error);
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("8146")) {
            {}
          } else {
            stryCov_9fa48("8146");
            console.error(stryMutAct_9fa48("8147") ? "" : (stryCov_9fa48("8147"), 'Error generating share link:'), error);
          }
        } finally {
          if (stryMutAct_9fa48("8148")) {
            {}
          } else {
            stryCov_9fa48("8148");
            setIsGeneratingLink(stryMutAct_9fa48("8149") ? true : (stryCov_9fa48("8149"), false));
          }
        }
      }
    }, stryMutAct_9fa48("8150") ? [] : (stryCov_9fa48("8150"), [wishlist.id, wishlist.is_public, closeDropdown]));
    const handleCopyShareLink = useCallback(async () => {
      if (stryMutAct_9fa48("8151")) {
        {}
      } else {
        stryCov_9fa48("8151");
        if (stryMutAct_9fa48("8154") ? false : stryMutAct_9fa48("8153") ? true : stryMutAct_9fa48("8152") ? shareUrl : (stryCov_9fa48("8152", "8153", "8154"), !shareUrl)) return;
        try {
          if (stryMutAct_9fa48("8155")) {
            {}
          } else {
            stryCov_9fa48("8155");
            await navigator.clipboard.writeText(shareUrl);
            // You could show a toast notification here
          }
        } catch (error) {
          if (stryMutAct_9fa48("8156")) {
            {}
          } else {
            stryCov_9fa48("8156");
            console.error(stryMutAct_9fa48("8157") ? "" : (stryCov_9fa48("8157"), 'Failed to copy to clipboard:'), error);
          }
        }
      }
    }, stryMutAct_9fa48("8158") ? [] : (stryCov_9fa48("8158"), [shareUrl]));
    const handleDeleteClick = useCallback(() => {
      if (stryMutAct_9fa48("8159")) {
        {}
      } else {
        stryCov_9fa48("8159");
        closeDropdown();
        setShowDeleteConfirm(stryMutAct_9fa48("8160") ? false : (stryCov_9fa48("8160"), true));
      }
    }, stryMutAct_9fa48("8161") ? [] : (stryCov_9fa48("8161"), [closeDropdown]));
    const handleDeleteConfirm = useCallback(async () => {
      if (stryMutAct_9fa48("8162")) {
        {}
      } else {
        stryCov_9fa48("8162");
        setIsDeleting(stryMutAct_9fa48("8163") ? false : (stryCov_9fa48("8163"), true));
        try {
          if (stryMutAct_9fa48("8164")) {
            {}
          } else {
            stryCov_9fa48("8164");
            const result = await deleteWishlistAction(wishlist.id);
            if (stryMutAct_9fa48("8166") ? false : stryMutAct_9fa48("8165") ? true : (stryCov_9fa48("8165", "8166"), result.success)) {
              if (stryMutAct_9fa48("8167")) {
                {}
              } else {
                stryCov_9fa48("8167");
                setShowDeleteConfirm(stryMutAct_9fa48("8168") ? true : (stryCov_9fa48("8168"), false));
                router.refresh(); // Refresh the page to remove the deleted wishlist
              }
            } else {
              if (stryMutAct_9fa48("8169")) {
                {}
              } else {
                stryCov_9fa48("8169");
                console.error(stryMutAct_9fa48("8170") ? "" : (stryCov_9fa48("8170"), 'Failed to delete wishlist:'), result.error);
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("8171")) {
            {}
          } else {
            stryCov_9fa48("8171");
            console.error(stryMutAct_9fa48("8172") ? "" : (stryCov_9fa48("8172"), 'Error deleting wishlist:'), error);
          }
        } finally {
          if (stryMutAct_9fa48("8173")) {
            {}
          } else {
            stryCov_9fa48("8173");
            setIsDeleting(stryMutAct_9fa48("8174") ? true : (stryCov_9fa48("8174"), false));
          }
        }
      }
    }, stryMutAct_9fa48("8175") ? [] : (stryCov_9fa48("8175"), [wishlist.id, router]));
    const handleDeleteCancel = useCallback(() => {
      if (stryMutAct_9fa48("8176")) {
        {}
      } else {
        stryCov_9fa48("8176");
        setShowDeleteConfirm(stryMutAct_9fa48("8177") ? true : (stryCov_9fa48("8177"), false));
      }
    }, stryMutAct_9fa48("8178") ? ["Stryker was here"] : (stryCov_9fa48("8178"), []));

    // ==============================================================================
    // RENDER
    // ==============================================================================

    return <>
      {/* Actions Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button onClick={toggleDropdown} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" disabled={isDeleting}>
          <MoreVertical className="w-4 h-4" />
        </button>

        {stryMutAct_9fa48("8181") ? isDropdownOpen || <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            {/* View Wishlist */}
            <button onClick={handleView} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View Wishlist
            </button>

            {/* Edit Wishlist */}
            <button onClick={handleEdit} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Wishlist
            </button>

            {/* Share Wishlist */}
            {wishlist.is_public && <button onClick={handleGenerateShareLink} disabled={isGeneratingLink} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50">
                <Share2 className="w-4 h-4" />
                {isGeneratingLink ? 'Generating Link...' : 'Share Wishlist'}
              </button>}

            <div className="border-t border-gray-100 my-1" />

            {/* Delete Wishlist */}
            <button onClick={handleDeleteClick} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Wishlist
            </button>
          </div> : stryMutAct_9fa48("8180") ? false : stryMutAct_9fa48("8179") ? true : (stryCov_9fa48("8179", "8180", "8181"), isDropdownOpen && <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            {/* View Wishlist */}
            <button onClick={handleView} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View Wishlist
            </button>

            {/* Edit Wishlist */}
            <button onClick={handleEdit} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Wishlist
            </button>

            {/* Share Wishlist */}
            {stryMutAct_9fa48("8184") ? wishlist.is_public || <button onClick={handleGenerateShareLink} disabled={isGeneratingLink} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50">
                <Share2 className="w-4 h-4" />
                {isGeneratingLink ? 'Generating Link...' : 'Share Wishlist'}
              </button> : stryMutAct_9fa48("8183") ? false : stryMutAct_9fa48("8182") ? true : (stryCov_9fa48("8182", "8183", "8184"), wishlist.is_public && <button onClick={handleGenerateShareLink} disabled={isGeneratingLink} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50">
                <Share2 className="w-4 h-4" />
                {isGeneratingLink ? stryMutAct_9fa48("8185") ? "" : (stryCov_9fa48("8185"), 'Generating Link...') : stryMutAct_9fa48("8186") ? "" : (stryCov_9fa48("8186"), 'Share Wishlist')}
              </button>)}

            <div className="border-t border-gray-100 my-1" />

            {/* Delete Wishlist */}
            <button onClick={handleDeleteClick} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Wishlist
            </button>
          </div>)}
      </div>

      {/* Share Link Modal */}
      {stryMutAct_9fa48("8189") ? shareUrl || <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Share Wishlist
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Share this link with friends and family so they can view your wishlist:
            </p>

            <div className="flex gap-2 mb-4">
              <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm" />
              <button onClick={handleCopyShareLink} className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1">
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setShareUrl(null)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("8188") ? false : stryMutAct_9fa48("8187") ? true : (stryCov_9fa48("8187", "8188", "8189"), shareUrl && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Share Wishlist
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Share this link with friends and family so they can view your wishlist:
            </p>

            <div className="flex gap-2 mb-4">
              <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm" />
              <button onClick={handleCopyShareLink} className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1">
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>

            <div className="flex justify-end">
              <button onClick={stryMutAct_9fa48("8190") ? () => undefined : (stryCov_9fa48("8190"), () => setShareUrl(null))} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>)}

      {/* Delete Confirmation Modal */}
      {stryMutAct_9fa48("8193") ? showDeleteConfirm || <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Wishlist
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "{wishlist.name}"? This action cannot be undone 
              and will remove all {wishlist.product_count} items from this wishlist.
            </p>

            <div className="flex gap-3">
              <button onClick={handleDeleteCancel} disabled={isDeleting} className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} disabled={isDeleting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isDeleting ? <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </> : <>
                    <Trash2 className="w-4 h-4" />
                    Delete Wishlist
                  </>}
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("8192") ? false : stryMutAct_9fa48("8191") ? true : (stryCov_9fa48("8191", "8192", "8193"), showDeleteConfirm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Wishlist
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "{wishlist.name}"? This action cannot be undone 
              and will remove all {wishlist.product_count} items from this wishlist.
            </p>

            <div className="flex gap-3">
              <button onClick={handleDeleteCancel} disabled={isDeleting} className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} disabled={isDeleting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isDeleting ? <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </> : <>
                    <Trash2 className="w-4 h-4" />
                    Delete Wishlist
                  </>}
              </button>
            </div>
          </div>
        </div>)}
    </>;
  }
}

// ==============================================================================
// EXPORTS
// ==============================================================================

export default WishlistActions;