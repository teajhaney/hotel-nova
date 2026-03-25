'use client';

import { useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Download,
  Printer,
  Pencil,
  Trash2,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { BookingStatusModal, type BookingData } from '@/components/admin/bookings/BookingStatusModal';
import { DeleteBookingModal } from '@/components/admin/bookings/DeleteBookingModal';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';
import {
  useAdminBookings,
  useAdminUpdateBookingStatus,
  API_TO_DISPLAY,
  type AdminBookingFilters,
} from '@/hooks/use-admin-bookings';
import { formatNgn } from '@/utils/format';

const M = ADMIN_DASHBOARD_MESSAGES;

const AVATAR_COLORS      = ['#EEF0FF','#D1FAE5','#FFEDD5','#DBEAFE','#FEE2E2','#FEF3C7','#F3E8FF','#ECFDF5','#FFF7ED','#EFF6FF'];
const AVATAR_TEXT_COLORS = ['#020887','#10B981','#F97316','#1D4ED8','#DC2626','#B45309','#7C3AED','#059669','#EA580C','#2563EB'];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmed:    'admin-badge-confirmed',
    Pending:      'admin-badge-pending',
    'Checked In': 'admin-badge-checked-in',
    'Checked Out':'admin-badge-checked-out',
    Cancelled:    'admin-badge-cancelled',
  };
  return <span className={map[status] ?? 'admin-badge-pending'}>{status}</span>;
}

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>(M.allStatuses);
  const [page, setPage] = useState(1);

  const [editTarget, setEditTarget]     = useState<BookingData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BookingData | null>(null);

  const filters: AdminBookingFilters = { status: statusFilter, page, limit: 20 };
  const { data, isLoading } = useAdminBookings(filters);
  const updateStatus = useAdminUpdateBookingStatus();

  const bookings = data?.data ?? [];
  const meta = data?.meta;

  // Derive mini-stats from the first page load (unfiltered counts not available
  // from a filtered query, so we show counts from current page data).
  const pendingCount   = bookings.filter((b) => b.status === 'Pending').length;
  const checkedInCount = bookings.filter((b) => b.status === 'CheckedIn').length;

  // Convert API booking → BookingData shape that the modal expects
  function toBookingData(b: (typeof bookings)[number]): BookingData {
    return {
      id:       b.bookingRef,
      guest:    b.guestName,
      room:     b.room.name,
      checkIn:  new Date(b.checkIn).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
      checkOut: new Date(b.checkOut).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount:   b.totalAmount,
      status:   API_TO_DISPLAY[b.status] ?? b.status,
    };
  }

  function handleStatusSave(updated: BookingData) {
    // Find the real booking ID (not the bookingRef we pass to the modal)
    const found = bookings.find((b) => b.bookingRef === updated.id);
    if (!found) return;

    updateStatus.mutate(
      { id: found.id, displayStatus: updated.status },
      { onSuccess: () => setEditTarget(null) },
    );
  }

  function handleDeleteConfirm() {
    // Deleting bookings via admin is not yet wired — close the modal
    setDeleteTarget(null);
  }

  const MINI_STATS = [
    { label: M.bookingStatTotalBookings, value: isLoading ? '—' : String(meta?.total ?? bookings.length), icon: TrendingUp, positive: true },
    { label: M.bookingStatPending,       value: isLoading ? '—' : String(pendingCount),   icon: TrendingUp, positive: false },
    { label: M.bookingStatCheckedIn,     value: isLoading ? '—' : String(checkedInCount), icon: TrendingUp, positive: true },
  ];

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[24px] font-bold text-[#0D0F2B]">{M.bookingsTitle}</h1>
        <p className="text-[14px] text-[#64748B] mt-1">{M.bookingsSubtitle}</p>
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {MINI_STATS.map(({ label, value, positive }) => (
          <div key={label} className="admin-stat-card text-center sm:text-left">
            <p className="text-[12px] sm:text-[13px] text-[#64748B] mb-1 leading-tight">{label}</p>
            <p className="text-[20px] sm:text-[22px] font-bold text-[#0D0F2B]">{value}</p>
            <div className={`flex items-center justify-center sm:justify-start gap-1 mt-1 text-[11px] sm:text-[12px] font-medium ${positive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              <TrendingUp size={12} />
              <span className="hidden sm:inline">Live from database</span>
              <span className="sm:hidden">Live</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#64748B]">
          <CalendarDays size={15} />
          <span>All dates</span>
          <ChevronDown size={14} />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0D0F2B] outline-none appearance-none cursor-pointer"
          >
            <option>{M.allStatuses}</option>
            <option>{M.statusConfirmed}</option>
            <option>{M.statusPending}</option>
            <option>{M.statusCheckedIn}</option>
            <option>{M.statusCheckedOut}</option>
            <option>{M.statusCancelled}</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="admin-action-btn" aria-label={M.downloadAriaLabel}><Download size={15} /></button>
          <button className="admin-action-btn" aria-label={M.printAriaLabel}><Printer size={15} /></button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="admin-table-th">{M.bookingsColBookingId}</th>
                <th className="admin-table-th">{M.bookingsColGuestName}</th>
                <th className="admin-table-th">{M.bookingsColRoom}</th>
                <th className="admin-table-th">{M.bookingsColCheckInOut}</th>
                <th className="admin-table-th">{M.bookingsColAmount}</th>
                <th className="admin-table-th">{M.bookingsColStatus}</th>
                <th className="admin-table-th">{M.bookingsColActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Loader2 size={24} className="animate-spin text-[#020887] mx-auto" />
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[14px] text-[#94A3B8]">
                    {M.noBookingsFound}
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => {
                  const displayStatus = API_TO_DISPLAY[b.status] ?? b.status;
                  const initials = b.guestName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="admin-table-td">
                        <span className="text-[13px] font-medium text-[#020887]">
                          {b.bookingRef}
                        </span>
                      </td>
                      <td className="admin-table-td">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                          >
                            <span className="text-[11px] font-bold" style={{ color: AVATAR_TEXT_COLORS[i % AVATAR_TEXT_COLORS.length] }}>
                              {initials}
                            </span>
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-[#0D0F2B]">{b.guestName}</p>
                            <p className="text-[11px] text-[#94A3B8]">{b.guestEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="admin-table-td text-[13px] text-[#64748B]">
                        <p>{b.room.name}</p>
                        <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide">{b.room.type}</p>
                      </td>
                      <td className="admin-table-td">
                        <p className="text-[12px] text-[#0D0F2B]">
                          {new Date(b.checkIn).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-[12px] text-[#94A3B8]">
                          {new Date(b.checkOut).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="admin-table-td text-[13px] font-medium text-[#0D0F2B]">
                        {formatNgn(b.totalAmount)}
                      </td>
                      <td className="admin-table-td">
                        <StatusBadge status={displayStatus} />
                      </td>
                      <td className="admin-table-td">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditTarget(toBookingData(b))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors"
                            aria-label={M.editStatusAriaLabel}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(toBookingData(b))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                            aria-label={M.deleteBookingAriaLabel}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-[13px] text-[#64748B]">
            Showing {bookings.length} of {meta?.total ?? 0} bookings
          </p>
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                    p === page
                      ? 'bg-[#020887] text-white'
                      : 'text-[#64748B] hover:bg-[#EEF0FF] hover:text-[#020887]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editTarget && (
          <BookingStatusModal
            key="booking-status"
            booking={editTarget}
            onClose={() => setEditTarget(null)}
            onSave={handleStatusSave}
            isSaving={updateStatus.isPending}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteBookingModal
            key="delete-booking"
            bookingId={deleteTarget.id}
            guestName={deleteTarget.guest}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
