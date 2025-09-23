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
  variant = stryMutAct_9fa48("7979") ? "" : (stryCov_9fa48("7979"), 'primary'),
  size = stryMutAct_9fa48("7980") ? "" : (stryCov_9fa48("7980"), 'md'),
  className = stryMutAct_9fa48("7981") ? "Stryker was here!" : (stryCov_9fa48("7981"), ''),
  children
}: CreateWishlistButtonProps) {
  if (stryMutAct_9fa48("7982")) {
    {}
  } else {
    stryCov_9fa48("7982");
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(stryMutAct_9fa48("7983") ? true : (stryCov_9fa48("7983"), false));
    const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("7984") ? true : (stryCov_9fa48("7984"), false));
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<CreateWishlistFormData>(stryMutAct_9fa48("7985") ? {} : (stryCov_9fa48("7985"), {
      name: stryMutAct_9fa48("7986") ? "Stryker was here!" : (stryCov_9fa48("7986"), ''),
      description: stryMutAct_9fa48("7987") ? "Stryker was here!" : (stryCov_9fa48("7987"), ''),
      is_public: stryMutAct_9fa48("7988") ? true : (stryCov_9fa48("7988"), false)
    }));

    // ==============================================================================
    // STYLES
    // ==============================================================================

    const getButtonStyles = () => {
      if (stryMutAct_9fa48("7989")) {
        {}
      } else {
        stryCov_9fa48("7989");
        const baseStyles = stryMutAct_9fa48("7990") ? "" : (stryCov_9fa48("7990"), 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2');
        const variantStyles = stryMutAct_9fa48("7991") ? {} : (stryCov_9fa48("7991"), {
          primary: stryMutAct_9fa48("7992") ? "" : (stryCov_9fa48("7992"), 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'),
          secondary: stryMutAct_9fa48("7993") ? "" : (stryCov_9fa48("7993"), 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500'),
          outline: stryMutAct_9fa48("7994") ? "" : (stryCov_9fa48("7994"), 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500')
        });
        const sizeStyles = stryMutAct_9fa48("7995") ? {} : (stryCov_9fa48("7995"), {
          sm: stryMutAct_9fa48("7996") ? "" : (stryCov_9fa48("7996"), 'px-3 py-2 text-sm'),
          md: stryMutAct_9fa48("7997") ? "" : (stryCov_9fa48("7997"), 'px-4 py-2 text-sm'),
          lg: stryMutAct_9fa48("7998") ? "" : (stryCov_9fa48("7998"), 'px-6 py-3 text-base')
        });
        return stryMutAct_9fa48("7999") ? `` : (stryCov_9fa48("7999"), `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`);
      }
    };

    // ==============================================================================
    // HANDLERS
    // ==============================================================================

    const openModal = useCallback(() => {
      if (stryMutAct_9fa48("8000")) {
        {}
      } else {
        stryCov_9fa48("8000");
        setIsModalOpen(stryMutAct_9fa48("8001") ? false : (stryCov_9fa48("8001"), true));
        setErrors({});
        setFormData(stryMutAct_9fa48("8002") ? {} : (stryCov_9fa48("8002"), {
          name: stryMutAct_9fa48("8003") ? "Stryker was here!" : (stryCov_9fa48("8003"), ''),
          description: stryMutAct_9fa48("8004") ? "Stryker was here!" : (stryCov_9fa48("8004"), ''),
          is_public: stryMutAct_9fa48("8005") ? true : (stryCov_9fa48("8005"), false)
        }));
      }
    }, stryMutAct_9fa48("8006") ? ["Stryker was here"] : (stryCov_9fa48("8006"), []));
    const closeModal = useCallback(() => {
      if (stryMutAct_9fa48("8007")) {
        {}
      } else {
        stryCov_9fa48("8007");
        setIsModalOpen(stryMutAct_9fa48("8008") ? true : (stryCov_9fa48("8008"), false));
        setErrors({});
        setFormData(stryMutAct_9fa48("8009") ? {} : (stryCov_9fa48("8009"), {
          name: stryMutAct_9fa48("8010") ? "Stryker was here!" : (stryCov_9fa48("8010"), ''),
          description: stryMutAct_9fa48("8011") ? "Stryker was here!" : (stryCov_9fa48("8011"), ''),
          is_public: stryMutAct_9fa48("8012") ? true : (stryCov_9fa48("8012"), false)
        }));
      }
    }, stryMutAct_9fa48("8013") ? ["Stryker was here"] : (stryCov_9fa48("8013"), []));
    const handleInputChange = useCallback((field: keyof CreateWishlistFormData, value: string | boolean) => {
      if (stryMutAct_9fa48("8014")) {
        {}
      } else {
        stryCov_9fa48("8014");
        setFormData(stryMutAct_9fa48("8015") ? () => undefined : (stryCov_9fa48("8015"), prev => stryMutAct_9fa48("8016") ? {} : (stryCov_9fa48("8016"), {
          ...prev,
          [field]: value
        })));

        // Clear field-specific error when user starts typing
        if (stryMutAct_9fa48("8018") ? false : stryMutAct_9fa48("8017") ? true : (stryCov_9fa48("8017", "8018"), errors[field as keyof FormErrors])) {
          if (stryMutAct_9fa48("8019")) {
            {}
          } else {
            stryCov_9fa48("8019");
            setErrors(stryMutAct_9fa48("8020") ? () => undefined : (stryCov_9fa48("8020"), prev => stryMutAct_9fa48("8021") ? {} : (stryCov_9fa48("8021"), {
              ...prev,
              [field]: undefined
            })));
          }
        }
      }
    }, stryMutAct_9fa48("8022") ? [] : (stryCov_9fa48("8022"), [errors]));
    const validateForm = useCallback((): boolean => {
      if (stryMutAct_9fa48("8023")) {
        {}
      } else {
        stryCov_9fa48("8023");
        const newErrors: FormErrors = {};

        // Validate name
        if (stryMutAct_9fa48("8026") ? false : stryMutAct_9fa48("8025") ? true : stryMutAct_9fa48("8024") ? formData.name.trim() : (stryCov_9fa48("8024", "8025", "8026"), !(stryMutAct_9fa48("8027") ? formData.name : (stryCov_9fa48("8027"), formData.name.trim())))) {
          if (stryMutAct_9fa48("8028")) {
            {}
          } else {
            stryCov_9fa48("8028");
            newErrors.name = stryMutAct_9fa48("8029") ? "" : (stryCov_9fa48("8029"), 'Wishlist name is required');
          }
        } else if (stryMutAct_9fa48("8033") ? formData.name.length <= 100 : stryMutAct_9fa48("8032") ? formData.name.length >= 100 : stryMutAct_9fa48("8031") ? false : stryMutAct_9fa48("8030") ? true : (stryCov_9fa48("8030", "8031", "8032", "8033"), formData.name.length > 100)) {
          if (stryMutAct_9fa48("8034")) {
            {}
          } else {
            stryCov_9fa48("8034");
            newErrors.name = stryMutAct_9fa48("8035") ? "" : (stryCov_9fa48("8035"), 'Wishlist name must be 100 characters or less');
          }
        }

        // Validate description
        if (stryMutAct_9fa48("8039") ? formData.description.length <= 500 : stryMutAct_9fa48("8038") ? formData.description.length >= 500 : stryMutAct_9fa48("8037") ? false : stryMutAct_9fa48("8036") ? true : (stryCov_9fa48("8036", "8037", "8038", "8039"), formData.description.length > 500)) {
          if (stryMutAct_9fa48("8040")) {
            {}
          } else {
            stryCov_9fa48("8040");
            newErrors.description = stryMutAct_9fa48("8041") ? "" : (stryCov_9fa48("8041"), 'Description must be 500 characters or less');
          }
        }
        setErrors(newErrors);
        return stryMutAct_9fa48("8044") ? Object.keys(newErrors).length !== 0 : stryMutAct_9fa48("8043") ? false : stryMutAct_9fa48("8042") ? true : (stryCov_9fa48("8042", "8043", "8044"), Object.keys(newErrors).length === 0);
      }
    }, stryMutAct_9fa48("8045") ? [] : (stryCov_9fa48("8045"), [formData]));
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("8046")) {
        {}
      } else {
        stryCov_9fa48("8046");
        e.preventDefault();
        if (stryMutAct_9fa48("8049") ? false : stryMutAct_9fa48("8048") ? true : stryMutAct_9fa48("8047") ? validateForm() : (stryCov_9fa48("8047", "8048", "8049"), !validateForm())) {
          if (stryMutAct_9fa48("8050")) {
            {}
          } else {
            stryCov_9fa48("8050");
            return;
          }
        }
        setIsSubmitting(stryMutAct_9fa48("8051") ? false : (stryCov_9fa48("8051"), true));
        setErrors({});
        try {
          if (stryMutAct_9fa48("8052")) {
            {}
          } else {
            stryCov_9fa48("8052");
            const result = await createWishlistAction(stryMutAct_9fa48("8053") ? {} : (stryCov_9fa48("8053"), {
              name: stryMutAct_9fa48("8054") ? formData.name : (stryCov_9fa48("8054"), formData.name.trim()),
              description: stryMutAct_9fa48("8057") ? formData.description.trim() && undefined : stryMutAct_9fa48("8056") ? false : stryMutAct_9fa48("8055") ? true : (stryCov_9fa48("8055", "8056", "8057"), (stryMutAct_9fa48("8058") ? formData.description : (stryCov_9fa48("8058"), formData.description.trim())) || undefined),
              is_public: formData.is_public
            }));
            if (stryMutAct_9fa48("8060") ? false : stryMutAct_9fa48("8059") ? true : (stryCov_9fa48("8059", "8060"), result.success)) {
              if (stryMutAct_9fa48("8061")) {
                {}
              } else {
                stryCov_9fa48("8061");
                closeModal();
                router.refresh(); // Refresh the page to show new wishlist
              }
            } else {
              if (stryMutAct_9fa48("8062")) {
                {}
              } else {
                stryCov_9fa48("8062");
                setErrors(stryMutAct_9fa48("8063") ? {} : (stryCov_9fa48("8063"), {
                  general: stryMutAct_9fa48("8066") ? result.error && 'Failed to create wishlist' : stryMutAct_9fa48("8065") ? false : stryMutAct_9fa48("8064") ? true : (stryCov_9fa48("8064", "8065", "8066"), result.error || (stryMutAct_9fa48("8067") ? "" : (stryCov_9fa48("8067"), 'Failed to create wishlist')))
                }));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("8068")) {
            {}
          } else {
            stryCov_9fa48("8068");
            console.error(stryMutAct_9fa48("8069") ? "" : (stryCov_9fa48("8069"), 'Error creating wishlist:'), error);
            setErrors(stryMutAct_9fa48("8070") ? {} : (stryCov_9fa48("8070"), {
              general: stryMutAct_9fa48("8071") ? "" : (stryCov_9fa48("8071"), 'An unexpected error occurred. Please try again.')
            }));
          }
        } finally {
          if (stryMutAct_9fa48("8072")) {
            {}
          } else {
            stryCov_9fa48("8072");
            setIsSubmitting(stryMutAct_9fa48("8073") ? true : (stryCov_9fa48("8073"), false));
          }
        }
      }
    }, stryMutAct_9fa48("8074") ? [] : (stryCov_9fa48("8074"), [formData, validateForm, closeModal, router]));

    // ==============================================================================
    // RENDER
    // ==============================================================================

    return <>
      {/* Button */}
      <button onClick={openModal} className={getButtonStyles()} disabled={isSubmitting}>
        <Plus className="w-4 h-4" />
        {stryMutAct_9fa48("8077") ? children && 'Create Wishlist' : stryMutAct_9fa48("8076") ? false : stryMutAct_9fa48("8075") ? true : (stryCov_9fa48("8075", "8076", "8077"), children || (stryMutAct_9fa48("8078") ? "" : (stryCov_9fa48("8078"), 'Create Wishlist')))}
      </button>

      {/* Modal */}
      {stryMutAct_9fa48("8081") ? isModalOpen || <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Wishlist
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={isSubmitting}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* General Error */}
              {errors.general && <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>}

              {/* Wishlist Name */}
              <div>
                <label htmlFor="wishlist-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Wishlist Name *
                </label>
                <input type="text" id="wishlist-name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`} placeholder="Enter wishlist name" maxLength={100} disabled={isSubmitting} />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="wishlist-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea id="wishlist-description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={3} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${errors.description ? 'border-red-300' : 'border-gray-300'}`} placeholder="Describe your wishlist..." maxLength={500} disabled={isSubmitting} />
                <div className="mt-1 flex justify-between items-center">
                  {errors.description ? <p className="text-sm text-red-600">{errors.description}</p> : <div />}
                  <span className="text-xs text-gray-500">
                    {formData.description.length}/500
                  </span>
                </div>
              </div>

              {/* Public/Private Toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.is_public} onChange={e => handleInputChange('is_public', e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" disabled={isSubmitting} />
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
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </> : <>
                      <Save className="w-4 h-4" />
                      Create Wishlist
                    </>}
                </button>
              </div>
            </form>
          </div>
        </div> : stryMutAct_9fa48("8080") ? false : stryMutAct_9fa48("8079") ? true : (stryCov_9fa48("8079", "8080", "8081"), isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Wishlist
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={isSubmitting}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* General Error */}
              {stryMutAct_9fa48("8084") ? errors.general || <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div> : stryMutAct_9fa48("8083") ? false : stryMutAct_9fa48("8082") ? true : (stryCov_9fa48("8082", "8083", "8084"), errors.general && <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>)}

              {/* Wishlist Name */}
              <div>
                <label htmlFor="wishlist-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Wishlist Name *
                </label>
                <input type="text" id="wishlist-name" value={formData.name} onChange={stryMutAct_9fa48("8085") ? () => undefined : (stryCov_9fa48("8085"), e => handleInputChange(stryMutAct_9fa48("8086") ? "" : (stryCov_9fa48("8086"), 'name'), e.target.value))} className={stryMutAct_9fa48("8087") ? `` : (stryCov_9fa48("8087"), `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? stryMutAct_9fa48("8088") ? "" : (stryCov_9fa48("8088"), 'border-red-300') : stryMutAct_9fa48("8089") ? "" : (stryCov_9fa48("8089"), 'border-gray-300')}`)} placeholder="Enter wishlist name" maxLength={100} disabled={isSubmitting} />
                {stryMutAct_9fa48("8092") ? errors.name || <p className="mt-1 text-sm text-red-600">{errors.name}</p> : stryMutAct_9fa48("8091") ? false : stryMutAct_9fa48("8090") ? true : (stryCov_9fa48("8090", "8091", "8092"), errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>)}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="wishlist-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea id="wishlist-description" value={formData.description} onChange={stryMutAct_9fa48("8093") ? () => undefined : (stryCov_9fa48("8093"), e => handleInputChange(stryMutAct_9fa48("8094") ? "" : (stryCov_9fa48("8094"), 'description'), e.target.value))} rows={3} className={stryMutAct_9fa48("8095") ? `` : (stryCov_9fa48("8095"), `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${errors.description ? stryMutAct_9fa48("8096") ? "" : (stryCov_9fa48("8096"), 'border-red-300') : stryMutAct_9fa48("8097") ? "" : (stryCov_9fa48("8097"), 'border-gray-300')}`)} placeholder="Describe your wishlist..." maxLength={500} disabled={isSubmitting} />
                <div className="mt-1 flex justify-between items-center">
                  {errors.description ? <p className="text-sm text-red-600">{errors.description}</p> : <div />}
                  <span className="text-xs text-gray-500">
                    {formData.description.length}/500
                  </span>
                </div>
              </div>

              {/* Public/Private Toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.is_public} onChange={stryMutAct_9fa48("8098") ? () => undefined : (stryCov_9fa48("8098"), e => handleInputChange(stryMutAct_9fa48("8099") ? "" : (stryCov_9fa48("8099"), 'is_public'), e.target.checked))} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" disabled={isSubmitting} />
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
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </> : <>
                      <Save className="w-4 h-4" />
                      Create Wishlist
                    </>}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </>;
  }
}

// ==============================================================================
// EXPORTS
// ==============================================================================

export default CreateWishlistButton;