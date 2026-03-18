'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/constants/dummyData';



export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50
                 bg-white border-t border-[#E2E8F0]
                 lg:hidden"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-stretch h-15">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1
                          gap-0.75 text-[11px] font-medium
                         transition-colors duration-150 min-h-11
                         ${isActive ? 'text-[#020887]' : 'text-[#64748B] hover:text-[#020887]'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.8}
                aria-hidden="true"
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
