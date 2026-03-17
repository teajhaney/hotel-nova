import { Heart, Star, Shield } from 'lucide-react';
import { ABOUT_PAGE_MESSAGES } from '@/constants/messages';

const values = [
  {
    icon: Heart,
    title: ABOUT_PAGE_MESSAGES.value1Title,
    description: ABOUT_PAGE_MESSAGES.value1Description,
  },
  {
    icon: Star,
    title: ABOUT_PAGE_MESSAGES.value2Title,
    description: ABOUT_PAGE_MESSAGES.value2Description,
  },
  {
    icon: Shield,
    title: ABOUT_PAGE_MESSAGES.value3Title,
    description: ABOUT_PAGE_MESSAGES.value3Description,
  },
];

export function OurValues() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#F8FAFC]">
      <div className="page-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-[36px] md:text-[42px] lg:text-[48px] font-bold text-[#0D0F2B] leading-tight mb-4">
            {ABOUT_PAGE_MESSAGES.valuesHeading}
          </h2>
          <p className="text-[16px] md:text-[17px] text-[#64748B] leading-relaxed">
            {ABOUT_PAGE_MESSAGES.valuesSubtitle}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[#E0E7FF] flex items-center justify-center mb-6">
                  <Icon size={28} className="text-[#020887]" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="text-[22px] md:text-[24px] font-bold text-[#0D0F2B] mb-3">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-[15px] md:text-[16px] text-[#64748B] leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
