import { NextRequest, NextResponse } from 'next/server';

// GET /api/reviews/eligible → NestJS GET /api/v1/reviews/eligible
// Returns checked-out bookings the authenticated guest is eligible to review,
// each including their existing review (if submitted) or null.
export async function GET(request: NextRequest) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/reviews/eligible`, {
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
