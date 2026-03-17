'use client';

import { useState } from 'react';
import { ArrowRight, CircleCheck } from 'lucide-react';
import { NEWSLETTER_MESSAGES } from '@/constants/messages';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section
      className="bg-[#020887] py-[80px] md:py-[64px] sm:py-[48px]"
      aria-labelledby="newsletter-heading"
    >
      <div className="page-container">
        <div className="max-w-[600px] mx-auto text-center">
          <h2
            id="newsletter-heading"
            className="text-[32px] md:text-[28px] sm:text-[26px]
                       font-bold text-white leading-tight mb-[12px]"
          >
            {NEWSLETTER_MESSAGES.heading}
          </h2>

          <p className="text-[16px] text-white/65 leading-relaxed mb-[36px] sm:mb-[28px]">
            {NEWSLETTER_MESSAGES.subtitle}
          </p>

          {submitted ? (
            <div
              className="flex items-center justify-center gap-[10px]
                         p-[20px] bg-white/15 rounded-[8px]
                         text-white font-medium text-[16px]"
              role="alert"
              aria-live="polite"
            >
              <CircleCheck size={20} aria-hidden="true" />
              {NEWSLETTER_MESSAGES.successMessage}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex sm:flex-col gap-[8px]"
              aria-label="Newsletter subscription"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder={NEWSLETTER_MESSAGES.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-[48px] px-5 py-2 rounded-[4px]
                           bg-white/12 border border-white/25
                           text-[16px] text-white placeholder:text-white/45
                           focus:outline-none focus:border-white/60 focus:bg-white/18
                           transition-all duration-150"
              />
              <button
                type="submit"
                className="h-[48px] px-[28px] rounded-[4px]
                           bg-white text-[#020887]
                           text-[15px] font-semibold uppercase tracking-[0.07em]
                           hover:bg-white/90 active:scale-[0.99]
                           transition-all duration-150
                           flex items-center justify-center gap-[8px]
                           sm:w-full whitespace-nowrap cursor-pointer"
              >
                {NEWSLETTER_MESSAGES.submitButton} <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
          )}

          <p className="mt-[16px] text-[13px] text-white/40">
            {NEWSLETTER_MESSAGES.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
