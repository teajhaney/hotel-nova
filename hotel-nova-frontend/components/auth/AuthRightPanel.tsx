'use client';

import Image from 'next/image';
import { AUTH_PANEL_MESSAGES } from '@/constants/messages';
import { AUTH_IMAGES } from '@/constants/images';

type Variant = 'login' | 'signup';

interface AuthRightPanelProps {
  variant: Variant;
}

/** Five outlined stars — gold for signup, white/soft for login */
function StarRating({ variant }: { variant: Variant }) {
  return (
    <div className="flex gap-1" aria-label={AUTH_PANEL_MESSAGES[variant].starRatingLabel}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={variant === 'signup' ? 'rgba(255,200,50,0.85)' : 'rgba(255,255,255,0.55)'}
            stroke={variant === 'signup' ? 'rgba(255,200,50,0.3)' : 'none'}
            strokeWidth="0.5"
          />
        </svg>
      ))}
    </div>
  );
}

/** Login panel overlay content */
function LoginOverlay() {
  const m = AUTH_PANEL_MESSAGES.login;
  return (
    <div className="auth-panel-overlay">
      <div className="flex items-center gap-3 mb-4">
        <StarRating variant="login" />
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/70">
          {m.badge}
        </span>
      </div>
      <h2 className="auth-panel-title mb-3">
        {m.title.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < m.title.split('\n').length - 1 && <br />}
          </span>
        ))}
      </h2>
      <p className="auth-panel-subtitle">{m.subtitle}</p>
    </div>
  );
}

/** Signup panel overlay content */
function SignupOverlay() {
  const m = AUTH_PANEL_MESSAGES.signup;
  return (
    <div className="auth-panel-overlay">
      <div className="mb-4">
        <StarRating variant="signup" />
      </div>
      <h2 className="auth-panel-title mb-2">{m.hotelName}</h2>
      <p className="auth-panel-subtitle mb-7">{m.subtitle}</p>
      <div className="flex items-start gap-10">
        {m.stats.map(stat => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-[26px] font-bold text-white leading-tight">{stat.value}</span>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-white/60">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Shared right-side image panel for all auth pages.
 * Switch `variant` to get the correct image + overlay copy.
 */
export function AuthRightPanel({ variant }: AuthRightPanelProps) {
  const imageSrc = variant === 'login' ? AUTH_IMAGES.loginPanel : AUTH_IMAGES.signupPanel;
  const imageAlt = AUTH_PANEL_MESSAGES[variant].imageAlt;
  const gradientClass =
    variant === 'login'
      ? 'bg-linear-to-t from-black/70 via-black/20 to-black/5'
      : 'bg-linear-to-t from-[#020887]/80 via-[#020887]/30 to-black/10';

  return (
    <aside aria-hidden="true" className="auth-right-panel">
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover" priority sizes="53vw" />
      <div className={`absolute inset-0 ${gradientClass}`} />
      {variant === 'login' ? <LoginOverlay /> : <SignupOverlay />}
    </aside>
  );
}
