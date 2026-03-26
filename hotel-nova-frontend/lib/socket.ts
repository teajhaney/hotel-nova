import { io, Socket } from 'socket.io-client';

// ─── Socket.io Client ──────────────────────────────────────────────────────
// Connects to the NestJS notifications gateway at /notifications namespace.
//
// Auth strategy:
//   LOCAL  — the browser and NestJS share localhost, so the HttpOnly cookie
//            is sent automatically with the WebSocket handshake.
//   PROD   — the frontend (Vercel) and backend (Render) are on different
//            domains, so cookies are NOT sent cross-origin. Instead, we fetch
//            the JWT from GET /api/auth/ws-token (same-origin, cookie is sent),
//            then pass it via Socket.io's `auth` option. The backend gateway
//            checks `handshake.auth.token` first, falls back to cookies.
//
// This module exports a singleton-style API. Multiple components can import
// getSocket() and they all share the same connection.

let socket: Socket | null = null;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export function getSocket(): Socket {
  if (!socket) {
    socket = io(`${BACKEND_URL}/notifications`, {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket'],
    });
  }
  return socket;
}

// Fetches the JWT from the same-origin Route Handler and attaches it to the
// socket's auth before connecting. This runs every time connectSocket() is
// called so the token stays fresh after a refresh cycle.
export async function connectSocket(): Promise<void> {
  const s = getSocket();
  if (s.connected) return;

  try {
    const res = await fetch('/api/auth/ws-token');
    if (res.ok) {
      const { token } = (await res.json()) as { token: string | null };
      if (token) {
        s.auth = { token };
      }
    }
  } catch {
    // If the fetch fails, try connecting anyway — the cookie fallback
    // may still work (e.g. local development on localhost)
  }

  s.connect();
}

// Call this on logout to cleanly tear down the connection
export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
