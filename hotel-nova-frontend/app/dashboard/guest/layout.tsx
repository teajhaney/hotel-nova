import { GuestDashboardShell } from '@/components/guest/GuestDashboardShell';

export default function GuestDashboardLayout({ children }: { children: React.ReactNode }) {
  return <GuestDashboardShell>{children}</GuestDashboardShell>;
}
