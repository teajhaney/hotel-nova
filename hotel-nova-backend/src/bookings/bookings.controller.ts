import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { Admin } from '../auth/decorators/admin.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Guest } from '../auth/decorators/guest.decorator';
import { Public } from '../auth/decorators/public.decorator';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';
import { BookingFiltersDto } from './dto/booking-filters.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import {
  ApiAdminGetBookings,
  ApiAdminUpdateStatus,
  ApiCancelBooking,
  ApiCreateBooking,
  ApiGetBookingById,
  ApiGetMyBookings,
  ApiPaystackWebhook,
} from './bookings.swagger';
import { BookingsService } from './bookings.service';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  // POST /api/v1/bookings → NestJS POST /api/v1/bookings
  // Creates the booking and returns the Paystack payment URL.
  // @Guest() means any authenticated user (guest or admin) can call this.
  @Guest()
  @Post()
  @ApiCreateBooking()
  createBooking(@CurrentUser() user: AuthUser, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(user, dto);
  }

  // GET /api/v1/bookings/my → NestJS GET /api/v1/bookings/my
  // Returns the logged-in guest's own bookings. Must be declared BEFORE `:id`
  // so NestJS doesn't try to parse "my" as a UUID param.
  @Guest()
  @Get('my')
  @ApiGetMyBookings()
  getMyBookings(@CurrentUser('id') userId: string) {
    return this.bookingsService.getMyBookings(userId);
  }

  // GET /api/v1/bookings → NestJS GET /api/v1/bookings
  // Admin-only list with filters and pagination.
  @Admin()
  @Get()
  @ApiAdminGetBookings()
  adminGetBookings(@Query() filters: BookingFiltersDto) {
    return this.bookingsService.adminGetBookings(filters);
  }

  // GET /api/v1/bookings/:id → NestJS GET /api/v1/bookings/:id
  // Guests can fetch their own bookings; admins can fetch any.
  @Guest()
  @Get(':id')
  @ApiGetBookingById()
  getBookingById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.bookingsService.getBookingById(id, user);
  }

  // PATCH /api/v1/bookings/:id/cancel → NestJS PATCH /api/v1/bookings/:id/cancel
  @Guest()
  @Patch(':id/cancel')
  @ApiCancelBooking()
  cancelBooking(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.bookingsService.cancelBooking(id, userId);
  }

  // PATCH /api/v1/bookings/:id/status → NestJS PATCH /api/v1/bookings/:id/status
  @Admin()
  @Patch(':id/status')
  @ApiAdminUpdateStatus()
  adminUpdateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.adminUpdateStatus(id, dto);
  }

  // POST /api/v1/bookings/webhook/paystack → NestJS POST /api/v1/bookings/webhook/paystack
  // This endpoint is PUBLIC — Paystack calls it, not a logged-in user.
  // The service verifies the HMAC-SHA512 signature before trusting the payload.
  // NestJS exposes raw body via req.rawBody when rawBody: true is set in main.ts.
  @Public()
  @Post('paystack/webhook')
  @HttpCode(HttpStatus.OK)
  @ApiPaystackWebhook()
  paystackWebhook(
    @Headers('x-paystack-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.bookingsService.handlePaystackWebhook(signature, req.rawBody!);
  }
}
