import { NextRequest, NextResponse } from 'next/server';

// GET /api/auth/ws-token → returns the access token for Socket.io handshake
//
// Why this exists: In production the frontend (Vercel) and backend (Render) are
// on different domains. HttpOnly cookies set under hotel-nova.vercel.app are NOT
// sent when the browser opens a WebSocket to hotel-nova.onrender.com. So the
// Socket.io client fetches the token here (same-origin request = cookie is sent),
// then passes it via Socket.io's `auth` option in the handshake.
export async function GET(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.json({ token: null }, { status: 401 });
  }

  return NextResponse.json({ token });
}
