import { NextRequest, NextResponse } from 'next/server';

// Proxies POST /api/auth/login → NestJS POST /auth/login
// NestJS sets HttpOnly cookies on its response — we forward the Set-Cookie
// header back to the browser so the cookie lands correctly.
export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, unknown>;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json() as Record<string, unknown>;
  const nextRes = NextResponse.json(data, { status: backendRes.status });

  // Forward the auth cookies (access_token + refresh_token) to the browser
  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    nextRes.headers.set('set-cookie', setCookie);
  }

  return nextRes;
}
