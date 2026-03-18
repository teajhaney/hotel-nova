'use client';

import {
  BedDouble,
  LogIn,
  LogOut,
  Wallet,
  Pencil,
  Trash2,
} from 'lucide-react';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';

const M = ADMIN_DASHBOARD_MESSAGES;
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const occupancyData = [
  { day: 'Mon', value: 72 },
  { day: 'Tue', value: 80 },
  { day: 'Wed', value: 76 },
  { day: 'Thu', value: 88 },
  { day: 'Fri', value: 92 },
  { day: 'Sat', value: 95 },
  { day: 'Sun', value: 84 },
];

const revenueData = [
  { month: 'Jan', value: 1800000 },
  { month: 'Feb', value: 2100000 },
  { month: 'Mar', value: 1950000 },
  { month: 'Apr', value: 2400000 },
  { month: 'May', value: 2200000 },
  { month: 'Jun', value: 2450000 },
];

const UPCOMING_CHECKINS = [
  { guest: 'Amara Okonkwo', room: 'Deluxe King', arrival: 'Mar 18, 2026', status: 'Confirmed' },
  { guest: 'Chidi Eze', room: 'Presidential Suite', arrival: 'Mar 18, 2026', status: 'Pending' },
  { guest: 'Fatima Al-Hassan', room: 'Executive View', arrival: 'Mar 18, 2026', status: 'Confirmed' },
  { guest: 'Emmanuel Adeyemi', room: 'Standard Double', arrival: 'Mar 18, 2026', status: 'Pending' },
  { guest: 'Ngozi Obi', room: 'Grand Suite', arrival: 'Mar 18, 2026', status: 'Confirmed' },
];

const STAT_CARDS = [
  {
    label: M.statOccupancyRate,
    value: '84%',
    change: '+5.2%',
    note: 'Target: 90%',
    icon: BedDouble,
    iconBg: 'bg-[#D1FAE5]',
    iconColor: 'text-[#10B981]',
    changeColor: 'text-[#10B981]',
  },
  {
    label: M.statTodayCheckins,
    value: '12',
    change: '+2',
    note: '4 arriving after 6 PM',
    icon: LogIn,
    iconBg: 'bg-[#DBEAFE]',
    iconColor: 'text-[#1D4ED8]',
    changeColor: 'text-[#10B981]',
  },
  {
    label: M.statTodayCheckouts,
    value: '8',
    change: '0',
    note: '6 pending inspection',
    icon: LogOut,
    iconBg: 'bg-[#FFEDD5]',
    iconColor: 'text-[#F97316]',
    changeColor: 'text-[#64748B]',
  },
  {
    label: M.statDailyRevenue,
    value: '₦2.45M',
    change: '+12.4%',
    note: 'Excludes pending bar tabs',
    icon: Wallet,
    iconBg: 'bg-[#EDE9FE]',
    iconColor: 'text-[#7C3AED]',
    changeColor: 'text-[#10B981]',
  },
];

function formatRevenue(val: number) {
  return `₦${(val / 1000000).toFixed(1)}M`;
}

export default function AdminOverviewPage() {
  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[24px] font-bold text-[#0D0F2B]">{M.overviewTitle}</h1>
        <p className="text-[14px] text-[#64748B] mt-1">{M.overviewSubtitle}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {STAT_CARDS.map(({ label, value, change, note, icon: Icon, iconBg, iconColor, changeColor }) => (
          <div key={label} className="admin-stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon size={20} className={iconColor} strokeWidth={1.8} />
              </div>
              <span className={`text-[12px] font-semibold ${changeColor}`}>{change}</span>
            </div>
            <p className="text-[22px] font-bold text-[#0D0F2B] leading-tight">{value}</p>
            <p className="text-[13px] font-medium text-[#0D0F2B] mt-0.5">{label}</p>
            <p className="text-[11px] text-[#94A3B8] mt-1">{note}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
        {/* Occupancy Trends */}
        <div className="admin-card p-5">
          <h2 className="text-[15px] font-semibold text-[#0D0F2B] mb-4">{M.chartOccupancyTitle}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={occupancyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#020887" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#020887" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                formatter={(val) => [`${val}%`, M.tooltipOccupancy]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#020887"
                strokeWidth={2}
                fill="url(#occupancyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="admin-card p-5">
          <h2 className="text-[15px] font-semibold text-[#0D0F2B] mb-4">{M.chartRevenueTitle}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={formatRevenue} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                formatter={(val) => [typeof val === 'number' ? formatRevenue(val) : val, M.tooltipRevenue]}
              />
              <Bar dataKey="value" fill="#020887" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Check-ins Table */}
      <div className="admin-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-[15px] font-semibold text-[#0D0F2B]">{M.upcomingCheckinsTitle}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="admin-table-th">{M.overviewColGuestName}</th>
                <th className="admin-table-th">{M.overviewColRoomType}</th>
                <th className="admin-table-th">{M.overviewColArrival}</th>
                <th className="admin-table-th">{M.overviewColStatus}</th>
                <th className="admin-table-th">{M.overviewColAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {UPCOMING_CHECKINS.map((row, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="admin-table-td">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: ['#EEF0FF', '#D1FAE5', '#FFEDD5', '#DBEAFE', '#FEE2E2'][i % 5] }}
                      >
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: ['#020887', '#10B981', '#F97316', '#1D4ED8', '#DC2626'][i % 5] }}
                        >
                          {row.guest.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-[13px] font-medium text-[#0D0F2B]">{row.guest}</span>
                    </div>
                  </td>
                  <td className="admin-table-td text-[13px] text-[#64748B]">{row.room}</td>
                  <td className="admin-table-td text-[13px] text-[#64748B]">{row.arrival}</td>
                  <td className="admin-table-td">
                    <span className={row.status === 'Confirmed' ? 'admin-badge-confirmed' : 'admin-badge-pending'}>
                      {row.status}
                    </span>
                  </td>
                  <td className="admin-table-td">
                    <button
                      className={`h-8 px-3 rounded-lg text-[12px] font-medium transition-colors ${
                        row.status === 'Confirmed'
                          ? 'bg-[#020887] text-white hover:bg-[#38369A]'
                          : 'bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A]'
                      }`}
                    >
                      {row.status === 'Confirmed' ? M.actionCheckin : M.actionApprove}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
