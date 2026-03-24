import type { Booking } from '@prisma/client';

// ─── Shape of the Paystack initialise response we care about ───────────────
export interface PaystackInitData {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: PaystackInitData;
}

// ─── What the service returns after a booking is created ───────────────────
export interface CreateBookingResult {
  booking: Booking;
  paymentUrl: string;
}

// ─── Paginated list shape (mirrors the pattern used in RoomsService) ────────
export interface BookingsPage {
  data: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
