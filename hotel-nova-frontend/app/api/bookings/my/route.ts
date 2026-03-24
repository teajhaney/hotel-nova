import { NextRequest, NextResponse } from 'next/server';

// GET /api/bookings/my → NestJS GET /api/v1/bookings/my
// Returns the authenticated guest's bookings, most recent first.
export async function GET(request: NextRequest) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/bookings/my`, {
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
