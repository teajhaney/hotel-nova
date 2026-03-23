import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

// Extend AxiosRequestConfig so we can mark a request as already retried,
// preventing an infinite loop if the retried request also comes back 401.
interface RetryableConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// This is the client-side Axios instance.
// It points to /api — our Next.js Route Handlers — NOT directly to NestJS.
const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Refresh-token machinery ────────────────────────────────────────────────
// Only one refresh call should ever be in flight at a time. If multiple
// requests fail with 401 simultaneously (common when the access token just
// expired), they all queue here and replay once the single refresh finishes.

let isRefreshing = false;

// Each entry is a pair of resolve/reject for a queued request
let pendingQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(error: unknown) {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve()
  );
  pendingQueue = [];
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  // Send admins back to the admin login page, everyone else to /login
  const dest = window.location.pathname.startsWith('/admin')
    ? '/admin/login'
    : '/login';
  window.location.href = dest;
}

// ── Response interceptor ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryableConfig;

    if (
      typeof window !== 'undefined' &&
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      const url = config?.url ?? '';
      const currentPath = window.location.pathname;

      const isAuthMe = url.includes('/auth/me');
      const isOnAuthPage =
        currentPath === '/login' ||
        currentPath === '/signup' ||
        currentPath === '/admin/login' ||
        currentPath === '/admin/signup';

      // These cases should never trigger a refresh attempt:
      //  - /auth/me: expected to fail when not logged in (handled silently)
      //  - auth pages: no point refreshing if we're already on a login screen
      //  - _retry set: request already replayed once — refreshing again won't help
      if (isAuthMe || isOnAuthPage || config?._retry) {
        return Promise.reject(error);
      }

      // Another refresh is already running — queue this request and wait
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => {
            config._retry = true;
            return apiClient(config);
          })
          .catch((err) => Promise.reject(err));
      }

      // We're the first — kick off the refresh
      isRefreshing = true;
      config._retry = true;

      try {
        // Use fetch directly so this call bypasses the interceptor entirely
        const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

        if (!refreshRes.ok) {
          // Refresh token is expired or invalid — user must log in again
          throw new Error('Refresh failed');
        }

        // New cookies are now set in the browser. Unblock queued requests.
        flushQueue(null);

        // Replay the original request with the fresh access token cookie
        return apiClient(config);
      } catch (refreshError) {
        flushQueue(refreshError);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
