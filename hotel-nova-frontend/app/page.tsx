import { Navbar } from '@/components/home/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedRoomsSection } from '@/components/home/FeaturedRoomsSection';
import { AmenitiesSection } from '@/components/home/AmenitiesSection';
import { LegacySection } from '@/components/home/LegacySection';
import { PromoSection } from '@/components/home/PromoSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { Footer } from '@/components/home/Footer';
import { MobileBottomNav } from '@/components/home/MobileBottomNav';

export default function HomePage() {
  return (
    <>
      {/* Accessibility — skip to main content */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <HeroSection />
        <FeaturedRoomsSection />
        <AmenitiesSection />
        <LegacySection />
        <PromoSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>

      <Footer />

      {/* Fixed bottom nav — mobile only (lg:hidden inside component) */}
      <MobileBottomNav />
    </>
  );
}
