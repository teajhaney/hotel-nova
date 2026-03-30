'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { useBookingStore } from '@/stores/booking-store';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { formatNgn } from '@/utils/format';
import type { CreateBookingApiResponse } from '@/type/type';

export default function BookPaymentPage() {
  const store = useBookingStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = store.getTotal();
  const serviceCharge = store.getServiceCharge();
  const vat = store.getVat();
  const subtotal = store.getSubtotal();
  const nights = store.getNights();

  // Builds the request body from the wizard state and sends it to the Next.js
  // Route Handler, which proxies it to NestJS. On success we get back
  // { booking, paymentUrl }. We store the booking identifiers and then hand
  // the browser off to Paystack's hosted payment page.
  async function handlePayWithPaystack() {
    if (!store.selectedRoom || !store.checkIn || !store.checkOut || !store.guestDetails) return;

    setIsProcessing(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: store.selectedRoom.id,
          checkIn: store.checkIn,
          checkOut: store.checkOut,
          adults: store.adults,
          children: store.children,
          guestPhone: store.guestDetails.phone,
          guestCountry: store.guestDetails.country,
          promoCode: store.promoCode || undefined,
          specialRequests: store.specialRequests || undefined,
        }),
      });

      const data = await res.json() as CreateBookingApiResponse & { error?: { message?: string }; message?: string };

      if (!res.ok) {
        const msg = data.error?.message ?? data.message ?? 'Booking failed. Please try again.';
        toast.error(msg);
        return;
      }

      // Keep the booking identifiers in the store so the confirmation page
      // can display the real booking reference after Paystack redirects back.
      store.setBookingCreated(data.booking.id, data.booking.bookingRef);

      // Hand the browser off to Paystack. This replaces the current page in
      // history so the user can't accidentally navigate "back" to re-submit.
      window.location.href = data.paymentUrl;
    } catch {
      toast.error('Something went wrong. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="page-container py-10">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0D0F2B]">{BOOKING_MESSAGES.paymentTitle}</h1>
        <p className="text-[15px] text-[#64748B] mt-1">{BOOKING_MESSAGES.paymentSubtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Confirm & Pay */}
        <div className="flex-1">
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 flex flex-col gap-5">
            {/* What the guest is paying for */}
            {store.selectedRoom && (
              <div className="flex items-start gap-4 pb-5 border-b border-[#F1F5F9]">
                <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={store.selectedRoom.imageUrl ?? ''}
                    alt={store.selectedRoom.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#0D0F2B]">{store.selectedRoom.name}</p>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    {nights} Night{nights !== 1 ? 's' : ''} &bull; {store.adults + store.children} Guest{(store.adults + store.children) !== 1 ? 's' : ''}
                  </p>
                  <p className="text-[13px] text-[#64748B] mt-0.5">
                    {store.checkIn} → {store.checkOut}
                  </p>
                </div>
              </div>
            )}

            {/* Price breakdown */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-[13px] text-[#64748B]">
                <span>{BOOKING_MESSAGES.subtotalLabel}</span>
                <span>{formatNgn(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#64748B]">
                <span>{BOOKING_MESSAGES.serviceFeeLabel}</span>
                <span>{formatNgn(serviceCharge)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#64748B]">
                <span>{BOOKING_MESSAGES.vatLabel}</span>
                <span>{formatNgn(vat)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="text-[15px] font-bold text-[#0D0F2B]">{BOOKING_MESSAGES.totalToPay}</span>
                <span className="text-[18px] font-bold text-[#0D0F2B]">{formatNgn(total)}</span>
              </div>
            </div>

            {/* Paystack CTA — clicking this creates the booking and redirects to Paystack */}
            <button
              onClick={handlePayWithPaystack}
              disabled={isProcessing}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Shield size={16} />
              {isProcessing ? 'Creating your booking...' : `${BOOKING_MESSAGES.payBtn} ${formatNgn(total)} with Paystack`}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#94A3B8]">
              <Shield size={12} />
              <span>{BOOKING_MESSAGES.securedByPaystack}</span>
            </div>
          </div>
        </div>

        {/* Right: booking summary sidebar */}
        <div className="hidden lg:block w-[300px] xl:w-[320px] shrink-0">
          <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-5 sticky top-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#020887] mb-4">
              {BOOKING_MESSAGES.bookingSummaryLabel}
            </p>
            {store.selectedRoom && (
              <div className="flex items-start gap-3 mb-5">
                <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={store.selectedRoom.imageUrl ?? ''}
                    alt={store.selectedRoom.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0D0F2B]">Hotel Nova</p>
                  <p className="text-[12px] text-[#64748B] uppercase tracking-wider">{store.selectedRoom.name}</p>
                  <p className="text-[12px] text-[#64748B] mt-1">
                    {nights} Night{nights !== 1 ? 's' : ''} &bull; {store.adults + store.children} Guest{(store.adults + store.children) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2.5 border-t border-[#E2E8F0] pt-4">
              <div className="flex justify-between text-[13px] text-[#64748B]">
                <span>{BOOKING_MESSAGES.subtotalLabel}</span>
                <span>{formatNgn(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#64748B]">
                <span>{BOOKING_MESSAGES.serviceFeeLabel}</span>
                <span>{formatNgn(serviceCharge)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#64748B]">
                <span>{BOOKING_MESSAGES.vatLabel}</span>
                <span>{formatNgn(vat)}</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold text-[#0D0F2B] pt-2 border-t border-[#E2E8F0]">
                <span>Total</span>
                <span>{formatNgn(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
