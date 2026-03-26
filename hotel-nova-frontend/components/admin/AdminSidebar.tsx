'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Users,
  Star,
  Tag,
  Settings,
  Bell,
  LogOut,
  X,
} from 'lucide-react';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { useUnreadCount } from '@/hooks/use-notifications';

const M = ADMIN_DASHBOARD_MESSAGES;

const NAV_ITEMS = [
  { href: '/admin/overview', label: M.navOverview, icon: LayoutDashboard, exact: true },
  { href: '/admin/rooms', label: M.navManageRooms, icon: BedDouble, exact: false },
  { href: '/admin/bookings', label: M.navAllBookings, icon: CalendarDays, exact: false },
  { href: '/admin/users', label: M.navUsers, icon: Users, exact: false },
  { href: '/admin/reviews', label: M.navReviews, icon: Star, exact: false },
  { href: '/admin/promo-codes', label: M.navPromoCodes, icon: Tag, exact: false },
  { href: '/admin/settings', label: M.navSettings, icon: Settings, exact: false },
  { href: '/admin/notifications', label: M.navNotifications, icon: Bell, exact: false, badge: true },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count ?? 0;

  // Build initials from the user's full name (e.g. "John Doe" → "JD")
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
      {/* Logo area */}
      <div className="px-5 py-5 h-14 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#020887] flex items-center justify-center shrink-0">
            <LayoutDashboard size={20} color="white" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-[#0D0F2B] leading-tight tracking-wide uppercase truncate">
              {M.hotelName}
            </p>
            <p className="text-[11px] text-[#64748B]">{M.adminDashboardLabel}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] shrink-0"
            aria-label={M.closeMenuAriaLabel}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-4 flex flex-col gap-1"
        aria-label={M.adminNavAriaLabel}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact, badge }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`admin-nav-item flex items-center ${isActive ? 'admin-nav-item-active' : 'admin-nav-item-inactive'}`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{label}</span>
              {badge && unreadCount > 0 && (
                <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-[#EF4444] text-white text-[11px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin profile + logout */}
      <div className="px-4 pb-5 border-t border-[#E2E8F0] pt-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#020887] flex items-center justify-center shrink-0">
            <span className="text-white text-[13px] font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#0D0F2B] leading-tight truncate">
              {user?.fullName ?? M.adminName}
            </p>
            <p className="text-[11px] text-[#64748B] truncate">{M.adminRole}</p>
          </div>
          <button
            onClick={() => logout()}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#EF4444] hover:bg-[#FEF2F2] transition-colors"
            aria-label={M.logoutAriaLabel}
          >
            <LogOut size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
