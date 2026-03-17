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
