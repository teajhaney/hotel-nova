import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiArchiveNotification,
  ApiListNotifications,
  ApiMarkAllRead,
  ApiMarkRead,
  ApiUnreadCount,
} from './notifications.swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationFiltersDto } from './dto/notification-filters.dto';

// ─── NotificationsController ───────────────────────────────────────────────
// Exposes REST endpoints for the authenticated user's own notifications.
// All endpoints require authentication (JwtAuthGuard is global), so we don't
// need @Public() or @Admin() — any logged-in user (guest or admin) can
// manage their own notifications.

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  // GET /api/v1/notifications → list own notifications
  @Get()
  @ApiListNotifications()
  findAll(
    @CurrentUser('id') userId: string,
    @Query() filters: NotificationFiltersDto,
  ) {
    return this.notifications.findAll(userId, filters);
  }

  // GET /api/v1/notifications/unread-count → badge count
  @Get('unread-count')
  @ApiUnreadCount()
  async unreadCount(@CurrentUser('id') userId: string) {
    const count = await this.notifications.unreadCount(userId);
    return { count };
  }

  // PATCH /api/v1/notifications/:id/read → mark one read
  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiMarkRead()
  markRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notifications.markRead(id, userId);
  }

  // PATCH /api/v1/notifications/read-all → mark all read
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiMarkAllRead()
  async markAllRead(@CurrentUser('id') userId: string) {
    const count = await this.notifications.markAllRead(userId);
    return { updated: count };
  }

  // PATCH /api/v1/notifications/:id/archive → archive one
  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiArchiveNotification()
  archive(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.notifications.archive(id, userId);
  }
}
