import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { HOME_IMAGES, ROOM_LISTING_IMAGES } from "./images";
import type { Testimonial, RoomListing } from "@/type/type";

export const FEATURED_ROOMS = [
  {
    id: '1',
    image: HOME_IMAGES.rooms.deluxeKing,
    name: 'Deluxe Oasis King',
    description:
      'King Bed · City Views. A restful and rejuvenating atmosphere with premium furnishings and panoramic windows.',
    priceFrom: 229,
    badge: null,
  },
  {
    id: '2',
    image: HOME_IMAGES.rooms.executiveView,
    name: 'Executive Grand Suite',
    description:
      'Spacious living area, floor-to-ceiling windows, and exclusive lounge access for the modern professional.',
    priceFrom: 499,
    badge: null,
  },
  {
    id: '3',
    image: HOME_IMAGES.rooms.presidentialSuite,
    name: 'Presidential Penthouse',
    description:
      'The pinnacle of luxury — private terrace, butler service, and bespoke experiences crafted exclusively for you.',
    priceFrom: 889,
    badge: 'All Inclusive',
  },
] as const;


export const QUICK_LINKS = [
  { href: '/rooms', label: 'Our Suites' },
  { href: '/#dining', label: 'Dining Venues' },
  { href: '/#amenities', label: 'Spa & Wellness' },
  { href: '/#events', label: 'Meetings & Events' },
  { href: '/gallery', label: 'Photo Gallery' },
];

export const POLICY_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/refunds', label: 'Refund Policy' },
  { href: '/accessibility', label: 'Accessibility' },
];

export const SOCIAL_LINKS = [
  { icon: Twitter,   href: '#', label: 'Twitter — Grand Oasis Abuja'   },
  { icon: Youtube,   href: '#', label: 'YouTube — Grand Oasis Abuja'   },
  { icon: Instagram, href: '#', label: 'Instagram — Grand Oasis Abuja' },
  { icon: Facebook,  href: '#', label: 'Facebook — Grand Oasis Abuja'  },
];


export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms' },
  { href: '/#offers', label: 'Offers' },
  { href: '/#about', label: 'About Us' },
  { href: '/#contact', label: 'Contact' },
];


export const ROOM_LISTINGS: RoomListing[] = [
  {
    id: 'executive-suite',
    image: ROOM_LISTING_IMAGES.executiveSuite,
    name: 'Executive Suite',
    price: 450,
    rating: 4.9,
    reviewCount: 128,
    badge: 'recommended',
    beds: '2 King',
    guests: 4,
    sqft: 850,
    amenities: ['Pool', 'WiFi'],
  },
  {
    id: 'deluxe-terrace',
    image: ROOM_LISTING_IMAGES.deluxeTerrace,
    name: 'Deluxe Terrace',
    price: 320,
    rating: 4.7,
    reviewCount: 95,
    badge: 'popular',
    beds: '1 King',
    guests: 2,
    sqft: 580,
    amenities: ['Pool View'],
  },
  {
    id: 'presidential-suite',
    image: ROOM_LISTING_IMAGES.presidentialSuite,
    name: 'Presidential Suite',
    price: 1250,
    rating: 5.0,
    reviewCount: 42,
    badge: 'recommended',
    beds: '2 King',
    guests: 6,
    sqft: 1400,
    amenities: ['Private Bar'],
  },
  {
    id: 'panoramic-king',
    image: ROOM_LISTING_IMAGES.panoramicKing,
    name: 'Panoramic King',
    price: 380,
    rating: 4.8,
    reviewCount: 76,
    badge: null,
    beds: '1 King',
    guests: 2,
    sqft: 620,
    amenities: ['City View', 'Spa Tub'],
  },
  {
    id: 'deluxe-king-garden',
    image: ROOM_LISTING_IMAGES.deluxeKingGarden,
    name: 'Deluxe King Garden View',
    price: 210,
    rating: 4.6,
    reviewCount: 112,
    badge: null,
    beds: '1 King',
    guests: 2,
    sqft: 450,
    amenities: ['Garden View'],
  },
  {
    id: 'oceanfront-executive',
    image: ROOM_LISTING_IMAGES.oceanfrontExecutive,
    name: 'Oceanfront Executive Suite',
    price: 385,
    rating: 4.8,
    reviewCount: 64,
    badge: 'popular',
    beds: '1 King',
    guests: 3,
    sqft: 720,
    amenities: ['Ocean View'],
  },
  {
    id: 'superior-studio',
    image: ROOM_LISTING_IMAGES.superiorStudio,
    name: 'Superior Single Studio',
    price: 145,
    rating: 4.5,
    reviewCount: 203,
    badge: null,
    beds: '1 Queen',
    guests: 2,
    sqft: 380,
    amenities: ['WiFi'],
  },
  {
    id: 'grand-deluxe',
    image: ROOM_LISTING_IMAGES.grandDeluxe,
    name: 'Grand Deluxe Suite',
    price: 520,
    rating: 4.9,
    reviewCount: 58,
    badge: null,
    beds: '2 King',
    guests: 4,
    sqft: 950,
    amenities: ['Pool', 'Spa'],
  },
];

export const ROOM_TYPES = [
  'Executive Suites',
  'Deluxe Rooms',
  'Standard King',
] as const;

export const ROOM_AMENITY_FILTERS = [
  'WiFi',
  'Pool Access',
  'Fitness Gym',
] as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Williams',
    role: 'Business Traveler',
    rating: 5,
    review:
      'The attention to detail is remarkable. From the moment I stepped into the lobby, I felt like royalty. The spa treatments are simply the best in Abuja.',
    avatarColor: 'bg-[#7CA5B8]',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Holiday Guest',
    rating: 5,
    review:
      'An incredible stay. The rooftop restaurant offers breathtaking views of the city. Highly recommend the Executive Suite for anyone seeking luxury.',
    avatarColor: 'bg-[#9CA3AF]',
  },
  {
    id: '3',
    name: 'David Okoro',
    role: 'Event Organizer',
    rating: 5,
    review:
      'Perfect for our corporate retreat. The conference facilities are modern and the team was incredibly helpful throughout our event.',
    avatarColor: 'bg-[#A9DBBB]',
  },
];
