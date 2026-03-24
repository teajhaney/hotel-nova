'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { UserX, Loader2 } from 'lucide-react';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';
import { useAdminDeleteUser } from '@/hooks/use-admin-users';

const M = ADMIN_DASHBOARD_MESSAGES;

interface DeleteUserModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
  onDeleted: () => void; // called after a successful delete
}

export function DeleteUserModal({ userId, userName, onClose, onDeleted }: DeleteUserModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const deleteUser = useAdminDeleteUser();

  function handleConfirm() {
    deleteUser.mutate(userId, {
      onSuccess: () => { onDeleted(); onClose(); },
    });
  }

  const modal = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={M.deleteUserTitle}
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center pointer-events-auto">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
            <UserX size={22} className="text-[#EF4444]" />
          </div>

          <h2 className="text-[17px] font-bold text-[#0D0F2B]">{M.deleteUserTitle}</h2>
          <p className="text-[14px] text-[#6B7280] mt-2 leading-relaxed">
            {M.deleteUserBodyPrefix}{' '}
            <span className="font-semibold text-[#0D0F2B]">{userName}</span>
            {M.deleteUserBodySuffix}
          </p>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={deleteUser.isPending}
              className="flex-1 h-10 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              {M.cancel}
            </button>
            <button
              onClick={handleConfirm}
              disabled={deleteUser.isPending}
              className="flex-1 h-10 rounded-lg bg-[#EF4444] text-white text-[13px] font-semibold hover:bg-[#DC2626] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleteUser.isPending && <Loader2 size={13} className="animate-spin" />}
              {deleteUser.isPending ? 'Deleting...' : M.deleteUserConfirm}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
