'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  CalendarClock,
  Wallet,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  BellOff,
} from 'lucide-react';
import { GUEST_DASHBOARD_MESSAGES } from '@/constants/messages';
import { GUEST_NOTIFICATIONS } from '@/constants/dummyData';
import type { GuestNotification, NotificationType } from '@/type/type';

const TABS = [
  GUEST_DASHBOARD_MESSAGES.notifTabAll,
  GUEST_DASHBOARD_MESSAGES.notifTabUnread,
  GUEST_DASHBOARD_MESSAGES.notifTabArchived,
] as const;

type Tab = (typeof TABS)[number];

function NotifIcon({ type }: { type: NotificationType }) {
  const base = 'w-11 h-11 rounded-full flex items-center justify-center shrink-0';
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
    case 'security':
      return (
        <div className={`${base} bg-[#FEE2E2]`}>
          <AlertTriangle size={22} className="text-[#EF4444]" strokeWidth={2} />
        </div>
      );
  }
}

function NotifCard({ notif }: { notif: GuestNotification }) {
  function renderMessage() {
    if (!notif.boldWord) return <span>{notif.message}</span>;
    const parts = notif.message.split(notif.boldWord);
    return (
      <span>
        {parts[0]}
        <strong className="font-semibold text-[#0D0F2B]">{notif.boldWord}</strong>
        {parts[1]}
      </span>
    );
  }

  return (
    <div className="relative flex gap-4 bg-white rounded-lg border border-[#E2E8F0] p-4">
      {/* Unread indicator */}
      {!notif.read && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#020887] rounded-r-full" />
      )}

      <NotifIcon type={notif.type} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className={`text-[14px] font-semibold ${notif.read ? 'text-[#0D0F2B]' : 'text-[#020887]'}`}>
            {notif.title}
          </p>
          <span className="text-[12px] text-[#94A3B8] whitespace-nowrap shrink-0">{notif.time}</span>
        </div>
        <p className="text-[13px] text-[#64748B] leading-relaxed mb-2.5">{renderMessage()}</p>
        <div className="flex items-center gap-4">
          <a
            href={notif.actionHref}
            className="text-[13px] font-semibold text-[#020887] hover:underline uppercase tracking-wide"
          >
            {notif.actionLabel}
          </a>
          <button className="text-[13px] text-[#94A3B8] hover:text-[#64748B] uppercase tracking-wide">
            {GUEST_DASHBOARD_MESSAGES.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>(GUEST_DASHBOARD_MESSAGES.notifTabAll);

  const filtered = GUEST_NOTIFICATIONS.filter((n) => {
    if (activeTab === GUEST_DASHBOARD_MESSAGES.notifTabUnread) return !n.read && !n.archived;
    if (activeTab === GUEST_DASHBOARD_MESSAGES.notifTabArchived) return n.archived;
    return !n.archived;
  });

  return (
    <div className="guest-page-container">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#0D0F2B]">{GUEST_DASHBOARD_MESSAGES.notificationsTitle}</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5">{GUEST_DASHBOARD_MESSAGES.notificationsSubtitle}</p>
        </div>
        <button className="shrink-0 text-[13px] font-semibold text-[#020887] hover:underline whitespace-nowrap">
          {GUEST_DASHBOARD_MESSAGES.markAllRead}
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[#E2E8F0] px-4">
          {TABS.map((tab) => (
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <BellOff size={36} className="text-[#CBD5E1]" />
              <p className="text-[14px] text-[#94A3B8]">{GUEST_DASHBOARD_MESSAGES.noNotifications}</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div key={notif.id} className="p-4">
                <NotifCard notif={notif} />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {activeTab !== GUEST_DASHBOARD_MESSAGES.notifTabArchived && (
          <div className="border-t border-[#E2E8F0] px-4 py-3.5 flex items-center justify-center">
            <button className="flex items-center gap-1.5 text-[14px] font-medium text-[#64748B] hover:text-[#020887] transition-colors">
              {GUEST_DASHBOARD_MESSAGES.viewArchive}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
