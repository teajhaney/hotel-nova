import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/users → NestJS GET /api/v1/auth/users
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/auth/users${qs ? `?${qs}` : ''}`,
    { headers: { cookie: request.headers.get('cookie') ?? '' } },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}

// POST /api/admin/users → NestJS POST /api/v1/auth/users
export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
