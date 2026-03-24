'use client';

import { useEffect } from 'react';
import { useBookingStore } from '@/stores/booking-store';
import { DateRangePicker } from '@/components/booking/DateRangePicker';
import { GuestRoomCounter } from '@/components/booking/GuestRoomCounter';
import { BookingPreviewSidebar } from '@/components/booking/BookingPreviewSidebar';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { formatNgn } from '@/utils/format';
import { useRouter } from 'next/navigation';

export default function BookStep1Page() {
  const store = useBookingStore();
  const router = useRouter();
  const nights = store.getNights();

  // The booking wizard requires a room to be selected first. If the user
  // lands here without one (direct navigation, expired session, etc.)
  // send them to the rooms page to start properly.
  useEffect(() => {
    if (!store.selectedRoom) {
      router.replace('/rooms');
    }
  }, [store.selectedRoom, router]);

  function handleDateChange(checkIn: string | null, checkOut: string | null) {
    store.setDates(checkIn ?? '', checkOut ?? '');
  }

  function handleContinue() {
    if (store.checkIn && store.checkOut && nights > 0) {
      router.push('/book/summary');
    }
  }

  // Render nothing while the redirect is in progress
  if (!store.selectedRoom) return null;

  return (
    <div className="page-container py-10">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0D0F2B]">{BOOKING_MESSAGES.step1Title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: date picker + guest counter */}
        <div className="flex-1 flex flex-col gap-5">
          <DateRangePicker
            checkIn={store.checkIn}
            checkOut={store.checkOut}
            onChange={handleDateChange}
          />
          <GuestRoomCounter
            adults={store.adults}
            childCount={store.children}
            rooms={store.rooms}
            onAdultsChange={(v) => store.setGuests(v, store.children, store.rooms)}
            onChildrenChange={(v) => store.setGuests(store.adults, v, store.rooms)}
            onRoomsChange={(v) => store.setGuests(store.adults, store.children, v)}
            showRooms={false}
          />
        </div>

        {/* Right: booking preview sidebar — desktop only */}
        <div className="hidden lg:block w-[320px] xl:w-[360px] shrink-0">
          <BookingPreviewSidebar />
        </div>
      </div>

      {/* Mobile CTA bar */}
      <div className="lg:hidden mt-6 bg-white rounded-lg border border-[#E2E8F0] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">TOTAL STAY</p>
            <p className="text-[17px] font-bold text-[#0D0F2B]">{nights > 0 ? `${nights} Night${nights !== 1 ? 's' : ''}` : '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">{BOOKING_MESSAGES.startingFrom}</p>
            <p className="text-[17px] font-bold text-[#020887]">
              {formatNgn(store.selectedRoom.price)}
              <span className="text-[13px] font-normal text-[#64748B]">/night</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleContinue}
          disabled={!(store.checkIn && store.checkOut && nights > 0)}
          className="btn-primary"
        >
          {BOOKING_MESSAGES.proceedToSummary}
        </button>
      </div>
    </div>
  );
}
