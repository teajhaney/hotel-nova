import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// This DTO captures everything a guest sends when they want to book a room.
// Notice we don't ask for prices here — all amounts are calculated server-side
// from the room's current price. Never trust client-supplied money values.
export class CreateBookingDto {
  @IsUUID()
  roomId: string;

  // ISO-8601 date strings (e.g. "2026-04-10"). We convert to Date objects in the service.
  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  adults: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(6)
  children?: number;

  // Phone is optional — Paystack's hosted checkout collects contact details
  // from the guest directly, so we don't force them to re-enter it here.
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @IsOptional()
  @IsString()
  guestCountry?: string;

  // Optional promo code — validated and applied in the service
  @IsOptional()
  @IsString()
  promoCode?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}
