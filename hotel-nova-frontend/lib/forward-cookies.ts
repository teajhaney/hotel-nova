import { NextResponse } from 'next/server';

// Copies Set-Cookie headers from a backend fetch response onto a NextResponse
// so the browser receives both the accessToken and refreshToken cookies.
//
// Why this exists:
//   The Fetch API's `headers.get('set-cookie')` merges multiple Set-Cookie
//   headers into one comma-separated string. If the backend sends two cookies
//   (accessToken + refreshToken), that merged string is unparseable as a single
//   cookie — the browser may ignore it or only set one of the two.
//
//   `headers.getSetCookie()` returns them as an array (one entry per cookie).
//   Node 20+ and Vercel's runtime both support it, but we also provide a
//   fallback that splits on ", <name>=" boundaries for older runtimes.
export function forwardCookies(
  backendRes: Response,
  nextRes: NextResponse,
): void {
  // Preferred: getSetCookie() returns each Set-Cookie as a separate string.
  const setCookies = backendRes.headers.getSetCookie?.() ?? [];

  if (setCookies.length > 0) {
    setCookies.forEach((cookie) =>
      nextRes.headers.append('set-cookie', cookie),
    );
    return;
  }

  // Fallback: split the comma-joined string. Set-Cookie values can contain
  // commas inside the Expires attribute (e.g. "Thu, 01 Jan 2026"), so we
  // split on ", " followed by a known cookie name pattern (word chars + "=").
  const raw = backendRes.headers.get('set-cookie');
  if (!raw) return;

  const parts = raw.split(/,\s*(?=\w+=)/);
  parts.forEach((cookie) =>
    nextRes.headers.append('set-cookie', cookie.trim()),
  );
}
