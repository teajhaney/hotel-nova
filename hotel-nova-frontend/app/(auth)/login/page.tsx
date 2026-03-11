'use client';

import Link from 'next/link';
import { HotelNovaLogo } from '@/components/auth/HotelNovaLogo';
import { AuthRightPanel } from '@/components/auth/AuthRightPanel';
import { GuestLoginForm } from './GuestLoginForm';
import { LOGIN_MESSAGES, BRAND, ROUTES } from '@/constants/messages';

export default function LoginPage() {
  return (
    <div className="auth-page-shell">
      <a href="#login-main" className="skip-nav">
        {LOGIN_MESSAGES.skipNav}
      </a>

      <main id="login-main" className="auth-left-panel">
        {/* Logo */}
        <div className="mb-12">
          <Link href={ROUTES.home} aria-label={BRAND.logoAriaLabel} className="logo-link">
            <HotelNovaLogo />
            <span className="logo-text">{BRAND.name}</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="auth-heading">{LOGIN_MESSAGES.title}</h1>
          <p className="auth-subheading">{LOGIN_MESSAGES.subtitle}</p>
        </div>

        {/* Form */}
        <GuestLoginForm />

        {/* Sign up link */}
        <p className="mt-8 auth-switch-text">
          {LOGIN_MESSAGES.noAccount}{' '}
          <Link href={ROUTES.signup} className="auth-link">
            {LOGIN_MESSAGES.createAccount}
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-auto pt-12 text-[12px] text-[#94A3B8]">{BRAND.footerCopy}</p>
      </main>

      <AuthRightPanel variant="login" />
    </div>
  );
}
