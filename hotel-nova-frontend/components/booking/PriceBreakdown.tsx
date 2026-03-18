import { Receipt } from 'lucide-react';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { formatNgn } from '@/utils/format';

interface PriceBreakdownProps {
  ratePerNight: number;
  nights: number;
  serviceCharge: number;
  vat: number;
  total: number;
  promoDiscount?: number;
}

export function PriceBreakdown({ ratePerNight, nights, serviceCharge, vat, total, promoDiscount = 0 }: PriceBreakdownProps) {
  const subtotal = ratePerNight * nights;

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Receipt size={18} className="text-[#020887]" />
        <h3 className="text-[16px] font-bold text-[#0D0F2B]">{BOOKING_MESSAGES.priceSummaryTitle}</h3>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between text-[14px] text-[#64748B]">
          <span>{BOOKING_MESSAGES.ratePerNight}</span>
          <span>{formatNgn(ratePerNight)}</span>
        </div>
        <div className="flex justify-between text-[14px] text-[#64748B]">
          <span>{BOOKING_MESSAGES.totalNights} ({nights})</span>
          <span>{formatNgn(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[14px] text-[#64748B]">
          <span>{BOOKING_MESSAGES.serviceCharge}</span>
          <span>{formatNgn(serviceCharge)}</span>
        </div>
        <div className="flex justify-between text-[14px] text-[#64748B]">
          <span>{BOOKING_MESSAGES.vatTaxes}</span>
          <span>{formatNgn(vat)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-[14px] text-[#10B981]">
            <span>Promo Discount</span>
            <span>-{formatNgn(promoDiscount)}</span>
          </div>
        )}
        <div className="border-t border-[#E2E8F0] pt-3 flex justify-between">
          <span className="text-[15px] font-bold text-[#0D0F2B]">{BOOKING_MESSAGES.totalAmount}</span>
          <span className="text-[20px] font-bold text-[#020887]">{formatNgn(total)}</span>
        </div>
      </div>
    </div>
  );
}
