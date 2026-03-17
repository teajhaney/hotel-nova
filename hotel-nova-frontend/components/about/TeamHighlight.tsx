import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ABOUT_PAGE_MESSAGES } from '@/constants/messages';
import { TEAM_MEMBERS } from '@/constants/dummyData';

export function TeamHighlight() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-12">
          <div className="flex-1">
            <h2 className="text-[36px] md:text-[42px] lg:text-[48px] font-bold text-[#0D0F2B] leading-tight mb-4">
              {ABOUT_PAGE_MESSAGES.teamHeading}
            </h2>
            <p className="text-[16px] md:text-[17px] text-[#64748B] leading-relaxed max-w-2xl">
              {ABOUT_PAGE_MESSAGES.teamSubtitle}
            </p>
          </div>

          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 text-[15px] font-semibold text-[#020887] hover:gap-3 transition-all"
          >
            {ABOUT_PAGE_MESSAGES.teamCta}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="group">
              {/* Image */}
              <div className={`relative h-[360px] rounded-2xl overflow-hidden mb-4 ${member.bgColor || 'bg-gray-200'}`}>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Info */}
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#0D0F2B] mb-1">
                {member.name}
              </h3>
              <p className="text-[15px] text-[#64748B]">{member.role}</p>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden text-center mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#020887]"
          >
            {ABOUT_PAGE_MESSAGES.teamCta}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
