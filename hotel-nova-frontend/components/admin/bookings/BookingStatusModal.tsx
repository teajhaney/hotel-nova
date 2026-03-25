'use client';

import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';

const M = ADMIN_DASHBOARD_MESSAGES;

const STATUSES = [
  'Pending',
  'Confirmed',
  'Checked In',
  'Checked Out',
  'Cancelled',
] as const;

const schema = z.object({
  status: z.enum(STATUSES),
});

type FormData = z.infer<typeof schema>;

export interface BookingData {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: string;
}

interface BookingStatusModalProps {
  booking: BookingData;
  onClose: () => void;
  onSave: (booking: BookingData) => void;
  isSaving?: boolean;
}

const STATUS_BADGE: Record<string, string> = {
  Confirmed: 'bg-[#EEF0FF] text-[#020887]',
  Pending: 'bg-[#FEF3C7] text-[#B45309]',
  'Checked In': 'bg-[#DBEAFE] text-[#1D4ED8]',
  'Checked Out': 'bg-[#F1F5F9] text-[#64748B]',
  Cancelled: 'bg-[#FEE2E2] text-[#DC2626]',
};

const selectCls =
  'block w-full h-12 px-4 pr-10 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 appearance-none cursor-pointer transition-all';

export function BookingStatusModal({
  booking,
  onClose,
  onSave,
  isSaving = false,
}: BookingStatusModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: (STATUSES.includes(booking.status as (typeof STATUSES)[number])
        ? booking.status
        : 'Pending') as (typeof STATUSES)[number],
    },
  });

  const onSubmit = (data: FormData) => {
    onSave({ ...booking, status: data.status });
  };

  const modal = (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
        onClick={onClose}
        aria-label={M.closeAriaLabel}
      />

      <motion.div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[17px] font-bold text-[#0D0F2B]">
              {M.bookingStatusTitle}
            </h2>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              {M.bookingStatusSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] transition-colors shrink-0 ml-3"
            aria-label={M.closeAriaLabel}
          >
            <X size={18} />
          </button>
        </div>

        {/* Booking summary (read-only) */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E5E7EB]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-[#020887] mb-1">
                {booking.id}
              </p>
              <p className="text-[14px] font-semibold text-[#0D0F2B]">
                {booking.guest}
              </p>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                {booking.room}
              </p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                {booking.checkIn} → {booking.checkOut}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[15px] font-bold text-[#0D0F2B]">
                ₦{booking.amount.toLocaleString()}
              </p>
              <span
                className={`inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide ${STATUS_BADGE[booking.status] ?? 'bg-[#F1F5F9] text-[#64748B]'}`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5">
          <label className="block text-[13px] font-semibold text-[#374151] mb-2">
            {M.bookingStatusLabel}
          </label>
          <div className="relative">
            <select {...register('status')} className={selectCls}>
              {STATUSES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
            />
          </div>
          {errors.status && (
            <p className="text-[12px] text-[#EF4444] mt-1.5">
              {errors.status.message}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors"
            >
              {M.cancel}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 px-6 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : M.bookingStatusSubmit}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modal, document.body);
}
