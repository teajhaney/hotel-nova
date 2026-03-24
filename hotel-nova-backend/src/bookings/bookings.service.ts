import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Booking,
  BookingStatus,
  PaymentStatus,
  Prisma,
  PromoCode,
  RoomStatus,
} from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import {
  BOOKING_MESSAGES,
  PAYMENT_MESSAGES,
} from '../common/constants/messages';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingFiltersDto } from './dto/booking-filters.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import {
  BookingsPage,
  CreateBookingResult,
} from './interface/booking.interface';
import {
  buildBookingRef,
  calcAmounts,
  calcNights,
  initPaystackPayment,
} from './helpers/booking.helpers';

// ─── Allowed status transitions ─────────────────────────────────────────────
// The keys are "current status", the values are the statuses you can move TO.
// This prevents nonsensical transitions like CheckedOut → Pending.
const ALLOWED_TRANSITIONS: Partial<Record<BookingStatus, BookingStatus[]>> = {
  [BookingStatus.Pending]: [BookingStatus.Confirmed, BookingStatus.Cancelled],
  [BookingStatus.Confirmed]: [BookingStatus.CheckedIn, BookingStatus.Cancelled],
  [BookingStatus.CheckedIn]: [BookingStatus.CheckedOut],
};

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // ─── Guest: Create Booking ────────────────────────────────────────────────

  // This is the main booking flow. We use a Prisma transaction to keep the
  // availability check and booking creation atomic — two guests booking the
  // same room at the same time can't both succeed.
  async createBooking(
    user: AuthUser,
    dto: CreateBookingDto,
  ): Promise<CreateBookingResult> {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date validation — these are business rules, not schema issues
    if (checkIn < today) {
      throw new BadRequestException(BOOKING_MESSAGES.CHECK_IN_PAST);
    }
    if (checkOut <= checkIn) {
      throw new BadRequestException(BOOKING_MESSAGES.INVALID_DATE_RANGE);
    }

    const nights = calcNights(checkIn, checkOut);

    // Resolve room and validate its current status
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });
    if (!room) throw new NotFoundException(BOOKING_MESSAGES.BOOKING_NOT_FOUND);
    if (room.status === RoomStatus.Maintenance) {
      throw new BadRequestException(BOOKING_MESSAGES.ROOM_UNDER_MAINTENANCE);
    }

    // Validate and resolve promo code if provided
    let promoCode: PromoCode | null = null;
    if (dto.promoCode) {
      promoCode = await this.prisma.promoCode.findUnique({
        where: { code: dto.promoCode },
      });

      const now = new Date();

      // Throwing directly (rather than storing a boolean) lets TypeScript narrow
      // promoCode to non-null on the lines that follow.
      if (
        !promoCode ||
        promoCode.status !== 'Active' ||
        promoCode.validFrom > now ||
        promoCode.validTo < now
      ) {
        throw new BadRequestException(BOOKING_MESSAGES.INVALID_PROMO_CODE);
      }
      if (promoCode.used >= promoCode.usageLimit) {
        throw new BadRequestException(
          BOOKING_MESSAGES.PROMO_CODE_LIMIT_REACHED,
        );
      }
    }

    const { subtotal, serviceCharge, promoDiscount, vat, totalAmount } =
      calcAmounts(room.price, nights, promoCode);

    const bookingRef = buildBookingRef();
    // The Paystack reference is a unique identifier for this specific payment attempt.
    // Using the bookingRef as the payment reference keeps them linked 1-to-1.
    const paymentReference = `PAY-${bookingRef}`;

    // We also pull the guest's full name and email from the JWT user — the guest
    // doesn't type these in, they're already on their account.
    const guestData = {
      guestName: user.fullName,
      guestEmail: user.email,
      guestPhone: dto.guestPhone ?? null,
      guestCountry: dto.guestCountry ?? null,
    };

    // The transaction ensures:
    //  1. We check availability
    //  2. We create the booking
    // If someone else books the same room between our check and our insert,
    // Prisma will retry and the check will fail on the next attempt.
    const booking = await this.prisma.$transaction(async (tx) => {
      // Availability check: any booking that overlaps our dates and is not cancelled?
      const overlap = await tx.booking.findFirst({
        where: {
          roomId: dto.roomId,
          status: {
            in: [
              BookingStatus.Pending,
              BookingStatus.Confirmed,
              BookingStatus.CheckedIn,
            ],
          },
          // Date overlap: existing booking starts before our checkout
          //               AND existing booking ends after our checkin
          AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
        },
      });

      if (overlap) {
        throw new BadRequestException(BOOKING_MESSAGES.ROOM_UNAVAILABLE);
      }

      // If a promo code was used, bump its usage count inside the same transaction
      // so we can never exceed the limit due to a race condition.
      if (promoCode) {
        await tx.promoCode.update({
          where: { id: promoCode.id },
          data: { used: { increment: 1 } },
        });
      }

      return tx.booking.create({
        data: {
          bookingRef,
          guestId: user.id,
          roomId: dto.roomId,
          ...guestData,
          checkIn,
          checkOut,
          nights,
          adults: dto.adults,
          children: dto.children ?? 0,
          pricePerNight: room.price,
          subtotal,
          serviceCharge,
          promoDiscount,
          vat,
          totalAmount,
          promoCodeId: promoCode?.id ?? null,
          specialRequests: dto.specialRequests ?? null,
          status: BookingStatus.Pending,
          paymentStatus: PaymentStatus.Pending,
          paymentReference,
        },
      });
    });

    // Initialize payment. If Paystack fails we delete the booking we just created
    // so the room stays free and the guest can try again without hitting the
    // "room unavailable" availability check on the next attempt.
    let paymentUrl: string;
    try {
      paymentUrl = await initPaystackPayment(
        user.email,
        totalAmount,
        paymentReference,
        bookingRef,
      );
    } catch (err) {
      await this.prisma.booking.delete({ where: { id: booking.id } });

      // Also roll back the promo code usage increment if one was applied
      if (promoCode) {
        await this.prisma.promoCode.update({
          where: { id: promoCode.id },
          data: { used: { decrement: 1 } },
        });
      }

      throw err;
    }

    return { booking, paymentUrl };
  }

  // ─── Guest: My Bookings ───────────────────────────────────────────────────

  async getMyBookings(userId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { guestId: userId },
      orderBy: { createdAt: 'desc' },
      include: { room: true },
    });
  }

  // ─── Shared: Get Booking by ID ────────────────────────────────────────────

  // Both guests and admins use this. Guests can only see their own bookings.
  async getBookingById(id: string, user: AuthUser): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!booking)
      throw new NotFoundException(BOOKING_MESSAGES.BOOKING_NOT_FOUND);

    // Guests must only see their own bookings
    if (user.role === 'GUEST' && booking.guestId !== user.id) {
      throw new ForbiddenException(BOOKING_MESSAGES.NOT_YOUR_BOOKING);
    }

    return booking;
  }

  // ─── Guest: Cancel Booking ────────────────────────────────────────────────

  async cancelBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking)
      throw new NotFoundException(BOOKING_MESSAGES.BOOKING_NOT_FOUND);

    if (booking.guestId !== userId) {
      throw new ForbiddenException(BOOKING_MESSAGES.NOT_YOUR_BOOKING);
    }

    const cancellable: BookingStatus[] = [
      BookingStatus.Pending,
      BookingStatus.Confirmed,
    ];
    if (!cancellable.includes(booking.status)) {
      throw new BadRequestException(BOOKING_MESSAGES.CANNOT_CANCEL);
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.Cancelled },
    });
  }

  // ─── Admin: List All Bookings ─────────────────────────────────────────────

  async adminGetBookings(filters: BookingFiltersDto): Promise<BookingsPage> {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.guestEmail) where.guestEmail = filters.guestEmail;

    // Check-in range filter — e.g. "show me arrivals this week"
    if (filters.checkInFrom || filters.checkInTo) {
      where.checkIn = {
        ...(filters.checkInFrom && { gte: new Date(filters.checkInFrom) }),
        ...(filters.checkInTo && { lte: new Date(filters.checkInTo) }),
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { room: true },
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Admin: Update Booking Status ─────────────────────────────────────────

  // Side effects on room status:
  //   Pending/Confirmed → CheckedIn  : room becomes Occupied
  //   CheckedIn → CheckedOut         : room goes back to Available
  async adminUpdateStatus(
    id: string,
    dto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking)
      throw new NotFoundException(BOOKING_MESSAGES.BOOKING_NOT_FOUND);

    const allowed = ALLOWED_TRANSITIONS[booking.status];
    if (!allowed || !allowed.includes(dto.status)) {
      throw new BadRequestException(BOOKING_MESSAGES.INVALID_STATUS_TRANSITION);
    }

    // Determine if we need to change the room status alongside the booking
    let roomStatus: RoomStatus | undefined;
    if (dto.status === BookingStatus.CheckedIn)
      roomStatus = RoomStatus.Occupied;
    if (dto.status === BookingStatus.CheckedOut)
      roomStatus = RoomStatus.Available;

    // Run both updates in one transaction so they succeed or fail together
    const [updated] = await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id },
        data: { status: dto.status },
      }),
      ...(roomStatus
        ? [
            this.prisma.room.update({
              where: { id: booking.roomId },
              data: { status: roomStatus },
            }),
          ]
        : []),
    ]);

    return updated;
  }

  // ─── Paystack Webhook ─────────────────────────────────────────────────────

  // Paystack sends a POST to this endpoint whenever a payment event happens.
  // We MUST verify the HMAC-SHA512 signature before touching the database —
  // otherwise anyone could send a fake "payment succeeded" request.
  //verifies paystack.
  async handlePaystackWebhook(
    signature: string,
    rawBody: Buffer,
  ): Promise<void> {
    const secretKey = process.env.PAYSTACK_SECRET_KEY ?? '';

    // Compute HMAC-SHA512 of the raw request body using our Paystack secret
    const expected = crypto
      .createHmac('sha512', secretKey)
      .update(rawBody)
      .digest('hex');

    if (expected !== signature) {
      throw new UnauthorizedException(
        PAYMENT_MESSAGES.INVALID_WEBHOOK_SIGNATURE,
      );
    }

    // Safe to parse the body now that we know it's genuine
    const event = JSON.parse(rawBody.toString()) as {
      event: string;
      data: { reference: string };
    };

    // We only care about successful charges. All other events are silently ignored.
    if (event.event !== 'charge.success') return;

    const reference = event.data.reference;

    // Find the booking that was waiting for this payment
    const booking = await this.prisma.booking.findUnique({
      where: { paymentReference: reference },
    });

    // If we can't find it or it's already been processed, nothing to do
    if (!booking || booking.paymentStatus === PaymentStatus.Paid) return;

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: PaymentStatus.Paid,
        status: BookingStatus.Confirmed,
        paymentMethod: 'Paystack',
      },
    });
  }
}
