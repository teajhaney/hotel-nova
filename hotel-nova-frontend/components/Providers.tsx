'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetMe } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';

// Sits inside QueryClientProvider so it can safely call useQuery hooks.
// It fires GET /api/auth/me once on mount to rehydrate the auth store
// after a hard refresh — the result is cached for 60 s by TanStack Query.
function AuthRehydrator({ children }: { children: React.ReactNode }) {
  useGetMe();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const refresh = async () => {
      try {
        await fetch('/api/auth/refresh', { method: 'POST' });
      } catch {
        // Ignore — interceptor or next request will handle auth failures
      }
    };

    // Refresh immediately, then on a steady cadence
    void refresh();
    const intervalId = window.setInterval(refresh, 10 * 60 * 1000);

    const handleFocus = () => void refresh();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void refresh();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user]);

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
    </QueryClientProvider>
  );
}
