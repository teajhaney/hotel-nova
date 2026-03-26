'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { AdminSidebar } from './AdminSidebar';
import { AdminMobileNav } from './AdminMobileNav';
import { Menu, Bell, HelpCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_DASHBOARD_MESSAGES } from '@/constants/messages';
import { useAuthStore } from '@/stores/auth-store';
import { useUnreadCount } from '@/hooks/use-notifications';

export function AdminDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useAuthStore(s => s.user);
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count ?? 0;

  // Build initials from the user's full name (e.g. "John Doe" → "JD")
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden lg:flex">
        <AdminSidebar />
      </aside>

      {/* Mobile drawer — always in DOM, animated with motion */}
      <motion.div
        className="fixed inset-0 z-[60] lg:hidden"
        animate={{
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
        }}
        initial={false}
        transition={{ duration: 0.25 }}
      >
        {/* Backdrop */}
        <button
          className="absolute inset-0 w-full h-full bg-black/50 cursor-default"
          onClick={() => setDrawerOpen(false)}
          aria-label={ADMIN_DASHBOARD_MESSAGES.closeMenuAriaLabel}
          tabIndex={drawerOpen ? 0 : -1}
        />
        {/* Drawer panel — springs in from left */}
        <motion.aside
          className="admin-sidebar flex flex-col absolute left-0 top-0 bottom-0 w-[240px] shadow-2xl z-10"
          animate={{ x: drawerOpen ? 0 : '-100%' }}
          initial={false}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <AdminSidebar onClose={() => setDrawerOpen(false)} />
        </motion.aside>
      </motion.div>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-40 items-center justify-between h-14 px-6 bg-white border-b border-[#E2E8F0]">
          {/* Left: Search */}
          <div className="flex items-center gap-2 w-72 h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
            <Search size={15} className="text-[#94A3B8] shrink-0" />
            <input
              type="text"
              placeholder={ADMIN_DASHBOARD_MESSAGES.searchPlaceholder}
              className="flex-1 text-[14px] bg-transparent border-none outline-none text-[#0D0F2B] placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Right: icons */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
              aria-label={ADMIN_DASHBOARD_MESSAGES.notificationsAriaLabel}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              aria-label={ADMIN_DASHBOARD_MESSAGES.helpAriaLabel}
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </header>

        {/* Mobile top header */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white border-b border-[#E2E8F0]">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
            aria-label={ADMIN_DASHBOARD_MESSAGES.openMenuAriaLabel}
          >
            <Menu size={22} />
          </button>
          <p className="text-[15px] font-bold text-[#0D0F2B]">
            {ADMIN_DASHBOARD_MESSAGES.hotelName}
          </p>
          {/* Right: icons */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
              aria-label={ADMIN_DASHBOARD_MESSAGES.notificationsAriaLabel}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            <div className="w-9 h-9 rounded-full bg-[#020887] flex items-center justify-center">
              <span className="text-white text-[12px] font-bold">
                {initials}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 pb-16 lg:pb-0">{children}</main>

        <AdminMobileNav />
      </div>
    </div>
  );
}
