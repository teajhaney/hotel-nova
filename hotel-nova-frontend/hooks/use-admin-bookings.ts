'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

// Backend Prisma enum values returned by the API
type ApiBookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'CheckedIn'
  | 'CheckedOut'
  | 'Cancelled';

export type AdminApiBooking = {
  id: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number; // kobo
  status: ApiBookingStatus;
  paymentStatus: string;
  room: {
    id: string;
    name: string;
    type: string;
  };
};

type AdminBookingsResponse = {
  data: AdminApiBooking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type AdminBookingFilters = {
  status?: string;
  page?: number;
  limit?: number;
};

// ─── Status label mapping ─────────────────────────────────────────────────────
// The modal uses human-readable labels; the backend expects Prisma enum values.

export const API_TO_DISPLAY: Record<ApiBookingStatus, string> = {
  Pending:    'Pending',
  Confirmed:  'Confirmed',
  CheckedIn:  'Checked In',
  CheckedOut: 'Checked Out',
  Cancelled:  'Cancelled',
};

export const DISPLAY_TO_API: Record<string, string> = {
  'Pending':     'Pending',
  'Confirmed':   'Confirmed',
  'Checked In':  'CheckedIn',
  'Checked Out': 'CheckedOut',
  'Cancelled':   'Cancelled',
};

// ─── useAdminBookings ─────────────────────────────────────────────────────────
// Fetches all bookings for the admin view with optional status/page filters.
export function useAdminBookings(filters: AdminBookingFilters = {}) {
  return useQuery({
    queryKey: ['admin-bookings', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'All Statuses') {
        params.set('status', DISPLAY_TO_API[filters.status] ?? filters.status);
      }
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));

      const qs = params.toString();
      const { data } = await apiClient.get<AdminBookingsResponse>(
        `/admin/bookings${qs ? `?${qs}` : ''}`,
      );
      return data;
    },
  });
}

// ─── useAdminUpdateBookingStatus ──────────────────────────────────────────────
// Sends the status change to the backend and invalidates the bookings cache.
// Shows a toast on both success and failure.
export function useAdminUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      displayStatus,
    }: {
      id: string;
      displayStatus: string;
    }) => {
      const apiStatus = DISPLAY_TO_API[displayStatus] ?? displayStatus;
      const { data } = await apiClient.patch<AdminApiBooking>(
        `/admin/bookings/${id}/status`,
        { status: apiStatus },
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Booking status updated.');
      void queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
        : undefined;
      toast.error(message ?? 'Could not update booking status.');
    },
  });
}
