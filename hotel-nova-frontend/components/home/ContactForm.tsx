'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CONTACT_PAGE_MESSAGES, VALIDATION_MESSAGES } from '@/constants/messages';

const contactSchema = z.object({
  fullName: z.string().min(2, VALIDATION_MESSAGES.name.minLength),
  email: z.string().email(VALIDATION_MESSAGES.email.invalid),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form submitted:', data);
    setIsSubmitting(false);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name and Email */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="fullName"
            className="block text-[15px] font-medium text-[#0D0F2B] mb-2"
          >
            {CONTACT_PAGE_MESSAGES.formNameLabel}
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            placeholder={CONTACT_PAGE_MESSAGES.formNamePlaceholder}
            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg text-[15px]
                       text-[#0D0F2B] placeholder:text-[#94A3B8]
                       focus:outline-none focus:ring-2 focus:ring-[#020887] focus:border-transparent
                       transition-all"
          />
          {errors.fullName && (
            <p className="text-[13px] text-red-600 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-[15px] font-medium text-[#0D0F2B] mb-2"
          >
            {CONTACT_PAGE_MESSAGES.formEmailLabel}
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder={CONTACT_PAGE_MESSAGES.formEmailPlaceholder}
            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg text-[15px]
                       text-[#0D0F2B] placeholder:text-[#94A3B8]
                       focus:outline-none focus:ring-2 focus:ring-[#020887] focus:border-transparent
                       transition-all"
          />
          {errors.email && (
            <p className="text-[13px] text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-[15px] font-medium text-[#0D0F2B] mb-2"
        >
          {CONTACT_PAGE_MESSAGES.formSubjectLabel}
        </label>
        <input
          id="subject"
          type="text"
          {...register('subject')}
          placeholder={CONTACT_PAGE_MESSAGES.formSubjectPlaceholder}
          className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg text-[15px]
                     text-[#0D0F2B] placeholder:text-[#94A3B8]
                     focus:outline-none focus:ring-2 focus:ring-[#020887] focus:border-transparent
                     transition-all"
        />
        {errors.subject && (
          <p className="text-[13px] text-red-600 mt-1">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-[15px] font-medium text-[#0D0F2B] mb-2"
        >
          {CONTACT_PAGE_MESSAGES.formMessageLabel}
        </label>
        <textarea
          id="message"
          rows={6}
          {...register('message')}
          placeholder={CONTACT_PAGE_MESSAGES.formMessagePlaceholder}
          className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg text-[15px]
                     text-[#0D0F2B] placeholder:text-[#94A3B8] resize-none
                     focus:outline-none focus:ring-2 focus:ring-[#020887] focus:border-transparent
                     transition-all"
        />
        {errors.message && (
          <p className="text-[13px] text-red-600 mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-[#020887] text-white font-semibold text-[15px]
                   rounded-lg hover:bg-[#030A6F] transition-colors disabled:opacity-50
                   disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? CONTACT_PAGE_MESSAGES.formSubmittingButton
          : CONTACT_PAGE_MESSAGES.formSubmitButton}
      </button>
    </form>
  );
}
