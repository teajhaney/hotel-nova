import { NextRequest, NextResponse } from 'next/server';

// GET /api/notifications → NestJS GET /api/v1/notifications
// Returns the authenticated user's notifications (paginated, filterable).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/notifications${qs ? `?${qs}` : ''}`,
    { headers: { cookie: request.headers.get('cookie') ?? '' } },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
