'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useGetMe } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';
import { refreshTokens } from '@/lib/axios';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { useGlobalNotificationListener } from '@/hooks/use-notifications';

// Sits inside QueryClientProvider so it can safely call useQuery hooks.
// It fires GET /api/auth/me once on mount to rehydrate the auth store
// after a hard refresh, then keeps the access token alive proactively.
function AuthRehydrator({ children }: { children: React.ReactNode }) {
  useGetMe();

  // Global Socket.io listener — shows toast notifications and invalidates
  // caches on EVERY page, not just the notifications page.
  useGlobalNotificationListener();
  const user = useAuthStore((s) => s.user);

  // Use a stable boolean so the effect only re-runs on actual login/logout,
  // NOT every time the user object reference changes (e.g. after a refetch).
  // If we depended on [user] directly, the interval would reset every ~60 s
  // whenever TanStack Query refetched /auth/me — making the cadence unreliable.
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!isLoggedIn) return;

    // refreshTokens() is the shared, lock-protected refresh function from
    // lib/axios.ts. Using it here (instead of raw fetch) ensures that if
    // the Axios interceptor is already refreshing (e.g. a stale query just
    // got a 401), we piggyback on that call instead of firing a second one.
    // Two simultaneous refreshes would race — the loser sends a token that
    // was already rotated and gets a 401.
    const refresh = async () => {
      try {
        await refreshTokens();
      } catch {
        // Silent — the 401 interceptor in lib/axios.ts handles failures
        // when a real API request is made. We never force a logout here.
      }
    };

    // Connect the Socket.io client for real-time notifications.
    // connectSocket() fetches the JWT via a same-origin Route Handler and
    // passes it in the handshake auth — required for cross-domain deployments.
    void connectSocket();

    // No immediate refresh call — by the time isLoggedIn becomes true, useGetMe
    // has already resolved (access token is fresh). Firing immediately would
    // just waste a token rotation for no benefit.
    //
    // Refresh every 10 minutes. The access token lives for 15 minutes, so this
    // fires comfortably before expiry. If the user makes no API calls in the
    // 5-minute gap between refresh and expiry, the next proactive refresh or
    // the visibility-change handler will catch it.
    const intervalId = window.setInterval(refresh, 10 * 60 * 1000);

    // Also refresh when the user returns to a tab that was in the background.
    // Browsers throttle/pause setInterval on hidden tabs, so the 10-min
    // interval may have missed while the tab was inactive. The 15-min access
    // token could be expired by now, but the 7-day refresh token is still
    // valid — this call renews the pair so the next API request succeeds
    // without hitting a 401 first.
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void refresh();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      disconnectSocket();
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
