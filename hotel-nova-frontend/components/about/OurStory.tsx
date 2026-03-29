import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { ABOUT_PAGE_MESSAGES } from '@/constants/messages';
import { ABOUT_IMAGES } from '@/constants/images';

export function OurStory() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <div className="mb-4">
              <h2 className="text-[36px] md:text-[42px] lg:text-[48px] font-bold text-[#020887] leading-tight">
                {ABOUT_PAGE_MESSAGES.storyHeading}
              </h2>
              <div className="w-20 h-1 bg-[#020887] mt-4" />
            </div>

            <div className="space-y-5">
              <p className="text-[16px] md:text-[17px] text-[#475569] leading-relaxed">
                {ABOUT_PAGE_MESSAGES.storyParagraph1}
              </p>
              <p className="text-[16px] md:text-[17px] text-[#475569] leading-relaxed">
                {ABOUT_PAGE_MESSAGES.storyParagraph2}
              </p>
            </div>
          </div>

          {/* Right: Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Image */}
              <div className="relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden">
                <Image
                  src={ABOUT_IMAGES.storyRoom}
                  alt="Luxury hotel room"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Bottom Image - offset */}
              <div className="relative h-[280px] md:h-[320px] rounded-2xl overflow-hidden mt-8">
                <Image
                  src={ABOUT_IMAGES.storyLounge}
                  alt="Hotel lounge area"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
