'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarDays, BarChart2, Settings } from 'lucide-react';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';

const M = ADMIN_DASHBOARD_MESSAGES;

const MOBILE_NAV = [
  { href: '/admin/overview', label: M.mobileNavHome, icon: Home },
  { href: '/admin/bookings', label: M.mobileNavBookings, icon: CalendarDays },
  { href: '/admin/analytics', label: M.mobileNavAnalytics, icon: BarChart2 },
  { href: '/admin/settings', label: M.mobileNavSettings, icon: Settings },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] lg:hidden animate-slide-up"
      aria-label={M.mobileNavAriaLabel}
    >
      <div className="flex items-stretch h-16">
        {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#020887]' : 'text-[#64748B] hover:text-[#020887]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="uppercase tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
