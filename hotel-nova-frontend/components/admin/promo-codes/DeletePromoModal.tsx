'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';

const M = ADMIN_DASHBOARD_MESSAGES;

interface DeletePromoModalProps {
  promoCode: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeletePromoModal({ promoCode, onClose, onConfirm }: DeletePromoModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const modal = (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
        onClick={onClose}
        aria-label={M.closeModalAriaLabel}
      />
      <motion.div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center"
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      >
        <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
          <Tag size={22} className="text-[#EF4444]" />
        </div>
        <h2 className="text-[17px] font-bold text-[#0D0F2B]">{M.deletePromoTitle}</h2>
        <p className="text-[14px] text-[#6B7280] mt-2 leading-relaxed">
          {M.deletePromoBodyPrefix}{' '}
          <span className="font-bold text-[#0D0F2B] tracking-wide">{promoCode}</span>
          {M.deletePromoBodySuffix}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors"
          >
            {M.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-lg bg-[#EF4444] text-white text-[13px] font-semibold hover:bg-[#DC2626] transition-colors"
          >
            {M.deletePromoConfirm}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
