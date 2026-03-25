'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { OverviewStats, AnalyticsSummary } from '@/type/api';

// ─── useOverviewStats ─────────────────────────────────────────────────────────
// Admin: fetches the Overview page stats — occupancy rate, today's check-ins and
// check-outs, daily revenue, 7-day occupancy trend, 6-month revenue, and the
// next 10 upcoming check-ins.
// Refreshes every 60 seconds so the dashboard stays up to date.
export function useOverviewStats() {
  return useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const { data } = await apiClient.get<OverviewStats>(
        '/admin/analytics/overview',
      );
      return data;
    },
    refetchInterval: 60_000,
  });
}

// ─── useAnalyticsSummary ──────────────────────────────────────────────────────
// Admin: fetches the Analytics page stats — total occupancy, average revenue,
// active bookings, guest satisfaction, 4-week occupancy trends, 12-month
// revenue breakdown, and top-5 high-value bookings.
export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await apiClient.get<AnalyticsSummary>(
        '/admin/analytics/summary',
      );
      return data;
    },
  });
}
