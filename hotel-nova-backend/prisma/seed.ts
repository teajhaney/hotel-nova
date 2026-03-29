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

  const fatima = await prisma.user.upsert({
    where: { email: 'fatima@example.com' },
    update: {},
    create: {
      email: 'fatima@example.com',
      password: hashedGuestPassword,
      fullName: 'Fatima Bello',
      phone: '+2348033221100',
      country: 'Nigeria',
      role: 'GUEST',
      status: 'Active',
    },
  });

  const emeka = await prisma.user.upsert({
    where: { email: 'emeka@example.com' },
    update: {},
    create: {
      email: 'emeka@example.com',
      password: hashedGuestPassword,
      fullName: 'Emeka Obi',
      phone: '+2348055443322',
      country: 'Nigeria',
      role: 'GUEST',
      status: 'Active',
    },
  });

  const chidinma = await prisma.user.upsert({
    where: { email: 'chidinma@example.com' },
    update: {},
    create: {
      email: 'chidinma@example.com',
      password: hashedGuestPassword,
      fullName: 'Chidinma Eze',
      phone: '+2348077665544',
      country: 'Nigeria',
      role: 'GUEST',
      status: 'Active',
    },
  });

  console.log(`  ✓ ${admin.fullName} (admin)`);
  console.log(`  ✓ ${amara.fullName} (guest)`);
  console.log(`  ✓ ${james.fullName} (guest)`);
  console.log(`  ✓ ${fatima.fullName} (guest)`);
  console.log(`  ✓ ${emeka.fullName} (guest)`);
  console.log(`  ✓ ${chidinma.fullName} (guest)`);

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
        'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=1200&q=80&auto=format&fit=crop',
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
        'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-210-DX',
      name: 'Deluxe King 210',
      type: 'Deluxe' as const,
      price: naira(9_500),
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
      price: naira(9_000),
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
      price: naira(9_500),
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
      price: naira(9_000),
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
      price: naira(9_000),
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
      price: naira(9_500),
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
      price: naira(10_000),
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
      price: naira(9_500),
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
      price: naira(10_000),
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
      price: naira(10_000),
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
      'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=1200&q=80&auto=format&fit=crop',
    },
    {
      roomRef: 'RN-404-SU',
      name: 'Presidential Suite 404',
      type: 'Suite' as const,
      price: naira(10_000),
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

  // ── 4. CLEAN UP previous bookings and reviews ─────────────────────────────
  // Delete in reverse dependency order so re-running the seed is always safe.

  console.log('\n  Clearing previous bookings and reviews...');
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();

  // Reset all room statuses to Available before we seed new bookings
  await prisma.room.updateMany({ data: { status: 'Available' } });

  // ── 5. BOOKINGS ───────────────────────────────────────────────────────────
  // 28 bookings spread Oct 2025 – Apr 2026 so the monthly revenue chart has
  // data across 6+ months. All totals stay under ₦50,000 (Paystack test limit):
  //   max = ₦10,000/night × 4 nights × 1.125 (fees) = ₦45,000.

  console.log('\n  Creating bookings...');

  // Fetch every room we reference in one query, then build a lookup map.
  const seedRoomRefs = [
    'RN-101-SD', 'RN-102-SD', 'RN-104-SD', 'RN-105-SD', 'RN-107-SD', 'RN-108-SD', 'RN-110-SD',
    'RN-201-DX', 'RN-202-DX', 'RN-203-DX', 'RN-204-DX', 'RN-205-DX', 'RN-207-DX', 'RN-209-DX',
    'RN-301-EX', 'RN-302-EX', 'RN-303-EX', 'RN-304-EX', 'RN-305-EX', 'RN-306-EX',
    'RN-401-SU', 'RN-402-SU', 'RN-403-SU', 'RN-404-SU',
  ];

  const seedRoomRecords = await prisma.room.findMany({
    where: { roomRef: { in: seedRoomRefs } },
    select: { id: true, roomRef: true, price: true },
  });

  // roomMap: ref → { id, price (kobo) }
  const roomMap = new Map(seedRoomRecords.map((r) => [r.roomRef, r]));

  // Returns the DB id for a given roomRef — throws if not found
  function rid(ref: string): string {
    const r = roomMap.get(ref);
    if (!r) throw new Error(`Room ${ref} not in map — was it seeded?`);
    return r.id;
  }

  // Returns the room price in naira (kobo ÷ 100) for calcPricing()
  function rateNaira(ref: string): number {
    const r = roomMap.get(ref);
    if (!r) throw new Error(`Room ${ref} not in map`);
    return r.price / 100;
  }

  // Each booking entry. calcPricing() is called at insert time using the
  // room's actual stored price so numbers always stay consistent.
  const bookingDefs = [

    // ── OCT 2025 ── (2 bookings, CheckedOut/Paid) ──────────────────────────
    {
      bookingRef: 'BK-2025-0001', guestId: amara.id, roomRef: 'RN-201-DX',
      checkIn: '2025-10-05', checkOut: '2025-10-08', nights: 3,
      adults: 2, children: 0,
      guestName: amara.fullName, guestEmail: amara.email, guestPhone: amara.phone ?? '', guestCountry: amara.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2025_0001', paymentMethod: 'card',
      createdAt: new Date('2025-10-03'),
    },
    {
      bookingRef: 'BK-2025-0002', guestId: james.id, roomRef: 'RN-104-SD',
      checkIn: '2025-10-15', checkOut: '2025-10-18', nights: 3,
      adults: 1, children: 0,
      guestName: james.fullName, guestEmail: james.email, guestPhone: james.phone ?? '', guestCountry: james.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2025_0002', paymentMethod: 'card',
      createdAt: new Date('2025-10-13'),
    },

    // ── NOV 2025 ── (3 bookings, CheckedOut/Paid) ──────────────────────────
    {
      bookingRef: 'BK-2025-0003', guestId: fatima.id, roomRef: 'RN-301-EX',
      checkIn: '2025-11-03', checkOut: '2025-11-06', nights: 3,
      adults: 2, children: 0,
      guestName: fatima.fullName, guestEmail: fatima.email, guestPhone: fatima.phone ?? '', guestCountry: fatima.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2025_0003', paymentMethod: 'card',
      createdAt: new Date('2025-11-01'),
    },
    {
      bookingRef: 'BK-2025-0004', guestId: emeka.id, roomRef: 'RN-401-SU',
      checkIn: '2025-11-12', checkOut: '2025-11-14', nights: 2,
      adults: 2, children: 0,
      guestName: emeka.fullName, guestEmail: emeka.email, guestPhone: emeka.phone ?? '', guestCountry: emeka.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2025_0004', paymentMethod: 'card',
      createdAt: new Date('2025-11-10'),
    },
    {
      bookingRef: 'BK-2025-0005', guestId: chidinma.id, roomRef: 'RN-205-DX',
      checkIn: '2025-11-20', checkOut: '2025-11-23', nights: 3,
      adults: 2, children: 1,
      guestName: chidinma.fullName, guestEmail: chidinma.email, guestPhone: chidinma.phone ?? '', guestCountry: chidinma.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2025_0005', paymentMethod: 'card',
      createdAt: new Date('2025-11-18'),
    },

    // ── DEC 2025 ── (4 bookings, CheckedOut/Paid) ──────────────────────────
    {
      bookingRef: 'BK-2025-0006', guestId: amara.id, roomRef: 'RN-302-EX',
      checkIn: '2025-12-05', checkOut: '2025-12-08', nights: 3,
      adults: 2, children: 0,
      guestName: amara.fullName, guestEmail: amara.email, guestPhone: amara.phone ?? '', guestCountry: amara.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2025_0006', paymentMethod: 'card',
      createdAt: new Date('2025-12-03'),
    },
    {
      bookingRef: 'BK-2025-0007', guestId: james.id, roomRef: 'RN-402-SU',
      checkIn: '2025-12-16', checkOut: '2025-12-18', nights: 2,
      adults: 2, children: 0,
      guestName: james.fullName, guestEmail: james.email, guestPhone: james.phone ?? '', guestCountry: james.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2025_0007', paymentMethod: 'card',
      createdAt: new Date('2025-12-14'),
    },
    {
      bookingRef: 'BK-2025-0008', guestId: fatima.id, roomRef: 'RN-202-DX',
      checkIn: '2025-12-21', checkOut: '2025-12-24', nights: 3,
      adults: 1, children: 0,
      guestName: fatima.fullName, guestEmail: fatima.email, guestPhone: fatima.phone ?? '', guestCountry: fatima.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2025_0008', paymentMethod: 'card',
      createdAt: new Date('2025-12-19'),
    },
    {
      bookingRef: 'BK-2025-0009', guestId: emeka.id, roomRef: 'RN-107-SD',
      checkIn: '2025-12-26', checkOut: '2025-12-28', nights: 2,
      adults: 1, children: 0,
      guestName: emeka.fullName, guestEmail: emeka.email, guestPhone: emeka.phone ?? '', guestCountry: emeka.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2025_0009', paymentMethod: 'card',
      createdAt: new Date('2025-12-25'),
    },

    // ── JAN 2026 ── (4 bookings, CheckedOut/Paid) ──────────────────────────
    {
      bookingRef: 'BK-2026-0001', guestId: chidinma.id, roomRef: 'RN-303-EX',
      checkIn: '2026-01-08', checkOut: '2026-01-11', nights: 3,
      adults: 2, children: 0,
      guestName: chidinma.fullName, guestEmail: chidinma.email, guestPhone: chidinma.phone ?? '', guestCountry: chidinma.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0001', paymentMethod: 'card',
      createdAt: new Date('2026-01-06'),
    },
    {
      bookingRef: 'BK-2026-0002', guestId: amara.id, roomRef: 'RN-403-SU',
      checkIn: '2026-01-15', checkOut: '2026-01-17', nights: 2,
      adults: 2, children: 0,
      guestName: amara.fullName, guestEmail: amara.email, guestPhone: amara.phone ?? '', guestCountry: amara.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0002', paymentMethod: 'card',
      createdAt: new Date('2026-01-13'),
    },
    {
      bookingRef: 'BK-2026-0003', guestId: james.id, roomRef: 'RN-204-DX',
      checkIn: '2026-01-22', checkOut: '2026-01-25', nights: 3,
      adults: 1, children: 0,
      guestName: james.fullName, guestEmail: james.email, guestPhone: james.phone ?? '', guestCountry: james.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0003', paymentMethod: 'card',
      createdAt: new Date('2026-01-20'),
    },
    {
      bookingRef: 'BK-2026-0004', guestId: fatima.id, roomRef: 'RN-108-SD',
      checkIn: '2026-01-28', checkOut: '2026-01-31', nights: 3,
      adults: 2, children: 1,
      guestName: fatima.fullName, guestEmail: fatima.email, guestPhone: fatima.phone ?? '', guestCountry: fatima.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0004', paymentMethod: 'card',
      createdAt: new Date('2026-01-26'),
    },

    // ── FEB 2026 ── (4 bookings, CheckedOut/Paid) ──────────────────────────
    {
      bookingRef: 'BK-2026-0005', guestId: emeka.id, roomRef: 'RN-305-EX',
      checkIn: '2026-02-04', checkOut: '2026-02-07', nights: 3,
      adults: 2, children: 0,
      guestName: emeka.fullName, guestEmail: emeka.email, guestPhone: emeka.phone ?? '', guestCountry: emeka.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0005', paymentMethod: 'card',
      createdAt: new Date('2026-02-02'),
    },
    {
      bookingRef: 'BK-2026-0006', guestId: chidinma.id, roomRef: 'RN-402-SU',
      checkIn: '2026-02-12', checkOut: '2026-02-14', nights: 2,
      adults: 2, children: 0,
      guestName: chidinma.fullName, guestEmail: chidinma.email, guestPhone: chidinma.phone ?? '', guestCountry: chidinma.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0006', paymentMethod: 'card',
      createdAt: new Date('2026-02-10'),
    },
    {
      bookingRef: 'BK-2026-0007', guestId: amara.id, roomRef: 'RN-209-DX',
      checkIn: '2026-02-18', checkOut: '2026-02-22', nights: 4,
      adults: 2, children: 0,
      guestName: amara.fullName, guestEmail: amara.email, guestPhone: amara.phone ?? '', guestCountry: amara.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0007', paymentMethod: 'card',
      createdAt: new Date('2026-02-16'),
    },
    {
      bookingRef: 'BK-2026-0008', guestId: james.id, roomRef: 'RN-304-EX',
      checkIn: '2026-02-24', checkOut: '2026-02-26', nights: 2,
      adults: 1, children: 0,
      guestName: james.fullName, guestEmail: james.email, guestPhone: james.phone ?? '', guestCountry: james.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0008', paymentMethod: 'card',
      createdAt: new Date('2026-02-22'),
    },

    // ── MAR 2026 — past (CheckedOut/Paid) ─────────────────────────────────
    {
      bookingRef: 'BK-2026-0009', guestId: fatima.id, roomRef: 'RN-101-SD',
      checkIn: '2026-03-01', checkOut: '2026-03-04', nights: 3,
      adults: 1, children: 0,
      guestName: fatima.fullName, guestEmail: fatima.email, guestPhone: fatima.phone ?? '', guestCountry: fatima.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0009', paymentMethod: 'card',
      createdAt: new Date('2026-02-27'),
    },
    {
      bookingRef: 'BK-2026-0010', guestId: emeka.id, roomRef: 'RN-207-DX',
      checkIn: '2026-03-05', checkOut: '2026-03-08', nights: 3,
      adults: 2, children: 0,
      guestName: emeka.fullName, guestEmail: emeka.email, guestPhone: emeka.phone ?? '', guestCountry: emeka.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0010', paymentMethod: 'card',
      createdAt: new Date('2026-03-03'),
    },
    {
      bookingRef: 'BK-2026-0011', guestId: chidinma.id, roomRef: 'RN-306-EX',
      checkIn: '2026-03-10', checkOut: '2026-03-13', nights: 3,
      adults: 2, children: 0,
      guestName: chidinma.fullName, guestEmail: chidinma.email, guestPhone: chidinma.phone ?? '', guestCountry: chidinma.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0011', paymentMethod: 'card',
      createdAt: new Date('2026-03-08'),
    },
    {
      bookingRef: 'BK-2026-0012', guestId: amara.id, roomRef: 'RN-110-SD',
      checkIn: '2026-03-15', checkOut: '2026-03-18', nights: 3,
      adults: 1, children: 0,
      guestName: amara.fullName, guestEmail: amara.email, guestPhone: amara.phone ?? '', guestCountry: amara.country ?? '',
      status: 'CheckedOut' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0012', paymentMethod: 'card',
      createdAt: new Date('2026-03-13'),
    },

    // ── MAR 2026 — currently checked in (today = 2026-03-26) ──────────────
    // These guests are mid-stay. Their rooms will be set to Occupied below.
    {
      bookingRef: 'BK-2026-0013', guestId: james.id, roomRef: 'RN-302-EX',
      checkIn: '2026-03-24', checkOut: '2026-03-28', nights: 4,
      adults: 2, children: 0,
      guestName: james.fullName, guestEmail: james.email, guestPhone: james.phone ?? '', guestCountry: james.country ?? '',
      status: 'CheckedIn' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0013', paymentMethod: 'card',
      createdAt: new Date('2026-03-22'),
    },
    {
      bookingRef: 'BK-2026-0014', guestId: fatima.id, roomRef: 'RN-401-SU',
      checkIn: '2026-03-25', checkOut: '2026-03-27', nights: 2,
      adults: 2, children: 0,
      guestName: fatima.fullName, guestEmail: fatima.email, guestPhone: fatima.phone ?? '', guestCountry: fatima.country ?? '',
      status: 'CheckedIn' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0014', paymentMethod: 'card',
      createdAt: new Date('2026-03-23'),
    },

    // ── MAR–APR 2026 — upcoming (Confirmed, Paid) ─────────────────────────
    {
      bookingRef: 'BK-2026-0015', guestId: emeka.id, roomRef: 'RN-203-DX',
      checkIn: '2026-03-27', checkOut: '2026-03-29', nights: 2,
      adults: 2, children: 0,
      guestName: emeka.fullName, guestEmail: emeka.email, guestPhone: emeka.phone ?? '', guestCountry: emeka.country ?? '',
      status: 'Confirmed' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0015', paymentMethod: 'card',
      createdAt: new Date('2026-03-24'),
    },
    {
      bookingRef: 'BK-2026-0016', guestId: chidinma.id, roomRef: 'RN-404-SU',
      checkIn: '2026-03-28', checkOut: '2026-03-31', nights: 3,
      adults: 2, children: 1,
      guestName: chidinma.fullName, guestEmail: chidinma.email, guestPhone: chidinma.phone ?? '', guestCountry: chidinma.country ?? '',
      status: 'Confirmed' as const, paymentStatus: 'Paid' as const,
      paymentReference: 'PAY_TEST_2026_0016', paymentMethod: 'card',
      createdAt: new Date('2026-03-24'),
    },

    // ── APR 2026 — future (Pending, not yet paid) ─────────────────────────
    {
      bookingRef: 'BK-2026-0017', guestId: amara.id, roomRef: 'RN-305-EX',
      checkIn: '2026-04-05', checkOut: '2026-04-08', nights: 3,
      adults: 2, children: 0,
      guestName: amara.fullName, guestEmail: amara.email, guestPhone: amara.phone ?? '', guestCountry: amara.country ?? '',
      status: 'Pending' as const, paymentStatus: 'Pending' as const,
      paymentReference: 'PAY_TEST_2026_0017',
      createdAt: new Date('2026-03-25'),
    },
    {
      bookingRef: 'BK-2026-0018', guestId: james.id, roomRef: 'RN-102-SD',
      checkIn: '2026-04-10', checkOut: '2026-04-13', nights: 3,
      adults: 1, children: 0,
      guestName: james.fullName, guestEmail: james.email, guestPhone: james.phone ?? '', guestCountry: james.country ?? '',
      status: 'Pending' as const, paymentStatus: 'Pending' as const,
      paymentReference: 'PAY_TEST_2026_0018',
      specialRequests: 'High floor room if available.',
      createdAt: new Date('2026-03-25'),
    },

    // ── Cancelled ─────────────────────────────────────────────────────────
    {
      bookingRef: 'BK-2026-0019', guestId: emeka.id, roomRef: 'RN-105-SD',
      checkIn: '2026-03-15', checkOut: '2026-03-17', nights: 2,
      adults: 1, children: 0,
      guestName: emeka.fullName, guestEmail: emeka.email, guestPhone: emeka.phone ?? '', guestCountry: emeka.country ?? '',
      status: 'Cancelled' as const, paymentStatus: 'Pending' as const,
      paymentReference: 'PAY_TEST_2026_0019',
      createdAt: new Date('2026-03-10'),
    },
  ];

  for (const b of bookingDefs) {
    const { roomRef, createdAt, checkIn, checkOut, ...rest } = b;
    await prisma.booking.create({
      data: {
        ...rest,
        roomId: rid(roomRef),
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        ...calcPricing(rateNaira(roomRef), b.nights),
        createdAt,
      },
    });
    console.log(`  ✓ ${b.bookingRef} (${b.guestName.split(' ')[0]} — ${roomRef} — ${b.status})`);
  }

  // Mark the two currently checked-in rooms as Occupied
  await prisma.room.updateMany({
    where: { roomRef: { in: ['RN-302-EX', 'RN-401-SU'] } },
    data: { status: 'Occupied' },
  });
  console.log('  ✓ RN-302-EX and RN-401-SU set to Occupied');

  // ── 6. REVIEWS ────────────────────────────────────────────────────────────
  // 7 reviews on CheckedOut bookings. Ratings: 5, 5, 5, 4, 4, 4, 3 → avg 4.1★
  // Reviews reference booking IDs so we look them up by bookingRef.

  console.log('\n  Creating reviews...');

  const reviewDefs = [
    {
      bookingRef: 'BK-2025-0001', guestId: amara.id, roomRef: 'RN-201-DX', rating: 4,
      reviewText: 'A really comfortable stay. The Deluxe King room was well-appointed and the bed was excellent. Service was friendly and attentive throughout. Minor note — the in-room Wi-Fi was slightly slow one morning, but nothing that affected the experience. Would definitely stay again.',
      status: 'Approved' as const,
    },
    {
      bookingRef: 'BK-2025-0003', guestId: fatima.id, roomRef: 'RN-301-EX', rating: 5,
      reviewText: 'Exceptional from check-in to check-out. The Executive room was immaculate, the bathroom stunning, and the staff went above and beyond every single time. Woke up to the most beautiful sunrise view. Hotel Nova truly understands luxury hospitality. Already planning my next visit.',
      status: 'Approved' as const,
    },
    {
      bookingRef: 'BK-2025-0004', guestId: emeka.id, roomRef: 'RN-401-SU', rating: 5,
      reviewText: "The Nova Suite is absolutely breathtaking. I booked it as a surprise for my wife's birthday and she was speechless. The butler service, the private terrace, the complimentary breakfast — every single detail was perfect. Worth every naira. We will be back.",
      status: 'Approved' as const,
    },
    {
      bookingRef: 'BK-2025-0006', guestId: amara.id, roomRef: 'RN-302-EX', rating: 5,
      reviewText: 'My second stay at Hotel Nova and it just keeps getting better. The Executive room was stunning — clean, modern, and incredibly comfortable. The front desk staff remembered my preferences from my last visit which was a lovely touch. This is my Lagos home away from home.',
      status: 'Approved' as const,
    },
    {
      bookingRef: 'BK-2025-0007', guestId: james.id, roomRef: 'RN-402-SU', rating: 4,
      reviewText: 'The Garden Suite was a wonderful experience. The private plunge pool was the highlight — I spent most of the evening out there. Room was spacious and the minibar well-stocked. Breakfast was excellent. Would have given 5 stars but the AC had a faint noise that kept me up one night.',
      status: 'Approved' as const,
    },
    {
      bookingRef: 'BK-2026-0001', guestId: chidinma.id, roomRef: 'RN-303-EX', rating: 3,
      reviewText: 'The room itself was clean and nicely furnished. However corridor noise was quite loud both evenings and housekeeping knocked at an inconvenient hour. Room service was slower than expected. The building and location are great but execution needs some work. Decent stay overall.',
      status: 'Approved' as const,
    },
    {
      bookingRef: 'BK-2026-0002', guestId: amara.id, roomRef: 'RN-403-SU', rating: 5,
      reviewText: 'The Skyline Suite is a masterpiece. The 270-degree night views over Lagos are simply breathtaking. Attention to detail in every corner of the room shows real craftsmanship — the turndown service, the bespoke toiletries, even the grand piano in the corner. I felt like royalty. Hotel Nova has set the bar impossibly high.',
      status: 'Approved' as const,
    },
  ];

  for (const r of reviewDefs) {
    const booking = await prisma.booking.findUnique({ where: { bookingRef: r.bookingRef } });
    if (!booking) throw new Error(`Booking ${r.bookingRef} not found for review`);
    const room = roomMap.get(r.roomRef);
    if (!room) throw new Error(`Room ${r.roomRef} not in map`);

    await prisma.review.create({
      data: {
        guestId: r.guestId,
        roomId: room.id,
        bookingId: booking.id,
        rating: r.rating,
        reviewText: r.reviewText,
        status: r.status,
      },
    });
    console.log(`  ✓ ${r.bookingRef} — ${r.rating}★ (${r.status})`);
  }

  console.log('\n✅ Seeding complete!');
  console.log(`  ${bookingDefs.length} bookings across Oct 2025 – Apr 2026`);
  console.log(`  ${reviewDefs.length} reviews — avg ~4.1★`);
  console.log('\nTest credentials:');
  console.log('  Admin    → admin@hotelnova.com    / Admin1234!');
  console.log('  Guest    → amara@example.com      / Guest1234!');
  console.log('  Guest    → james@example.com      / Guest1234!');
  console.log('  Guest    → fatima@example.com     / Guest1234!');
  console.log('  Guest    → emeka@example.com      / Guest1234!');
  console.log('  Guest    → chidinma@example.com   / Guest1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
