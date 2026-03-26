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
  // When a client connects, we extract the JWT from the cookie header,
  // verify it, and join the socket to a private room. If auth fails,
  // we disconnect immediately — no unauthenticated sockets allowed.
  handleConnection(client: Socket): void {
    try {
      const cookieHeader = client.handshake.headers.cookie ?? '';
      const token = this.parseCookie(cookieHeader, COOKIES.ACCESS_TOKEN);

      if (!token) {
        this.logger.warn('WS connection rejected — no access token cookie');
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

  // ─── Push a notification to ALL connected admin users ────────────────────
  // Some events (new booking, new review) should notify every admin who
  // is currently online. We emit to the "admins" room.
  sendToAdmins(notification: NotificationRecord): void {
    this.server.to('admins').emit('notification', notification);
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
