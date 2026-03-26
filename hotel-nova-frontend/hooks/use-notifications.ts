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

// ─── useNotifications ────────────────────────────────────────────────────────
// Fetches the user's notifications filtered by tab (all / unread / archived).
// Also sets up a Socket.io listener so new notifications appear in real-time
// without a manual refetch.
export function useNotifications(tab: 'all' | 'unread' | 'archived') {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Build the query string based on the active tab
  const params = new URLSearchParams();
  if (tab === 'unread') params.set('read', 'false');
  if (tab === 'archived') params.set('archived', 'true');
  const qs = params.toString();

  const query = useQuery<NotificationsPage>({
    queryKey: KEYS.list(tab),
    queryFn: async () => {
      const { data } = await apiClient.get<NotificationsPage>(
        `/notifications${qs ? `?${qs}` : ''}`,
      );
      return data;
    },
    enabled: !!user,
  });

  // ── Socket.io listener ─────────────────────────────────────────────────
  // When a new notification arrives via WebSocket, we prepend it to the
  // cached list and bump the unread count. This avoids a full refetch and
  // makes the UI feel instant.
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    const handleNotification = (notification: Notification) => {
      // Invalidate all notification queries so every tab is fresh
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Show a toast so the user knows even if they're not on the notifications page
      toast.info(notification.title, {
        description: notification.message,
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [user, queryClient]);

  return query;
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
