'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { LOGIN_MESSAGES, VALIDATION_MESSAGES, ROUTES } from '@/constants/messages';

const guestLoginSchema = z.object({
  email: z
    .email(VALIDATION_MESSAGES.email.invalid)
    .min(1, VALIDATION_MESSAGES.email.required),
  password: z.string().min(6, VALIDATION_MESSAGES.password.minLength),
});

type GuestLoginValues = z.infer<typeof guestLoginSchema>;

export function GuestLoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestLoginValues>({ resolver: zodResolver(guestLoginSchema) });

  const onSubmit = async (data: GuestLoginValues) => {
    /** TODO: POST /api/auth/login { role: 'GUEST' } */
    console.log('[GuestLogin]', { role: 'GUEST', ...data });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to homepage
    router.push(ROUTES.home);
  };

  return (
    <form id="login-form" onSubmit={handleSubmit(onSubmit)} noValidate className="login-form">
      <FormInput
        id="guest-login-email"
        label={LOGIN_MESSAGES.emailLabel}
        type="email"
        autoComplete="email"
        placeholder={LOGIN_MESSAGES.guestEmailPlaceholder}
        error={errors.email}
        {...register('email')}
      />

      <PasswordInput
        id="guest-login-password"
        label={LOGIN_MESSAGES.passwordLabel}
        autoComplete="current-password"
        placeholder={LOGIN_MESSAGES.passwordPlaceholder}
        error={errors.password}
        labelSuffix={
          <Link href={ROUTES.forgotPassword} className="auth-link text-[14px]">
            {LOGIN_MESSAGES.forgotPassword}
          </Link>
        }
        {...register('password')}
      />

      <button id="guest-login-submit" type="submit" disabled={isSubmitting} className="btn-primary mt-1 cursor-pointer">
        {isSubmitting ? LOGIN_MESSAGES.submittingButton : LOGIN_MESSAGES.submitButton}
      </button>
    </form>
  );
}
