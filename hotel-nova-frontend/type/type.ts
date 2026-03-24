export type Testimonial = {
  id: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  avatarColor: string;
};

export type RoomListing = {
  id: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  badge: 'recommended' | 'popular' | null;
  beds: string;
  guests: number;
  sqft: number;
  amenities: string[];
};

export type OfferCategory = 'all' | 'seasonal' | 'business' | 'romantic' | 'lastMinute';

export type OfferBadge = 'business' | 'leisure' | null;

export type Offer = {
  id: string;
  image: string;
  title: string;
  description: string;
  category: OfferCategory[];
  badge?: OfferBadge;
  discountText?: string;
  originalPrice?: number;
  price: number;
  priceLabel: string;
  terms: string[];
  disclaimer?: string;
  isFeatured?: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  bgColor?: string;
};

// Mirrors the Room fields we actually need during the booking wizard.
// Populated from the backend Room API response — no dummy or derived fields.
export type BookingRoom = {
  id: string;
  name: string;
  type: string;
  price: number;          // price per night in kobo (matches Room.price from API)
  imageUrl: string | null;
  description: string | null;
  beds: string | null;
  maxGuests: number;
  sqm: number | null;
  amenities: string[];
};

export type GuestDetails = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  agreeToTerms: boolean;
};

export type BookingWizardState = {
  checkIn: string | null;   // ISO date string "YYYY-MM-DD"
  checkOut: string | null;
  adults: number;
  children: number;
  rooms: number;
  selectedRoom: BookingRoom | null;
  guestDetails: GuestDetails | null;
  promoCode: string;
  promoDiscount: number;
  specialRequests: string;
};

export type BookingStatus = 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'pending';

// Payload sent to POST /api/bookings
export type CreateBookingPayload = {
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  promoCode?: string;
};

// Shape returned by POST /api/bookings (mirrors the NestJS CreateBookingResult)
export type CreateBookingApiResponse = {
  booking: {
    id: string;
    bookingRef: string;
    paymentReference: string;
    guestId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    adults: number;
    children: number;
    pricePerNight: number;
    subtotal: number;
    serviceCharge: number;
    vat: number;
    promoDiscount: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  paymentUrl: string;
};

export type GuestBooking = {
  id: string;
  roomType: string;
  roomSubtype: string;
  image: string;
  checkIn: string;  // ISO date "YYYY-MM-DD"
  checkOut: string;
  nights: number;
  amount: number;   // in NGN kobo-level (whole number)
  status: BookingStatus;
};

// ─── Backend API booking types ────────────────────────────────────────────────

// BookingStatus values as returned by the NestJS Prisma enum (PascalCase).
export type ApiBookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'CheckedIn'
  | 'CheckedOut'
  | 'Cancelled';

// Maps backend Prisma status → the frontend display BookingStatus.
export function mapBookingStatus(status: ApiBookingStatus): BookingStatus {
  const map: Record<ApiBookingStatus, BookingStatus> = {
    Pending: 'pending',
    Confirmed: 'confirmed',
    CheckedIn: 'checked-in',
    CheckedOut: 'checked-out',
    Cancelled: 'cancelled',
  };
  return map[status];
}

// Raw shape returned by GET /api/bookings/my.
// The backend includes the room relation so we can show the room name and photo.
export type ApiBooking = {
  id: string;
  bookingRef: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: number; // in kobo
  status: ApiBookingStatus;
  paymentStatus: string;
  createdAt: string;
  room: {
    id: string;
    name: string;
    type: string;
    photos: string[] | null;
  };
};

export type NotificationType =
  | 'booking_confirmed'
  | 'checkout_reminder'
  | 'payment_received'
  | 'review_prompt'
  | 'security';

export type GuestNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  boldWord?: string; // word to highlight in bold
  time: string;
  read: boolean;
  archived: boolean;
  actionLabel: string;
  actionHref: string;
};

export type GuestReview = {
  id: string;
  bookingId: string;
  roomType: string;
  roomSubtype: string;
  image: string;
  checkIn: string;
  checkOut: string;
  rating: number | null; // null = not yet reviewed
  reviewText: string | null;
  submittedAt: string | null;
};

