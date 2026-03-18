'use client';

import { useState } from 'react';
import {
  Plus,
  CalendarDays,
  ChevronDown,
  Download,
  Printer,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const BOOKINGS = [
  { id: 'BK-2026-0182', guest: 'Amara Okonkwo', room: 'Deluxe King 302', checkIn: 'Mar 18, 2026', checkOut: 'Mar 22, 2026', amount: 700000, status: 'Confirmed' },
  { id: 'BK-2026-0181', guest: 'Chidi Eze', room: 'Presidential Suite 501', checkIn: 'Mar 18, 2026', checkOut: 'Mar 25, 2026', amount: 4200000, status: 'Checked In' },
  { id: 'BK-2026-0180', guest: 'Fatima Al-Hassan', room: 'Executive View 410', checkIn: 'Mar 19, 2026', checkOut: 'Mar 21, 2026', amount: 550000, status: 'Pending' },
  { id: 'BK-2026-0179', guest: 'Emmanuel Adeyemi', room: 'Standard Double 215', checkIn: 'Mar 17, 2026', checkOut: 'Mar 18, 2026', amount: 90000, status: 'Checked Out' },
  { id: 'BK-2026-0178', guest: 'Ngozi Obi', room: 'Grand Suite 601', checkIn: 'Mar 15, 2026', checkOut: 'Mar 18, 2026', amount: 2550000, status: 'Confirmed' },
  { id: 'BK-2026-0177', guest: 'Bola Akin', room: 'Deluxe Twin 118', checkIn: 'Mar 20, 2026', checkOut: 'Mar 23, 2026', amount: 465000, status: 'Pending' },
  { id: 'BK-2026-0176', guest: 'Yemi Fashola', room: 'Standard Single 210', checkIn: 'Mar 16, 2026', checkOut: 'Mar 17, 2026', amount: 75000, status: 'Cancelled' },
  { id: 'BK-2026-0175', guest: 'Zainab Musa', room: 'Executive Corner 315', checkIn: 'Mar 21, 2026', checkOut: 'Mar 24, 2026', amount: 960000, status: 'Confirmed' },
  { id: 'BK-2026-0174', guest: 'Tunde Bakare', room: 'Deluxe King 302', checkIn: 'Mar 22, 2026', checkOut: 'Mar 26, 2026', amount: 700000, status: 'Pending' },
  { id: 'BK-2026-0173', guest: 'Ifeoma Nwosu', room: 'Presidential Suite 501', checkIn: 'Mar 14, 2026', checkOut: 'Mar 17, 2026', amount: 1800000, status: 'Checked Out' },
];

const AVATAR_COLORS = ['#EEF0FF', '#D1FAE5', '#FFEDD5', '#DBEAFE', '#FEE2E2', '#FEF3C7', '#F3E8FF', '#ECFDF5', '#FFF7ED', '#EFF6FF'];
const AVATAR_TEXT_COLORS = ['#020887', '#10B981', '#F97316', '#1D4ED8', '#DC2626', '#B45309', '#7C3AED', '#059669', '#EA580C', '#2563EB'];

const MINI_STATS = [
  { label: 'Total Bookings', value: '1,284', change: '+12%', positive: true },
  { label: 'Pending', value: '45', change: '-5%', positive: false },
  { label: 'Checked-In', value: '182', change: '+8%', positive: true },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmed: 'admin-badge-confirmed',
    Pending: 'admin-badge-pending',
    'Checked In': 'admin-badge-checked-in',
    'Checked Out': 'admin-badge-checked-out',
    Cancelled: 'admin-badge-cancelled',
  };
  return <span className={map[status] ?? 'admin-badge-pending'}>{status}</span>;
}

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [typeFilter, setTypeFilter] = useState('All Room Types');

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">All Bookings</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Manage and track all hotel reservations</p>
        </div>
        <button className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors">
          <Plus size={16} />
          New Booking
        </button>
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {MINI_STATS.map(({ label, value, change, positive }) => (
          <div key={label} className="admin-stat-card">
            <p className="text-[13px] text-[#64748B] mb-1">{label}</p>
            <p className="text-[22px] font-bold text-[#0D0F2B]">{value}</p>
            <div className={`flex items-center gap-1 mt-1 text-[12px] font-medium ${positive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {change} this month
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#64748B] cursor-pointer">
          <CalendarDays size={15} />
          <span>Oct 12, 2023 – Oct 19, 2023</span>
          <ChevronDown size={14} />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0D0F2B] outline-none appearance-none cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Checked In</option>
            <option>Checked Out</option>
            <option>Cancelled</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 pl-3 pr-8 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0D0F2B] outline-none appearance-none cursor-pointer"
          >
            <option>All Room Types</option>
            <option>Deluxe</option>
            <option>Suite</option>
            <option>Standard</option>
            <option>Executive</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="admin-action-btn" aria-label="Download">
            <Download size={15} />
          </button>
          <button className="admin-action-btn" aria-label="Print">
            <Printer size={15} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="admin-table-th">Booking ID</th>
                <th className="admin-table-th">Guest Name</th>
                <th className="admin-table-th">Room</th>
                <th className="admin-table-th">Check-in / Out</th>
                <th className="admin-table-th">Amount</th>
                <th className="admin-table-th">Status</th>
                <th className="admin-table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {BOOKINGS.map((b, i) => (
                <tr key={b.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="admin-table-td">
                    <span className="text-[13px] font-medium text-[#020887]">{b.id}</span>
                  </td>
                  <td className="admin-table-td">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      >
                        <span className="text-[11px] font-bold" style={{ color: AVATAR_TEXT_COLORS[i % AVATAR_TEXT_COLORS.length] }}>
                          {b.guest.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-[13px] font-medium text-[#0D0F2B]">{b.guest}</span>
                    </div>
                  </td>
                  <td className="admin-table-td text-[13px] text-[#64748B]">{b.room}</td>
                  <td className="admin-table-td">
                    <p className="text-[12px] text-[#0D0F2B]">{b.checkIn}</p>
                    <p className="text-[12px] text-[#94A3B8]">{b.checkOut}</p>
                  </td>
                  <td className="admin-table-td text-[13px] font-medium text-[#0D0F2B]">
                    ₦{b.amount.toLocaleString()}
                  </td>
                  <td className="admin-table-td">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="admin-table-td">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors" aria-label="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors" aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-[13px] text-[#64748B]">Showing 1–10 of 1,284 bookings</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 129].map((p, i) => (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                  p === 1
                    ? 'bg-[#020887] text-white'
                    : 'text-[#64748B] hover:bg-[#EEF0FF] hover:text-[#020887]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
