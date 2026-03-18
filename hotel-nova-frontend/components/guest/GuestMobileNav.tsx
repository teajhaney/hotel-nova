'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarDays, Bell, User } from 'lucide-react';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';

const MOBILE_NAV = [
  { href: '/', label: GUEST_DASHBOARD_MESSAGES.mobileHome, icon: Home },
  { href: '/dashboard/guest/history', label: GUEST_DASHBOARD_MESSAGES.mobileBookings, icon: CalendarDays },
  { href: '/dashboard/guest/notifications', label: GUEST_DASHBOARD_MESSAGES.mobileAlerts, icon: Bell, badge: true },
  { href: '/dashboard/guest/profile', label: GUEST_DASHBOARD_MESSAGES.mobileProfile, icon: User },
];

export function GuestMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] lg:hidden">
      <div className="flex items-stretch h-16">
        {MOBILE_NAV.map(({ href, label, icon: Icon, badge }) => {
          const isActive = href === '/' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-[#020887]' : 'text-[#64748B] hover:text-[#020887]'}`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                {badge && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full" />}
              </div>
              <span className="uppercase tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
