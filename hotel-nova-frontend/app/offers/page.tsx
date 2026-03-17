import type { Metadata } from 'next';
import { ChevronRight, Link, MapPin } from 'lucide-react';
import { OffersContent } from '@/components/offers/OffersContent';
import { OffersNewsletter } from '@/components/offers/OffersNewsletter';
import { OFFERS_PAGE_MESSAGES } from '@/constants/messages';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { MobileBottomNav } from '@/components/home/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Exclusive Offers | HotelNova - The Grand Oasis Abuja',
  description:
    "Curated experiences and seasonal packages designed for your perfect stay in Nigeria's capital city. Book now and save on your next luxury getaway.",
};

export default function OffersPage() {
  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <Navbar />
      <main>
        {/* Breadcrumbs & Location */}
        <section className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="page-container py-6">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-[13px]">
                <li>
                  <Link
                    href="/"
                    className="text-[#64748B] hover:text-[#020887] transition-colors"
                  >
                    {OFFERS_PAGE_MESSAGES.breadcrumbHotels}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} className="text-[#CBD5E1]" />
                </li>
                <li>
                  <span className="text-[#64748B]">
                    {OFFERS_PAGE_MESSAGES.breadcrumbNigeria}
                  </span>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} className="text-[#CBD5E1]" />
                </li>
                <li>
                  <span className="text-[#0D0F2B] font-medium">
                    {OFFERS_PAGE_MESSAGES.breadcrumbAbuja}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Location Info */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-[24px] md:text-[28px] font-bold text-[#0D0F2B]">
                    {OFFERS_PAGE_MESSAGES.locationName}
                  </h1>
                  <span className="inline-block px-2.5 py-1 bg-[#DBEAFE] text-[#1E40AF] text-[11px] font-semibold uppercase rounded">
                    {OFFERS_PAGE_MESSAGES.locationBadge}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-[14px] text-[#64748B]">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{OFFERS_PAGE_MESSAGES.locationAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offers Content */}
        <OffersContent />

        {/* Newsletter */}
        <OffersNewsletter />
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
