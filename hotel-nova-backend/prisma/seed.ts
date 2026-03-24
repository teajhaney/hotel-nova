import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

// Set up the database connection the same way PrismaService does
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma: PrismaClient = new PrismaClient({ adapter });

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// Extracts the numeric room number from a roomRef like 'RN-109-SD' → 109.
function roomNumberFromRef(roomRef: string): number {
  return parseInt(roomRef.split('-')[1], 10);
}

// Converts naira to kobo. All money in the DB is stored as integers (kobo).
// e.g. naira(75_000) → 7_500_000
function naira(amount: number): number {
  return amount * 100;
}

// Calculates pricing fields from a nightly rate and number of nights.
// Returns all the fields Booking expects so we don't repeat this math 3 times.
function calcPricing(
  pricePerNightNaira: number,
  nights: number,
  promoDiscountNaira = 0,
) {
  const pricePerNight = naira(pricePerNightNaira);
  const subtotal = pricePerNight * nights;
  const serviceCharge = Math.round(subtotal * 0.05);
  const vat = Math.round(subtotal * 0.075);
  const promoDiscount = naira(promoDiscountNaira);
  const totalAmount = subtotal + serviceCharge + vat - promoDiscount;
  return {
    pricePerNight,
    subtotal,
    serviceCharge,
    vat,
    promoDiscount,
    totalAmount,
  };
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding database...');

  // ── 1. USERS ──────────────────────────────────────────────────────────────
  // We upsert (update-or-insert) so that re-running the seed never fails
  // with "email already exists". It just updates the record if it's already there.

  console.log('  Creating users...');

  const hashedAdminPassword = await argon2.hash('Admin1234!');
  const hashedGuestPassword = await argon2.hash('Guest1234!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hotelnova.com' },
    update: {},
    create: {
      email: 'admin@hotelnova.com',
      password: hashedAdminPassword,
      fullName: 'Hotel Nova Admin',
      phone: '+2348000000001',
      country: 'Nigeria',
      role: 'ADMIN',
      status: 'Active',
    },
  });

  const amara = await prisma.user.upsert({
    where: { email: 'amara@example.com' },
    update: {},
    create: {
      email: 'amara@example.com',
      password: hashedGuestPassword,
      fullName: 'Amara Okafor',
      phone: '+2348012345678',
      country: 'Nigeria',
      role: 'GUEST',
      status: 'Active',
    },
  });

  const james = await prisma.user.upsert({
    where: { email: 'james@example.com' },
    update: {},
    create: {
      email: 'james@example.com',
      password: hashedGuestPassword,
      fullName: 'James Adeyemi',
      phone: '+2348087654321',
      country: 'Nigeria',
      role: 'GUEST',
      status: 'Active',
    },
  });

  console.log(`  ✓ ${admin.fullName} (admin)`);
  console.log(`  ✓ ${amara.fullName} (guest)`);
  console.log(`  ✓ ${james.fullName} (guest)`);

  // ── 2. ROOMS ──────────────────────────────────────────────────────────────
  // 30 rooms across 4 types. Prices are stored in kobo via the naira() helper.
  // Images are high-quality Unsplash photos — replace with Cloudinary URLs
  // once the admin upload feature is built.

  console.log('\n  Creating rooms...');

  const rooms = [
    // ── STANDARD (10 rooms) — Floor 1 ────────────────────────────────────
    {
      roomRef: 'RN-101-SD',
      name: 'Standard Room 101',
      type: 'Standard' as const,
      price: naira(5_000),
      beds: '1 Queen Bed',
      maxGuests: 2,
      sqm: 22,
      description:
        'A comfortable standard room with a queen bed, city view, and all essential amenities. Perfect for solo travellers and couples on a short stay.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-102-SD',
      name: 'Standard Room 102',
      type: 'Standard' as const,
      price: naira(5_000),
      beds: '2 Twin Beds',
      maxGuests: 2,
      sqm: 22,
      description:
        'Bright and airy standard room with twin beds — ideal for friends or colleagues travelling together. Includes all essential amenities.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-103-SD',
      name: 'Standard Room 103',
      type: 'Standard' as const,
      price: naira(5_000),
      beds: '1 Queen Bed',
      maxGuests: 2,
      sqm: 22,
      description:
        'A well-appointed standard room featuring modern décor, a comfortable queen bed, and a private bathroom with premium toiletries.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-104-SD',
      name: 'Standard Room 104',
      type: 'Standard' as const,
      price: naira(5_500),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 24,
      description:
        'A spacious standard room with a king bed and garden view. Slightly larger than our classic rooms, offering extra comfort at great value.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Mini Refrigerator',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-105-SD',
      name: 'Standard Room 105',
      type: 'Standard' as const,
      price: naira(5_000),
      beds: '1 Queen Bed',
      maxGuests: 2,
      sqm: 22,
      description:
        'Cosy and quiet standard room on the first floor. Features blackout curtains and soundproofed walls for an uninterrupted rest.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-106-SD',
      name: 'Standard Room 106',
      type: 'Standard' as const,
      price: naira(5_000),
      beds: '2 Twin Beds',
      maxGuests: 2,
      sqm: 22,
      description:
        'Modern standard room with twin beds and a clean, minimalist design. A reliable choice for guests who value simplicity and comfort.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-107-SD',
      name: 'Standard Room 107',
      type: 'Standard' as const,
      price: naira(5_500),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 24,
      description:
        'Standard room with a king bed and natural wood finishings. Warm, welcoming atmosphere with all the comforts you need.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Mini Refrigerator',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-108-SD',
      name: 'Standard Room 108',
      type: 'Standard' as const,
      price: naira(6_000),
      beds: '1 King Bed',
      maxGuests: 3,
      sqm: 26,
      description:
        'Our largest standard room, accommodating up to 3 guests. Features a king bed, a sofa, and a full-length mirror in a thoughtfully designed space.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Mini Refrigerator',
        'Sofa',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-109-SD',
      name: 'Standard Room 109',
      type: 'Standard' as const,
      price: naira(5_000),
      beds: '1 Queen Bed',
      maxGuests: 2,
      sqm: 22,
      description:
        'A bright standard room with a garden-facing window. Clean, functional, and comfortable — everything you need for a restful stay.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-110-SD',
      name: 'Standard Room 110',
      type: 'Standard' as const,
      price: naira(6_500),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 25,
      description:
        'Our premium standard room with a king bed, upgraded mattress, and a private balcony. An excellent step up from our classic standard rooms.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Flat-screen TV',
        'Mini Refrigerator',
        'Private Balcony',
        'Work Desk',
        'In-room Safe',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop',
    },

    // ── DELUXE (10 rooms) — Floor 2 ───────────────────────────────────────
    {
      roomRef: 'RN-201-DX',
      name: 'Deluxe King 201',
      type: 'Deluxe' as const,
      price: naira(8_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 32,
      description:
        'An elevated experience with a king bed, premium linen, and a marble-finished bathroom. Floor-to-ceiling windows fill the room with natural light.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1578683994051-ccc8e5e59a0d?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-202-DX',
      name: 'Deluxe Twin 202',
      type: 'Deluxe' as const,
      price: naira(8_500),
      beds: '2 Double Beds',
      maxGuests: 4,
      sqm: 35,
      description:
        'A spacious deluxe room with two double beds — perfect for families or groups of four. Stylishly furnished with premium fittings throughout.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1522771739844-6a9f6a5f3f8c?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-203-DX',
      name: 'Deluxe King 203',
      type: 'Deluxe' as const,
      price: naira(9_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 33,
      description:
        'A refined deluxe room with panoramic city views and a plush king bed. Premium amenities and attentive service make every stay memorable.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'City View',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-204-DX',
      name: 'Deluxe King 204',
      type: 'Deluxe' as const,
      price: naira(8_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 32,
      description:
        'Warm-toned deluxe room with rich fabrics and a king bed. Enjoy your morning coffee from the private balcony overlooking the hotel gardens.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'Private Balcony',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1578683994051-ccc8e5e59a0d?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-205-DX',
      name: 'Deluxe Queen 205',
      type: 'Deluxe' as const,
      price: naira(8_000),
      beds: '1 Queen Bed',
      maxGuests: 2,
      sqm: 30,
      description:
        'A beautifully appointed deluxe room with a queen bed and elegant décor. Modern comforts paired with warm hospitality.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1522771739844-6a9f6a5f3f8c?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-206-DX',
      name: 'Deluxe King 206',
      type: 'Deluxe' as const,
      price: naira(9_500),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 34,
      description:
        'One of our most popular deluxe rooms featuring a spa-style rain shower, king bed, and premium Molton Brown toiletries. Indulge in pure comfort.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'Rain Shower',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-207-DX',
      name: 'Deluxe Twin 207',
      type: 'Deluxe' as const,
      price: naira(8_500),
      beds: '2 Double Beds',
      maxGuests: 4,
      sqm: 35,
      description:
        'Ideal for families, this deluxe room offers two double beds, extra wardrobe space, and child-friendly amenities on request.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1578683994051-ccc8e5e59a0d?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-208-DX',
      name: 'Deluxe King 208',
      type: 'Deluxe' as const,
      price: naira(10_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 36,
      description:
        'A premium deluxe room with pool-facing views, a king bed, and a separate sitting area. Watch the sunset from your private balcony.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'Pool View',
        'Private Balcony',
        'Sitting Area',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1522771739844-6a9f6a5f3f8c?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-209-DX',
      name: 'Deluxe King 209',
      type: 'Deluxe' as const,
      price: naira(8_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 32,
      description:
        'Chic and contemporary deluxe room with curated artwork and a king bed. A sophisticated retreat in the heart of the hotel.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-210-DX',
      name: 'Deluxe King 210',
      type: 'Deluxe' as const,
      price: naira(10_500),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 38,
      description:
        'Our finest deluxe room — a corner unit with dual-aspect windows, a soaking tub, and upgraded finishings throughout. A step below our executive rooms.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Mini Bar',
        'Nespresso Machine',
        'Soaking Bathtub',
        'Corner Room',
        'Work Desk',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Daily Housekeeping',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1578683994051-ccc8e5e59a0d?w=1200&q=80&auto=format&fit=crop',
    },

    // ── EXECUTIVE (6 rooms) — Floor 3 ─────────────────────────────────────
    {
      roomRef: 'RN-301-EX',
      name: 'Executive King 301',
      type: 'Executive' as const,
      price: naira(12_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 48,
      description:
        'A distinguished executive room with a separate lounge area, walk-in wardrobe, and stunning panoramic views. Complimentary access to the Executive Lounge.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Full Mini Bar',
        'Nespresso Machine',
        'Panoramic View',
        'Separate Lounge Area',
        'Walk-in Wardrobe',
        'Executive Lounge Access',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-302-EX',
      name: 'Executive King 302',
      type: 'Executive' as const,
      price: naira(12_500),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 50,
      description:
        'Sophisticated executive room with floor-to-ceiling windows, a marble bathroom with double vanity, and a private balcony. Designed for the discerning guest.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Full Mini Bar',
        'Nespresso Machine',
        'Private Balcony',
        'Double Vanity',
        'Separate Lounge Area',
        'Executive Lounge Access',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-303-EX',
      name: 'Executive Twin 303',
      type: 'Executive' as const,
      price: naira(13_000),
      beds: '2 King Beds',
      maxGuests: 4,
      sqm: 55,
      description:
        'A rare executive room with two king beds — offering premium accommodation for families or business guests needing extra space without compromising on luxury.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Full Mini Bar',
        'Nespresso Machine',
        'City View',
        'Separate Lounge Area',
        'Executive Lounge Access',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-304-EX',
      name: 'Executive King 304',
      type: 'Executive' as const,
      price: naira(12_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 48,
      description:
        'Warm executive room furnished with handcrafted wooden accents and plush fabrics. The marble bathroom features a freestanding soaking tub and separate rain shower.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Full Mini Bar',
        'Nespresso Machine',
        'Freestanding Soaking Tub',
        'Rain Shower',
        'Separate Lounge Area',
        'Executive Lounge Access',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-305-EX',
      name: 'Executive King 305',
      type: 'Executive' as const,
      price: naira(14_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 52,
      description:
        'Our corner executive room with stunning 180-degree views of the city skyline. Features a private bar, walk-in wardrobe, and exclusive concierge service.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Full Mini Bar',
        'Nespresso Machine',
        '180° City View',
        'Corner Room',
        'Private Bar',
        'Walk-in Wardrobe',
        'Executive Lounge Access',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Dedicated Concierge',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-306-EX',
      name: 'Executive King 306',
      type: 'Executive' as const,
      price: naira(15_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 55,
      description:
        'The crown of our executive floor — a sprawling room with a private terrace, outdoor seating, and unobstructed garden views. Exceptional in every detail.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV',
        'Full Mini Bar',
        'Nespresso Machine',
        'Private Terrace',
        'Garden View',
        'Soaking Bathtub',
        'Separate Lounge Area',
        'Executive Lounge Access',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Dedicated Concierge',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1200&q=80&auto=format&fit=crop',
    },

    // ── SUITE (4 rooms) — Floor 4 ──────────────────────────────────────────
    {
      roomRef: 'RN-401-SU',
      name: 'Nova Suite 401',
      type: 'Suite' as const,
      price: naira(18_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 80,
      description:
        'The Nova Suite offers an unmatched residential feel with a fully separate living room, dining area, a king bedroom, and two full marble bathrooms. Includes dedicated butler service and all Executive Lounge privileges.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV in Every Room',
        'Full Stocked Bar',
        'Nespresso Machine',
        'Separate Living Room',
        'Dining Area',
        'Two Full Bathrooms',
        'Private Terrace',
        'Pool Access',
        'Executive Lounge Access',
        'Butler Service',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Complimentary Breakfast',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1611892440504-42a792e3f1ec?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-402-SU',
      name: 'Garden Suite 402',
      type: 'Suite' as const,
      price: naira(20_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 90,
      description:
        'The Garden Suite wraps around a private outdoor terrace with a plunge pool and lush garden views. A sanctuary of peace in the city — designed for total relaxation.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV in Every Room',
        'Full Stocked Bar',
        'Nespresso Machine',
        'Private Plunge Pool',
        'Private Terrace',
        'Separate Living Room',
        'Outdoor Shower',
        'Executive Lounge Access',
        'Butler Service',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Complimentary Breakfast',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1601565415267-724db0b16178?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-403-SU',
      name: 'Skyline Suite 403',
      type: 'Suite' as const,
      price: naira(22_000),
      beds: '1 King Bed',
      maxGuests: 2,
      sqm: 100,
      description:
        'Occupying a prime corner of the top floor, the Skyline Suite offers 270-degree panoramic views of the city. A masterpiece of design with bespoke artwork, a grand piano, and a private rooftop access.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV in Every Room',
        'Full Stocked Bar',
        'Grand Piano',
        'Nespresso Machine',
        '270° Panoramic View',
        'Rooftop Access',
        'Separate Living Room',
        'Dining Area for 6',
        'Two Full Bathrooms',
        'Executive Lounge Access',
        'Butler Service',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Complimentary Breakfast',
        'Private Airport Transfer',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1611892440504-42a792e3f1ec?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-404-SU',
      name: 'Presidential Suite 404',
      type: 'Suite' as const,
      price: naira(25_000),
      beds: '1 King Bed',
      maxGuests: 4,
      sqm: 120,
      description:
        'The pinnacle of luxury at Hotel Nova. The Presidential Suite spans the entire eastern wing of the top floor, featuring a master bedroom, a guest bedroom, a full dining room, a private gym, and a rooftop terrace with a heated pool. No detail has been overlooked.',
      amenities: [
        'Free WiFi',
        'Air Conditioning',
        'Smart TV in Every Room',
        'Full Stocked Bar',
        'Nespresso Machine',
        'Private Heated Rooftop Pool',
        'Private Gym',
        'Master Bedroom + Guest Bedroom',
        'Full Dining Room',
        'Chef on Request',
        'Executive Lounge Access',
        'Dedicated Butler Service',
        'Chauffeur Service',
        'In-room Safe',
        'Bathrobes & Slippers',
        'Pillow Menu',
        'Complimentary Breakfast & Minibar',
        'Private Airport Transfer',
        'Daily Housekeeping & Turndown Service',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1601565415267-724db0b16178?w=1200&q=80&auto=format&fit=crop',
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { roomRef: room.roomRef },
      update: { ...room },
      create: {
        ...room,
        roomNumber: roomNumberFromRef(room.roomRef),
        status: 'Available',
      },
    });
    console.log(`  ✓ ${room.name}`);
  }

  // ── 3. PROMO CODES ────────────────────────────────────────────────────────

  console.log('\n  Creating promo codes...');

  const promoCodes = [
    {
      code: 'NOVA20',
      description:
        '20% off your total booking — exclusive Hotel Nova welcome offer.',
      discountType: 'percentage' as const,
      discountValue: 20,
      usageLimit: 100,
      validFrom: new Date('2026-01-01'),
      validTo: new Date('2026-12-31'),
      status: 'Active' as const,
    },
    {
      code: 'WELCOME10',
      description:
        '10% off for new guests booking their first stay at Hotel Nova.',
      discountType: 'percentage' as const,
      discountValue: 10,
      usageLimit: 200,
      validFrom: new Date('2026-01-01'),
      validTo: new Date('2026-12-31'),
      status: 'Active' as const,
    },
    {
      code: 'FLAT5000',
      description:
        'Flat ₦5,000 off any booking. Valid for a limited period only.',
      discountType: 'fixed' as const,
      discountValue: naira(5_000),
      usageLimit: 50,
      validFrom: new Date('2026-01-01'),
      validTo: new Date('2026-06-30'),
      status: 'Active' as const,
    },
  ];

  for (const promo of promoCodes) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: {},
      create: promo,
    });
    console.log(`  ✓ ${promo.code}`);
  }

  // ── 4. BOOKINGS ───────────────────────────────────────────────────────────
  // We need the room records' IDs first (UUIDs are auto-generated, so we fetch
  // them by roomRef which we do know).

  console.log('\n  Creating bookings...');

  const deluxe204 = await prisma.room.findUnique({
    where: { roomRef: 'RN-204-DX' },
  });
  const executive302 = await prisma.room.findUnique({
    where: { roomRef: 'RN-302-EX' },
  });
  const standard105 = await prisma.room.findUnique({
    where: { roomRef: 'RN-105-SD' },
  });

  if (!deluxe204 || !executive302 || !standard105) {
    throw new Error(
      'Rooms not found — make sure rooms were seeded before bookings.',
    );
  }

  // Booking 1: Amara — Deluxe King 204 — Confirmed & Paid
  const booking1Pricing = calcPricing(120_000, 3);
  await prisma.booking.upsert({
    where: { bookingRef: 'BK-2026-0001' },
    update: {},
    create: {
      bookingRef: 'BK-2026-0001',
      guestId: amara.id,
      roomId: deluxe204.id,
      guestName: amara.fullName,
      guestEmail: amara.email,
      guestPhone: amara.phone ?? '',
      guestCountry: amara.country ?? '',
      checkIn: new Date('2026-02-10'),
      checkOut: new Date('2026-02-13'),
      nights: 3,
      adults: 2,
      children: 0,
      ...booking1Pricing,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentReference: 'PAY_TEST_0001',
      paymentMethod: 'card',
    },
  });
  console.log('  ✓ BK-2026-0001 (Amara — Deluxe King 204 — Confirmed)');

  // Booking 2: Amara — Executive King 302 — CheckedOut & Paid
  // This is the booking she will leave a review on.
  const booking2Pricing = calcPricing(210_000, 2);
  await prisma.booking.upsert({
    where: { bookingRef: 'BK-2026-0002' },
    update: {},
    create: {
      bookingRef: 'BK-2026-0002',
      guestId: amara.id,
      roomId: executive302.id,
      guestName: amara.fullName,
      guestEmail: amara.email,
      guestPhone: amara.phone ?? '',
      guestCountry: amara.country ?? '',
      checkIn: new Date('2026-01-15'),
      checkOut: new Date('2026-01-17'),
      nights: 2,
      adults: 2,
      children: 0,
      ...booking2Pricing,
      status: 'CheckedOut',
      paymentStatus: 'Paid',
      paymentReference: 'PAY_TEST_0002',
      paymentMethod: 'card',
    },
  });
  console.log('  ✓ BK-2026-0002 (Amara — Executive King 302 — CheckedOut)');

  // Booking 3: James — Standard Room 105 — Pending
  const booking3Pricing = calcPricing(75_000, 2);
  await prisma.booking.upsert({
    where: { bookingRef: 'BK-2026-0003' },
    update: {},
    create: {
      bookingRef: 'BK-2026-0003',
      guestId: james.id,
      roomId: standard105.id,
      guestName: james.fullName,
      guestEmail: james.email,
      guestPhone: james.phone ?? '',
      guestCountry: james.country ?? '',
      checkIn: new Date('2026-04-01'),
      checkOut: new Date('2026-04-03'),
      nights: 2,
      adults: 1,
      children: 0,
      ...booking3Pricing,
      specialRequests: 'Early check-in if possible, please.',
      status: 'Pending',
      paymentStatus: 'Pending',
    },
  });
  console.log('  ✓ BK-2026-0003 (James — Standard Room 105 — Pending)');

  // ── 5. REVIEW ─────────────────────────────────────────────────────────────
  // Amara reviews the Executive King 302 stay (BK-2026-0002).
  // A review can only be left on a CheckedOut booking — this mimics that rule.

  console.log('\n  Creating review...');

  const booking2 = await prisma.booking.findUnique({
    where: { bookingRef: 'BK-2026-0002' },
  });
  if (!booking2) throw new Error('Booking BK-2026-0002 not found.');

  await prisma.review.upsert({
    where: { bookingId: booking2.id },
    update: {},
    create: {
      guestId: amara.id,
      roomId: executive302.id,
      bookingId: booking2.id,
      rating: 5,
      reviewText:
        'Absolutely outstanding experience from start to finish. The Executive King room was immaculate — the marble bathroom alone was worth the upgrade. Staff were incredibly attentive without being intrusive. The view from the room at night was breathtaking. Hotel Nova has set a new standard for what a luxury stay should feel like. Will absolutely return.',
      status: 'Approved',
    },
  });
  console.log('  ✓ Review by Amara on Executive King 302 (5 stars)');

  console.log('\n✅ Seeding complete!');
  console.log('\nTest credentials:');
  console.log('  Admin  → admin@hotelnova.com  / Admin1234!');
  console.log('  Guest  → amara@example.com    / Guest1234!');
  console.log('  Guest  → james@example.com    / Guest1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
