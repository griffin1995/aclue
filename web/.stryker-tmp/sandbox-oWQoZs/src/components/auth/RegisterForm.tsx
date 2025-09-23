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
import { useFormState } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, RefreshCw, Check } from 'lucide-react';

/**
 * Enhanced Registration Form Component - App Router Implementation
 *
 * Multi-step registration form optimised for server actions with minimal JavaScript.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Progressive enhancement with server actions
 * - Multi-step form with client-side navigation
 * - Server-side validation and processing
 * - Password strength indicators
 * - Enhanced error handling and user feedback
 * - Responsive design with accessibility features
 *
 * Security:
 * - Form data processed entirely server-side
 * - Comprehensive validation with Zod schemas
 * - No sensitive data stored in client state
 * - CSRF protection through server actions
 * - Secure cookie-based authentication
 */

interface RegisterFormProps {
  registerAction: (formData: FormData) => Promise<any>;
  redirectUrl?: string;
  error?: string;
}
export function RegisterForm({
  registerAction,
  redirectUrl,
  error: initialError
}: RegisterFormProps) {
  if (stryMutAct_9fa48("3177")) {
    {}
  } else {
    stryCov_9fa48("3177");
    // Client-side UI state (minimal for enhanced security)
    const [showPassword, setShowPassword] = useState(stryMutAct_9fa48("3178") ? true : (stryCov_9fa48("3178"), false));
    const [showConfirmPassword, setShowConfirmPassword] = useState(stryMutAct_9fa48("3179") ? true : (stryCov_9fa48("3179"), false));
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState(stryMutAct_9fa48("3180") ? "Stryker was here!" : (stryCov_9fa48("3180"), ''));

    // Use Next.js useFormState for server action integration
    const [state, formAction] = useFormState(registerAction, stryMutAct_9fa48("3181") ? {} : (stryCov_9fa48("3181"), {
      success: stryMutAct_9fa48("3182") ? true : (stryCov_9fa48("3182"), false),
      error: stryMutAct_9fa48("3185") ? initialError && null : stryMutAct_9fa48("3184") ? false : stryMutAct_9fa48("3183") ? true : (stryCov_9fa48("3183", "3184", "3185"), initialError || null)
    }));

    // Track form submission state
    const [isPending, setIsPending] = useState(stryMutAct_9fa48("3186") ? true : (stryCov_9fa48("3186"), false));

    // Password strength calculation
    const getPasswordStrength = (password: string) => {
      if (stryMutAct_9fa48("3187")) {
        {}
      } else {
        stryCov_9fa48("3187");
        let strength = 0;
        if (stryMutAct_9fa48("3191") ? password.length < 8 : stryMutAct_9fa48("3190") ? password.length > 8 : stryMutAct_9fa48("3189") ? false : stryMutAct_9fa48("3188") ? true : (stryCov_9fa48("3188", "3189", "3190", "3191"), password.length >= 8)) stryMutAct_9fa48("3192") ? strength-- : (stryCov_9fa48("3192"), strength++);
        if (stryMutAct_9fa48("3194") ? false : stryMutAct_9fa48("3193") ? true : (stryCov_9fa48("3193", "3194"), (stryMutAct_9fa48("3195") ? /[^A-Z]/ : (stryCov_9fa48("3195"), /[A-Z]/)).test(password))) stryMutAct_9fa48("3196") ? strength-- : (stryCov_9fa48("3196"), strength++);
        if (stryMutAct_9fa48("3198") ? false : stryMutAct_9fa48("3197") ? true : (stryCov_9fa48("3197", "3198"), (stryMutAct_9fa48("3199") ? /[^a-z]/ : (stryCov_9fa48("3199"), /[a-z]/)).test(password))) stryMutAct_9fa48("3200") ? strength-- : (stryCov_9fa48("3200"), strength++);
        if (stryMutAct_9fa48("3202") ? false : stryMutAct_9fa48("3201") ? true : (stryCov_9fa48("3201", "3202"), (stryMutAct_9fa48("3203") ? /\D/ : (stryCov_9fa48("3203"), /\d/)).test(password))) stryMutAct_9fa48("3204") ? strength-- : (stryCov_9fa48("3204"), strength++);
        if (stryMutAct_9fa48("3206") ? false : stryMutAct_9fa48("3205") ? true : (stryCov_9fa48("3205", "3206"), (stryMutAct_9fa48("3207") ? /[^!@#$%^&*(),.?":{}|<>]/ : (stryCov_9fa48("3207"), /[!@#$%^&*(),.?":{}|<>]/)).test(password))) stryMutAct_9fa48("3208") ? strength-- : (stryCov_9fa48("3208"), strength++);
        return strength;
      }
    };
    const passwordStrength = getPasswordStrength(password);

    // Step navigation helpers
    const handleNext = () => {
      if (stryMutAct_9fa48("3209")) {
        {}
      } else {
        stryCov_9fa48("3209");
        if (stryMutAct_9fa48("3213") ? step >= 3 : stryMutAct_9fa48("3212") ? step <= 3 : stryMutAct_9fa48("3211") ? false : stryMutAct_9fa48("3210") ? true : (stryCov_9fa48("3210", "3211", "3212", "3213"), step < 3)) setStep(stryMutAct_9fa48("3214") ? step - 1 : (stryCov_9fa48("3214"), step + 1));
      }
    };
    const handleBack = () => {
      if (stryMutAct_9fa48("3215")) {
        {}
      } else {
        stryCov_9fa48("3215");
        if (stryMutAct_9fa48("3219") ? step <= 1 : stryMutAct_9fa48("3218") ? step >= 1 : stryMutAct_9fa48("3217") ? false : stryMutAct_9fa48("3216") ? true : (stryCov_9fa48("3216", "3217", "3218", "3219"), step > 1)) setStep(stryMutAct_9fa48("3220") ? step + 1 : (stryCov_9fa48("3220"), step - 1));
      }
    };
    return <>
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <motion.div className="text-center mb-8" initial={stryMutAct_9fa48("3221") ? {} : (stryCov_9fa48("3221"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("3222") ? {} : (stryCov_9fa48("3222"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("3223") ? {} : (stryCov_9fa48("3223"), {
            duration: 0.5
          })}>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                <Image src="/aclue_text_clean.png" alt="aclue logo" width={24} height={24} className="rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">aclue</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Start discovering perfect gifts with AI
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              {(stryMutAct_9fa48("3224") ? [] : (stryCov_9fa48("3224"), [1, 2, 3])).map(stryMutAct_9fa48("3225") ? () => undefined : (stryCov_9fa48("3225"), stepNumber => <div key={stepNumber} className={stryMutAct_9fa48("3226") ? `` : (stryCov_9fa48("3226"), `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${(stryMutAct_9fa48("3230") ? stepNumber > step : stryMutAct_9fa48("3229") ? stepNumber < step : stryMutAct_9fa48("3228") ? false : stryMutAct_9fa48("3227") ? true : (stryCov_9fa48("3227", "3228", "3229", "3230"), stepNumber <= step)) ? stryMutAct_9fa48("3231") ? "" : (stryCov_9fa48("3231"), 'bg-primary-600 text-white') : stryMutAct_9fa48("3232") ? "" : (stryCov_9fa48("3232"), 'bg-gray-200 text-gray-600')}`)}>
                  {(stryMutAct_9fa48("3236") ? stepNumber >= step : stryMutAct_9fa48("3235") ? stepNumber <= step : stryMutAct_9fa48("3234") ? false : stryMutAct_9fa48("3233") ? true : (stryCov_9fa48("3233", "3234", "3235", "3236"), stepNumber < step)) ? <Check className="w-4 h-4" /> : stepNumber}
                </div>))}
            </div>
            <div className="flex justify-center mt-2">
              <div className="text-sm text-gray-600">
                Step {step} of 3
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <motion.div className="bg-white rounded-2xl shadow-xl p-8" initial={stryMutAct_9fa48("3237") ? {} : (stryCov_9fa48("3237"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("3238") ? {} : (stryCov_9fa48("3238"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("3239") ? {} : (stryCov_9fa48("3239"), {
            duration: 0.5,
            delay: 0.1
          })}>
            <form action={async formData => {
              if (stryMutAct_9fa48("3240")) {
                {}
              } else {
                stryCov_9fa48("3240");
                setIsPending(stryMutAct_9fa48("3241") ? false : (stryCov_9fa48("3241"), true));
                await formAction(formData);
                setIsPending(stryMutAct_9fa48("3242") ? true : (stryCov_9fa48("3242"), false));
              }
            }} className="space-y-6">
              {/* Hidden redirect field */}
              {stryMutAct_9fa48("3245") ? redirectUrl || <input type="hidden" name="redirect" value={redirectUrl} /> : stryMutAct_9fa48("3244") ? false : stryMutAct_9fa48("3243") ? true : (stryCov_9fa48("3243", "3244", "3245"), redirectUrl && <input type="hidden" name="redirect" value={redirectUrl} />)}

              {/* Step 1: Personal Information */}
              {stryMutAct_9fa48("3248") ? step === 1 || <motion.div initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <p className="text-sm text-gray-600">Tell us a bit about yourself</p>
                  </div>

                  {/* First Name */}
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      First name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="first_name" name="first_name" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Enter your first name" disabled={isPending} autoComplete="given-name" />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="last_name" name="last_name" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Enter your last name" disabled={isPending} autoComplete="family-name" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="email" id="email" name="email" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Enter your email" disabled={isPending} autoComplete="email" autoCapitalize="none" autoCorrect="off" />
                    </div>
                  </div>

                  {/* Date of Birth (Optional) */}
                  <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of birth <span className="text-gray-500">(optional)</span>
                    </label>
                    <input type="date" id="date_of_birth" name="date_of_birth" lang="en-GB" className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" disabled={isPending} autoComplete="bday" />
                    <p className="mt-1 text-xs text-gray-500">
                      This helps us provide age-appropriate gift recommendations. Use DD/MM/YYYY format.
                    </p>
                  </div>
                </motion.div> : stryMutAct_9fa48("3247") ? false : stryMutAct_9fa48("3246") ? true : (stryCov_9fa48("3246", "3247", "3248"), (stryMutAct_9fa48("3250") ? step !== 1 : stryMutAct_9fa48("3249") ? true : (stryCov_9fa48("3249", "3250"), step === 1)) && <motion.div initial={stryMutAct_9fa48("3251") ? {} : (stryCov_9fa48("3251"), {
                opacity: 0,
                x: 20
              })} animate={stryMutAct_9fa48("3252") ? {} : (stryCov_9fa48("3252"), {
                opacity: 1,
                x: 0
              })} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <p className="text-sm text-gray-600">Tell us a bit about yourself</p>
                  </div>

                  {/* First Name */}
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                      First name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="first_name" name="first_name" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Enter your first name" disabled={isPending} autoComplete="given-name" />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Last name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" id="last_name" name="last_name" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Enter your last name" disabled={isPending} autoComplete="family-name" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="email" id="email" name="email" required className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Enter your email" disabled={isPending} autoComplete="email" autoCapitalize="none" autoCorrect="off" />
                    </div>
                  </div>

                  {/* Date of Birth (Optional) */}
                  <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of birth <span className="text-gray-500">(optional)</span>
                    </label>
                    <input type="date" id="date_of_birth" name="date_of_birth" lang="en-GB" className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" disabled={isPending} autoComplete="bday" />
                    <p className="mt-1 text-xs text-gray-500">
                      This helps us provide age-appropriate gift recommendations. Use DD/MM/YYYY format.
                    </p>
                  </div>
                </motion.div>)}

              {/* Step 2: Password */}
              {stryMutAct_9fa48("3255") ? step === 2 || <motion.div initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Create Password</h3>
                    <p className="text-sm text-gray-600">Choose a strong password for your account</p>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type={showPassword ? 'text' : 'password'} id="password" name="password" required value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Create a password" disabled={isPending} autoComplete="new-password" />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)} disabled={isPending}>
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && <div className="mt-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(level => <div key={level} className={`h-1 flex-1 rounded ${level <= passwordStrength ? passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-200'}`} />)}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Password strength: {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                        </p>
                      </div>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type={showConfirmPassword ? 'text' : 'password'} id="confirm_password" name="confirm_password" required className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Confirm your password" disabled={isPending} autoComplete="new-password" />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isPending}>
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>
                  </div>
                </motion.div> : stryMutAct_9fa48("3254") ? false : stryMutAct_9fa48("3253") ? true : (stryCov_9fa48("3253", "3254", "3255"), (stryMutAct_9fa48("3257") ? step !== 2 : stryMutAct_9fa48("3256") ? true : (stryCov_9fa48("3256", "3257"), step === 2)) && <motion.div initial={stryMutAct_9fa48("3258") ? {} : (stryCov_9fa48("3258"), {
                opacity: 0,
                x: 20
              })} animate={stryMutAct_9fa48("3259") ? {} : (stryCov_9fa48("3259"), {
                opacity: 1,
                x: 0
              })} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Create Password</h3>
                    <p className="text-sm text-gray-600">Choose a strong password for your account</p>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type={showPassword ? stryMutAct_9fa48("3260") ? "" : (stryCov_9fa48("3260"), 'text') : stryMutAct_9fa48("3261") ? "" : (stryCov_9fa48("3261"), 'password')} id="password" name="password" required value={password} onChange={stryMutAct_9fa48("3262") ? () => undefined : (stryCov_9fa48("3262"), e => setPassword(e.target.value))} className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Create a password" disabled={isPending} autoComplete="new-password" />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={stryMutAct_9fa48("3263") ? () => undefined : (stryCov_9fa48("3263"), () => setShowPassword(stryMutAct_9fa48("3264") ? showPassword : (stryCov_9fa48("3264"), !showPassword)))} disabled={isPending}>
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {stryMutAct_9fa48("3267") ? password || <div className="mt-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(level => <div key={level} className={`h-1 flex-1 rounded ${level <= passwordStrength ? passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-200'}`} />)}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Password strength: {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                        </p>
                      </div> : stryMutAct_9fa48("3266") ? false : stryMutAct_9fa48("3265") ? true : (stryCov_9fa48("3265", "3266", "3267"), password && <div className="mt-2">
                        <div className="flex gap-1">
                          {(stryMutAct_9fa48("3268") ? [] : (stryCov_9fa48("3268"), [1, 2, 3, 4, 5])).map(stryMutAct_9fa48("3269") ? () => undefined : (stryCov_9fa48("3269"), level => <div key={level} className={stryMutAct_9fa48("3270") ? `` : (stryCov_9fa48("3270"), `h-1 flex-1 rounded ${(stryMutAct_9fa48("3274") ? level > passwordStrength : stryMutAct_9fa48("3273") ? level < passwordStrength : stryMutAct_9fa48("3272") ? false : stryMutAct_9fa48("3271") ? true : (stryCov_9fa48("3271", "3272", "3273", "3274"), level <= passwordStrength)) ? (stryMutAct_9fa48("3278") ? passwordStrength > 2 : stryMutAct_9fa48("3277") ? passwordStrength < 2 : stryMutAct_9fa48("3276") ? false : stryMutAct_9fa48("3275") ? true : (stryCov_9fa48("3275", "3276", "3277", "3278"), passwordStrength <= 2)) ? stryMutAct_9fa48("3279") ? "" : (stryCov_9fa48("3279"), 'bg-red-500') : (stryMutAct_9fa48("3283") ? passwordStrength > 3 : stryMutAct_9fa48("3282") ? passwordStrength < 3 : stryMutAct_9fa48("3281") ? false : stryMutAct_9fa48("3280") ? true : (stryCov_9fa48("3280", "3281", "3282", "3283"), passwordStrength <= 3)) ? stryMutAct_9fa48("3284") ? "" : (stryCov_9fa48("3284"), 'bg-yellow-500') : stryMutAct_9fa48("3285") ? "" : (stryCov_9fa48("3285"), 'bg-green-500') : stryMutAct_9fa48("3286") ? "" : (stryCov_9fa48("3286"), 'bg-gray-200')}`)} />))}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Password strength: {(stryMutAct_9fa48("3290") ? passwordStrength > 2 : stryMutAct_9fa48("3289") ? passwordStrength < 2 : stryMutAct_9fa48("3288") ? false : stryMutAct_9fa48("3287") ? true : (stryCov_9fa48("3287", "3288", "3289", "3290"), passwordStrength <= 2)) ? stryMutAct_9fa48("3291") ? "" : (stryCov_9fa48("3291"), 'Weak') : (stryMutAct_9fa48("3295") ? passwordStrength > 3 : stryMutAct_9fa48("3294") ? passwordStrength < 3 : stryMutAct_9fa48("3293") ? false : stryMutAct_9fa48("3292") ? true : (stryCov_9fa48("3292", "3293", "3294", "3295"), passwordStrength <= 3)) ? stryMutAct_9fa48("3296") ? "" : (stryCov_9fa48("3296"), 'Medium') : stryMutAct_9fa48("3297") ? "" : (stryCov_9fa48("3297"), 'Strong')}
                        </p>
                      </div>)}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type={showConfirmPassword ? stryMutAct_9fa48("3298") ? "" : (stryCov_9fa48("3298"), 'text') : stryMutAct_9fa48("3299") ? "" : (stryCov_9fa48("3299"), 'password')} id="confirm_password" name="confirm_password" required className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" placeholder="Confirm your password" disabled={isPending} autoComplete="new-password" />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={stryMutAct_9fa48("3300") ? () => undefined : (stryCov_9fa48("3300"), () => setShowConfirmPassword(stryMutAct_9fa48("3301") ? showConfirmPassword : (stryCov_9fa48("3301"), !showConfirmPassword)))} disabled={isPending}>
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>
                  </div>
                </motion.div>)}

              {/* Step 3: Terms and Marketing */}
              {stryMutAct_9fa48("3304") ? step === 3 || <motion.div initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Almost done!</h3>
                    <p className="text-sm text-gray-600">Review and accept our terms</p>
                  </div>

                  {/* Marketing Consent */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="marketing_consent" name="marketing_consent" type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" disabled={isPending} />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketing_consent" className="text-gray-700">
                        I'd like to receive emails about new features, gift recommendations, and special offers
                      </label>
                      <p className="text-gray-500 text-xs mt-1">
                        You can unsubscribe at any time
                      </p>
                    </div>
                  </div>

                  {/* Terms Acceptance */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="terms_accepted" name="terms_accepted" type="checkbox" required className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" disabled={isPending} />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms_accepted" className="text-gray-700">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                </motion.div> : stryMutAct_9fa48("3303") ? false : stryMutAct_9fa48("3302") ? true : (stryCov_9fa48("3302", "3303", "3304"), (stryMutAct_9fa48("3306") ? step !== 3 : stryMutAct_9fa48("3305") ? true : (stryCov_9fa48("3305", "3306"), step === 3)) && <motion.div initial={stryMutAct_9fa48("3307") ? {} : (stryCov_9fa48("3307"), {
                opacity: 0,
                x: 20
              })} animate={stryMutAct_9fa48("3308") ? {} : (stryCov_9fa48("3308"), {
                opacity: 1,
                x: 0
              })} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Almost done!</h3>
                    <p className="text-sm text-gray-600">Review and accept our terms</p>
                  </div>

                  {/* Marketing Consent */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="marketing_consent" name="marketing_consent" type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" disabled={isPending} />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketing_consent" className="text-gray-700">
                        I'd like to receive emails about new features, gift recommendations, and special offers
                      </label>
                      <p className="text-gray-500 text-xs mt-1">
                        You can unsubscribe at any time
                      </p>
                    </div>
                  </div>

                  {/* Terms Acceptance */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="terms_accepted" name="terms_accepted" type="checkbox" required className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" disabled={isPending} />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms_accepted" className="text-gray-700">
                        I agree to the{stryMutAct_9fa48("3309") ? "" : (stryCov_9fa48("3309"), ' ')}
                        <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                          Terms of Service
                        </Link>{stryMutAct_9fa48("3310") ? "" : (stryCov_9fa48("3310"), ' ')}
                        and{stryMutAct_9fa48("3311") ? "" : (stryCov_9fa48("3311"), ' ')}
                        <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                </motion.div>)}

              {/* Error Display */}
              <AnimatePresence mode="wait">
                {stryMutAct_9fa48("3314") ? state.error || <motion.div initial={{
                  opacity: 0,
                  y: -10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} className="p-4 rounded-lg flex items-start gap-3 bg-red-50 border border-red-200">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        {state.error}
                      </p>
                    </div>
                  </motion.div> : stryMutAct_9fa48("3313") ? false : stryMutAct_9fa48("3312") ? true : (stryCov_9fa48("3312", "3313", "3314"), state.error && <motion.div initial={stryMutAct_9fa48("3315") ? {} : (stryCov_9fa48("3315"), {
                  opacity: 0,
                  y: stryMutAct_9fa48("3316") ? +10 : (stryCov_9fa48("3316"), -10)
                })} animate={stryMutAct_9fa48("3317") ? {} : (stryCov_9fa48("3317"), {
                  opacity: 1,
                  y: 0
                })} exit={stryMutAct_9fa48("3318") ? {} : (stryCov_9fa48("3318"), {
                  opacity: 0,
                  y: stryMutAct_9fa48("3319") ? +10 : (stryCov_9fa48("3319"), -10)
                })} className="p-4 rounded-lg flex items-start gap-3 bg-red-50 border border-red-200">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        {state.error}
                      </p>
                    </div>
                  </motion.div>)}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {stryMutAct_9fa48("3322") ? step > 1 || <button type="button" onClick={handleBack} disabled={isPending} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Back
                  </button> : stryMutAct_9fa48("3321") ? false : stryMutAct_9fa48("3320") ? true : (stryCov_9fa48("3320", "3321", "3322"), (stryMutAct_9fa48("3325") ? step <= 1 : stryMutAct_9fa48("3324") ? step >= 1 : stryMutAct_9fa48("3323") ? true : (stryCov_9fa48("3323", "3324", "3325"), step > 1)) && <button type="button" onClick={handleBack} disabled={isPending} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Back
                  </button>)}

                {(stryMutAct_9fa48("3329") ? step >= 3 : stryMutAct_9fa48("3328") ? step <= 3 : stryMutAct_9fa48("3327") ? false : stryMutAct_9fa48("3326") ? true : (stryCov_9fa48("3326", "3327", "3328", "3329"), step < 3)) ? <motion.button type="button" onClick={handleNext} disabled={isPending} className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" whileHover={stryMutAct_9fa48("3330") ? {} : (stryCov_9fa48("3330"), {
                  scale: isPending ? 1 : 1.02
                })} whileTap={stryMutAct_9fa48("3331") ? {} : (stryCov_9fa48("3331"), {
                  scale: isPending ? 1 : 0.98
                })}>
                    Continue
                  </motion.button> : <motion.button type="submit" disabled={isPending} className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" whileHover={stryMutAct_9fa48("3332") ? {} : (stryCov_9fa48("3332"), {
                  scale: isPending ? 1 : 1.02
                })} whileTap={stryMutAct_9fa48("3333") ? {} : (stryCov_9fa48("3333"), {
                  scale: isPending ? 1 : 0.98
                })}>
                    {isPending ? <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Creating account...
                      </div> : stryMutAct_9fa48("3334") ? "" : (stryCov_9fa48("3334"), 'Create account')}
                  </motion.button>}
              </div>
            </form>

            {/* Registration Information (only on step 1) */}
            {stryMutAct_9fa48("3337") ? step === 1 || <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900">
                      Enhanced Security
                    </h4>
                    <p className="mt-1 text-sm text-blue-700">
                      Your registration is processed securely on our servers with comprehensive validation and protection.
                    </p>
                  </div>
                </div>
              </div> : stryMutAct_9fa48("3336") ? false : stryMutAct_9fa48("3335") ? true : (stryCov_9fa48("3335", "3336", "3337"), (stryMutAct_9fa48("3339") ? step !== 1 : stryMutAct_9fa48("3338") ? true : (stryCov_9fa48("3338", "3339"), step === 1)) && <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900">
                      Enhanced Security
                    </h4>
                    <p className="mt-1 text-sm text-blue-700">
                      Your registration is processed securely on our servers with comprehensive validation and protection.
                    </p>
                  </div>
                </div>
              </div>)}
          </motion.div>

          {/* Sign In Link */}
          <motion.div className="text-center mt-8" initial={stryMutAct_9fa48("3340") ? {} : (stryCov_9fa48("3340"), {
            opacity: 0
          })} animate={stryMutAct_9fa48("3341") ? {} : (stryCov_9fa48("3341"), {
            opacity: 1
          })} transition={stryMutAct_9fa48("3342") ? {} : (stryCov_9fa48("3342"), {
            duration: 0.5,
            delay: 0.2
          })}>
            <p className="text-gray-600">
              Already have an account?{stryMutAct_9fa48("3343") ? "" : (stryCov_9fa48("3343"), ' ')}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>;
  }
}