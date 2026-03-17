import Image from 'next/image';
import Link from 'next/link';
import { HOME_IMAGES } from '@/constants/images';
import { LEGACY_MESSAGES } from '@/constants/messages';

export function LegacySection() {
  return (
    <section
      className="section-pad bg-white"
      id="about"
      aria-labelledby="legacy-heading"
    >
      <div className="page-container">
        <div className="grid grid-cols-1 gap-[64px] xl:gap-[80px] items-center">
          {/* Left — image with 25+ overlay badge */}
          <div className="relative h-[520px] md:h-[380px] sm:h-[280px]
                          rounded-[12px] overflow-hidden
                          shadow-[0_4px_24px_rgba(0,0,0,0.10)]">
            <Image
              src={HOME_IMAGES.legacy}
              fill
              alt={LEGACY_MESSAGES.imageAlt}
              className="object-cover object-center"
            />

            {/* 25+ Years overlay */}
            <div
              className="absolute bottom-[24px] left-[24px]
                         bg-[#020887] text-white
                         rounded-[8px] px-[20px] py-[16px]
                         shadow-[0_4px_16px_rgba(2,8,135,0.35)]"
              aria-label={`${LEGACY_MESSAGES.badgeNumber} ${LEGACY_MESSAGES.badgeLabel}`}
            >
              <span className="block text-[40px] font-bold leading-none">
                {LEGACY_MESSAGES.badgeNumber}
              </span>
              <span
                className="block text-[11px] font-semibold uppercase tracking-[0.1em]
                           text-white/70 mt-[4px]"
              >
                {LEGACY_MESSAGES.badgeLabel}
              </span>
            </div>
          </div>

          {/* Right — content */}
          <div>
            <span className="section-eyebrow">
              {LEGACY_MESSAGES.eyebrow}
            </span>

            <h2 id="legacy-heading" className="pub-section-heading mb-[20px]">
              {LEGACY_MESSAGES.heading}
            </h2>

            <p className="section-body-text mb-[16px]">
              {LEGACY_MESSAGES.body1}
            </p>
            <p className="section-body-text mb-[40px] sm:mb-[32px]">
              {LEGACY_MESSAGES.body2}
            </p>

            <Link href="/#about" className="btn-primary-fill">
              {LEGACY_MESSAGES.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
