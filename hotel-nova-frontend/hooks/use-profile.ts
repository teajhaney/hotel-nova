'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { extractApiError } from '@/lib/api-error';
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
      currentPassword?: string;
      newPassword?: string;
    }) => {
      const { data } = await apiClient.patch<User>('/auth/me', payload);
      return data;
    },
    onError: (err) => {
      toast.error(extractApiError(err, 'Could not save profile. Please try again.'));
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
      toast.error(extractApiError(err, 'Could not delete account. Please try again.'));
    },
  });
}
