'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  AlertTriangle,
  Star,
  CheckCircle2,
  UserPlus,
  DoorOpen,
  Bell,
  BellOff,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
  useArchiveNotification,
} from '@/hooks/use-notifications';
import { formatDistanceToNow } from '@/utils/format';
import type { Notification, NotificationType } from '@/type/api';

// ─── Tabs ──────────────────────────────────────────────────────────────────
const TABS = ['All', 'Unread', 'Archived'] as const;
type Tab = (typeof TABS)[number];

const TAB_FILTER: Record<Tab, 'all' | 'unread' | 'archived'> = {
  All: 'all',
  Unread: 'unread',
  Archived: 'archived',
};

// ─── Icon + color styling per notification type ────────────────────────────
function notifStyle(type: NotificationType) {
  switch (type) {
    case 'new_booking':
      return {
        border: 'border-l-[#020887]',
        iconBg: 'bg-[#EEF0FF]',
        iconColor: 'text-[#020887]',
        Icon: CalendarDays,
      };
    case 'new_review_submitted':
      return {
        border: 'border-l-[#F59E0B]',
        iconBg: 'bg-[#FEF3C7]',
        iconColor: 'text-[#F59E0B]',
        Icon: Star,
      };
    case 'new_user_registered':
      return {
        border: 'border-l-[#10B981]',
        iconBg: 'bg-[#D1FAE5]',
        iconColor: 'text-[#10B981]',
        Icon: UserPlus,
      };
    case 'room_status_changed':
      return {
        border: 'border-l-[#7C3AED]',
        iconBg: 'bg-[#EDE9FE]',
        iconColor: 'text-[#7C3AED]',
        Icon: DoorOpen,
      };
    case 'security_alert':
      return {
        border: 'border-l-[#EF4444]',
        iconBg: 'bg-[#FEE2E2]',
        iconColor: 'text-[#EF4444]',
        Icon: AlertTriangle,
      };
    case 'general':
      return {
        border: 'border-l-[#CBD5E1]',
        iconBg: 'bg-[#F1F5F9]',
        iconColor: 'text-[#64748B]',
        Icon: CheckCircle2,
      };
    default:
      return {
        border: 'border-l-[#CBD5E1]',
        iconBg: 'bg-[#F1F5F9]',
        iconColor: 'text-[#64748B]',
        Icon: Bell,
      };
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
  const { border, iconBg, iconColor, Icon } = notifStyle(notif.type);

  return (
    <div className={`admin-card border-l-4 ${border} ${notif.read ? 'opacity-70' : ''}`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon size={18} className={iconColor} strokeWidth={1.8} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-[14px] font-semibold text-[#0D0F2B]">
                {notif.title}
              </h3>
              <div className="flex items-center gap-2">
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
                )}
                <span className="text-[12px] text-[#94A3B8] whitespace-nowrap">
                  {formatDistanceToNow(notif.createdAt)}
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#64748B] mt-1.5 leading-relaxed">
              {notif.message}
            </p>

            <div className="flex items-center gap-2 mt-4">
              {notif.actionLabel && notif.actionHref && (
                <Link
                  href={notif.actionHref}
                  className="h-8 px-4 rounded-lg bg-[#020887] text-white text-[12px] font-medium hover:bg-[#38369A] transition-colors inline-flex items-center"
                >
                  {notif.actionLabel}
                </Link>
              )}
              {!notif.read && (
                <button
                  onClick={() => onMarkRead(notif.id)}
                  className="h-8 px-4 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors"
                >
                  Mark Read
                </button>
              )}
              {!notif.archived && (
                <button
                  onClick={() => onArchive(notif.id)}
                  className="h-8 px-4 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications(TAB_FILTER[activeTab], page, PAGE_SIZE);
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const archive = useArchiveNotification();

  const notifications = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  // Reset to page 1 when switching tabs
  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setPage(1);
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="sticky top-14 lg:top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 mb-3 bg-[#F8FAFC] border-b border-[#E2E8F0] lg:border-none -mx-5 px-5 md:-mx-8 md:px-8 -mt-5 md:-mt-8">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">
            Notifications Center
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1">
            Stay up to date with hotel activity and alerts
          </p>
        </div>
        <button
          onClick={() => markAllRead.mutate()}
          disabled={markAllRead.isPending}
          className="shrink-0 px-4 py-2 h-10 w-full sm:w-auto bg-[#EEF0FF] text-[#020887] rounded-lg text-[13px] font-semibold hover:bg-[#DCE1FF] transition-colors whitespace-nowrap disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab
                ? 'border-[#020887] text-[#020887]'
                : 'border-transparent text-[#64748B] hover:text-[#0D0F2B]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification cards */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="admin-card p-10 flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-[#020887]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="admin-card p-10 flex flex-col items-center justify-center gap-3">
            <BellOff size={32} className="text-[#CBD5E1]" />
            <p className="text-[14px] text-[#94A3B8]">
              No notifications in this category
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotifCard
              key={notif.id}
              notif={notif}
              onMarkRead={(id) => markRead.mutate(id)}
              onArchive={(id) => archive.mutate(id)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-[13px] text-[#64748B]">
            Page {page} of {totalPages} ({meta?.total ?? 0} notifications)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="h-9 w-9 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="h-9 w-9 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
