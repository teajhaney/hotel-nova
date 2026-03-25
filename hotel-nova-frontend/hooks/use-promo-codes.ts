'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { PromoCode, PromoCodesPage } from '@/type/api';

const PROMO_PAGE_SIZE = 10;

// ─── useAdminPromoCodes ───────────────────────────────────────────────────────
// Admin: fetches a paginated list of promo codes (10 per page).
// `page` is 1-based. `status` filters to Active / Inactive / Scheduled.
// The query key includes both so switching tab or page triggers a fresh fetch.
export function useAdminPromoCodes(status?: string, page = 1) {
  return useQuery({
    queryKey: ['admin-promo-codes', status, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(PROMO_PAGE_SIZE),
        page: String(page),
      });
      if (status) params.set('status', status);
      const { data } = await apiClient.get<PromoCodesPage>(
        `/admin/promo-codes?${params.toString()}`,
      );
      return data;
    },
  });
}

// ─── useCreatePromoCode ───────────────────────────────────────────────────────
// Admin: creates a new promo code. On success the list is refreshed.
export function useCreatePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      code: string;
      description: string;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
      usageLimit: number;
      validFrom: string;
      validTo: string;
      status?: string;
    }) => {
      const { data } = await apiClient.post<PromoCode>('/admin/promo-codes', payload);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
    },
  });
}

// ─── useUpdatePromoCode ───────────────────────────────────────────────────────
// Admin: updates an existing promo code by ID. On success the list is refreshed.
export function useUpdatePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      code?: string;
      description?: string;
      discountType?: 'percentage' | 'fixed';
      discountValue?: number;
      usageLimit?: number;
      validFrom?: string;
      validTo?: string;
      status?: string;
    }) => {
      const { id, ...body } = payload;
      const { data } = await apiClient.patch<PromoCode>(
        `/admin/promo-codes/${id}`,
        body,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
    },
  });
}

// ─── useDeletePromoCode ───────────────────────────────────────────────────────
// Admin: permanently deletes a promo code by ID. On success the list is refreshed.
export function useDeletePromoCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/promo-codes/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
    },
  });
}
