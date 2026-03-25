import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/promo-codes → NestJS GET /api/v1/promo-codes
// Admin-only: returns paginated promo codes with optional status filter.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/promo-codes${qs ? `?${qs}` : ''}`,
    { headers: { cookie: request.headers.get('cookie') ?? '' } },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}

// POST /api/admin/promo-codes → NestJS POST /api/v1/promo-codes
// Admin-only: creates a new promo code.
export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/promo-codes`, {
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
