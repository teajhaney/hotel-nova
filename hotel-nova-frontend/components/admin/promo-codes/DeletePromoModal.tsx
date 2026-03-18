'use client';

import { Tag } from 'lucide-react';

interface DeletePromoModalProps {
  promoCode: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeletePromoModal({ promoCode, onClose, onConfirm }: DeletePromoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
          <Tag size={22} className="text-[#EF4444]" />
        </div>
        <h2 className="text-[17px] font-bold text-[#0D0F2B]">Delete Promo Code</h2>
        <p className="text-[14px] text-[#6B7280] mt-2 leading-relaxed">
          Are you sure you want to permanently delete the code{' '}
          <span className="font-bold text-[#0D0F2B] tracking-wide">{promoCode}</span>? Any guests
          who have saved this code will no longer be able to redeem it. This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-[#EF4444] text-white text-[13px] font-semibold hover:bg-[#DC2626] transition-colors"
          >
            Delete Code
          </button>
        </div>
      </div>
    </div>
  );
}
