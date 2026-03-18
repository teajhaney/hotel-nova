'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

interface CalendarMonthProps {
  year: number;
  month: number;
  checkIn: Date | null;
  checkOut: Date | null;
  hoverDate: Date | null;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | null) => void;
  minDate: Date;
}

function CalendarMonth({
  year, month, checkIn, checkOut, hoverDate,
  onDayClick, onDayHover, minDate,
}: CalendarMonthProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells: (Date | null)[] = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const rangeEnd = checkIn && !checkOut ? hoverDate : checkOut;

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[15px] font-semibold text-[#0D0F2B] text-center mb-4">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-[12px] font-semibold text-[#64748B] text-center py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;

          const isDisabled = date < minDate;
          const isStart = checkIn && !isDisabled &&
            date.getFullYear() === checkIn.getFullYear() &&
            date.getMonth() === checkIn.getMonth() &&
            date.getDate() === checkIn.getDate();
          const isEnd = checkOut &&
            date.getFullYear() === checkOut.getFullYear() &&
            date.getMonth() === checkOut.getMonth() &&
            date.getDate() === checkOut.getDate();
          const inRange = checkIn && rangeEnd && !isDisabled &&
            date > checkIn && date < rangeEnd;

          const classNames = [
            'relative flex items-center justify-center h-9 text-[14px] cursor-pointer select-none transition-colors duration-100',
            isDisabled ? 'text-[#CBD5E1] cursor-default' : 'hover:bg-[#E8EAFF] rounded-full',
            isStart || isEnd ? 'bg-[#020887] text-white rounded-full font-semibold z-10' : '',
            inRange ? 'bg-[#EEF0FF] text-[#020887] rounded-none' : '',
            !isStart && !isEnd && !inRange && !isDisabled ? 'text-[#0D0F2B]' : '',
          ].filter(Boolean).join(' ');

          return (
            <div
              key={i}
              className={classNames}
              onClick={() => !isDisabled && onDayClick(date)}
              onMouseEnter={() => !isDisabled && onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              role="button"
              aria-label={toDateStr(date)}
              aria-pressed={!!(isStart || isEnd)}
              tabIndex={isDisabled ? -1 : 0}
              onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) onDayClick(date); }}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DateRangePickerProps {
  checkIn: string | null;
  checkOut: string | null;
  onChange: (checkIn: string | null, checkOut: string | null) => void;
}

export function DateRangePicker({ checkIn, checkOut, onChange }: DateRangePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const checkInDate = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);

  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  function handleDayClick(date: Date) {
    if (!checkInDate || (checkInDate && checkOutDate)) {
      // Start fresh selection
      onChange(toDateStr(date), null);
    } else {
      // checkIn set, no checkOut yet
      if (date <= checkInDate) {
        onChange(toDateStr(date), null);
      } else {
        onChange(checkIn, toDateStr(date));
      }
    }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonthNav() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const selectedLabel = checkIn && checkOut
    ? `${checkIn.slice(5).replace('-', '/')} - ${checkOut.slice(5).replace('-', '/')}`
    : checkIn ? checkIn.slice(5).replace('-', '/') : null;

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-semibold text-[#0D0F2B]">Select Dates</h2>
        <div className="flex items-center gap-3">
          {selectedLabel && (
            <span className="text-[13px] font-medium text-[#020887] md:hidden">{selectedLabel}</span>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} className="text-[#64748B]" />
            </button>
            <button
              onClick={nextMonthNav}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F1F5F9] transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={16} className="text-[#64748B]" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: 2 months side by side */}
      <div className="hidden md:flex gap-8">
        <CalendarMonth
          year={viewYear} month={viewMonth}
          checkIn={checkInDate} checkOut={checkOutDate}
          hoverDate={hoverDate}
          onDayClick={handleDayClick} onDayHover={setHoverDate}
          minDate={today}
        />
        <div className="w-px bg-[#E2E8F0]" />
        <CalendarMonth
          year={nextYear} month={nextMonth}
          checkIn={checkInDate} checkOut={checkOutDate}
          hoverDate={hoverDate}
          onDayClick={handleDayClick} onDayHover={setHoverDate}
          minDate={today}
        />
      </div>

      {/* Mobile: 1 month */}
      <div className="md:hidden">
        <CalendarMonth
          year={viewYear} month={viewMonth}
          checkIn={checkInDate} checkOut={checkOutDate}
          hoverDate={hoverDate}
          onDayClick={handleDayClick} onDayHover={setHoverDate}
          minDate={today}
        />
      </div>
    </div>
  );
}
