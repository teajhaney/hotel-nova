import { NextRequest, NextResponse } from 'next/server';

// Proxies POST /api/auth/signup → NestJS POST /auth/signup
export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, unknown>;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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
