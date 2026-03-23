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
    'Enjoy complimentary champagne, a 3-course dinner, and late checkout for your special escape.',
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
  subtitle: 'Experience the Grand Oasis branding with our handpicked suites.',
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
  locationAddress:
    'Plot 104, Diplomatic Drive, Central Business District, Abuja',
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
    "A heritage of luxury and hospitality since 2010. Founded on the principles of providing an unparalleled sanctuary in the heart of Abuja, The Grand Oasis has evolved from a visionary concept into the city's premier destination for discerning travelers.",
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
    "We'd love to hear from you. Reach out to The Grand Oasis Abuja for any inquiries or reservations.",
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

// ─── Booking Wizard ───────────────────────────────────────────
export const BOOKING_MESSAGES = {
  // Step indicators
  step1Label: 'STEP 1 OF 4',
  step1Title: 'Plan your stay',
  step1Subtitle:
    'Select your preferred dates and guest count to see available rooms.',
  step2Label: 'Step 2 of 4: Select Room',
  step2Percent: '40% Complete',
  step3Label: 'Step 3 of 4: Booking Summary',
  step3Percent: '75% Complete',
  step4Label: 'Step 4: Payment',
  step4Percent: '100%',
  // Step 1
  selectDatesTitle: 'Select Dates',
  numberOfGuestsTitle: 'Number of Guests',
  guestsAndRoomsTitle: 'Guests & Rooms',
  adultsLabel: 'Adults',
  adultsAge: 'Ages 13 or above',
  childrenLabel: 'Children',
  childrenAge: 'Ages 2 - 12',
  roomsLabel: 'Rooms',
  nightsLabel: 'Nights',
  startingFrom: 'STARTING FROM',
  proceedToRooms: 'Proceed to Room Selection',
  continueToRooms: 'Continue to Room Selection',
  datesAndGuests: 'Dates & Guests',
  // Sidebar preview
  bookingPreviewTitle: 'Booking Preview',
  stayDuration: 'STAY DURATION',
  guestsLabel: 'GUESTS',
  roomTypeLabel: 'ROOM TYPE',
  notSelectedYet: 'Not selected yet',
  subtotalEstimate: 'Subtotal estimate',
  taxesAndFees: 'Taxes & Fees',
  totalPlaceholder: 'Total Placeholder',
  priceDisclaimer:
    '*Prices are subject to change based on room availability and seasonal adjustments.',
  needAssistance: 'Need assistance?',
  assistancePhone: 'Call +234 9 123 4567',
  // Step 2
  availableRoomsTitle: 'Available Rooms',
  availableRoomsSubtitle:
    'Select your preferred room to continue your stay at The Grand Oasis Abuja.',
  viewGallery: 'View Gallery',
  roomDetailsLink: 'Room details',
  selectRoomBtn: 'Select Room',
  roomSelectedBtn: 'Room Selected',
  popularChoice: 'POPULAR CHOICE',
  bestSeller: 'BESTSELLER',
  perNight: 'per night',
  confirmSelection: 'Confirm Selection',
  stayDates: 'STAY DATES',
  guestCount: 'GUESTS',
  roomSelection: 'ROOM SELECTION',
  noRoomSelected: 'No room selected yet',
  concierge247:
    'Our concierge is available 24/7 to help you with your reservation.',
  conciergePhone: '+234 800 GRAND OASIS',
  // Step 3
  bookingSummaryTitle: 'Booking summary',
  bookingSummarySubtitle:
    'Review your booking details before proceeding to payment.',
  almostThere: 'Almost there! One more step to confirm your luxury stay.',
  selectedStay: 'SELECTED STAY',
  roomType: 'Room Type',
  checkInDate: 'Check-in Date',
  checkOutDate: 'Check-out Date',
  guestsDetail: 'Guests',
  guestDetailsTitle: 'Guest Details',
  fullNameLabel: 'Full Name',
  fullNamePlaceholder: 'John Doe',
  emailLabel: 'Email Address',
  emailPlaceholder: 'john@example.com',
  phoneLabel: 'Phone',
  phonePlaceholder: '+1...',
  countryLabel: 'Country',
  termsText: 'I agree to the',
  termsLink: 'Terms of Service',
  termsAnd: 'and',
  cancellationLink: 'Cancellation Policy',
  specialRequestsTitle: 'Special Requests',
  specialRequestsPlaceholder:
    'Late check-in, dietary needs, or high floor preference...',
  priceSummaryTitle: 'Price Summary',
  ratePerNight: 'Rate per night',
  totalNights: 'Total Nights',
  serviceCharge: 'Service Charge (5%)',
  vatTaxes: 'VAT & Taxes (7.5%)',
  totalAmount: 'Total Amount',
  applyPromoCode: 'Apply Promo Code',
  enterCode: 'Enter code',
  applyBtn: 'Apply',
  proceedToPayment: 'Proceed to Payment',
  goBackStep2: 'Go Back to Step 2',
  needHelpBooking: 'Need help with your booking?',
  contact247: 'Contact our 24/7 Concierge',
  // Step 4
  paymentTitle: 'Payment',
  paymentSubtitle: 'Secure Payment for your stay at The Grand Oasis Abuja',
  securePayment: 'Secure Payment',
  step4SubTitle: 'Step 4 of 4: Finalize your booking',
  finalStep: 'Final Step: Secure your luxury stay',
  emailAddressLabel: 'Email Address',
  cardNumberLabel: 'Card Number',
  expiryDateLabel: 'Expiry Date',
  cvvLabel: 'CVV',
  totalToPay: 'Total to Pay',
  payBtn: 'Pay',
  securedByPaystack: 'Secured by Paystack',
  bookingSummaryLabel: 'BOOKING SUMMARY',
  subtotalLabel: 'Subtotal',
  serviceFeeLabel: 'Service Fee',
  vatLabel: 'VAT (7.5%)',
  // Breadcrumbs
  breadcrumbRoomSelection: 'Room Selection',
  breadcrumbGuestDetails: 'Guest Details',
  breadcrumbReview: 'Review',
  breadcrumbPayment: 'Payment',
  // Confirmation
  confirmationTitle: "You're all set!",
  confirmationSubtitle:
    'Your booking has been successfully processed. A confirmation email has been sent to your inbox.',
  confirmationId: 'CONFIRMATION ID',
  checkInLabel: 'CHECK-IN',
  checkOutLabel: 'CHECK-OUT',
  totalPaid: 'Total Paid',
  downloadPdf: 'Download PDF Receipt',
  returnHome: 'Return to Home',
  needHelpConfirmation: 'Need help with your booking?',
  contactSupport: 'Contact Support',
} as const;

export const BOOKING_ROOM_FILTERS = [
  'All Rooms',
  'Suites',
  'Standard',
] as const;

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

// ─── Guest Dashboard ──────────────────────────────────────────
export const GUEST_DASHBOARD_MESSAGES = {
  hotelName: 'THE GRAND OASIS',
  dashboardSubtitle: 'Guest Dashboard',
  welcomeTitle: 'Welcome back, Guest',
  welcomeSubtitle:
    'Manage your luxury stays and exclusive rewards at The Grand Oasis.',
  membershipLabel: 'GOLD MEMBER',
  memberIdPrefix: 'Member ID:',
  // Sidebar nav
  myBookings: 'My Bookings',
  bookingHistory: 'Booking History',
  profile: 'Profile',
  reviews: 'Reviews',
  notifications: 'Notifications',
  bookNewStay: '+ Book New Stay',
  logout: 'Logout',
  guest: 'Guest',
  guestName: 'John Doe',
  // Stats
  upcomingStays: 'UPCOMING STAYS',
  nextCheckIn: 'Next check-in: 3 days',
  pastStays: 'PAST STAYS',
  totalNights: 'Total nights: 42',
  rewardsPoints: 'REWARDS POINTS',
  tierLabel: 'Silver Tier (250 to Gold)',
  // Overview table
  recentBookingsTitle: 'My Recent Bookings',
  exportPdf: 'Export PDF',
  filter: 'Filter',
  colBookingId: 'BOOKING ID',
  colRoomType: 'ROOM TYPE',
  colDates: 'DATES',
  colAmount: 'AMOUNT',
  colStatus: 'STATUS',
  colActions: 'ACTIONS',
  showingOf: 'Showing',
  ofLabel: 'of',
  bookingsLabel: 'bookings',
  viewDetails: 'View Details',
  digitalKey: 'Digital Key',
  reviewStay: 'Review Stay',
  rebook: 'Rebook',
  // Status labels
  statusConfirmed: 'CONFIRMED',
  statusCheckedIn: 'CHECKED-IN',
  statusCheckedOut: 'CHECKED-OUT',
  statusCancelled: 'CANCELLED',
  statusPending: 'PENDING PAYMENT',
  // Mobile overview
  upcomingBookings: 'Upcoming Bookings',
  viewAll: 'View All',
  quickActions: 'Quick Actions',
  newStay: 'New Stay',
  services: 'Services',
  completeBooking: 'Complete Booking',
  // Offers
  exclusiveOffer: 'EXCLUSIVE OFFER',
  memberPerk: 'MEMBER PERK',
  offerTitle1: 'Weekend Oasis Getaway - 20% Off',
  offerTitle2: 'Complimentary Spa Session for Gold Members',
  // Booking History
  historyTitle: 'Booking History',
  historySubtitle: 'View and manage your past hotel reservations',
  tabAll: 'All Bookings',
  tabCompleted: 'Completed',
  tabCancelled: 'Cancelled',
  totalStays: 'Total Stays',
  totalSpent: 'Total Spent',
  loyaltyStatus: 'Loyalty Status',
  goldMember: 'Gold Member',
  // Profile
  profileTitle: 'Profile & Settings',
  saveChanges: 'Save Changes',
  personalInfo: 'Personal Information',
  firstNameLabel: 'First Name',
  lastNameLabel: 'Last Name',
  emailLabel: 'Email Address',
  phoneLabel: 'Phone Number',
  bioLabel: 'Bio',
  bioPlaceholder: 'Tell us a little about yourself...',
  updatePassword: 'Update Password',
  currentPasswordLabel: 'Current Password',
  newPasswordLabel: 'New Password',
  confirmNewPasswordLabel: 'Confirm New Password',
  preferencesTitle: 'Preferences',
  emailNotifications: 'Email Notifications',
  emailNotificationsDesc: 'Receive booking updates via email',
  marketingEmails: 'Marketing Emails',
  marketingEmailsDesc: 'Occasional offers and deals',
  languageLabel: 'Language',
  currencyLabel: 'Currency',
  linkedAccounts: 'Linked Accounts',
  connectLabel: 'Connect',
  disconnectLabel: 'Disconnect',
  dangerZone: 'Danger Zone',
  dangerZoneDesc: 'Deleting your account is permanent and cannot be undone.',
  deleteAccount: 'DELETE ACCOUNT',
  signOut: 'Sign Out',
  joinedLabel: 'JOINED JAN 2023',
  memberBadge: 'GOLD EXPLORER',
  // Mobile nav
  mobileHome: 'Home',
  mobileBookings: 'Bookings',
  mobileReviews: 'Reviews',
  mobileProfile: 'Profile',
  // Notifications page
  notificationsTitle: 'Notifications',
  notificationsSubtitle: 'Stay updated with your latest booking activities',
  markAllRead: 'Mark all as read',
  notifTabAll: 'All',
  notifTabUnread: 'Unread',
  notifTabArchived: 'Archived',
  viewArchive: 'View Archive',
  dismiss: 'Dismiss',
  noNotifications: 'No notifications here.',
  // Reviews page
  reviewsTitle: 'My Reviews',
  reviewsSubtitle:
    'Share your experience and help other guests make informed choices',
  reviewTabAll: 'All',
  reviewTabPending: 'Pending',
  reviewTabSubmitted: 'Submitted',
  leaveReview: 'Leave a Review',
  editReview: 'Edit Review',
  reviewSubmittedLabel: 'Reviewed',
  reviewPendingLabel: 'Awaiting Review',
  noReviews: 'No reviews yet.',
  reviewModalTitle: 'How was your stay?',
  reviewModalSubtitle:
    'Your honest feedback helps us improve and helps other guests.',
  ratingLabel: 'Your Rating',
  reviewLabel: 'Your Review',
  reviewPlaceholder:
    'Tell us about your experience — the room, service, cleanliness, etc.',
  submitReview: 'Submit Review',
} as const;

// ─── Admin Dashboard ──────────────────────────────────────────
export const ADMIN_DASHBOARD_MESSAGES = {
  // ── Shell & Navigation ──────────────────────────────────────
  hotelName: 'The Grand Oasis',
  adminDashboardLabel: 'Admin Dashboard',
  searchPlaceholder: 'Search...',
  openMenuAriaLabel: 'Open menu',
  closeMenuAriaLabel: 'Close menu',
  notificationsAriaLabel: 'Notifications',
  helpAriaLabel: 'Help',
  closePanelAriaLabel: 'Close panel',
  closeModalAriaLabel: 'Close modal',
  closeAriaLabel: 'Close',

  // ── Sidebar nav items ───────────────────────────────────────
  adminNavAriaLabel: 'Admin navigation',
  navOverview: 'Overview',
  navManageRooms: 'Manage Rooms',
  navAllBookings: 'All Bookings',
  navUsers: 'Users',
  navReviews: 'Reviews',
  navPromoCodes: 'Promo Codes',
  navAnalytics: 'Analytics',
  navSettings: 'Settings',
  navNotifications: 'Notifications',
  adminName: 'John Doe',
  adminRole: 'Super Admin',
  logoutAriaLabel: 'Logout',

  // ── Mobile bottom nav ───────────────────────────────────────
  mobileNavAriaLabel: 'Mobile navigation',
  mobileNavHome: 'Home',
  mobileNavBookings: 'Bookings',
  mobileNavAnalytics: 'Analytics',
  mobileNavSettings: 'Settings',

  // ── Shared actions ──────────────────────────────────────────
  cancel: 'Cancel',
  saveChanges: 'Save Changes',
  changeMonthSuffix: 'this month',
  downloadAriaLabel: 'Download',
  printAriaLabel: 'Print',
  editRoomAriaLabel: 'Edit room',
  deleteRoomAriaLabel: 'Delete room',
  editUserAriaLabel: 'Edit user',
  deleteUserAriaLabel: 'Delete user',
  editStatusAriaLabel: 'Edit status',
  deleteBookingAriaLabel: 'Delete booking',
  editPromoAriaLabel: 'Edit',
  deletePromoAriaLabel: 'Delete',
  renewPromoAriaLabel: 'Renew / reactivate',

  // ── Shared filter/status options ────────────────────────────
  allTypes: 'All Types',
  allStatuses: 'All Statuses',
  allRoomTypes: 'All Room Types',
  typeDeluxe: 'Deluxe',
  typeSuite: 'Suite',
  typeStandard: 'Standard',
  typeExecutive: 'Executive',
  statusAvailable: 'Available',
  statusOccupied: 'Occupied',
  statusMaintenance: 'Maintenance',
  statusConfirmed: 'Confirmed',
  statusPending: 'Pending',
  statusCheckedIn: 'Checked In',
  statusCheckedOut: 'Checked Out',
  statusCancelled: 'Cancelled',
  statusActive: 'Active',
  statusInactive: 'Inactive',
  statusSuspended: 'Suspended',
  statusScheduled: 'Scheduled',

  // ── Overview page ────────────────────────────────────────────
  overviewTitle: 'Dashboard Overview',
  overviewSubtitle:
    "Welcome back, Ibrahim. Here's what's happening at The Grand Oasis Abuja today.",
  chartOccupancyTitle: 'Occupancy Trends',
  chartRevenueTitle: 'Monthly Revenue',
  upcomingCheckinsTitle: 'Upcoming Check-ins',
  overviewColGuestName: 'Guest Name',
  overviewColRoomType: 'Room Type',
  overviewColArrival: 'Arrival',
  overviewColStatus: 'Status',
  overviewColAction: 'Action',
  tooltipOccupancy: 'Occupancy',
  tooltipRevenue: 'Revenue',
  actionCheckin: 'Check-in',
  actionApprove: 'Approve',
  statOccupancyRate: 'Occupancy Rate',
  statTodayCheckins: "Today's Check-ins",
  statTodayCheckouts: "Today's Check-outs",
  statDailyRevenue: 'Total Revenue (Daily)',

  // ── Rooms page ───────────────────────────────────────────────
  roomsTitle: 'Manage Rooms',
  addNewRoom: 'Add New Room',
  searchRoomsPlaceholder: 'Search rooms...',
  roomsColRoomInfo: 'Room Info',
  roomsColType: 'Type',
  roomsColPricePerNight: 'Price / Night',
  roomsColStatus: 'Status',
  roomsColActions: 'Actions',
  noRoomsFound: 'No rooms match your search or filters',

  // ── Bookings page ─────────────────────────────────────────────
  bookingsTitle: 'All Bookings',
  bookingsSubtitle: 'Manage and track all hotel reservations',
  bookingStatTotalBookings: 'Total Bookings',
  bookingStatPending: 'Pending',
  bookingStatCheckedIn: 'Checked-In',
  bookingsColBookingId: 'Booking ID',
  bookingsColGuestName: 'Guest Name',
  bookingsColRoom: 'Room',
  bookingsColCheckInOut: 'Check-in / Out',
  bookingsColAmount: 'Amount',
  bookingsColStatus: 'Status',
  bookingsColActions: 'Actions',
  noBookingsFound: 'No bookings match the current filter',

  // ── Users page ────────────────────────────────────────────────
  usersTitle: 'Users Management',
  usersSubtitle: 'Manage guest accounts and admin permissions',
  addAdmin: 'Add Admin',
  userStatTotalUsers: 'Total Users',
  userStatActiveGuests: 'Active Guests',
  userStatAdminAccounts: 'Admin Accounts',
  userDirectoryTitle: 'User Directory',
  userTabAll: 'All Users',
  userTabAdmins: 'Admins',
  userTabGuests: 'Guests',
  usersColUser: 'User',
  usersColEmail: 'Email',
  usersColRole: 'Role',
  usersColStatus: 'Status',
  usersColJoined: 'Joined',
  usersColActions: 'Actions',

  // ── Promo Codes page ──────────────────────────────────────────
  promoTitle: 'Promo Codes',
  promoSubtitle: 'Create and manage discount codes for guests',
  addNewCode: 'Add New Code',
  promoTabActive: 'Active Codes',
  promoTabExpired: 'Expired Codes',
  promoTabScheduled: 'Scheduled',
  promoColCodeName: 'Code Name',
  promoColDiscountValue: 'Discount Value',
  promoColUsage: 'Usage',
  promoColValidityPeriod: 'Validity Period',
  promoColStatus: 'Status',
  promoColActions: 'Actions',
  promoStatRedemptions: 'Total Redemptions',
  promoStatDiscountValue: 'Active Discount Value',
  promoStatConvRate: 'Average Conv. Rate',

  // ── RoomFormModal ─────────────────────────────────────────────
  roomFormAddTitle: 'Add New Room',
  roomFormEditTitle: 'Edit Room',
  roomFormAddSubtitle:
    'Fill in the details below to add a new room to the inventory',
  roomFormEditSubtitle: 'Update the room details and availability status',
  roomSectionBasicInfo: 'Basic Information',
  roomSectionPricing: 'Pricing & Availability',
  roomSectionDescription: 'Description',
  roomSectionImage: 'Room Image',
  roomLabelName: 'Room Name',
  roomLabelCode: 'Room Number',
  roomLabelType: 'Room Type',
  roomLabelPrice: 'Price per Night',
  roomLabelStatus: 'Availability Status',
  roomPlaceholderName: 'e.g. Deluxe King Suite 302',
  roomPlaceholderCode: 'e.g. 302',
  roomHintCode: 'The room reference (e.g. RN-302-DX) is auto-generated',
  roomDescriptionOptional: '(optional)',
  roomPlaceholderDescription:
    'Describe the room — highlight key features, views, furnishings, bed type, and included amenities...',
  roomUploadPrompt: 'Click to upload or drag & drop',
  roomUploadFormats: 'PNG, JPG, WebP — max 5 MB',
  roomOrPasteUrl: 'or paste an image URL',
  roomRemoveImage: 'Remove image',
  roomUploadPriority:
    'Uploaded file takes priority over URL if both are provided.',
  roomSubmitAdd: 'Add Room',

  // ── DeleteRoomModal ───────────────────────────────────────────
  deleteRoomTitle: 'Delete Room',
  deleteRoomBody: 'Are you sure you want to delete',
  deleteRoomBodySuffix: '? This action cannot be undone.',
  deleteRoomConfirm: 'Delete Room',

  // ── BookingStatusModal ────────────────────────────────────────
  bookingStatusTitle: 'Update Booking Status',
  bookingStatusSubtitle: 'Change the status for this reservation',
  bookingStatusLabel: 'Update Status To',
  bookingStatusSubmit: 'Update Status',

  // ── DeleteBookingModal ────────────────────────────────────────
  deleteBookingTitle: 'Delete Booking',
  deleteBookingBodyPrefix: 'Are you sure you want to delete booking',
  deleteBookingBodyFor: 'for',
  deleteBookingBodySuffix: '? This action cannot be undone.',
  deleteBookingConfirm: 'Delete Booking',

  // ── UserFormModal ─────────────────────────────────────────────
  userFormAddTitle: 'Add Admin Account',
  userFormEditTitle: 'Edit User',
  userFormAddSubtitle: 'Create a new admin account with dashboard access',
  userFormEditSubtitle: "Update this user's role and account status",
  userSectionAccountDetails: 'Account Details',
  userSectionSetPassword: 'Set Password',
  userSectionProfile: 'User Profile',
  userSectionSettings: 'Account Settings',
  userLabelFullName: 'Full Name',
  userLabelEmail: 'Email Address',
  userLabelPassword: 'Password',
  userLabelConfirmPassword: 'Confirm Password',
  userLabelRole: 'Role',
  userLabelAccountStatus: 'Account Status',
  userPlaceholderName: 'e.g. Amara Okonkwo',
  userPlaceholderEmail: 'e.g. amara@grandoasis.com',
  userPlaceholderPassword: 'Minimum 8 characters',
  userPlaceholderConfirmPassword: 'Re-enter the password',
  userShowPasswordAriaLabel: 'Show password',
  userHidePasswordAriaLabel: 'Hide password',
  userRoleGuestOption: 'Guest',
  userRoleAdminOption: 'Admin',
  userRoleHintAdmin:
    'Admin accounts have full access to the management dashboard.',
  userRoleHintGuest:
    'Guest accounts can browse rooms and manage their own bookings.',
  userStatusHintInactive: 'Inactive accounts are disabled and cannot log in.',
  userStatusHintSuspended: 'Suspended accounts are blocked pending review.',
  userStatusHintActive:
    'Account is active and has full access based on their role.',
  userAddAdminBanner:
    'This will create an Admin account with full access to the management dashboard. Share the credentials securely with the new admin.',
  userEditNote:
    'Name and email can only be changed by the account holder in their profile settings.',
  userJoinedPrefix: 'Joined',
  userSubmitCreateAdmin: 'Create Admin',

  // ── DeleteUserModal ───────────────────────────────────────────
  deleteUserTitle: 'Delete User Account',
  deleteUserBodyPrefix: 'Are you sure you want to permanently delete',
  deleteUserBodySuffix:
    '? Their booking history will also be removed. This action cannot be undone.',
  deleteUserConfirm: 'Delete Account',

  // ── PromoFormModal ────────────────────────────────────────────
  promoFormAddTitle: 'Add New Promo Code',
  promoFormEditTitle: 'Edit Promo Code',
  promoFormAddSubtitle: 'Create a new discount code for guests',
  promoFormEditSubtitle: 'Update the promo code details and status',
  promoSectionCodeDetails: 'Code Details',
  promoSectionDiscount: 'Discount',
  promoSectionValidity: 'Validity & Status',
  promoLabelCode: 'Promo Code',
  promoLabelDescription: 'Description',
  promoLabelDiscountType: 'Discount Type',
  promoLabelDiscountValue: 'Discount Value',
  promoLabelUsageLimit: 'Usage Limit',
  promoLabelValidFrom: 'Valid From',
  promoLabelValidTo: 'Valid To',
  promoLabelStatus: 'Status',
  promoPlaceholderCode: 'e.g. GRAND25',
  promoPlaceholderDescription: 'e.g. 25% off all suite bookings',
  promoHintCode: 'Uppercase letters and numbers only — no spaces or symbols',
  promoDiscountTypePercentage: 'Percentage (%)',
  promoDiscountTypeFixed: 'Fixed Amount (₦)',
  promoSubmitCreate: 'Create Code',

  // ── DeletePromoModal ──────────────────────────────────────────
  deletePromoTitle: 'Delete Promo Code',
  deletePromoBodyPrefix: 'Are you sure you want to permanently delete the code',
  deletePromoBodySuffix:
    '? Any guests who have saved this code will no longer be able to redeem it. This action cannot be undone.',
  deletePromoConfirm: 'Delete Code',
} as const;
