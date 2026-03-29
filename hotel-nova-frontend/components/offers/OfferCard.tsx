'use client';

import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import type { Offer } from '@/type/type';
import { OFFERS_PAGE_MESSAGES } from '@/constants/messages';

type OfferCardProps = Offer;

export function OfferCard({
  image,
  title,
  description,
  badge,
  discountText,
  price,
  priceLabel,
  disclaimer,
}: OfferCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E2E8F0] flex flex-col">
      {/* Image with Badge */}
      <div className="relative h-[240px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {badge && (
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1.5 bg-[#020887] text-white text-[11px] font-bold uppercase tracking-wide rounded">
              {badge}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title & Discount */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-[20px] font-bold text-[#0D0F2B] leading-tight">
            {title}
          </h3>
          {discountText && (
            <span className="shrink-0 text-[14px] font-bold text-[#020887]">
              {discountText}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[14px] text-[#475569] leading-relaxed mb-4 flex-1">
          {description}
        </p>

        {/* Disclaimer */}
        {disclaimer && (
          <p className="text-[12px] text-[#94A3B8] mb-4 italic">
            * {disclaimer}
          </p>
        )}

        {/* Price & CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
          {price > 0 ? (
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] sm:text-[24px] font-bold text-[#020887]">
                ₦{price.toLocaleString()}
              </span>
              {priceLabel && (
                <span className="text-[13px] text-[#64748B]">{priceLabel}</span>
              )}
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 sm:px-5 py-2.5 bg-[#020887] text-white font-semibold text-[13px] sm:text-[14px]
                         rounded-lg hover:bg-[#030A6F] transition-colors whitespace-nowrap"
            >
              {OFFERS_PAGE_MESSAGES.bookNow}
            </button>
            <button
              type="button"
              className="px-3 sm:px-4 py-2.5 border border-[#E2E8F0] text-[#0D0F2B] font-medium text-[13px] sm:text-[14px]
                         rounded-lg hover:border-[#020887] hover:text-[#020887] transition-colors whitespace-nowrap"
            >
              {OFFERS_PAGE_MESSAGES.details}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
