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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('accessToken')?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role;

  // ── Root page (/) ───────────────────────────────────────────────────────
  // Admins have no reason to be on the guest-facing marketing homepage —
  // send them straight to the admin dashboard.
  // Guests are welcome to browse the home page while logged in.
  if (pathname === '/' && token && role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin/overview', request.url));
  }

  // ── Admin auth pages (/admin/login, /admin/signup) ──────────────────────
  // If already logged in as admin, no need to show the login page again.
  const isAdminAuthPage =
    pathname === '/admin/login' || pathname === '/admin/signup';

  if (isAdminAuthPage) {
    if (token && role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/overview', request.url));
    }
    return NextResponse.next();
  }
 
  // ── Admin protected routes (/admin/*) ───────────────────────────────────
  // Must be logged in as ADMIN. Anyone else gets sent to the admin login page.
  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Guest auth pages (/login, /signup) ──────────────────────────────────
  // If already logged in as a guest, send them to the homepage.
  const isGuestAuthPage = pathname === '/login' || pathname === '/signup';

  if (isGuestAuthPage) {
    if (token && role === 'GUEST') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // ── Rooms browsing page (/rooms, /rooms/*) ──────────────────────────────
  // Must be logged in (any role). Unauthenticated visitors get sent to login.
  if (pathname.startsWith('/rooms')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Guest protected routes (/dashboard/*) ───────────────────────────────
  // Must be logged in as GUEST. Redirect to login with a `redirect` param
  // so the user lands back where they were after signing in.
  if (pathname.startsWith('/dashboard')) {
    if (!token || role !== 'GUEST') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── Booking pages that require guest auth ────────────────────────────────
  const isProtectedBookingPage =
    pathname === '/book/payment' || pathname === '/book/confirmation';

  if (isProtectedBookingPage) {
    if (!token || role !== 'GUEST') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
