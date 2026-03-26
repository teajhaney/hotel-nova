import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BookingStatus, ReviewStatus, RoomType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewsService } from './reviews.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

const mockUser = { id: 'user-1', fullName: 'Yusuf Haney', email: 'yusuf@example.com' };
const mockRoom = { id: 'room-1', name: 'Deluxe Suite', type: RoomType.Deluxe, imageUrl: null };

const mockBooking = {
  id: 'booking-1',
  bookingRef: 'BK-001',
  guestId: 'user-1',
  roomId: 'room-1',
  status: BookingStatus.CheckedOut,
  checkIn: new Date('2026-03-01'),
  checkOut: new Date('2026-03-05'),
  room: mockRoom,
  review: null,
};

const mockReview = {
  id: 'review-1',
  bookingId: 'booking-1',
  guestId: 'user-1',
  roomId: 'room-1',
  rating: 5,
  reviewText: 'Amazing stay, would visit again.',
  status: ReviewStatus.Pending,
  submittedAt: new Date(),
  updatedAt: new Date(),
  guest: mockUser,
  room: mockRoom,
  booking: { id: 'booking-1', bookingRef: 'BK-001' },
};

const mockPrisma = {
  booking: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  review: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findMany: jest.fn().mockResolvedValue([]),
  },
};

describe('ReviewsService', () => {
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: NotificationsService, useValue: { create: jest.fn().mockResolvedValue({}) } },
        { provide: NotificationsGateway, useValue: { sendToUser: jest.fn() } },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    jest.clearAllMocks();
  });

  // ─── getEligibleBookings ────────────────────────────────────────────────────

  describe('getEligibleBookings', () => {
    it('returns checked-out bookings for the user', async () => {
      mockPrisma.booking.findMany.mockResolvedValue([mockBooking]);

      const result = await service.getEligibleBookings('user-1');

      expect(result).toHaveLength(1);
      expect(result[0].bookingId).toBe('booking-1');
      expect(result[0].review).toBeNull();
    });
  });

  // ─── submitReview ────────────────────────────────────────────────────────────

  describe('submitReview', () => {
    const dto = { bookingId: 'booking-1', rating: 5, reviewText: 'Amazing stay, would visit again.' };

    it('creates a review when booking is CheckedOut and no review exists', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrisma.review.findUnique.mockResolvedValue(null);
      mockPrisma.review.create.mockResolvedValue(mockReview);

      const result = await service.submitReview('user-1', dto);

      expect(result.rating).toBe(5);
      expect(mockPrisma.review.create).toHaveBeenCalled();
    });

    it('throws BadRequestException when booking is not CheckedOut', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        ...mockBooking,
        status: BookingStatus.Confirmed,
      });

      await expect(service.submitReview('user-1', dto)).rejects.toThrow(BadRequestException);
    });

    it('throws ForbiddenException when booking belongs to another user', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        ...mockBooking,
        guestId: 'other-user',
      });

      await expect(service.submitReview('user-1', dto)).rejects.toThrow(ForbiddenException);
    });

    it('throws ConflictException when review already exists', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrisma.review.findUnique.mockResolvedValue(mockReview);

      await expect(service.submitReview('user-1', dto)).rejects.toThrow(ConflictException);
    });
  });

  // ─── updateReview ────────────────────────────────────────────────────────────

  describe('updateReview', () => {
    it('updates the review when it is Pending and belongs to the user', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(mockReview);
      mockPrisma.review.update.mockResolvedValue({ ...mockReview, rating: 4 });

      const result = await service.updateReview('review-1', 'user-1', { rating: 4 });

      expect(result.rating).toBe(4);
    });

    it('throws NotFoundException when review does not exist', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(null);

      await expect(service.updateReview('ghost', 'user-1', { rating: 4 })).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when review belongs to another user', async () => {
      mockPrisma.review.findUnique.mockResolvedValue({ ...mockReview, guestId: 'other-user' });

      await expect(service.updateReview('review-1', 'user-1', { rating: 4 })).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException when review is not Pending', async () => {
      mockPrisma.review.findUnique.mockResolvedValue({ ...mockReview, status: ReviewStatus.Approved });

      await expect(service.updateReview('review-1', 'user-1', { rating: 4 })).rejects.toThrow(BadRequestException);
    });
  });

  // ─── listReviews (admin) ────────────────────────────────────────────────────

  describe('listReviews', () => {
    it('returns paginated reviews', async () => {
      mockPrisma.review.count.mockResolvedValue(1);
      mockPrisma.review.findMany.mockResolvedValue([mockReview]);

      const result = await service.listReviews({});

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('filters by status when provided', async () => {
      mockPrisma.review.count.mockResolvedValue(1);
      mockPrisma.review.findMany.mockResolvedValue([mockReview]);

      await service.listReviews({ status: 'Pending' });

      const [callArg] = mockPrisma.review.findMany.mock.calls[0] as [{ where: object }];
      expect(callArg.where).toEqual({ status: 'Pending' });
    });
  });

  // ─── updateReviewStatus (admin) ─────────────────────────────────────────────

  describe('updateReviewStatus', () => {
    it('changes the review status to Approved', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(mockReview);
      mockPrisma.review.update.mockResolvedValue({ ...mockReview, status: ReviewStatus.Approved });

      const result = await service.updateReviewStatus('review-1', { status: 'Approved' });

      expect(result.status).toBe(ReviewStatus.Approved);
    });

    it('throws NotFoundException when review does not exist', async () => {
      mockPrisma.review.findUnique.mockResolvedValue(null);

      await expect(service.updateReviewStatus('ghost', { status: 'Approved' })).rejects.toThrow(NotFoundException);
    });
  });
});
