import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

type Decorator = MethodDecorator & ClassDecorator;

export const ApiListNotifications = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'List own notifications (paginated, filterable)' }),
  );

export const ApiUnreadCount = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Get unread notification count for badge' }),
  );

export const ApiMarkRead = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Mark a single notification as read' }),
  );

export const ApiMarkAllRead = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Mark all unread notifications as read' }),
  );

export const ApiArchiveNotification = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Archive a notification (soft delete)' }),
  );
