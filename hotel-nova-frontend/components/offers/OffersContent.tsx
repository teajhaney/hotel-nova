'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { FeaturedOfferCard } from './FeaturedOfferCard';
import { OfferCard } from './OfferCard';
import { LoyaltyBanner } from './LoyaltyBanner';
import { OFFERS } from '@/constants/dummyData';
import { OFFERS_PAGE_MESSAGES } from '@/constants/messages';
import type { OfferCategory } from '@/type/type';

const TABS: { id: OfferCategory; label: string }[] = [
  { id: 'all', label: OFFERS_PAGE_MESSAGES.tabAll },
  { id: 'seasonal', label: OFFERS_PAGE_MESSAGES.tabSeasonal },
  { id: 'business', label: OFFERS_PAGE_MESSAGES.tabBusiness },
  { id: 'romantic', label: OFFERS_PAGE_MESSAGES.tabRomantic },
  { id: 'lastMinute', label: OFFERS_PAGE_MESSAGES.tabLastMinute },
];

export function OffersContent() {
  const [activeTab, setActiveTab] = useState<OfferCategory>('all');

  const filteredOffers = useMemo(() => {
    if (activeTab === 'all') return OFFERS;
    return OFFERS.filter((offer) => offer.category.includes(activeTab));
  }, [activeTab]);

  const featuredOffer = filteredOffers.find((offer) => offer.isFeatured);
  const standardOffers = filteredOffers.filter((offer) => !offer.isFeatured);

  return (
    <div className="page-container py-10 md:py-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-[32px] md:text-[40px] lg:text-[44px] font-bold text-[#0D0F2B] leading-tight mb-3">
            {OFFERS_PAGE_MESSAGES.heading}
          </h1>
          <p className="text-[16px] md:text-[17px] text-[#64748B] leading-relaxed max-w-2xl">
            {OFFERS_PAGE_MESSAGES.subtitle}
          </p>
        </div>

        {/* Filter Button — Mobile */}
        <button
          type="button"
          className="md:hidden shrink-0 inline-flex items-center gap-2 px-4 py-2.5
                     bg-[#020887] text-white font-semibold text-[14px]
                     rounded-lg hover:bg-[#030A6F] transition-colors"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          {OFFERS_PAGE_MESSAGES.filterButton}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-[#E2E8F0] overflow-x-auto">
        <div className="flex gap-6 md:gap-8 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-[15px] font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#020887] text-[#020887]'
                  : 'border-transparent text-[#64748B] hover:text-[#0D0F2B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Offer */}
      {featuredOffer && (
        <div className="mb-10">
          <FeaturedOfferCard {...featuredOffer} />
        </div>
      )}

      {/* Standard Offers Grid */}
      {standardOffers.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {standardOffers.map((offer) => (
            <OfferCard key={offer.id} {...offer} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[18px] font-medium text-[#64748B]">
            No offers available in this category. Check back soon!
          </p>
        </div>
      )}

      {/* Loyalty Banner */}
      <LoyaltyBanner />
    </div>
  );
}
