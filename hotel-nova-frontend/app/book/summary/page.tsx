'use client';

import { useEffect, useState } from 'react';
import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { Calendar, Users, BedDouble, Maximize2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { useBookingStore } from '@/stores/booking-store';
import { useCreateBooking } from '@/hooks/use-bookings';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { formatBookingDate, formatNgn, formatGuestSummary } from '@/utils/format';
import { useRouter } from 'next/navigation';

export default function BookSummaryPage() {
  const store = useBookingStore();
  const router = useRouter();
  const [promoInput, setPromoInput] = useState(store.promoCode);
  const createBooking = useCreateBooking();

  const nights = store.getNights();
  const serviceCharge = store.getServiceCharge();
  const vat = store.getVat();
  const total = store.getTotal();
  const guestSummary = formatGuestSummary(store.adults, store.children);

  // Guard — if the user refreshes here without a room or dates, send them back.
  useEffect(() => {
    if (!store.selectedRoom) router.replace('/rooms');
    else if (!store.checkIn || !store.checkOut || nights === 0) router.replace('/book');
  }, [store.selectedRoom, store.checkIn, store.checkOut, nights, router]);

  // Calls the backend via TanStack Query mutation → Axios → Next.js Route Handler
  // → NestJS. On success we get { booking, paymentUrl } and hand the browser
  // off to Paystack's hosted payment page.
  function handleProceedToPayment() {
    if (!store.selectedRoom || !store.checkIn || !store.checkOut) return;

    createBooking.mutate(
      {
        roomId: store.selectedRoom.id,
        checkIn: store.checkIn,
        checkOut: store.checkOut,
        adults: store.adults,
        children: store.children,
        promoCode: promoInput.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          // Persist identifiers so the confirmation page shows the real booking ref.
          store.setBookingCreated(data.booking.id, data.booking.bookingRef);
          window.location.href = data.paymentUrl;
        },
        onError: (err) => {
          const message = isAxiosError(err)
            ? (err.response?.data as { message?: string })?.message
            : undefined;
          toast.error(message ?? 'Booking failed. Please try again.');
        },
      },
    );
  }

  if (!store.selectedRoom) return null;

  const room = store.selectedRoom;

  return (
    <div className="page-container py-10 pb-28 lg:pb-10">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0D0F2B] mb-1">{BOOKING_MESSAGES.bookingSummaryTitle}</h1>
        <p className="text-[15px] text-[#64748B]">{BOOKING_MESSAGES.bookingSummarySubtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: booking details */}
        <div className="flex-1 flex flex-col gap-5">

          {/* Selected room card */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Room image */}
              <div className="relative w-full sm:w-48 h-44 sm:h-auto shrink-0 bg-[#F1F5F9]">
                {room.imageUrl ? (
                  <Image
                    src={room.imageUrl}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BedDouble size={36} className="text-[#CBD5E1]" />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.08em] bg-[#020887] text-white">
                  {room.type}
                </span>
              </div>

              {/* Room info */}
              <div className="p-5 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B] mb-1">
                  {BOOKING_MESSAGES.selectedStay}
                </p>
                <h2 className="text-[20px] font-bold text-[#0D0F2B] mb-3">{room.name}</h2>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
                  {room.beds && (
                    <span className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
                      <BedDouble size={14} className="text-[#94A3B8]" />
                      {room.beds}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
                    <Users size={14} className="text-[#94A3B8]" />
                    Up to {room.maxGuests} guests
                  </span>
                  {room.sqm && (
                    <span className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
                      <Maximize2 size={14} className="text-[#94A3B8]" />
                      {room.sqm} m²
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.slice(0, 4).map(a => (
                    <span key={a} className="text-[11px] text-[#020887] font-medium bg-[#020887]/8 px-2 py-0.5 rounded-sm">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stay details */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B] mb-4">
              Stay Details
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: <Calendar size={15} className="text-[#020887]" />,
                  label: BOOKING_MESSAGES.checkInDate,
                  value: formatBookingDate(store.checkIn, true),
                },
                {
                  icon: <Calendar size={15} className="text-[#020887]" />,
                  label: BOOKING_MESSAGES.checkOutDate,
                  value: `${formatBookingDate(store.checkOut, true)} (${nights} Night${nights !== 1 ? 's' : ''})`,
                },
                {
                  icon: <Users size={15} className="text-[#020887]" />,
                  label: BOOKING_MESSAGES.guestsDetail,
                  value: guestSummary,
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  <div className="flex-1 flex items-start justify-between gap-4 text-[14px]">
                    <span className="text-[#64748B]">{label}</span>
                    <span className="text-[#0D0F2B] font-semibold text-right">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promo code */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <p className="text-[14px] font-semibold text-[#0D0F2B] mb-3">{BOOKING_MESSAGES.applyPromoCode}</p>
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder={BOOKING_MESSAGES.enterCode}
              className="w-full h-10 px-3 rounded-sm border border-[#E2E8F0] text-[14px] text-[#0D0F2B] placeholder:text-[#94A3B8] outline-none focus:border-[#020887] transition-colors"
            />
            <p className="mt-2 text-[12px] text-[#94A3B8]">Promo codes are applied and validated at checkout.</p>
          </div>

          {/* Mobile price breakdown */}
          <div className="lg:hidden">
            <PriceBreakdown
              ratePerNight={room.price}
              nights={nights}
              serviceCharge={serviceCharge}
              vat={vat}
              total={total}
              promoDiscount={store.promoDiscount}
            />
          </div>
        </div>

        {/* Right sidebar — desktop */}
        <div className="hidden lg:flex flex-col gap-4 w-[300px] xl:w-[340px] shrink-0">
          <div className="sticky top-6 flex flex-col gap-4">
            <PriceBreakdown
              ratePerNight={room.price}
              nights={nights}
              serviceCharge={serviceCharge}
              vat={vat}
              total={total}
              promoDiscount={store.promoDiscount}
            />

            {/* Proceed to Payment — triggers API call + Paystack redirect */}
            <button
              onClick={handleProceedToPayment}
              disabled={createBooking.isPending}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Shield size={15} />
              {createBooking.isPending ? 'Creating your booking...' : `${BOOKING_MESSAGES.proceedToPayment} →`}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8]">
              <Shield size={11} />
              <span>{BOOKING_MESSAGES.securedByPaystack}</span>
            </div>

            <button
              onClick={() => router.back()}
              className="text-[14px] text-[#64748B] hover:text-[#020887] text-center transition-colors"
            >
              ← Go back
            </button>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-5 py-4 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] text-[#64748B] uppercase tracking-[0.08em] font-semibold">Total Amount</p>
            <p className="text-[18px] font-bold text-[#020887]">{formatNgn(total)}</p>
          </div>
          <p className="text-[13px] text-[#64748B]">{nights} Night{nights !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={handleProceedToPayment}
          disabled={createBooking.isPending}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Shield size={15} />
          {createBooking.isPending ? 'Creating your booking...' : `${BOOKING_MESSAGES.proceedToPayment} →`}
        </button>
      </div>
    </div>
  );
}
