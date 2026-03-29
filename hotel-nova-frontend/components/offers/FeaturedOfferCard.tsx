'use client';

import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { Info, Heart } from 'lucide-react';
import type { Offer } from '@/type/type';
import { OFFERS_PAGE_MESSAGES } from '@/constants/messages';

type FeaturedOfferCardProps = Offer;

export function FeaturedOfferCard({
  image,
  title,
  description,
  discountText,
  originalPrice,
  price,
  priceLabel,
  terms,
  disclaimer,
}: FeaturedOfferCardProps) {
  return (
    <div className="grid md:grid-cols-[1fr_1.2fr] gap-0 bg-white rounded-xl overflow-hidden shadow-sm border border-[#E2E8F0]">
      {/* Image */}
      <div className="relative h-[280px] md:h-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col">
        {/* Badge */}
        {discountText && (
          <div className="mb-3">
            <span className="inline-block text-[12px] font-bold text-[#020887] tracking-wide uppercase">
              {discountText}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-[24px] md:text-[28px] font-bold text-[#0D0F2B] leading-tight mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[15px] text-[#475569] leading-relaxed mb-6">
          {description}
        </p>

        {/* Terms */}
        {terms.length > 0 && (
          <div className="mb-6 pb-6 border-b border-[#E2E8F0]">
            <div className="flex items-start gap-2 text-[13px] text-[#64748B]">
              <Info size={16} className="mt-0.5 shrink-0 text-[#020887]" aria-hidden="true" />
              <div>
                <span className="font-medium text-[#0D0F2B]">{OFFERS_PAGE_MESSAGES.termsLabel}</span>{' '}
                {terms.map((term, i) => (
                  <span key={i}>
                    {term}
                    {i < terms.length - 1 && ' • '}
                  </span>
                ))}
              </div>
            </div>
            {disclaimer && (
              <p className="mt-2 text-[13px] text-[#64748B] pl-6">
                {disclaimer}
              </p>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-2">
            {originalPrice && (
              <span className="text-[14px] text-[#94A3B8] line-through">
                From ₦{originalPrice.toLocaleString()}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-[26px] sm:text-[32px] md:text-[36px] font-bold text-[#020887]">
                ₦{price.toLocaleString()}
              </span>
              <span className="text-[15px] text-[#64748B]">{priceLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 sm:px-6 py-3 sm:py-3.5 bg-[#020887] text-white font-semibold text-[14px] sm:text-[15px]
                         rounded-lg hover:bg-[#030A6F] transition-colors whitespace-nowrap"
            >
              {OFFERS_PAGE_MESSAGES.claimOffer}
            </button>
            <button
              type="button"
              className="p-3 border border-[#E2E8F0] rounded-lg hover:border-[#020887]
                         transition-colors group"
              aria-label="Add to favorites"
            >
              <Heart size={20} className="text-[#64748B] group-hover:text-[#020887]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
