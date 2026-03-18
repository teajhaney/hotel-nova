'use client';

import { Calendar, Users, BedDouble, Phone } from 'lucide-react';
import { useBookingStore } from '@/stores/booking-store';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { formatBookingDate, formatNgn, formatGuestSummary, formatDateRange } from '@/utils/format';
import { useRouter } from 'next/navigation';

export function RoomSelectionSidebar() {
  const store = useBookingStore();
  const router = useRouter();
  const nights = store.getNights();
  const taxes = store.getServiceCharge() + store.getVat();
  const total = store.getTotal();

  const canConfirm = !!store.selectedRoom;

  const guestSummary = formatGuestSummary(store.adults, store.children);
  const dateRange = formatDateRange(store.checkIn, store.checkOut);
  const nightsLabel = nights > 0 ? `${nights} Night${nights !== 1 ? 's' : ''}` : '';

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-0.5">
            <BedDouble size={16} className="text-[#020887]" />
            <p className="text-[15px] font-bold text-[#0D0F2B]">Booking Summary</p>
          </div>
          <p className="text-[12px] text-[#64748B]">Review your selection</p>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Stay Dates */}
          <div className="flex gap-3">
            <Calendar size={16} className="text-[#020887] shrink-0 mt-0.5" />
            <div>
              <p className="booking-sidebar-label">{BOOKING_MESSAGES.stayDates}</p>
              <p className="text-[14px] font-semibold text-[#0D0F2B]">{dateRange}</p>
              {nightsLabel && <p className="text-[12px] text-[#64748B]">{nightsLabel}</p>}
            </div>
          </div>
          {/* Guests */}
          <div className="flex gap-3">
            <Users size={16} className="text-[#020887] shrink-0 mt-0.5" />
            <div>
              <p className="booking-sidebar-label">{BOOKING_MESSAGES.guestCount}</p>
              <p className="text-[14px] font-semibold text-[#0D0F2B]">{guestSummary}</p>
            </div>
          </div>
          {/* Room */}
          <div className="flex gap-3">
            <BedDouble size={16} className="text-[#020887] shrink-0 mt-0.5" />
            <div>
              <p className="booking-sidebar-label">{BOOKING_MESSAGES.roomSelection}</p>
              <p className={`text-[14px] font-semibold ${store.selectedRoom ? 'text-[#0D0F2B]' : 'text-[#94A3B8] italic'}`}>
                {store.selectedRoom?.name ?? BOOKING_MESSAGES.noRoomSelected}
              </p>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-3 flex flex-col gap-2">
            <div className="flex justify-between text-[13px] text-[#64748B]">
              <span>{BOOKING_MESSAGES.taxesAndFees}</span>
              <span>{taxes > 0 ? formatNgn(taxes) : '₦0'}</span>
            </div>
            <div className="flex justify-between text-[15px] font-bold text-[#0D0F2B]">
              <span>Total Estimate</span>
              <span className={total > 0 ? 'text-[#020887]' : ''}>{total > 0 ? formatNgn(total) : '₦0'}</span>
            </div>
          </div>

          <button
            onClick={() => canConfirm && router.push('/book/summary')}
            disabled={!canConfirm}
            className={`w-full h-11 rounded-sm text-[14px] font-semibold transition-all duration-150 ${
              canConfirm
                ? 'bg-[#020887] text-white hover:bg-[#38369A]'
                : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            {BOOKING_MESSAGES.confirmSelection}
          </button>
          <p className="text-[11px] text-[#94A3B8] text-center">
            Price includes VAT and service charge. Local tourism fees may apply upon check-in.
          </p>
        </div>
      </div>

      {/* Need assistance card */}
      <div className="bg-[#020887] rounded-lg p-5 text-white">
        <p className="text-[15px] font-bold mb-1">{BOOKING_MESSAGES.needAssistance}</p>
        <p className="text-[13px] text-white/80 leading-relaxed mb-3">{BOOKING_MESSAGES.concierge247}</p>
        <a href="tel:+2348004726624" className="flex items-center gap-2 text-[13px] font-semibold text-white/90 hover:text-white transition-colors">
          <Phone size={14} />
          {BOOKING_MESSAGES.conciergePhone}
        </a>
      </div>
    </div>
  );
}
