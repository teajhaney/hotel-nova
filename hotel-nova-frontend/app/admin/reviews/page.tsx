'use client';

import { useState } from 'react';
import { Star, CheckCircle, XCircle } from 'lucide-react';

type Tab = 'Pending' | 'Approved' | 'Hidden';

const REVIEWS = [
  { guest: 'Amara Okonkwo', rating: 5.0, comment: 'Absolutely spectacular stay! The presidential suite exceeded all expectations. Service was impeccable.', date: 'Mar 15, 2026', status: 'Pending' },
  { guest: 'Chidi Eze', rating: 4.5, comment: 'Beautiful hotel with great amenities. The pool area was lovely. Minor issue with room service timing.', date: 'Mar 14, 2026', status: 'Approved' },
  { guest: 'Fatima Al-Hassan', rating: 2.0, comment: 'Disappointed by the noise level in our room. AC was malfunctioning for two hours before fixed.', date: 'Mar 13, 2026', status: 'Pending' },
  { guest: 'Emmanuel Adeyemi', rating: 4.8, comment: 'One of the best hotels I have stayed at in Abuja. The staff are very welcoming and professional.', date: 'Mar 12, 2026', status: 'Approved' },
  { guest: 'Ngozi Obi', rating: 3.5, comment: 'Decent hotel overall. Some areas need renovation but the food was excellent.', date: 'Mar 11, 2026', status: 'Pending' },
  { guest: 'Bola Akin', rating: 5.0, comment: 'Perfect anniversary getaway! The team went above and beyond to make our stay special. Highly recommend!', date: 'Mar 10, 2026', status: 'Approved' },
  { guest: 'Yemi Fashola', rating: 1.0, comment: 'Very poor experience. Room was not cleaned on arrival. Staff were unresponsive to complaints.', date: 'Mar 9, 2026', status: 'Hidden' },
  { guest: 'Zainab Musa', rating: 4.2, comment: 'Great location and beautiful facilities. The gym is world-class. Would definitely return.', date: 'Mar 8, 2026', status: 'Pending' },
  { guest: 'Tunde Bakare', rating: 4.7, comment: 'Exceptional service from check-in to check-out. The breakfast spread was outstanding.', date: 'Mar 7, 2026', status: 'Pending' },
  { guest: 'Ifeoma Nwosu', rating: 3.0, comment: 'Room was comfortable but the wifi was inconsistent throughout the stay. Needs improvement.', date: 'Mar 6, 2026', status: 'Pending' },
  { guest: 'Kemi Adeola', rating: 5.0, comment: 'Honestly the best hotel experience I have had in Nigeria. Every detail was thoughtfully done.', date: 'Mar 5, 2026', status: 'Approved' },
  { guest: 'Michael Okafor', rating: 2.5, comment: 'The pool was closed for maintenance without prior notice. Very disappointing for a weekend trip.', date: 'Mar 4, 2026', status: 'Hidden' },
  { guest: 'Sara Williams', rating: 4.9, comment: 'Luxurious rooms and impeccable service. The spa treatment was out of this world. Coming back!', date: 'Mar 3, 2026', status: 'Pending' },
  { guest: 'Ahmed Musa', rating: 4.0, comment: 'Good value for a five-star property. Location is prime and the concierge team was very helpful.', date: 'Mar 2, 2026', status: 'Pending' },
  { guest: 'Elena Gilbert', rating: 1.5, comment: 'Had issues with our room key three times. Housekeeping missed our room on day two. Not acceptable.', date: 'Mar 1, 2026', status: 'Pending' },
];

const AVATAR_COLORS = ['#EEF0FF', '#D1FAE5', '#FFEDD5', '#DBEAFE', '#FEE2E2', '#FEF3C7', '#F3E8FF', '#ECFDF5'];
const AVATAR_TEXT = ['#020887', '#10B981', '#F97316', '#1D4ED8', '#DC2626', '#B45309', '#7C3AED', '#059669'];

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

  const tabs: Tab[] = ['Pending', 'Approved', 'Hidden'];
  const filtered = REVIEWS.filter((r) => r.status === activeTab);

  const pendingCount = REVIEWS.filter((r) => r.status === 'Pending').length;

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
              {tab === 'Pending' && (
                <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === 'Pending' ? 'bg-white/20' : 'bg-[#FEF3C7] text-[#B45309]'}`}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="admin-stat-card">
          <p className="text-[13px] text-[#64748B] mb-1">Average Rating</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[22px] font-bold text-[#0D0F2B]">4.8</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} className={s <= 4 ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E2E8F0]'} />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-1">Based on 208 reviews</p>
        </div>
        <div className="admin-stat-card">
          <p className="text-[13px] text-[#64748B] mb-1">Pending Reviews</p>
          <p className="text-[22px] font-bold text-[#B45309]">24</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Awaiting moderation</p>
        </div>
        <div className="admin-stat-card">
          <p className="text-[13px] text-[#64748B] mb-1">Approval Rate</p>
          <p className="text-[22px] font-bold text-[#10B981]">92%</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="admin-table-th">Guest Name</th>
                <th className="admin-table-th">Rating</th>
                <th className="admin-table-th">Comment</th>
                <th className="admin-table-th">Date</th>
                <th className="admin-table-th">Status</th>
                <th className="admin-table-th">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map((review, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="admin-table-td">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      >
                        <span className="text-[11px] font-bold" style={{ color: AVATAR_TEXT[i % AVATAR_TEXT.length] }}>
                          {review.guest.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-[13px] font-medium text-[#0D0F2B] whitespace-nowrap">{review.guest}</span>
                    </div>
                  </td>
                  <td className="admin-table-td">
                    <RatingDisplay rating={review.rating} />
                  </td>
                  <td className="admin-table-td max-w-[280px]">
                    <p className="text-[13px] text-[#64748B] line-clamp-2">{review.comment}</p>
                  </td>
                  <td className="admin-table-td text-[13px] text-[#64748B] whitespace-nowrap">{review.date}</td>
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
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#10B981] hover:bg-[#D1FAE5] transition-colors" aria-label="Approve">
                        <CheckCircle size={18} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#EF4444] hover:bg-[#FEE2E2] transition-colors" aria-label="Reject">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[14px] text-[#94A3B8]">
                    No {activeTab.toLowerCase()} reviews
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-[13px] text-[#64748B]">Showing 1 to {filtered.length} of 24 reviews</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
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
