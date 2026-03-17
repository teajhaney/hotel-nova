'use client';

import { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import { BOOKING_BAR_MESSAGES } from '@/constants/messages';

export function BookingBar() {
  const today = new Date().toISOString().split('T')[0];
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState<string>(BOOKING_BAR_MESSAGES.defaultGuests);

  return (
    <div
      className="bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.10)] p-[24px] md:p-[20px]"
      role="search"
      aria-label={BOOKING_BAR_MESSAGES.ariaLabel}
    >
      <div className="flex flex-col lg:flex-row items-end gap-[16px]">
        {/* Check In */}
        <div className="flex-1 w-full">
          <span className="booking-field-label block mb-[8px]">
            {BOOKING_BAR_MESSAGES.checkInLabel}
          </span>
          <label className="flex items-center gap-[10px] bg-[#F1F5F9] rounded-[8px] px-[16px] h-[48px] cursor-pointer">
            <Calendar size={16} className="text-[#64748B] shrink-0" aria-hidden="true" />
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#0D0F2B] placeholder:text-[#94A3B8] cursor-pointer"
              aria-label={BOOKING_BAR_MESSAGES.checkInLabel}
            />
          </label>
        </div>

        {/* Check Out */}
        <div className="flex-1 w-full">
          <span className="booking-field-label block mb-[8px]">
            {BOOKING_BAR_MESSAGES.checkOutLabel}
          </span>
          <label className="flex items-center gap-[10px] bg-[#F1F5F9] rounded-[8px] px-[16px] h-[48px] cursor-pointer">
            <Calendar size={16} className="text-[#64748B] shrink-0" aria-hidden="true" />
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#0D0F2B] placeholder:text-[#94A3B8] cursor-pointer"
              aria-label={BOOKING_BAR_MESSAGES.checkOutLabel}
            />
          </label>
        </div>

        {/* Guests */}
        <div className="flex-1 w-full">
          <span className="booking-field-label block mb-[8px]">
            {BOOKING_BAR_MESSAGES.guestsLabel}
          </span>
          <label className="flex items-center gap-[10px] bg-[#F1F5F9] rounded-[8px] px-[16px] h-[48px] cursor-pointer">
            <Users size={16} className="text-[#64748B] shrink-0" aria-hidden="true" />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#0D0F2B] appearance-none cursor-pointer"
              aria-label={BOOKING_BAR_MESSAGES.guestsLabel}
            >
              {BOOKING_BAR_MESSAGES.guestOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Search CTA */}
        <button
          type="button"
          className="inline-flex items-center justify-center gap-[8px]
                     px-[28px] h-[48px] rounded-[8px]
                     bg-[#020887] text-white
                     text-[15px] font-semibold tracking-[0.04em]
                     hover:bg-[#38369A] transition-colors duration-150
                     cursor-pointer whitespace-nowrap shrink-0"
          aria-label={BOOKING_BAR_MESSAGES.searchButton}
        >
          {BOOKING_BAR_MESSAGES.searchButton} <Search size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
