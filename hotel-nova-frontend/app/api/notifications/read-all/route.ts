import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/notifications/read-all → NestJS PATCH /api/v1/notifications/read-all
// Marks all unread notifications as read. Returns { updated: number }.
export async function PATCH(request: NextRequest) {
  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/notifications/read-all`,
    {
      method: 'PATCH',
      headers: { cookie: request.headers.get('cookie') ?? '' },
    },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
