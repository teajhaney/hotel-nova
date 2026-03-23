'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetMe } from '@/hooks/use-auth';

// Sits inside QueryClientProvider so it can safely call useQuery hooks.
// It fires GET /api/auth/me once on mount to rehydrate the auth store
// after a hard refresh — the result is cached for 60 s by TanStack Query.
function AuthRehydrator({ children }: { children: React.ReactNode }) {
  useGetMe();
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
