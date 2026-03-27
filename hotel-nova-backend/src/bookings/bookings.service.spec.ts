import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, PaymentStatus, Role } from '@prisma/client';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

// Jest hoists jest.mock() calls before any imports are processed, so this mock
// intercepts the 'paystack' module before BookingsService loads it.
jest.mock('paystack', () =>
  jest.fn(() => ({
    transaction: {
      initialize: jest.fn().mockResolvedValue({
        status: true,
        data: {
          authorization_url: 'https://paystack.com/pay/test',
          access_code: 'test_code',
          reference: 'PAY-HN-20260323-AABBCC',
        },
      }),
    },
  })),
);

// ─── Shared test fixtures ────────────────────────────────────────────────────

const mockRoom = {
  id: 'room-1',
  roomNumber: 101,
  roomRef: 'RN-101-SD',
  name: 'Cosy Standard',
  type: 'Standard' as const,
  price: 50_000,
  status: 'Available' as const,
  description: null,
  imageUrl: null,
  imagePublicId: null,
  beds: 'King',
  maxGuests: 2,
  sqm: null,
  amenities: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUser: AuthUser = {
  id: 'user-1',
  email: 'guest@test.com',
  fullName: 'Test Guest',
  role: Role.GUEST,
};

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 2);

const mockBooking = {
  id: 'booking-1',
  bookingRef: 'HN-20260323-AABBCC',
  guestId: 'user-1',
  roomId: 'room-1',
  guestName: 'Test Guest',
  guestEmail: 'guest@test.com',
  guestPhone: '08000000000',
  guestCountry: null,
  checkIn: tomorrow,
  checkOut: dayAfter,
  nights: 1,
  adults: 2,
  children: 0,
  pricePerNight: 50_000,
  subtotal: 50_000,
  serviceCharge: 2_500,
  vat: 3_937,
  promoDiscount: 0,
  totalAmount: 56_437,
  promoCodeId: null,
  specialRequests: null,
  status: BookingStatus.Pending,
  paymentStatus: PaymentStatus.Pending,
  paymentReference: 'PAY-HN-20260323-AABBCC',
  paymentMethod: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  review: null,
  notifications: [],
};

// ─── Mock PrismaService ──────────────────────────────────────────────────────

const mockPrisma = {
  room: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  booking: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  promoCode: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findMany: jest.fn().mockResolvedValue([]),
  },
  $transaction: jest.fn(),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: mockPrisma },
        {
          provide: NotificationsService,
          useValue: { create: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: NotificationsGateway,
          useValue: { sendToUser: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);

    process.env.PAYSTACK_SECRET_KEY = 'sk_test_secret';
    process.env.FRONTEND_URL = 'http://localhost:3000';
  });

  // ── createBooking ──────────────────────────────────────────────────────────

  describe('createBooking', () => {
    const dto: CreateBookingDto = {
      roomId: 'room-1',
      checkIn: tomorrow.toISOString().slice(0, 10),
      checkOut: dayAfter.toISOString().slice(0, 10),
      adults: 2,
      guestPhone: '08000000000',
    };

    it('creates a booking and returns it with a payment URL', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(mockRoom);
      mockPrisma.$transaction.mockImplementation(
        async (fn: (tx: typeof mockPrisma) => Promise<unknown>) => {
          mockPrisma.booking.findFirst.mockResolvedValue(null); // no overlap
          return fn(mockPrisma);
        },
      );
      mockPrisma.booking.create.mockResolvedValue(mockBooking);

      const result = await service.createBooking(mockUser, dto);

      expect(result.booking).toBeDefined();
      expect(result.paymentUrl).toBe('https://paystack.com/pay/test');
    });

    it('throws BadRequestException when check-in is in the past', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await expect(
        service.createBooking(mockUser, {
          ...dto,
          checkIn: yesterday.toISOString().slice(0, 10),
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when check-out is before check-in', async () => {
      await expect(
        service.createBooking(mockUser, {
          ...dto,
          checkIn: dayAfter.toISOString().slice(0, 10),
          checkOut: tomorrow.toISOString().slice(0, 10),
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when room does not exist', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(null);
      await expect(service.createBooking(mockUser, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws BadRequestException when room is under maintenance', async () => {
      mockPrisma.room.findUnique.mockResolvedValue({
        ...mockRoom,
        status: 'Maintenance',
      });
      await expect(service.createBooking(mockUser, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when room is already booked for those dates', async () => {
      mockPrisma.room.findUnique.mockResolvedValue(mockRoom);
      mockPrisma.$transaction.mockImplementation(
        async (fn: (tx: typeof mockPrisma) => Promise<unknown>) => {
          mockPrisma.booking.findFirst.mockResolvedValue(mockBooking); // conflict!
          return fn(mockPrisma);
        },
      );

      await expect(service.createBooking(mockUser, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ── getMyBookings ──────────────────────────────────────────────────────────

  describe('getMyBookings', () => {
    it('returns bookings belonging to the user', async () => {
      mockPrisma.booking.findMany.mockResolvedValue([mockBooking]);
      const result = await service.getMyBookings('user-1');
      expect(result).toHaveLength(1);
      expect(mockPrisma.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { guestId: 'user-1' } }),
      );
    });
  });

  // ── getBookingById ─────────────────────────────────────────────────────────

  describe('getBookingById', () => {
    it('returns the booking when the guest owns it', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking);
      const result = await service.getBookingById('booking-1', mockUser);
      expect(result.id).toBe('booking-1');
    });

    it("throws ForbiddenException when a guest tries to see another guest's booking", async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        ...mockBooking,
        guestId: 'other-user',
      });
      await expect(
        service.getBookingById('booking-1', mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws NotFoundException when booking does not exist', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);
      await expect(
        service.getBookingById('non-existent', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── cancelBooking ──────────────────────────────────────────────────────────

  describe('cancelBooking', () => {
    it('cancels a Pending booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrisma.booking.update.mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.Cancelled,
      });

      const result = await service.cancelBooking('booking-1', 'user-1');
      expect(result.status).toBe(BookingStatus.Cancelled);
    });

    it('throws BadRequestException when trying to cancel a CheckedIn booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.CheckedIn,
      });

      await expect(
        service.cancelBooking('booking-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it("throws ForbiddenException when cancelling another guest's booking", async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        ...mockBooking,
        guestId: 'other-user',
      });

      await expect(
        service.cancelBooking('booking-1', 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── adminUpdateStatus ──────────────────────────────────────────────────────

  describe('adminUpdateStatus', () => {
    it('transitions Pending → Confirmed', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrisma.$transaction.mockResolvedValue([
        { ...mockBooking, status: BookingStatus.Confirmed },
      ]);

      const result = await service.adminUpdateStatus('booking-1', {
        status: BookingStatus.Confirmed,
      });
      expect(result.status).toBe(BookingStatus.Confirmed);
    });

    it('throws BadRequestException for an invalid transition (CheckedOut → Pending)', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.CheckedOut,
      });

      await expect(
        service.adminUpdateStatus('booking-1', {
          status: BookingStatus.Pending,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
