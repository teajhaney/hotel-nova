import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { COOKIES } from '../common/constants/auth.constants';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import type { NotificationRecord } from './interfaces/notification.interface';

// Per-socket metadata we store after authenticating the connection.
// Socket.io's `client.data` is typed as `any` by default — this interface
// gives us type-safe access to the userId we attach during the handshake.
interface SocketData {
  userId?: string;
}

// ─── NotificationsGateway ──────────────────────────────────────────────────
// A WebSocket gateway that pushes real-time notification events to connected
// users. Each user joins a private room named "user:<userId>" on connection,
// so we can target notifications at a specific person.
//
// We configure the gateway with:
//  - namespace: /notifications — keeps notification traffic separate
//  - cors: same origin as the REST API
//  - The Socket.io server attaches to the same HTTP server as NestJS, so
//    there's no need for a separate port.
@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: (process.env.FRONTEND_URL || 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim()),
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private jwt: JwtService) {}

  // ─── Connection handler ──────────────────────────────────────────────────
  // When a client connects, we extract the JWT and verify it. Two auth
  // strategies are supported:
  //   1. handshake.auth.token — used in production where the frontend (Vercel)
  //      and backend (Render) are on different domains, so cookies can't be
  //      sent cross-origin. The frontend fetches the token from a same-origin
  //      Route Handler and passes it here.
  //   2. Cookie fallback — works in local development where both the frontend
  //      and backend share localhost, so cookies are sent automatically.
  handleConnection(client: Socket): void {
    try {
      // Try auth token first (production cross-domain), then cookie (local dev)
      const authToken = (client.handshake.auth as { token?: string })?.token;
      const cookieHeader = client.handshake.headers.cookie ?? '';
      const cookieToken = this.parseCookie(cookieHeader, COOKIES.ACCESS_TOKEN);
      const token = authToken || cookieToken;

      if (!token) {
        this.logger.warn('WS connection rejected — no access token');
        client.disconnect();
        return;
      }

      // verify() throws if the token is invalid or expired
      const payload = this.jwt.verify<JwtPayload>(token);
      const userId = payload.sub;

      // Store the userId on the socket so we can use it later (e.g. in
      // handleDisconnect for logging). Socket.io's `data` property is
      // a general-purpose bag for per-connection metadata.
      (client.data as SocketData).userId = userId;

      // Join the private room for this user. Any notification emitted to
      // "user:<id>" will only reach this socket (and any other tabs/devices
      // the same user has open).
      void client.join(`user:${userId}`);

      this.logger.log(`User ${userId} connected (socket ${client.id})`);
    } catch {
      this.logger.warn(
        `WS connection rejected — invalid token (socket ${client.id})`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = (client.data as SocketData).userId;
    if (userId) {
      this.logger.log(`User ${userId} disconnected (socket ${client.id})`);
    }
  }

  // ─── Push a notification to a specific user ──────────────────────────────
  // Called by NotificationsService (via the controller or other services)
  // after persisting the notification in the DB. If the user is online,
  // they receive it instantly; if not, they'll see it next time they fetch
  // their notification list.
  sendToUser(userId: string, notification: NotificationRecord): void {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  // ─── Simple cookie parser ────────────────────────────────────────────────
  // Socket.io handshake doesn't go through Express middleware, so we need
  // to parse the raw Cookie header manually. This is a minimal parser —
  // we only need to extract one value.
  private parseCookie(header: string, name: string): string | null {
    const match = header
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`));
    return match ? match.slice(name.length + 1) : null;
  }
}
