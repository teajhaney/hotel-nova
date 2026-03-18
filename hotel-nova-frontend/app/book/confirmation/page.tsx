'use client';

import Image from 'next/image';
import { CheckCircle, Download, Home, ArrowLeft } from 'lucide-react';
import { useBookingStore } from '@/stores/booking-store';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { BOOKING_IMAGES } from '@/constants/images';
import Link from 'next/link';
import { formatBookingDate, formatNgn } from '@/utils/format';

export default function BookConfirmationPage() {
  const store = useBookingStore();

  return (
    <div className="page-container py-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[20px] font-bold text-[#0D0F2B]">Booking Confirmed</h1>
      </div>

      {/* Success icon + title */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#020887] flex items-center justify-center mb-5">
          <CheckCircle size={42} className="text-white" />
        </div>
        <h2 className="text-[32px] font-bold text-[#0D0F2B] mb-2">{BOOKING_MESSAGES.confirmationTitle}</h2>
        <p className="text-[15px] text-[#64748B] max-w-md leading-relaxed">
          {BOOKING_MESSAGES.confirmationSubtitle}
        </p>
      </div>

      {/* Confirmation card */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 mb-5">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#F1F5F9]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
            {BOOKING_MESSAGES.confirmationId}
          </p>
          <p className="text-[15px] font-bold text-[#020887]">
            #{store.confirmationId ?? 'BK-000000'}
          </p>
        </div>

        {store.selectedRoom && (
          <div className="flex items-start gap-3 mb-5">
            <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0">
              <Image
                src={store.selectedRoom.image}
                alt={store.selectedRoom.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#0D0F2B]">The Grand Oasis Abuja</p>
              <p className="text-[13px] text-[#64748B]">{store.selectedRoom.name}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B] mb-1">
              {BOOKING_MESSAGES.checkInLabel}
            </p>
            <p className="text-[15px] font-bold text-[#0D0F2B]">{formatBookingDate(store.checkIn)}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B] mb-1">
              {BOOKING_MESSAGES.checkOutLabel}
            </p>
            <p className="text-[15px] font-bold text-[#0D0F2B]">{formatBookingDate(store.checkOut)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
          <span className="text-[14px] text-[#64748B]">{BOOKING_MESSAGES.totalPaid}</span>
          <span className="text-[18px] font-bold text-[#0D0F2B]">{formatNgn(store.getTotal())}</span>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="relative rounded-lg overflow-hidden h-40 mb-6">
        <Image
          src={BOOKING_IMAGES.map}
          alt="Hotel location map"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 672px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <p className="text-white text-[12px] font-medium">123 Maitama District, Abuja, Nigeria</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button className="btn-primary flex items-center justify-center gap-2">
          <Download size={16} />
          {BOOKING_MESSAGES.downloadPdf}
        </button>
        <Link
          href="/"
          className="btn-outline-primary flex items-center justify-center gap-2"
          onClick={() => store.reset()}
        >
          <Home size={16} />
          {BOOKING_MESSAGES.returnHome}
        </Link>
        <div className="text-center mt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] text-[#64748B] hover:text-[#020887] transition-colors"
            onClick={() => store.reset()}
          >
            <ArrowLeft size={14} />
            {BOOKING_MESSAGES.returnHome}
          </Link>
        </div>
      </div>

      <div className="text-center mt-8 text-[13px] text-[#94A3B8]">
        {BOOKING_MESSAGES.needHelpConfirmation}{' '}
        <a href="/contact" className="text-[#020887] font-medium hover:underline">
          {BOOKING_MESSAGES.contactSupport}
        </a>
      </div>
    </div>
  );
}
