import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';

export const metadata = {
  title: 'Coming Soon — HotelNova',
  description: 'This page is under construction. Check back soon.',
};

export default function ComingSoonPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#EEF0FF] flex items-center justify-center mx-auto mb-6">
            <Construction size={28} className="text-[#020887]" />
          </div>

          <h1 className="text-[28px] font-bold text-[#0D0F2B] mb-3">
            Coming Soon
          </h1>
          <p className="text-[15px] text-[#64748B] leading-relaxed mb-8">
            We&apos;re working hard to bring this page to life. Check back soon
            for updates, or head back to our homepage.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#020887] text-white text-[14px] font-semibold hover:bg-[#38369A] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
