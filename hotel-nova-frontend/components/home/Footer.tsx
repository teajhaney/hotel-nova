import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { HotelNovaLogo } from '@/components/auth/HotelNovaLogo';
import { POLICY_LINKS, QUICK_LINKS, SOCIAL_LINKS } from '@/constants/dummyData';
import { BRAND, FOOTER_MESSAGES } from '@/constants/messages';

export function Footer() {
  return (
    <footer
      className="bg-[#0D0F2B] text-white pb-[72px] lg:pb-0"
      id="contact"
      aria-label="Site footer"
    >
      <div className="page-container py-[64px] md:py-[48px]">
        <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-[40px] xl:gap-[48px]">
          {/* Column 1 — Brand + social */}
          <div className="lg:col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-[8px] mb-[16px]"
              aria-label={BRAND.logoAriaLabel}
            >
              <HotelNovaLogo />
              <span className="text-white font-semibold text-[18px] tracking-tight">
                {BRAND.name}
              </span>
            </Link>

            <p className="text-[14px] text-white/50 leading-relaxed max-w-[280px] mb-[24px]">
              {FOOTER_MESSAGES.tagline}
            </p>

            <div className="flex gap-[10px]" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-[34px] h-[34px] rounded-[6px]
                             border border-white/20
                             flex items-center justify-center
                             text-white/50 hover:text-white hover:border-white/40
                             transition-colors duration-150"
                >
                  <Icon size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3
              className="text-[12px] font-semibold uppercase tracking-[0.1em]
                         text-white/35 mb-[18px]"
            >
              {FOOTER_MESSAGES.quickLinksHeading}
            </h3>
            <ul className="flex flex-col gap-[11px] list-none m-0 p-0" role="list">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[14px] text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Policies */}
          <div>
            <h3
              className="text-[12px] font-semibold uppercase tracking-[0.1em]
                         text-white/35 mb-[18px]"
            >
              {FOOTER_MESSAGES.policiesHeading}
            </h3>
            <ul className="flex flex-col gap-[11px] list-none m-0 p-0" role="list">
              {POLICY_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[14px] text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact Us */}
          <div>
            <h3
              className="text-[12px] font-semibold uppercase tracking-[0.1em]
                         text-white/35 mb-[18px]"
            >
              {FOOTER_MESSAGES.contactHeading}
            </h3>
            <address className="not-italic flex flex-col gap-[12px]">
              <div className="flex items-start gap-[8px]">
                <MapPin size={14} className="shrink-0 mt-[2px] text-[#7CA5B8]" aria-hidden="true" />
                <span className="text-[14px] text-white/55 leading-relaxed">
                  {FOOTER_MESSAGES.address}
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <Phone size={14} className="shrink-0 text-[#7CA5B8]" aria-hidden="true" />
                <span className="text-[14px] text-white/55">
                  {FOOTER_MESSAGES.phone}
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <Mail size={14} className="shrink-0 text-[#7CA5B8]" aria-hidden="true" />
                <a
                  href={`mailto:${FOOTER_MESSAGES.email}`}
                  className="text-[14px] text-white/55 hover:text-white transition-colors"
                >
                  {FOOTER_MESSAGES.email}
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-[48px] pt-[24px] border-t border-white/10
                     flex items-center justify-between
                     sm:flex-col sm:gap-[8px] sm:text-center"
        >
          <p className="text-[13px] text-white/30">
            {FOOTER_MESSAGES.copyright}
          </p>
          <p className="text-[13px] text-white/30">
            {FOOTER_MESSAGES.companyName}
          </p>
        </div>
      </div>
    </footer>
  );
}
