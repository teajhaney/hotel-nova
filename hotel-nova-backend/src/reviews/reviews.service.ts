import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, ReviewStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { REVIEW_MESSAGES } from '../common/constants/messages';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';
import type {
  EligibleBooking,
  ReviewsPage,
  ReviewWithRelations,
} from './interfaces/review.interface';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  // ─── Guest: List Eligible Bookings ────────────────────────────────────────
  // Returns all CheckedOut bookings for this guest, each with its review
  // (if one exists) or null. This powers the guest reviews page.
  async getEligibleBookings(userId: string): Promise<EligibleBooking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        guestId: userId,
        status: BookingStatus.CheckedOut,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        room: {
          select: { id: true, name: true, type: true, imageUrl: true },
        },
        review: {
          select: {
            id: true,
            rating: true,
            reviewText: true,
            status: true,
            submittedAt: true,
          },
        },
      },
    });

    return bookings.map((b) => ({
      bookingId: b.id,
      bookingRef: b.bookingRef,
      roomId: b.room.id,
      roomName: b.room.name,
      roomType: b.room.type,
      imageUrl: b.room.imageUrl,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      updatedAt: b.updatedAt,
      review: b.review,
    }));
  }

  // ─── Guest: Submit Review ─────────────────────────────────────────────────
  // Creates a new review for a CheckedOut booking. Enforces:
  //   - booking must belong to this guest
  //   - booking must be CheckedOut (not just confirmed or checked-in)
  //   - one review per booking
  async submitReview(
    userId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewWithRelations> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking || booking.status !== BookingStatus.CheckedOut) {
      throw new BadRequestException(REVIEW_MESSAGES.BOOKING_NOT_ELIGIBLE);
    }

    if (booking.guestId !== userId) {
      throw new ForbiddenException(REVIEW_MESSAGES.REVIEW_NOT_YOURS);
    }

    const existing = await this.prisma.review.findUnique({
      where: { bookingId: dto.bookingId },
    });
    if (existing) {
      throw new ConflictException(REVIEW_MESSAGES.REVIEW_ALREADY_EXISTS);
    }

    const review = (await this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        guestId: userId,
        roomId: booking.roomId,
        rating: dto.rating,
        reviewText: dto.reviewText,
        status: ReviewStatus.Pending,
      },
      include: {
        guest: { select: { id: true, fullName: true, email: true } },
        room: { select: { id: true, name: true, type: true } },
        booking: { select: { id: true, bookingRef: true } },
      },
    })) as ReviewWithRelations;

    // Notify all admins that a new review was submitted and needs moderation
    this.notifyAdmins(
      `${review.guest.fullName} submitted a ${dto.rating}-star review for ${review.room.name}`,
      booking.id,
    );

    return review;
  }

  // ─── Guest: Edit Own Review ────────────────────────────────────────────────
  // Guests can only edit their own reviews while they are still Pending.
  // Once an admin has approved or hidden a review it cannot be changed.
  async updateReview(
    id: string,
    userId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewWithRelations> {
    const review = await this.prisma.review.findUnique({ where: { id } });

    if (!review) throw new NotFoundException(REVIEW_MESSAGES.REVIEW_NOT_FOUND);
    if (review.guestId !== userId)
      throw new ForbiddenException(REVIEW_MESSAGES.REVIEW_NOT_YOURS);
    if (review.status !== ReviewStatus.Pending)
      throw new BadRequestException(REVIEW_MESSAGES.REVIEW_NOT_EDITABLE);

    return this.prisma.review.update({
      where: { id },
      data: {
        ...(dto.rating !== undefined && { rating: dto.rating }),
        ...(dto.reviewText !== undefined && { reviewText: dto.reviewText }),
      },
      include: {
        guest: { select: { id: true, fullName: true, email: true } },
        room: { select: { id: true, name: true, type: true } },
        booking: { select: { id: true, bookingRef: true } },
      },
    }) as Promise<ReviewWithRelations>;
  }

  // ─── Admin: List All Reviews ───────────────────────────────────────────────
  // Paginated list with optional status filter (Pending / Approved / Hidden).
  async listReviews(filters: ListReviewsDto): Promise<ReviewsPage> {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where = filters.status
      ? { status: filters.status as ReviewStatus }
      : {};

    const [total, data] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          guest: { select: { id: true, fullName: true, email: true } },
          room: { select: { id: true, name: true, type: true } },
          booking: { select: { id: true, bookingRef: true } },
        },
      }),
    ]);

    return {
      data: data as ReviewWithRelations[],
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Admin: Update Review Status ──────────────────────────────────────────
  // Changes a review's status to Approved or Hidden.
  // Approved reviews are visible on the public room listing.
  async updateReviewStatus(
    id: string,
    dto: UpdateReviewStatusDto,
  ): Promise<ReviewWithRelations> {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException(REVIEW_MESSAGES.REVIEW_NOT_FOUND);

    return this.prisma.review.update({
      where: { id },
      data: { status: dto.status as ReviewStatus },
      include: {
        guest: { select: { id: true, fullName: true, email: true } },
        room: { select: { id: true, name: true, type: true } },
        booking: { select: { id: true, bookingRef: true } },
      },
    }) as Promise<ReviewWithRelations>;
  }

  // ─── Notification helper ─────────────────────────────────────────────────
  // Fire-and-forget: notification failures must never break review operations.
  private notifyAdmins(message: string, bookingId?: string): void {
    this.prisma.user
      .findMany({ where: { role: 'ADMIN' }, select: { id: true } })
      .then((admins) =>
        Promise.all(
          admins.map((admin) =>
            this.notificationsService
              .create({
                userId: admin.id,
                type: 'new_review_submitted',
                title: 'New Review Submitted',
                message,
                bookingId,
                actionLabel: 'Review Now',
                actionHref: '/admin/reviews',
              })
              .then((n) => this.notificationsGateway.sendToUser(admin.id, n)),
          ),
        ),
      )
      .catch(() => {
        /* silent */
      });
  }
}
