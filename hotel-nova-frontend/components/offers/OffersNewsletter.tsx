'use client';

import { useState } from 'react';
import { OFFERS_PAGE_MESSAGES } from '@/constants/messages';

export function OffersNewsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <section className="bg-white py-16" aria-labelledby="offers-newsletter-heading">
      <div className="page-container">
        <div className="max-w-xl mx-auto text-center">
          <h2
            id="offers-newsletter-heading"
            className="text-[28px] md:text-[32px] font-bold text-[#0D0F2B] leading-tight mb-3"
          >
            {OFFERS_PAGE_MESSAGES.newsletterHeading}
          </h2>

          <p className="text-[15px] text-[#64748B] leading-relaxed mb-8">
            {OFFERS_PAGE_MESSAGES.newsletterSubtitle}
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            aria-label="Newsletter subscription"
          >
            <label htmlFor="offers-newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="offers-newsletter-email"
              type="email"
              placeholder={OFFERS_PAGE_MESSAGES.newsletterPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 px-4 py-2 rounded-lg border border-[#E2E8F0]
                         text-[15px] text-[#0D0F2B] placeholder:text-[#94A3B8]
                         focus:outline-none focus:ring-2 focus:ring-[#020887] focus:border-transparent
                         transition-all"
            />
            <button
              type="submit"
              className="h-12 px-8 bg-[#020887] text-white font-semibold text-[15px]
                         rounded-lg hover:bg-[#030A6F] transition-colors whitespace-nowrap"
            >
              {OFFERS_PAGE_MESSAGES.newsletterButton}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
