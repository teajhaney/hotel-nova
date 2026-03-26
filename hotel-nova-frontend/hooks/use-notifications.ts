'use client';

import { useEffect } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import type { Notification, NotificationsPage } from '@/type/api';

// ─── Query keys ──────────────────────────────────────────────────────────────
const KEYS = {
  list: (tab: string) => ['notifications', tab],
  unread: ['notifications', 'unread-count'],
} as const;

// ─── useGlobalNotificationListener ──────────────────────────────────────────
// GLOBAL Socket.io listener — mount this ONCE in Providers.tsx so every page
// (not just the notifications page) receives real-time toasts and cache
// invalidation. When a WebSocket "notification" event arrives:
//   1. Show a toast (visible on every page)
//   2. Invalidate notification queries (list + unread count)
//   3. Invalidate bookings + reviews queries so the guest/admin sees changes
//      instantly without waiting for the next poll tick
export function useGlobalNotificationListener() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    const handleNotification = (notification: Notification) => {
      // Refresh all notification-related caches
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Refresh bookings + reviews so status changes appear instantly
      // on the guest dashboard and admin dashboard
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['eligible-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });

      // Show a toast so the user knows — visible on ANY page
      toast.info(notification.title, {
        description: notification.message,
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [user, queryClient]);
}

// ─── useNotifications ────────────────────────────────────────────────────────
// Fetches the user's notifications filtered by tab (all / unread / archived).
// The socket listener has been moved to useGlobalNotificationListener above,
// so this hook is now purely a data-fetching hook.
export function useNotifications(tab: 'all' | 'unread' | 'archived') {
  const user = useAuthStore((s) => s.user);

  // Build the query string based on the active tab
  const params = new URLSearchParams();
  if (tab === 'unread') params.set('read', 'false');
  if (tab === 'archived') params.set('archived', 'true');
  const qs = params.toString();

  return useQuery<NotificationsPage>({
    queryKey: KEYS.list(tab),
    queryFn: async () => {
      const { data } = await apiClient.get<NotificationsPage>(
        `/notifications${qs ? `?${qs}` : ''}`,
      );
      return data;
    },
    enabled: !!user,
  });
}

// ─── useUnreadCount ──────────────────────────────────────────────────────────
// Powers the notification badge in the sidebar. Polls every 60 seconds as a
// fallback in case the WebSocket connection drops.
export function useUnreadCount() {
  const user = useAuthStore((s) => s.user);

  return useQuery<{ count: number }>({
    queryKey: KEYS.unread,
    queryFn: async () => {
      const { data } = await apiClient.get<{ count: number }>(
        '/notifications/unread-count',
      );
      return data;
    },
    enabled: !!user,
    refetchInterval: 60_000,
  });
}

// ─── useMarkRead ─────────────────────────────────────────────────────────────
export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<Notification>(
        `/notifications/${id}/read`,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ─── useMarkAllRead ──────────────────────────────────────────────────────────
export function useMarkAllRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.patch<{ updated: number }>(
        '/notifications/read-all',
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// ─── useArchiveNotification ──────────────────────────────────────────────────
export function useArchiveNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<Notification>(
        `/notifications/${id}/archive`,
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
