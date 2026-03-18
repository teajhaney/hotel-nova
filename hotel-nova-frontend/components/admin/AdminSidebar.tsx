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
  BarChart2,
  Settings,
  Bell,
  LogOut,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/overview', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/rooms', label: 'Manage Rooms', icon: BedDouble, exact: false },
  { href: '/admin/bookings', label: 'All Bookings', icon: CalendarDays, exact: false },
  { href: '/admin/users', label: 'Users', icon: Users, exact: false },
  { href: '/admin/reviews', label: 'Reviews', icon: Star, exact: false },
  { href: '/admin/promo-codes', label: 'Promo Codes', icon: Tag, exact: false },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2, exact: false },
  { href: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell, exact: false, badge: true },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full h-full">
      {/* Logo area */}
      <div className="px-5 py-5 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#020887] flex items-center justify-center shrink-0">
            <LayoutDashboard size={20} color="white" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-[#0D0F2B] leading-tight tracking-wide uppercase truncate">
              The Grand Oasis
            </p>
            <p className="text-[11px] text-[#64748B]">Admin Dashboard</p>
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
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact, badge }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`admin-nav-item flex items-center ${isActive ? 'admin-nav-item-active' : 'admin-nav-item-inactive'}`}
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

      {/* Admin profile + logout */}
      <div className="px-4 pb-5 border-t border-[#E2E8F0] pt-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#020887] flex items-center justify-center shrink-0">
            <span className="text-white text-[13px] font-bold">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#0D0F2B] leading-tight truncate">John Doe</p>
            <p className="text-[11px] text-[#64748B] truncate">Super Admin</p>
          </div>
          <button
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
