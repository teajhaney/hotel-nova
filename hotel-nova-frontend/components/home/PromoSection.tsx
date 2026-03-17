import Image from 'next/image';
import Link from 'next/link';
import { HOME_IMAGES } from '@/constants/images';
import { PROMO_MESSAGES } from '@/constants/messages';

export function PromoSection() {
  return (
    <section aria-labelledby="promo-heading">
      <div className="relative h-[460px] md:h-[400px] sm:h-[380px] overflow-hidden">
        <Image
          src={HOME_IMAGES.promo}
          fill
          alt=""
          className="object-cover object-center"
        />

        {/* Deep navy overlay */}
        <div className="absolute inset-0 bg-[#020887]/82" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-[20px]">
          <h2
            id="promo-heading"
            className="text-[42px] md:text-[34px] sm:text-[28px]
                       font-bold text-white leading-tight max-w-[620px]"
          >
            {PROMO_MESSAGES.heading}
          </h2>

          <p
            className="mt-[16px] text-[17px] sm:text-[15px] text-white/72
                       max-w-[500px] leading-relaxed"
          >
            {PROMO_MESSAGES.description}
          </p>

          <div className="flex items-center gap-[16px] mt-[36px] sm:flex-col sm:w-full sm:max-w-[280px]">
            <Link href="/rooms" className="btn-outline-white sm:w-full">
              {PROMO_MESSAGES.ctaPrimary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
