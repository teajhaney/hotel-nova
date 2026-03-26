import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NOTIFICATION_MESSAGES } from '../common/constants/messages';
import { NotificationFiltersDto } from './dto/notification-filters.dto';
import type {
  CreateNotificationPayload,
  NotificationRecord,
  NotificationsPage,
} from './interfaces/notification.interface';

// ─── NotificationsService ──────────────────────────────────────────────────
// Two roles:
//  1. REST CRUD — lets users list, read, archive their own notifications.
//  2. create() — called by other services (bookings, reviews) to persist
//     a notification and return it so the gateway can push it in real-time.

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // ─── Create Notification ───────────────────────────────────────────────────
  // Called internally by other modules (not directly by a controller).
  // Returns the created row so the gateway can emit it via Socket.io.
  async create(
    payload: CreateNotificationPayload,
  ): Promise<NotificationRecord> {
    return this.prisma.notification.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        bookingId: payload.bookingId ?? null,
        actionLabel: payload.actionLabel ?? null,
        actionHref: payload.actionHref ?? null,
      },
    });
  }

  // ─── List Notifications ────────────────────────────────────────────────────
  // Returns the authenticated user's notifications, paginated and filtered.
  // By default only non-archived notifications are returned — the frontend
  // passes archived=true explicitly to view the archive tab.
  async findAll(
    userId: string,
    filters: NotificationFiltersDto,
  ): Promise<NotificationsPage> {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };

    if (filters.type) where.type = filters.type;
    if (filters.read !== undefined) where.read = filters.read;
    // Default to non-archived unless explicitly requested
    where.archived = filters.archived ?? false;

    const [total, data] = await Promise.all([
      this.prisma.notification.count({ where }),
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Unread Count ──────────────────────────────────────────────────────────
  // Powers the notification badge in the sidebar/navbar.
  async unreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, read: false, archived: false },
    });
  }

  // ─── Mark One as Read ──────────────────────────────────────────────────────
  async markRead(id: string, userId: string): Promise<NotificationRecord> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(NOTIFICATION_MESSAGES.NOT_FOUND);
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException(NOTIFICATION_MESSAGES.NOT_YOURS);
    }

    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  // ─── Mark All as Read ──────────────────────────────────────────────────────
  // Bulk update — sets read=true on every unread, non-archived notification
  // belonging to this user. Returns the count of rows affected.
  async markAllRead(userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, read: false, archived: false },
      data: { read: true },
    });
    return result.count;
  }

  // ─── Archive One ───────────────────────────────────────────────────────────
  // Archiving removes the notification from the main list. It's a soft-delete
  // — the row stays in the DB and can be viewed under the "Archived" tab.
  async archive(id: string, userId: string): Promise<NotificationRecord> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(NOTIFICATION_MESSAGES.NOT_FOUND);
    }
    if (notification.userId !== userId) {
      throw new ForbiddenException(NOTIFICATION_MESSAGES.NOT_YOURS);
    }

    return this.prisma.notification.update({
      where: { id },
      data: { archived: true, read: true },
    });
  }
}
