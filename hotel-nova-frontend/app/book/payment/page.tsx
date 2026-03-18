'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, ChevronRight, Lock } from 'lucide-react';
import Image from 'next/image';
import { useBookingStore } from '@/stores/booking-store';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { formatNgn } from '@/utils/format';
import { useRouter } from 'next/navigation';

const paymentSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  cardNumber: z.string().min(16, 'Card number must be 16 digits').max(19),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Invalid format (MM/YY)'),
  cvv: z.string().min(3, 'CVV must be 3-4 digits').max(4),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

const BREADCRUMBS = [
  { label: BOOKING_MESSAGES.breadcrumbRoomSelection, done: true },
  { label: BOOKING_MESSAGES.breadcrumbGuestDetails, done: true },
  { label: BOOKING_MESSAGES.breadcrumbReview, done: true },
  { label: BOOKING_MESSAGES.breadcrumbPayment, done: false },
];

export default function BookPaymentPage() {
  const store = useBookingStore();
  const router = useRouter();
  const [cardDisplay, setCardDisplay] = useState('');
  const [expiryDisplay, setExpiryDisplay] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const total = store.getTotal();
  const serviceCharge = store.getServiceCharge();
  const vat = store.getVat();
  const subtotal = store.getSubtotal();
  const nights = store.getNights();

  const {
    register, handleSubmit, setValue, formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { email: store.guestDetails?.email ?? '' },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onSubmit(data: PaymentFormData) {
    setIsProcessing(true);
    // TODO: Replace with real Paystack API call via Next.js Route Handler
    store.setConfirmationId('BK-942058');
    router.push('/book/confirmation');
  }

  return (
    <div className="page-container py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[13px] mb-6 flex-wrap">
        {BREADCRUMBS.map((bc, i) => (
          <div key={bc.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-[#CBD5E1]" />}
            <span className={bc.done ? 'text-[#64748B]' : 'text-[#0D0F2B] font-semibold'}>
              {bc.label}
            </span>
          </div>
        ))}
      </nav>

      {/* Step progress */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[15px] font-bold text-[#0D0F2B]">{BOOKING_MESSAGES.step4Label}</p>
          <span className="px-3 py-1 bg-[#020887] text-white text-[12px] font-bold rounded-full">
            {BOOKING_MESSAGES.step4Percent}
          </span>
        </div>
        <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
          <div className="h-full w-full bg-[#020887] rounded-full" />
        </div>
        <p className="mt-2 text-[13px] text-[#64748B]">{BOOKING_MESSAGES.finalStep}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Payment form */}
        <div className="flex-1">
          <h1 className="text-[28px] font-bold text-[#0D0F2B] mb-1">{BOOKING_MESSAGES.paymentTitle}</h1>
          <p className="text-[15px] text-[#64748B] mb-6">{BOOKING_MESSAGES.paymentSubtitle}</p>

          <div className="bg-white rounded-lg border border-[#E2E8F0] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock size={18} className="text-[#020887]" />
              <h2 className="text-[17px] font-bold text-[#0D0F2B]">{BOOKING_MESSAGES.securePayment}</h2>
              <span className="text-[13px] text-[#64748B] ml-1">{BOOKING_MESSAGES.step4SubTitle}</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Email */}
              <div className="form-field">
                <label className="field-label">{BOOKING_MESSAGES.emailAddressLabel}</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="guest@example.com"
                  className={`field-input ${errors.email ? 'field-input-error' : 'field-input-valid'}`}
                />
                {errors.email && <p className="field-error-text">{errors.email.message}</p>}
              </div>

              {/* Card Number */}
              <div className="form-field">
                <label className="field-label">{BOOKING_MESSAGES.cardNumberLabel}</label>
                <div className="relative">
                  <input
                    {...register('cardNumber')}
                    value={cardDisplay}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setCardDisplay(formatted);
                      setValue('cardNumber', formatted.replace(/\s/g, ''));
                    }}
                    placeholder="0000 0000 0000 0000"
                    className={`field-input pr-10 ${errors.cardNumber ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                </div>
                {errors.cardNumber && <p className="field-error-text">{errors.cardNumber.message}</p>}
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="field-label">{BOOKING_MESSAGES.expiryDateLabel}</label>
                  <input
                    {...register('expiry')}
                    value={expiryDisplay}
                    onChange={(e) => {
                      const formatted = formatExpiry(e.target.value);
                      setExpiryDisplay(formatted);
                      setValue('expiry', formatted);
                    }}
                    placeholder="MM / YY"
                    className={`field-input ${errors.expiry ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  {errors.expiry && <p className="field-error-text">{errors.expiry.message}</p>}
                </div>
                <div className="form-field">
                  <label className="field-label">{BOOKING_MESSAGES.cvvLabel}</label>
                  <input
                    {...register('cvv')}
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    className={`field-input ${errors.cvv ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  {errors.cvv && <p className="field-error-text">{errors.cvv.message}</p>}
                </div>
              </div>

              {/* Total to pay */}
              <div className="flex items-center justify-between py-3 border-t border-[#E2E8F0]">
                <span className="text-[15px] font-bold text-[#0D0F2B]">{BOOKING_MESSAGES.totalToPay}</span>
                <span className="text-[18px] font-bold text-[#0D0F2B]">{formatNgn(total)}</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Shield size={16} />
                {isProcessing ? 'Processing...' : `${BOOKING_MESSAGES.payBtn} ${formatNgn(total)}`}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#94A3B8]">
                <Shield size={12} />
                <span>{BOOKING_MESSAGES.securedByPaystack}</span>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Booking summary */}
        <div className="hidden lg:block w-[300px] xl:w-[320px] shrink-0">
          <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-5 sticky top-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#020887] mb-4">
              {BOOKING_MESSAGES.bookingSummaryLabel}
            </p>
            {store.selectedRoom && (
              <div className="flex items-start gap-3 mb-5">
                <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={store.selectedRoom.image}
                    alt={store.selectedRoom.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0D0F2B]">The Grand Oasis Abuja</p>
                  <p className="text-[12px] text-[#64748B] uppercase tracking-wider">{store.selectedRoom.name}</p>
                  <p className="text-[12px] text-[#64748B] mt-1">{nights} Night{nights !== 1 ? 's' : ''} • {store.adults + store.children} Guest{(store.adults + store.children) !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2.5 border-t border-[#E2E8F0] pt-4">
              <div className="flex justify-between text-[13px] text-[#64748B]">
                <span>{BOOKING_MESSAGES.subtotalLabel}</span>
                <span>{formatNgn(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#64748B]">
                <span>{BOOKING_MESSAGES.serviceFeeLabel}</span>
                <span>{formatNgn(serviceCharge)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#64748B]">
                <span>{BOOKING_MESSAGES.vatLabel}</span>
                <span>{formatNgn(vat)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
