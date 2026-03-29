'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';
import { extractApiError } from '@/lib/api-error';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApiUserRole = 'ADMIN' | 'GUEST';
export type ApiUserStatus = 'Active' | 'Inactive' | 'Suspended';

export type AdminApiUser = {
  id: string;
  email: string;
  fullName: string;
  role: ApiUserRole;
  status: ApiUserStatus;
  createdAt: string; // ISO timestamp from the backend
};

type UsersResponse = {
  data: AdminApiUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type UserFilters = {
  role?: ApiUserRole;
  page?: number;
  limit?: number;
};

// ─── useAdminUsers ────────────────────────────────────────────────────────────
// Fetches all users for the admin view. Optional role filter and pagination.
export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.role) params.set('role', filters.role);
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));

      const qs = params.toString();
      const { data } = await apiClient.get<UsersResponse>(
        `/admin/users${qs ? `?${qs}` : ''}`,
      );
      return data;
    },
  });
}

// ─── useAdminCreateUser ───────────────────────────────────────────────────────
// Creates a new admin account. Shows a toast on success or failure.
export function useAdminCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const { data } = await apiClient.post<AdminApiUser>('/admin/users', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Admin account created successfully.');
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, 'Could not create admin account. Please try again.'));
    },
  });
}

// ─── useAdminUpdateUser ───────────────────────────────────────────────────────
// Updates a user's role or account status.
export function useAdminUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id: string;
      role?: ApiUserRole;
      status?: ApiUserStatus;
    }) => {
      const { id, ...body } = payload;
      const { data } = await apiClient.patch<AdminApiUser>(`/admin/users/${id}`, body);
      return data;
    },
    onSuccess: () => {
      toast.success('User updated successfully.');
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, 'Could not update user. Please try again.'));
    },
  });
}

// ─── useAdminDeleteUser ───────────────────────────────────────────────────────
// Permanently removes a user and all their data from the database.
// The backend returns 204 No Content on success.
export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      toast.success('User permanently deleted.');
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err) => {
      toast.error(extractApiError(err, 'Could not delete user. Please try again.'));
    },
  });
}
