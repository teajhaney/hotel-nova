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

// ─── Homepage — Hero ─────────────────────────────────────────
export const HERO_MESSAGES = {
  titleLine1: 'The Grand Oasis',
  titleLine2: 'Abuja',
  subtitle:
    "Experience unparalleled luxury and sophisticated comfort in the heart of Nigeria's capital. Your sanctuary of elegance awaits.",
  ctaPrimary: 'Book Your Stay',
  ctaSecondary: 'View Gallery',
  ariaLabel: 'Hotel hero — The Grand Oasis Abuja',
} as const;

// ─── Homepage — Booking Bar ─────────────────────────────────
export const BOOKING_BAR_MESSAGES = {
  checkInLabel: 'Check-In',
  checkOutLabel: 'Check-Out',
  guestsLabel: 'Guests',
  searchButton: 'Search Availability',
  ariaLabel: 'Room availability search',
  guestOptions: [
    '1 Adult, 0 Children',
    '2 Adults, 0 Children',
    '2 Adults, 1 Child',
    '2 Adults, 2 Children',
    '3 Adults, 0 Children',
    '3 Adults, 1 Child',
    '4 Adults, 0 Children',
  ],
  defaultGuests: '2 Adults, 0 Children',
} as const;

// ─── Homepage — Featured Rooms ──────────────────────────────
export const FEATURED_ROOMS_MESSAGES = {
  eyebrow: 'Our Accommodations',
  heading: 'Featured Rooms & Suites',
  viewAll: 'View All Rooms',
  bookNow: 'Book Now',
  pricePrefix: 'From',
  priceSuffix: '/night',
} as const;

// ─── Homepage — Amenities ───────────────────────────────────
export const AMENITIES_MESSAGES = {
  eyebrow: 'World-Class Experience',
  heading: 'Premier Amenities',
} as const;

// ─── Homepage — Legacy / Our Story ──────────────────────────
export const LEGACY_MESSAGES = {
  eyebrow: 'Our Story',
  heading: 'A Legacy of Excellence in Abuja',
  body1:
    'Founded on the principles of refined hospitality and architectural grandeur, The Grand Oasis Abuja has been the preferred destination for global leaders and discerning travellers for over two decades.',
  body2:
    'Every detail — from our hand-selected art collection to our personalised guest services — is designed to offer an experience that transcends ordinary travel.',
  cta: 'Learn More About Us',
  badgeNumber: '25+',
  badgeLabel: 'Years of Luxury',
  imageAlt:
    'The Grand Oasis Abuja grand lobby — warm timber accents and elegant staircase',
} as const;

// ─── Homepage — Promo / Offer ───────────────────────────────
export const PROMO_MESSAGES = {
  eyebrow: 'Exclusive Offer',
  heading: 'Romantic Getaway Package',
  description:
    "Enjoy complimentary champagne, a 3-course dinner, and late checkout for your special escape.",
  ctaPrimary: 'Claim Offer',
  ctaSecondary: 'Learn More',
} as const;

// ─── Homepage — Testimonials ────────────────────────────────
export const TESTIMONIALS_MESSAGES = {
  eyebrow: 'Guest Feedback',
  heading: 'Voices of Grand Oasis',
} as const;

// ─── Homepage — Newsletter ──────────────────────────────────
export const NEWSLETTER_MESSAGES = {
  heading: 'Join Our Exclusive Circle',
  subtitle:
    'Subscribe to our newsletter and receive private offers, event invitations, and seasonal updates directly to your inbox.',
  placeholder: 'Your email address',
  submitButton: 'Subscribe',
  successMessage: "Thank you! You're now part of the Oasis Club.",
  disclaimer: 'No spam, ever. Unsubscribe at any time.',
} as const;

// ─── Footer ─────────────────────────────────────────────────
export const FOOTER_MESSAGES = {
  tagline:
    'Defining luxury in Abuja since 1998. Your premier destination for business and leisure.',
  quickLinksHeading: 'Quick Links',
  policiesHeading: 'Policies',
  contactHeading: 'Contact Us',
  address: '123 Maitama District, Abuja, Nigeria',
  phone: '+234 800 GRAND OASIS',
  email: 'stay@grandoasisabuja.com',
  copyright: '© 2026 The Grand Oasis Abuja. All rights reserved.',
  companyName: 'HotelNova Hospitality Group',
} as const;

// ─── Rooms Listing Page ─────────────────────────────────────
export const ROOMS_PAGE_MESSAGES = {
  heading: 'Luxury Rooms & Suites',
  subtitle:
    'Experience the Grand Oasis branding with our handpicked suites.',
  filtersHeading: 'Filters',
  priceRangeLabel: 'Price Range',
  roomTypeLabel: 'Room Type',
  amenitiesLabel: 'Amenities',
  clearFilters: 'Clear All Filters',
  bookNow: 'Book Now',
  lastNight: 'Last night',
  perNight: '/per night',
  reviewSuffix: 'Reviews',
  badgeRecommended: 'Recommended',
  badgePopular: 'Popular',
  suitesAvailable: 'Suites Available',
  searchPlaceholder: 'Search rooms...',
  allRooms: 'All Rooms',
} as const;

// ─── Offers Page ────────────────────────────────────────────
export const OFFERS_PAGE_MESSAGES = {
  breadcrumbHotels: 'Hotels',
  breadcrumbNigeria: 'Nigeria',
  breadcrumbAbuja: 'Abuja',
  locationName: 'The Grand Oasis',
  locationBadge: 'Premium Partner',
  locationAddress: 'Plot 104, Diplomatic Drive, Central Business District, Abuja',
  heading: 'Exclusive Offers',
  subtitle:
    "Curated experiences and seasonal packages designed for your perfect stay in Nigeria's capital city.",
  filterButton: 'Filter Categories',
  tabAll: 'All Offers',
  tabSeasonal: 'Seasonal',
  tabBusiness: 'Business',
  tabRomantic: 'Romantic',
  tabLastMinute: 'Last Minute',
  claimOffer: 'Claim Offer',
  bookNow: 'Book Now',
  details: 'Details',
  termsLabel: 'Terms:',
  loyaltyHeading: 'Join NovaRewards™',
  loyaltySubtitle:
    'Members save an additional 10% on all offers and earn points towards free nights. Sign up in seconds for immediate benefits.',
  loyaltyButton: 'Join for Free',
  newsletterHeading: 'Never Miss a Secret Deal',
  newsletterSubtitle:
    'Subscribe to our monthly newsletter and be the first to know about flash sales and holiday packages.',
  newsletterPlaceholder: 'Enter your email address',
  newsletterButton: 'Subscribe',
} as const;

// ─── About Us Page ──────────────────────────────────────────
export const ABOUT_PAGE_MESSAGES = {
  heroEyebrow: 'WELCOME TO LUXURY',
  heroTitle: 'The Grand Oasis Abuja',
  heroSubtitle:
    'Discover the intersection of Nigerian heritage and contemporary elegance in the heart of the capital.',
  storyHeading: 'Our Story',
  storyParagraph1:
    'A heritage of luxury and hospitality since 2010. Founded on the principles of providing an unparalleled sanctuary in the heart of Abuja, The Grand Oasis has evolved from a visionary concept into the city\'s premier destination for discerning travelers.',
  storyParagraph2:
    'For over a decade, we have been more than just a hotel; we are a landmark of excellence. Our journey began with a single mission: to blend international standards of comfort with the warm, vibrant soul of Nigerian hospitality. Today, we stand proud as a testament to what happens when passion meets precision.',
  valuesHeading: 'Our Values',
  valuesSubtitle:
    'The pillars that define our service and guest experience every single day.',
  value1Title: 'Hospitality',
  value1Description:
    'Warmth in every interaction. We believe that true hospitality comes from the heart, ensuring every guest feels like royalty from the moment they arrive.',
  value2Title: 'Excellence',
  value2Description:
    'Striving for perfection in every detail. From the thread count of our linens to the precision of our concierge services, excellence is our standard.',
  value3Title: 'Authenticity',
  value3Description:
    'True to our Nigerian roots and global standards. We celebrate local culture through art, cuisine, and design while maintaining world-class luxury.',
  teamHeading: 'The Faces of Oasis',
  teamSubtitle:
    'Meet the dedicated team working tirelessly to ensure your stay is nothing short of extraordinary.',
  teamCta: 'Meet all staff',
  locationHeading: 'Find Us',
  locationSubtitle:
    'Located in the prestigious Garki district, we are conveniently situated near government offices, shopping centers, and cultural landmarks.',
  locationAddressLabel: 'Address',
  locationAddress: '12 Luxury Way, Garki, Abuja, Nigeria',
  locationContactLabel: 'Contact',
  locationPhone: '+234 800 HOTEL NOVA',
  locationEmail: 'reservations@hotelnova-abuja.com',
} as const;

// ─── Contact Page ───────────────────────────────────────────
export const CONTACT_PAGE_MESSAGES = {
  heroTitle: 'Contact Us',
  heroSubtitle:
    'We\'d love to hear from you. Reach out to The Grand Oasis Abuja for any inquiries or reservations.',
  formHeading: 'Send us a Message',
  formNameLabel: 'Full Name',
  formNamePlaceholder: 'John Doe',
  formEmailLabel: 'Email Address',
  formEmailPlaceholder: 'john@example.com',
  formSubjectLabel: 'Subject',
  formSubjectPlaceholder: 'Inquiry about Reservation',
  formMessageLabel: 'Message',
  formMessagePlaceholder: 'How can we help you?',
  formSubmitButton: 'Send Message',
  formSubmittingButton: 'Sending...',
  infoLocationTitle: 'Our Location',
  infoLocationAddress: 'Abuja Central Area, Abuja, Nigeria',
  infoPhoneTitle: 'Phone Number',
  infoPhone1: '+234 800 000 0000',
  infoPhone2: '+234 900 000 1111',
  infoEmailTitle: 'Email Address',
  infoEmail1: 'reservations@grandoasis.com',
  infoEmail2: 'info@grandoasis.com',
  mapTitle: 'VISIT US IN THE HEART OF THE CITY',
  mapCta: 'Open in Maps',
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
  offers: '/offers',
  about: '/about',
  contact: '/contact',
} as const;
