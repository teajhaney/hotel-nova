import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/reviews/:id → NestJS PATCH /api/v1/reviews/:id
// Guest edits their own review. Only Pending reviews can be edited.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json() as unknown;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/reviews/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
