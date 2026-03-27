import { NextRequest, NextResponse } from 'next/server';
import { forwardCookies } from '@/lib/forward-cookies';

// POST /api/auth/signup → NestJS POST /api/v1/auth/signup
export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await backendRes.json()) as Record<string, unknown>;
  const nextRes = NextResponse.json(data, { status: backendRes.status });

  forwardCookies(backendRes, nextRes);

  return nextRes;
}
