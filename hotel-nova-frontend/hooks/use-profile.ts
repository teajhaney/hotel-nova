'use client';

import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import type { User } from '@/type/api';

// ─── useUpdateProfile ─────────────────────────────────────────────────────────
// Sends the updated profile fields (name, phone, country) to the backend and
// returns the refreshed User object so the caller can update the auth store.
export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (payload: {
      fullName?: string;
      phone?: string;
      country?: string;
    }) => {
      const { data } = await apiClient.patch<User>('/auth/me', payload);
      return data;
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
        : undefined;
      toast.error(message ?? 'Could not save profile. Please try again.');
    },
  });
}

// ─── useDeleteAccount ─────────────────────────────────────────────────────────
// Permanently deletes the caller's own account. The backend returns 204.
// After a successful delete, the caller is responsible for clearing the auth
// store and redirecting the user to the home page.
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete('/auth/me');
    },
    onError: (err) => {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message
        : undefined;
      toast.error(message ?? 'Could not delete account. Please try again.');
    },
  });
}
