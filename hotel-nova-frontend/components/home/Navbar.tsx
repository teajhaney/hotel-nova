'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { HotelNovaLogo } from '@/components/auth/HotelNovaLogo';
import { NAV_LINKS } from '@/constants/dummyData';
import { useAuthStore } from '@/stores/auth-store';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  // Point logged-in users to their role-appropriate dashboard
  const dashboardHref =
    user?.role === 'ADMIN' ? '/admin/overview' : '/dashboard/guest';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
      <nav
        className="page-container flex items-center justify-between h-[72px]"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="logo-link" aria-label="HotelNova — go to homepage">
          <HotelNovaLogo />
          <span className="logo-text">HotelNova</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-[32px] list-none m-0 p-0" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="nav-item-link">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-[12px]">
          {/* Desktop CTA — Dashboard if logged in, otherwise Sign In */}
          <Link
            href={user ? dashboardHref : '/login'}
            className="hidden lg:inline-flex items-center justify-center
                       px-[24px] py-[10px] min-h-[44px] rounded-[999px]
                       bg-[#020887] text-white
                       text-[14px] font-semibold tracking-[0.04em]
                       hover:bg-[#38369A] transition-colors duration-150"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </Link>

          {/* Mobile CTA */}
          <Link
            href={user ? dashboardHref : '/login'}
            className="lg:hidden inline-flex items-center justify-center
                       px-[14px] py-[8px] min-h-[36px] rounded-[999px]
                       bg-[#020887] text-white text-[13px] font-medium tracking-[0.04em]
                       hover:bg-[#38369A] transition-colors duration-150"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden p-[8px] text-[#0D0F2B] hover:text-[#020887] transition-colors rounded-[4px]"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className="block transition-transform duration-300" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-[#E2E8F0] shadow-[0_4px_16px_rgba(0,0,0,0.08)] animate-slide-down">
          <ul className="page-container py-[12px] flex flex-col gap-[2px] list-none m-0 p-y-[12px]" role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block py-[12px] px-[12px] text-[16px] font-medium text-[#0D0F2B]
                             hover:text-[#020887] hover:bg-[#F8FAFC] rounded-[4px] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
