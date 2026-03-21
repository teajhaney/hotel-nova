import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * Domain exceptions are the specific errors your business logic throws.
 * Each one maps to a real scenario in HotelNova and carries:
 *  - a machine-readable errorCode (for the frontend to act on)
 *  - a human-readable message (shown to the user)
 *  - the correct HTTP status code (so REST clients get the right response)
 *
 * Why define these instead of throwing HttpException directly in services?
 * When you throw `new NotFoundException('Room not found')` in a service, the
 * error is tightly coupled to HTTP. If you later expose the same service over
 * WebSockets or a queue, that doesn't translate. Domain exceptions keep the
 * error semantics in one place — the filter handles the HTTP translation.
 *
 * Usage in a service:
 *   throw new RoomNotFoundException();
 *   throw new BookingConflictException();
 */

// ─── 404 Not Found ────────────────────────────────────────────────────────────

export class RoomNotFoundException extends BaseException {
  constructor() {
    super('ROOM_NOT_FOUND', 'Room not found.', HttpStatus.NOT_FOUND);
  }
}

export class BookingNotFoundException extends BaseException {
  constructor() {
    super('BOOKING_NOT_FOUND', 'Booking not found.', HttpStatus.NOT_FOUND);
  }
}

export class UserNotFoundException extends BaseException {
  constructor() {
    super('USER_NOT_FOUND', 'User not found.', HttpStatus.NOT_FOUND);
  }
}

export class ReviewNotFoundException extends BaseException {
  constructor() {
    super('REVIEW_NOT_FOUND', 'Review not found.', HttpStatus.NOT_FOUND);
  }
}

export class PromoCodeNotFoundException extends BaseException {
  constructor() {
    super(
      'PROMO_CODE_NOT_FOUND',
      'Promo code not found.',
      HttpStatus.NOT_FOUND,
    );
  }
}

// ─── 409 Conflict ─────────────────────────────────────────────────────────────

export class BookingConflictException extends BaseException {
  constructor() {
    super(
      'BOOKING_CONFLICT',
      'This room is not available for the selected dates.',
      HttpStatus.CONFLICT,
    );
  }
}

export class RoomRefAlreadyExistsException extends BaseException {
  constructor() {
    super(
      'ROOM_REF_ALREADY_EXISTS',
      'A room with this reference already exists.',
      HttpStatus.CONFLICT,
    );
  }
}

export class EmailAlreadyExistsException extends BaseException {
  constructor() {
    super(
      'EMAIL_ALREADY_EXISTS',
      'An account with this email already exists.',
      HttpStatus.CONFLICT,
    );
  }
}

export class ReviewAlreadyExistsException extends BaseException {
  constructor() {
    super(
      'REVIEW_ALREADY_EXISTS',
      'You have already reviewed this booking.',
      HttpStatus.CONFLICT,
    );
  }
}

// ─── 400 Bad Request ──────────────────────────────────────────────────────────

export class InvalidPromoCodeException extends BaseException {
  constructor() {
    super(
      'INVALID_PROMO_CODE',
      'This promo code is invalid or has expired.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class PromoCodeUsageLimitException extends BaseException {
  constructor() {
    super(
      'PROMO_CODE_USAGE_LIMIT',
      'This promo code has reached its usage limit.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class CheckoutRequiredForReviewException extends BaseException {
  constructor() {
    super(
      'CHECKOUT_REQUIRED_FOR_REVIEW',
      'You can only leave a review after your stay is complete.',
      HttpStatus.BAD_REQUEST,
    );
  }
}

// ─── 403 Forbidden ────────────────────────────────────────────────────────────

export class ForbiddenResourceException extends BaseException {
  constructor() {
    super(
      'FORBIDDEN_RESOURCE',
      'You do not have permission to access this resource.',
      HttpStatus.FORBIDDEN,
    );
  }
}

// ─── 401 Unauthorized ─────────────────────────────────────────────────────────

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super(
      'INVALID_CREDENTIALS',
      'Invalid email or password.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class TokenExpiredException extends BaseException {
  constructor() {
    super(
      'TOKEN_EXPIRED',
      'Your session has expired. Please log in again.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}

// ─── 502 Bad Gateway (external services) ──────────────────────────────────────

export class PaymentInitializationException extends BaseException {
  constructor() {
    super(
      'PAYMENT_INITIALIZATION_FAILED',
      'Could not initialize payment. Please try again.',
      HttpStatus.BAD_GATEWAY,
    );
  }
}

export class PaymentVerificationException extends BaseException {
  constructor() {
    super(
      'PAYMENT_VERIFICATION_FAILED',
      'Payment verification failed. Please contact support.',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
