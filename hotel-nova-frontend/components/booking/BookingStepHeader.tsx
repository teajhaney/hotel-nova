import React from 'react';

interface BookingStepHeaderProps {
  eyebrow: string;
  title: string;
  rightLabel?: string;
  rightValue?: string;
  percent?: number;
  subtitle?: string;
}

export function BookingStepHeader({
  eyebrow,
  title,
  rightLabel,
  rightValue,
  percent = 0,
  subtitle,
}: BookingStepHeaderProps) {
  return (
    <div className="booking-step-header">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="booking-step-eyebrow">{eyebrow}</span>
          <h1 className="booking-step-title">{title}</h1>
        </div>
        {(rightLabel || rightValue) && (
          <div className="text-right hidden sm:block">
            {rightLabel && <p className="text-[13px] text-[#64748B]">{rightLabel}</p>}
            {rightValue && <p className="text-[20px] font-bold text-[#020887]">{rightValue}</p>}
          </div>
        )}
      </div>
      <div className="booking-progress-track">
        <div className="booking-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      {subtitle && <p className="mt-2 text-[13px] text-[#64748B]">{subtitle}</p>}
    </div>
  );
}
