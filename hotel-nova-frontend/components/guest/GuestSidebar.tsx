'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  User,
  Star,
  Bell,
  LogOut,
  X,
  LayoutDashboard,
  Search,
} from 'lucide-react';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';

const NAV_ITEMS = [
  {
    href: '/rooms',
    label: 'Browse Rooms',
    icon: Search,
    exact: false,
  },
  {
    href: '/dashboard/guest',
    label: 'My Bookings',
    icon: CalendarDays,
    exact: true,
  },
  {
    href: '/dashboard/guest/profile',
    label: GUEST_DASHBOARD_MESSAGES.profile,
    icon: User,
    exact: false,
  },
  {
    href: '/dashboard/guest/reviews',
    label: GUEST_DASHBOARD_MESSAGES.reviews,
    icon: Star,
    exact: false,
  },
  {
    href: '/dashboard/guest/notifications',
    label: GUEST_DASHBOARD_MESSAGES.notifications,
    icon: Bell,
    exact: false,
    badge: true,
  },
];

interface GuestSidebarProps {
  onClose?: () => void;
}

export function GuestSidebar({ onClose }: GuestSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <div className="flex flex-col w-full h-full">
      {/* Logo + optional close button (mobile) */}
      <div className="px-5 py-5 h-14 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#020887] flex items-center justify-center shrink-0">
            <LayoutDashboard size={20} color="white" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#0D0F2B] leading-tight tracking-wide uppercase truncate">
              {GUEST_DASHBOARD_MESSAGES.hotelName}
            </p>
            <p className="text-[11px] text-[#64748B]">
              {GUEST_DASHBOARD_MESSAGES.dashboardSubtitle}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] shrink-0"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact, badge }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`guest-nav-item ${isActive ? 'guest-nav-item-active' : 'guest-nav-item-inactive'}`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{label}</span>
              {badge && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[#EF4444]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Guest profile + Logout */}
      <div className="px-4 pb-5 border-t border-[#E2E8F0] pt-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#020887] flex items-center justify-center shrink-0">
            <span className="text-white text-[13px] font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#0D0F2B] leading-tight truncate">
              {user?.fullName ?? GUEST_DASHBOARD_MESSAGES.guestName}
            </p>
            <p className="text-[11px] text-[#64748B] truncate">
              {GUEST_DASHBOARD_MESSAGES.guest}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
            aria-label="Logout"
          >
            <LogOut size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
