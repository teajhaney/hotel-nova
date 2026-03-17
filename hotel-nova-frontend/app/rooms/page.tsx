import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { MobileBottomNav } from '@/components/home/MobileBottomNav';
import { RoomsContent } from '@/components/rooms/RoomsContent';

export default function RoomsPage() {
  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="bg-[#F8FAFC] min-h-screen">
        <RoomsContent />
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
