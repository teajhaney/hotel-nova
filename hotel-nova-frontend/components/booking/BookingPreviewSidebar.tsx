'use client';

import { Calendar, Users, BedDouble, Phone } from 'lucide-react';
import { useBookingStore } from '@/stores/booking-store';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { formatBookingDate, formatNgn, formatGuestSummary } from '@/utils/format';
import { useRouter } from 'next/navigation';

export function BookingPreviewSidebar() {
  const store = useBookingStore();
  const router = useRouter();
  const nights = store.getNights();
  const subtotal = store.getSubtotal();
  const taxes = store.getServiceCharge() + store.getVat();
  const total = store.getTotal();

  const canContinue = !!(store.checkIn && store.checkOut && nights > 0);

  const guestSummary = formatGuestSummary(store.adults, store.children);

  return (
    <div className="flex flex-col gap-4">
      <div className="booking-sidebar-card">
        <div className="booking-sidebar-header">
          <h2 className="text-[17px] font-bold text-white">{BOOKING_MESSAGES.bookingPreviewTitle}</h2>
        </div>
        <div className="p-5 flex flex-col gap-5">
          {/* Stay Duration */}
          <div className="flex gap-3">
            <Calendar size={18} className="text-[#020887] shrink-0 mt-0.5" />
            <div>
              <p className="booking-sidebar-label">{BOOKING_MESSAGES.stayDuration}</p>
              <p className="text-[14px] font-semibold text-[#0D0F2B]">
                {store.checkIn && store.checkOut
                  ? `${formatBookingDate(store.checkIn)} - ${formatBookingDate(store.checkOut)}`
                  : '—'}
              </p>
              {nights > 0 && (
                <p className="text-[12px] text-[#64748B]">{nights} Night{nights !== 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          {/* Guests */}
          <div className="flex gap-3">
            <Users size={18} className="text-[#020887] shrink-0 mt-0.5" />
            <div>
              <p className="booking-sidebar-label">{BOOKING_MESSAGES.guestsLabel}</p>
              <p className="text-[14px] font-semibold text-[#0D0F2B]">{guestSummary}</p>
            </div>
          </div>
          {/* Room Type */}
          <div className="flex gap-3">
            <BedDouble size={18} className="text-[#020887] shrink-0 mt-0.5" />
            <div>
              <p className="booking-sidebar-label">{BOOKING_MESSAGES.roomTypeLabel}</p>
              <p className="text-[14px] font-semibold text-[#0D0F2B]">
                {store.selectedRoom?.name ?? BOOKING_MESSAGES.notSelectedYet}
              </p>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-[13px] text-[#64748B]">
              <span>{BOOKING_MESSAGES.subtotalEstimate}</span>
              <span>{subtotal > 0 ? formatNgn(subtotal) : '—'}</span>
            </div>
            <div className="flex justify-between text-[13px] text-[#64748B]">
              <span>{BOOKING_MESSAGES.taxesAndFees}</span>
              <span>{taxes > 0 ? formatNgn(taxes) : '—'}</span>
            </div>
            <div className="flex justify-between text-[15px] font-bold text-[#0D0F2B] mt-1">
              <span>{BOOKING_MESSAGES.totalPlaceholder}</span>
              <span className="text-[#020887]">{total > 0 ? formatNgn(total) : '—'}</span>
            </div>
          </div>

          <button
            onClick={() => canContinue && router.push('/book/rooms')}
            disabled={!canContinue}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {BOOKING_MESSAGES.continueToRooms} →
          </button>
          {!canContinue && (
            <p className="text-[11px] text-[#94A3B8] text-center">
              {BOOKING_MESSAGES.priceDisclaimer}
            </p>
          )}
        </div>
      </div>

      {/* Need assistance */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center shrink-0">
          <Phone size={16} className="text-[#020887]" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#0D0F2B]">{BOOKING_MESSAGES.needAssistance}</p>
          <p className="text-[12px] text-[#64748B]">{BOOKING_MESSAGES.assistancePhone}</p>
        </div>
      </div>
    </div>
  );
}
