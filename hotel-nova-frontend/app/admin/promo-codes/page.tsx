'use client';

import { useState } from 'react';
import { Plus, Tag, Pencil, Trash2, RefreshCw, TrendingUp, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { PromoFormModal } from '@/components/admin/promo-codes/PromoFormModal';
import type { PromoData } from '@/type/interface';
import { DeletePromoModal } from '@/components/admin/promo-codes/DeletePromoModal';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';
import {
  useAdminPromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
} from '@/hooks/use-promo-codes';
import type { PromoCode } from '@/type/api';
import { formatBookingDate } from '@/utils/format';

const M = ADMIN_DASHBOARD_MESSAGES;

type Tab = 'Active Codes' | 'Expired Codes' | 'Scheduled';

const TABS: Tab[] = [M.promoTabActive, M.promoTabExpired, M.promoTabScheduled];

// Map a backend PromoCode record to the shape the PromoFormModal expects.
function toPromoData(p: PromoCode): PromoData {
  const discountDisplay =
    p.discountType === 'percentage'
      ? `${p.discountValue}%`
      : `₦${p.discountValue.toLocaleString()}`;
  return {
    id: p.id,
    code: p.code,
    description: p.description,
    discount: discountDisplay,
    discountType: p.discountType,
    discountValue: p.discountValue,
    usageLimit: p.usageLimit,
    used: p.used,
    validFrom: p.validFrom.split('T')[0],  // keep just "YYYY-MM-DD" for date input
    validTo: p.validTo.split('T')[0],
    status: p.status,
  };
}

export default function AdminPromoCodesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Active Codes');
  const [currentPage, setCurrentPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PromoData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PromoData | null>(null);

  const statusForTab = (tab: Tab): string => {
    if (tab === 'Active Codes') return 'Active';
    if (tab === 'Expired Codes') return 'Inactive';
    return 'Scheduled';
  };

  // Reset to page 1 whenever the tab changes
  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setCurrentPage(1);
  }

  const { data: page, isLoading } = useAdminPromoCodes(statusForTab(activeTab), currentPage);
  const createPromo = useCreatePromoCode();
  const updatePromo = useUpdatePromoCode();
  const deletePromo = useDeletePromoCode();

  const promos = page?.data ?? [];

  // Called by PromoFormModal when the form is submitted (both create and edit).
  function handleSave(data: PromoData) {
    if (data.id) {
      // Edit — PATCH /api/admin/promo-codes/:id
      updatePromo.mutate(
        {
          id: data.id,
          code: data.code,
          description: data.description,
          discountType: data.discountType,
          discountValue: data.discountValue,
          usageLimit: data.usageLimit,
          validFrom: data.validFrom,
          validTo: data.validTo,
          status: data.status,
        },
        {
          onSuccess: () => {
            toast.success('Promo code updated.');
            setEditTarget(null);
          },
        },
      );
    } else {
      // Create — POST /api/admin/promo-codes
      createPromo.mutate(
        {
          code: data.code,
          description: data.description,
          discountType: data.discountType,
          discountValue: data.discountValue,
          usageLimit: data.usageLimit,
          validFrom: data.validFrom,
          validTo: data.validTo,
          status: data.status,
        },
        {
          onSuccess: () => {
            toast.success('Promo code created.');
            setAddOpen(false);
          },
        },
      );
    }
  }

  function handleDeleteConfirm() {
    if (!deleteTarget?.id) return;
    deletePromo.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Promo code deleted.');
        setDeleteTarget(null);
      },
    });
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">{M.promoTitle}</h1>
          <p className="text-[14px] text-[#64748B] mt-1">{M.promoSubtitle}</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors self-start sm:self-auto shrink-0 whitespace-nowrap"
        >
          <Plus size={16} />
          {M.addNewCode}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
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
          <table className="w-full min-w-[900px]">
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-[#E2E8F0] last:border-0">
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-[#E2E8F0]"></div>
                        <div>
                          <div className="h-4 bg-[#E2E8F0] rounded w-24 mb-1.5"></div>
                          <div className="h-3 bg-[#E2E8F0] rounded w-32"></div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-table-td"><div className="h-5 bg-[#E2E8F0] rounded w-16"></div></td>
                    <td className="admin-table-td">
                      <div className="w-28">
                        <div className="flex justify-between mb-1.5">
                          <div className="h-3 bg-[#E2E8F0] rounded w-8"></div>
                          <div className="h-3 bg-[#E2E8F0] rounded w-6"></div>
                        </div>
                        <div className="h-1.5 bg-[#E2E8F0] rounded-full w-full"></div>
                      </div>
                    </td>
                    <td className="admin-table-td">
                      <div className="h-3.5 bg-[#E2E8F0] rounded w-24 mb-1"></div>
                      <div className="h-3.5 bg-[#E2E8F0] rounded w-32"></div>
                    </td>
                    <td className="admin-table-td"><div className="h-5 bg-[#E2E8F0] rounded-md w-16"></div></td>
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#E2E8F0]"></div>
                        <div className="w-8 h-8 rounded-lg bg-[#E2E8F0]"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : promos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[14px] text-[#94A3B8]">
                    No {activeTab.toLowerCase()} at this time
                  </td>
                </tr>
              ) : (
                promos.map((promo) => {
                  const usagePct = promo.usageLimit > 0 ? Math.round((promo.used / promo.usageLimit) * 100) : 0;
                  const discountDisplay =
                    promo.discountType === 'percentage'
                      ? `${promo.discountValue}%`
                      : `₦${promo.discountValue.toLocaleString()}`;
                  return (
                    <tr key={promo.id} className="hover:bg-[#F8FAFC] transition-colors">
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
                        <span className="text-[14px] font-bold text-[#020887]">{discountDisplay}</span>
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
                        <p className="text-[12px] text-[#0D0F2B]">{formatBookingDate(promo.validFrom)}</p>
                        <p className="text-[12px] text-[#94A3B8]">to {formatBookingDate(promo.validTo)}</p>
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
                              onClick={() => setEditTarget(toPromoData(promo))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors"
                              aria-label={M.renewPromoAriaLabel}
                            >
                              <RefreshCw size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditTarget(toPromoData(promo))}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors"
                              aria-label={M.editPromoAriaLabel}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(toPromoData(promo))}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                            aria-label={M.deletePromoAriaLabel}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {page && page.meta.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between gap-4 flex-wrap">
            <p className="text-[13px] text-[#64748B]">
              Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, page.meta.total)} of {page.meta.total} codes
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: page.meta.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === page.meta.totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '…' ? (
                    <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-[13px] text-[#94A3B8]">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item as number)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                        currentPage === item
                          ? 'bg-[#020887] text-white'
                          : 'text-[#64748B] hover:bg-[#EEF0FF] hover:text-[#020887]'
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(page.meta.totalPages, p + 1))}
                disabled={currentPage === page.meta.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: M.promoStatRedemptions,   value: page?.meta.total != null ? page.meta.total.toLocaleString() : '—', icon: TrendingUp, color: 'text-[#10B981]', bg: 'bg-[#D1FAE5]' },
          { label: M.promoStatDiscountValue, value: `${promos.length} codes`, icon: Tag, color: 'text-[#020887]', bg: 'bg-[#EEF0FF]' },
          { label: M.promoStatConvRate,      value: `${activeTab.split(' ')[0]}`, icon: TrendingUp, color: 'text-[#F59E0B]', bg: 'bg-[#FEF3C7]' },
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
      <AnimatePresence>
        {addOpen && (
          <PromoFormModal key="promo-add" promo={null} onClose={() => setAddOpen(false)} onSave={handleSave} />
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editTarget && (
          <PromoFormModal key="promo-edit" promo={editTarget} onClose={() => setEditTarget(null)} onSave={handleSave} />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeletePromoModal
            key="delete-promo"
            promoCode={deleteTarget.code}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
