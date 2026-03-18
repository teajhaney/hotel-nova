'use client';

import { useState } from 'react';
import {
  CalendarDays,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  Star,
  ChevronDown,
} from 'lucide-react';

type Tab = 'All Notifications' | 'Unread' | 'Bookings' | 'Messages' | 'System';

const TABS: Tab[] = ['All Notifications', 'Unread', 'Bookings', 'Messages', 'System'];

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'booking',
    borderColor: 'border-l-[#020887]',
    iconBg: 'bg-[#EEF0FF]',
    iconColor: 'text-[#020887]',
    icon: CalendarDays,
    title: 'New Booking Received',
    time: '2 minutes ago',
    description: 'Amara Okonkwo just booked Presidential Suite 501 for Mar 18 – Mar 25, 2026. Total: ₦4,200,000.',
    primaryAction: 'View Booking',
    secondaryAction: 'Mark Read',
    read: false,
    category: 'Bookings',
  },
  {
    id: 2,
    type: 'critical',
    borderColor: 'border-l-[#EF4444]',
    iconBg: 'bg-[#FEE2E2]',
    iconColor: 'text-[#EF4444]',
    icon: AlertTriangle,
    title: 'Critical: Server Response Latency',
    time: '14 minutes ago',
    description: 'API response times have exceeded 2,000ms threshold. Average response time: 2,847ms. This may affect booking flow.',
    primaryAction: 'View Logs',
    secondaryAction: 'Acknowledge',
    read: false,
    category: 'System',
  },
  {
    id: 3,
    type: 'message',
    borderColor: 'border-l-[#10B981]',
    iconBg: 'bg-[#D1FAE5]',
    iconColor: 'text-[#10B981]',
    icon: MessageSquare,
    title: 'New Message from Guest',
    time: '1 hour ago',
    description: 'Chidi Eze (Room 501): "Good afternoon, could we please arrange for extra towels and a bottle of champagne to be sent up?"',
    primaryAction: 'Reply Now',
    secondaryAction: 'Mark Read',
    read: false,
    category: 'Messages',
  },
  {
    id: 4,
    type: 'system',
    borderColor: 'border-l-[#CBD5E1]',
    iconBg: 'bg-[#F1F5F9]',
    iconColor: 'text-[#64748B]',
    icon: CheckCircle2,
    title: 'System Update Successful',
    time: '3 hours ago',
    description: 'HotelNova PMS has been updated to v2.4.1. New features include improved booking analytics and enhanced promo code management.',
    primaryAction: null,
    secondaryAction: null,
    read: true,
    category: 'System',
  },
  {
    id: 5,
    type: 'review',
    borderColor: 'border-l-[#F59E0B]',
    iconBg: 'bg-[#FEF3C7]',
    iconColor: 'text-[#F59E0B]',
    icon: Star,
    title: 'New 5-Star Review!',
    time: '5 hours ago',
    description: 'Bola Akin left a 5-star review: "Perfect anniversary getaway! The team went above and beyond to make our stay special. Highly recommend!"',
    primaryAction: 'Post to Socials',
    secondaryAction: 'Mark Read',
    read: false,
    category: 'Unread',
  },
];

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All Notifications');
  const [expanded, setExpanded] = useState(false);

  const filtered = NOTIFICATIONS.filter((n) => {
    if (activeTab === 'All Notifications') return true;
    if (activeTab === 'Unread') return !n.read;
    return n.category === activeTab;
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0F2B]">Notifications Center</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Stay up to date with hotel activity and alerts</p>
        </div>
        <button className="text-[13px] font-medium text-[#020887] hover:text-[#38369A] transition-colors">
          ✓ Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#E2E8F0] mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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
        {filtered.map((notif) => {
          const Icon = notif.icon;
          return (
            <div
              key={notif.id}
              className={`admin-card border-l-4 ${notif.borderColor} ${notif.read ? 'opacity-70' : ''}`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full ${notif.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={notif.iconColor} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-[14px] font-semibold text-[#0D0F2B]">{notif.title}</h3>
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
                        )}
                        <span className="text-[12px] text-[#94A3B8] whitespace-nowrap">{notif.time}</span>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#64748B] mt-1.5 leading-relaxed">{notif.description}</p>

                    {(notif.primaryAction || notif.secondaryAction) && (
                      <div className="flex items-center gap-2 mt-4">
                        {notif.primaryAction && (
                          <button
                            className={`h-8 px-4 rounded-lg text-[12px] font-medium transition-colors ${
                              notif.type === 'critical'
                                ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                                : 'bg-[#020887] text-white hover:bg-[#38369A]'
                            }`}
                          >
                            {notif.primaryAction}
                          </button>
                        )}
                        {notif.secondaryAction && (
                          <button className="h-8 px-4 rounded-lg border border-[#E2E8F0] text-[12px] font-medium text-[#64748B] hover:border-[#020887] hover:text-[#020887] transition-colors">
                            {notif.secondaryAction}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="admin-card p-10 flex items-center justify-center">
            <p className="text-[14px] text-[#94A3B8]">No notifications in this category</p>
          </div>
        )}
      </div>

      {/* Load more */}
      <div className="mt-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#64748B] hover:text-[#020887] hover:border-[#020887] transition-colors flex items-center justify-center gap-2"
        >
          <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Show fewer notifications' : 'Load more notifications'}
        </button>
        {expanded && (
          <div className="mt-4 admin-card p-6 flex items-center justify-center">
            <p className="text-[14px] text-[#94A3B8]">No older notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
