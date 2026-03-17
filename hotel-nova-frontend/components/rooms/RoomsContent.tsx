'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { RoomFilters } from './RoomFilters';
import { RoomListingCard } from './RoomListingCard';
import { Pagination } from './Pagination';
import { ROOM_LISTINGS } from '@/constants/dummyData';
import { ROOMS_PAGE_MESSAGES } from '@/constants/messages';

const ROOMS_PER_PAGE = 4;

export function RoomsContent() {
  const [priceRange, setPriceRange] = useState<[number, number]>([150, 1200]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
    setCurrentPage(1);
  };

  const handleClear = () => {
    setPriceRange([150, 1200]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setCurrentPage(1);
  };

  const filteredRooms = useMemo(() => {
    return ROOM_LISTINGS.filter((room) => {
      if (room.price < priceRange[0] || room.price > priceRange[1]) return false;
      return true;
    });
  }, [priceRange, selectedTypes, selectedAmenities]);

  const totalPages = Math.ceil(filteredRooms.length / ROOMS_PER_PAGE);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * ROOMS_PER_PAGE,
    currentPage * ROOMS_PER_PAGE
  );

  return (
    <div className="page-container py-10 md:py-8">
      <div className="flex gap-8 lg:gap-6">
        {/* Sidebar — desktop only */}
        <div className="hidden lg:block w-70 shrink-0">
          <RoomFilters
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
            selectedAmenities={selectedAmenities}
            onAmenityToggle={handleAmenityToggle}
            onClear={handleClear}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold text-[#0D0F2B] leading-tight">
              {ROOMS_PAGE_MESSAGES.heading}
            </h1>
            <p className="pub-section-subtext mt-2">
              {ROOMS_PAGE_MESSAGES.subtitle}
            </p>
          </div>

          {/* Mobile filter toggle + search */}
          <div className="lg:hidden mb-6">
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5
                           rounded-lg border border-[#E2E8F0]
                           text-[14px] font-medium text-[#0D0F2B]
                           hover:border-[#020887] transition-colors cursor-pointer"
              >
                <Search size={14} aria-hidden="true" />
                {ROOMS_PAGE_MESSAGES.filtersHeading}
              </button>
            </div>

            {/* Mobile filters panel */}
            {showFilters && (
              <div className="mb-6">
                <RoomFilters
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  selectedTypes={selectedTypes}
                  onTypeToggle={handleTypeToggle}
                  selectedAmenities={selectedAmenities}
                  onAmenityToggle={handleAmenityToggle}
                  onClear={handleClear}
                />
              </div>
            )}
          </div>

          {/* Room grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedRooms.map((room) => (
              <RoomListingCard key={room.id} {...room} />
            ))}
          </div>

          {/* Empty state */}
          {filteredRooms.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[18px] font-medium text-[#64748B]">
                No rooms match your filters. Try adjusting your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
