import { NextRequest, NextResponse } from 'next/server';
import { forwardCookies } from '@/lib/forward-cookies';

// POST /api/auth/refresh → NestJS POST /api/v1/auth/refresh
// Forwards the refreshToken cookie to the backend. If valid, the backend
// rotates it and responds with Set-Cookie headers containing a fresh
// accessToken + refreshToken pair, which we pass back to the browser.
export async function POST(request: NextRequest) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
    method: 'POST',
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  const data = (await backendRes.json()) as Record<string, unknown>;
  const nextRes = NextResponse.json(data, { status: backendRes.status });

  forwardCookies(backendRes, nextRes);

  return nextRes;
}
