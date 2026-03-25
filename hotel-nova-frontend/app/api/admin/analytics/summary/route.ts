import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/analytics/summary → NestJS GET /api/v1/analytics/summary
// Admin-only: returns the Analytics page stats — total occupancy, average revenue,
// active bookings, guest satisfaction score, 4-week occupancy trends, 12-month
// revenue, and top-5 high-value bookings.
export async function GET(request: NextRequest) {
  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/analytics/summary`,
    { headers: { cookie: request.headers.get('cookie') ?? '' } },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
