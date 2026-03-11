'use client';

import Link from 'next/link';
import { HotelNovaLogo } from '@/components/auth/HotelNovaLogo';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { GuestSignupForm } from './GuestSignupForm';
import { SIGNUP_MESSAGES, BRAND, ROUTES } from '@/constants/messages';

export default function SignupPage() {
  return (
    <div className="auth-page-shell">
      <a href="#signup-main" className="skip-nav">
        {SIGNUP_MESSAGES.skipNav}
      </a>

      <main id="signup-main" className="auth-left-panel">
        {/* Logo */}
        <div className="mb-10">
          <Link href={ROUTES.home} aria-label={BRAND.logoAriaLabel} className="logo-link">
            <HotelNovaLogo />
            <span className="logo-text">{BRAND.name}</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="auth-heading">{SIGNUP_MESSAGES.title}</h1>
          <p className="auth-subheading">{SIGNUP_MESSAGES.subtitle}</p>
        </div>

        {/* Form */}
        <GuestSignupForm />

        {/* Sign in link */}
        <p className="mt-6 auth-switch-text">
          {SIGNUP_MESSAGES.hasAccount}{' '}
          <Link href={ROUTES.login} className="auth-link">
            {SIGNUP_MESSAGES.signIn}
          </Link>
        </p>
      </main>

      <AuthRightPanel variant="signup" />
    </div>
  );
}
