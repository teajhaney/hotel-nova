import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/admin/bookings/:id/status → NestJS PATCH /api/v1/bookings/:id/status
// Admin-only: updates the booking status. The backend validates the transition
// (e.g. Pending → Confirmed is valid; CheckedOut → Pending is not).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json() as unknown;

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/bookings/${id}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') ?? '',
      },
      body: JSON.stringify(body),
    },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
