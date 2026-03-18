'use client';

import { CalendarX2 } from 'lucide-react';

interface DeleteBookingModalProps {
  bookingId: string;
  guestName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteBookingModal({ bookingId, guestName, onClose, onConfirm }: DeleteBookingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 w-full h-full bg-black/50 cursor-default" onClick={onClose} aria-label="Close" />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
          <CalendarX2 size={22} className="text-[#EF4444]" />
        </div>
        <h2 className="text-[17px] font-bold text-[#0D0F2B]">Delete Booking</h2>
        <p className="text-[14px] text-[#6B7280] mt-2 leading-relaxed">
          Are you sure you want to delete booking{' '}
          <span className="font-semibold text-[#020887]">{bookingId}</span> for{' '}
          <span className="font-semibold text-[#0D0F2B]">{guestName}</span>? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 h-10 rounded-lg bg-[#EF4444] text-white text-[13px] font-semibold hover:bg-[#DC2626] transition-colors">
            Delete Booking
          </button>
        </div>
      </div>
    </div>
  );
}
