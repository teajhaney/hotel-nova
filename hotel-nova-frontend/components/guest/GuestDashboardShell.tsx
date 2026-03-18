'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { GuestSidebar } from './GuestSidebar';
import { GuestMobileNav } from './GuestMobileNav';
import { Menu, Bell } from 'lucide-react';
import Link from 'next/link';

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard/guest') return 'My Bookings';
  if (pathname.startsWith('/dashboard/guest/history')) return 'Booking History';
  if (pathname.startsWith('/dashboard/guest/profile')) return 'Profile & Settings';
  if (pathname.startsWith('/dashboard/guest/reviews')) return 'Reviews';
  if (pathname.startsWith('/dashboard/guest/notifications')) return 'Notifications';
  return 'Guest Dashboard';
}

export function GuestDashboardShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar — always in DOM, hidden on mobile via CSS */}
      <aside className="guest-sidebar hidden lg:flex">
        <GuestSidebar />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <aside className="guest-sidebar flex absolute left-0 top-0 bottom-0 shadow-2xl z-10">
            <GuestSidebar onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* Right: header + content + bottom nav */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top header */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white border-b border-[#E2E8F0]">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <p className="text-[15px] font-bold text-[#0D0F2B]">{getPageTitle(pathname)}</p>
          <Link
            href="/dashboard/guest/notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
          </Link>
        </header>

        <main className="flex-1 pb-16 lg:pb-0">
          {children}
        </main>

        <GuestMobileNav />
      </div>
    </div>
  );
}
