'use client';

import { CalendarX2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';

const M = ADMIN_DASHBOARD_MESSAGES;

interface DeleteBookingModalProps {
  bookingId: string;
  guestName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteBookingModal({ bookingId, guestName, onClose, onConfirm }: DeleteBookingModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button className="absolute inset-0 w-full h-full bg-black/50 cursor-default" onClick={onClose} aria-label={M.closeAriaLabel} />
      <motion.div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center"
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
          <CalendarX2 size={22} className="text-[#EF4444]" />
        </div>
        <h2 className="text-[17px] font-bold text-[#0D0F2B]">{M.deleteBookingTitle}</h2>
        <p className="text-[14px] text-[#6B7280] mt-2 leading-relaxed">
          {M.deleteBookingBodyPrefix}{' '}
          <span className="font-semibold text-[#020887]">{bookingId}</span>{' '}
          {M.deleteBookingBodyFor}{' '}
          <span className="font-semibold text-[#0D0F2B]">{guestName}</span>
          {M.deleteBookingBodySuffix}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-10 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors">
            {M.cancel}
          </button>
          <button onClick={onConfirm} className="flex-1 h-10 rounded-lg bg-[#EF4444] text-white text-[13px] font-semibold hover:bg-[#DC2626] transition-colors">
            {M.deleteBookingConfirm}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
