'use client';

import { useState } from 'react';
import {
  BedDouble,
  Wallet,
  CalendarDays,
  Star,
  Calendar,
  Zap,
} from 'lucide-react';
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
  Legend,
} from 'recharts';

type TimeRange = 'Last 7 Days' | 'Last 30 Days' | 'Year to Date' | 'Custom';

const occupancyData = [
  { week: 'Week 1', value: 78 },
  { week: 'Week 2', value: 85 },
  { week: 'Week 3', value: 82 },
  { week: 'Week 4', value: 90 },
];

const revenueData = [
  { month: 'Jan', current: 1800000, target: 2000000 },
  { month: 'Feb', current: 2100000, target: 2000000 },
  { month: 'Mar', current: 1950000, target: 2200000 },
  { month: 'Apr', current: 2400000, target: 2200000 },
  { month: 'May', current: 2200000, target: 2400000 },
  { month: 'Jun', current: 2480000, target: 2400000 },
];

const HIGH_VALUE_BOOKINGS = [
  { guest: 'Chidi Eze', room: 'Presidential Suite', dates: 'Mar 18 – Mar 25', amount: 4200000, status: 'Checked In' },
  { guest: 'Ngozi Obi', room: 'Grand Suite', dates: 'Mar 15 – Mar 18', amount: 2550000, status: 'Checked Out' },
  { guest: 'Ifeoma Nwosu', room: 'Presidential Suite', dates: 'Mar 14 – Mar 17', amount: 1800000, status: 'Checked Out' },
  { guest: 'Zainab Musa', room: 'Executive Corner', dates: 'Mar 21 – Mar 24', amount: 960000, status: 'Confirmed' },
  { guest: 'Amara Okonkwo', room: 'Deluxe King', dates: 'Mar 18 – Mar 22', amount: 700000, status: 'Confirmed' },
];

const AVATAR_COLORS = ['#DBEAFE', '#D1FAE5', '#FFEDD5', '#EDE9FE', '#FEE2E2'];
const AVATAR_TEXT = ['#1D4ED8', '#10B981', '#F97316', '#7C3AED', '#DC2626'];

function formatRevenue(val: number) {
  return `₦${(val / 1000000).toFixed(1)}M`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmed: 'admin-badge-confirmed',
    'Checked In': 'admin-badge-checked-in',
    'Checked Out': 'admin-badge-checked-out',
  };
  return <span className={map[status] ?? 'admin-badge-pending'}>{status}</span>;
}

const STAT_CARDS = [
  { label: 'Total Occupancy', value: '84.2%', change: '+5.2%', positive: true, icon: BedDouble, iconBg: 'bg-[#D1FAE5]', iconColor: 'text-[#10B981]' },
  { label: 'Average Revenue', value: '₦2.48M', change: '-2.1%', positive: false, icon: Wallet, iconBg: 'bg-[#EDE9FE]', iconColor: 'text-[#7C3AED]' },
  { label: 'Active Bookings', value: '128', change: '+12%', positive: true, icon: CalendarDays, iconBg: 'bg-[#DBEAFE]', iconColor: 'text-[#1D4ED8]' },
  { label: 'Guest Satisfaction', value: '4.8/5', change: '+0.4%', positive: true, icon: Star, iconBg: 'bg-[#FEF3C7]', iconColor: 'text-[#F59E0B]' },
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('Last 30 Days');
  const ranges: TimeRange[] = ['Last 7 Days', 'Last 30 Days', 'Year to Date', 'Custom'];

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">Dashboard Analytics</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Detailed performance metrics and insights</p>
        </div>
        {/* Time range filters */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg flex-wrap">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                timeRange === r ? 'bg-[#020887] text-white' : 'text-[#64748B] hover:text-[#0D0F2B]'
              }`}
            >
              {r === 'Custom' && <Calendar size={13} />}
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {STAT_CARDS.map(({ label, value, change, positive, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="admin-stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon size={20} className={iconColor} strokeWidth={1.8} />
              </div>
              <span className={`text-[12px] font-semibold ${positive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {change}
              </span>
            </div>
            <p className="text-[22px] font-bold text-[#0D0F2B] leading-tight">{value}</p>
            <p className="text-[13px] text-[#64748B] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">
        {/* Occupancy Trends */}
        <div className="admin-card p-5">
          <h2 className="text-[15px] font-semibold text-[#0D0F2B] mb-4">Occupancy Trends</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={occupancyData} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="analyticsOccupancyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#020887" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#020887" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                formatter={(val) => [`${val}%`, 'Occupancy']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#020887"
                strokeWidth={2}
                fill="url(#analyticsOccupancyGrad)"
                dot={{ r: 4, fill: '#020887', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Month */}
        <div className="admin-card p-5">
          <h2 className="text-[15px] font-semibold text-[#0D0F2B] mb-4">Revenue by Month</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={formatRevenue} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                formatter={(val) => [typeof val === 'number' ? formatRevenue(val) : val]}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="current" name="CURRENT" fill="#020887" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="TARGET" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* High-value bookings table */}
        <div className="admin-card overflow-hidden lg:flex-[65]">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-[15px] font-semibold text-[#0D0F2B]">Recent High-Value Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="admin-table-th">Guest</th>
                  <th className="admin-table-th">Room Type</th>
                  <th className="admin-table-th">Stay Dates</th>
                  <th className="admin-table-th">Amount</th>
                  <th className="admin-table-th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {HIGH_VALUE_BOOKINGS.map((b, i) => (
                  <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          <span className="text-[10px] font-bold" style={{ color: AVATAR_TEXT[i % AVATAR_TEXT.length] }}>
                            {b.guest.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <span className="text-[13px] font-medium text-[#0D0F2B] whitespace-nowrap">{b.guest}</span>
                      </div>
                    </td>
                    <td className="admin-table-td text-[13px] text-[#64748B] whitespace-nowrap">{b.room}</td>
                    <td className="admin-table-td text-[12px] text-[#64748B] whitespace-nowrap">{b.dates}</td>
                    <td className="admin-table-td text-[13px] font-semibold text-[#0D0F2B] whitespace-nowrap">
                      ₦{b.amount.toLocaleString()}
                    </td>
                    <td className="admin-table-td">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue tip card */}
        <div className="lg:flex-[35] bg-[#020887] rounded-xl p-6 flex flex-col justify-between min-h-[260px]">
          <div>
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center mb-4">
              <Zap size={20} className="text-white" />
            </div>
            <h3 className="text-[17px] font-bold text-white mb-3">Maximize Revenue for Q4</h3>
            <p className="text-[13px] text-white/75 leading-relaxed">
              Based on current occupancy trends, you can increase revenue by targeting the 16% vacancy gap on weeknights. AI-powered pricing suggestions are available.
            </p>
          </div>
          <button className="mt-5 h-10 rounded-lg bg-white text-[#020887] text-[13px] font-semibold hover:bg-white/90 transition-colors">
            View Suggestions
          </button>
        </div>
      </div>
    </div>
  );
}
