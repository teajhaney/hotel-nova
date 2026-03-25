// ─────────────────────────────────────────────
// UPLOAD
// ─────────────────────────────────────────────

export const UPLOAD_MESSAGES = {
  UPLOAD_FAILED: 'File upload failed. Please try again.',
} as const;

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export const AUTH_MESSAGES = {
  // errors
  EMAIL_IN_USE: 'Email already in use.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  ACCOUNT_SUSPENDED: 'Your account has been suspended.',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token.',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found.',
  REFRESH_TOKEN_EXPIRED: 'Refresh token expired.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_TOKEN_PAYLOAD: 'Invalid token payload or missing claims.',
  NO_REFRESH_TOKEN: 'No refresh token provided.',

  CANNOT_DELETE_SELF: 'You cannot delete your own admin account.',
  INCORRECT_CURRENT_PASSWORD: 'Current password is incorrect.',
  PASSWORD_CHANGE_REQUIRES_CURRENT:
    'Please provide your current password to set a new one.',

  // success
  SIGNUP_SUCCESS: 'Signup successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out',
  TOKEN_REFRESHED: 'Token refreshed',
} as const;

// ─────────────────────────────────────────────
// ROOMS
// ─────────────────────────────────────────────

export const ROOMS_MESSAGES = {
  // errors
  ROOM_NOT_FOUND: 'Room not found.',
  ROOM_NUMBER_TYPE_IN_USE:
    'A room with this number and type already exists. Use a different room number.',
} as const;

// ─────────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────────

export const BOOKING_MESSAGES = {
  // errors
  BOOKING_NOT_FOUND: 'Booking not found.',
  ROOM_UNAVAILABLE: 'This room is not available for the selected dates.',
  ROOM_UNDER_MAINTENANCE:
    'This room is currently under maintenance and cannot be booked.',
  INVALID_DATE_RANGE: 'Check-out must be after check-in.',
  CHECK_IN_PAST: 'Check-in date must be today or in the future.',
  INVALID_PROMO_CODE: 'This promo code is invalid or has expired.',
  PROMO_CODE_LIMIT_REACHED: 'This promo code has reached its usage limit.',
  CANNOT_CANCEL: 'Only Pending or Confirmed bookings can be cancelled.',
  NOT_YOUR_BOOKING: 'You can only manage your own bookings.',
  INVALID_STATUS_TRANSITION: 'This status transition is not allowed.',
} as const;

// ─────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────

export const PAYMENT_MESSAGES = {
  PAYSTACK_INIT_FAILED: 'Could not initialise payment. Please try again.',
  INVALID_WEBHOOK_SIGNATURE: 'Invalid webhook signature.',
} as const;

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

export const REVIEW_MESSAGES = {
  REVIEW_NOT_FOUND: 'Review not found.',
  REVIEW_NOT_YOURS: 'You can only manage your own reviews.',
  BOOKING_NOT_ELIGIBLE: 'Only checked-out bookings are eligible for reviews.',
  REVIEW_ALREADY_EXISTS: 'You have already submitted a review for this booking.',
  REVIEW_NOT_EDITABLE: 'Only pending reviews can be edited.',
} as const;

// ─────────────────────────────────────────────
// PROMO CODES
// ─────────────────────────────────────────────

export const PROMO_MESSAGES = {
  PROMO_NOT_FOUND: 'Promo code not found.',
  CODE_ALREADY_EXISTS: 'A promo code with this code already exists.',
  INVALID_PROMO_CODE: 'This promo code is invalid or has expired.',
  PROMO_CODE_LIMIT_REACHED: 'This promo code has reached its usage limit.',
} as const;
