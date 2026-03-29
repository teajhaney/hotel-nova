'use client';

import { useState } from 'react';
import {
  CalendarDays,
  BedDouble,
  CircleDollarSign,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { BookingStatusBadge } from '@/components/guest/BookingStatusBadge';
import { BookingActionLink } from '@/components/guest/BookingActionLink';
import { CancelBookingButton } from '@/components/guest/CancelBookingButton';
import { BookingDetailDrawer } from '@/components/guest/BookingDetailDrawer';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { formatNgn, formatBookingDate } from '@/utils/format';
import { useMyBookings } from '@/hooks/use-bookings';
import { mapBookingStatus } from '@/type/type';
import type { ApiBooking, BookingStatus } from '@/type/type';
import { useAuthStore } from '@/stores/auth-store';

type FilterTab = 'all' | 'upcoming' | 'completed' | 'cancelled';

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',       label: GUEST_DASHBOARD_MESSAGES.tabAll },
  { id: 'upcoming',  label: 'Upcoming' },
  { id: 'completed', label: GUEST_DASHBOARD_MESSAGES.tabCompleted },
  { id: 'cancelled', label: GUEST_DASHBOARD_MESSAGES.tabCancelled },
];

const STATUS_MAP: Record<FilterTab, BookingStatus[]> = {
  all:       ['confirmed', 'checked-in', 'checked-out', 'cancelled', 'pending'],
  upcoming:  ['pending', 'confirmed', 'checked-in'],
  completed: ['checked-out'],
  cancelled: ['cancelled'],
};

export default function GuestBookingsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: bookings, isLoading } = useMyBookings();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);

  const filtered = bookings?.filter((b) =>
    STATUS_MAP[activeTab].includes(mapBookingStatus(b.status)),
  ) ?? [];

  // Stat card values
  const upcomingCount = bookings?.filter((b) => {
    const s = mapBookingStatus(b.status);
    return s === 'confirmed' || s === 'checked-in' || s === 'pending';
  }).length ?? 0;

  const completedCount = bookings?.filter(
    (b) => mapBookingStatus(b.status) === 'checked-out',
  ).length ?? 0;

  const totalSpent = bookings
    ?.filter((b) => mapBookingStatus(b.status) === 'checked-out')
    .reduce((sum, b) => sum + b.totalAmount, 0) ?? 0;

  const STATS = [
    {
      label: GUEST_DASHBOARD_MESSAGES.upcomingStays,
      value: isLoading ? '—' : String(upcomingCount).padStart(2, '0'),
      icon: CalendarDays,
    },
    {
      label: GUEST_DASHBOARD_MESSAGES.pastStays,
      value: isLoading ? '—' : String(completedCount).padStart(2, '0'),
      icon: BedDouble,
    },
    {
      label: GUEST_DASHBOARD_MESSAGES.totalSpent,
      value: isLoading ? '—' : formatNgn(totalSpent),
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="guest-page-container pb-24 lg:pb-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#0D0F2B]">
          {user?.fullName
            ? `Welcome back, ${user.fullName.split(' ')[0]}!`
            : GUEST_DASHBOARD_MESSAGES.welcomeTitle}
        </h1>
        <p className="text-[14px] text-[#64748B] mt-0.5">
          {GUEST_DASHBOARD_MESSAGES.welcomeSubtitle}
        </p>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="guest-stat-card">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B] leading-tight">
                {label}
              </p>
              <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
                <Icon size={16} className="text-[#020887]" />
              </div>
            </div>
            <p className="text-[22px] md:text-[28px] font-bold text-[#0D0F2B] leading-none truncate">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bookings Table ──────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#E2E8F0]">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[15px] font-semibold text-[#0D0F2B]">
            {GUEST_DASHBOARD_MESSAGES.recentBookingsTitle}
          </h2>
          <button className="guest-table-action-btn">
            <Download size={14} />
            <span className="hidden sm:inline">{GUEST_DASHBOARD_MESSAGES.exportPdf}</span>
          </button>
        </div>

        {/* Filter tabs — flex-1 on each tab so they share the row equally,
            no overflow needed and no scrollbar on mobile */}
        <div className="flex border-b border-[#E2E8F0]">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-3.5 text-[13px] font-medium border-b-2 transition-colors -mb-px text-center ${
                activeTab === id
                  ? 'border-[#020887] text-[#020887]'
                  : 'border-transparent text-[#64748B] hover:text-[#0D0F2B]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-[#020887]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[14px] text-[#94A3B8]">No bookings found.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    {[
                      GUEST_DASHBOARD_MESSAGES.colBookingId,
                      GUEST_DASHBOARD_MESSAGES.colRoomType,
                      GUEST_DASHBOARD_MESSAGES.colDates,
                      GUEST_DASHBOARD_MESSAGES.colAmount,
                      GUEST_DASHBOARD_MESSAGES.colStatus,
                      GUEST_DASHBOARD_MESSAGES.colActions,
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filtered.map((booking) => {
                    const status = mapBookingStatus(booking.status);
                    return (
                      <tr key={booking.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-5 py-4 text-[13px] font-semibold text-[#64748B]">
                          #{booking.bookingRef}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[14px] font-semibold text-[#0D0F2B]">
                            {booking.room.name}
                          </p>
                          <p className="text-[12px] text-[#94A3B8]">{booking.room.type}</p>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-[#64748B] whitespace-nowrap">
                          {formatBookingDate(booking.checkIn)} –{' '}
                          {formatBookingDate(booking.checkOut)}
                        </td>
                        <td className="px-5 py-4 text-[14px] font-semibold text-[#0D0F2B] whitespace-nowrap">
                          {formatNgn(booking.totalAmount)}
                        </td>
                        <td className="px-5 py-4">
                          <BookingStatusBadge status={status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <BookingActionLink
                              status={status}
                              bookingId={booking.id}
                              onViewDetails={() => setSelectedBooking(booking)}
                            />
                            <CancelBookingButton bookingId={booking.id} status={status} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#F1F5F9]">
              {filtered.map((booking) => {
                const status = mapBookingStatus(booking.status);
                return (
                  <div key={booking.id} className="px-4 py-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wide mb-0.5">
                          #{booking.bookingRef}
                        </p>
                        <p className="text-[15px] font-bold text-[#0D0F2B]">
                          {booking.room.name}
                        </p>
                      </div>
                      <BookingStatusBadge status={status} />
                    </div>
                    <p className="text-[13px] text-[#64748B]">
                      {formatBookingDate(booking.checkIn)} –{' '}
                      {formatBookingDate(booking.checkOut)}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[16px] font-bold text-[#0D0F2B]">
                        {formatNgn(booking.totalAmount)}
                      </p>
                      <div className="flex items-center gap-3">
                        <BookingActionLink
                          status={status}
                          bookingId={booking.id}
                          onViewDetails={() => setSelectedBooking(booking)}
                        />
                        <CancelBookingButton bookingId={booking.id} status={status} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
          <p className="text-[13px] text-[#64748B]">
            {GUEST_DASHBOARD_MESSAGES.showingOf} {filtered.length}{' '}
            {GUEST_DASHBOARD_MESSAGES.ofLabel} {bookings?.length ?? 0}{' '}
            {GUEST_DASHBOARD_MESSAGES.bookingsLabel}
          </p>
          <div className="flex items-center gap-1">
            <button className="guest-page-btn"><ChevronLeft size={14} /></button>
            <button className="guest-page-btn guest-page-btn-active">1</button>
            <button className="guest-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* ── Bottom Summary ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {[
          { icon: BedDouble,        label: GUEST_DASHBOARD_MESSAGES.totalStays,    value: isLoading ? '—' : String(completedCount) },
          { icon: CircleDollarSign, label: GUEST_DASHBOARD_MESSAGES.totalSpent,    value: isLoading ? '—' : formatNgn(totalSpent) },
          { icon: Star,             label: GUEST_DASHBOARD_MESSAGES.loyaltyStatus, value: GUEST_DASHBOARD_MESSAGES.goldMember },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-lg border border-[#E2E8F0] p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
              <Icon size={20} className="text-[#020887]" />
            </div>
            <div>
              <p className="text-[13px] text-[#64748B]">{label}</p>
              <p className="text-[18px] font-bold text-[#0D0F2B]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Booking Detail Drawer ─────────────────────────── */}
      {selectedBooking && (
        <BookingDetailDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
