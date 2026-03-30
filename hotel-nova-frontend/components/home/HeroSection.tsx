'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HOME_IMAGES } from '@/constants/images';
import { HERO_MESSAGES } from '@/constants/messages';

const SLIDES = HOME_IMAGES.heroCarousel;
const INTERVAL_MS = 3000;
const FADE_MS = 800;

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section aria-label={HERO_MESSAGES.ariaLabel}>
      {/* Full-bleed hero image carousel */}
      <div className="relative h-[620px] md:h-[540px] sm:h-[480px] overflow-hidden">
        {/* Stacked images with crossfade */}
        {SLIDES.map((src, index) => (
          <Image
            key={src}
            src={src}
            fill
            alt=""
            className="object-cover object-center"
            priority={index === 0}
            style={{
              opacity: index === activeIndex ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
              zIndex: index === activeIndex ? 1 : 0,
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/25 via-black/35 to-black/70" />

        {/* Hero content */}
        <div
          className="relative z-[3] h-full flex flex-col items-center justify-center text-center
                     page-container pb-[60px]"
        >
          <h1 className="text-white leading-none">
            <span
              className="block text-[36px] sm:text-[42px] md:text-[56px] lg:text-[72px]
                         font-semibold tracking-tight"
            >
              {HERO_MESSAGES.titleLine1}
            </span>
            <span
              className="block text-[52px] sm:text-[64px] md:text-[84px] lg:text-[104px]
                         font-bold tracking-tight -mt-[4px] lg:-mt-[8px] text-[#A9DBBB]"
            >
              {HERO_MESSAGES.titleLine2}
            </span>
          </h1>

          <p
            className="mt-[16px] lg:mt-[24px] text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] text-white/75
                       max-w-[520px] md:max-w-[640px] lg:max-w-[760px] leading-relaxed"
          >
            {HERO_MESSAGES.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-[12px] mt-[32px] sm:mt-[24px] w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/rooms"
              className="btn-primary-fill flex items-center justify-center gap-[6px] w-full sm:w-auto"
            >
              {HERO_MESSAGES.ctaPrimary}{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/coming-soon" className="btn-outline-white w-full sm:w-auto text-center">
              {HERO_MESSAGES.ctaSecondary}
            </Link>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mt-8">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="group p-1"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${index === activeIndex
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 group-hover:bg-white/70'
                    }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
