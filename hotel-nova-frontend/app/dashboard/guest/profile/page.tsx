'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { useAuthStore } from '@/stores/auth-store';
import { useUpdateProfile, useDeleteAccount } from '@/hooks/use-profile';

// ── Schemas ───────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  phone:     z.string().optional(),
  country:   z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword:    z.string().min(6, 'Required'),
    newPassword:        z.string().min(8, 'Min 8 characters'),
    confirmNewPassword: z.string().min(8, 'Required'),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

type ProfileForm  = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const LANGUAGES  = ['English (US)', 'French', 'Spanish', 'German', 'Arabic'];
const CURRENCIES = ['NGN (₦)', 'USD ($)', 'EUR (€)', 'GBP (£)'];

// ── Delete Confirmation Portal ────────────────────────────────────────────────
function DeleteAccountModal({
  onClose,
  onConfirm,
  isDeleting,
}: {
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const modal = (
    <>
      <div className="fixed inset-0 z-[100] bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 pointer-events-auto">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={22} className="text-[#EF4444]" />
          </div>
          <h2 className="text-[17px] font-bold text-[#0D0F2B] text-center">
            Delete Your Account?
          </h2>
          <p className="text-[14px] text-[#6B7280] mt-2 leading-relaxed text-center">
            This will permanently delete your account and all your booking history. This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 h-10 rounded-lg border border-[#D1D5DB] text-[13px] font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 h-10 rounded-lg bg-[#EF4444] text-white text-[13px] font-semibold hover:bg-[#DC2626] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting && <Loader2 size={13} className="animate-spin" />}
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfileSettingsPage() {
  const router      = useRouter();
  const user        = useAuthStore((s) => s.user);
  const setUser     = useAuthStore((s) => s.setUser);
  const clearUser   = useAuthStore((s) => s.clearUser);

  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();

  const [emailNotif,     setEmailNotif]     = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Split fullName into first / last for the form fields
  const nameParts = (user?.fullName ?? '').trim().split(' ');
  const firstName = nameParts[0] ?? '';
  const lastName  = nameParts.slice(1).join(' ');

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName,
      lastName,
      phone:   user?.phone   ?? '',
      country: user?.country ?? '',
    },
  });

  // Re-seed the form whenever the user object changes (e.g. after a save)
  useEffect(() => {
    if (!user) return;
    const parts = user.fullName.trim().split(' ');
    profileForm.reset({
      firstName: parts[0] ?? '',
      lastName:  parts.slice(1).join(' '),
      phone:   user.phone   ?? '',
      country: user.country ?? '',
    });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  function onProfileSave(data: ProfileForm) {
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    updateProfile.mutate(
      { fullName, phone: data.phone, country: data.country },
      {
        onSuccess: (updated) => {
          // Keep the auth store in sync so the header/avatar updates immediately
          setUser({ ...user!, ...updated });
          toast.success('Profile saved successfully.');
        },
      },
    );
  }

  function onPasswordSave(data: PasswordForm) {
    updateProfile.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          passwordForm.reset();
          toast.success('Password updated successfully.');
        },
      },
    );
  }

  function handleDeleteConfirm() {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        clearUser();
        router.push('/');
      },
    });
  }

  // ── Avatar initials ────────────────────────────────────────────────────────
  const initials = (user?.fullName ?? 'G')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="guest-page-container pb-24 lg:pb-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#0D0F2B]">
          {GUEST_DASHBOARD_MESSAGES.profileTitle}
        </h1>
        <button
          onClick={profileForm.handleSubmit(onProfileSave)}
          disabled={updateProfile.isPending}
          className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors disabled:opacity-60"
        >
          {updateProfile.isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {updateProfile.isPending ? 'Saving...' : GUEST_DASHBOARD_MESSAGES.saveChanges}
        </button>
      </div>

      {/* ── Avatar Card ─────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 mb-5 flex items-center gap-5">
        {/* Initials avatar — no photo upload yet */}
        <div className="w-20 h-20 rounded-full bg-[#020887] flex items-center justify-center shrink-0">
          <span className="text-white text-[28px] font-bold">{initials}</span>
        </div>
        <div>
          <p className="text-[20px] font-bold text-[#0D0F2B]">
            {profileForm.watch('firstName')} {profileForm.watch('lastName')}
          </p>
          <p className="text-[13px] text-[#64748B] mb-2">{user?.email ?? '—'}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.06em] bg-[#FEF3C7] text-[#92400E]">
              {GUEST_DASHBOARD_MESSAGES.memberBadge}
            </span>
            {joinedDate && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#64748B] border border-[#E2E8F0]">
                Joined {joinedDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* ── Left: forms ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <h2 className="text-[16px] font-bold text-[#0D0F2B] mb-5">
              {GUEST_DASHBOARD_MESSAGES.personalInfo}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.firstNameLabel}</label>
                  <input
                    {...profileForm.register('firstName')}
                    className={`field-input ${profileForm.formState.errors.firstName ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="field-error-text">{profileForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.lastNameLabel}</label>
                  <input
                    {...profileForm.register('lastName')}
                    className={`field-input ${profileForm.formState.errors.lastName ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="field-error-text">{profileForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email is read-only — changing it requires email verification */}
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.emailLabel}</label>
                  <input
                    value={user?.email ?? ''}
                    readOnly
                    className="field-input field-input-valid bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.phoneLabel}</label>
                  <input
                    {...profileForm.register('phone')}
                    placeholder="+234 800 000 0000"
                    className={`field-input ${profileForm.formState.errors.phone ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  {profileForm.formState.errors.phone && (
                    <p className="field-error-text">{profileForm.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">Country</label>
                <input
                  {...profileForm.register('country')}
                  placeholder="e.g. Nigeria"
                  className="field-input field-input-valid"
                />
              </div>
            </div>
          </div>

          {/* Update Password */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <h2 className="text-[16px] font-bold text-[#0D0F2B] mb-5">
              {GUEST_DASHBOARD_MESSAGES.updatePassword}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="form-field">
                <label className="field-label">{GUEST_DASHBOARD_MESSAGES.currentPasswordLabel}</label>
                <input
                  {...passwordForm.register('currentPassword')}
                  type="password"
                  autoComplete="off"
                  className={`field-input ${passwordForm.formState.errors.currentPassword ? 'field-input-error' : 'field-input-valid'}`}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="field-error-text">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.newPasswordLabel}</label>
                  <input
                    {...passwordForm.register('newPassword')}
                    type="password"
                    autoComplete="new-password"
                    className={`field-input ${passwordForm.formState.errors.newPassword ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="field-error-text">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.confirmNewPasswordLabel}</label>
                  <input
                    {...passwordForm.register('confirmNewPassword')}
                    type="password"
                    autoComplete="new-password"
                    className={`field-input ${passwordForm.formState.errors.confirmNewPassword ? 'field-input-error' : 'field-input-valid'}`}
                  />
                  {passwordForm.formState.errors.confirmNewPassword && (
                    <p className="field-error-text">{passwordForm.formState.errors.confirmNewPassword.message}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={passwordForm.handleSubmit(onPasswordSave)}
                  disabled={updateProfile.isPending}
                  className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors disabled:opacity-60"
                >
                  {updateProfile.isPending && <Loader2 size={14} className="animate-spin" />}
                  {updateProfile.isPending ? 'Updating...' : GUEST_DASHBOARD_MESSAGES.updatePassword}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: preferences + danger ──────────────────── */}
        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-5">
          {/* Preferences */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <h3 className="text-[15px] font-bold text-[#0D0F2B] mb-4">
              {GUEST_DASHBOARD_MESSAGES.preferencesTitle}
            </h3>
            <div className="flex flex-col gap-4">
              {/* Email Notifications toggle */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-medium text-[#0D0F2B]">
                    {GUEST_DASHBOARD_MESSAGES.emailNotifications}
                  </p>
                  <p className="text-[12px] text-[#64748B]">
                    {GUEST_DASHBOARD_MESSAGES.emailNotificationsDesc}
                  </p>
                </div>
                <button
                  onClick={() => setEmailNotif((v) => !v)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${emailNotif ? 'bg-[#020887]' : 'bg-[#CBD5E1]'}`}
                  role="switch"
                  aria-checked={emailNotif}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${emailNotif ? 'left-[22px]' : 'left-0.5'}`}
                  />
                </button>
              </div>
              {/* Marketing Emails toggle */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-medium text-[#0D0F2B]">
                    {GUEST_DASHBOARD_MESSAGES.marketingEmails}
                  </p>
                  <p className="text-[12px] text-[#64748B]">
                    {GUEST_DASHBOARD_MESSAGES.marketingEmailsDesc}
                  </p>
                </div>
                <button
                  onClick={() => setMarketingEmails((v) => !v)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${marketingEmails ? 'bg-[#020887]' : 'bg-[#CBD5E1]'}`}
                  role="switch"
                  aria-checked={marketingEmails}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${marketingEmails ? 'left-[22px]' : 'left-0.5'}`}
                  />
                </button>
              </div>
              {/* Language */}
              <div className="form-field">
                <label className="field-label">{GUEST_DASHBOARD_MESSAGES.languageLabel}</label>
                <select className="field-input field-input-valid">
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              {/* Currency */}
              <div className="form-field">
                <label className="field-label">{GUEST_DASHBOARD_MESSAGES.currencyLabel}</label>
                <select className="field-input field-input-valid">
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#FEF2F2] rounded-lg border border-[#FCA5A5] p-5">
            <p className="text-[15px] font-bold text-[#EF4444] mb-1">
              {GUEST_DASHBOARD_MESSAGES.dangerZone}
            </p>
            <p className="text-[13px] text-[#64748B] mb-4">
              {GUEST_DASHBOARD_MESSAGES.dangerZoneDesc}
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#EF4444] hover:text-[#DC2626] transition-colors"
            >
              {GUEST_DASHBOARD_MESSAGES.deleteAccount}
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Account Confirmation ──────────────────────── */}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          isDeleting={deleteAccount.isPending}
        />
      )}
    </div>
  );
}
