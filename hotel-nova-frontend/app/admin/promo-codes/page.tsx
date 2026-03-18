'use client';

import { useState } from 'react';
import { Plus, Tag, Pencil, Trash2, RefreshCw, TrendingUp } from 'lucide-react';
import { PromoFormModal } from '@/components/admin/promo-codes/PromoFormModal';
import type { PromoData } from '@/type/interface';
import { DeletePromoModal } from '@/components/admin/promo-codes/DeletePromoModal';
import { INITIAL_PROMOS } from '@/constants/dummyData';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';

const M = ADMIN_DASHBOARD_MESSAGES;

type Tab = 'Active Codes' | 'Expired Codes' | 'Scheduled';

const TABS: Tab[] = [M.promoTabActive, M.promoTabExpired, M.promoTabScheduled];

export default function AdminPromoCodesPage() {
  const [promos, setPromos] = useState<PromoData[]>(INITIAL_PROMOS);
  const [activeTab, setActiveTab] = useState<Tab>('Active Codes');

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PromoData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PromoData | null>(null);

  const statusForTab = (tab: Tab): string => {
    if (tab === 'Active Codes') return 'Active';
    if (tab === 'Expired Codes') return 'Inactive';
    return 'Scheduled';
  };

  const filtered = promos.filter((c) => c.status === statusForTab(activeTab));

  const handleSave = (data: PromoData) => {
    setPromos((prev) => {
      const exists = prev.find((p) => p.code === data.code);
      if (exists) {
        return prev.map((p) => (p.code === data.code ? data : p));
      }
      return [data, ...prev];
    });
    setAddOpen(false);
    setEditTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setPromos((prev) => prev.filter((p) => p.code !== deleteTarget.code));
    setDeleteTarget(null);
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">{M.promoTitle}</h1>
          <p className="text-[14px] text-[#64748B] mt-1">{M.promoSubtitle}</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors"
        >
          <Plus size={16} />
          {M.addNewCode}
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
                <th className="admin-table-th">{M.promoColCodeName}</th>
                <th className="admin-table-th">{M.promoColDiscountValue}</th>
                <th className="admin-table-th">{M.promoColUsage}</th>
                <th className="admin-table-th">{M.promoColValidityPeriod}</th>
                <th className="admin-table-th">{M.promoColStatus}</th>
                <th className="admin-table-th">{M.promoColActions}</th>
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
                            style={{ width: `${Math.min(usagePct, 100)}%` }}
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
                            : promo.status === 'Scheduled'
                            ? 'bg-[#EEF0FF] text-[#020887]'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        {promo.status}
                      </span>
                    </td>
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2">
                        {promo.status === 'Inactive' ? (
                          <button
                            onClick={() => setEditTarget(promo)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors"
                            aria-label={M.renewPromoAriaLabel}
                          >
                            <RefreshCw size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditTarget(promo)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors"
                            aria-label={M.editPromoAriaLabel}
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(promo)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                          aria-label={M.deletePromoAriaLabel}
                        >
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
          { label: M.promoStatRedemptions,   value: '1,402', icon: TrendingUp, color: 'text-[#10B981]', bg: 'bg-[#D1FAE5]' },
          { label: M.promoStatDiscountValue, value: '₦4.2M', icon: Tag,        color: 'text-[#020887]', bg: 'bg-[#EEF0FF]' },
          { label: M.promoStatConvRate,      value: '8.4%',  icon: TrendingUp, color: 'text-[#F59E0B]', bg: 'bg-[#FEF3C7]' },
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

      {/* Add Modal */}
      {addOpen && (
        <PromoFormModal promo={null} onClose={() => setAddOpen(false)} onSave={handleSave} />
      )}

      {/* Edit Modal */}
      {editTarget && (
        <PromoFormModal promo={editTarget} onClose={() => setEditTarget(null)} onSave={handleSave} />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeletePromoModal
          promoCode={deleteTarget.code}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
