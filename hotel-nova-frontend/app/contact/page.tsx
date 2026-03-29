import { SkeletonImage as Image } from '@/components/ui/SkeletonImage';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Navbar } from '@/components/home/Navbar';
import { Footer } from '@/components/home/Footer';
import { MobileBottomNav } from '@/components/home/MobileBottomNav';
import { ContactForm } from '@/components/home/ContactForm';
import { CONTACT_PAGE_MESSAGES } from '@/constants/messages';
import { CONTACT_IMAGES } from '@/constants/images';

export default function ContactPage() {
  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative h-[320px] md:h-[380px] flex items-center justify-center overflow-hidden">
          <Image
            src={CONTACT_IMAGES.hero}
            alt="Contact The Grand Oasis Abuja"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020887]/70 via-[#020887]/60 to-[#020887]/70" />

          <div className="relative z-10 page-container text-center text-white">
            <h1 className="text-[42px] md:text-[56px] lg:text-[64px] font-bold leading-tight mb-4">
              {CONTACT_PAGE_MESSAGES.heroTitle}
            </h1>
            <p className="text-[16px] md:text-[18px] leading-relaxed text-white/90 max-w-2xl mx-auto">
              {CONTACT_PAGE_MESSAGES.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Form and Contact Info Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="page-container">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
              {/* Left: Contact Form */}
              <div>
                <h2 className="text-[32px] md:text-[36px] font-bold text-[#0D0F2B] mb-8">
                  {CONTACT_PAGE_MESSAGES.formHeading}
                </h2>
                <ContactForm />
              </div>

              {/* Right: Contact Info Cards */}
              <div className="space-y-6">
                {/* Location */}
                <div className="bg-[#F8FAFC] rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] flex items-center justify-center mb-4">
                    <MapPin size={24} className="text-[#020887]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#0D0F2B] mb-2">
                    {CONTACT_PAGE_MESSAGES.infoLocationTitle}
                  </h3>
                  <p className="text-[15px] text-[#64748B]">
                    {CONTACT_PAGE_MESSAGES.infoLocationAddress}
                  </p>
                </div>

                {/* Phone */}
                <div className="bg-[#F8FAFC] rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] flex items-center justify-center mb-4">
                    <Phone size={24} className="text-[#020887]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#0D0F2B] mb-2">
                    {CONTACT_PAGE_MESSAGES.infoPhoneTitle}
                  </h3>
                  <p className="text-[15px] text-[#64748B] mb-1">
                    {CONTACT_PAGE_MESSAGES.infoPhone1}
                  </p>
                  <p className="text-[15px] text-[#64748B]">
                    {CONTACT_PAGE_MESSAGES.infoPhone2}
                  </p>
                </div>

                {/* Email */}
                <div className="bg-[#F8FAFC] rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] flex items-center justify-center mb-4">
                    <Mail size={24} className="text-[#020887]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#0D0F2B] mb-2">
                    {CONTACT_PAGE_MESSAGES.infoEmailTitle}
                  </h3>
                  <p className="text-[15px] text-[#64748B] mb-1">
                    {CONTACT_PAGE_MESSAGES.infoEmail1}
                  </p>
                  <p className="text-[15px] text-[#64748B]">
                    {CONTACT_PAGE_MESSAGES.infoEmail2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="relative h-[400px] bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE]">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <MapPin size={56} className="text-[#020887] mb-4" />
            <p className="text-[18px] font-bold text-[#0D0F2B] mb-2">
              {CONTACT_PAGE_MESSAGES.mapTitle}
            </p>
            <button className="px-6 py-2.5 bg-[#020887] text-white font-semibold text-[14px] rounded-lg hover:bg-[#030A6F] transition-colors">
              {CONTACT_PAGE_MESSAGES.mapCta}
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
