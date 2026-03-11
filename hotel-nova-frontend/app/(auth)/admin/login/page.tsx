'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import {
  LOGIN_MESSAGES,
  VALIDATION_MESSAGES,
  ROUTES,
} from '@/constants/messages';
import { HotelNovaLogo } from '@/components/auth/HotelNovaLogo';

const adminLoginSchema = z.object({
  email: z
    .string()
    .email(VALIDATION_MESSAGES.email.invalid)
    .min(1, VALIDATION_MESSAGES.email.required),
  password: z.string().min(6, VALIDATION_MESSAGES.password.minLength),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({ resolver: zodResolver(adminLoginSchema) });

  const onSubmit = async (data: AdminLoginValues) => {
    /** TODO: POST /api/auth/login { role: 'ADMIN' } → router.push(ROUTES.adminOverview) */
    console.log('[AdminLogin]', { role: 'ADMIN', ...data });
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <HotelNovaLogo />
          <h1 className="admin-auth-title">
            HotelNova Admin
          </h1>
          <p className="admin-auth-subtitle">
            Sign in to the management portal
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <FormInput
            id="admin-login-email"
            label={LOGIN_MESSAGES.emailLabel}
            type="email"
            autoComplete="email"
            placeholder={LOGIN_MESSAGES.adminEmailPlaceholder}
            error={errors.email}
            {...register('email')}
          />

          <PasswordInput
            id="admin-login-password"
            label={LOGIN_MESSAGES.passwordLabel}
            autoComplete="current-password"
            placeholder={LOGIN_MESSAGES.passwordPlaceholder}
            error={errors.password}
            {...register('password')}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-2"
          >
            {isSubmitting
              ? LOGIN_MESSAGES.submittingButton
              : LOGIN_MESSAGES.submitButton}
          </button>
        </form>
      </div>
    </div>
  );
}
