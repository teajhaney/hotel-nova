import type { Metadata } from 'next';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { MobileBottomNav } from '@/components/home/MobileBottomNav';
import { AboutHero } from '@/components/about/AboutHero';
import { OurStory } from '@/components/about/OurStory';
import { OurValues } from '@/components/about/OurValues';
import { TeamHighlight } from '@/components/about/TeamHighlight';
import { LocationSection } from '@/components/about/LocationSection';

export const metadata: Metadata = {
  title: 'About Us | HotelNova - The Grand Oasis Abuja',
  description:
    'Discover the intersection of Nigerian heritage and contemporary elegance. Learn about our story, values, and the dedicated team at The Grand Oasis Abuja.',
};

export default function AboutPage() {
  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <AboutHero />
        <OurStory />
        <OurValues />
        <TeamHighlight />
        <LocationSection />
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
