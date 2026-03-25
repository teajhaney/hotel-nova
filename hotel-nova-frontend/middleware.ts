import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Decodes the JWT payload without verifying the signature.
// We only use this for routing decisions — the backend always verifies
// the real signature on every API call, so this is safe.
function decodeJwtPayload(
  token: string,
): { role?: string; exp?: number } | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    // atob is available in the Next.js edge runtime
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded) as { role?: string; exp?: number };
  } catch {
    return null;
  }
}

// Extracts the raw token value from a "name=value; ..." Set-Cookie string.
function extractCookieValue(setCookieHeader: string, name: string): string | null {
  const prefix = `${name}=`;
  if (!setCookieHeader.startsWith(prefix)) return null;
  return setCookieHeader.split(';')[0]?.slice(prefix.length) ?? null;
}

// Attempts a server-side token refresh by calling the NestJS backend directly.
// Returns the new Set-Cookie strings and the decoded role, or null on failure.
// This is called from the middleware when the access token is missing/expired
// but a refresh token cookie is present — allowing seamless session recovery
// without bouncing the user to the login page.
async function attemptRefresh(
  request: NextRequest,
): Promise<{ role: string | undefined; setCookies: string[] } | null> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) return null;

  try {
    const refreshRes = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: { cookie: request.headers.get('cookie') ?? '' },
    });

    if (!refreshRes.ok) return null;

    // Pull all Set-Cookie headers (both accessToken and refreshToken)
    const setCookies = refreshRes.headers.getSetCookie?.() ?? [];

    // Extract the new access token so we can read the role from its payload.
    // The token value lives before the first ';' in the cookie string.
    let role: string | undefined;
    for (const cookie of setCookies) {
      const tokenValue = extractCookieValue(cookie, 'accessToken');
      if (tokenValue) {
        role = decodeJwtPayload(tokenValue)?.role;
        break;
      }
    }

    return { role, setCookies };
  } catch {
    return null;
  }
}

// Attaches a list of Set-Cookie strings to a NextResponse.
function applyCookies(response: NextResponse, cookies: string[]): NextResponse {
  cookies.forEach((cookie) => response.headers.append('set-cookie', cookie));
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken  = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const payload = accessToken ? decodeJwtPayload(accessToken) : null;

  // Treat the token as expired if its exp timestamp is in the past.
  // If the cookie was already deleted by the browser (maxAge elapsed), accessToken
  // is undefined and we also consider it expired.
  const isExpired =
    !payload ||
    (payload.exp !== undefined && payload.exp * 1000 < Date.now());

  let role = payload?.role;
  let newCookies: string[] = [];

  // ── Transparent token refresh ────────────────────────────────────────────
  // When the 15-min access token cookie has expired, the browser deletes it.
  // Rather than immediately redirecting the user to login, we attempt a silent
  // refresh using the 7-day refresh token. If it succeeds, we carry on as if
  // the user was never expired — their session is seamlessly extended and the
  // new cookies are attached to the response.
  if (isExpired && refreshToken) {
    const refreshed = await attemptRefresh(request);
    if (refreshed) {
      role = refreshed.role;
      newCookies = refreshed.setCookies;
    }
  }

  // Helper: wrap a redirect with the new cookies (if any) so the browser
  // receives the fresh token pair even when it's being redirected.
  function redirect(url: URL): NextResponse {
    return applyCookies(NextResponse.redirect(url), newCookies);
  }

  function next(): NextResponse {
    return applyCookies(NextResponse.next(), newCookies);
  }

  // ── Root page (/) ───────────────────────────────────────────────────────
  // Admins have no reason to be on the guest-facing marketing homepage —
  // send them straight to the admin dashboard.
  // Guests are welcome to browse the home page while logged in.
  if (pathname === '/' && role === 'ADMIN') {
    return redirect(new URL('/admin/overview', request.url));
  }

  // ── Admin auth pages (/admin/login, /admin/signup) ──────────────────────
  // If already logged in as admin, no need to show the login page again.
  const isAdminAuthPage =
    pathname === '/admin/login' || pathname === '/admin/signup';

  if (isAdminAuthPage) {
    if (role === 'ADMIN') {
      return redirect(new URL('/admin/overview', request.url));
    }
    return next();
  }

  // ── Admin protected routes (/admin/*) ───────────────────────────────────
  // Must be logged in as ADMIN. Anyone else gets sent to the admin login page.
  if (pathname.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return redirect(loginUrl);
    }
    return next();
  }

  // ── Guest auth pages (/login, /signup) ──────────────────────────────────
  // If already logged in as a guest, send them to the homepage.
  const isGuestAuthPage = pathname === '/login' || pathname === '/signup';

  if (isGuestAuthPage) {
    if (role === 'GUEST') {
      return redirect(new URL('/', request.url));
    }
    return next();
  }

  // ── Rooms browsing page (/rooms, /rooms/*) ──────────────────────────────
  // Public — anyone can browse rooms without logging in.

  // ── Guest protected routes (/dashboard/*) ───────────────────────────────
  // Must be logged in as GUEST. Redirect to login with a `redirect` param
  // so the user lands back where they were after signing in.
  if (pathname.startsWith('/dashboard')) {
    if (role !== 'GUEST') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return redirect(loginUrl);
    }
    return next();
  }

  // ── Booking pages — all require guest auth ──────────────────────────────
  // /book/confirmation is intentionally excluded: after Paystack redirects the
  // browser back, the 15-min access token may have expired. The confirmation
  // page only reads from the Zustand store (sessionStorage) and Paystack's
  // ?reference= query param — it never makes an authenticated API call.
  if (pathname.startsWith('/book') && !pathname.startsWith('/book/confirmation')) {
    if (role !== 'GUEST') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return redirect(loginUrl);
    }
  }

  return next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
