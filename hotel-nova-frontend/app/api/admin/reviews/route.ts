import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin/reviews → NestJS GET /api/v1/reviews
// Admin-only: returns paginated reviews with optional status filter.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/reviews${qs ? `?${qs}` : ''}`,
    { headers: { cookie: request.headers.get('cookie') ?? '' } },
  );

  const data = await backendRes.json() as unknown;
  return NextResponse.json(data, { status: backendRes.status });
}
