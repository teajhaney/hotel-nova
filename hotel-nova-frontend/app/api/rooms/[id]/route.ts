import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// GET    /api/rooms/:id  → NestJS GET    /rooms/:id
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/rooms/${id}`, {
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  const data = await backendRes.json() as Record<string, unknown>;
  return NextResponse.json(data, { status: backendRes.status });
}

// PATCH  /api/rooms/:id  → NestJS PATCH  /rooms/:id  (admin only)
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json() as Record<string, unknown>;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/rooms/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json() as Record<string, unknown>;
  return NextResponse.json(data, { status: backendRes.status });
}

// DELETE /api/rooms/:id  → NestJS DELETE /rooms/:id  (admin only)
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/rooms/${id}`, {
    method: 'DELETE',
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  // DELETE returns 204 No Content — no body to parse
  if (backendRes.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendRes.json() as Record<string, unknown>;
  return NextResponse.json(data, { status: backendRes.status });
}
