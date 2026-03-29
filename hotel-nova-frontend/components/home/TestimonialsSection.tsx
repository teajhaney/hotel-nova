import { Star } from 'lucide-react';
import { TESTIMONIALS_MESSAGES } from '@/constants/messages';
import { TESTIMONIALS } from '@/constants/dummyData';

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div
      className="flex gap-0.5"
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={
            i < rating
              ? 'text-[#F97316] fill-[#F97316]'
              : 'text-[#E2E8F0] fill-[#E2E8F0]'
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section
      className="section-pad bg-[#F8FAFC]"
      aria-labelledby="testimonials-heading"
    >
      <div className="page-container">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-9">
          <span className="section-eyebrow">
            {TESTIMONIALS_MESSAGES.eyebrow}
          </span>
          <h2 id="testimonials-heading" className="pub-section-heading">
            {TESTIMONIALS_MESSAGES.heading}
          </h2>
        </div>

        {/* Review cards */}
        <div className="grid  grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(
            ({ id, name, role, rating, review, avatarColor, profileImage }) => (
              <article key={id} className="hotel-card p-7 flex flex-col">
                <StarRating rating={rating} />

                <blockquote className="mt-3.5 text-[15px] text-[#64748B] leading-relaxed flex-1">
                  &ldquo;{review}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 mt-5">
                  {profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileImage}
                      alt={name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full ${avatarColor} shrink-0`}
                      aria-hidden="true"
                    />
                  )}
                  <div>
                    <p className="text-[15px] font-semibold text-[#0D0F2B] leading-tight">
                      {name}
                    </p>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                      {role}
                    </p>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
