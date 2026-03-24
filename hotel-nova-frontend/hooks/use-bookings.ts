'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type {
  ApiBooking,
  CreateBookingPayload,
  CreateBookingApiResponse,
} from '@/type/type';

// ─── useCreateBooking ─────────────────────────────────────────────────────────
// Sends the booking request to our Next.js Route Handler (/api/bookings),
// which proxies it to NestJS. NestJS creates the DB record and returns a
// Paystack authorization_url to redirect the guest to for payment.
export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: CreateBookingPayload) => {
      const { data } = await apiClient.post<CreateBookingApiResponse>(
        '/bookings',
        payload,
      );
      return data;
    },
  });
}

// ─── useMyBookings ────────────────────────────────────────────────────────────
// Fetches the authenticated guest's bookings from GET /api/bookings/my.
// refetchInterval: 30s — means the guest sees status changes (e.g. admin
// confirms a booking) within 30 seconds without needing to reload the page.
export function useMyBookings() {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiBooking[]>('/bookings/my');
      return data;
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

// ─── useCancelBooking ─────────────────────────────────────────────────────────
// Sends a PATCH request to cancel a specific booking.
// Only Pending and Confirmed bookings can be cancelled — the backend enforces this.
// On success we invalidate the bookings cache so the list updates automatically.
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await apiClient.patch<ApiBooking>(
        `/bookings/${bookingId}/cancel`,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
}
