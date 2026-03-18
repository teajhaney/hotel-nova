'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronLeft, ChevronRight, BedDouble, CircleDollarSign, Star } from 'lucide-react';
import { BookingStatusBadge } from '@/components/guest/BookingStatusBadge';
import { BookingActionLink } from '@/components/guest/BookingActionLink';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { BOOKING_HISTORY } from '@/constants/dummyData';
import { formatNgn, formatBookingDate } from '@/utils/format';
import type { BookingStatus } from '@/type/type';

type FilterTab = 'all' | 'completed' | 'cancelled';

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: GUEST_DASHBOARD_MESSAGES.tabAll },
  { id: 'completed', label: GUEST_DASHBOARD_MESSAGES.tabCompleted },
  { id: 'cancelled', label: GUEST_DASHBOARD_MESSAGES.tabCancelled },
];

const BOTTOM_STATS = [
  { icon: BedDouble, label: GUEST_DASHBOARD_MESSAGES.totalStays, value: '12' },
  { icon: CircleDollarSign, label: GUEST_DASHBOARD_MESSAGES.totalSpent, value: '₦1,704,000' },
  { icon: Star, label: GUEST_DASHBOARD_MESSAGES.loyaltyStatus, value: GUEST_DASHBOARD_MESSAGES.goldMember },
];

const STATUS_MAP: Record<FilterTab, BookingStatus[]> = {
  all: ['confirmed', 'checked-in', 'checked-out', 'cancelled', 'pending'],
  completed: ['checked-out'],
  cancelled: ['cancelled'],
};

export default function BookingHistoryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filtered = BOOKING_HISTORY.filter(b => STATUS_MAP[activeTab].includes(b.status));

  return (
    <div className="guest-page-container pb-24 lg:pb-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[24px] md:text-[28px] font-bold text-[#0D0F2B]">{GUEST_DASHBOARD_MESSAGES.historyTitle}</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">{GUEST_DASHBOARD_MESSAGES.historySubtitle}</p>
        </div>
        <button className="guest-table-action-btn shrink-0">
          <SlidersHorizontal size={14} />
          {GUEST_DASHBOARD_MESSAGES.filter}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#E2E8F0] mb-6">
        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0] px-5">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-3.5 px-1 mr-6 text-[14px] font-medium border-b-2 transition-colors -mb-px ${
                activeTab === id
                  ? 'border-[#020887] text-[#020887]'
                  : 'border-transparent text-[#64748B] hover:text-[#0D0F2B]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

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
                ].map(col => (
                  <th key={col} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 text-[13px] font-semibold text-[#64748B]">#{booking.id}</td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-[#0D0F2B]">{booking.roomType}</td>
                  <td className="px-5 py-4 text-[13px] text-[#64748B] whitespace-nowrap">
                    {formatBookingDate(booking.checkIn)} - {formatBookingDate(booking.checkOut)}, {new Date(booking.checkOut).getFullYear()}
                  </td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-[#0D0F2B] whitespace-nowrap">
                    {formatNgn(booking.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="px-5 py-4">
                    <BookingActionLink status={booking.status} bookingId={booking.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-[#F1F5F9]">
          {filtered.map((booking) => (
            <div key={booking.id} className="px-4 py-4 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wide mb-0.5">
                    BOOKING ID: #{booking.id}
                  </p>
                  <p className="text-[15px] font-bold text-[#0D0F2B]">{booking.roomType}</p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="text-[13px] text-[#64748B] flex items-center gap-1.5">
                <span>📅</span>
                {formatBookingDate(booking.checkIn)} - {formatBookingDate(booking.checkOut)}, {new Date(booking.checkOut).getFullYear()}
              </p>
              <div className="flex items-center justify-between pt-1">
                <p className="text-[16px] font-bold text-[#0D0F2B]">{formatNgn(booking.amount)}</p>
                <BookingActionLink status={booking.status} bookingId={booking.id} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
          <p className="text-[13px] text-[#64748B]">
            {GUEST_DASHBOARD_MESSAGES.showingOf} {filtered.length} {GUEST_DASHBOARD_MESSAGES.ofLabel} {BOOKING_HISTORY.length} {GUEST_DASHBOARD_MESSAGES.bookingsLabel}
          </p>
          <div className="flex items-center gap-1">
            <button className="guest-page-btn"><ChevronLeft size={14} /></button>
            <button className="guest-page-btn guest-page-btn-active">1</button>
            <button className="guest-page-btn">2</button>
            <button className="guest-page-btn">3</button>
            <button className="guest-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* ── Bottom Stats ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BOTTOM_STATS.map(({ icon: Icon, label, value }) => (
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
    </div>
  );
}
