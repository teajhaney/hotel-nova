'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Download,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  ConciergeBell,
  CalendarDays,
  BedDouble,
  Tag,
  Loader2,
} from 'lucide-react';
import { BookingStatusBadge } from '@/components/guest/BookingStatusBadge';
import { BookingActionLink } from '@/components/guest/BookingActionLink';
import { CancelBookingButton } from '@/components/guest/CancelBookingButton';
import { BookingDetailDrawer } from '@/components/guest/BookingDetailDrawer';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { HOME_IMAGES, OFFER_IMAGES } from '@/constants/images';
import { formatNgn, formatBookingDate } from '@/utils/format';
import { useMyBookings } from '@/hooks/use-bookings';
import { mapBookingStatus } from '@/type/type';
import type { ApiBooking } from '@/type/type';
import { useAuthStore } from '@/stores/auth-store';

const PROMO_OFFERS = [
  {
    badge: GUEST_DASHBOARD_MESSAGES.exclusiveOffer,
    title: GUEST_DASHBOARD_MESSAGES.offerTitle1,
    image: OFFER_IMAGES.spaRetreat,
  },
  {
    badge: GUEST_DASHBOARD_MESSAGES.memberPerk,
    title: GUEST_DASHBOARD_MESSAGES.offerTitle2,
    image: HOME_IMAGES.amenities.spa,
  },
];

export default function GuestDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: bookings, isLoading } = useMyBookings();
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);

  // Derive stats from real booking data
  const upcomingBookings = bookings?.filter((b) => {
    const status = mapBookingStatus(b.status);
    return status === 'confirmed' || status === 'checked-in' || status === 'pending';
  }) ?? [];

  const pastBookings = bookings?.filter((b) => {
    const status = mapBookingStatus(b.status);
    return status === 'checked-out';
  }) ?? [];

  const STATS = [
    {
      label: GUEST_DASHBOARD_MESSAGES.upcomingStays,
      value: isLoading ? '—' : String(upcomingBookings.length).padStart(2, '0'),
      sub: GUEST_DASHBOARD_MESSAGES.nextCheckIn,
      subColor: 'text-[#10B981]',
      icon: CalendarDays,
    },
    {
      label: GUEST_DASHBOARD_MESSAGES.pastStays,
      value: isLoading ? '—' : String(pastBookings.length).padStart(2, '0'),
      sub: GUEST_DASHBOARD_MESSAGES.totalNights,
      subColor: 'text-[#64748B]',
      icon: BedDouble,
    },
    {
      label: GUEST_DASHBOARD_MESSAGES.rewardsPoints,
      value: '—',
      sub: GUEST_DASHBOARD_MESSAGES.tierLabel,
      subColor: 'text-[#64748B]',
      icon: Tag,
    },
  ];

  return (
    <div className="guest-page-container">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#0D0F2B] leading-tight">
            {user?.fullName
              ? `Welcome back, ${user.fullName.split(' ')[0]}!`
              : GUEST_DASHBOARD_MESSAGES.welcomeTitle}
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            {GUEST_DASHBOARD_MESSAGES.welcomeSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#020887]">
              {GUEST_DASHBOARD_MESSAGES.membershipLabel}
            </p>
            <p className="text-[14px] font-bold text-[#0D0F2B]">
              {user?.email ?? '—'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#020887] flex items-center justify-center shrink-0">
            <span className="text-white text-[18px] font-bold">
              {user?.fullName?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(({ label, value, sub, subColor, icon: Icon }) => (
          <div key={label} className="guest-stat-card">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">
                {label}
              </p>
              <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
                <Icon size={16} className="text-[#020887]" />
              </div>
            </div>
            <p className="text-[28px] md:text-[32px] font-bold text-[#0D0F2B] leading-none">
              {value}
            </p>
            <p className={`text-[12px] mt-1.5 ${subColor}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Mobile: Upcoming Bookings ───────────────────────── */}
      <div className="lg:hidden mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-[#0D0F2B]">
            {GUEST_DASHBOARD_MESSAGES.upcomingBookings}
          </h2>
          <Link
            href="/dashboard/guest/history"
            className="text-[13px] font-semibold text-[#020887] hover:underline"
          >
            {GUEST_DASHBOARD_MESSAGES.viewAll}
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[#020887]" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingBookings.slice(0, 2).map((booking) => {
              const status = mapBookingStatus(booking.status);
              const image = booking.room.photos?.[0] ?? '';
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden flex gap-3 p-3"
                >
                  {image && (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                      <Image
                        src={image}
                        alt={booking.room.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <BookingStatusBadge status={status} />
                    </div>
                    <p className="text-[14px] font-semibold text-[#0D0F2B] truncate">
                      {booking.room.name}
                    </p>
                    <p className="text-[12px] text-[#64748B]">
                      {formatBookingDate(booking.checkIn)} ·{' '}
                      {formatBookingDate(booking.checkOut)}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <BookingActionLink status={status} bookingId={booking.id} onViewDetails={() => setSelectedBooking(booking)} />
                      <CancelBookingButton bookingId={booking.id} status={status} />
                    </div>
                  </div>
                </div>
              );
            })}

            {upcomingBookings.length === 0 && (
              <p className="text-[14px] text-[#94A3B8] text-center py-6">
                No upcoming stays.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Mobile: Quick Actions ───────────────────────────── */}
      <div className="lg:hidden flex gap-3 mb-6">
        <Link
          href="/rooms"
          className="flex-1 h-11 rounded-lg bg-[#020887] text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#38369A] transition-colors"
        >
          <Plus size={16} /> {GUEST_DASHBOARD_MESSAGES.newStay}
        </Link>
        <button className="flex-1 h-11 rounded-lg border border-[#E2E8F0] text-[#0D0F2B] text-[14px] font-semibold flex items-center justify-center gap-2 hover:border-[#020887] transition-colors">
          <ConciergeBell size={16} /> {GUEST_DASHBOARD_MESSAGES.services}
        </button>
      </div>

      {/* ── Recent Bookings Table ───────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-bold text-[#0D0F2B]">
            {GUEST_DASHBOARD_MESSAGES.recentBookingsTitle}
          </h2>
          <div className="flex items-center gap-2">
            <button className="guest-table-action-btn">
              <Download size={14} />
              <span className="hidden sm:inline">
                {GUEST_DASHBOARD_MESSAGES.exportPdf}
              </span>
            </button>
            <button className="guest-table-action-btn">
              <SlidersHorizontal size={14} />
              <span>{GUEST_DASHBOARD_MESSAGES.filter}</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-[#020887]" />
          </div>
        ) : bookings && bookings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[14px] text-[#94A3B8]">No bookings yet.</p>
            <Link
              href="/rooms"
              className="mt-3 inline-block text-[14px] font-semibold text-[#020887] hover:underline"
            >
              Book your first stay →
            </Link>
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
                  {bookings?.map((booking) => {
                    const status = mapBookingStatus(booking.status);
                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="px-5 py-4 text-[13px] font-semibold text-[#64748B]">
                          #{booking.bookingRef}
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[14px] font-semibold text-[#0D0F2B]">
                            {booking.room.name}
                          </p>
                          <p className="text-[12px] text-[#94A3B8]">
                            {booking.room.type}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-[#64748B] whitespace-nowrap">
                          {formatBookingDate(booking.checkIn)} -{' '}
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
                            <CancelBookingButton
                              bookingId={booking.id}
                              status={status}
                            />
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
              {bookings?.map((booking) => {
                const status = mapBookingStatus(booking.status);
                return (
                  <div key={booking.id} className="px-4 py-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wide">
                          #{booking.bookingRef}
                        </p>
                        <p className="text-[14px] font-bold text-[#0D0F2B]">
                          {booking.room.name}
                        </p>
                      </div>
                      <BookingStatusBadge status={status} />
                    </div>
                    <p className="text-[12px] text-[#64748B]">
                      {formatBookingDate(booking.checkIn)} -{' '}
                      {formatBookingDate(booking.checkOut)}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] font-bold text-[#0D0F2B]">
                        {formatNgn(booking.totalAmount)}
                      </p>
                      <div className="flex items-center gap-3">
                        <BookingActionLink
                          status={status}
                          bookingId={booking.id}
                          onViewDetails={() => setSelectedBooking(booking)}
                        />
                        <CancelBookingButton
                          bookingId={booking.id}
                          status={status}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
              <p className="text-[13px] text-[#64748B]">
                {GUEST_DASHBOARD_MESSAGES.showingOf} {bookings?.length ?? 0}{' '}
                {GUEST_DASHBOARD_MESSAGES.ofLabel} {bookings?.length ?? 0}{' '}
                {GUEST_DASHBOARD_MESSAGES.bookingsLabel}
              </p>
              <div className="flex items-center gap-1">
                <button className="guest-page-btn">
                  <ChevronLeft size={14} />
                </button>
                <button className="guest-page-btn guest-page-btn-active">1</button>
                <button className="guest-page-btn">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Promo Offers ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20 lg:pb-6">
        {PROMO_OFFERS.map(({ badge, title, image }) => (
          <div
            key={title}
            className="relative rounded-lg overflow-hidden h-40 sm:h-48 cursor-pointer group"
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <span className="self-start px-2.5 py-1 rounded-sm bg-[#020887] text-white text-[10px] font-bold uppercase tracking-[0.08em]">
                {badge}
              </span>
              <p className="text-white text-[18px] font-bold leading-tight">
                {title}
              </p>
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
