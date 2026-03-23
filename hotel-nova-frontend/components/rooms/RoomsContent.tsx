'use client';

import { useState, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { RoomFilters } from './RoomFilters';
import { RoomListingCard } from './RoomListingCard';
import { Pagination } from './Pagination';
import { useRooms } from '@/hooks/use-rooms';
import { ROOMS_PAGE_MESSAGES } from '@/constants/messages';

const ROOMS_PER_PAGE = 6;

export function RoomsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  // priceRange[1] === 0 means "no upper limit set yet — show everything"
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all available rooms — client-side filtering is fine for a single hotel
  const { data, isLoading, isError } = useRooms({ status: 'Available', limit: 100 });
  const rooms = data?.data ?? [];

  // Derive the highest price from loaded rooms and round up to the nearest 50k
  const maxRoomPrice = useMemo(() => {
    if (rooms.length === 0) return 0;
    const highest = Math.max(...rooms.map((r) => r.price));
    return Math.ceil(highest / 50000) * 50000;
  }, [rooms]);

  // Pull room types that are actually in the data — no hardcoded list
  const availableTypes = useMemo(() => {
    return [...new Set(rooms.map((r) => r.type))].sort();
  }, [rooms]);

  // Pull amenities that are actually in the data — guarantees filter values
  // always match exactly what's stored in the database
  const availableAmenities = useMemo(() => {
    return [...new Set(rooms.flatMap((r) => r.amenities))].sort();
  }, [rooms]);

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
    setSearchQuery('');
    setPriceRange([0, 0]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the top of the page so the user sees the new results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredRooms = useMemo(() => {
    // priceRange[1] === 0 means not yet adjusted — include all
    const effectiveMax = priceRange[1] === 0 ? Infinity : priceRange[1];

    return rooms.filter((room) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        // Match against the fields that are indexed or key identifiers:
        //  - name       → display name (e.g. "Deluxe King Suite")
        //  - type       → enum, part of the composite unique index (e.g. "Suite")
        //  - roomRef    → unique-indexed reference code (e.g. "RN-109-SU")
        //  - description → keyword matching ("pool view", "king bed", etc.)
        const matchesName = room.name.toLowerCase().includes(q);
        const matchesType = room.type.toLowerCase().includes(q);
        const matchesRef  = room.roomRef.toLowerCase().includes(q);
        const matchesDesc = room.description?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesType && !matchesRef && !matchesDesc) return false;
      }

      if (room.price < priceRange[0] || room.price > effectiveMax) return false;

      if (selectedTypes.length > 0 && !selectedTypes.includes(room.type)) return false;

      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every((a) => room.amenities.includes(a));
        if (!hasAll) return false;
      }

      return true;
    });
  }, [rooms, searchQuery, priceRange, selectedTypes, selectedAmenities]);

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
            maxRoomPrice={maxRoomPrice}
            availableTypes={availableTypes}
            availableAmenities={availableAmenities}
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
          <div className="mb-6">
            <h1 className="text-[28px] md:text-[32px] lg:text-[36px] font-bold text-[#0D0F2B] leading-tight">
              {ROOMS_PAGE_MESSAGES.heading}
            </h1>
            <p className="pub-section-subtext mt-2">
              {ROOMS_PAGE_MESSAGES.subtitle}
            </p>
          </div>

          {/* Search field */}
          <div className="mb-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={ROOMS_PAGE_MESSAGES.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-[#E2E8F0]
                           text-[15px] text-[#0D0F2B] placeholder:text-[#94A3B8]
                           focus:outline-none focus:ring-2 focus:ring-[#020887] focus:border-transparent
                           transition-all"
                aria-label="Search rooms by name"
              />
            </div>
          </div>

          {/* Mobile filter toggle */}
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

            {showFilters && (
              <div className="mb-6">
                <RoomFilters
                  priceRange={priceRange}
                  maxRoomPrice={maxRoomPrice}
                  availableTypes={availableTypes}
                  availableAmenities={availableAmenities}
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

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={32} className="animate-spin text-[#020887]" />
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="text-center py-16">
              <p className="text-[16px] font-medium text-[#EF4444]">
                Failed to load rooms. Please try refreshing the page.
              </p>
            </div>
          )}

          {/* Room grid */}
          {!isLoading && !isError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedRooms.map((room) => (
                  <RoomListingCard key={room.id} {...room} />
                ))}
              </div>

              {filteredRooms.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-[18px] font-medium text-[#64748B]">
                    {searchQuery.trim()
                      ? `No rooms found matching "${searchQuery}". Try a different search term.`
                      : 'No rooms match your filters. Try adjusting your criteria.'}
                  </p>
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
