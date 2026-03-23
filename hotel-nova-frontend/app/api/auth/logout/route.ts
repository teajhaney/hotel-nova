import { NextRequest, NextResponse } from 'next/server';

// Proxies POST /api/auth/logout → NestJS POST /auth/logout
// NestJS clears the cookies — we forward the cleared Set-Cookie back to the browser.
export async function POST(request: NextRequest) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Forward the browser's cookies so NestJS knows which session to clear
      cookie: request.headers.get('cookie') ?? '',
    },
  });

  const data = await backendRes.json() as Record<string, unknown>;
  const nextRes = NextResponse.json(data, { status: backendRes.status });

  const setCookies = backendRes.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    setCookies.forEach((cookie) => nextRes.headers.append('set-cookie', cookie));
  } else {
    // Fallback for runtimes that don't have getSetCookie()
    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) nextRes.headers.set('set-cookie', setCookie);
  }

  return nextRes;
}
