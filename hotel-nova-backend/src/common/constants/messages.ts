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
