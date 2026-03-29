'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { LOGIN_MESSAGES, VALIDATION_MESSAGES } from '@/constants/messages';
import Link from 'next/link';
import { HotelNovaLogo } from '@/components/auth/HotelNovaLogo';
import { useLogin } from '@/hooks/use-auth';
import { extractApiError } from '@/lib/api-error';

const adminLoginSchema = z.object({
  email: z
    .string()
    .email(VALIDATION_MESSAGES.email.invalid)
    .min(1, VALIDATION_MESSAGES.email.required),
  password: z.string().min(6, VALIDATION_MESSAGES.password.minLength),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const { mutateAsync: login } = useLogin('ADMIN');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({ resolver: zodResolver(adminLoginSchema) });

  const onSubmit = async (data: AdminLoginValues) => {
    try {
      await login(data);
    } catch (err) {
      const message = extractApiError(err, 'Invalid email or password.');
      setError('password', { message });
    }
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

        <p className="text-center text-[14px] text-[#6B7280] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/admin/signup" className="text-[#020887] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
