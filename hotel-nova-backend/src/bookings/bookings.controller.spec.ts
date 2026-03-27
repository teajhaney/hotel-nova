import { Test, TestingModule } from '@nestjs/testing';
import { BookingStatus, PaymentStatus, Role } from '@prisma/client';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { CreateBookingDto } from './dto/create-booking.dto';

// ─── Shared fixtures ─────────────────────────────────────────────────────────

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
};

// ─── Mock Service ─────────────────────────────────────────────────────────────

const mockBookingsService = {
  createBooking: jest.fn(),
  getMyBookings: jest.fn(),
  getBookingById: jest.fn(),
  cancelBooking: jest.fn(),
  adminGetBookings: jest.fn(),
  adminUpdateStatus: jest.fn(),
  handlePaystackWebhook: jest.fn(),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('BookingsController', () => {
  let controller: BookingsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: mockBookingsService }],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  describe('createBooking', () => {
    it('delegates to the service and returns the result', async () => {
      const dto: CreateBookingDto = {
        roomId: 'room-1',
        checkIn: tomorrow.toISOString().slice(0, 10),
        checkOut: dayAfter.toISOString().slice(0, 10),
        adults: 2,
        guestPhone: '08000000000',
      };
      const serviceResult = {
        booking: mockBooking,
        paymentUrl: 'https://paystack.com/pay/test',
      };
      mockBookingsService.createBooking.mockResolvedValue(serviceResult);

      const result = await controller.createBooking(mockUser, dto);
      expect(result).toEqual(serviceResult);
      expect(mockBookingsService.createBooking).toHaveBeenCalledWith(
        mockUser,
        dto,
      );
    });
  });

  describe('getMyBookings', () => {
    it('calls the service with the user id from the JWT', async () => {
      mockBookingsService.getMyBookings.mockResolvedValue([mockBooking]);
      const result = await controller.getMyBookings('user-1');
      expect(result).toHaveLength(1);
      expect(mockBookingsService.getMyBookings).toHaveBeenCalledWith('user-1');
    });
  });

  describe('getBookingById', () => {
    it('returns the booking when found', async () => {
      mockBookingsService.getBookingById.mockResolvedValue(mockBooking);
      const result = await controller.getBookingById('booking-1', mockUser);
      expect(result.id).toBe('booking-1');
    });
  });

  describe('cancelBooking', () => {
    it('calls the service with the booking id and user id', async () => {
      mockBookingsService.cancelBooking.mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.Cancelled,
      });

      const result = await controller.cancelBooking('booking-1', 'user-1');
      expect(result.status).toBe(BookingStatus.Cancelled);
      expect(mockBookingsService.cancelBooking).toHaveBeenCalledWith(
        'booking-1',
        'user-1',
      );
    });
  });

  describe('adminGetBookings', () => {
    it('returns a paginated list', async () => {
      const page = {
        data: [mockBooking],
        meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
      };
      mockBookingsService.adminGetBookings.mockResolvedValue(page);

      const result = await controller.adminGetBookings({});
      expect(result.data).toHaveLength(1);
    });
  });

  describe('adminUpdateStatus', () => {
    it('updates the booking status', async () => {
      mockBookingsService.adminUpdateStatus.mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.Confirmed,
      });

      const result = await controller.adminUpdateStatus('booking-1', {
        status: BookingStatus.Confirmed,
      });
      expect(result.status).toBe(BookingStatus.Confirmed);
    });
  });
});
