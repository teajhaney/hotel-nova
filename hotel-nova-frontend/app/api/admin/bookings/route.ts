import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/bookings → NestJS GET /api/v1/bookings
// Admin-only: returns all bookings with optional filters and pagination.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/bookings${qs ? `?${qs}` : ''}`,
    {
      headers: { cookie: request.headers.get('cookie') ?? '' },
    },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
