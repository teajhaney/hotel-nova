import { MapPin, Phone, Mail } from 'lucide-react';
import { ABOUT_PAGE_MESSAGES } from '@/constants/messages';

export function LocationSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#F8FAFC]">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="text-[36px] md:text-[42px] lg:text-[48px] font-bold text-[#0D0F2B] leading-tight mb-4">
              {ABOUT_PAGE_MESSAGES.locationHeading}
            </h2>
            <p className="text-[16px] md:text-[17px] text-[#64748B] leading-relaxed mb-10">
              {ABOUT_PAGE_MESSAGES.locationSubtitle}
            </p>

            {/* Address */}
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-2">
                <MapPin size={20} className="text-[#020887] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-[18px] font-bold text-[#0D0F2B] mb-1">
                    {ABOUT_PAGE_MESSAGES.locationAddressLabel}
                  </h3>
                  <p className="text-[15px] text-[#64748B]">
                    {ABOUT_PAGE_MESSAGES.locationAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-[#020887] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-[18px] font-bold text-[#0D0F2B] mb-2">
                    {ABOUT_PAGE_MESSAGES.locationContactLabel}
                  </h3>
                  <p className="text-[15px] text-[#64748B] mb-1">
                    {ABOUT_PAGE_MESSAGES.locationPhone}
                  </p>
                  <p className="text-[15px] text-[#64748B]">
                    {ABOUT_PAGE_MESSAGES.locationEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map Placeholder */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] shadow-lg">
            {/* Placeholder for Google Maps */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-[#020887] mx-auto mb-3" />
                <p className="text-[#475569] font-medium">Map Location</p>
                <p className="text-[14px] text-[#64748B] mt-1">Garki, Abuja, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
