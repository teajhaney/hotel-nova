import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/admin/promo-codes/:id → NestJS PATCH /api/v1/promo-codes/:id
// Admin-only: updates an existing promo code.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json() as unknown;

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/promo-codes/${id}`,
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

// DELETE /api/admin/promo-codes/:id → NestJS DELETE /api/v1/promo-codes/:id
// Admin-only: permanently deletes a promo code.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/promo-codes/${id}`,
    {
      method: 'DELETE',
      headers: { cookie: request.headers.get('cookie') ?? '' },
    },
  );

  if (backendRes.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
