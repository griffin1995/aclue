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
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Contact Form - Client Component
 *
 * Interactive contact form with form validation, submission handling, and user feedback.
 * This component provides the interactive functionality needed for user engagement.
 *
 * Features:
 * - Real-time form validation
 * - Progressive enhancement patterns
 * - Accessible form design
 * - Error handling and user feedback
 * - Submit state management
 * - Integration with backend API
 */

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}
interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}
export default function ContactForm() {
  if (stryMutAct_9fa48("3843")) {
    {}
  } else {
    stryCov_9fa48("3843");
    const [formData, setFormData] = useState<FormData>(stryMutAct_9fa48("3844") ? {} : (stryCov_9fa48("3844"), {
      name: stryMutAct_9fa48("3845") ? "Stryker was here!" : (stryCov_9fa48("3845"), ''),
      email: stryMutAct_9fa48("3846") ? "Stryker was here!" : (stryCov_9fa48("3846"), ''),
      subject: stryMutAct_9fa48("3847") ? "Stryker was here!" : (stryCov_9fa48("3847"), ''),
      message: stryMutAct_9fa48("3848") ? "Stryker was here!" : (stryCov_9fa48("3848"), ''),
      category: stryMutAct_9fa48("3849") ? "" : (stryCov_9fa48("3849"), 'general')
    }));
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("3850") ? true : (stryCov_9fa48("3850"), false));
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>(stryMutAct_9fa48("3851") ? "" : (stryCov_9fa48("3851"), 'idle'));
    const categories = stryMutAct_9fa48("3852") ? [] : (stryCov_9fa48("3852"), [stryMutAct_9fa48("3853") ? {} : (stryCov_9fa48("3853"), {
      value: stryMutAct_9fa48("3854") ? "" : (stryCov_9fa48("3854"), 'general'),
      label: stryMutAct_9fa48("3855") ? "" : (stryCov_9fa48("3855"), 'General Enquiry')
    }), stryMutAct_9fa48("3856") ? {} : (stryCov_9fa48("3856"), {
      value: stryMutAct_9fa48("3857") ? "" : (stryCov_9fa48("3857"), 'support'),
      label: stryMutAct_9fa48("3858") ? "" : (stryCov_9fa48("3858"), 'Technical Support')
    }), stryMutAct_9fa48("3859") ? {} : (stryCov_9fa48("3859"), {
      value: stryMutAct_9fa48("3860") ? "" : (stryCov_9fa48("3860"), 'beta'),
      label: stryMutAct_9fa48("3861") ? "" : (stryCov_9fa48("3861"), 'Beta Program')
    }), stryMutAct_9fa48("3862") ? {} : (stryCov_9fa48("3862"), {
      value: stryMutAct_9fa48("3863") ? "" : (stryCov_9fa48("3863"), 'business'),
      label: stryMutAct_9fa48("3864") ? "" : (stryCov_9fa48("3864"), 'Business Enquiry')
    }), stryMutAct_9fa48("3865") ? {} : (stryCov_9fa48("3865"), {
      value: stryMutAct_9fa48("3866") ? "" : (stryCov_9fa48("3866"), 'press'),
      label: stryMutAct_9fa48("3867") ? "" : (stryCov_9fa48("3867"), 'Press & Media')
    }), stryMutAct_9fa48("3868") ? {} : (stryCov_9fa48("3868"), {
      value: stryMutAct_9fa48("3869") ? "" : (stryCov_9fa48("3869"), 'feedback'),
      label: stryMutAct_9fa48("3870") ? "" : (stryCov_9fa48("3870"), 'Feedback & Suggestions')
    })]);
    const validateForm = (): boolean => {
      if (stryMutAct_9fa48("3871")) {
        {}
      } else {
        stryCov_9fa48("3871");
        const newErrors: FormErrors = {};
        if (stryMutAct_9fa48("3874") ? false : stryMutAct_9fa48("3873") ? true : stryMutAct_9fa48("3872") ? formData.name.trim() : (stryCov_9fa48("3872", "3873", "3874"), !(stryMutAct_9fa48("3875") ? formData.name : (stryCov_9fa48("3875"), formData.name.trim())))) {
          if (stryMutAct_9fa48("3876")) {
            {}
          } else {
            stryCov_9fa48("3876");
            newErrors.name = stryMutAct_9fa48("3877") ? "" : (stryCov_9fa48("3877"), 'Name is required');
          }
        }
        if (stryMutAct_9fa48("3880") ? false : stryMutAct_9fa48("3879") ? true : stryMutAct_9fa48("3878") ? formData.email.trim() : (stryCov_9fa48("3878", "3879", "3880"), !(stryMutAct_9fa48("3881") ? formData.email : (stryCov_9fa48("3881"), formData.email.trim())))) {
          if (stryMutAct_9fa48("3882")) {
            {}
          } else {
            stryCov_9fa48("3882");
            newErrors.email = stryMutAct_9fa48("3883") ? "" : (stryCov_9fa48("3883"), 'Email is required');
          }
        } else if (stryMutAct_9fa48("3886") ? false : stryMutAct_9fa48("3885") ? true : stryMutAct_9fa48("3884") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) : (stryCov_9fa48("3884", "3885", "3886"), !(stryMutAct_9fa48("3897") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("3896") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("3895") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("3894") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("3893") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("3892") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("3891") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("3890") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("3889") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("3888") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("3887") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("3887", "3888", "3889", "3890", "3891", "3892", "3893", "3894", "3895", "3896", "3897"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(formData.email))) {
          if (stryMutAct_9fa48("3898")) {
            {}
          } else {
            stryCov_9fa48("3898");
            newErrors.email = stryMutAct_9fa48("3899") ? "" : (stryCov_9fa48("3899"), 'Please enter a valid email address');
          }
        }
        if (stryMutAct_9fa48("3902") ? false : stryMutAct_9fa48("3901") ? true : stryMutAct_9fa48("3900") ? formData.subject.trim() : (stryCov_9fa48("3900", "3901", "3902"), !(stryMutAct_9fa48("3903") ? formData.subject : (stryCov_9fa48("3903"), formData.subject.trim())))) {
          if (stryMutAct_9fa48("3904")) {
            {}
          } else {
            stryCov_9fa48("3904");
            newErrors.subject = stryMutAct_9fa48("3905") ? "" : (stryCov_9fa48("3905"), 'Subject is required');
          }
        }
        if (stryMutAct_9fa48("3908") ? false : stryMutAct_9fa48("3907") ? true : stryMutAct_9fa48("3906") ? formData.message.trim() : (stryCov_9fa48("3906", "3907", "3908"), !(stryMutAct_9fa48("3909") ? formData.message : (stryCov_9fa48("3909"), formData.message.trim())))) {
          if (stryMutAct_9fa48("3910")) {
            {}
          } else {
            stryCov_9fa48("3910");
            newErrors.message = stryMutAct_9fa48("3911") ? "" : (stryCov_9fa48("3911"), 'Message is required');
          }
        } else if (stryMutAct_9fa48("3915") ? formData.message.trim().length >= 10 : stryMutAct_9fa48("3914") ? formData.message.trim().length <= 10 : stryMutAct_9fa48("3913") ? false : stryMutAct_9fa48("3912") ? true : (stryCov_9fa48("3912", "3913", "3914", "3915"), (stryMutAct_9fa48("3916") ? formData.message.length : (stryCov_9fa48("3916"), formData.message.trim().length)) < 10)) {
          if (stryMutAct_9fa48("3917")) {
            {}
          } else {
            stryCov_9fa48("3917");
            newErrors.message = stryMutAct_9fa48("3918") ? "" : (stryCov_9fa48("3918"), 'Message must be at least 10 characters long');
          }
        }
        setErrors(newErrors);
        return stryMutAct_9fa48("3921") ? Object.keys(newErrors).length !== 0 : stryMutAct_9fa48("3920") ? false : stryMutAct_9fa48("3919") ? true : (stryCov_9fa48("3919", "3920", "3921"), Object.keys(newErrors).length === 0);
      }
    };
    const handleInputChange = (field: keyof FormData, value: string) => {
      if (stryMutAct_9fa48("3922")) {
        {}
      } else {
        stryCov_9fa48("3922");
        setFormData(stryMutAct_9fa48("3923") ? () => undefined : (stryCov_9fa48("3923"), prev => stryMutAct_9fa48("3924") ? {} : (stryCov_9fa48("3924"), {
          ...prev,
          [field]: value
        })));

        // Clear error when user starts typing
        if (stryMutAct_9fa48("3926") ? false : stryMutAct_9fa48("3925") ? true : (stryCov_9fa48("3925", "3926"), errors[field as keyof FormErrors])) {
          if (stryMutAct_9fa48("3927")) {
            {}
          } else {
            stryCov_9fa48("3927");
            setErrors(stryMutAct_9fa48("3928") ? () => undefined : (stryCov_9fa48("3928"), prev => stryMutAct_9fa48("3929") ? {} : (stryCov_9fa48("3929"), {
              ...prev,
              [field]: undefined
            })));
          }
        }
      }
    };
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("3930")) {
        {}
      } else {
        stryCov_9fa48("3930");
        e.preventDefault();
        if (stryMutAct_9fa48("3933") ? false : stryMutAct_9fa48("3932") ? true : stryMutAct_9fa48("3931") ? validateForm() : (stryCov_9fa48("3931", "3932", "3933"), !validateForm())) {
          if (stryMutAct_9fa48("3934")) {
            {}
          } else {
            stryCov_9fa48("3934");
            return;
          }
        }
        setIsSubmitting(stryMutAct_9fa48("3935") ? false : (stryCov_9fa48("3935"), true));
        setSubmitStatus(stryMutAct_9fa48("3936") ? "" : (stryCov_9fa48("3936"), 'idle'));
        try {
          if (stryMutAct_9fa48("3937")) {
            {}
          } else {
            stryCov_9fa48("3937");
            // In a real implementation, this would call the API
            // For now, we'll simulate a successful submission
            await new Promise(stryMutAct_9fa48("3938") ? () => undefined : (stryCov_9fa48("3938"), resolve => setTimeout(resolve, 1500)));
            setSubmitStatus(stryMutAct_9fa48("3939") ? "" : (stryCov_9fa48("3939"), 'success'));
            setFormData(stryMutAct_9fa48("3940") ? {} : (stryCov_9fa48("3940"), {
              name: stryMutAct_9fa48("3941") ? "Stryker was here!" : (stryCov_9fa48("3941"), ''),
              email: stryMutAct_9fa48("3942") ? "Stryker was here!" : (stryCov_9fa48("3942"), ''),
              subject: stryMutAct_9fa48("3943") ? "Stryker was here!" : (stryCov_9fa48("3943"), ''),
              message: stryMutAct_9fa48("3944") ? "Stryker was here!" : (stryCov_9fa48("3944"), ''),
              category: stryMutAct_9fa48("3945") ? "" : (stryCov_9fa48("3945"), 'general')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("3946")) {
            {}
          } else {
            stryCov_9fa48("3946");
            setSubmitStatus(stryMutAct_9fa48("3947") ? "" : (stryCov_9fa48("3947"), 'error'));
          }
        } finally {
          if (stryMutAct_9fa48("3948")) {
            {}
          } else {
            stryCov_9fa48("3948");
            setIsSubmitting(stryMutAct_9fa48("3949") ? true : (stryCov_9fa48("3949"), false));
          }
        }
      }
    };
    return <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Email Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input type="text" id="name" value={formData.name} onChange={stryMutAct_9fa48("3950") ? () => undefined : (stryCov_9fa48("3950"), e => handleInputChange(stryMutAct_9fa48("3951") ? "" : (stryCov_9fa48("3951"), 'name'), e.target.value))} className={stryMutAct_9fa48("3952") ? `` : (stryCov_9fa48("3952"), `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${errors.name ? stryMutAct_9fa48("3953") ? "" : (stryCov_9fa48("3953"), 'border-red-500') : stryMutAct_9fa48("3954") ? "" : (stryCov_9fa48("3954"), 'border-gray-300')}`)} placeholder="Your full name" disabled={isSubmitting} />
          {stryMutAct_9fa48("3957") ? errors.name || <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p> : stryMutAct_9fa48("3956") ? false : stryMutAct_9fa48("3955") ? true : (stryCov_9fa48("3955", "3956", "3957"), errors.name && <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>)}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input type="email" id="email" value={formData.email} onChange={stryMutAct_9fa48("3958") ? () => undefined : (stryCov_9fa48("3958"), e => handleInputChange(stryMutAct_9fa48("3959") ? "" : (stryCov_9fa48("3959"), 'email'), e.target.value))} className={stryMutAct_9fa48("3960") ? `` : (stryCov_9fa48("3960"), `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${errors.email ? stryMutAct_9fa48("3961") ? "" : (stryCov_9fa48("3961"), 'border-red-500') : stryMutAct_9fa48("3962") ? "" : (stryCov_9fa48("3962"), 'border-gray-300')}`)} placeholder="your.email@example.com" disabled={isSubmitting} />
          {stryMutAct_9fa48("3965") ? errors.email || <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p> : stryMutAct_9fa48("3964") ? false : stryMutAct_9fa48("3963") ? true : (stryCov_9fa48("3963", "3964", "3965"), errors.email && <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>)}
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Enquiry Type
        </label>
        <select id="category" value={formData.category} onChange={stryMutAct_9fa48("3966") ? () => undefined : (stryCov_9fa48("3966"), e => handleInputChange(stryMutAct_9fa48("3967") ? "" : (stryCov_9fa48("3967"), 'category'), e.target.value))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" disabled={isSubmitting}>
          {categories.map(stryMutAct_9fa48("3968") ? () => undefined : (stryCov_9fa48("3968"), category => <option key={category.value} value={category.value}>
              {category.label}
            </option>))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject *
        </label>
        <input type="text" id="subject" value={formData.subject} onChange={stryMutAct_9fa48("3969") ? () => undefined : (stryCov_9fa48("3969"), e => handleInputChange(stryMutAct_9fa48("3970") ? "" : (stryCov_9fa48("3970"), 'subject'), e.target.value))} className={stryMutAct_9fa48("3971") ? `` : (stryCov_9fa48("3971"), `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${errors.subject ? stryMutAct_9fa48("3972") ? "" : (stryCov_9fa48("3972"), 'border-red-500') : stryMutAct_9fa48("3973") ? "" : (stryCov_9fa48("3973"), 'border-gray-300')}`)} placeholder="Brief description of your enquiry" disabled={isSubmitting} />
        {stryMutAct_9fa48("3976") ? errors.subject || <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.subject}
          </p> : stryMutAct_9fa48("3975") ? false : stryMutAct_9fa48("3974") ? true : (stryCov_9fa48("3974", "3975", "3976"), errors.subject && <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.subject}
          </p>)}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea id="message" rows={6} value={formData.message} onChange={stryMutAct_9fa48("3977") ? () => undefined : (stryCov_9fa48("3977"), e => handleInputChange(stryMutAct_9fa48("3978") ? "" : (stryCov_9fa48("3978"), 'message'), e.target.value))} className={stryMutAct_9fa48("3979") ? `` : (stryCov_9fa48("3979"), `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-vertical ${errors.message ? stryMutAct_9fa48("3980") ? "" : (stryCov_9fa48("3980"), 'border-red-500') : stryMutAct_9fa48("3981") ? "" : (stryCov_9fa48("3981"), 'border-gray-300')}`)} placeholder="Tell us more about your enquiry, feedback, or how we can help you..." disabled={isSubmitting} />
        <div className="flex justify-between items-center mt-1">
          {stryMutAct_9fa48("3984") ? errors.message || <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.message}
            </p> : stryMutAct_9fa48("3983") ? false : stryMutAct_9fa48("3982") ? true : (stryCov_9fa48("3982", "3983", "3984"), errors.message && <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.message}
            </p>)}
          <p className="text-sm text-gray-500 ml-auto">
            {formData.message.length}/500 characters
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button type="submit" disabled={isSubmitting} className={stryMutAct_9fa48("3985") ? `` : (stryCov_9fa48("3985"), `w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all ${isSubmitting ? stryMutAct_9fa48("3986") ? "" : (stryCov_9fa48("3986"), 'bg-gray-300 text-gray-500 cursor-not-allowed') : stryMutAct_9fa48("3987") ? "" : (stryCov_9fa48("3987"), 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2')}`)}>
          {isSubmitting ? <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Sending Message...
            </> : <>
              <Send className="w-5 h-5" />
              Send Message
            </>}
        </button>
      </div>

      {/* Success/Error Messages */}
      {stryMutAct_9fa48("3990") ? submitStatus === 'success' || <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Message sent successfully!</p>
              <p className="text-sm">We'll get back to you within 24 hours.</p>
            </div>
          </div>
        </div> : stryMutAct_9fa48("3989") ? false : stryMutAct_9fa48("3988") ? true : (stryCov_9fa48("3988", "3989", "3990"), (stryMutAct_9fa48("3992") ? submitStatus !== 'success' : stryMutAct_9fa48("3991") ? true : (stryCov_9fa48("3991", "3992"), submitStatus === (stryMutAct_9fa48("3993") ? "" : (stryCov_9fa48("3993"), 'success')))) && <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Message sent successfully!</p>
              <p className="text-sm">We'll get back to you within 24 hours.</p>
            </div>
          </div>
        </div>)}

      {stryMutAct_9fa48("3996") ? submitStatus === 'error' || <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Failed to send message</p>
              <p className="text-sm">Please try again or contact us directly at hello@aclue.app</p>
            </div>
          </div>
        </div> : stryMutAct_9fa48("3995") ? false : stryMutAct_9fa48("3994") ? true : (stryCov_9fa48("3994", "3995", "3996"), (stryMutAct_9fa48("3998") ? submitStatus !== 'error' : stryMutAct_9fa48("3997") ? true : (stryCov_9fa48("3997", "3998"), submitStatus === (stryMutAct_9fa48("3999") ? "" : (stryCov_9fa48("3999"), 'error')))) && <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Failed to send message</p>
              <p className="text-sm">Please try again or contact us directly at hello@aclue.app</p>
            </div>
          </div>
        </div>)}

      {/* Form Footer */}
      <p className="text-sm text-gray-600 text-center">
        We typically respond within 24 hours. For urgent matters, please email us directly at{stryMutAct_9fa48("4000") ? "" : (stryCov_9fa48("4000"), ' ')}
        <a href="mailto:hello@aclue.app" className="text-primary-600 hover:text-primary-700">
          hello@aclue.app
        </a>
      </p>
    </form>;
  }
}