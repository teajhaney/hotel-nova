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
