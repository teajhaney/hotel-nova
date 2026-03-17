import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { HOME_IMAGES, ROOM_LISTING_IMAGES, OFFER_IMAGES, ABOUT_IMAGES } from "./images";
import type { Testimonial, RoomListing, Offer, TeamMember } from "@/type/type";

export const FEATURED_ROOMS = [
  {
    id: '1',
    image: HOME_IMAGES.rooms.deluxeKing,
    name: 'Deluxe Oasis King',
    description:
      'King Bed · City Views. A restful and rejuvenating atmosphere with premium furnishings and panoramic windows.',
    priceFrom: 350000,
    badge: null,
  },
  {
    id: '2',
    image: HOME_IMAGES.rooms.executiveView,
    name: 'Executive Grand Suite',
    description:
      'Spacious living area, floor-to-ceiling windows, and exclusive lounge access for the modern professional.',
    priceFrom: 750000,
    badge: null,
  },
  {
    id: '3',
    image: HOME_IMAGES.rooms.presidentialSuite,
    name: 'Presidential Penthouse',
    description:
      'The pinnacle of luxury — private terrace, butler service, and bespoke experiences crafted exclusively for you.',
    priceFrom: 1350000,
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
  { href: '/offers', label: 'Offers' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];


export const ROOM_LISTINGS: RoomListing[] = [
  {
    id: 'executive-suite',
    image: ROOM_LISTING_IMAGES.executiveSuite,
    name: 'Executive Suite',
    price: 680000,
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
    price: 480000,
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
    price: 1875000,
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
    price: 570000,
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
    price: 315000,
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
    price: 580000,
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
    price: 220000,
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
    price: 780000,
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

export const OFFERS: Offer[] = [
  {
    id: 'romantic-getaway',
    image: OFFER_IMAGES.romanticGetaway,
    title: 'Romantic Getaway Package',
    description:
      'Escape into luxury with our signature romantic experience. Includes a stay in our Royal Suite, a three-course dinner under the stars at The Palm court, a bottle of vintage champagne, and a private 90-minute couples massage.',
    category: ['all', 'romantic'],
    discountText: 'SAVE 25% TODAY',
    originalPrice: 675000,
    price: 505000,
    priceLabel: '/night',
    terms: ['Min. 2 nights stay', '48h cancellation', 'Subject to availability'],
    isFeatured: true,
  },
  {
    id: 'business-traveler-special',
    image: OFFER_IMAGES.businessTraveler,
    title: 'Business Traveler Special',
    description:
      'Seamless stays for the modern professional. Includes high-speed Wi-Fi, executive lounge access, complimentary laundry for 2 items, and late check-out at 4:00 PM.',
    category: ['all', 'business'],
    badge: 'business',
    discountText: '15% OFF',
    price: 0,
    priceLabel: '',
    terms: [],
    disclaimer: 'Valid for Sunday-Thursday stays only. Requires valid corporate ID.',
  },
  {
    id: 'weekend-spa-retreat',
    image: OFFER_IMAGES.spaRetreat,
    title: 'Weekend Spa Retreat',
    description:
      'Rejuvenate your spirit with our wellness weekend. Includes Deluxe Room, organic breakfast buffet, and unlimited access to thermal pools and sauna facilities.',
    category: ['all', 'seasonal'],
    badge: 'leisure',
    price: 315000,
    priceLabel: 'Fixed',
    terms: [],
    disclaimer: 'Saturday night stay required. Spa treatments must be booked 24h in advance.',
  },
  {
    id: 'summer-escape',
    image: OFFER_IMAGES.summerEscape,
    title: 'Summer Escape',
    description:
      'Make the most of the season with poolside luxury. Includes daily breakfast, two complimentary cocktails, and late checkout.',
    category: ['all', 'seasonal', 'lastMinute'],
    price: 285000,
    priceLabel: '/night',
    terms: ['Valid June - August', 'Min. 3 nights'],
  },
  {
    id: 'family-fun-package',
    image: OFFER_IMAGES.familyFun,
    title: 'Family Fun Package',
    description:
      'Create lasting memories with your loved ones. Includes connecting rooms, kids eat free, access to our game room, and complimentary airport transfer.',
    category: ['all', 'seasonal'],
    price: 640000,
    priceLabel: '/night',
    terms: ['Valid for families with 2+ children', 'Weekend stays'],
  },
  {
    id: 'midweek-special',
    image: OFFER_IMAGES.midweekSpecial,
    title: 'Midweek Special',
    description:
      'Enjoy midweek tranquility at a special rate. Perfect for a quick getaway with complimentary room upgrade based on availability.',
    category: ['all', 'lastMinute'],
    discountText: '20% OFF',
    price: 240000,
    priceLabel: '/night',
    terms: ['Mon-Wed stays only', 'Book 48h in advance'],
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Amara Okafor',
    role: 'General Manager',
    image: ABOUT_IMAGES.team.member1,
    bgColor: 'bg-[#5F9EA0]',
  },
  {
    id: '2',
    name: 'Fatima Bello',
    role: 'Head of Concierge',
    image: ABOUT_IMAGES.team.member2,
    bgColor: 'bg-[#8B7355]',
  },
  {
    id: '3',
    name: 'David Mensah',
    role: 'Executive Chef',
    image: ABOUT_IMAGES.team.member3,
    bgColor: 'bg-[#B8A99A]',
  },
  {
    id: '4',
    name: 'Zainab Yusuf',
    role: 'Operations Director',
    image: ABOUT_IMAGES.team.member4,
    bgColor: 'bg-[#4A5568]',
  },
];
