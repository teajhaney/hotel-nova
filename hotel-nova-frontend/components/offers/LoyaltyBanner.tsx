import { OFFERS_PAGE_MESSAGES } from '@/constants/messages';

export function LoyaltyBanner() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#4338CA] via-[#5B21B6] to-[#6B21A8] p-8 md:p-10">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-[28px] md:text-[32px] font-bold text-white mb-3">
            {OFFERS_PAGE_MESSAGES.loyaltyHeading}
          </h2>
          <p className="text-[15px] md:text-[16px] text-white/90 leading-relaxed max-w-2xl">
            {OFFERS_PAGE_MESSAGES.loyaltySubtitle}
          </p>
        </div>

        {/* CTA */}
        <div className="shrink-0">
          <button
            type="button"
            className="px-8 py-3.5 bg-white text-[#4338CA] font-bold text-[15px]
                       rounded-lg hover:bg-white/95 transition-all shadow-lg"
          >
            {OFFERS_PAGE_MESSAGES.loyaltyButton}
          </button>
        </div>
      </div>
    </div>
  );
}
