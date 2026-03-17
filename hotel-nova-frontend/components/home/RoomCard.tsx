import Image from 'next/image';
import Link from 'next/link';
import { FEATURED_ROOMS_MESSAGES } from '@/constants/messages';

export type RoomCardProps = {
  id: string;
  image: string;
  name: string;
  description: string;
  priceFrom: number;
  badge?: string | null;
};

export function RoomCard({ id, image, name, description, priceFrom, badge }: RoomCardProps) {
  return (
    <article className="hotel-card group flex flex-col">
      {/* Room image with price badge */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image}
          fill
          alt={`${name} — room interior`}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Price badge — top right */}
        <div
          className="absolute top-3 right-3
                     bg-white/95 backdrop-blur-sm
                     text-[#0D0F2B] text-[12px] font-semibold
                     rounded-sm px-2.5 py-1.25
                     shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
        >
          {FEATURED_ROOMS_MESSAGES.pricePrefix} ${priceFrom}{FEATURED_ROOMS_MESSAGES.priceSuffix}
        </div>

        {/* Optional badge — top left */}
        {badge && (
          <span className="absolute top-3 left-3 badge-inclusion-pill">
            {badge}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[18px] font-bold text-[#0D0F2B] leading-snug mb-2">
          {name}
        </h3>

        <p className="text-body-sm leading-relaxed mb-5 flex-1">
          {description}
        </p>

        <Link
          href={`/rooms/${id}`}
          className="btn-outline-primary w-full text-[14px]"
        >
          {FEATURED_ROOMS_MESSAGES.bookNow}
        </Link>
      </div>
    </article>
  );
}
