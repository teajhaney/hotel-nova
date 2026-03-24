import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/me → NestJS GET /api/v1/auth/me
// Used to rehydrate the auth store on page load.
export async function GET(request: NextRequest) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}

// PATCH /api/auth/me → NestJS PATCH /api/v1/auth/me
// Updates the authenticated user's own profile (name, phone, country).
export async function PATCH(request: NextRequest) {
  const body = await request.json() as unknown;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
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

// DELETE /api/auth/me → NestJS DELETE /api/v1/auth/me
// Permanently deletes the authenticated user's own account.
export async function DELETE(request: NextRequest) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
    method: 'DELETE',
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  if (backendRes.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
