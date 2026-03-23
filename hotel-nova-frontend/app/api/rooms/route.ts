import { NextRequest, NextResponse } from 'next/server';

// GET  /api/rooms  → NestJS GET  /rooms  (list with filters)

export async function GET(request: NextRequest) {
  // Pass through any query params (?page=1&limit=20&type=Suite etc.)
  const search = request.nextUrl.searchParams.toString();
  const url = `${process.env.BACKEND_URL}/rooms${search ? `?${search}` : ''}`;

  const backendRes = await fetch(url, {
    headers: { cookie: request.headers.get('cookie') ?? '' },
  });

  const data = await backendRes.json() as Record<string, unknown>;
  return NextResponse.json(data, { status: backendRes.status });
}


// POST /api/rooms  → NestJS POST /rooms  (create — admin only)
export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, unknown>;

  const backendRes = await fetch(`${process.env.BACKEND_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json() as Record<string, unknown>;
  return NextResponse.json(data, { status: backendRes.status });
}
