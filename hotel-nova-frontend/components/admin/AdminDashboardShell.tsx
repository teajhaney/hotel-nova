'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminMobileNav } from './AdminMobileNav';
import { Menu, Bell, HelpCircle, Search, Plus } from 'lucide-react';

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/admin/overview')) return 'Overview';
  if (pathname.startsWith('/admin/rooms')) return 'Manage Rooms';
  if (pathname.startsWith('/admin/bookings')) return 'All Bookings';
  if (pathname.startsWith('/admin/users')) return 'Users';
  if (pathname.startsWith('/admin/reviews')) return 'Reviews';
  if (pathname.startsWith('/admin/promo-codes')) return 'Promo Codes';
  if (pathname.startsWith('/admin/analytics')) return 'Analytics';
  if (pathname.startsWith('/admin/settings')) return 'Settings';
  if (pathname.startsWith('/admin/notifications')) return 'Notifications';
  return 'Admin Dashboard';
}

export function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop sidebar */}
      <aside className="admin-sidebar hidden lg:flex">
        <AdminSidebar />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="admin-sidebar flex absolute left-0 top-0 bottom-0 shadow-2xl z-10">
            <AdminSidebar onClose={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-40 items-center justify-between h-16 px-6 bg-white border-b border-[#E2E8F0]">
          {/* Left: Search */}
          <div className="flex items-center gap-2 w-72 h-9 px-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
            <Search size={15} className="text-[#94A3B8] shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 text-[14px] bg-transparent border-none outline-none text-[#0D0F2B] placeholder:text-[#94A3B8]"
            />
          </div>

          {/* Right: icons + new booking */}
          <div className="flex items-center gap-3">
            <button
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              aria-label="Help"
            >
              <HelpCircle size={20} />
            </button>
            <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#020887] text-white text-[13px] font-medium hover:bg-[#38369A] transition-colors">
              <Plus size={16} />
              New Booking
            </button>
          </div>
        </header>

        {/* Mobile top header */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white border-b border-[#E2E8F0]">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F8FAFC]"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <p className="text-[15px] font-bold text-[#0D0F2B]">The Grand Oasis</p>
          <div className="w-9 h-9 rounded-full bg-[#020887] flex items-center justify-center">
            <span className="text-white text-[12px] font-bold">JD</span>
          </div>
        </header>

        <main className="flex-1 pb-16 lg:pb-0">{children}</main>

        <AdminMobileNav />
      </div>
    </div>
  );
}
