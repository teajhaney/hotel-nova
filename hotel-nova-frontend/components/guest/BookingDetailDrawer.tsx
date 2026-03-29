'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CalendarDays, Users, BedDouble, Receipt, CreditCard } from 'lucide-react';
import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { BookingStatusBadge } from '@/components/guest/BookingStatusBadge';
import { CancelBookingButton } from '@/components/guest/CancelBookingButton';
import { formatNgn, formatBookingDate } from '@/utils/format';
import { mapBookingStatus } from '@/type/type';
import type { ApiBooking } from '@/type/type';

interface BookingDetailDrawerProps {
  booking: ApiBooking;
  onClose: () => void;
}

export function BookingDetailDrawer({ booking, onClose }: BookingDetailDrawerProps) {
  // Wait until after hydration before mounting the portal so document is available.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Close the drawer on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const status = mapBookingStatus(booking.status);
  const coverPhoto = booking.room.photos?.[0] ?? null;

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel — slides in from the right edge */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Booking details"
        className="fixed top-0 right-0 z-[101] h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] shrink-0">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#020887]">
              Booking Details
            </p>
            <p className="text-[16px] font-bold text-[#0D0F2B] mt-0.5">
              #{booking.bookingRef}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0D0F2B] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Room photo + name */}
          <div className="relative h-44 bg-[#F1F5F9] shrink-0">
            {coverPhoto ? (
              <Image
                src={coverPhoto}
                alt={booking.room.name}
                fill
                className="object-cover"
                sizes="420px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BedDouble size={36} className="text-[#CBD5E1]" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-white text-[18px] font-bold leading-tight">
                {booking.room.name}
              </p>
              <p className="text-white/70 text-[12px] mt-0.5 uppercase tracking-wider">
                {booking.room.type}
              </p>
            </div>
          </div>

          <div className="p-5 flex flex-col gap-5">
            {/* Status + payment */}
            <div className="flex items-center justify-between">
              <BookingStatusBadge status={status} />
              <span
                className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                  booking.paymentStatus === 'Paid'
                    ? 'bg-[#D1FAE5] text-[#065F46]'
                    : booking.paymentStatus === 'Failed'
                    ? 'bg-[#FEE2E2] text-[#991B1B]'
                    : 'bg-[#FEF3C7] text-[#92400E]'
                }`}
              >
                {booking.paymentStatus}
              </span>
            </div>

            {/* Stay details */}
            <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-[#020887] shrink-0" />
                <div className="flex-1 flex items-start justify-between gap-2 text-[13px]">
                  <span className="text-[#64748B]">Check-in</span>
                  <span className="font-semibold text-[#0D0F2B] text-right">
                    {formatBookingDate(booking.checkIn, true)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-[#020887] shrink-0" />
                <div className="flex-1 flex items-start justify-between gap-2 text-[13px]">
                  <span className="text-[#64748B]">Check-out</span>
                  <span className="font-semibold text-[#0D0F2B] text-right">
                    {formatBookingDate(booking.checkOut, true)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BedDouble size={16} className="text-[#020887] shrink-0" />
                <div className="flex-1 flex items-start justify-between gap-2 text-[13px]">
                  <span className="text-[#64748B]">Duration</span>
                  <span className="font-semibold text-[#0D0F2B]">
                    {booking.nights} Night{booking.nights !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users size={16} className="text-[#020887] shrink-0" />
                <div className="flex-1 flex items-start justify-between gap-2 text-[13px]">
                  <span className="text-[#64748B]">Guests</span>
                  <span className="font-semibold text-[#0D0F2B]">
                    {booking.adults} Adult{booking.adults !== 1 ? 's' : ''}
                    {booking.children > 0
                      ? `, ${booking.children} Child${booking.children !== 1 ? 'ren' : ''}`
                      : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Receipt size={15} className="text-[#020887]" />
                <p className="text-[13px] font-semibold text-[#0D0F2B]">Total Amount</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#64748B]">Total paid</span>
                <span className="text-[17px] font-bold text-[#020887]">
                  {formatNgn(booking.totalAmount)}
                </span>
              </div>
            </div>

            {/* Booking reference */}
            <div className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <CreditCard size={15} className="text-[#020887] mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  Booking Reference
                </p>
                <p className="text-[13px] font-mono font-semibold text-[#0D0F2B] mt-0.5">
                  {booking.bookingRef}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center gap-3 shrink-0">
          <CancelBookingButton bookingId={booking.id} status={status} />
          <button
            onClick={onClose}
            className="ml-auto text-[13px] font-medium text-[#64748B] hover:text-[#0D0F2B] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );

  // Only render into the portal after hydration
  if (!mounted) return null;
  return createPortal(drawer, document.body);
}
