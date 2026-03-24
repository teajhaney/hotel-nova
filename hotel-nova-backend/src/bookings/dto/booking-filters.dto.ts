import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus, PaymentStatus } from '@prisma/client';

// Used by admin to filter the bookings list. All fields are optional —
// sending none returns every booking (paginated).
export class BookingFiltersDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  // Filter by check-in window — useful for seeing today's arrivals, etc.
  @IsOptional()
  @IsDateString()
  checkInFrom?: string;

  @IsOptional()
  @IsDateString()
  checkInTo?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
