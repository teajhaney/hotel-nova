import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { HOME_IMAGES } from "./images";
import { Testimonial } from "@/type/type";

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
