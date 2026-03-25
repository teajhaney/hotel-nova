'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { EligibleBooking, ReviewWithRelations, ReviewsPage } from '@/type/api';

// ─── BroadcastChannel helpers ─────────────────────────────────────────────────
// BroadcastChannel lets every tab of the same origin talk to each other.
// When the guest submits/edits a review in Tab A, Tab B (e.g. mobile view open
// in another window) receives the message and immediately refetches — no delay,
// no manual reload needed.
//
// Two channels are used so each one is scoped to a single concern:
//   'hotel-nova:eligible-bookings' — guest review page data
//   'hotel-nova:admin-reviews'     — admin review moderation data
//
// SSR guard: BroadcastChannel only exists in the browser, so every usage is
// wrapped in `typeof BroadcastChannel !== 'undefined'`.

const CHANNEL_ELIGIBLE = 'hotel-nova:eligible-bookings';
const CHANNEL_ADMIN    = 'hotel-nova:admin-reviews';

function broadcast(channelName: string) {
  if (typeof BroadcastChannel === 'undefined') return;
  const ch = new BroadcastChannel(channelName);
  ch.postMessage({ ts: Date.now() });
  ch.close();
}

// ─── useEligibleBookings ───────────────────────────────────────────────────────
// Fetches the guest's checked-out bookings eligible for review.
//
// Live update strategy (two layers):
//   1. BroadcastChannel — if the guest has the page open in two tabs/windows
//      (e.g. desktop + mobile DevTools), a review action in one tab instantly
//      triggers a refetch in the other. Zero delay.
//   2. Polling every 15 s — catches cross-device changes, e.g. when an admin
//      marks a booking as CheckedOut or approves a review on a different device.
//   3. refetchOnWindowFocus — the moment the guest switches back to this tab
//      after being away, a refetch fires immediately rather than waiting for the
//      next poll tick.
export function useEligibleBookings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const ch = new BroadcastChannel(CHANNEL_ELIGIBLE);

    // Another tab submitted or edited a review — refetch so this tab is in sync.
    ch.onmessage = () => {
      void queryClient.invalidateQueries({ queryKey: ['eligible-bookings'] });
    };

    return () => ch.close();
  }, [queryClient]);

  return useQuery({
    queryKey: ['eligible-bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<EligibleBooking[]>('/reviews/eligible');
      return data;
    },
    refetchInterval: 15_000,       // polls for admin checkout / approval updates
    refetchOnWindowFocus: true,    // immediate refetch when the tab regains focus
  });
}

// ─── useSubmitReview ──────────────────────────────────────────────────────────
// Posts a new review. On success:
//   • invalidates the local query (this tab updates instantly)
//   • broadcasts to all other open tabs so they update too
export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      bookingId: string;
      rating: number;
      reviewText: string;
    }) => {
      const { data } = await apiClient.post<ReviewWithRelations>('/reviews', payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['eligible-bookings'] });
      broadcast(CHANNEL_ELIGIBLE);
    },
  });
}

// ─── useEditReview ────────────────────────────────────────────────────────────
// Guest edits their own Pending review. Same live-update pattern as submit.
export function useEditReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      rating: number;
      reviewText: string;
    }) => {
      const { id, ...body } = payload;
      const { data } = await apiClient.patch<ReviewWithRelations>(
        `/reviews/${id}`,
        body,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['eligible-bookings'] });
      broadcast(CHANNEL_ELIGIBLE);
    },
  });
}

// ─── useAdminReviews ──────────────────────────────────────────────────────────
// Admin: fetches a paginated list of reviews filtered by status.
// Polls every 15 s so new guest submissions appear without a reload.
// Also listens on the admin channel — if the admin has two windows open
// (e.g. Pending tab + Approved tab), approving in one refreshes the other.
export function useAdminReviews(status?: 'Pending' | 'Approved' | 'Hidden') {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const ch = new BroadcastChannel(CHANNEL_ADMIN);
    ch.onmessage = () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    };
    return () => ch.close();
  }, [queryClient]);

  return useQuery({
    queryKey: ['admin-reviews', status],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '50' });
      if (status) params.set('status', status);
      const { data } = await apiClient.get<ReviewsPage>(
        `/admin/reviews?${params.toString()}`,
      );
      return data;
    },
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
}

// ─── useUpdateReviewStatus ────────────────────────────────────────────────────
// Admin: changes a review's status (Pending → Approved / Hidden). On success:
//   • invalidates admin-reviews (this tab updates instantly)
//   • broadcasts on admin channel (other admin tabs update instantly)
//   • broadcasts on eligible channel (guest's tab sees the approval within
//     the next poll tick — BroadcastChannel only reaches same-browser tabs,
//     so cross-device approval is still handled by the 15 s poll on the guest side)
export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      status: 'Pending' | 'Approved' | 'Hidden';
    }) => {
      const { id, ...body } = payload;
      const { data } = await apiClient.patch<ReviewWithRelations>(
        `/admin/reviews/${id}/status`,
        body,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      broadcast(CHANNEL_ADMIN);
      // If the admin and the guest are in the same browser (e.g. developer
      // testing both in different tabs), the guest's page updates immediately.
      broadcast(CHANNEL_ELIGIBLE);
    },
  });
}
