/**
 * HotelNova — Systemic Messages
 *
 * Single source of truth for all UI strings.
 * Edit here to update copy across the entire app.
 */

// ─── Brand ───────────────────────────────────────────────────
export const BRAND = {
  name: 'HotelNova',
  hotelName: 'The Grand Oasis Abuja',
  tagline: 'Elevate Your Stay',
  footerCopy: '© 2024 HotelNova The Grand Oasis Abuja. All rights reserved.',
  logoAriaLabel: 'HotelNova — go to homepage',
} as const;

// ─── Login page ───────────────────────────────────────────────
export const LOGIN_MESSAGES = {
  title: 'Welcome back',
  subtitle: 'Experience premium luxury at The Grand Oasis Abuja.',
  guestTab: 'Guest',
  adminTab: 'Admin',
  emailLabel: 'Email address',
  guestEmailPlaceholder: 'name@example.com',
  adminEmailPlaceholder: 'admin@hotelnova.com',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  forgotPassword: 'Forgot password?',
  submitButton: 'Sign In',
  submittingButton: 'Signing in…',
  noAccount: "Don't have an account?",
  createAccount: 'Create an account',
  tabAriaLabel: 'Select sign-in role',
  skipNav: 'Skip to main content',
} as const;

// ─── Signup page ──────────────────────────────────────────────
export const SIGNUP_MESSAGES = {
  title: 'Create your account',
  subtitle: 'Join The Grand Oasis Abuja community',
  roleLabel: 'Select your role',
  guestTab: 'Guest',
  adminTab: 'Admin',
  nameLabel: 'Full Name',
  namePlaceholder: 'Enter your full name',
  emailLabel: 'Email Address',
  adminEmailLabel: 'Admin Email Address',
  guestEmailPlaceholder: 'name@example.com',
  adminEmailPlaceholder: 'admin@hotelnova.com',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  confirmPasswordLabel: 'Confirm Password',
  termsPrefix: 'By creating an account, I agree to the',
  termsLink: 'Terms & Conditions',
  termsAnd: 'and',
  privacyLink: 'Privacy Policy',
  submitButton: 'Create Account',
  submittingButton: 'Creating account…',
  hasAccount: 'Already have an account?',
  signIn: 'Sign In',
  skipNav: 'Skip to main content',
} as const;

// ─── Auth Right Panel ─────────────────────────────────────────
export const AUTH_PANEL_MESSAGES = {
  login: {
    starRatingLabel: 'Five star hotel rating',
    badge: 'Five Star Excellence',
    title: 'Your gateway to\nunparalleled luxury.',
    subtitle:
      'Discover the heart of Abuja through our curated experiences and world-class hospitality.',
    imageAlt:
      'Luxurious hotel lobby with ornate golden chandelier at The Grand Oasis Abuja',
  },
  signup: {
    starRatingLabel: 'Five star hotel rating',
    hotelName: 'The Grand Oasis Abuja',
    subtitle:
      'Experience unparalleled luxury and sophisticated hospitality in the heart of the capital city.',
    imageAlt: 'Luxury hotel exterior with pool at The Grand Oasis Abuja',
    stats: [
      { value: '500+', label: 'Luxury Rooms' },
      { value: '12', label: 'Fine Dining' },
      { value: '24/7', label: 'VIP Service' },
    ],
  },
} as const;

// ─── Validation ───────────────────────────────────────────────
export const VALIDATION_MESSAGES = {
  email: {
    invalid: 'Please enter a valid email address',
    required: 'Email is required',
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 6 characters',
  },
  confirmPassword: {
    required: 'Please confirm your password',
    mismatch: "Passwords don't match",
  },
  name: {
    required: 'Full name is required',
    minLength: 'Full name must be at least 2 characters',
    maxLength: 'Full name is too long',
  },
  terms: {
    required: 'You must accept the Terms & Conditions to continue',
  },
} as const;

// ─── Routes ───────────────────────────────────────────────────
export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  adminLogin: '/admin/login',
  adminOverview: '/admin/overview',
  terms: '/terms',
  privacy: '/privacy',
} as const;
