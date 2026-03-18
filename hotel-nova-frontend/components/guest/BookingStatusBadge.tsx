import type { BookingStatus } from '@/type/type';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';

const STATUS_CONFIG: Record<BookingStatus, { label: string; className: string }> = {
  confirmed: {
    label: GUEST_DASHBOARD_MESSAGES.statusConfirmed,
    className: 'bg-[#D1FAE5] text-[#065F46]',
  },
  'checked-in': {
    label: GUEST_DASHBOARD_MESSAGES.statusCheckedIn,
    className: 'bg-[#DBEAFE] text-[#1E40AF]',
  },
  'checked-out': {
    label: GUEST_DASHBOARD_MESSAGES.statusCheckedOut,
    className: 'bg-[#F1F5F9] text-[#475569]',
  },
  cancelled: {
    label: GUEST_DASHBOARD_MESSAGES.statusCancelled,
    className: 'bg-[#FEE2E2] text-[#991B1B]',
  },
  pending: {
    label: GUEST_DASHBOARD_MESSAGES.statusPending,
    className: 'bg-[#FEF3C7] text-[#92400E]',
  },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.06em] whitespace-nowrap ${config.className}`}>
      {config.label}
    </span>
  );
}
