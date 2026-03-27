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
// callers try to refresh simultaneously (the Axios interceptor, the
// proactive interval, or the visibilitychange handler), they all funnel
// through refreshTokens() which uses the isRefreshing lock to ensure a
// single network call. Without this, two simultaneous refreshes would race:
// the first rotates the token, the second sends the now-deleted old token
// and gets a 401 — potentially logging the user out.

let isRefreshing = false;

// Each entry is a pair of resolve/reject for a caller waiting on an
// in-flight refresh
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

// Calls POST /api/auth/refresh exactly once, even if invoked concurrently.
// Returns a promise that resolves when fresh cookies are set, or rejects
// if the refresh token is expired/invalid.
// Used by: the Axios 401 interceptor, the proactive interval in
// AuthRehydrator, and the visibilitychange handler.
export async  function refreshTokens(): Promise<void> {
  // Another refresh is already in flight — piggyback on it
  if (isRefreshing) {
    return new Promise<void>((resolve, reject) => {
      pendingQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  // Use raw fetch so this call bypasses the Axios interceptor entirely
  // (otherwise a 401 response from the refresh endpoint would trigger
  // another refresh attempt — infinite loop).
  // credentials: 'include' ensures the browser sends the HttpOnly
  // refreshToken cookie with the request — required for the Route Handler
  // to forward it to the NestJS backend.
  return fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
    .then((res) => {
      if (!res.ok) throw new Error('Refresh failed');
      flushQueue(null);
    })
    .catch((err) => {
      flushQueue(err);
      throw err;
    })
    .finally(() => {
      isRefreshing = false;
    });
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

      // isAuthMe: the /auth/me endpoint is called on every page load to
      // rehydrate the user. If the access token has expired, it returns 401.
      // We DO want to refresh in that case so the user stays logged in after
      // a page reload. If the refresh also fails, we silently reject without
      // redirecting (the user just isn't logged in — could be a public page).
      const isAuthMe = url.includes('/auth/me');

      const isOnAuthPage =
        currentPath === '/login' ||
        currentPath === '/signup' ||
        currentPath === '/admin/login' ||
        currentPath === '/admin/signup';

      // Don't try to refresh if:
      //  - we're already on a login screen (no point)
      //  - this request has already been retried once (refresh didn't help)
      if (isOnAuthPage || config?._retry) {
        return Promise.reject(error);
      }

      config._retry = true;

      try {
        // refreshTokens() handles the "only one in flight" lock internally.
        // If the proactive refresh in AuthRehydrator is already running,
        // this call simply waits for it instead of firing a duplicate.
        await refreshTokens();

        // New cookies are now set in the browser — replay the original request
        return apiClient(config);
      } catch (refreshError) {
        // For /auth/me failures, don't force a redirect — a failed refresh
        // here just means the user has no session (e.g. first visit, or
        // truly expired). Redirecting would break public pages.
        if (!isAuthMe) {
          redirectToLogin();
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
