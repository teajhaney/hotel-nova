import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';

// ─── NotificationsModule ───────────────────────────────────────────────────
// This module wires together three things:
//  1. NotificationsService  — CRUD operations on the notifications table
//  2. NotificationsGateway  — Socket.io gateway for real-time push
//  3. NotificationsController — REST endpoints for listing/reading/archiving
//
// We import JwtModule because the gateway needs JwtService to verify the
// access token from the WebSocket handshake cookie. We use the same secret
// and expiry as the AuthModule so the tokens are interchangeable.
//
// Both the service and gateway are exported so that other modules
// (BookingsModule, ReviewsModule) can inject them to create notifications
// and push them to connected users.

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-default-key-change-me',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
