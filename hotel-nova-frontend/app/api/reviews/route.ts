import { NextRequest, NextResponse } from 'next/server';

// POST /api/reviews → NestJS POST /api/v1/reviews
// Submits a new review for a checked-out booking. Sets status to Pending.
export async function POST(request: NextRequest) {
  const body = await request.json() as unknown;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/reviews`, {
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
