import { NextRequest, NextResponse } from 'next/server';

// POST /api/promo-codes/validate → NestJS POST /api/v1/promo-codes/validate
// Public: validates a promo code and returns the discount type and value.
// Used in the booking wizard so guests can apply a promo code before checkout.
export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/promo-codes/validate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') ?? '',
      },
      body: JSON.stringify(body),
    },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
