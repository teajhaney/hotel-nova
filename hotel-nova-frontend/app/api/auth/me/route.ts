import { NextRequest, NextResponse } from 'next/server';

// Proxies GET /api/auth/me → NestJS GET /auth/me
// Used to rehydrate the auth store on page load.
export async function GET(request: NextRequest) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
    headers: {
      cookie: request.headers.get('cookie') ?? '',
    },
  });

  const data = await backendRes.json() as Record<string, unknown>;
  return NextResponse.json(data, { status: backendRes.status });
}
