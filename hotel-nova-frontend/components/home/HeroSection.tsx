import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HOME_IMAGES } from '@/constants/images';
import { HERO_MESSAGES } from '@/constants/messages';

export function HeroSection() {
  return (
    <section aria-label={HERO_MESSAGES.ariaLabel}>
      {/* Full-bleed hero image */}
      <div className="relative h-[620px] md:h-[540px] sm:h-[480px] overflow-hidden">
        <Image
          src={HOME_IMAGES.hero}
          fill
          alt=""
          className="object-cover object-center"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/70" />

        {/* Hero content */}
        <div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center
                     page-container pb-[60px]"
        >
          <h1 className="text-white leading-none">
            <span
              className="block text-[42px] md:text-[34px] sm:text-[28px]
                         font-semibold tracking-tight"
            >
              {HERO_MESSAGES.titleLine1}
            </span>
            <span
              className="block text-[72px] md:text-[56px] sm:text-[46px]
                         font-bold tracking-tight -mt-[4px] text-[#A9DBBB]"
            >
              {HERO_MESSAGES.titleLine2}
            </span>
          </h1>

          <p
            className="mt-[16px] text-[17px] sm:text-[15px] text-white/75
                       max-w-[520px] leading-relaxed"
          >
            {HERO_MESSAGES.subtitle}
          </p>

          <div className="flex items-center gap-[12px] mt-[32px] sm:mt-[24px]">
            <Link
              href="/rooms"
              className="btn-primary-fill flex items-center gap-[6px]"
            >
              {HERO_MESSAGES.ctaPrimary}{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/coming-soon" className="btn-outline-white">
              {HERO_MESSAGES.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>

      {/* Booking bar — overlaps hero bottom on desktop */}
      {/* <div
        id="booking"
        className="relative z-20 lg:-mt-[56px] page-container"
      >
        <BookingBar />
      </div> */}
    </section>
  );
}
