'use client';

import { Minus, Plus } from 'lucide-react';

interface CounterItemProps {
  label: string;
  sublabel: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  max?: number;
}

function CounterItem({ label, sublabel, value, onDecrement, onIncrement, min = 0, max = 10 }: CounterItemProps) {
  return (
    <div className="counter-item">
      <div>
        <p className="text-[15px] font-semibold text-[#0D0F2B]">{label}</p>
        <p className="text-[13px] text-[#64748B]">{sublabel}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onDecrement}
          disabled={value <= min}
          className="counter-btn"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={14} />
        </button>
        <span className="text-[18px] font-bold text-[#0D0F2B] w-6 text-center">{value}</span>
        <button
          onClick={onIncrement}
          disabled={value >= max}
          className="counter-btn counter-btn-plus"
          aria-label={`Increase ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

interface GuestRoomCounterProps {
  adults: number;
  childCount: number;
  rooms: number;
  onAdultsChange: (v: number) => void;
  onChildrenChange: (v: number) => void;
  onRoomsChange: (v: number) => void;
  showRooms?: boolean;
}

export function GuestRoomCounter({
  adults, childCount, rooms,
  onAdultsChange, onChildrenChange, onRoomsChange,
  showRooms = true,
}: GuestRoomCounterProps) {
  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
      <h2 className="text-[16px] font-semibold text-[#0D0F2B] mb-4">
        {showRooms ? 'Guests & Rooms' : 'Number of Guests'}
      </h2>
      <div className="flex flex-col gap-0 divide-y divide-[#F1F5F9]">
        <CounterItem
          label="Adults" sublabel="Ages 13 or above"
          value={adults} onDecrement={() => onAdultsChange(adults - 1)} onIncrement={() => onAdultsChange(adults + 1)}
          min={1} max={10}
        />
        <CounterItem
          label="Children" sublabel="Ages 2 - 12"
          value={childCount} onDecrement={() => onChildrenChange(childCount - 1)} onIncrement={() => onChildrenChange(childCount + 1)}
          min={0} max={8}
        />
        {showRooms && (
          <CounterItem
            label="Rooms" sublabel=""
            value={rooms} onDecrement={() => onRoomsChange(rooms - 1)} onIncrement={() => onRoomsChange(rooms + 1)}
            min={1} max={5}
          />
        )}
      </div>
    </div>
  );
}
