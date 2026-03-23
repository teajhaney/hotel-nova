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
  ACCOUNT_SUSPENDED: 'This account has been suspended.',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token.',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token not found.',
  REFRESH_TOKEN_EXPIRED: 'Refresh token expired.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_TOKEN_PAYLOAD: 'Invalid token payload or missing claims.',
  NO_REFRESH_TOKEN: 'No refresh token provided.',

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
  ROOM_UNDER_MAINTENANCE: 'This room is currently under maintenance and cannot be booked.',
  INVALID_DATE_RANGE: 'Check-out must be after check-in.',
  CHECK_IN_PAST: 'Check-in date must be today or in the future.',
  INVALID_PROMO_CODE: 'This promo code is invalid or has expired.',
  PROMO_CODE_LIMIT_REACHED: 'This promo code has reached its usage limit.',
  CANNOT_CANCEL: 'Only Pending or Confirmed bookings can be cancelled.',
  NOT_YOUR_BOOKING: 'You can only manage your own bookings.',
} as const;
