'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  ChevronDown,
  Mail,
  User,
  ShieldCheck,
  CalendarDays,
  Info,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';
import {
  useAdminCreateUser,
  useAdminUpdateUser,
  type AdminApiUser,
} from '@/hooks/use-admin-users';

const M = ADMIN_DASHBOARD_MESSAGES;

// ── Types ─────────────────────────────────────────────────────
// UserData is the shape the page uses to display rows in the table.
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GUEST';
  status: 'Active' | 'Inactive' | 'Suspended';
  joined: string;
}

interface UserFormModalProps {
  user?: UserData | null; // null / undefined = add mode
  onClose: () => void;
  onSaved: (user: AdminApiUser) => void; // called after a successful API response
}

// ── Schemas ───────────────────────────────────────────────────
const addSchema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm the password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const editSchema = z.object({
  role: z.enum(['ADMIN', 'GUEST']),
  status: z.enum(['Active', 'Inactive', 'Suspended']),
});

type AddFormData = z.infer<typeof addSchema>;
type EditFormData = z.infer<typeof editSchema>;

// ── Shared styles ─────────────────────────────────────────────
const inputCls =
  'block w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] placeholder:text-[#9CA3AF] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 transition-all';

const selectCls =
  'block w-full h-12 px-4 pr-10 rounded-lg border border-[#D1D5DB] bg-white text-[14px] text-[#0D0F2B] outline-none focus:border-[#020887] focus:ring-2 focus:ring-[#020887]/10 appearance-none cursor-pointer transition-all';

const labelCls = 'block text-[13px] font-semibold text-[#374151] mb-2';
const errorCls = 'block text-[12px] text-[#EF4444] mt-1.5';

const AVATAR_COLORS = ['#EEF0FF', '#D1FAE5', '#FFEDD5', '#DBEAFE', '#FEE2E2', '#FEF3C7'];
const AVATAR_TEXT = ['#020887', '#10B981', '#F97316', '#1D4ED8', '#DC2626', '#B45309'];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ── Add Admin Form ────────────────────────────────────────────
function AddForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (user: AdminApiUser) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const createUser = useAdminCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFormData>({ resolver: zodResolver(addSchema) });

  const onSubmit = (data: AddFormData) => {
    createUser.mutate(
      { fullName: data.name, email: data.email, password: data.password },
      { onSuccess: (user) => { onSaved(user); onClose(); } },
    );
  };

  return (
    <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
      {/* Account Details */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
          {M.userSectionAccountDetails}
        </p>

        <div>
          <label className={labelCls}>{M.userLabelFullName}</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            <input
              {...register('name')}
              placeholder={M.userPlaceholderName}
              className={`${inputCls} pl-10`}
              autoComplete="off"
            />
          </div>
          {errors.name && <span className={errorCls}>{errors.name.message}</span>}
        </div>

        <div>
          <label className={labelCls}>{M.userLabelEmail}</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            <input
              {...register('email')}
              type="email"
              placeholder={M.userPlaceholderEmail}
              className={`${inputCls} pl-10`}
              autoComplete="off"
            />
          </div>
          {errors.email && <span className={errorCls}>{errors.email.message}</span>}
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
          {M.userSectionSetPassword}
        </p>

        <div>
          <label className={labelCls}>{M.userLabelPassword}</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={M.userPlaceholderPassword}
              className={`${inputCls} pr-11`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              aria-label={showPassword ? M.userHidePasswordAriaLabel : M.userShowPasswordAriaLabel}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className={errorCls}>{errors.password.message}</span>}
        </div>

        <div>
          <label className={labelCls}>{M.userLabelConfirmPassword}</label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              placeholder={M.userPlaceholderConfirmPassword}
              className={`${inputCls} pr-11`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              aria-label={showConfirm ? M.userHidePasswordAriaLabel : M.userShowPasswordAriaLabel}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className={errorCls}>{errors.confirmPassword.message}</span>
          )}
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-[#EEF0FF] rounded-xl border border-[#C7D2FE]">
        <Info size={16} className="text-[#020887] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#374151] leading-relaxed">{M.userAddAdminBanner}</p>
      </div>

      <div className="h-2" />
    </form>
  );
}

// ── Edit User Form ────────────────────────────────────────────
function EditForm({
  user,
  onClose,
  onSaved,
}: {
  user: UserData;
  onClose: () => void;
  onSaved: (u: AdminApiUser) => void;
}) {
  const updateUser = useAdminUpdateUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: { role: user.role, status: user.status },
  });

  const roleValue = watch('role');
  const statusValue = watch('status');
  const avatarIndex = user.name.charCodeAt(0) % AVATAR_COLORS.length;

  const onSubmit = (data: EditFormData) => {
    updateUser.mutate(
      { id: user.id, role: data.role, status: data.status },
      { onSuccess: (updated) => { onSaved(updated); onClose(); } },
    );
  };

  return (
    <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
      {/* Profile card (read-only) */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF] mb-4">
          {M.userSectionProfile}
        </p>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-[17px] font-bold"
            style={{
              backgroundColor: AVATAR_COLORS[avatarIndex],
              color: AVATAR_TEXT[avatarIndex],
            }}
          >
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-[16px] font-bold text-[#0D0F2B] truncate">{user.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail size={13} className="text-[#9CA3AF] shrink-0" />
              <p className="text-[13px] text-[#6B7280] truncate">{user.email}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CalendarDays size={13} className="text-[#9CA3AF] shrink-0" />
              <p className="text-[13px] text-[#6B7280]">
                {M.userJoinedPrefix} {user.joined}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editable settings */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
          {M.userSectionSettings}
        </p>

        <div>
          <label className={labelCls}>{M.userLabelRole}</label>
          <div className="relative">
            <select {...register('role')} className={selectCls}>
              <option value="GUEST">{M.userRoleGuestOption}</option>
              <option value="ADMIN">{M.userRoleAdminOption}</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
          <span className="block text-[12px] text-[#9CA3AF] mt-1.5">
            {roleValue === 'ADMIN' ? M.userRoleHintAdmin : M.userRoleHintGuest}
          </span>
          {errors.role && <span className={errorCls}>{errors.role.message}</span>}
        </div>

        <div>
          <label className={labelCls}>{M.userLabelAccountStatus}</label>
          <div className="relative">
            <select {...register('status')} className={selectCls}>
              <option value="Active">{M.statusActive}</option>
              <option value="Inactive">{M.statusInactive}</option>
              <option value="Suspended">{M.statusSuspended}</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>
          <span className="block text-[12px] text-[#9CA3AF] mt-1.5">
            {statusValue === 'Inactive'
              ? M.userStatusHintInactive
              : statusValue === 'Suspended'
              ? M.userStatusHintSuspended
              : M.userStatusHintActive}
          </span>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 px-4 py-3.5 bg-[#FFFBEB] rounded-xl border border-[#FDE68A]">
        <ShieldCheck size={16} className="text-[#B45309] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#374151] leading-relaxed">{M.userEditNote}</p>
      </div>

      <div className="h-2" />
    </form>
  );
}

// ── Main Modal — rendered via createPortal so it always covers the full screen ──
export function UserFormModal({ user, onClose, onSaved }: UserFormModalProps) {
  const isEdit = !!user;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const createUser = useAdminCreateUser();
  const updateUser = useAdminUpdateUser();
  const isSaving = createUser.isPending || updateUser.isPending;

  const panel = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? M.userFormEditTitle : M.userFormAddTitle}
        className="fixed top-0 right-0 z-[101] h-full w-full sm:w-[500px] bg-[#F8FAFC] shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between px-7 py-6 bg-white border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-[20px] font-bold text-[#0D0F2B] leading-tight">
              {isEdit ? M.userFormEditTitle : M.userFormAddTitle}
            </h2>
            <p className="text-[14px] text-[#6B7280] mt-1">
              {isEdit ? M.userFormEditSubtitle : M.userFormAddSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] transition-colors shrink-0 ml-4"
            aria-label={M.closeAriaLabel}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        {isEdit ? (
          <EditForm user={user} onClose={onClose} onSaved={onSaved} />
        ) : (
          <AddForm onClose={onClose} onSaved={onSaved} />
        )}

        {/* Footer — always visible at the bottom, never scrolls away */}
        <div className="shrink-0 px-7 py-4 border-t border-[#E5E7EB] bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 px-5 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
          >
            {M.cancel}
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={isSaving}
            className="h-10 px-7 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            {isSaving
              ? 'Saving...'
              : isEdit
              ? M.saveChanges
              : M.userSubmitCreateAdmin}
          </button>
        </div>
      </div>
    </>
  );

  if (!mounted) return null;
  return createPortal(panel, document.body);
}
