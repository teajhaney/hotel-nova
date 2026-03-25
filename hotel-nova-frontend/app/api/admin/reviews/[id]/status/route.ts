import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/admin/reviews/:id/status → NestJS PATCH /api/v1/reviews/:id/status
// Admin-only: changes a review's moderation status (Pending → Approved or Hidden).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json() as unknown;

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/reviews/${id}/status`,
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
