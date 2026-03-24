import { NextRequest, NextResponse } from 'next/server';

// POST /api/bookings → NestJS POST /api/v1/bookings
// Creates a booking and returns { booking, paymentUrl } to redirect the guest to Paystack.
export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, unknown>;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json() as Record<string, unknown>;
  return NextResponse.json(data, { status: backendRes.status });
}
