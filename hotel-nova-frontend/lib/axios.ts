import axios from 'axios';

// This is the client-side Axios instance.
// It points to /api — our Next.js Route Handlers — NOT directly to NestJS.
// The Route Handlers run on the server and proxy the request to NestJS,
// forwarding the HttpOnly auth cookie along the way.
const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// If the server returns a 401 (token expired or not logged in),
// kick the user back to the appropriate login page automatically.
// Exceptions:
//  - /api/auth/me: a 401 here just means the user isn't logged in yet,
//    not an error we need to act on (useGetMe handles it silently)
//  - Already on a login/signup page: no need to redirect in circles
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      const requestUrl = error.config?.url ?? '';
      const currentPath = window.location.pathname;
      const isAuthCheck = requestUrl.includes('/auth/me');
      const isAlreadyOnAuthPage =
        currentPath === '/login' ||
        currentPath === '/signup' ||
        currentPath === '/admin/login' ||
        currentPath === '/admin/signup';

      if (!isAuthCheck && !isAlreadyOnAuthPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
