import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

// MobileBottomNav is intentionally excluded from booking pages —
// the wizard has its own fixed CTA bars at the bottom on mobile.
export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="bg-[#F8FAFC] min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
