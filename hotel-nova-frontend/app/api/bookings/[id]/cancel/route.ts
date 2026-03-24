import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/bookings/:id/cancel → NestJS PATCH /api/v1/bookings/:id/cancel
// Cancels a guest's booking. Only Pending and Confirmed bookings can be cancelled.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/bookings/${id}/cancel`,
    {
      method: 'PATCH',
      headers: { cookie: request.headers.get('cookie') ?? '' },
    },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
