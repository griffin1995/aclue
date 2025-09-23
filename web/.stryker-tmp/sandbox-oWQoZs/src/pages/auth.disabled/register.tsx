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
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Gift, ArrowLeft, Check } from 'lucide-react';
import { api, tokenManager } from '@/lib/api';
import { appConfig } from '@/config';
import toast from 'react-hot-toast';

// Validation schema
const registerSchema = z.object(stryMutAct_9fa48("12982") ? {} : (stryCov_9fa48("12982"), {
  first_name: stryMutAct_9fa48("12985") ? z.string().max(1, 'First name is required').min(appConfig.validation.name.minLength, `First name must be at least ${appConfig.validation.name.minLength} characters`).max(appConfig.validation.name.maxLength, `First name must not exceed ${appConfig.validation.name.maxLength} characters`).regex(appConfig.validation.name.pattern, 'First name contains invalid characters') : stryMutAct_9fa48("12984") ? z.string().min(1, 'First name is required').max(appConfig.validation.name.minLength, `First name must be at least ${appConfig.validation.name.minLength} characters`).max(appConfig.validation.name.maxLength, `First name must not exceed ${appConfig.validation.name.maxLength} characters`).regex(appConfig.validation.name.pattern, 'First name contains invalid characters') : stryMutAct_9fa48("12983") ? z.string().min(1, 'First name is required').min(appConfig.validation.name.minLength, `First name must be at least ${appConfig.validation.name.minLength} characters`).min(appConfig.validation.name.maxLength, `First name must not exceed ${appConfig.validation.name.maxLength} characters`).regex(appConfig.validation.name.pattern, 'First name contains invalid characters') : (stryCov_9fa48("12983", "12984", "12985"), z.string().min(1, stryMutAct_9fa48("12986") ? "" : (stryCov_9fa48("12986"), 'First name is required')).min(appConfig.validation.name.minLength, stryMutAct_9fa48("12987") ? `` : (stryCov_9fa48("12987"), `First name must be at least ${appConfig.validation.name.minLength} characters`)).max(appConfig.validation.name.maxLength, stryMutAct_9fa48("12988") ? `` : (stryCov_9fa48("12988"), `First name must not exceed ${appConfig.validation.name.maxLength} characters`)).regex(appConfig.validation.name.pattern, stryMutAct_9fa48("12989") ? "" : (stryCov_9fa48("12989"), 'First name contains invalid characters'))),
  last_name: stryMutAct_9fa48("12992") ? z.string().max(1, 'Last name is required').min(appConfig.validation.name.minLength, `Last name must be at least ${appConfig.validation.name.minLength} characters`).max(appConfig.validation.name.maxLength, `Last name must not exceed ${appConfig.validation.name.maxLength} characters`).regex(appConfig.validation.name.pattern, 'Last name contains invalid characters') : stryMutAct_9fa48("12991") ? z.string().min(1, 'Last name is required').max(appConfig.validation.name.minLength, `Last name must be at least ${appConfig.validation.name.minLength} characters`).max(appConfig.validation.name.maxLength, `Last name must not exceed ${appConfig.validation.name.maxLength} characters`).regex(appConfig.validation.name.pattern, 'Last name contains invalid characters') : stryMutAct_9fa48("12990") ? z.string().min(1, 'Last name is required').min(appConfig.validation.name.minLength, `Last name must be at least ${appConfig.validation.name.minLength} characters`).min(appConfig.validation.name.maxLength, `Last name must not exceed ${appConfig.validation.name.maxLength} characters`).regex(appConfig.validation.name.pattern, 'Last name contains invalid characters') : (stryCov_9fa48("12990", "12991", "12992"), z.string().min(1, stryMutAct_9fa48("12993") ? "" : (stryCov_9fa48("12993"), 'Last name is required')).min(appConfig.validation.name.minLength, stryMutAct_9fa48("12994") ? `` : (stryCov_9fa48("12994"), `Last name must be at least ${appConfig.validation.name.minLength} characters`)).max(appConfig.validation.name.maxLength, stryMutAct_9fa48("12995") ? `` : (stryCov_9fa48("12995"), `Last name must not exceed ${appConfig.validation.name.maxLength} characters`)).regex(appConfig.validation.name.pattern, stryMutAct_9fa48("12996") ? "" : (stryCov_9fa48("12996"), 'Last name contains invalid characters'))),
  email: stryMutAct_9fa48("12997") ? z.string().max(1, 'Email is required').email('Please enter a valid email address').regex(appConfig.validation.email.pattern, 'Please enter a valid email address') : (stryCov_9fa48("12997"), z.string().min(1, stryMutAct_9fa48("12998") ? "" : (stryCov_9fa48("12998"), 'Email is required')).email(stryMutAct_9fa48("12999") ? "" : (stryCov_9fa48("12999"), 'Please enter a valid email address')).regex(appConfig.validation.email.pattern, stryMutAct_9fa48("13000") ? "" : (stryCov_9fa48("13000"), 'Please enter a valid email address'))),
  password: stryMutAct_9fa48("13001") ? z.string().max(appConfig.validation.password.minLength, `Password must be at least ${appConfig.validation.password.minLength} characters`).refine(password => !appConfig.validation.password.requireUppercase || /[A-Z]/.test(password), 'Password must contain at least one uppercase letter').refine(password => !appConfig.validation.password.requireLowercase || /[a-z]/.test(password), 'Password must contain at least one lowercase letter').refine(password => !appConfig.validation.password.requireNumbers || /\d/.test(password), 'Password must contain at least one number').refine(password => !appConfig.validation.password.requireSpecialChars || /[!@#$%^&*(),.?":{}|<>]/.test(password), 'Password must contain at least one special character') : (stryCov_9fa48("13001"), z.string().min(appConfig.validation.password.minLength, stryMutAct_9fa48("13002") ? `` : (stryCov_9fa48("13002"), `Password must be at least ${appConfig.validation.password.minLength} characters`)).refine(stryMutAct_9fa48("13003") ? () => undefined : (stryCov_9fa48("13003"), password => stryMutAct_9fa48("13006") ? !appConfig.validation.password.requireUppercase && /[A-Z]/.test(password) : stryMutAct_9fa48("13005") ? false : stryMutAct_9fa48("13004") ? true : (stryCov_9fa48("13004", "13005", "13006"), (stryMutAct_9fa48("13007") ? appConfig.validation.password.requireUppercase : (stryCov_9fa48("13007"), !appConfig.validation.password.requireUppercase)) || (stryMutAct_9fa48("13008") ? /[^A-Z]/ : (stryCov_9fa48("13008"), /[A-Z]/)).test(password))), stryMutAct_9fa48("13009") ? "" : (stryCov_9fa48("13009"), 'Password must contain at least one uppercase letter')).refine(stryMutAct_9fa48("13010") ? () => undefined : (stryCov_9fa48("13010"), password => stryMutAct_9fa48("13013") ? !appConfig.validation.password.requireLowercase && /[a-z]/.test(password) : stryMutAct_9fa48("13012") ? false : stryMutAct_9fa48("13011") ? true : (stryCov_9fa48("13011", "13012", "13013"), (stryMutAct_9fa48("13014") ? appConfig.validation.password.requireLowercase : (stryCov_9fa48("13014"), !appConfig.validation.password.requireLowercase)) || (stryMutAct_9fa48("13015") ? /[^a-z]/ : (stryCov_9fa48("13015"), /[a-z]/)).test(password))), stryMutAct_9fa48("13016") ? "" : (stryCov_9fa48("13016"), 'Password must contain at least one lowercase letter')).refine(stryMutAct_9fa48("13017") ? () => undefined : (stryCov_9fa48("13017"), password => stryMutAct_9fa48("13020") ? !appConfig.validation.password.requireNumbers && /\d/.test(password) : stryMutAct_9fa48("13019") ? false : stryMutAct_9fa48("13018") ? true : (stryCov_9fa48("13018", "13019", "13020"), (stryMutAct_9fa48("13021") ? appConfig.validation.password.requireNumbers : (stryCov_9fa48("13021"), !appConfig.validation.password.requireNumbers)) || (stryMutAct_9fa48("13022") ? /\D/ : (stryCov_9fa48("13022"), /\d/)).test(password))), stryMutAct_9fa48("13023") ? "" : (stryCov_9fa48("13023"), 'Password must contain at least one number')).refine(stryMutAct_9fa48("13024") ? () => undefined : (stryCov_9fa48("13024"), password => stryMutAct_9fa48("13027") ? !appConfig.validation.password.requireSpecialChars && /[!@#$%^&*(),.?":{}|<>]/.test(password) : stryMutAct_9fa48("13026") ? false : stryMutAct_9fa48("13025") ? true : (stryCov_9fa48("13025", "13026", "13027"), (stryMutAct_9fa48("13028") ? appConfig.validation.password.requireSpecialChars : (stryCov_9fa48("13028"), !appConfig.validation.password.requireSpecialChars)) || (stryMutAct_9fa48("13029") ? /[^!@#$%^&*(),.?":{}|<>]/ : (stryCov_9fa48("13029"), /[!@#$%^&*(),.?":{}|<>]/)).test(password))), stryMutAct_9fa48("13030") ? "" : (stryCov_9fa48("13030"), 'Password must contain at least one special character'))),
  confirm_password: stryMutAct_9fa48("13031") ? z.string().max(1, 'Please confirm your password') : (stryCov_9fa48("13031"), z.string().min(1, stryMutAct_9fa48("13032") ? "" : (stryCov_9fa48("13032"), 'Please confirm your password'))),
  date_of_birth: z.string().optional(),
  marketing_consent: z.boolean().optional(),
  terms_accepted: z.boolean().refine(stryMutAct_9fa48("13033") ? () => undefined : (stryCov_9fa48("13033"), val => stryMutAct_9fa48("13036") ? val !== true : stryMutAct_9fa48("13035") ? false : stryMutAct_9fa48("13034") ? true : (stryCov_9fa48("13034", "13035", "13036"), val === (stryMutAct_9fa48("13037") ? false : (stryCov_9fa48("13037"), true)))), stryMutAct_9fa48("13038") ? "" : (stryCov_9fa48("13038"), 'You must accept the terms and conditions'))
})).refine(stryMutAct_9fa48("13039") ? () => undefined : (stryCov_9fa48("13039"), data => stryMutAct_9fa48("13042") ? data.password !== data.confirm_password : stryMutAct_9fa48("13041") ? false : stryMutAct_9fa48("13040") ? true : (stryCov_9fa48("13040", "13041", "13042"), data.password === data.confirm_password)), stryMutAct_9fa48("13043") ? {} : (stryCov_9fa48("13043"), {
  message: stryMutAct_9fa48("13044") ? "" : (stryCov_9fa48("13044"), "Passwords don't match"),
  path: stryMutAct_9fa48("13045") ? [] : (stryCov_9fa48("13045"), [stryMutAct_9fa48("13046") ? "" : (stryCov_9fa48("13046"), "confirm_password")])
}));
type RegisterFormData = z.infer<typeof registerSchema>;
export default function RegisterPage() {
  if (stryMutAct_9fa48("13047")) {
    {}
  } else {
    stryCov_9fa48("13047");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(stryMutAct_9fa48("13048") ? true : (stryCov_9fa48("13048"), false));
    const [showConfirmPassword, setShowConfirmPassword] = useState(stryMutAct_9fa48("13049") ? true : (stryCov_9fa48("13049"), false));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("13050") ? true : (stryCov_9fa48("13050"), false));
    const [step, setStep] = useState(1);
    const {
      register,
      handleSubmit,
      formState: {
        errors,
        isSubmitting
      },
      setError,
      watch,
      trigger
    } = useForm<RegisterFormData>(stryMutAct_9fa48("13051") ? {} : (stryCov_9fa48("13051"), {
      resolver: zodResolver(registerSchema),
      defaultValues: stryMutAct_9fa48("13052") ? {} : (stryCov_9fa48("13052"), {
        marketing_consent: stryMutAct_9fa48("13053") ? false : (stryCov_9fa48("13053"), true),
        terms_accepted: stryMutAct_9fa48("13054") ? true : (stryCov_9fa48("13054"), false)
      }),
      mode: stryMutAct_9fa48("13055") ? "" : (stryCov_9fa48("13055"), 'onChange')
    }));
    const watchedPassword = watch(stryMutAct_9fa48("13056") ? "" : (stryCov_9fa48("13056"), 'password'));

    // Check if user is already authenticated
    useEffect(() => {
      if (stryMutAct_9fa48("13057")) {
        {}
      } else {
        stryCov_9fa48("13057");
        // Only run on client side and after initial mount
        if (stryMutAct_9fa48("13060") ? typeof window === 'undefined' : stryMutAct_9fa48("13059") ? false : stryMutAct_9fa48("13058") ? true : (stryCov_9fa48("13058", "13059", "13060"), typeof window !== (stryMutAct_9fa48("13061") ? "" : (stryCov_9fa48("13061"), 'undefined')))) {
          if (stryMutAct_9fa48("13062")) {
            {}
          } else {
            stryCov_9fa48("13062");
            const token = tokenManager.getAccessToken();
            if (stryMutAct_9fa48("13064") ? false : stryMutAct_9fa48("13063") ? true : (stryCov_9fa48("13063", "13064"), token)) {
              if (stryMutAct_9fa48("13065")) {
                {}
              } else {
                stryCov_9fa48("13065");
                router.replace(stryMutAct_9fa48("13066") ? "" : (stryCov_9fa48("13066"), '/dashboard'));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("13067") ? [] : (stryCov_9fa48("13067"), [router]));

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
      if (stryMutAct_9fa48("13068")) {
        {}
      } else {
        stryCov_9fa48("13068");
        let strength = 0;
        if (stryMutAct_9fa48("13072") ? password.length < 8 : stryMutAct_9fa48("13071") ? password.length > 8 : stryMutAct_9fa48("13070") ? false : stryMutAct_9fa48("13069") ? true : (stryCov_9fa48("13069", "13070", "13071", "13072"), password.length >= 8)) stryMutAct_9fa48("13073") ? strength-- : (stryCov_9fa48("13073"), strength++);
        if (stryMutAct_9fa48("13075") ? false : stryMutAct_9fa48("13074") ? true : (stryCov_9fa48("13074", "13075"), (stryMutAct_9fa48("13076") ? /[^A-Z]/ : (stryCov_9fa48("13076"), /[A-Z]/)).test(password))) stryMutAct_9fa48("13077") ? strength-- : (stryCov_9fa48("13077"), strength++);
        if (stryMutAct_9fa48("13079") ? false : stryMutAct_9fa48("13078") ? true : (stryCov_9fa48("13078", "13079"), (stryMutAct_9fa48("13080") ? /[^a-z]/ : (stryCov_9fa48("13080"), /[a-z]/)).test(password))) stryMutAct_9fa48("13081") ? strength-- : (stryCov_9fa48("13081"), strength++);
        if (stryMutAct_9fa48("13083") ? false : stryMutAct_9fa48("13082") ? true : (stryCov_9fa48("13082", "13083"), (stryMutAct_9fa48("13084") ? /\D/ : (stryCov_9fa48("13084"), /\d/)).test(password))) stryMutAct_9fa48("13085") ? strength-- : (stryCov_9fa48("13085"), strength++);
        if (stryMutAct_9fa48("13087") ? false : stryMutAct_9fa48("13086") ? true : (stryCov_9fa48("13086", "13087"), (stryMutAct_9fa48("13088") ? /[^!@#$%^&*(),.?":{}|<>]/ : (stryCov_9fa48("13088"), /[!@#$%^&*(),.?":{}|<>]/)).test(password))) stryMutAct_9fa48("13089") ? strength-- : (stryCov_9fa48("13089"), strength++);
        return strength;
      }
    };
    const passwordStrength = getPasswordStrength(stryMutAct_9fa48("13092") ? watchedPassword && '' : stryMutAct_9fa48("13091") ? false : stryMutAct_9fa48("13090") ? true : (stryCov_9fa48("13090", "13091", "13092"), watchedPassword || (stryMutAct_9fa48("13093") ? "Stryker was here!" : (stryCov_9fa48("13093"), ''))));

    // Handle step navigation
    const handleNext = async () => {
      if (stryMutAct_9fa48("13094")) {
        {}
      } else {
        stryCov_9fa48("13094");
        const fieldsToValidate = (stryMutAct_9fa48("13097") ? step !== 1 : stryMutAct_9fa48("13096") ? false : stryMutAct_9fa48("13095") ? true : (stryCov_9fa48("13095", "13096", "13097"), step === 1)) ? stryMutAct_9fa48("13098") ? [] : (stryCov_9fa48("13098"), [stryMutAct_9fa48("13099") ? "" : (stryCov_9fa48("13099"), 'first_name'), stryMutAct_9fa48("13100") ? "" : (stryCov_9fa48("13100"), 'last_name'), stryMutAct_9fa48("13101") ? "" : (stryCov_9fa48("13101"), 'email')]) : stryMutAct_9fa48("13102") ? [] : (stryCov_9fa48("13102"), [stryMutAct_9fa48("13103") ? "" : (stryCov_9fa48("13103"), 'password'), stryMutAct_9fa48("13104") ? "" : (stryCov_9fa48("13104"), 'confirm_password')]);
        const isValid = await trigger(fieldsToValidate as any);
        if (stryMutAct_9fa48("13106") ? false : stryMutAct_9fa48("13105") ? true : (stryCov_9fa48("13105", "13106"), isValid)) {
          if (stryMutAct_9fa48("13107")) {
            {}
          } else {
            stryCov_9fa48("13107");
            setStep(stryMutAct_9fa48("13108") ? step - 1 : (stryCov_9fa48("13108"), step + 1));
          }
        }
      }
    };
    const handleBack = () => {
      if (stryMutAct_9fa48("13109")) {
        {}
      } else {
        stryCov_9fa48("13109");
        setStep(stryMutAct_9fa48("13110") ? step + 1 : (stryCov_9fa48("13110"), step - 1));
      }
    };

    // Handle form submission
    const onSubmit = async (data: RegisterFormData) => {
      if (stryMutAct_9fa48("13111")) {
        {}
      } else {
        stryCov_9fa48("13111");
        setIsLoading(stryMutAct_9fa48("13112") ? false : (stryCov_9fa48("13112"), true));
        try {
          if (stryMutAct_9fa48("13113")) {
            {}
          } else {
            stryCov_9fa48("13113");
            // Prepare registration data
            const registerData = stryMutAct_9fa48("13114") ? {} : (stryCov_9fa48("13114"), {
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              password: data.password,
              date_of_birth: stryMutAct_9fa48("13117") ? data.date_of_birth && undefined : stryMutAct_9fa48("13116") ? false : stryMutAct_9fa48("13115") ? true : (stryCov_9fa48("13115", "13116", "13117"), data.date_of_birth || undefined),
              marketing_consent: stryMutAct_9fa48("13120") ? data.marketing_consent && false : stryMutAct_9fa48("13119") ? false : stryMutAct_9fa48("13118") ? true : (stryCov_9fa48("13118", "13119", "13120"), data.marketing_consent || (stryMutAct_9fa48("13121") ? true : (stryCov_9fa48("13121"), false)))
            });
            const response = await api.register(registerData);
            const {
              access_token,
              refresh_token,
              user
            } = response.data;

            // Store tokens
            tokenManager.setTokens(access_token, refresh_token);

            // Store user data
            if (stryMutAct_9fa48("13124") ? typeof window === 'undefined' : stryMutAct_9fa48("13123") ? false : stryMutAct_9fa48("13122") ? true : (stryCov_9fa48("13122", "13123", "13124"), typeof window !== (stryMutAct_9fa48("13125") ? "" : (stryCov_9fa48("13125"), 'undefined')))) {
              if (stryMutAct_9fa48("13126")) {
                {}
              } else {
                stryCov_9fa48("13126");
                localStorage.setItem(appConfig.storage.user, JSON.stringify(user));
              }
            }

            // Track registration event with PostHog (non-blocking)
            try {
              if (stryMutAct_9fa48("13127")) {
                {}
              } else {
                stryCov_9fa48("13127");
                const {
                  trackEvent,
                  identifyUser
                } = await import(stryMutAct_9fa48("13128") ? "" : (stryCov_9fa48("13128"), '@/lib/analytics'));

                // Identify the user
                identifyUser(user.id, stryMutAct_9fa48("13129") ? {} : (stryCov_9fa48("13129"), {
                  email: user.email,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  created_at: user.created_at,
                  subscription_tier: user.subscription_tier
                }));

                // Track registration event
                trackEvent(stryMutAct_9fa48("13130") ? "" : (stryCov_9fa48("13130"), 'user_register'), stryMutAct_9fa48("13131") ? {} : (stryCov_9fa48("13131"), {
                  method: stryMutAct_9fa48("13132") ? "" : (stryCov_9fa48("13132"), 'email'),
                  marketing_consent: data.marketing_consent,
                  user_id: user.id,
                  source: stryMutAct_9fa48("13133") ? "" : (stryCov_9fa48("13133"), 'web'),
                  timestamp: new Date().toISOString()
                }));
              }
            } catch (analyticsError) {
              if (stryMutAct_9fa48("13134")) {
                {}
              } else {
                stryCov_9fa48("13134");
                console.warn(stryMutAct_9fa48("13135") ? "" : (stryCov_9fa48("13135"), 'Analytics tracking failed:'), analyticsError);
                // Don't let analytics errors affect the registration flow
              }
            }

            // Show success message
            toast.success(stryMutAct_9fa48("13136") ? "" : (stryCov_9fa48("13136"), 'Account created successfully! Welcome to aclue.'));

            // Redirect to dashboard
            setTimeout(() => {
              if (stryMutAct_9fa48("13137")) {
                {}
              } else {
                stryCov_9fa48("13137");
                router.push(stryMutAct_9fa48("13138") ? "" : (stryCov_9fa48("13138"), '/dashboard'));
              }
            }, 100);
          }
        } catch (error: any) {
          if (stryMutAct_9fa48("13139")) {
            {}
          } else {
            stryCov_9fa48("13139");
            console.error(stryMutAct_9fa48("13140") ? "" : (stryCov_9fa48("13140"), 'Registration error:'), error);
            if (stryMutAct_9fa48("13143") ? error.status !== 422 : stryMutAct_9fa48("13142") ? false : stryMutAct_9fa48("13141") ? true : (stryCov_9fa48("13141", "13142", "13143"), error.status === 422)) {
              if (stryMutAct_9fa48("13144")) {
                {}
              } else {
                stryCov_9fa48("13144");
                // Handle validation errors
                if (stryMutAct_9fa48("13147") ? error.details.email : stryMutAct_9fa48("13146") ? false : stryMutAct_9fa48("13145") ? true : (stryCov_9fa48("13145", "13146", "13147"), error.details?.email)) {
                  if (stryMutAct_9fa48("13148")) {
                    {}
                  } else {
                    stryCov_9fa48("13148");
                    setError(stryMutAct_9fa48("13149") ? "" : (stryCov_9fa48("13149"), 'email'), stryMutAct_9fa48("13150") ? {} : (stryCov_9fa48("13150"), {
                      message: error.details.email[0]
                    }));
                    setStep(1); // Go back to email step
                  }
                }
                if (stryMutAct_9fa48("13153") ? error.details.password : stryMutAct_9fa48("13152") ? false : stryMutAct_9fa48("13151") ? true : (stryCov_9fa48("13151", "13152", "13153"), error.details?.password)) {
                  if (stryMutAct_9fa48("13154")) {
                    {}
                  } else {
                    stryCov_9fa48("13154");
                    setError(stryMutAct_9fa48("13155") ? "" : (stryCov_9fa48("13155"), 'password'), stryMutAct_9fa48("13156") ? {} : (stryCov_9fa48("13156"), {
                      message: error.details.password[0]
                    }));
                    setStep(2); // Go back to password step
                  }
                }
                if (stryMutAct_9fa48("13159") ? error.details.first_name : stryMutAct_9fa48("13158") ? false : stryMutAct_9fa48("13157") ? true : (stryCov_9fa48("13157", "13158", "13159"), error.details?.first_name)) {
                  if (stryMutAct_9fa48("13160")) {
                    {}
                  } else {
                    stryCov_9fa48("13160");
                    setError(stryMutAct_9fa48("13161") ? "" : (stryCov_9fa48("13161"), 'first_name'), stryMutAct_9fa48("13162") ? {} : (stryCov_9fa48("13162"), {
                      message: error.details.first_name[0]
                    }));
                    setStep(1);
                  }
                }
                if (stryMutAct_9fa48("13165") ? error.details.last_name : stryMutAct_9fa48("13164") ? false : stryMutAct_9fa48("13163") ? true : (stryCov_9fa48("13163", "13164", "13165"), error.details?.last_name)) {
                  if (stryMutAct_9fa48("13166")) {
                    {}
                  } else {
                    stryCov_9fa48("13166");
                    setError(stryMutAct_9fa48("13167") ? "" : (stryCov_9fa48("13167"), 'last_name'), stryMutAct_9fa48("13168") ? {} : (stryCov_9fa48("13168"), {
                      message: error.details.last_name[0]
                    }));
                    setStep(1);
                  }
                }
              }
            } else if (stryMutAct_9fa48("13171") ? error.status !== 409 : stryMutAct_9fa48("13170") ? false : stryMutAct_9fa48("13169") ? true : (stryCov_9fa48("13169", "13170", "13171"), error.status === 409)) {
              if (stryMutAct_9fa48("13172")) {
                {}
              } else {
                stryCov_9fa48("13172");
                setError(stryMutAct_9fa48("13173") ? "" : (stryCov_9fa48("13173"), 'email'), stryMutAct_9fa48("13174") ? {} : (stryCov_9fa48("13174"), {
                  message: stryMutAct_9fa48("13175") ? "" : (stryCov_9fa48("13175"), 'An account with this email already exists')
                }));
                setStep(1);
              }
            } else if (stryMutAct_9fa48("13178") ? error.code === 'NETWORK_ERROR' && error.message === 'Network Error' : stryMutAct_9fa48("13177") ? false : stryMutAct_9fa48("13176") ? true : (stryCov_9fa48("13176", "13177", "13178"), (stryMutAct_9fa48("13180") ? error.code !== 'NETWORK_ERROR' : stryMutAct_9fa48("13179") ? false : (stryCov_9fa48("13179", "13180"), error.code === (stryMutAct_9fa48("13181") ? "" : (stryCov_9fa48("13181"), 'NETWORK_ERROR')))) || (stryMutAct_9fa48("13183") ? error.message !== 'Network Error' : stryMutAct_9fa48("13182") ? false : (stryCov_9fa48("13182", "13183"), error.message === (stryMutAct_9fa48("13184") ? "" : (stryCov_9fa48("13184"), 'Network Error')))))) {
              if (stryMutAct_9fa48("13185")) {
                {}
              } else {
                stryCov_9fa48("13185");
                toast.error(stryMutAct_9fa48("13186") ? "" : (stryCov_9fa48("13186"), 'Network error: Unable to connect to server. Please check your connection and try again.'));
              }
            } else if (stryMutAct_9fa48("13190") ? error.status < 500 : stryMutAct_9fa48("13189") ? error.status > 500 : stryMutAct_9fa48("13188") ? false : stryMutAct_9fa48("13187") ? true : (stryCov_9fa48("13187", "13188", "13189", "13190"), error.status >= 500)) {
              if (stryMutAct_9fa48("13191")) {
                {}
              } else {
                stryCov_9fa48("13191");
                toast.error(stryMutAct_9fa48("13192") ? "" : (stryCov_9fa48("13192"), 'Server error: The service is temporarily unavailable. Please try again later.'));
              }
            } else {
              if (stryMutAct_9fa48("13193")) {
                {}
              } else {
                stryCov_9fa48("13193");
                toast.error(stryMutAct_9fa48("13196") ? error.message && 'Failed to create account. Please try again.' : stryMutAct_9fa48("13195") ? false : stryMutAct_9fa48("13194") ? true : (stryCov_9fa48("13194", "13195", "13196"), error.message || (stryMutAct_9fa48("13197") ? "" : (stryCov_9fa48("13197"), 'Failed to create account. Please try again.'))));
              }
            }
          }
        } finally {
          if (stryMutAct_9fa48("13198")) {
            {}
          } else {
            stryCov_9fa48("13198");
            setIsLoading(stryMutAct_9fa48("13199") ? true : (stryCov_9fa48("13199"), false));
          }
        }
      }
    };
    return <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
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
          <motion.div className="text-center mb-8" initial={stryMutAct_9fa48("13200") ? {} : (stryCov_9fa48("13200"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("13201") ? {} : (stryCov_9fa48("13201"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("13202") ? {} : (stryCov_9fa48("13202"), {
            duration: 0.5
          })}>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                <Image src="/logo.png" alt="aclue logo" width={24} height={24} className="rounded-lg" />
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
              {(stryMutAct_9fa48("13203") ? [] : (stryCov_9fa48("13203"), [1, 2, 3])).map(stryMutAct_9fa48("13204") ? () => undefined : (stryCov_9fa48("13204"), stepNumber => <div key={stepNumber} className={stryMutAct_9fa48("13205") ? `` : (stryCov_9fa48("13205"), `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${(stryMutAct_9fa48("13209") ? stepNumber > step : stryMutAct_9fa48("13208") ? stepNumber < step : stryMutAct_9fa48("13207") ? false : stryMutAct_9fa48("13206") ? true : (stryCov_9fa48("13206", "13207", "13208", "13209"), stepNumber <= step)) ? stryMutAct_9fa48("13210") ? "" : (stryCov_9fa48("13210"), 'bg-primary-600 text-white') : stryMutAct_9fa48("13211") ? "" : (stryCov_9fa48("13211"), 'bg-gray-200 text-gray-600')}`)}>
                  {(stryMutAct_9fa48("13215") ? stepNumber >= step : stryMutAct_9fa48("13214") ? stepNumber <= step : stryMutAct_9fa48("13213") ? false : stryMutAct_9fa48("13212") ? true : (stryCov_9fa48("13212", "13213", "13214", "13215"), stepNumber < step)) ? <Check className="w-4 h-4" /> : stepNumber}
                </div>))}
            </div>
            <div className="flex justify-center mt-2">
              <div className="text-sm text-gray-600">
                Step {step} of 3
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <motion.div className="bg-white rounded-2xl shadow-xl p-8" initial={stryMutAct_9fa48("13216") ? {} : (stryCov_9fa48("13216"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("13217") ? {} : (stryCov_9fa48("13217"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("13218") ? {} : (stryCov_9fa48("13218"), {
            duration: 0.5,
            delay: 0.1
          })}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {stryMutAct_9fa48("13221") ? step === 1 || <motion.div initial={{
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
                      <input {...register('first_name')} type="text" id="first_name" className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`} placeholder="Enter your first name" disabled={isLoading} />
                    </div>
                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>}
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
                      <input {...register('last_name')} type="text" id="last_name" className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`} placeholder="Enter your last name" disabled={isLoading} />
                    </div>
                    {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>}
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
                      <input {...register('email')} type="email" id="email" className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`} placeholder="Enter your email" disabled={isLoading} />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  {/* Date of Birth (Optional) */}
                  <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of birth <span className="text-gray-500">(optional)</span>
                    </label>
                    <input {...register('date_of_birth')} type="date" id="date_of_birth" lang="en-GB" className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" disabled={isLoading} />
                    <p className="mt-1 text-xs text-gray-500">
                      This helps us provide age-appropriate gift recommendations. Use DD/MM/YYYY format.
                    </p>
                  </div>
                </motion.div> : stryMutAct_9fa48("13220") ? false : stryMutAct_9fa48("13219") ? true : (stryCov_9fa48("13219", "13220", "13221"), (stryMutAct_9fa48("13223") ? step !== 1 : stryMutAct_9fa48("13222") ? true : (stryCov_9fa48("13222", "13223"), step === 1)) && <motion.div initial={stryMutAct_9fa48("13224") ? {} : (stryCov_9fa48("13224"), {
                opacity: 0,
                x: 20
              })} animate={stryMutAct_9fa48("13225") ? {} : (stryCov_9fa48("13225"), {
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
                      <input {...register(stryMutAct_9fa48("13226") ? "" : (stryCov_9fa48("13226"), 'first_name'))} type="text" id="first_name" className={stryMutAct_9fa48("13227") ? `` : (stryCov_9fa48("13227"), `block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.first_name ? stryMutAct_9fa48("13228") ? "" : (stryCov_9fa48("13228"), 'border-red-300 bg-red-50') : stryMutAct_9fa48("13229") ? "" : (stryCov_9fa48("13229"), 'border-gray-300 hover:border-gray-400')}`)} placeholder="Enter your first name" disabled={isLoading} />
                    </div>
                    {stryMutAct_9fa48("13232") ? errors.first_name || <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p> : stryMutAct_9fa48("13231") ? false : stryMutAct_9fa48("13230") ? true : (stryCov_9fa48("13230", "13231", "13232"), errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>)}
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
                      <input {...register(stryMutAct_9fa48("13233") ? "" : (stryCov_9fa48("13233"), 'last_name'))} type="text" id="last_name" className={stryMutAct_9fa48("13234") ? `` : (stryCov_9fa48("13234"), `block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.last_name ? stryMutAct_9fa48("13235") ? "" : (stryCov_9fa48("13235"), 'border-red-300 bg-red-50') : stryMutAct_9fa48("13236") ? "" : (stryCov_9fa48("13236"), 'border-gray-300 hover:border-gray-400')}`)} placeholder="Enter your last name" disabled={isLoading} />
                    </div>
                    {stryMutAct_9fa48("13239") ? errors.last_name || <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p> : stryMutAct_9fa48("13238") ? false : stryMutAct_9fa48("13237") ? true : (stryCov_9fa48("13237", "13238", "13239"), errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>)}
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
                      <input {...register(stryMutAct_9fa48("13240") ? "" : (stryCov_9fa48("13240"), 'email'))} type="email" id="email" className={stryMutAct_9fa48("13241") ? `` : (stryCov_9fa48("13241"), `block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.email ? stryMutAct_9fa48("13242") ? "" : (stryCov_9fa48("13242"), 'border-red-300 bg-red-50') : stryMutAct_9fa48("13243") ? "" : (stryCov_9fa48("13243"), 'border-gray-300 hover:border-gray-400')}`)} placeholder="Enter your email" disabled={isLoading} />
                    </div>
                    {stryMutAct_9fa48("13246") ? errors.email || <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : stryMutAct_9fa48("13245") ? false : stryMutAct_9fa48("13244") ? true : (stryCov_9fa48("13244", "13245", "13246"), errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>)}
                  </div>

                  {/* Date of Birth (Optional) */}
                  <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of birth <span className="text-gray-500">(optional)</span>
                    </label>
                    <input {...register(stryMutAct_9fa48("13247") ? "" : (stryCov_9fa48("13247"), 'date_of_birth'))} type="date" id="date_of_birth" lang="en-GB" className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors hover:border-gray-400" disabled={isLoading} />
                    <p className="mt-1 text-xs text-gray-500">
                      This helps us provide age-appropriate gift recommendations. Use DD/MM/YYYY format.
                    </p>
                  </div>
                </motion.div>)}

              {/* Step 2: Password */}
              {stryMutAct_9fa48("13250") ? step === 2 || <motion.div initial={{
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
                      <input {...register('password')} type={showPassword ? 'text' : 'password'} id="password" className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`} placeholder="Create a password" disabled={isLoading} />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {watchedPassword && <div className="mt-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(level => <div key={level} className={`h-1 flex-1 rounded ${level <= passwordStrength ? passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-200'}`} />)}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Password strength: {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                        </p>
                      </div>}

                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
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
                      <input {...register('confirm_password')} type={showConfirmPassword ? 'text' : 'password'} id="confirm_password" className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.confirm_password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`} placeholder="Confirm your password" disabled={isLoading} />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>
                    {errors.confirm_password && <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>}
                  </div>
                </motion.div> : stryMutAct_9fa48("13249") ? false : stryMutAct_9fa48("13248") ? true : (stryCov_9fa48("13248", "13249", "13250"), (stryMutAct_9fa48("13252") ? step !== 2 : stryMutAct_9fa48("13251") ? true : (stryCov_9fa48("13251", "13252"), step === 2)) && <motion.div initial={stryMutAct_9fa48("13253") ? {} : (stryCov_9fa48("13253"), {
                opacity: 0,
                x: 20
              })} animate={stryMutAct_9fa48("13254") ? {} : (stryCov_9fa48("13254"), {
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
                      <input {...register(stryMutAct_9fa48("13255") ? "" : (stryCov_9fa48("13255"), 'password'))} type={showPassword ? stryMutAct_9fa48("13256") ? "" : (stryCov_9fa48("13256"), 'text') : stryMutAct_9fa48("13257") ? "" : (stryCov_9fa48("13257"), 'password')} id="password" className={stryMutAct_9fa48("13258") ? `` : (stryCov_9fa48("13258"), `block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.password ? stryMutAct_9fa48("13259") ? "" : (stryCov_9fa48("13259"), 'border-red-300 bg-red-50') : stryMutAct_9fa48("13260") ? "" : (stryCov_9fa48("13260"), 'border-gray-300 hover:border-gray-400')}`)} placeholder="Create a password" disabled={isLoading} />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={stryMutAct_9fa48("13261") ? () => undefined : (stryCov_9fa48("13261"), () => setShowPassword(stryMutAct_9fa48("13262") ? showPassword : (stryCov_9fa48("13262"), !showPassword)))}>
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {stryMutAct_9fa48("13265") ? watchedPassword || <div className="mt-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(level => <div key={level} className={`h-1 flex-1 rounded ${level <= passwordStrength ? passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-200'}`} />)}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Password strength: {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                        </p>
                      </div> : stryMutAct_9fa48("13264") ? false : stryMutAct_9fa48("13263") ? true : (stryCov_9fa48("13263", "13264", "13265"), watchedPassword && <div className="mt-2">
                        <div className="flex gap-1">
                          {(stryMutAct_9fa48("13266") ? [] : (stryCov_9fa48("13266"), [1, 2, 3, 4, 5])).map(stryMutAct_9fa48("13267") ? () => undefined : (stryCov_9fa48("13267"), level => <div key={level} className={stryMutAct_9fa48("13268") ? `` : (stryCov_9fa48("13268"), `h-1 flex-1 rounded ${(stryMutAct_9fa48("13272") ? level > passwordStrength : stryMutAct_9fa48("13271") ? level < passwordStrength : stryMutAct_9fa48("13270") ? false : stryMutAct_9fa48("13269") ? true : (stryCov_9fa48("13269", "13270", "13271", "13272"), level <= passwordStrength)) ? (stryMutAct_9fa48("13276") ? passwordStrength > 2 : stryMutAct_9fa48("13275") ? passwordStrength < 2 : stryMutAct_9fa48("13274") ? false : stryMutAct_9fa48("13273") ? true : (stryCov_9fa48("13273", "13274", "13275", "13276"), passwordStrength <= 2)) ? stryMutAct_9fa48("13277") ? "" : (stryCov_9fa48("13277"), 'bg-red-500') : (stryMutAct_9fa48("13281") ? passwordStrength > 3 : stryMutAct_9fa48("13280") ? passwordStrength < 3 : stryMutAct_9fa48("13279") ? false : stryMutAct_9fa48("13278") ? true : (stryCov_9fa48("13278", "13279", "13280", "13281"), passwordStrength <= 3)) ? stryMutAct_9fa48("13282") ? "" : (stryCov_9fa48("13282"), 'bg-yellow-500') : stryMutAct_9fa48("13283") ? "" : (stryCov_9fa48("13283"), 'bg-green-500') : stryMutAct_9fa48("13284") ? "" : (stryCov_9fa48("13284"), 'bg-gray-200')}`)} />))}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Password strength: {(stryMutAct_9fa48("13288") ? passwordStrength > 2 : stryMutAct_9fa48("13287") ? passwordStrength < 2 : stryMutAct_9fa48("13286") ? false : stryMutAct_9fa48("13285") ? true : (stryCov_9fa48("13285", "13286", "13287", "13288"), passwordStrength <= 2)) ? stryMutAct_9fa48("13289") ? "" : (stryCov_9fa48("13289"), 'Weak') : (stryMutAct_9fa48("13293") ? passwordStrength > 3 : stryMutAct_9fa48("13292") ? passwordStrength < 3 : stryMutAct_9fa48("13291") ? false : stryMutAct_9fa48("13290") ? true : (stryCov_9fa48("13290", "13291", "13292", "13293"), passwordStrength <= 3)) ? stryMutAct_9fa48("13294") ? "" : (stryCov_9fa48("13294"), 'Medium') : stryMutAct_9fa48("13295") ? "" : (stryCov_9fa48("13295"), 'Strong')}
                        </p>
                      </div>)}

                    {stryMutAct_9fa48("13298") ? errors.password || <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : stryMutAct_9fa48("13297") ? false : stryMutAct_9fa48("13296") ? true : (stryCov_9fa48("13296", "13297", "13298"), errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>)}
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
                      <input {...register(stryMutAct_9fa48("13299") ? "" : (stryCov_9fa48("13299"), 'confirm_password'))} type={showConfirmPassword ? stryMutAct_9fa48("13300") ? "" : (stryCov_9fa48("13300"), 'text') : stryMutAct_9fa48("13301") ? "" : (stryCov_9fa48("13301"), 'password')} id="confirm_password" className={stryMutAct_9fa48("13302") ? `` : (stryCov_9fa48("13302"), `block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors.confirm_password ? stryMutAct_9fa48("13303") ? "" : (stryCov_9fa48("13303"), 'border-red-300 bg-red-50') : stryMutAct_9fa48("13304") ? "" : (stryCov_9fa48("13304"), 'border-gray-300 hover:border-gray-400')}`)} placeholder="Confirm your password" disabled={isLoading} />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={stryMutAct_9fa48("13305") ? () => undefined : (stryCov_9fa48("13305"), () => setShowConfirmPassword(stryMutAct_9fa48("13306") ? showConfirmPassword : (stryCov_9fa48("13306"), !showConfirmPassword)))}>
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>
                    {stryMutAct_9fa48("13309") ? errors.confirm_password || <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p> : stryMutAct_9fa48("13308") ? false : stryMutAct_9fa48("13307") ? true : (stryCov_9fa48("13307", "13308", "13309"), errors.confirm_password && <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>)}
                  </div>
                </motion.div>)}

              {/* Step 3: Terms and Marketing */}
              {stryMutAct_9fa48("13312") ? step === 3 || <motion.div initial={{
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
                      <input {...register('marketing_consent')} id="marketing_consent" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" disabled={isLoading} />
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
                      <input {...register('terms_accepted')} id="terms_accepted" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" disabled={isLoading} />
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
                  {errors.terms_accepted && <p className="text-sm text-red-600">{errors.terms_accepted.message}</p>}
                </motion.div> : stryMutAct_9fa48("13311") ? false : stryMutAct_9fa48("13310") ? true : (stryCov_9fa48("13310", "13311", "13312"), (stryMutAct_9fa48("13314") ? step !== 3 : stryMutAct_9fa48("13313") ? true : (stryCov_9fa48("13313", "13314"), step === 3)) && <motion.div initial={stryMutAct_9fa48("13315") ? {} : (stryCov_9fa48("13315"), {
                opacity: 0,
                x: 20
              })} animate={stryMutAct_9fa48("13316") ? {} : (stryCov_9fa48("13316"), {
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
                      <input {...register(stryMutAct_9fa48("13317") ? "" : (stryCov_9fa48("13317"), 'marketing_consent'))} id="marketing_consent" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" disabled={isLoading} />
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
                      <input {...register(stryMutAct_9fa48("13318") ? "" : (stryCov_9fa48("13318"), 'terms_accepted'))} id="terms_accepted" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" disabled={isLoading} />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms_accepted" className="text-gray-700">
                        I agree to the{stryMutAct_9fa48("13319") ? "" : (stryCov_9fa48("13319"), ' ')}
                        <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                          Terms of Service
                        </Link>{stryMutAct_9fa48("13320") ? "" : (stryCov_9fa48("13320"), ' ')}
                        and{stryMutAct_9fa48("13321") ? "" : (stryCov_9fa48("13321"), ' ')}
                        <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>
                  </div>
                  {stryMutAct_9fa48("13324") ? errors.terms_accepted || <p className="text-sm text-red-600">{errors.terms_accepted.message}</p> : stryMutAct_9fa48("13323") ? false : stryMutAct_9fa48("13322") ? true : (stryCov_9fa48("13322", "13323", "13324"), errors.terms_accepted && <p className="text-sm text-red-600">{errors.terms_accepted.message}</p>)}
                </motion.div>)}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {stryMutAct_9fa48("13327") ? step > 1 || <button type="button" onClick={handleBack} disabled={isLoading} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Back
                  </button> : stryMutAct_9fa48("13326") ? false : stryMutAct_9fa48("13325") ? true : (stryCov_9fa48("13325", "13326", "13327"), (stryMutAct_9fa48("13330") ? step <= 1 : stryMutAct_9fa48("13329") ? step >= 1 : stryMutAct_9fa48("13328") ? true : (stryCov_9fa48("13328", "13329", "13330"), step > 1)) && <button type="button" onClick={handleBack} disabled={isLoading} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Back
                  </button>)}
                
                {(stryMutAct_9fa48("13334") ? step >= 3 : stryMutAct_9fa48("13333") ? step <= 3 : stryMutAct_9fa48("13332") ? false : stryMutAct_9fa48("13331") ? true : (stryCov_9fa48("13331", "13332", "13333", "13334"), step < 3)) ? <motion.button type="button" onClick={handleNext} disabled={isLoading} className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" whileHover={stryMutAct_9fa48("13335") ? {} : (stryCov_9fa48("13335"), {
                  scale: isLoading ? 1 : 1.02
                })} whileTap={stryMutAct_9fa48("13336") ? {} : (stryCov_9fa48("13336"), {
                  scale: isLoading ? 1 : 0.98
                })}>
                    Continue
                  </motion.button> : <motion.button type="submit" disabled={stryMutAct_9fa48("13339") ? isLoading && isSubmitting : stryMutAct_9fa48("13338") ? false : stryMutAct_9fa48("13337") ? true : (stryCov_9fa48("13337", "13338", "13339"), isLoading || isSubmitting)} className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" whileHover={stryMutAct_9fa48("13340") ? {} : (stryCov_9fa48("13340"), {
                  scale: isLoading ? 1 : 1.02
                })} whileTap={stryMutAct_9fa48("13341") ? {} : (stryCov_9fa48("13341"), {
                  scale: isLoading ? 1 : 0.98
                })}>
                    {isLoading ? <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </div> : stryMutAct_9fa48("13342") ? "" : (stryCov_9fa48("13342"), 'Create account')}
                  </motion.button>}
              </div>
            </form>

            {/* Registration Information (only on step 1) */}
            {stryMutAct_9fa48("13345") ? step === 1 || <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Gift className="h-5 w-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900">
                      Secure Email Registration
                    </h4>
                    <p className="mt-1 text-sm text-blue-700">
                      We use email-based registration to keep your account secure and provide personalised gift recommendations.
                      Social sign-in options coming soon!
                    </p>
                  </div>
                </div>
              </div> : stryMutAct_9fa48("13344") ? false : stryMutAct_9fa48("13343") ? true : (stryCov_9fa48("13343", "13344", "13345"), (stryMutAct_9fa48("13347") ? step !== 1 : stryMutAct_9fa48("13346") ? true : (stryCov_9fa48("13346", "13347"), step === 1)) && <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Gift className="h-5 w-5 text-blue-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-900">
                      Secure Email Registration
                    </h4>
                    <p className="mt-1 text-sm text-blue-700">
                      We use email-based registration to keep your account secure and provide personalised gift recommendations.
                      Social sign-in options coming soon!
                    </p>
                  </div>
                </div>
              </div>)}
          </motion.div>

          {/* Sign In Link */}
          <motion.div className="text-center mt-8" initial={stryMutAct_9fa48("13348") ? {} : (stryCov_9fa48("13348"), {
            opacity: 0
          })} animate={stryMutAct_9fa48("13349") ? {} : (stryCov_9fa48("13349"), {
            opacity: 1
          })} transition={stryMutAct_9fa48("13350") ? {} : (stryCov_9fa48("13350"), {
            duration: 0.5,
            delay: 0.2
          })}>
            <p className="text-gray-600">
              Already have an account?{stryMutAct_9fa48("13351") ? "" : (stryCov_9fa48("13351"), ' ')}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>;
  }
}