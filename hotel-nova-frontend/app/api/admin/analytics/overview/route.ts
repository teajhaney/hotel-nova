import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/analytics/overview → NestJS GET /api/v1/analytics/overview
// Admin-only: returns the Overview page stats — occupancy rate, today's check-ins
// and check-outs, daily revenue, 7-day occupancy trend, 6-month revenue, and
// the next 10 upcoming check-ins.
export async function GET(request: NextRequest) {
  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/analytics/overview`,
    { headers: { cookie: request.headers.get('cookie') ?? '' } },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
