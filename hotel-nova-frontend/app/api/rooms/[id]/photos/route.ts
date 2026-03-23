import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// POST /api/rooms/:id/photos → NestJS POST /rooms/:id/photos
// This is multipart/form-data — we forward the raw body as-is instead of
// parsing and re-serializing it, so the file bytes are never mangled.
export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const formData = await request.formData();

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/rooms/${id}/photos`,
    {
      method: 'POST',
      headers: {
        // Do NOT set Content-Type here — the browser boundary string inside
        // the FormData header must be preserved exactly as-is
        cookie: request.headers.get('cookie') ?? '',
      },
      // Next.js passes FormData directly to fetch, which sets the correct
      // multipart boundary automatically
      body: formData,
    },
  );

  const data = await backendRes.json() as Record<string, unknown>;
  return NextResponse.json(data, { status: backendRes.status });
}
