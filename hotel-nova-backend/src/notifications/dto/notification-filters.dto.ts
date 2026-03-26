import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { NotificationType } from '@prisma/client';

// All notification types from the Prisma enum, listed explicitly so
// class-validator's @IsIn can check them at runtime.
const NOTIFICATION_TYPES: NotificationType[] = [
  'booking_confirmed',
  'checkout_reminder',
  'payment_received',
  'review_prompt',
  'new_booking',
  'new_user_registered',
  'new_review_submitted',
  'room_status_changed',
  'security_alert',
  'general',
];

export class NotificationFiltersDto {
  @IsOptional()
  @IsIn(NOTIFICATION_TYPES)
  type?: NotificationType;

  // Query strings arrive as "true"/"false" strings. @Transform converts
  // them to actual booleans before class-validator checks them.
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  archived?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
