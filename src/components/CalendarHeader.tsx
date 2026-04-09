'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MONTH_NAMES } from '@/utils/calendarHelpers';

interface CalendarHeaderProps {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  direction: number;
  accentHsl: string;
  isDark: boolean;
}

const flipVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 30 : -30,
    opacity: 0,
    rotateX: dir > 0 ? -15 : 15,
  }),
  center: { y: 0, opacity: 1, rotateX: 0 },
  exit: (dir: number) => ({
    y: dir > 0 ? -30 : 30,
    opacity: 0,
    rotateX: dir > 0 ? 15 : -15,
  }),
};

export default function CalendarHeader({
  month, year, onPrev, onNext, direction, accentHsl, isDark,
}: CalendarHeaderProps) {
  const navBtnStyle = {
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
  };

  return (
    <div className="flex items-center justify-between mb-6 px-1">
      <motion.button
        onClick={onPrev}
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={navBtnStyle}
        whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Previous month"
        id="prev-month-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </motion.button>

      <div className="flex-1 text-center overflow-hidden" style={{ perspective: 600 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${month}-${year}`}
            custom={direction}
            variants={flipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: accentHsl }}>
              {MONTH_NAMES[month]}
            </h2>
            <p className="text-sm font-medium mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>
              {year}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button
        onClick={onNext}
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={navBtnStyle}
        whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}
        whileTap={{ scale: 0.9 }}
        aria-label="Next month"
        id="next-month-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </motion.button>
    </div>
  );
}
