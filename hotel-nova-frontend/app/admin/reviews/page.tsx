'use client';

import { useState } from 'react';
import { Star, CheckCircle, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminReviews, useUpdateReviewStatus } from '@/hooks/use-reviews';
import { formatBookingDate } from '@/utils/format';

type Tab = 'Pending' | 'Approved' | 'Hidden';

const AVATAR_COLORS = ['#EEF0FF', '#D1FAE5', '#FFEDD5', '#DBEAFE', '#FEE2E2', '#FEF3C7', '#F3E8FF', '#ECFDF5'];
const AVATAR_TEXT   = ['#020887', '#10B981', '#F97316', '#1D4ED8', '#DC2626', '#B45309', '#7C3AED', '#059669'];

function RatingDisplay({ rating }: { rating: number }) {
  const color =
    rating >= 4.5 ? 'text-[#10B981]' : rating >= 3 ? 'text-[#F59E0B]' : 'text-[#EF4444]';
  const fullStars = Math.floor(rating);
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[14px] font-bold ${color}`}>{rating.toFixed(1)}</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={13}
            className={s <= fullStars ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E2E8F0] fill-[#E2E8F0]'}
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Pending');

  const { data: page, isLoading } = useAdminReviews(activeTab);
  const updateStatus = useUpdateReviewStatus();

  const tabs: Tab[] = ['Pending', 'Approved', 'Hidden'];
  const reviews = page?.data ?? [];

  function handleStatusChange(id: string, status: 'Approved' | 'Hidden') {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Review ${status.toLowerCase()}.`),
      },
    );
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">Review Moderation</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Manage and moderate guest reviews</p>
        </div>
        {/* Tab buttons */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#020887] text-white'
                  : 'text-[#64748B] hover:text-[#0D0F2B]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="admin-stat-card">
          <p className="text-[13px] text-[#64748B] mb-1">Total Reviews</p>
          <p className="text-[22px] font-bold text-[#0D0F2B]">
            {page?.meta.total ?? '—'}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">In this tab</p>
        </div>
        <div className="admin-stat-card">
          <p className="text-[13px] text-[#64748B] mb-1">Showing</p>
          <p className="text-[22px] font-bold text-[#0D0F2B]">
            {reviews.length}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">On this page</p>
        </div>
        <div className="admin-stat-card">
          <p className="text-[13px] text-[#64748B] mb-1">Status Filter</p>
          <p className={`text-[22px] font-bold ${activeTab === 'Pending' ? 'text-[#B45309]' : activeTab === 'Approved' ? 'text-[#10B981]' : 'text-[#64748B]'}`}>
            {activeTab}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Active filter</p>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="admin-table-th">Guest Name</th>
                <th className="admin-table-th">Room</th>
                <th className="admin-table-th">Rating</th>
                <th className="admin-table-th">Comment</th>
                <th className="admin-table-th">Date</th>
                <th className="admin-table-th">Status</th>
                <th className="admin-table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center">
                    <Loader2 size={24} className="animate-spin text-[#020887] mx-auto" />
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[14px] text-[#94A3B8]">
                    No {activeTab.toLowerCase()} reviews
                  </td>
                </tr>
              ) : (
                reviews.map((review, i) => (
                  <tr key={review.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          <span className="text-[11px] font-bold" style={{ color: AVATAR_TEXT[i % AVATAR_TEXT.length] }}>
                            {review.guest.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <span className="text-[13px] font-medium text-[#0D0F2B] whitespace-nowrap">
                          {review.guest.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="admin-table-td text-[13px] text-[#64748B] whitespace-nowrap">
                      {review.room.name}
                    </td>
                    <td className="admin-table-td">
                      <RatingDisplay rating={review.rating} />
                    </td>
                    <td className="admin-table-td max-w-[280px]">
                      <p className="text-[13px] text-[#64748B] line-clamp-2">{review.reviewText}</p>
                    </td>
                    <td className="admin-table-td text-[13px] text-[#64748B] whitespace-nowrap">
                      {formatBookingDate(review.submittedAt)}
                    </td>
                    <td className="admin-table-td">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide ${
                          review.status === 'Approved'
                            ? 'bg-[#D1FAE5] text-[#059669]'
                            : review.status === 'Pending'
                            ? 'admin-badge-pending'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="admin-table-td">
                      <div className="flex items-center gap-2">
                        {review.status !== 'Approved' && (
                          <button
                            onClick={() => handleStatusChange(review.id, 'Approved')}
                            disabled={updateStatus.isPending}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#10B981] hover:bg-[#D1FAE5] transition-colors disabled:opacity-50"
                            aria-label="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {review.status !== 'Hidden' && (
                          <button
                            onClick={() => handleStatusChange(review.id, 'Hidden')}
                            disabled={updateStatus.isPending}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors disabled:opacity-50"
                            aria-label="Hide"
                          >
                            <EyeOff size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-[13px] text-[#64748B]">
            Showing {reviews.length} of {page?.meta.total ?? 0} reviews
          </p>
        </div>
      </div>
    </div>
  );
}
