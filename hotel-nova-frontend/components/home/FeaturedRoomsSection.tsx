import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RoomCard } from './RoomCard';
import { FEATURED_ROOMS_MESSAGES } from '@/constants/messages';
import type { Room, RoomsPage } from '@/type/api';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=128&h=128&fit=crop&auto=format';

function shuffle<T>(items: T[]) {
  const array = items.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function getFeaturedRooms(): Promise<Room[]> {
  if (!process.env.BACKEND_URL) return [];

  const res = await fetch(`${process.env.BACKEND_URL}/rooms?limit=50`, {
    cache: 'no-store',
  });

  if (!res.ok) return [];

  const payload = (await res.json()) as RoomsPage;
  const rooms = payload.data ?? [];
  return shuffle(rooms).slice(0, 3);
}

export async function FeaturedRoomsSection() {
  const rooms = await getFeaturedRooms();

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
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              image={room.imageUrl ?? FALLBACK_IMAGE}
              name={room.name}
              description={room.description ?? ''}
              priceFrom={room.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
