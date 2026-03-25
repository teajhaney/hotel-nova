'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, StarOff, CalendarDays, X, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { useEligibleBookings, useSubmitReview, useEditReview } from '@/hooks/use-reviews';
import type { EligibleBooking } from '@/type/api';
import { formatBookingDate } from '@/utils/format';
import Image from 'next/image';

const TABS = [
  GUEST_DASHBOARD_MESSAGES.reviewTabAll,
  GUEST_DASHBOARD_MESSAGES.reviewTabPending,
  GUEST_DASHBOARD_MESSAGES.reviewTabSubmitted,
] as const;
type Tab = (typeof TABS)[number];

// Fallback image shown when the room has no photo uploaded yet.
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80';

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

// ReviewModal handles both submitting a new review and editing an existing Pending one.
// It renders via createPortal so it escapes the guest dashboard layout's stacking
// context and always covers the full viewport — sidebar and header included.
function ReviewModal({
  booking,
  onClose,
}: {
  booking: EligibleBooking;
  onClose: () => void;
}) {
  const isEdit = !!booking.review;
  const [rating, setRating] = useState(booking.review?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState(booking.review?.reviewText ?? '');

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const submitReview = useSubmitReview();
  const editReview = useEditReview();

  const isPending = submitReview.isPending || editReview.isPending;

  function handleSubmit() {
    if (rating === 0 || text.trim().length === 0) return;

    if (isEdit && booking.review) {
      editReview.mutate(
        { id: booking.review.id, rating, reviewText: text },
        {
          onSuccess: () => {
            toast.success('Review updated.');
            onClose();
          },
        },
      );
    } else {
      submitReview.mutate(
        { bookingId: booking.bookingId, rating, reviewText: text },
        {
          onSuccess: () => {
            toast.success('Review submitted! It will appear after moderation.');
            onClose();
          },
        },
      );
    }
  }

  const imgSrc = booking.imageUrl ?? PLACEHOLDER_IMAGE;

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[480px] p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
        >
          <X size={18} />
        </button>

        <h2 className="text-[18px] font-bold text-[#0D0F2B] mb-1">
          {isEdit ? 'Edit Your Review' : GUEST_DASHBOARD_MESSAGES.reviewModalTitle}
        </h2>
        <p className="text-[13px] text-[#64748B] mb-5">{GUEST_DASHBOARD_MESSAGES.reviewModalSubtitle}</p>

        {/* Room summary */}
        <div className="flex items-center gap-3 mb-5 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <Image src={imgSrc} alt={booking.roomName} width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#0D0F2B]">{booking.roomName}</p>
            <p className="text-[12px] text-[#64748B]">
              {formatBookingDate(booking.checkIn)} – {formatBookingDate(booking.checkOut)}
            </p>
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
          disabled={rating === 0 || text.trim().length === 0 || isPending}
          onClick={handleSubmit}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? 'Saving…' : GUEST_DASHBOARD_MESSAGES.submitReview}
        </button>
      </div>
    </div>,
    document.body,
  );
}

function ReviewCard({
  booking,
  onReview,
}: {
  booking: EligibleBooking;
  onReview: (b: EligibleBooking) => void;
}) {
  // Three distinct states drive everything on this card:
  //   no review          → awaiting review (guest hasn't submitted yet)
  //   review.Pending     → submitted but admin hasn't acted yet
  //   review.Approved    → admin approved, visible to other guests
  const reviewStatus = booking.review?.status ?? null;
  const imgSrc = booking.imageUrl ?? PLACEHOLDER_IMAGE;

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Room image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
          <Image
            src={imgSrc}
            alt={booking.roomName}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
            <div>
              <p className="text-[15px] font-semibold text-[#0D0F2B]">{booking.roomName}</p>
              <p className="text-[12px] text-[#64748B]">{booking.roomType}</p>
            </div>

            {/* Badge — reflects the real review status, not just whether a review exists */}
            {reviewStatus === 'Approved' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D1FAE5] text-[11px] font-semibold text-[#10B981] uppercase tracking-wide">
                <CheckCircle2 size={12} />
                {GUEST_DASHBOARD_MESSAGES.reviewSubmittedLabel}
              </span>
            ) : reviewStatus === 'Pending' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[11px] font-semibold text-[#020887] uppercase tracking-wide">
                Pending Review
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[11px] font-semibold text-[#B45309] uppercase tracking-wide">
                {GUEST_DASHBOARD_MESSAGES.reviewPendingLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] mb-2">
            <CalendarDays size={13} />
            <span>
              {formatBookingDate(booking.checkIn)} – {formatBookingDate(booking.checkOut)}
            </span>
            <span className="text-[#CBD5E1]">·</span>
            <span className="font-medium text-[#94A3B8]">#{booking.bookingRef}</span>
          </div>

          {booking.review && (
            <StarRating rating={booking.review.rating} />
          )}
        </div>
      </div>

      {/* Bottom section — depends on review state */}
      {booking.review ? (
        <div className="px-4 pb-4 border-t border-[#F1F5F9] pt-3">
          <p className="text-[13px] text-[#64748B] leading-relaxed line-clamp-3">
            {booking.review.reviewText}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-1.5">
            Submitted {formatBookingDate(booking.review.submittedAt)}
          </p>
          {/* Only Pending reviews can be edited — once approved the admin owns it */}
          {reviewStatus === 'Pending' && (
            <button
              onClick={() => onReview(booking)}
              className="mt-2.5 text-[13px] font-semibold text-[#020887] hover:underline"
            >
              {GUEST_DASHBOARD_MESSAGES.editReview}
            </button>
          )}
        </div>
      ) : (
        <div className="px-4 pb-4 border-t border-[#F1F5F9] pt-3 flex items-center justify-between">
          <p className="text-[13px] text-[#94A3B8]">Share your thoughts about this stay</p>
          <button
            onClick={() => onReview(booking)}
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
  const [modalBooking, setModalBooking] = useState<EligibleBooking | null>(null);

  const { data: bookings = [], isLoading } = useEligibleBookings();

  const filtered = bookings.filter((b) => {
    if (activeTab === GUEST_DASHBOARD_MESSAGES.reviewTabPending)
      // Pending tab = no review yet OR review is waiting for admin approval
      return !b.review || b.review.status === 'Pending';
    if (activeTab === GUEST_DASHBOARD_MESSAGES.reviewTabSubmitted)
      // Submitted tab = admin has approved the review
      return b.review?.status === 'Approved';
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

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-[#020887]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <StarOff size={36} className="text-[#CBD5E1]" />
          <p className="text-[14px] text-[#94A3B8]">{GUEST_DASHBOARD_MESSAGES.noReviews}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((booking) => (
            <ReviewCard key={booking.bookingId} booking={booking} onReview={setModalBooking} />
          ))}
        </div>
      )}

      {/* Review modal */}
      {modalBooking && (
        <ReviewModal booking={modalBooking} onClose={() => setModalBooking(null)} />
      )}
    </div>
  );
}
