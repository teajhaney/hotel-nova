import { NotificationType } from '@prisma/client';

// Payload for creating a notification. Other services (bookings, reviews)
// call NotificationsService.create() with this shape.
export interface CreateNotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  bookingId?: string;
  actionLabel?: string;
  actionHref?: string;
}

// Paginated response shape returned by list endpoints.
export interface NotificationsPage {
  data: NotificationRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// A single notification row as returned to the client.
// Matches the Prisma Notification model fields.
export interface NotificationRecord {
  id: string;
  userId: string;
  bookingId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  actionLabel: string | null;
  actionHref: string | null;
  read: boolean;
  archived: boolean;
  createdAt: Date;
}
