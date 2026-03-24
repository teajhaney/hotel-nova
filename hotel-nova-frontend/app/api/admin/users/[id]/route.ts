import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/admin/users/:id → NestJS PATCH /api/v1/auth/users/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json() as unknown;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/users/${id}`, {
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

// DELETE /api/admin/users/:id → NestJS DELETE /api/v1/auth/users/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/users/${id}`, {
    method: 'DELETE',
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  // 204 No Content has no body — return an empty response with the same status
  if (backendRes.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
