'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Calendar, Users, AlignJustify } from 'lucide-react';
import { useBookingStore } from '@/stores/booking-store';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { formatBookingDate, formatNgn, formatGuestSummary } from '@/utils/format';
import { useRouter } from 'next/navigation';
import type { GuestDetails } from '@/type/type';

const guestSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  agreeToTerms: z.boolean().refine(v => v === true, 'You must agree to the terms'),
});

type GuestFormData = z.infer<typeof guestSchema>;

const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United States', 'United Kingdom',
  'Canada', 'Germany', 'France', 'China', 'India', 'Australia', 'Brazil', 'Other',
];

export default function BookStep3Page() {
  const store = useBookingStore();
  const router = useRouter();
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [specialRequests, setSpecialRequests] = useState(store.specialRequests);

  const nights = store.getNights();
  const subtotal = store.getSubtotal();
  const serviceCharge = store.getServiceCharge();
  const vat = store.getVat();
  const total = store.getTotal();

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: store.guestDetails ?? {
      fullName: '', email: '', phone: '', country: 'Nigeria', agreeToTerms: false,
    },
  });

  function handleApplyPromo() {
    if (promoInput.toUpperCase() === 'OASIS10') {
      const discount = Math.round(subtotal * 0.10);
      store.applyPromo(promoInput, discount);
      setPromoApplied(true);
    }
  }

  function onSubmit(data: GuestFormData) {
    const details: GuestDetails = { ...data };
    store.setGuestDetails(details);
    store.setSpecialRequests(specialRequests);
    router.push('/book/payment');
  }

  const guestSummary = formatGuestSummary(store.adults, store.children);

  return (
    <div className="page-container py-10 pb-28 lg:pb-10">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#0D0F2B] mb-1">{BOOKING_MESSAGES.bookingSummaryTitle}</h1>
        <p className="text-[15px] text-[#64748B]">{BOOKING_MESSAGES.bookingSummarySubtitle}</p>
        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2 text-[#020887] mb-1.5">
              <span className="text-[13px] font-semibold">{BOOKING_MESSAGES.step3Label}</span>
            </div>
            <div className="h-1.5 w-64 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-[#020887] rounded-full" />
            </div>
          </div>
          <p className="text-[13px] text-[#64748B]">{BOOKING_MESSAGES.step3Percent}</p>
        </div>
        <p className="mt-2 text-[13px] text-[#64748B]">{BOOKING_MESSAGES.almostThere}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: main content */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Selected stay card */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748B] mb-2">
              {BOOKING_MESSAGES.selectedStay}
            </p>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-[18px] font-bold text-[#0D0F2B] mb-2">
                  {store.selectedRoom?.name ?? 'No room selected'}
                </h2>
                <div className="flex items-center gap-2 text-[14px] text-[#64748B] mb-1">
                  <Calendar size={14} className="text-[#64748B]" />
                  <span>{formatBookingDate(store.checkIn)} - {formatBookingDate(store.checkOut)}</span>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-[#64748B]">
                  <Users size={14} className="text-[#64748B]" />
                  <span>{guestSummary}</span>
                </div>
              </div>
              {store.selectedRoom && (
                <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={store.selectedRoom.image}
                    alt={store.selectedRoom.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
            </div>

            {/* Details table */}
            <div className="mt-5 border-t border-[#F1F5F9] pt-4 flex flex-col gap-3">
              {[
                { label: BOOKING_MESSAGES.roomType, value: store.selectedRoom?.name ?? '—' },
                { label: BOOKING_MESSAGES.checkInDate, value: formatBookingDate(store.checkIn, true) },
                { label: BOOKING_MESSAGES.checkOutDate, value: `${formatBookingDate(store.checkOut, true)}${nights > 0 ? ` (${nights} Night${nights !== 1 ? 's' : ''})` : ''}` },
                { label: BOOKING_MESSAGES.guestsDetail, value: guestSummary },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-4 text-[14px]">
                  <span className="text-[#64748B] shrink-0">{label}</span>
                  <span className="text-[#0D0F2B] font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guest Details Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
              <h2 className="text-[17px] font-bold text-[#0D0F2B] mb-5">{BOOKING_MESSAGES.guestDetailsTitle}</h2>
              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div className="form-field">
                  <label className="field-label">{BOOKING_MESSAGES.fullNameLabel}</label>
                  <input
                    {...register('fullName')}
                    placeholder={BOOKING_MESSAGES.fullNamePlaceholder}
                    className={`field-input ${errors.fullName ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  {errors.fullName && <p className="field-error-text">{errors.fullName.message}</p>}
                </div>
                {/* Email */}
                <div className="form-field">
                  <label className="field-label">{BOOKING_MESSAGES.emailLabel}</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder={BOOKING_MESSAGES.emailPlaceholder}
                    className={`field-input ${errors.email ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  {errors.email && <p className="field-error-text">{errors.email.message}</p>}
                </div>
                {/* Phone + Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label className="field-label">{BOOKING_MESSAGES.phoneLabel}</label>
                    <input
                      {...register('phone')}
                      placeholder={BOOKING_MESSAGES.phonePlaceholder}
                      className={`field-input ${errors.phone ? 'field-input-error' : 'field-input-valid'}`}
                    />
                    {errors.phone && <p className="field-error-text">{errors.phone.message}</p>}
                  </div>
                  <div className="form-field">
                    <label className="field-label">{BOOKING_MESSAGES.countryLabel}</label>
                    <select
                      {...register('country')}
                      className={`field-input ${errors.country ? 'field-input-error' : 'field-input-valid'}`}
                    >
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.country && <p className="field-error-text">{errors.country.message}</p>}
                  </div>
                </div>
                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    {...register('agreeToTerms')}
                    type="checkbox"
                    id="terms"
                    className="terms-checkbox"
                  />
                  <label htmlFor="terms" className="terms-label">
                    {BOOKING_MESSAGES.termsText}{' '}
                    <a href="/terms" className="auth-link">{BOOKING_MESSAGES.termsLink}</a>
                    {' '}{BOOKING_MESSAGES.termsAnd}{' '}
                    <a href="/cancellation" className="auth-link">{BOOKING_MESSAGES.cancellationLink}</a>.
                  </label>
                </div>
                {errors.agreeToTerms && <p className="field-error-text">{errors.agreeToTerms.message}</p>}
              </div>
            </div>

            {/* Special Requests */}
            <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlignJustify size={16} className="text-[#64748B]" />
                <h3 className="text-[15px] font-semibold text-[#0D0F2B]">{BOOKING_MESSAGES.specialRequestsTitle}</h3>
              </div>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder={BOOKING_MESSAGES.specialRequestsPlaceholder}
                rows={4}
                className="w-full bg-white rounded-sm border border-[#E2E8F0] px-4 py-3 text-[14px] text-[#0D0F2B] placeholder:text-[#94A3B8] outline-none focus:border-[#020887] resize-none transition-colors"
              />
            </div>

            {/* Mobile: price summary (inline) */}
            <div className="lg:hidden">
              <PriceBreakdown
                ratePerNight={store.selectedRoom?.pricePerNight ?? 0}
                nights={nights}
                serviceCharge={serviceCharge}
                vat={vat}
                total={total}
                promoDiscount={store.promoDiscount}
              />
            </div>
          </form>
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:flex flex-col gap-4 w-[300px] xl:w-[340px] shrink-0">
          <div className="sticky top-6 flex flex-col gap-4">
            <PriceBreakdown
              ratePerNight={store.selectedRoom?.pricePerNight ?? 0}
              nights={nights}
              serviceCharge={serviceCharge}
              vat={vat}
              total={total}
              promoDiscount={store.promoDiscount}
            />

            {/* Promo Code */}
            <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
              <p className="text-[14px] font-semibold text-[#0D0F2B] mb-3">{BOOKING_MESSAGES.applyPromoCode}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={BOOKING_MESSAGES.enterCode}
                  disabled={promoApplied}
                  className="flex-1 h-10 px-3 rounded-sm border border-[#E2E8F0] text-[14px] text-[#0D0F2B] placeholder:text-[#94A3B8] outline-none focus:border-[#020887] disabled:bg-[#F8FAFC] disabled:text-[#64748B] transition-colors"
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoInput}
                  className="px-4 h-10 rounded-sm bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {BOOKING_MESSAGES.applyBtn}
                </button>
              </div>
              {promoApplied && (
                <p className="mt-2 text-[12px] text-[#10B981]">Promo code applied! 10% off subtotal.</p>
              )}
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {BOOKING_MESSAGES.proceedToPayment} →
            </button>
            <button
              onClick={() => router.back()}
              className="text-[14px] text-[#64748B] hover:text-[#020887] text-center transition-colors"
            >
              {BOOKING_MESSAGES.goBackStep2}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: fixed bottom CTA bar — matches design */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-5 py-4 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] text-[#64748B] uppercase tracking-[0.08em] font-semibold">Total Amount</p>
            <p className="text-[18px] font-bold text-[#020887]">{formatNgn(total)}</p>
          </div>
          {nights > 0 && (
            <p className="text-[13px] text-[#64748B]">{nights} Night{nights !== 1 ? 's' : ''}</p>
          )}
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {BOOKING_MESSAGES.proceedToPayment} →
        </button>
      </div>
    </div>
  );
}
