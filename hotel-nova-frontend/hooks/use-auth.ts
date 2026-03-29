'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthResponse, User } from '@/type/api';

// ─── getMe ───────────────────────────────────────────────────────────────────
// Fetches the currently logged-in user from the server using the HttpOnly cookie.
// We call this on app load to rehydrate the auth store after a page refresh.
//
// The Axios interceptor in lib/axios.ts handles 401 → refresh → replay
// transparently. So if the access token expired, the interceptor refreshes it
// and retries the /auth/me call before the response ever reaches this queryFn.
// We only land in the catch block if:
//   (a) The refresh itself failed (session truly dead — e.g. refresh token expired)
//   (b) A non-auth error occurred (network down, server 500, etc.)
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
      } catch {
        // If we're here, the interceptor already tried to refresh and failed,
        // or the error was non-auth. Either way the user has no valid session.
        // Clear the store so the app renders in "logged out" mode — public
        // pages still work, and the user can log in again.
        setUser(null);
        return null;
      }
    },
    // Don't retry — if the interceptor's refresh failed, retrying /auth/me
    // won't help (the session is dead).
    retry: false,
    // Never auto-refetch on a timer. The proactive refresh in Providers.tsx
    // keeps the access token alive. Re-fetching /auth/me unnecessarily would
    // create a new user object reference on each call, causing the refresh
    // interval in AuthRehydrator to reset and breaking the 10-min cadence.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
      // Perform a hard redirect instead of client-side routing to properly reset UI state
      window.location.href = role === 'ADMIN' ? '/admin/login' : '/';
    },
  });
}
