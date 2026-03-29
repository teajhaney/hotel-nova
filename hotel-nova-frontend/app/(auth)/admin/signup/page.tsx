'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { SIGNUP_MESSAGES, VALIDATION_MESSAGES } from '@/constants/messages';
import Link from 'next/link';
import { HotelNovaLogo } from '@/components/auth/HotelNovaLogo';
import { useSignup } from '@/hooks/use-auth';
import { extractApiError } from '@/lib/api-error';

const adminSignupSchema = z
  .object({
    name: z
      .string()
      .min(2, VALIDATION_MESSAGES.name.minLength)
      .max(80, VALIDATION_MESSAGES.name.maxLength),
    email: z
      .string()
      .email(VALIDATION_MESSAGES.email.invalid)
      .min(1, VALIDATION_MESSAGES.email.required),
    password: z.string().min(8, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z
      .string()
      .min(1, VALIDATION_MESSAGES.confirmPassword.required),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: VALIDATION_MESSAGES.confirmPassword.mismatch,
    path: ['confirmPassword'],
  });

type AdminSignupValues = z.infer<typeof adminSignupSchema>;

export default function AdminSignupPage() {
  const { mutateAsync: signup } = useSignup();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminSignupValues>({ resolver: zodResolver(adminSignupSchema) });

  const onSubmit = async (data: AdminSignupValues) => {
    try {
      await signup({
        fullName: data.name,
        email: data.email,
        password: data.password,
        role: 'ADMIN',
      });
    } catch (err) {
      const message = extractApiError(err);
      setError('email', { message });
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <HotelNovaLogo />
          <h1 className="admin-auth-title">HotelNova Admin</h1>
          <p className="admin-auth-subtitle">Create a new management account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <FormInput
            id="admin-signup-name"
            label={SIGNUP_MESSAGES.nameLabel}
            type="text"
            autoComplete="name"
            placeholder={SIGNUP_MESSAGES.namePlaceholder}
            error={errors.name}
            {...register('name')}
          />

          <FormInput
            id="admin-signup-email"
            label={SIGNUP_MESSAGES.adminEmailLabel}
            type="email"
            autoComplete="email"
            placeholder={SIGNUP_MESSAGES.adminEmailPlaceholder}
            error={errors.email}
            {...register('email')}
          />

          <PasswordInput
            id="admin-signup-password"
            label={SIGNUP_MESSAGES.passwordLabel}
            autoComplete="new-password"
            placeholder={SIGNUP_MESSAGES.passwordPlaceholder}
            error={errors.password}
            {...register('password')}
          />

          <PasswordInput
            id="admin-signup-confirm"
            label={SIGNUP_MESSAGES.confirmPasswordLabel}
            autoComplete="new-password"
            placeholder={SIGNUP_MESSAGES.passwordPlaceholder}
            error={errors.confirmPassword}
            {...register('confirmPassword')}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-4 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              SIGNUP_MESSAGES.submittingButton
            ) : (
              <>
                {SIGNUP_MESSAGES.submitButton}
                <ArrowRight size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[14px] text-[#6B7280] mt-6">
          Already have an account?{' '}
          <Link href="/admin/login" className="text-[#020887] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
