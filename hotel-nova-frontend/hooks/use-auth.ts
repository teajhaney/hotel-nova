'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthResponse, User } from '@/type/api';

// ─── getMe ───────────────────────────────────────────────────────────────────
// Fetches the currently logged-in user from the server using the HttpOnly cookie.
// We call this on app load to rehydrate the auth store after a page refresh.
export function useGetMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  const query = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get<User>('/auth/me');
        setUser(data);
        return data;
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 401) {
          try {
            const refreshRes = await fetch('/api/auth/refresh', {
              method: 'POST',
            });
            if (refreshRes.ok) {
              const { data } = await apiClient.get<User>('/auth/me');
              setUser(data);
              return data;
            }
          } catch {
            // fall through to null
          }

          setUser(null);
          return null;
        }

        throw err;
      }
    },
    // Don't retry on 401 — it just means the user isn't logged in
    retry: false,
    // Don't refetch just because the window gets focus
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.status === 'success' || query.status === 'error') {
      setHydrated(true);
    }
  }, [query.status, setHydrated]);

  return query;
}

// ─── login ───────────────────────────────────────────────────────────────────
// expectedRole enforces which login page a user is allowed to sign in on.
// If the returned role doesn't match (e.g. an admin trying the guest page),
// we throw ROLE_MISMATCH before onSuccess ever runs so the form can show
// a generic "Invalid credentials" message without leaking role information.
export function useLogin(expectedRole: 'GUEST' | 'ADMIN') {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
    }) => {
      const { data } = await apiClient.post<AuthResponse>(
        '/auth/login',
        credentials,
      );
      // Block cross-role logins before the success handler runs
      if (data.user.role !== expectedRole) {
        throw new Error('ROLE_MISMATCH');
      }
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      // Seed the cache so useGetMe doesn't refetch immediately after login
      void queryClient.setQueryData(['auth', 'me'], data.user);

      // If the middleware redirected here with a ?redirect= param, send the
      // user back to where they were trying to go. Otherwise use the default.
      const redirectTo = searchParams.get('redirect');

      if (data.user.role === 'ADMIN') {
        router.push(redirectTo ?? '/admin/overview');
      } else {
        router.push(redirectTo ?? '/');
      }
    },
  });
}

// ─── signup ──────────────────────────────────────────────────────────────────
export function useSignup() {
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      fullName: string;
      email: string;
      password: string;
      role: 'GUEST' | 'ADMIN';
    }) => {
      const { data } = await apiClient.post<AuthResponse>(
        '/auth/signup',
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      void queryClient.setQueryData(['auth', 'me'], data.user);

      const redirectTo = searchParams.get('redirect');

      if (data.user.role === 'ADMIN') {
        router.push(redirectTo ?? '/admin/overview');
      } else {
        router.push(redirectTo ?? '/');
      }
    },
  });
}

// ─── logout ──────────────────────────────────────────────────────────────────
export function useLogout() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      // Capture role before clearing — the store will be empty after clearUser()
      const role = user?.role;
      clearUser();
      // Wipe all cached queries so stale data doesn't linger after logout
      queryClient.clear();
      // Admins go back to the admin login page; guests go home
      router.push(role === 'ADMIN' ? '/admin/login' : '/');
    },
  });
}
