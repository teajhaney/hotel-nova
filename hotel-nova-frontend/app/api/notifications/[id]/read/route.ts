import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/notifications/:id/read → NestJS PATCH /api/v1/notifications/:id/read
// Marks a single notification as read.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/notifications/${id}/read`,
    {
      method: 'PATCH',
      headers: { cookie: request.headers.get('cookie') ?? '' },
    },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
