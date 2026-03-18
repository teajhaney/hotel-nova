'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, BedDouble, Tag, Download, SlidersHorizontal, ChevronLeft, ChevronRight, Plus, ConciergeBell } from 'lucide-react';
import { BookingStatusBadge } from '@/components/guest/BookingStatusBadge';
import { BookingActionLink } from '@/components/guest/BookingActionLink';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { GUEST_BOOKINGS } from '@/constants/dummyData';
import { HOME_IMAGES, OFFER_IMAGES } from '@/constants/images';
import { formatNgn, formatBookingDate } from '@/utils/format';

const STATS = [
  { label: GUEST_DASHBOARD_MESSAGES.upcomingStays, value: '02', sub: GUEST_DASHBOARD_MESSAGES.nextCheckIn, subColor: 'text-[#10B981]', icon: CalendarDays },
  { label: GUEST_DASHBOARD_MESSAGES.pastStays, value: '14', sub: GUEST_DASHBOARD_MESSAGES.totalNights, subColor: 'text-[#64748B]', icon: BedDouble },
  { label: GUEST_DASHBOARD_MESSAGES.rewardsPoints, value: '4,250', sub: GUEST_DASHBOARD_MESSAGES.tierLabel, subColor: 'text-[#64748B]', icon: Tag },
];

const PROMO_OFFERS = [
  { badge: GUEST_DASHBOARD_MESSAGES.exclusiveOffer, title: GUEST_DASHBOARD_MESSAGES.offerTitle1, image: OFFER_IMAGES.spaRetreat },
  { badge: GUEST_DASHBOARD_MESSAGES.memberPerk, title: GUEST_DASHBOARD_MESSAGES.offerTitle2, image: HOME_IMAGES.amenities.spa },
];

const UPCOMING_BOOKINGS = GUEST_BOOKINGS.filter(b => b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'pending');

export default function GuestDashboardPage() {
  return (
    <div className="guest-page-container">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#0D0F2B] leading-tight">
            {GUEST_DASHBOARD_MESSAGES.welcomeTitle}
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">{GUEST_DASHBOARD_MESSAGES.welcomeSubtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#020887]">{GUEST_DASHBOARD_MESSAGES.membershipLabel}</p>
            <p className="text-[14px] font-bold text-[#0D0F2B]">{GUEST_DASHBOARD_MESSAGES.memberIdPrefix} #GO-4822</p>
          </div>
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#E2E8F0] shrink-0">
            <Image src={HOME_IMAGES.amenities.spa} alt="Guest avatar" fill className="object-cover" sizes="48px" />
          </div>
        </div>
      </div>

      {/* ── Stats Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(({ label, value, sub, subColor, icon: Icon }) => (
          <div key={label} className="guest-stat-card">
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748B]">{label}</p>
              <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] flex items-center justify-center shrink-0">
                <Icon size={16} className="text-[#020887]" />
              </div>
            </div>
            <p className="text-[28px] md:text-[32px] font-bold text-[#0D0F2B] leading-none">{value}</p>
            <p className={`text-[12px] mt-1.5 ${subColor}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Mobile: Upcoming Bookings ───────────────────────── */}
      <div className="lg:hidden mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-[#0D0F2B]">{GUEST_DASHBOARD_MESSAGES.upcomingBookings}</h2>
          <Link href="/dashboard/guest/history" className="text-[13px] font-semibold text-[#020887] hover:underline">
            {GUEST_DASHBOARD_MESSAGES.viewAll}
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {UPCOMING_BOOKINGS.slice(0, 2).map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden flex gap-3 p-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                <Image src={booking.image} alt={booking.roomType} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <BookingStatusBadge status={booking.status} />
                </div>
                <p className="text-[14px] font-semibold text-[#0D0F2B] truncate">{booking.roomType}</p>
                <p className="text-[12px] text-[#64748B]">{formatBookingDate(booking.checkIn)} · {formatBookingDate(booking.checkOut)}</p>
                <BookingActionLink status={booking.status} bookingId={booking.id} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile: Quick Actions ───────────────────────────── */}
      <div className="lg:hidden flex gap-3 mb-6">
        <Link href="/book" className="flex-1 h-11 rounded-lg bg-[#020887] text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-[#38369A] transition-colors">
          <Plus size={16} /> {GUEST_DASHBOARD_MESSAGES.newStay}
        </Link>
        <button className="flex-1 h-11 rounded-lg border border-[#E2E8F0] text-[#0D0F2B] text-[14px] font-semibold flex items-center justify-center gap-2 hover:border-[#020887] transition-colors">
          <ConciergeBell size={16} /> {GUEST_DASHBOARD_MESSAGES.services}
        </button>
      </div>

      {/* ── Recent Bookings Table ───────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] mb-6">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[16px] font-bold text-[#0D0F2B]">{GUEST_DASHBOARD_MESSAGES.recentBookingsTitle}</h2>
          <div className="flex items-center gap-2">
            <button className="guest-table-action-btn">
              <Download size={14} />
              <span className="hidden sm:inline">{GUEST_DASHBOARD_MESSAGES.exportPdf}</span>
            </button>
            <button className="guest-table-action-btn">
              <SlidersHorizontal size={14} />
              <span>{GUEST_DASHBOARD_MESSAGES.filter}</span>
            </button>
          </div>
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
                ].map((col) => (
                  <th key={col} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {GUEST_BOOKINGS.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-5 py-4 text-[13px] font-semibold text-[#64748B]">#{booking.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-[14px] font-semibold text-[#0D0F2B]">{booking.roomType}</p>
                    <p className="text-[12px] text-[#94A3B8]">{booking.roomSubtype}</p>
                  </td>
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
          {GUEST_BOOKINGS.map((booking) => (
            <div key={booking.id} className="px-4 py-4 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-[#94A3B8] font-semibold uppercase tracking-wide">#{booking.id}</p>
                  <p className="text-[14px] font-bold text-[#0D0F2B]">{booking.roomType}</p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="text-[12px] text-[#64748B]">{formatBookingDate(booking.checkIn)} - {formatBookingDate(booking.checkOut)}</p>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-bold text-[#0D0F2B]">{formatNgn(booking.amount)}</p>
                <BookingActionLink status={booking.status} bookingId={booking.id} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E2E8F0]">
          <p className="text-[13px] text-[#64748B]">
            {GUEST_DASHBOARD_MESSAGES.showingOf} {GUEST_BOOKINGS.length} {GUEST_DASHBOARD_MESSAGES.ofLabel} {GUEST_BOOKINGS.length} {GUEST_DASHBOARD_MESSAGES.bookingsLabel}
          </p>
          <div className="flex items-center gap-1">
            <button className="guest-page-btn"><ChevronLeft size={14} /></button>
            <button className="guest-page-btn guest-page-btn-active">1</button>
            <button className="guest-page-btn">2</button>
            <button className="guest-page-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* ── Promo Offers ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20 lg:pb-6">
        {PROMO_OFFERS.map(({ badge, title, image }) => (
          <div key={title} className="relative rounded-lg overflow-hidden h-40 sm:h-48 cursor-pointer group">
            <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <span className="self-start px-2.5 py-1 rounded-sm bg-[#020887] text-white text-[10px] font-bold uppercase tracking-[0.08em]">
                {badge}
              </span>
              <p className="text-white text-[18px] font-bold leading-tight">{title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
