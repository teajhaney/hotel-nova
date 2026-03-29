'use client';

import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { BedDouble, Users, Maximize2, CheckCircle, Wifi, Wind, Coffee, Tv } from 'lucide-react';
import type { BookingRoom } from '@/type/type';
import { BOOKING_MESSAGES } from '@/constants/messages';
import { formatNgn } from '@/utils/format';

// Maps well-known amenity names to icons so the card looks richer without
// requiring a separate icon field from the backend.
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi size={13} />,
  'Air Conditioning': <Wind size={13} />,
  'Coffee Maker': <Coffee size={13} />,
  '55" Smart TV': <Tv size={13} />,
};

interface AvailableRoomCardProps {
  room: BookingRoom;
  isSelected: boolean;
  onSelect: (room: BookingRoom) => void;
}

export function AvailableRoomCard({ room, isSelected, onSelect }: AvailableRoomCardProps) {
  return (
    <div className={`available-room-card ${isSelected ? 'available-room-card-selected' : ''}`}>
      {/* Image */}
      <div className="relative w-full md:w-[220px] h-48 md:h-auto shrink-0 bg-[#F1F5F9]">
        {room.imageUrl ? (
          <Image
            src={room.imageUrl}
            alt={room.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 220px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BedDouble size={32} className="text-[#CBD5E1]" />
          </div>
        )}

        {/* Room type badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-[0.08em] bg-[#020887] text-white">
          {room.type}
        </span>

        {isSelected && (
          <div className="absolute top-3 right-3 bg-[#020887] rounded-full p-0.5">
            <CheckCircle size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h3 className="text-[18px] font-bold text-[#0D0F2B]">{room.name}</h3>
          <div className="text-right shrink-0">
            <p className="text-[22px] font-bold text-[#020887]">{formatNgn(room.price)}</p>
            <p className="text-[12px] text-[#64748B]">{BOOKING_MESSAGES.perNight}</p>
          </div>
        </div>

        {room.description && (
          <p className="text-[14px] text-[#64748B] leading-relaxed mt-2 flex-1">{room.description}</p>
        )}

        {/* Room specs + amenities */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {room.beds && (
            <span className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
              <BedDouble size={13} className="text-[#94A3B8]" />
              {room.beds}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
            <Users size={13} className="text-[#94A3B8]" />
            Up to {room.maxGuests} guests
          </span>
          {room.sqm && (
            <span className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
              <Maximize2 size={13} className="text-[#94A3B8]" />
              {room.sqm} m²
            </span>
          )}
          {room.amenities.slice(0, 3).map((a) => (
            <span key={a} className="flex items-center gap-1.5 text-[13px] text-[#64748B]">
              <span className="text-[#94A3B8]">{AMENITY_ICONS[a] ?? <Coffee size={13} />}</span>
              {a}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-[#F1F5F9]">
          <button
            onClick={() => onSelect(room)}
            className={`px-5 py-2.5 rounded-sm text-[14px] font-semibold transition-all duration-150 flex items-center gap-2 ${
              isSelected
                ? 'bg-[#020887] text-white hover:bg-[#38369A]'
                : 'bg-[#EEF0FF] text-[#020887] hover:bg-[#020887] hover:text-white border border-[#020887]/20'
            }`}
          >
            {isSelected && <CheckCircle size={15} />}
            {isSelected ? BOOKING_MESSAGES.roomSelectedBtn : BOOKING_MESSAGES.selectRoomBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
