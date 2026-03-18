import { Wifi, Waves, Sparkles, UtensilsCrossed, Dumbbell, Car, Building2, BellRing } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AMENITIES_MESSAGES } from '@/constants/messages';

type AmenityItem = {
  icon: LucideIcon;
  label: string;
};

const AMENITIES: AmenityItem[] = [
  { icon: Wifi,            label: 'Ultra-Fast Wi-Fi'  },
  { icon: Waves,           label: 'Infinity Pool'     },
  { icon: Sparkles,        label: 'Luxury Spa'        },
  { icon: UtensilsCrossed, label: 'Fine Dining'       },
  { icon: Dumbbell,        label: 'Fitness Center'    },
  { icon: Car,             label: 'Free Valet'        },
  { icon: Building2,       label: 'Conference Hub'    },
  { icon: BellRing,        label: '24/7 Concierge'   },
];

export function AmenitiesSection() {
  return (
    <section
      className="section-pad bg-[#A9DBBB]/30"
      id="amenities"
      aria-labelledby="amenities-heading"
    >
      <div className="page-container">
        {/* Section header — centered */}
        <div className="text-center mb-[48px] sm:mb-[32px]">
          <span className="section-eyebrow text-[#38369A]">
            {AMENITIES_MESSAGES.eyebrow}
          </span>
          <h2 id="amenities-heading" className="pub-section-heading">
            {AMENITIES_MESSAGES.heading}
          </h2>
        </div>

        {/* 4 × 2 icon tile grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-[16px]">
          {AMENITIES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center
                         bg-white rounded-[12px]
                         px-[16px] py-[24px]
                         shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                         hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]
                         transition-shadow duration-200"
            >
              <div
                className="w-[52px] h-[52px] rounded-[999px]
                           bg-[#A9DBBB]/50 flex items-center justify-center
                           mb-[12px]"
                aria-hidden="true"
              >
                <Icon size={24} className="text-[#020887]" />
              </div>

              <span className="text-[14px] font-semibold text-[#0D0F2B] leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
