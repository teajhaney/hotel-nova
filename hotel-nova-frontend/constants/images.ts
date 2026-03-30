/**
 * HotelNova — Image Constants
 *
 * All external image URLs used across the app.
 * Centralised here so they are easy to swap later
 * (e.g. move to a CDN or use local assets).
 */

export const HOME_IMAGES = {
  /** Hero — grand hotel exterior with pool and palm trees */
  hero: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=90',

  /** Hero carousel — rotating images for the landing page */
  heroCarousel: [
    /** Grand hotel exterior with pool and palm trees */
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=90',
    /** Luxurious hotel room with warm golden lighting */
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1920&q=90',
    /** Elegant hotel lobby with grand chandelier */
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1920&q=90',
    /** Stunning hotel infinity pool at sunset */
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1920&q=90',
  ] as const,

  rooms: {
    /** Presidential Oasis Suite — expansive luxury suite interior */
    presidentialSuite:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    /** Executive Garden View — elegant king room with natural light */
    executiveView:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
    /** Deluxe King Suite — sophisticated standard deluxe room */
    deluxeKing:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },

  amenities: {
    /** Infinity pool overlooking scenic landscape */
    pool: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    /** Luxury spa treatment room with warm lighting */
    spa: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    /** Fine dining restaurant with elegant table settings */
    dining:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    /** State-of-the-art hotel fitness centre */
    gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  },

  /** Legacy section — grand hotel lobby interior with warm timber tones */
  legacy:
    'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=900&q=80',

  /** Promo section — romantic hotel room ambience */
  promo:
    'https://images.unsplash.com/photo-1540541338537-71cf3b17d898?auto=format&fit=crop&w=1920&q=80',
} as const;

export const ROOM_LISTING_IMAGES = {
  executiveSuite:
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  deluxeTerrace:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  presidentialSuite:
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  panoramicKing:
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
  deluxeKingGarden:
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
  oceanfrontExecutive:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  superiorStudio:
    'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80',
  grandDeluxe:
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
} as const;

export const AUTH_IMAGES = {
  /** Login right-panel — ornate lobby chandelier */
  loginPanel:
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',

  /** Signup right-panel — hotel exterior with pool */
  signupPanel:
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80',
} as const;

export const OFFER_IMAGES = {
  /** Romantic Getaway — luxury hotel room with elegant lighting */
  romanticGetaway:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  /** Business Traveler — modern business lounge */
  businessTraveler:
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
  /** Weekend Spa Retreat — sunset infinity pool */
  spaRetreat:
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
  /** Summer Escape — tropical hotel pool */
  summerEscape:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  /** Family Fun — spacious family suite */
  familyFun:
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  /** Midweek Special — cozy hotel room */
  midweekSpecial:
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
} as const;

export const ABOUT_IMAGES = {
  /** Hero — grand hotel exterior at dusk */
  hero: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1920&q=90',
  /** Our Story — elegant hotel room */
  storyRoom:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  /** Our Story — modern hotel lounge */
  storyLounge:
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
  /** Team member photos — professional portraits */
  team: {
    member1:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    member2:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    member3:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=600&q=80',
    member4:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  },
} as const;

export const CONTACT_IMAGES = {
  /** Contact hero — hotel building at evening */
  hero: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1920&q=90',
} as const;

export const BOOKING_IMAGES = {
  map: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
} as const;
