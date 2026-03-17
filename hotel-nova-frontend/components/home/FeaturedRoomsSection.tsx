import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RoomCard } from './RoomCard';
import { FEATURED_ROOMS } from '@/constants/dummyData';
import { FEATURED_ROOMS_MESSAGES } from '@/constants/messages';

export function FeaturedRoomsSection() {
  return (
    <section className="section-pad bg-white" aria-labelledby="rooms-heading">
      <div className="page-container">
        {/* Section header */}
        <div className="flex items-end justify-between mb-[40px] sm:mb-[28px]">
          <div>
            <span className="section-eyebrow">
              {FEATURED_ROOMS_MESSAGES.eyebrow}
            </span>
            <h2 id="rooms-heading" className="pub-section-heading">
              {FEATURED_ROOMS_MESSAGES.heading}
            </h2>
          </div>

          <Link
            href="/rooms"
            className="flex items-center gap-[4px] shrink-0 ml-[16px]
                       text-[#020887] text-[14px] font-medium
                       hover:text-[#38369A] transition-colors"
            aria-label={FEATURED_ROOMS_MESSAGES.viewAll}
          >
            {FEATURED_ROOMS_MESSAGES.viewAll} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {FEATURED_ROOMS.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
      </div>
    </section>
  );
}
