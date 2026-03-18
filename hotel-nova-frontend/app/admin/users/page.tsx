'use client';

import { useState } from 'react';
import {
  Plus,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Pencil,
  UserX,
  UserCheck,
} from 'lucide-react';

const USERS = [
  { name: 'Amara Okonkwo', email: 'amara.okonkwo@email.com', role: 'GUEST', status: 'Active', joined: 'Jan 12, 2026' },
  { name: 'John Doe', email: 'john.doe@grandoasis.com', role: 'ADMIN', status: 'Active', joined: 'Nov 5, 2024' },
  { name: 'Chidi Eze', email: 'chidi.eze@email.com', role: 'GUEST', status: 'Active', joined: 'Feb 3, 2026' },
  { name: 'Sara Williams', email: 'sara.w@grandoasis.com', role: 'STAFF', status: 'Active', joined: 'Aug 20, 2025' },
  { name: 'Fatima Al-Hassan', email: 'fatima.alh@email.com', role: 'GUEST', status: 'Inactive', joined: 'Mar 1, 2026' },
  { name: 'Emmanuel Adeyemi', email: 'emm.adeyemi@email.com', role: 'GUEST', status: 'Active', joined: 'Dec 14, 2025' },
  { name: 'Michael Okafor', email: 'mike.ok@grandoasis.com', role: 'STAFF', status: 'Active', joined: 'Jul 8, 2025' },
  { name: 'Ngozi Obi', email: 'ngozi.obi@email.com', role: 'GUEST', status: 'Inactive', joined: 'Mar 10, 2026' },
  { name: 'Bola Akin', email: 'bola.akin@email.com', role: 'GUEST', status: 'Active', joined: 'Feb 18, 2026' },
  { name: 'Zainab Musa', email: 'zainab.musa@email.com', role: 'GUEST', status: 'Active', joined: 'Mar 5, 2026' },
];

const AVATAR_COLORS = ['#EEF0FF', '#D1FAE5', '#FFEDD5', '#DBEAFE', '#FEE2E2', '#FEF3C7', '#F3E8FF', '#ECFDF5'];
const AVATAR_TEXT = ['#020887', '#10B981', '#F97316', '#1D4ED8', '#DC2626', '#B45309', '#7C3AED', '#059669'];

const ROLE_BADGE: Record<string, string> = {
  GUEST: 'bg-[#F1F5F9] text-[#64748B]',
  ADMIN: 'bg-[#EEF0FF] text-[#020887]',
  STAFF: 'bg-[#F0FDF4] text-[#16A34A]',
};

const STATS = [
  { label: 'Total Users', value: '1,284', change: '+12%', positive: true },
  { label: 'Active Guests', value: '856', change: '+5%', positive: true },
  { label: 'Admins / Staff', value: '42', change: '-2%', positive: false },
];

export default function AdminUsersPage() {
  const [activeUsers, setActiveUsers] = useState<Set<string>>(
    new Set(USERS.filter((u) => u.status === 'Active').map((u) => u.email))
  );

  const toggle = (email: string) => {
    setActiveUsers((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">Users Management</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Manage guest accounts and staff permissions</p>
        </div>
        <button className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors">
          <Plus size={16} />
          Add New User
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(({ label, value, change, positive }) => (
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

      {/* Table card */}
      <div className="admin-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-[#0D0F2B]">User Directory</h2>
          <div className="flex items-center gap-2">
            <button className="admin-action-btn">
              <Download size={15} />
              Export CSV
            </button>
            <button className="admin-action-btn">
              <Filter size={15} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="admin-table-th">User Name</th>
                <th className="admin-table-th">Email</th>
                <th className="admin-table-th">Role</th>
                <th className="admin-table-th">Status</th>
                <th className="admin-table-th">Joined Date</th>
                <th className="admin-table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {USERS.map((user, i) => {
                const isActive = activeUsers.has(user.email);
                return (
                  <tr key={user.email} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          <span className="text-[11px] font-bold" style={{ color: AVATAR_TEXT[i % AVATAR_TEXT.length] }}>
                            {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <span className="text-[13px] font-medium text-[#0D0F2B]">{user.name}</span>
                      </div>
                    </td>
                    <td className="admin-table-td text-[13px] text-[#64748B]">{user.email}</td>
                    <td className="admin-table-td">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${ROLE_BADGE[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="admin-table-td">
                      <div className={`flex items-center gap-1.5 text-[13px] font-medium ${isActive ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#10B981]' : 'bg-[#CBD5E1]'}`} />
                        {isActive ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="admin-table-td text-[13px] text-[#64748B]">{user.joined}</td>
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors" aria-label="Edit">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => toggle(user.email)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
                            isActive
                              ? 'border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444]'
                              : 'border-[#E2E8F0] text-[#64748B] hover:border-[#10B981] hover:text-[#10B981]'
                          }`}
                          aria-label={isActive ? 'Deactivate' : 'Activate'}
                        >
                          {isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-[13px] text-[#64748B]">Showing 1 to 10 of 1,284 users</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 161].map((p, i) => (
              <button
                key={i}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                  p === 1 ? 'bg-[#020887] text-white' : 'text-[#64748B] hover:bg-[#EEF0FF] hover:text-[#020887]'
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
