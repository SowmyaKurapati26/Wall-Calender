'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DayCell from './DayCell';
import { DateRange, DominantColor, CalendarNote } from '@/types/calendar';
import {
  generateCalendarDays, isSameDay, isWeekend,
  isDateInRange, formatDateISO, DAY_LABELS,
} from '@/utils/calendarHelpers';

interface CalendarGridProps {
  month: number;
  year: number;
  dateRange: DateRange;
  onDateClick: (date: Date) => void;
  accentColor: DominantColor;
  isDark: boolean;
  direction: number;
  notes: CalendarNote[];
}

const gridVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40, rotateY: dir > 0 ? -5 : 5 }),
  center: { opacity: 1, x: 0, rotateY: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, rotateY: dir > 0 ? 5 : -5 }),
};

export default function CalendarGrid({
  month, year, dateRange, onDateClick, accentColor, isDark, direction, notes,
}: CalendarGridProps) {
  const today = useMemo(() => new Date(), []);
  const days = generateCalendarDays(year, month);

  // Build a set of ISO dates that have notes so DayCell lookups are O(1)
  const datesWithNotes = useMemo(() => {
    const set = new Set<string>();
    for (const note of notes) {
      const cursor = new Date(note.startDate + 'T00:00:00');
      const end = new Date(note.endDate + 'T00:00:00');
      while (cursor <= end) {
        set.add(formatDateISO(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return set;
  }, [notes]);

  const { h, s } = accentColor.hsl;

  return (
    <div style={{ perspective: 1200 }}>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_LABELS.map((label, i) => (
          <div
            key={label}
            className="text-center text-xs font-semibold py-2 uppercase tracking-wider"
            style={{
              color: i === 0 || i === 6
                ? `hsla(${h}, 40%, 55%, 0.6)`
                : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${month}-${year}`}
          custom={direction}
          variants={gridVariants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-7 gap-1"
        >
          {days.map((date, i) => {
            let isRangeStart = false;
            let isRangeEnd = false;
            let inRange = false;

            if (dateRange.start && dateRange.end) {
              isRangeStart = isSameDay(date, dateRange.start);
              isRangeEnd = isSameDay(date, dateRange.end);
              inRange = !isRangeStart && !isRangeEnd && isDateInRange(date, dateRange.start, dateRange.end);
            } else if (dateRange.start) {
              isRangeStart = isSameDay(date, dateRange.start);
            }

            return (
              <DayCell
                key={`${date.toISOString()}-${i}`}
                date={date}
                currentMonth={month}
                isToday={isSameDay(date, today)}
                isWeekend={isWeekend(date)}
                isInRange={inRange}
                isRangeStart={isRangeStart}
                isRangeEnd={isRangeEnd}
                accentColor={accentColor}
                onClick={onDateClick}
                hasNote={datesWithNotes.has(formatDateISO(date))}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
