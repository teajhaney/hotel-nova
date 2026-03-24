import * as crypto from 'crypto';
import Paystack from 'paystack';
import { PromoCode } from '@prisma/client';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { PAYMENT_MESSAGES } from '../../common/constants/messages';

// The @types/paystack community definitions don't fully type the API response,
// so we describe exactly the shape we need here and cast the SDK result to it.
interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  } | null;
}

const logger = new Logger('PaystackHelper');

// Builds a unique, human-readable booking reference.
// e.g. HN-20260323-A8F2K
export function buildBookingRef(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `HN-${datePart}-${randomPart}`;
}

// Returns the number of nights between two dates.
export function calcNights(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export interface BookingAmounts {
  subtotal: number;
  serviceCharge: number;
  promoDiscount: number;
  vat: number;
  totalAmount: number;
}

// All amounts are stored in kobo (the DB convention — see naira() in seed.ts).
// Paystack also expects kobo, so no conversion is needed before sending.
export function calcAmounts(
  pricePerNight: number,
  nights: number,
  promoCode: PromoCode | null,
): BookingAmounts {
  const subtotal = pricePerNight * nights;
  const serviceCharge = Math.round(subtotal * 0.05); // 5%

  // Apply the promo discount before VAT so the guest pays VAT on the reduced amount
  let promoDiscount = 0;
  if (promoCode) {
    promoDiscount =
      promoCode.discountType === 'percentage'
        ? Math.round(subtotal * (promoCode.discountValue / 100))
        : Math.min(promoCode.discountValue, subtotal); // cap fixed discount at subtotal
  }

  const taxableAmount = subtotal + serviceCharge - promoDiscount;
  const vat = Math.round(taxableAmount * 0.075); // 7.5%
  const totalAmount = taxableAmount + vat;

  return { subtotal, serviceCharge, promoDiscount, vat, totalAmount };
}

// Initialises a Paystack transaction and returns the authorization_url
// the frontend redirects the guest to for payment.
// Amounts are already in kobo (DB convention), which is exactly what Paystack expects.
export async function initPaystackPayment(
  email: string,
  amountKobo: number,
  reference: string,
  bookingRef: string,
): Promise<string> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new InternalServerErrorException(
      PAYMENT_MESSAGES.PAYSTACK_INIT_FAILED,
    );
  }

  const paystack = Paystack(secretKey);

  const callbackUrl =
    process.env.PAYSTACK_CALLBACK_URL ??
    `${process.env.FRONTEND_URL}/book/confirmation`;

  // The @types/paystack definition incorrectly requires `name` — the real
  // Paystack API does not. We cast the params through unknown to bypass the
  // stale type. The result is captured as unknown first so the subsequent cast
  // to our own interface is explicit and safe (no `any` leaking through).
  const rawResponse: unknown = await paystack.transaction.initialize({
    email,
    amount: amountKobo,
    reference,
    callback_url: callbackUrl,
    metadata: JSON.stringify({ bookingRef }),
  } as unknown as Parameters<typeof paystack.transaction.initialize>[0]);

  const response = rawResponse as PaystackInitResponse;

  if (!response.status || !response.data?.authorization_url) {
    logger.error(`Paystack init failed: ${response.message}`);
    throw new InternalServerErrorException(
      PAYMENT_MESSAGES.PAYSTACK_INIT_FAILED,
    );
  }

  return response.data.authorization_url;
}
