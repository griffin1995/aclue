/**
 * Create Wishlist Button Component - Client Component
 *
 * Interactive button for creating new wishlists with modal form.
 * Handles form state, validation, and submission with optimistic updates.
 * 
 * Client Component Features:
 * - Modal dialog interaction
 * - Form state management
 * - Real-time validation
 * - Loading states and error handling
 * - Server action integration
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Plus, X, Save, AlertCircle } from 'lucide-react';
import { createWishlistAction } from '@/app/actions/wishlists';
import { useRouter } from 'next/navigation';

// ==============================================================================
// TYPES
// ==============================================================================

interface CreateWishlistButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

interface CreateWishlistFormData {
  name: string;
  description: string;
  is_public: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  general?: string;
}

// ==============================================================================
// COMPONENT
// ==============================================================================

/**
 * CreateWishlistButton Client Component
 * 
 * Renders a button that opens a modal form for creating new wishlists.
 * Handles the complete creation flow with proper error handling.
 */
export function CreateWishlistButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: CreateWishlistButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<CreateWishlistFormData>({
    name: '',
    description: '',
    is_public: false,
  });

  // ==============================================================================
  // STYLES
  // ==============================================================================

  const getButtonStyles = () => {
    const baseStyles = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantStyles = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    };

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  };

  // ==============================================================================
  // HANDLERS
  // ==============================================================================

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setErrors({});
    setFormData({
      name: '',
      description: '',
      is_public: false,
    });
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setErrors({});
    setFormData({
      name: '',
      description: '',
      is_public: false,
    });
  }, []);

  const handleInputChange = useCallback((
    field: keyof CreateWishlistFormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Wishlist name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Wishlist name must be 100 characters or less';
    }

    // Validate description
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await createWishlistAction({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        is_public: formData.is_public,
      });

      if (result.success) {
        closeModal();
        router.refresh(); // Refresh the page to show new wishlist
      } else {
        setErrors({ general: result.error || 'Failed to create wishlist' });
      }
    } catch (error) {
      console.error('Error creating wishlist:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, closeModal, router]);

  // ==============================================================================
  // RENDER
  // ==============================================================================

  return (
    <>
      {/* Button */}
      <button
        onClick={openModal}
        className={getButtonStyles()}
        disabled={isSubmitting}
      >
        <Plus className="w-4 h-4" />
        {children || 'Create Wishlist'}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Wishlist
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              )}

              {/* Wishlist Name */}
              <div>
                <label htmlFor="wishlist-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Wishlist Name *
                </label>
                <input
                  type="text"
                  id="wishlist-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter wishlist name"
                  maxLength={100}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="wishlist-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  id="wishlist-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your wishlist..."
                  maxLength={500}
                  disabled={isSubmitting}
                />
                <div className="mt-1 flex justify-between items-center">
                  {errors.description ? (
                    <p className="text-sm text-red-600">{errors.description}</p>
                  ) : (
                    <div />
                  )}
                  <span className="text-xs text-gray-500">
                    {formData.description.length}/500
                  </span>
                </div>
              </div>

              {/* Public/Private Toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => handleInputChange('is_public', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    disabled={isSubmitting}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Make this wishlist public
                    </span>
                    <p className="text-xs text-gray-500">
                      Public wishlists can be shared with friends and family
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Wishlist
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ==============================================================================
// EXPORTS
// ==============================================================================

export default CreateWishlistButton;