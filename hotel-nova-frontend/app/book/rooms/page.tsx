'use client';

import { useState } from 'react';
import { useBookingStore } from '@/stores/booking-store';
import { AvailableRoomCard } from '@/components/booking/AvailableRoomCard';
import { RoomSelectionSidebar } from '@/components/booking/RoomSelectionSidebar';
import { BOOKING_MESSAGES, BOOKING_ROOM_FILTERS } from '@/constants/messages';
import { BOOKING_ROOMS } from '@/constants/dummyData';
import type { BookingRoom } from '@/type/type';
import { useRouter } from 'next/navigation';

export default function BookStep2Page() {
  const store = useBookingStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('All Rooms');

  function handleSelectRoom(room: BookingRoom) {
    store.selectRoom(room);
  }

  const filteredRooms = BOOKING_ROOMS.filter((room) => {
    if (activeFilter === 'All Rooms') return true;
    if (activeFilter === 'Suites') return room.name.toLowerCase().includes('suite');
    if (activeFilter === 'Standard') return !room.name.toLowerCase().includes('suite');
    return true;
  });

  return (
    <div className="page-container py-10 pb-28 lg:pb-10">
      {/* Step header */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div>
            <h1 className="text-[22px] font-bold text-[#0D0F2B] mb-1">{BOOKING_MESSAGES.availableRoomsTitle}</h1>
            <p className="text-[14px] text-[#64748B]">{BOOKING_MESSAGES.availableRoomsSubtitle}</p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-sm border border-[#E2E8F0] text-[14px] font-medium text-[#0D0F2B] hover:border-[#020887] hover:text-[#020887] transition-colors">
            <span className="grid grid-cols-2 gap-0.5">
              {[0,1,2,3].map(i => <span key={i} className="w-1.5 h-1.5 bg-current rounded-sm" />)}
            </span>
            {BOOKING_MESSAGES.viewGallery}
          </button>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-[12px] text-[#020887] font-semibold">{BOOKING_MESSAGES.step2Label}</p>
            <div className="mt-1.5 h-1.5 w-48 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full w-2/5 bg-[#020887] rounded-full" />
            </div>
          </div>
          <p className="text-[13px] text-[#64748B]">{BOOKING_MESSAGES.step2Percent}</p>
        </div>
      </div>

      {/* Mobile filter chips */}
      <div className="flex gap-2 mb-5 md:hidden overflow-x-auto pb-1">
        {BOOKING_ROOM_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-sm text-[13px] font-medium transition-colors ${
              activeFilter === f
                ? 'bg-[#020887] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#020887]'
            }`}
          >
            {f}
            {f === 'All Rooms' && <span className="ml-1.5 text-[11px] opacity-70">▾</span>}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: rooms list */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-[18px] font-bold text-[#0D0F2B] hidden md:block">{BOOKING_MESSAGES.availableRoomsTitle}</h2>
          {filteredRooms.map((room) => (
            <AvailableRoomCard
              key={room.id}
              room={room}
              isSelected={store.selectedRoom?.id === room.id}
              onSelect={handleSelectRoom}
            />
          ))}
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block w-[300px] xl:w-[340px] shrink-0">
          <div className="sticky top-6">
            <RoomSelectionSidebar />
          </div>
        </div>
      </div>

      {/* Mobile CTA bar — always visible, disabled until room is selected */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] px-5 py-4 z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        {store.selectedRoom ? (
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] text-[#64748B] uppercase tracking-[0.08em] font-semibold">TOTAL ESTIMATE</p>
              <p className="text-[17px] font-bold text-[#020887]">₦{store.getTotal().toLocaleString('en-NG')}</p>
              <p className="text-[12px] text-[#64748B]">for {store.getNights()} night{store.getNights() !== 1 ? 's' : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#64748B] uppercase tracking-[0.08em] font-semibold">SELECTED</p>
              <p className="text-[13px] font-semibold text-[#0D0F2B]">{store.selectedRoom.name}</p>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-[#64748B] text-center mb-3">Select a room above to continue</p>
        )}
        <button
          onClick={() => store.selectedRoom && router.push('/book/summary')}
          disabled={!store.selectedRoom}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {BOOKING_MESSAGES.confirmSelection} →
        </button>
      </div>
    </div>
  );
}
