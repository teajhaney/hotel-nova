import { NextRequest, NextResponse } from 'next/server';
import { forwardCookies } from '@/lib/forward-cookies';

// POST /api/auth/logout → NestJS POST /api/v1/auth/logout
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

  const data = (await backendRes.json()) as Record<string, unknown>;
  const nextRes = NextResponse.json(data, { status: backendRes.status });

  forwardCookies(backendRes, nextRes);

  return nextRes;
}
