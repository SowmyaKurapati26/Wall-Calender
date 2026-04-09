'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DayCellProps } from '@/types/calendar';
import { getHoliday } from '@/utils/calendarHelpers';

export default function DayCell({
  date, currentMonth, isToday, isWeekend,
  isInRange, isRangeStart, isRangeEnd,
  accentColor, onClick, hasNote,
}: DayCellProps) {
  const [hovered, setHovered] = useState(false);
  const inMonth = date.getMonth() === currentMonth;
  const holiday = getHoliday(date);

  const { h, s, l } = accentColor.hsl;
  const accent = `hsl(${h}, ${s}%, ${l}%)`;
  const accentSoft = `hsla(${h}, ${s}%, ${l}%, 0.15)`;
  const accentMid = `hsla(${h}, ${s}%, ${l}%, 0.25)`;

  const cellStyle = (() => {
    if (!inMonth) return { backgroundColor: 'transparent', color: 'rgba(128,128,128,0.3)' };
    if (isRangeStart || isRangeEnd) return { backgroundColor: accent, color: '#fff', boxShadow: `0 4px 14px hsla(${h}, ${s}%, ${l}%, 0.4)` };
    if (isInRange) return { backgroundColor: accentSoft, color: accent };
    if (isToday) return { backgroundColor: accentMid, color: accent, fontWeight: 700 as const };
    return { backgroundColor: hovered ? accentSoft : 'transparent', color: isWeekend ? `hsla(${h}, 40%, 55%, 0.7)` : undefined };
  })();

  // Connected range look: round on edges, flat in the middle
  const borderRadius = (() => {
    if (isRangeStart && isRangeEnd) return '12px';
    if (isRangeStart) return '12px 4px 4px 12px';
    if (isRangeEnd) return '4px 12px 12px 4px';
    if (isInRange) return '4px';
    return '12px';
  })();

  return (
    <motion.button
      onClick={() => inMonth && onClick(date)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative aspect-square flex flex-col items-center justify-center text-sm font-medium cursor-pointer disabled:cursor-default focus:outline-none"
      style={{ ...cellStyle, borderRadius }}
      whileHover={inMonth ? { scale: 1.08 } : undefined}
      whileTap={inMonth ? { scale: 0.92 } : undefined}
      disabled={!inMonth}
      layout
    >
      <span className="relative z-10">{date.getDate()}</span>

      {isToday && !isRangeStart && !isRangeEnd && (
        <motion.div
          className="absolute bottom-1 w-1 h-1 rounded-full"
          style={{ backgroundColor: accent }}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        />
      )}

      {holiday && inMonth && (
        <motion.div
          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          title={holiday.name}
        />
      )}

      {hasNote && inMonth && (
        <motion.div
          className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
        />
      )}

      {holiday && hovered && inMonth && (
        <motion.div
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="absolute -top-9 left-1/2 -translate-x-1/2 z-50 px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap shadow-lg bg-gray-900 text-white"
        >
          {holiday.name}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}

      {hasNote && hovered && inMonth && !holiday && (
        <motion.div
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap shadow-lg bg-gray-900 text-white"
        >
          Has notes
        </motion.div>
      )}
    </motion.button>
  );
}
