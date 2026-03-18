'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Save } from 'lucide-react';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { HOME_IMAGES } from '@/constants/images';

const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Required'),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Required'),
  newPassword: z.string().min(8, 'Min 8 characters'),
  confirmNewPassword: z.string().min(8, 'Required'),
}).refine(d => d.newPassword === d.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const LANGUAGES = ['English (US)', 'French', 'Spanish', 'German', 'Arabic'];
const CURRENCIES = ['NGN (₦)', 'USD ($)', 'EUR (€)', 'GBP (£)'];

export default function ProfileSettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Guest', lastName: 'User',
      email: 'guest@grandoasis.com', phone: '+234 800 000 0000',
      bio: '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  function onProfileSave(data: ProfileForm) {
    console.log('Profile saved:', data);
  }

  function onPasswordSave(data: PasswordForm) {
    console.log('Password updated:', data);
  }

  return (
    <div className="guest-page-container pb-24 lg:pb-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#0D0F2B]">{GUEST_DASHBOARD_MESSAGES.profileTitle}</h1>
        <button
          onClick={profileForm.handleSubmit(onProfileSave)}
          className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors"
        >
          <Save size={14} />
          {GUEST_DASHBOARD_MESSAGES.saveChanges}
        </button>
      </div>

      {/* ── Avatar Card ─────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 mb-5 flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#E2E8F0]">
            <Image src={HOME_IMAGES.amenities.spa} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
          </div>
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#020887] rounded-full flex items-center justify-center hover:bg-[#38369A] transition-colors">
            <Camera size={13} className="text-white" />
          </button>
        </div>
        <div>
          <p className="text-[20px] font-bold text-[#0D0F2B]">{profileForm.watch('firstName')} {profileForm.watch('lastName')}</p>
          <p className="text-[13px] text-[#64748B] mb-2">{profileForm.watch('email')}</p>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.06em] bg-[#FEF3C7] text-[#92400E]">
              {GUEST_DASHBOARD_MESSAGES.memberBadge}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#64748B] border border-[#E2E8F0]">
              {GUEST_DASHBOARD_MESSAGES.joinedLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* ── Left: forms ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <h2 className="text-[16px] font-bold text-[#0D0F2B] mb-5">{GUEST_DASHBOARD_MESSAGES.personalInfo}</h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.firstNameLabel}</label>
                  <input {...profileForm.register('firstName')} className={`field-input ${profileForm.formState.errors.firstName ? 'field-input-error' : 'field-input-valid'}`} />
                  {profileForm.formState.errors.firstName && <p className="field-error-text">{profileForm.formState.errors.firstName.message}</p>}
                </div>
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.lastNameLabel}</label>
                  <input {...profileForm.register('lastName')} className={`field-input ${profileForm.formState.errors.lastName ? 'field-input-error' : 'field-input-valid'}`} />
                  {profileForm.formState.errors.lastName && <p className="field-error-text">{profileForm.formState.errors.lastName.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.emailLabel}</label>
                  <input {...profileForm.register('email')} type="email" className={`field-input ${profileForm.formState.errors.email ? 'field-input-error' : 'field-input-valid'}`} />
                  {profileForm.formState.errors.email && <p className="field-error-text">{profileForm.formState.errors.email.message}</p>}
                </div>
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.phoneLabel}</label>
                  <input {...profileForm.register('phone')} className={`field-input ${profileForm.formState.errors.phone ? 'field-input-error' : 'field-input-valid'}`} />
                  {profileForm.formState.errors.phone && <p className="field-error-text">{profileForm.formState.errors.phone.message}</p>}
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">{GUEST_DASHBOARD_MESSAGES.bioLabel}</label>
                <textarea {...profileForm.register('bio')} rows={3} placeholder={GUEST_DASHBOARD_MESSAGES.bioPlaceholder} className="w-full field-input field-input-valid resize-none h-auto py-3" />
              </div>
            </div>
          </div>

          {/* Update Password */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <h2 className="text-[16px] font-bold text-[#0D0F2B] mb-5">{GUEST_DASHBOARD_MESSAGES.updatePassword}</h2>
            <div className="flex flex-col gap-4">
              <div className="form-field">
                <label className="field-label">{GUEST_DASHBOARD_MESSAGES.currentPasswordLabel}</label>
                <input {...passwordForm.register('currentPassword')} type="password" className={`field-input ${passwordForm.formState.errors.currentPassword ? 'field-input-error' : 'field-input-valid'}`} />
                {passwordForm.formState.errors.currentPassword && <p className="field-error-text">{passwordForm.formState.errors.currentPassword.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.newPasswordLabel}</label>
                  <input {...passwordForm.register('newPassword')} type="password" className={`field-input ${passwordForm.formState.errors.newPassword ? 'field-input-error' : 'field-input-valid'}`} />
                  {passwordForm.formState.errors.newPassword && <p className="field-error-text">{passwordForm.formState.errors.newPassword.message}</p>}
                </div>
                <div className="form-field">
                  <label className="field-label">{GUEST_DASHBOARD_MESSAGES.confirmNewPasswordLabel}</label>
                  <input {...passwordForm.register('confirmNewPassword')} type="password" className={`field-input ${passwordForm.formState.errors.confirmNewPassword ? 'field-input-error' : 'field-input-valid'}`} />
                  {passwordForm.formState.errors.confirmNewPassword && <p className="field-error-text">{passwordForm.formState.errors.confirmNewPassword.message}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={passwordForm.handleSubmit(onPasswordSave)}
                  className="flex items-center gap-2 px-4 h-10 rounded-lg bg-[#020887] text-white text-[13px] font-semibold hover:bg-[#38369A] transition-colors"
                >
                  {GUEST_DASHBOARD_MESSAGES.updatePassword}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: preferences + accounts + danger ────────── */}
        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-5">
          {/* Preferences */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <h3 className="text-[15px] font-bold text-[#0D0F2B] mb-4">{GUEST_DASHBOARD_MESSAGES.preferencesTitle}</h3>
            <div className="flex flex-col gap-4">
              {/* Email Notifications toggle */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-medium text-[#0D0F2B]">{GUEST_DASHBOARD_MESSAGES.emailNotifications}</p>
                  <p className="text-[12px] text-[#64748B]">{GUEST_DASHBOARD_MESSAGES.emailNotificationsDesc}</p>
                </div>
                <button
                  onClick={() => setEmailNotif(v => !v)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${emailNotif ? 'bg-[#020887]' : 'bg-[#CBD5E1]'}`}
                  role="switch" aria-checked={emailNotif}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${emailNotif ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              {/* Marketing Emails toggle */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-medium text-[#0D0F2B]">{GUEST_DASHBOARD_MESSAGES.marketingEmails}</p>
                  <p className="text-[12px] text-[#64748B]">{GUEST_DASHBOARD_MESSAGES.marketingEmailsDesc}</p>
                </div>
                <button
                  onClick={() => setMarketingEmails(v => !v)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${marketingEmails ? 'bg-[#020887]' : 'bg-[#CBD5E1]'}`}
                  role="switch" aria-checked={marketingEmails}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${marketingEmails ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
              {/* Language */}
              <div className="form-field">
                <label className="field-label">{GUEST_DASHBOARD_MESSAGES.languageLabel}</label>
                <select className="field-input field-input-valid">
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              {/* Currency */}
              <div className="form-field">
                <label className="field-label">{GUEST_DASHBOARD_MESSAGES.currencyLabel}</label>
                <select className="field-input field-input-valid">
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Linked Accounts */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
            <h3 className="text-[15px] font-bold text-[#0D0F2B] mb-4">{GUEST_DASHBOARD_MESSAGES.linkedAccounts}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-[13px] font-bold">f</div>
                  <span className="text-[14px] font-medium text-[#0D0F2B]">Facebook</span>
                </div>
                <button className="text-[13px] font-semibold text-[#020887] hover:underline">{GUEST_DASHBOARD_MESSAGES.connectLabel}</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#EA4335] text-[13px] font-bold">G</div>
                  <span className="text-[14px] font-medium text-[#0D0F2B]">Google</span>
                </div>
                <button className="text-[13px] font-semibold text-[#EF4444] hover:underline">{GUEST_DASHBOARD_MESSAGES.disconnectLabel}</button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#FEF2F2] rounded-lg border border-[#FCA5A5] p-5">
            <p className="text-[15px] font-bold text-[#EF4444] mb-1">{GUEST_DASHBOARD_MESSAGES.dangerZone}</p>
            <p className="text-[13px] text-[#64748B] mb-4">{GUEST_DASHBOARD_MESSAGES.dangerZoneDesc}</p>
            <button className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#EF4444] hover:text-[#DC2626] transition-colors">
              {GUEST_DASHBOARD_MESSAGES.deleteAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
