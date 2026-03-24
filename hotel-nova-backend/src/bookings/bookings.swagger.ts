import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const ApiCreateBooking = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a booking and initialise Paystack payment (guest only)',
    }),
  );

export const ApiGetMyBookings = () =>
  applyDecorators(
    ApiOperation({ summary: "List the logged-in guest's own bookings" }),
  );

export const ApiGetBookingById = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get a single booking by ID (guest: own only; admin: any)',
    }),
  );

export const ApiCancelBooking = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Cancel a booking (guest only; Pending or Confirmed)',
    }),
  );

export const ApiAdminGetBookings = () =>
  applyDecorators(
    ApiOperation({ summary: 'List all bookings with filters (admin only)' }),
  );

export const ApiAdminUpdateStatus = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a booking status (admin only)' }),
  );

export const ApiPaystackWebhook = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Receive and process Paystack payment webhook events',
    }),
  );
