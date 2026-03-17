'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { MobileBottomNav } from '@/components/home/MobileBottomNav';
import { CONTACT_PAGE_MESSAGES, VALIDATION_MESSAGES } from '@/constants/messages';
import { CONTACT_IMAGES } from '@/constants/images';

const contactSchema = z.object({
  fullName: z.string().min(2, VALIDATION_MESSAGES.name.minLength),
  email: z.string().email(VALIDATION_MESSAGES.email.invalid),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
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
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative h-[320px] md:h-[380px] flex items-center justify-center overflow-hidden">
          <Image
            src={CONTACT_IMAGES.hero}
            alt="Contact The Grand Oasis Abuja"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020887]/70 via-[#020887]/60 to-[#020887]/70" />

          <div className="relative z-10 page-container text-center text-white">
            <h1 className="text-[42px] md:text-[56px] lg:text-[64px] font-bold leading-tight mb-4">
              {CONTACT_PAGE_MESSAGES.heroTitle}
            </h1>
            <p className="text-[16px] md:text-[18px] leading-relaxed text-white/90 max-w-2xl mx-auto">
              {CONTACT_PAGE_MESSAGES.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Form and Contact Info Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="page-container">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
              {/* Left: Contact Form */}
              <div>
                <h2 className="text-[32px] md:text-[36px] font-bold text-[#0D0F2B] mb-8">
                  {CONTACT_PAGE_MESSAGES.formHeading}
                </h2>

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
              </div>

              {/* Right: Contact Info Cards */}
              <div className="space-y-6">
                {/* Location */}
                <div className="bg-[#F8FAFC] rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] flex items-center justify-center mb-4">
                    <MapPin size={24} className="text-[#020887]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#0D0F2B] mb-2">
                    {CONTACT_PAGE_MESSAGES.infoLocationTitle}
                  </h3>
                  <p className="text-[15px] text-[#64748B]">
                    {CONTACT_PAGE_MESSAGES.infoLocationAddress}
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-[#F8FAFC] rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] flex items-center justify-center mb-4">
                    <Phone size={24} className="text-[#020887]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#0D0F2B] mb-2">
                    {CONTACT_PAGE_MESSAGES.infoPhoneTitle}
                  </h3>
                  <p className="text-[15px] text-[#64748B] mb-1">
                    {CONTACT_PAGE_MESSAGES.infoPhone1}
                  </p>
                  <p className="text-[15px] text-[#64748B]">
                    {CONTACT_PAGE_MESSAGES.infoPhone2}
                  </p>
                </div>

                {/* Email */}
                <div className="bg-[#F8FAFC] rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] flex items-center justify-center mb-4">
                    <Mail size={24} className="text-[#020887]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#0D0F2B] mb-2">
                    {CONTACT_PAGE_MESSAGES.infoEmailTitle}
                  </h3>
                  <p className="text-[15px] text-[#64748B] mb-1">
                    {CONTACT_PAGE_MESSAGES.infoEmail1}
                  </p>
                  <p className="text-[15px] text-[#64748B]">
                    {CONTACT_PAGE_MESSAGES.infoEmail2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="relative h-[400px] bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE]">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <MapPin size={56} className="text-[#020887] mb-4" />
            <p className="text-[18px] font-bold text-[#0D0F2B] mb-2">
              {CONTACT_PAGE_MESSAGES.mapTitle}
            </p>
            <button className="px-6 py-2.5 bg-[#020887] text-white font-semibold text-[14px] rounded-lg hover:bg-[#030A6F] transition-colors">
              {CONTACT_PAGE_MESSAGES.mapCta}
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
