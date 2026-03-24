import { IsEnum } from 'class-validator';
import { BookingStatus } from '@prisma/client';

// Admin-only. The service enforces which transitions are legal
// (e.g. you can't go from CheckedOut back to Confirmed).
export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
