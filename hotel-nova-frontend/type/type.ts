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

export type BookingRoom = {
  id: string;
  image: string;
  name: string;
  description: string;
  pricePerNight: number;
  badge: 'popular' | 'bestseller' | null;
  sqm: number;
  maxGuests: number;
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
