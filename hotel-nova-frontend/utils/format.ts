/**
 * HotelNova — Shared Formatting Utilities
 *
 * Reusable pure functions for formatting currency, dates, and
 * booking-related values used across the booking wizard pages.
 */

/**
 * Format a kobo amount as Nigerian Naira.
 * All prices in the DB are stored in kobo (naira × 100), so we
 * always divide by 100 before displaying.
 * e.g. 500000 kobo → "₦5,000"
 */
export function formatNgn(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString('en-NG')}`;
}

/**
 * Format an ISO date string for display.
 * @param str  ISO date string "YYYY-MM-DD" or null
 * @param includeDay  Whether to include the weekday name
 * e.g. "2023-10-12" → "Oct 12, 2023"
 * e.g. "2023-10-12", true → "Thursday, Oct 12, 2023"
 */
export function formatBookingDate(
  str: string | null,
  includeDay = false
): string {
  if (!str) return '—';
  // If the backend returns a full ISO timestamp (e.g. "2026-03-24T00:00:00.000Z"),
  // appending 'T00:00:00' would produce an invalid string.
  // Only append it when we have a plain date-only string like "2026-03-24".
  const d = str.includes('T') ? new Date(str) : new Date(str + 'T00:00:00');
  if (isNaN(d.getTime())) return '—';
  if (includeDay) {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a short date range label.
 * e.g. "Oct 5 - Oct 30"
 */
export function formatDateRange(
  checkIn: string | null,
  checkOut: string | null
): string {
  if (!checkIn) return '—';
  const start = formatBookingDate(checkIn);
  if (!checkOut) return start;
  return `${start} — ${formatBookingDate(checkOut)}`;
}

/**
 * Calculate the number of nights between two ISO date strings.
 * Returns 0 if either date is missing or invalid.
 */
export function calculateNights(
  checkIn: string | null,
  checkOut: string | null
): number {
  if (!checkIn || !checkOut) return 0;
  const diff =
    new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Build a human-readable guest summary string.
 * e.g. "2 Adults, 1 Child"
 */
export function formatGuestSummary(adults: number, children: number): string {
  const adultStr = `${adults} Adult${adults !== 1 ? 's' : ''}`;
  const childStr =
    children > 0
      ? `, ${children} Child${children !== 1 ? 'ren' : ''}`
      : '';
  return adultStr + childStr;
}

/**
 * Calculate price breakdown from a nightly rate.
 */
export function calcPriceBreakdown(
  pricePerNight: number,
  nights: number,
  promoDiscount = 0
) {
  const subtotal = pricePerNight * nights;
  const serviceCharge = Math.round(subtotal * 0.05);
  const vat = Math.round(subtotal * 0.075);
  const total = subtotal + serviceCharge + vat - promoDiscount;
  return { subtotal, serviceCharge, vat, total };
}
