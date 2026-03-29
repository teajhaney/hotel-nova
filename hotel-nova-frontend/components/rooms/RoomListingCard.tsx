'use client';

import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { BedDouble, Users, Maximize2 } from 'lucide-react';
import { ROOMS_PAGE_MESSAGES } from '@/constants/messages';
import { formatNgn } from '@/utils/format';
import { useBookingStore } from '@/stores/booking-store';
import { useRouter } from 'next/navigation';
import type { Room } from '@/type/api';

export function RoomListingCard({
  id,
  name,
  price,
  type,
  imageUrl,
  description,
  beds,
  maxGuests,
  sqm,
  amenities,
}: Room) {
  const store = useBookingStore();
  const router = useRouter();

  // When the user clicks "Book Now" from the rooms listing, they've already
  // chosen their room. We pre-select it in the store and set the fromRoom flag
  // so the booking wizard skips the "available rooms" step and jumps straight
  // to summary after they pick their dates.
  function handleBookNow() {
    store.selectRoom({ id, name, type, price, imageUrl, description, beds, maxGuests, sqm, amenities });
    router.push('/book');
  }

  return (
    <article className="hotel-card group flex flex-col">
      {/* Room image */}
      <div className="relative aspect-16/10 overflow-hidden bg-[#F1F5F9]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            fill
            alt={`${name} — room interior`}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BedDouble size={40} className="text-[#CBD5E1]" />
          </div>
        )}

        {/* Room type badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-sm
                         text-[11px] font-semibold uppercase tracking-[0.06em]
                         bg-[#020887] text-white"
        >
          {type}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Name + price row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-[16px] font-bold text-[#0D0F2B] leading-snug">
            {name}
          </h3>
          <div className="text-right shrink-0">
            <span className="text-[22px] font-bold text-[#0D0F2B]">
              {formatNgn(price)}
            </span>
            <span className="block text-[12px] text-[#64748B]">
              {ROOMS_PAGE_MESSAGES.lastNight}
            </span>
          </div>
        </div>

        {/* Features row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {beds && (
            <div className="flex items-center gap-1">
              <BedDouble size={14} className="text-[#7CA5B8]" aria-hidden="true" />
              <span className="text-[12px] text-[#64748B]">{beds}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users size={14} className="text-[#7CA5B8]" aria-hidden="true" />
            <span className="text-[12px] text-[#64748B]">{maxGuests} Guests</span>
          </div>
          {sqm && (
            <div className="flex items-center gap-1">
              <Maximize2 size={14} className="text-[#7CA5B8]" aria-hidden="true" />
              <span className="text-[12px] text-[#64748B]">{sqm} sqm</span>
            </div>
          )}
        </div>

        {/* Amenities row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {amenities.slice(0, 3).map(a => (
            <span
              key={a}
              className="text-[12px] text-[#020887] font-medium
                         bg-[#020887]/8 px-2 py-0.5 rounded-sm"
            >
              {a}
            </span>
          ))}
        </div>

        {/* Book button */}
        <button
          onClick={handleBookNow}
          className="btn-outline-primary w-full text-[14px] mt-auto"
        >
          {ROOMS_PAGE_MESSAGES.bookNow}
        </button>
      </div>
    </article>
  );
}
