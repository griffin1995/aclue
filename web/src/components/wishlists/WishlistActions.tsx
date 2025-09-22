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

'use client';

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
export function WishlistActions({ wishlist }: WishlistActionsProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ==============================================================================
  // EFFECTS
  // ==============================================================================

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // ==============================================================================
  // HANDLERS
  // ==============================================================================

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleEdit = useCallback(() => {
    closeDropdown();
    router.push(`/wishlists/${wishlist.id}/edit`);
  }, [closeDropdown, router, wishlist.id]);

  const handleView = useCallback(() => {
    closeDropdown();
    router.push(`/wishlists/${wishlist.id}`);
  }, [closeDropdown, router, wishlist.id]);

  const handleGenerateShareLink = useCallback(async () => {
    if (!wishlist.is_public) {
      return;
    }

    setIsGeneratingLink(true);
    closeDropdown();

    try {
      const result = await generateShareLinkAction(wishlist.id);
      
      if (result.success && result.data) {
        setShareUrl(result.data.shareUrl);
      } else {
        console.error('Failed to generate share link:', result.error);
      }
    } catch (error) {
      console.error('Error generating share link:', error);
    } finally {
      setIsGeneratingLink(false);
    }
  }, [wishlist.id, wishlist.is_public, closeDropdown]);

  const handleCopyShareLink = useCallback(async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [shareUrl]);

  const handleDeleteClick = useCallback(() => {
    closeDropdown();
    setShowDeleteConfirm(true);
  }, [closeDropdown]);

  const handleDeleteConfirm = useCallback(async () => {
    setIsDeleting(true);

    try {
      const result = await deleteWishlistAction(wishlist.id);
      
      if (result.success) {
        setShowDeleteConfirm(false);
        router.refresh(); // Refresh the page to remove the deleted wishlist
      } else {
        console.error('Failed to delete wishlist:', result.error);
      }
    } catch (error) {
      console.error('Error deleting wishlist:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [wishlist.id, router]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  // ==============================================================================
  // RENDER
  // ==============================================================================

  return (
    <>
      {/* Actions Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          disabled={isDeleting}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            {/* View Wishlist */}
            <button
              onClick={handleView}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Wishlist
            </button>

            {/* Edit Wishlist */}
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Wishlist
            </button>

            {/* Share Wishlist */}
            {wishlist.is_public && (
              <button
                onClick={handleGenerateShareLink}
                disabled={isGeneratingLink}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                {isGeneratingLink ? 'Generating Link...' : 'Share Wishlist'}
              </button>
            )}

            <div className="border-t border-gray-100 my-1" />

            {/* Delete Wishlist */}
            <button
              onClick={handleDeleteClick}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Wishlist
            </button>
          </div>
        )}
      </div>

      {/* Share Link Modal */}
      {shareUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Share Wishlist
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Share this link with friends and family so they can view your wishlist:
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShareUrl(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Wishlist
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "{wishlist.name}"? This action cannot be undone 
              and will remove all {wishlist.product_count} items from this wishlist.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Wishlist
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ==============================================================================
// EXPORTS
// ==============================================================================

export default WishlistActions;