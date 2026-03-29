'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  CalendarClock,
  Wallet,
  MessageSquare,
  AlertTriangle,
  Bell,
  ChevronRight,
  BellOff,
  Loader2,
} from 'lucide-react';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
  useArchiveNotification,
} from '@/hooks/use-notifications';
import { formatDistanceToNow } from '@/utils/format';
import type { Notification, NotificationType } from '@/type/api';


// ─── Tab types ─────────────────────────────────────────────────────────────
const TABS = ['All', 'Unread', 'Archived'] as const;
type Tab = (typeof TABS)[number];

// Map UI tab label to the hook's filter parameter
const TAB_FILTER: Record<Tab, 'all' | 'unread' | 'archived'> = {
  All: 'all',
  Unread: 'unread',
  Archived: 'archived',
};

// ─── Notification icon by type ─────────────────────────────────────────────
function NotifIcon({ type }: { type: NotificationType }) {
  const base =
    'w-11 h-11 rounded-full flex items-center justify-center shrink-0';
  switch (type) {
    case 'booking_confirmed':
      return (
        <div className={`${base} bg-[#D1FAE5]`}>
          <CheckCircle2 size={22} className="text-[#10B981]" strokeWidth={2} />
        </div>
      );
    case 'checkout_reminder':
      return (
        <div className={`${base} bg-[#FEF3C7]`}>
          <CalendarClock size={22} className="text-[#F59E0B]" strokeWidth={2} />
        </div>
      );
    case 'payment_received':
      return (
        <div className={`${base} bg-[#EDE9FE]`}>
          <Wallet size={22} className="text-[#7C3AED]" strokeWidth={2} />
        </div>
      );
    case 'review_prompt':
      return (
        <div className={`${base} bg-[#F1F5F9]`}>
          <MessageSquare size={22} className="text-[#64748B]" strokeWidth={2} />
        </div>
      );
    case 'security_alert':
      return (
        <div className={`${base} bg-[#FEE2E2]`}>
          <AlertTriangle size={22} className="text-[#EF4444]" strokeWidth={2} />
        </div>
      );
    default:
      return (
        <div className={`${base} bg-[#EEF0FF]`}>
          <Bell size={22} className="text-[#020887]" strokeWidth={2} />
        </div>
      );
  }
}

// ─── Single notification card ──────────────────────────────────────────────
function NotifCard({
  notif,
  onMarkRead,
  onArchive,
}: {
  notif: Notification;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  return (
    <div
      className="relative flex gap-4 bg-white rounded-lg border border-[#E2E8F0] p-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
      onClick={() => {
        if (!notif.read) onMarkRead(notif.id);
      }}
    >
      {/* Unread indicator */}
      {!notif.read && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#020887] rounded-r-full" />
      )}

      <NotifIcon type={notif.type} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p
            className={`text-[14px] font-semibold ${notif.read ? 'text-[#0D0F2B]' : 'text-[#020887]'}`}
          >
            {notif.title}
          </p>
          <span className="text-[12px] text-[#94A3B8] whitespace-nowrap shrink-0">
            {formatDistanceToNow(notif.createdAt)}
          </span>
        </div>
        <p className="text-[13px] text-[#64748B] leading-relaxed mb-2.5">
          {notif.message}
        </p>
        <div className="flex items-center gap-4">
          {notif.actionLabel && notif.actionHref && (
            <Link
              href={notif.actionHref.replace('/dashboard/guest/history', '/dashboard/guest')}
              className="text-[13px] font-semibold text-[#020887] hover:underline uppercase tracking-wide"
              onClick={e => e.stopPropagation()}
            >
              {notif.actionLabel}
            </Link>
          )}
          {!notif.archived && (
            <button
              className="text-[13px] text-[#94A3B8] hover:text-[#64748B] uppercase tracking-wide"
              onClick={e => {
                e.stopPropagation();
                onArchive(notif.id);
              }}
            >
              {GUEST_DASHBOARD_MESSAGES.dismiss}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const { data, isLoading } = useNotifications(TAB_FILTER[activeTab]);
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const archive = useArchiveNotification();

  const notifications = data?.data ?? [];

  return (
    <div className="guest-page-container">
      {/* Header */}
      <div className="sticky top-14 lg:top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-2 bg-[#F8FAFC] border-b border-[#E2E8F0] lg:border-none -mx-5 px-5 md:-mx-8 md:px-8 -mt-5 md:-mt-8">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D0F2B]">
            {GUEST_DASHBOARD_MESSAGES.notificationsTitle}
          </h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">
            {GUEST_DASHBOARD_MESSAGES.notificationsSubtitle}
          </p>
        </div>
        <button
          onClick={() => markAllRead.mutate()}
          disabled={markAllRead.isPending}
          className="shrink-0 px-4 py-2 h-10 w-full sm:w-auto bg-[#EEF0FF] text-[#020887] rounded-lg text-[13px] font-semibold hover:bg-[#DCE1FF] transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {GUEST_DASHBOARD_MESSAGES.markAllRead}
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0] px-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3.5 text-[14px] font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? 'border-[#020887] text-[#020887]'
                  : 'border-transparent text-[#64748B] hover:text-[#0D0F2B]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="divide-y divide-[#F1F5F9]">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#020887]" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <BellOff size={36} className="text-[#CBD5E1]" />
              <p className="text-[14px] text-[#94A3B8]">
                {GUEST_DASHBOARD_MESSAGES.noNotifications}
              </p>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="p-4">
                <NotifCard
                  notif={notif}
                  onMarkRead={id => markRead.mutate(id)}
                  onArchive={id => archive.mutate(id)}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer — switch to archive tab */}
        {activeTab !== 'Archived' && (
          <div className="border-t border-[#E2E8F0] px-4 py-3.5 flex items-center justify-center">
            <button
              onClick={() => setActiveTab('Archived')}
              className="flex items-center gap-1.5 text-[14px] font-medium text-[#64748B] hover:text-[#020887] transition-colors"
            >
              {GUEST_DASHBOARD_MESSAGES.viewArchive}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
