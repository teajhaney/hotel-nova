'use client';

import { Eye, KeyRound, Star, RotateCcw } from 'lucide-react';
import type { BookingStatus } from '@/type/type';

interface BookingActionLinkProps {
  status: BookingStatus;
  bookingId: string;
  onViewDetails?: () => void;
}

export function BookingActionLink({
  status,
  onViewDetails,
}: BookingActionLinkProps) {
  if (status === 'pending' || status === 'confirmed') {
    return (
      <button
        onClick={onViewDetails}
        title="View booking details"
        className="w-7 h-7 flex items-center justify-center rounded-md text-[#020887] hover:bg-[#EEF0FF] transition-colors"
      >
        <Eye size={15} />
      </button>
    );
  }

  if (status === 'checked-in') {
    return (
      <button
        title="Digital key"
        className="w-7 h-7 flex items-center justify-center rounded-md text-[#020887] hover:bg-[#EEF0FF] transition-colors"
      >
        <KeyRound size={15} />
      </button>
    );
  }

  if (status === 'checked-out') {
    return (
      <button
        title="Leave a review"
        className="w-7 h-7 flex items-center justify-center rounded-md text-[#F59E0B] hover:bg-[#FEF3C7] transition-colors"
      >
        <Star size={15} />
      </button>
    );
  }

  // cancelled
  return (
    <button
      title="Rebook this room"
      className="w-7 h-7 flex items-center justify-center rounded-md text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
    >
      <RotateCcw size={15} />
    </button>
  );
}
