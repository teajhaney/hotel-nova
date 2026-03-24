'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { useCancelBooking } from '@/hooks/use-bookings';
import type { BookingStatus } from '@/type/type';

// Only Pending and Confirmed bookings can be cancelled.
const CANCELLABLE: BookingStatus[] = ['pending', 'confirmed'];

interface CancelBookingButtonProps {
  bookingId: string;
  status: BookingStatus;
}

export function CancelBookingButton({
  bookingId,
  status,
}: CancelBookingButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const cancelBooking = useCancelBooking();

  if (!CANCELLABLE.includes(status)) return null;

  function handleConfirm() {
    cancelBooking.mutate(bookingId, {
      onSuccess: () => {
        toast.success('Booking cancelled successfully.');
        setConfirming(false);
      },
      onError: (err) => {
        const message = isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message
          : undefined;
        toast.error(message ?? 'Could not cancel booking. Please try again.');
        setConfirming(false);
      },
    });
  }

  // Inline confirmation: show tiny Yes/No after the X is clicked
  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleConfirm}
          disabled={cancelBooking.isPending}
          title="Confirm cancellation"
          className="w-7 h-7 flex items-center justify-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 text-[11px] font-bold"
        >
          {cancelBooking.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={cancelBooking.isPending}
          title="Keep booking"
          className="w-7 h-7 flex items-center justify-center rounded-md text-[#64748B] hover:bg-[#F1F5F9] transition-colors text-[11px] font-bold"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title="Cancel booking"
      className="w-7 h-7 flex items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <X size={15} />
    </button>
  );
}
