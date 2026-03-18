'use client';

import { useBookingStore } from '@/stores/booking-store';
import { DateRangePicker } from '@/components/booking/DateRangePicker';
import { GuestRoomCounter } from '@/components/booking/GuestRoomCounter';
import { BookingPreviewSidebar } from '@/components/booking/BookingPreviewSidebar';
import { BookingStepHeader } from '@/components/booking/BookingStepHeader';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { useRouter } from 'next/navigation';

export default function BookStep1Page() {
  const store = useBookingStore();
  const router = useRouter();
  const nights = store.getNights();

  function handleDateChange(checkIn: string | null, checkOut: string | null) {
    store.setDates(checkIn ?? '', checkOut ?? '');
  }

  function handleContinue() {
    if (store.checkIn && store.checkOut && nights > 0) {
      router.push('/book/rooms');
    }
  }

  return (
    <div className="page-container py-10">
      {/* Step Header */}
      <BookingStepHeader
        eyebrow={BOOKING_MESSAGES.step1Label}
        title={BOOKING_MESSAGES.step1Title}
        rightLabel={BOOKING_MESSAGES.datesAndGuests}
        rightValue="33%"
        percent={33}
      />

      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        {/* Left: main content */}
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
            showRooms={true}
          />
        </div>

        {/* Right: sidebar — hidden on mobile (shown at bottom instead) */}
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
            {store.selectedRoom ? (
              <p className="text-[17px] font-bold text-[#020887]">₦{store.selectedRoom.pricePerNight.toLocaleString('en-NG')}<span className="text-[13px] font-normal text-[#64748B]">/night</span></p>
            ) : (
              <p className="text-[14px] text-[#64748B]">Select a room</p>
            )}
          </div>
        </div>
        <button
          onClick={handleContinue}
          disabled={!(store.checkIn && store.checkOut && nights > 0)}
          className="btn-primary"
        >
          {BOOKING_MESSAGES.proceedToRooms}
        </button>
      </div>
    </div>
  );
}
