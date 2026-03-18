'use client';

import { useState } from 'react';
import { Plus, Tag, Pencil, Trash2, RefreshCw, TrendingUp } from 'lucide-react';

type Tab = 'Active Codes' | 'Expired Codes' | 'Scheduled';

const PROMO_CODES = [
  {
    code: 'GRAND25',
    description: '25% off all suites',
    discount: '25%',
    usageLimit: 100,
    used: 67,
    validFrom: 'Mar 1, 2026',
    validTo: 'Mar 31, 2026',
    status: 'Active',
  },
  {
    code: 'WELCOME15',
    description: '15% off first booking',
    discount: '15%',
    usageLimit: 500,
    used: 312,
    validFrom: 'Jan 1, 2026',
    validTo: 'Dec 31, 2026',
    status: 'Active',
  },
  {
    code: 'WEEKEND50K',
    description: '₦50,000 off weekend stays',
    discount: '₦50,000',
    usageLimit: 50,
    used: 50,
    validFrom: 'Feb 1, 2026',
    validTo: 'Feb 28, 2026',
    status: 'Expired',
  },
  {
    code: 'VIP2026',
    description: '30% off for VIP members',
    discount: '30%',
    usageLimit: 200,
    used: 88,
    validFrom: 'Jan 15, 2026',
    validTo: 'Jun 30, 2026',
    status: 'Active',
  },
  {
    code: 'EASTER100K',
    description: '₦100,000 off Easter holiday',
    discount: '₦100,000',
    usageLimit: 75,
    used: 0,
    validFrom: 'Apr 17, 2026',
    validTo: 'Apr 20, 2026',
    status: 'Scheduled',
  },
  {
    code: 'NEWYR2025',
    description: 'New Year special offer',
    discount: '20%',
    usageLimit: 300,
    used: 300,
    validFrom: 'Dec 28, 2025',
    validTo: 'Jan 2, 2026',
    status: 'Expired',
  },
];

const TABS: Tab[] = ['Active Codes', 'Expired Codes', 'Scheduled'];

export default function AdminPromoCodesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Active Codes');

  const statusForTab = (tab: Tab) => {
    if (tab === 'Active Codes') return 'Active';
    if (tab === 'Expired Codes') return 'Expired';
    return 'Scheduled';
  };

  const filtered = PROMO_CODES.filter((c) => c.status === statusForTab(activeTab));

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">Promo Codes</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Create and manage discount codes for guests</p>
        </div>
        <button className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors">
          <Plus size={16} />
          Add New Code
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-[#020887] text-[#020887]'
                : 'border-transparent text-[#64748B] hover:text-[#0D0F2B]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="admin-table-th">Code Name</th>
                <th className="admin-table-th">Discount Value</th>
                <th className="admin-table-th">Usage</th>
                <th className="admin-table-th">Validity Period</th>
                <th className="admin-table-th">Status</th>
                <th className="admin-table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((promo) => {
                const usagePct = promo.usageLimit > 0 ? Math.round((promo.used / promo.usageLimit) * 100) : 0;
                return (
                  <tr key={promo.code} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-[#EEF0FF] flex items-center justify-center shrink-0">
                          <Tag size={13} className="text-[#020887]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[#0D0F2B] tracking-wide">{promo.code}</p>
                          <p className="text-[11px] text-[#94A3B8]">{promo.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-td">
                      <span className="text-[14px] font-bold text-[#020887]">{promo.discount}</span>
                    </td>
                    <td className="admin-table-td">
                      <div className="w-28">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-[#64748B]">{promo.used}/{promo.usageLimit}</span>
                          <span className="text-[11px] font-semibold text-[#0D0F2B]">{usagePct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${usagePct >= 100 ? 'bg-[#EF4444]' : usagePct >= 70 ? 'bg-[#F59E0B]' : 'bg-[#020887]'}`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-td">
                      <p className="text-[12px] text-[#0D0F2B]">{promo.validFrom}</p>
                      <p className="text-[12px] text-[#94A3B8]">to {promo.validTo}</p>
                    </td>
                    <td className="admin-table-td">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide ${
                          promo.status === 'Active'
                            ? 'bg-[#D1FAE5] text-[#059669]'
                            : promo.status === 'Expired'
                            ? 'bg-[#F1F5F9] text-[#64748B]'
                            : 'admin-badge-confirmed'
                        }`}
                      >
                        {promo.status}
                      </span>
                    </td>
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2">
                        {promo.status === 'Expired' ? (
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors" aria-label="Renew">
                            <RefreshCw size={14} />
                          </button>
                        ) : (
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors" aria-label="Edit">
                            <Pencil size={14} />
                          </button>
                        )}
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors" aria-label="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[14px] text-[#94A3B8]">
                    No {activeTab.toLowerCase()} at this time
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Redemptions', value: '1,402', icon: TrendingUp, color: 'text-[#10B981]', bg: 'bg-[#D1FAE5]' },
          { label: 'Active Discount Value', value: '₦4.2M', icon: Tag, color: 'text-[#020887]', bg: 'bg-[#EEF0FF]' },
          { label: 'Average Conv. Rate', value: '8.4%', icon: TrendingUp, color: 'text-[#F59E0B]', bg: 'bg-[#FEF3C7]' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="admin-stat-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-[13px] text-[#64748B]">{label}</p>
              <p className="text-[20px] font-bold text-[#0D0F2B]">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
