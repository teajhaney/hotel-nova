'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useGetMe } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';

// Sits inside QueryClientProvider so it can safely call useQuery hooks.
// It fires GET /api/auth/me once on mount to rehydrate the auth store
// after a hard refresh, then keeps the access token alive proactively.
function AuthRehydrator({ children }: { children: React.ReactNode }) {
  useGetMe();
  const user = useAuthStore((s) => s.user);

  // Use a stable boolean so the effect only re-runs on actual login/logout,
  // NOT every time the user object reference changes (e.g. after a refetch).
  // If we depended on [user] directly, the interval would reset every ~60 s
  // whenever TanStack Query refetched /auth/me — making the cadence unreliable.
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!isLoggedIn) return;

    const refresh = async () => {
      try {
        await fetch('/api/auth/refresh', { method: 'POST' });
      } catch {
        // Silent — the 401 interceptor in lib/axios.ts handles failures
        // when a real API request is made. We never force a logout here.
      }
    };

    // Fire once immediately on login so the 10-min cadence starts fresh,
    // then keep the access token (15 min TTL) renewed well before it expires.
    void refresh();
    const intervalId = window.setInterval(refresh, 10 * 60 * 1000);

    // Also refresh when the user returns to a tab that was in the background —
    // browsers throttle timers on hidden tabs, so the interval may have missed.
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void refresh();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isLoggedIn]);

  return <>{children}</>;
}

// This component exists purely to wrap the app in client-side providers.
// The root layout is a server component, so it can't use hooks or context
// directly — we push that boundary down into this client component instead.
export function Providers({ children }: { children: React.ReactNode }) {
  // useState ensures each browser session gets its own QueryClient instance
  // rather than sharing one across requests on the server.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data fresh for 60 seconds before considering it stale
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthRehydrator>{children}</AuthRehydrator>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}
