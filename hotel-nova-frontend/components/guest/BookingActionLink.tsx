import type { BookingStatus } from '@/type/type';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';

const ACTION_CONFIG: Record<BookingStatus, { label: string }> = {
  confirmed: { label: GUEST_DASHBOARD_MESSAGES.viewDetails },
  'checked-in': { label: GUEST_DASHBOARD_MESSAGES.digitalKey },
  'checked-out': { label: GUEST_DASHBOARD_MESSAGES.reviewStay },
  cancelled: { label: GUEST_DASHBOARD_MESSAGES.rebook },
  pending: { label: GUEST_DASHBOARD_MESSAGES.viewDetails },
};

export function BookingActionLink({ status, bookingId }: { status: BookingStatus; bookingId: string }) {
  const { label } = ACTION_CONFIG[status];
  return (
    <button className="text-[13px] font-semibold text-[#020887] hover:text-[#38369A] hover:underline underline-offset-2 transition-colors whitespace-nowrap">
      {label}
    </button>
  );
}
