import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { ABOUT_PAGE_MESSAGES } from '@/constants/messages';
import { ABOUT_IMAGES } from '@/constants/images';

export function AboutHero() {
  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={ABOUT_IMAGES.hero}
        alt="The Grand Oasis Abuja exterior"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020887]/60 via-[#020887]/50 to-[#020887]/70" />

      {/* Content */}
      <div className="relative z-10 page-container text-center text-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-[13px] md:text-[14px] font-semibold tracking-[0.2em] uppercase mb-4">
            {ABOUT_PAGE_MESSAGES.heroEyebrow}
          </p>
          <h1 className="text-[48px] md:text-[64px] lg:text-[72px] font-bold leading-tight mb-6">
            {ABOUT_PAGE_MESSAGES.heroTitle}
          </h1>
          <p className="text-[17px] md:text-[19px] lg:text-[21px] leading-relaxed text-white/90 max-w-3xl mx-auto">
            {ABOUT_PAGE_MESSAGES.heroSubtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
