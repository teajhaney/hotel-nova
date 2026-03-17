'use client';

import { SlidersHorizontal, CircleDollarSign, Building2, Wifi, Waves, Dumbbell } from 'lucide-react';
import { ROOMS_PAGE_MESSAGES } from '@/constants/messages';
import { ROOM_TYPES, ROOM_AMENITY_FILTERS } from '@/constants/dummyData';
import type { LucideIcon } from 'lucide-react';

type RoomFiltersProps = {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  selectedAmenities: string[];
  onAmenityToggle: (amenity: string) => void;
  onClear: () => void;
};

const AMENITY_ICONS: Record<string, LucideIcon> = {
  WiFi: Wifi,
  'Pool Access': Waves,
  'Fitness Gym': Dumbbell,
};

export function RoomFilters({
  priceRange,
  onPriceChange,
  selectedTypes,
  onTypeToggle,
  selectedAmenities,
  onAmenityToggle,
  onClear,
}: RoomFiltersProps) {
  return (
    <aside
      className="hotel-card p-6 sticky top-22 h-fit"
      aria-label="Room filters"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-7">
        <SlidersHorizontal size={20} className="text-[#020887]" aria-hidden="true" />
        <h2 className="text-[20px] font-bold text-[#0D0F2B]">
          {ROOMS_PAGE_MESSAGES.filtersHeading}
        </h2>
      </div>

      {/* Price Range */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-4">
          <CircleDollarSign size={16} className="text-[#64748B]" aria-hidden="true" />
          <h3 className="text-[14px] font-semibold text-[#0D0F2B]">
            {ROOMS_PAGE_MESSAGES.priceRangeLabel}
          </h3>
        </div>
        <input
          type="range"
          min={150000}
          max={2500000}
          step={50000}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#020887] cursor-pointer"
          aria-label="Maximum price"
        />
        <div className="flex justify-between mt-2">
          <span className="text-[13px] font-medium text-[#020887]">₦{priceRange[0].toLocaleString()}</span>
          <span className="text-[13px] font-medium text-[#020887]">₦{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Room Type */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={16} className="text-[#64748B]" aria-hidden="true" />
          <h3 className="text-[14px] font-semibold text-[#0D0F2B]">
            {ROOMS_PAGE_MESSAGES.roomTypeLabel}
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          {ROOM_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => onTypeToggle(type)}
                className="w-4.5 h-4.5 rounded-sm border-[#E2E8F0]
                           accent-[#020887] cursor-pointer"
              />
              <span className="text-[14px] text-[#0D0F2B]">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-4">
          <Wifi size={16} className="text-[#64748B]" aria-hidden="true" />
          <h3 className="text-[14px] font-semibold text-[#0D0F2B]">
            {ROOMS_PAGE_MESSAGES.amenitiesLabel}
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          {ROOM_AMENITY_FILTERS.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity];
            return (
              <label key={amenity} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => onAmenityToggle(amenity)}
                  className="w-4.5 h-4.5 rounded-sm border-[#E2E8F0]
                             accent-[#020887] cursor-pointer"
                />
                {Icon && <Icon size={14} className="text-[#64748B]" aria-hidden="true" />}
                <span className="text-[14px] text-[#0D0F2B]">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        type="button"
        onClick={onClear}
        className="w-full py-3 rounded-sm
                   border border-[#E2E8F0] text-[#0D0F2B]
                   text-[14px] font-semibold
                   hover:bg-[#F8FAFC] transition-colors duration-150
                   cursor-pointer"
      >
        {ROOMS_PAGE_MESSAGES.clearFilters}
      </button>
    </aside>
  );
}
