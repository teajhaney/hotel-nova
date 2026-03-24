'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { isAxiosError } from 'axios';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import {
  SIGNUP_MESSAGES,
  VALIDATION_MESSAGES,
  ROUTES,
} from '@/constants/messages';
import { useSignup } from '@/hooks/use-auth';

const guestSignupSchema = z
  .object({
    name: z
      .string()
      .min(2, VALIDATION_MESSAGES.name.minLength)
      .max(80, VALIDATION_MESSAGES.name.maxLength),
    email: z
      .email(VALIDATION_MESSAGES.email.invalid)
      .min(1, VALIDATION_MESSAGES.email.required),
    password: z.string().min(6, VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z
      .string()
      .min(6, VALIDATION_MESSAGES.confirmPassword.required),
    terms: z
      .boolean()
      .refine(v => v === true, { message: VALIDATION_MESSAGES.terms.required }),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: VALIDATION_MESSAGES.confirmPassword.mismatch,
    path: ['confirmPassword'],
  });

type GuestSignupValues = z.infer<typeof guestSignupSchema>;

export function GuestSignupForm() {
  const { mutateAsync: signup } = useSignup();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GuestSignupValues>({ resolver: zodResolver(guestSignupSchema) });

  const onSubmit = async (data: GuestSignupValues) => {
    try {
      await signup({
        fullName: data.name,
        email: data.email,
        password: data.password,
        role: 'GUEST',
      });
    } catch (err) {
      const message =
        isAxiosError(err) && typeof err.response?.data?.error?.message === 'string'
          ? err.response.data.error.message
          : 'Something went wrong. Please try again.';
      setError('email', { message });
    }
  };

  return (
    <form
      id="signup-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="signup-form"
    >
      <FormInput
        id="guest-signup-name"
        label={SIGNUP_MESSAGES.nameLabel}
        type="text"
        autoComplete="name"
        placeholder={SIGNUP_MESSAGES.namePlaceholder}
        error={errors.name}
        {...register('name')}
      />

      <FormInput
        id="guest-signup-email"
        label={SIGNUP_MESSAGES.emailLabel}
        type="email"
        autoComplete="email"
        placeholder={SIGNUP_MESSAGES.guestEmailPlaceholder}
        error={errors.email}
        {...register('email')}
      />

      {/* Password + Confirm side-by-side */}
      <div className="password-grid">
        <PasswordInput
          id="guest-signup-password"
          label={SIGNUP_MESSAGES.passwordLabel}
          autoComplete="new-password"
          placeholder={SIGNUP_MESSAGES.passwordPlaceholder}
          error={errors.password}
          {...register('password')}
        />
        <PasswordInput
          id="guest-signup-confirm"
          label={SIGNUP_MESSAGES.confirmPasswordLabel}
          autoComplete="new-password"
          placeholder={SIGNUP_MESSAGES.passwordPlaceholder}
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </div>

      {/* Terms */}
      <div className="form-field">
        <div className="flex items-start gap-3">
          <input
            id="guest-signup-terms"
            type="checkbox"
            aria-describedby={
              errors.terms ? 'guest-signup-terms-error' : undefined
            }
            aria-invalid={!!errors.terms}
            className="terms-checkbox"
            {...register('terms')}
          />
          <label htmlFor="guest-signup-terms" className="terms-label">
            {SIGNUP_MESSAGES.termsPrefix}{' '}
            <Link href={ROUTES.terms} className="auth-link">
              {SIGNUP_MESSAGES.termsLink}
            </Link>{' '}
            {SIGNUP_MESSAGES.termsAnd}{' '}
            <Link href={ROUTES.privacy} className="auth-link">
              {SIGNUP_MESSAGES.privacyLink}
            </Link>
            .
          </label>
        </div>
        {errors.terms && (
          <p
            id="guest-signup-terms-error"
            role="alert"
            className="field-error-text pl-7"
          >
            {errors.terms.message}
          </p>
        )}
      </div>

      <button
        id="guest-signup-submit"
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-1 flex items-center justify-center gap-2 cursor-pointer"
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
  );
}
