import { io, Socket } from 'socket.io-client';

// ─── Socket.io Client ──────────────────────────────────────────────────────
// Connects to the NestJS notifications gateway at /notifications namespace.
// The backend extracts the JWT from the cookie header during the handshake,
// so we need withCredentials: true. We DON'T connect automatically — the
// app calls connect() after confirming the user is logged in.
//
// This module exports a singleton-style API. Multiple components can import
// getSocket() and they all share the same connection.

let socket: Socket | null = null;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export function getSocket(): Socket {
  if (!socket) {
    socket = io(`${BACKEND_URL}/notifications`, {
      // Don't connect until we explicitly call socket.connect()
      autoConnect: false,
      // Send cookies (accessToken) with the WebSocket handshake
      withCredentials: true,
      // Start with WebSocket directly — polling isn't needed for modern browsers
      // and avoids CORS preflight issues with the cookie-based auth.
      transports: ['websocket'],
    });
  }
  return socket;
}

// Call this when the user logs in (or when the app detects an active session)
export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

// Call this on logout to cleanly tear down the connection
export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
