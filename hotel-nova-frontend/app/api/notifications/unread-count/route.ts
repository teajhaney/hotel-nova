import { NextRequest, NextResponse } from 'next/server';

// GET /api/notifications/unread-count → NestJS GET /api/v1/notifications/unread-count
// Returns { count: number } for the notification badge.
export async function GET(request: NextRequest) {
  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/notifications/unread-count`,
    { headers: { cookie: request.headers.get('cookie') ?? '' } },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
