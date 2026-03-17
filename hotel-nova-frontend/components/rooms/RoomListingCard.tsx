import Image from 'next/image';
import Link from 'next/link';
import { Star, BedDouble, Users, Maximize2 } from 'lucide-react';
import { ROOMS_PAGE_MESSAGES } from '@/constants/messages';
import type { RoomListing } from '@/type/type';

type RoomListingCardProps = RoomListing;

export function RoomListingCard({
  id,
  image,
  name,
  price,
  rating,
  reviewCount,
  badge,
  beds,
  guests,
  sqft,
  amenities,
}: RoomListingCardProps) {
  return (
    <article className="hotel-card group flex flex-col">
      {/* Image with optional badge */}
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={image}
          fill
          alt={`${name} — room interior`}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1
                        rounded-sm text-[11px] font-semibold uppercase tracking-[0.06em]
                        ${badge === 'recommended'
                          ? 'bg-[#020887] text-white'
                          : 'bg-[#F97316] text-white'
                        }`}
          >
            {badge === 'recommended'
              ? ROOMS_PAGE_MESSAGES.badgeRecommended
              : ROOMS_PAGE_MESSAGES.badgePopular}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Name + price row */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-[16px] font-bold text-[#0D0F2B] leading-snug">
            {name}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-[22px] font-bold text-[#0D0F2B]">₦{price.toLocaleString()}</span>
            <span className="block text-[12px] text-[#64748B]">
              {ROOMS_PAGE_MESSAGES.lastNight}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3.5">
          <Star size={13} className="text-[#F97316] fill-[#F97316]" aria-hidden="true" />
          <span className="text-[13px] font-medium text-[#0D0F2B]">{rating}</span>
          <span className="text-[13px] text-[#64748B]">
            ({reviewCount} {ROOMS_PAGE_MESSAGES.reviewSuffix})
          </span>
        </div>

        {/* Features row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            <BedDouble size={14} className="text-[#7CA5B8]" aria-hidden="true" />
            <span className="text-[12px] text-[#64748B]">{beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} className="text-[#7CA5B8]" aria-hidden="true" />
            <span className="text-[12px] text-[#64748B]">{guests} Guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 size={14} className="text-[#7CA5B8]" aria-hidden="true" />
            <span className="text-[12px] text-[#64748B]">{sqft} Sq Ft</span>
          </div>
          {amenities.map((a) => (
            <span
              key={a}
              className="text-[12px] text-[#020887] font-medium
                         bg-[#020887]/8 px-2 py-0.5 rounded-sm"
            >
              {a}
            </span>
          ))}
        </div>

        {/* Book Now button */}
        <Link
          href={`/rooms/${id}`}
          className="btn-outline-primary w-full text-[14px] mt-auto"
        >
          {ROOMS_PAGE_MESSAGES.bookNow}
        </Link>
      </div>
    </article>
  );
}
