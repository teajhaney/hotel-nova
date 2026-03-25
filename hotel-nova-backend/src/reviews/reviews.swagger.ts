import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

type Decorator = MethodDecorator & ClassDecorator;

export const ApiGetEligibleBookings = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Guest: list all checked-out bookings eligible for review' }),
  );

export const ApiSubmitReview = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Guest: submit a review for a checked-out booking' }),
  );

export const ApiUpdateReview = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Guest: edit own pending review' }),
  );

export const ApiListReviews = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Admin: list all reviews with optional status filter' }),
  );

export const ApiUpdateReviewStatus = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Admin: change a review status (Approved / Hidden / Pending)' }),
  );
