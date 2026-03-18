'use client';

import { useState } from 'react';
import { Star, StarOff, CalendarDays, X, CheckCircle2 } from 'lucide-react';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { GUEST_REVIEWS } from '@/constants/dummyData';
import type { GuestReview } from '@/type/type';
import Image from 'next/image';

const TABS = [
  GUEST_DASHBOARD_MESSAGES.reviewTabAll,
  GUEST_DASHBOARD_MESSAGES.reviewTabPending,
  GUEST_DASHBOARD_MESSAGES.reviewTabSubmitted,
] as const;
type Tab = (typeof TABS)[number];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#CBD5E1]'}
        />
      ))}
    </div>
  );
}

function ReviewModal({
  review,
  onClose,
}: {
  review: GuestReview;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[480px] p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
        >
          <X size={18} />
        </button>

        <h2 className="text-[18px] font-bold text-[#0D0F2B] mb-1">{GUEST_DASHBOARD_MESSAGES.reviewModalTitle}</h2>
        <p className="text-[13px] text-[#64748B] mb-5">{GUEST_DASHBOARD_MESSAGES.reviewModalSubtitle}</p>

        {/* Room summary */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <Image src={review.image} alt={review.roomType} width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#0D0F2B]">{review.roomType}</p>
            <p className="text-[12px] text-[#64748B]">{review.checkIn} – {review.checkOut}</p>
          </div>
        </div>

        {/* Star rating */}
        <label className="block text-[13px] font-semibold text-[#0D0F2B] mb-2">
          {GUEST_DASHBOARD_MESSAGES.ratingLabel}
        </label>
        <div className="flex items-center gap-1 mb-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(i)}
              className="focus:outline-none"
            >
              <Star
                size={28}
                className={
                  i <= (hovered || rating)
                    ? 'text-[#F59E0B] fill-[#F59E0B]'
                    : 'text-[#CBD5E1]'
                }
              />
            </button>
          ))}
        </div>

        {/* Review text */}
        <label className="block text-[13px] font-semibold text-[#0D0F2B] mb-2">
          {GUEST_DASHBOARD_MESSAGES.reviewLabel}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={GUEST_DASHBOARD_MESSAGES.reviewPlaceholder}
          rows={4}
          className="w-full border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-[14px] text-[#0D0F2B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#020887]/20 focus:border-[#020887] resize-none mb-5"
        />

        <button
          disabled={rating === 0 || text.trim().length === 0}
          onClick={onClose}
          className="btn-primary"
        >
          {GUEST_DASHBOARD_MESSAGES.submitReview}
        </button>
      </div>
    </div>
  );
}

function ReviewCard({
  review,
  onReview,
}: {
  review: GuestReview;
  onReview: (r: GuestReview) => void;
}) {
  const reviewed = review.rating !== null;

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Room image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <Image
            src={review.image}
            alt={review.roomType}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
            <div>
              <p className="text-[15px] font-semibold text-[#0D0F2B]">{review.roomType}</p>
              <p className="text-[12px] text-[#64748B]">{review.roomSubtype}</p>
            </div>
            {reviewed ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D1FAE5] text-[11px] font-semibold text-[#10B981] uppercase tracking-wide">
                <CheckCircle2 size={12} />
                {GUEST_DASHBOARD_MESSAGES.reviewSubmittedLabel}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[11px] font-semibold text-[#B45309] uppercase tracking-wide">
                {GUEST_DASHBOARD_MESSAGES.reviewPendingLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] mb-2">
            <CalendarDays size={13} />
            <span>{review.checkIn} – {review.checkOut}</span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="font-medium text-[#94A3B8]">#{review.bookingId}</span>
          </div>

          {reviewed && review.rating !== null && (
            <StarRating rating={review.rating} />
          )}
        </div>
      </div>

      {/* Review body or CTA */}
      {reviewed && review.reviewText ? (
        <div className="px-4 pb-4 border-t border-[#F1F5F9] pt-3">
          <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-3">{review.reviewText}</p>
          {review.submittedAt && (
            <p className="text-[11px] text-[#94A3B8] mt-1.5">
              Submitted {review.submittedAt}
            </p>
          )}
          <button
            onClick={() => onReview(review)}
            className="mt-2.5 text-[13px] font-semibold text-[#020887] hover:underline"
          >
            {GUEST_DASHBOARD_MESSAGES.editReview}
          </button>
        </div>
      ) : (
        <div className="px-4 pb-4 border-t border-[#F1F5F9] pt-3 flex items-center justify-between">
          <p className="text-[13px] text-[#94A3B8]">Share your thoughts about this stay</p>
          <button
            onClick={() => onReview(review)}
            className="px-4 py-2 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors"
          >
            {GUEST_DASHBOARD_MESSAGES.leaveReview}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<Tab>(GUEST_DASHBOARD_MESSAGES.reviewTabAll);
  const [modalReview, setModalReview] = useState<GuestReview | null>(null);

  const filtered = GUEST_REVIEWS.filter((r) => {
    if (activeTab === GUEST_DASHBOARD_MESSAGES.reviewTabPending) return r.rating === null;
    if (activeTab === GUEST_DASHBOARD_MESSAGES.reviewTabSubmitted) return r.rating !== null;
    return true;
  });

  return (
    <div className="guest-page-container">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#0D0F2B]">{GUEST_DASHBOARD_MESSAGES.reviewsTitle}</h1>
        <p className="text-[14px] text-[#64748B] mt-0.5">{GUEST_DASHBOARD_MESSAGES.reviewsSubtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0] mb-5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-[14px] font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-[#020887] text-[#020887]'
                : 'border-transparent text-[#64748B] hover:text-[#0D0F2B]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Review list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <StarOff size={36} className="text-[#CBD5E1]" />
          <p className="text-[14px] text-[#94A3B8]">{GUEST_DASHBOARD_MESSAGES.noReviews}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} onReview={setModalReview} />
          ))}
        </div>
      )}

      {/* Review modal */}
      {modalReview && (
        <ReviewModal review={modalReview} onClose={() => setModalReview(null)} />
      )}
    </div>
  );
}
