'use client';

import { SlidersHorizontal, CircleDollarSign, Building2, Wifi } from 'lucide-react';
import { ROOMS_PAGE_MESSAGES } from '@/constants/messages';

type RoomFiltersProps = {
  priceRange: [number, number];
  maxRoomPrice: number;
  availableTypes: string[];
  availableAmenities: string[];
  onPriceChange: (range: [number, number]) => void;
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  selectedAmenities: string[];
  onAmenityToggle: (amenity: string) => void;
  onClear: () => void;
};

export function RoomFilters({
  priceRange,
  maxRoomPrice,
  availableTypes,
  availableAmenities,
  onPriceChange,
  selectedTypes,
  onTypeToggle,
  selectedAmenities,
  onAmenityToggle,
  onClear,
}: RoomFiltersProps) {
  // When priceRange[1] is 0 (initial/reset state), show the slider at full max
  const displayMax = priceRange[1] === 0 ? maxRoomPrice : priceRange[1];

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
          min={0}
          max={maxRoomPrice || 1}
          step={maxRoomPrice ? Math.ceil(maxRoomPrice / 50) : 1}
          value={displayMax}
          onChange={(e) => onPriceChange([0, Number(e.target.value)])}
          className="w-full accent-[#020887] cursor-pointer"
          aria-label="Maximum price"
          disabled={maxRoomPrice === 0}
        />
        <div className="flex justify-between mt-2">
          <span className="text-[13px] font-medium text-[#020887]">₦0</span>
          <span className="text-[13px] font-medium text-[#020887]">₦{displayMax.toLocaleString()}</span>
        </div>
      </div>

      {/* Room Type — only rendered once rooms have loaded */}
      {availableTypes.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-[#64748B]" aria-hidden="true" />
            <h3 className="text-[14px] font-semibold text-[#0D0F2B]">
              {ROOMS_PAGE_MESSAGES.roomTypeLabel}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {availableTypes.map((type) => (
              <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => onTypeToggle(type)}
                  className="w-4.5 h-4.5 rounded-sm border-[#E2E8F0] accent-[#020887] cursor-pointer"
                />
                <span className="text-[14px] text-[#0D0F2B]">{type}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Amenities — only rendered once rooms have loaded */}
      {availableAmenities.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-4">
            <Wifi size={16} className="text-[#64748B]" aria-hidden="true" />
            <h3 className="text-[14px] font-semibold text-[#0D0F2B]">
              {ROOMS_PAGE_MESSAGES.amenitiesLabel}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {availableAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => onAmenityToggle(amenity)}
                  className="w-4.5 h-4.5 rounded-sm border-[#E2E8F0] accent-[#020887] cursor-pointer"
                />
                <span className="text-[14px] text-[#0D0F2B]">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      <button
        type="button"
        onClick={onClear}
        className="w-full py-3 rounded-sm border border-[#E2E8F0] text-[#0D0F2B]
                   text-[14px] font-semibold hover:bg-[#F8FAFC] transition-colors duration-150 cursor-pointer"
      >
        {ROOMS_PAGE_MESSAGES.clearFilters}
      </button>
    </aside>
  );
}
