'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import ThemeToggle from './ThemeToggle';
import { DateRange, CalendarNote, DominantColor } from '@/types/calendar';
import { isSameDay } from '@/utils/calendarHelpers';
import { extractDominantColor } from '@/utils/colorExtractor';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const DEFAULT_ACCENT: DominantColor = {
  r: 200, g: 130, b: 60,
  hex: '#c8823c',
  hsl: { h: 28, s: 65, l: 50 },
};

export default function CalendarContainer() {
  const now = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [direction, setDirection] = useState(0);
  const [accentColor, setAccentColor] = useState<DominantColor>(DEFAULT_ACCENT);
  const [isDark, setIsDark] = useLocalStorage('calendar-dark-mode', false);
  const [notes, setNotes] = useLocalStorage<CalendarNote[]>('calendar-notes', []);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { h, s, l } = accentColor.hsl;
  const accentHsl = `hsl(${h}, ${s}%, ${l}%)`;

  // Extract accent from the hero image on mount
  useEffect(() => {
    extractDominantColor('/hero-mountain.png').then(setAccentColor);
  }, []);

  const goToPrevMonth = useCallback(() => {
    setDirection(-1);
    setCurrentMonth(m => {
      if (m === 0) { setCurrentYear(y => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setDirection(1);
    setCurrentMonth(m => {
      if (m === 11) { setCurrentYear(y => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  // Range selection: first click sets start, second sets end.
  // Clicking the same start again resets. If end < start, auto-swap.
  const handleDateClick = useCallback((date: Date) => {
    setDateRange(prev => {
      if (prev.start && isSameDay(date, prev.start) && !prev.end) {
        return { start: null, end: null };
      }
      if (!prev.start) return { start: date, end: null };
      if (prev.start && !prev.end) {
        if (date.getTime() < prev.start.getTime()) return { start: date, end: prev.start };
        if (isSameDay(date, prev.start)) return { start: date, end: date };
        return { start: prev.start, end: date };
      }
      // Already have a complete range — start fresh
      return { start: date, end: null };
    });
  }, []);

  const addNote = useCallback((note: CalendarNote) => setNotes(prev => [...prev, note]), [setNotes]);
  const deleteNote = useCallback((id: string) => setNotes(prev => prev.filter(n => n.id !== id)), [setNotes]);

  // Arrow key month navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrevMonth(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goToNextMonth(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goToPrevMonth, goToNextMonth]);

  const cardStyle = {
    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.06)',
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)'
          : 'linear-gradient(135deg, #f8f9fc 0%, #eef1f5 50%, #f0f2f6 100%)',
      }}
    >
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
            style={{ backgroundColor: accentHsl }}
          >
            W
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: isDark ? '#fff' : '#111' }}>
            Wall Calendar
          </span>
        </motion.div>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Hero image */}
          <div className="lg:col-span-5">
            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{
                boxShadow: isDark
                  ? `0 25px 60px rgba(0,0,0,0.5), 0 0 80px hsla(${h}, ${s}%, ${l}%, 0.08)`
                  : `0 25px 60px rgba(0,0,0,0.12), 0 0 40px hsla(${h}, ${s}%, ${l}%, 0.06)`,
              }}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-[4/3] lg:aspect-[3/4] relative">
                <Image
                  src="/hero-mountain.png"
                  alt="Mountain landscape"
                  fill
                  className="object-cover"
                  preload
                  onLoad={() => setImageLoaded(true)}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, transparent 40%, ${isDark ? 'rgba(15,15,26,0.8)' : 'rgba(0,0,0,0.4)'} 100%)`,
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: imageLoaded ? 1 : 0, y: imageLoaded ? 0 : 20 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">
                    {now.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <p className="text-white text-4xl sm:text-5xl font-bold tracking-tight">
                    {now.getDate()}
                  </p>
                  <p className="text-white/70 text-sm font-medium mt-1">
                    {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </motion.div>
                <div className="absolute top-4 right-4">
                  <div
                    className="w-3 h-3 rounded-full ring-2 ring-white/30 shadow-lg"
                    style={{ backgroundColor: accentHsl }}
                    title="Accent color"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Calendar + Notes */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <motion.div
              className="rounded-3xl p-5 sm:p-6 backdrop-blur-sm"
              style={cardStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CalendarHeader
                month={currentMonth} year={currentYear}
                onPrev={goToPrevMonth} onNext={goToNextMonth}
                direction={direction} accentHsl={accentHsl} isDark={isDark}
              />
              <CalendarGrid
                month={currentMonth} year={currentYear}
                dateRange={dateRange} onDateClick={handleDateClick}
                accentColor={accentColor} isDark={isDark}
                direction={direction} notes={notes}
              />

              {/* Legend */}
              <div
                className="flex flex-wrap items-center gap-4 mt-5 pt-4 text-xs"
                style={{
                  borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentHsl }} />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `hsla(${h}, ${s}%, ${l}%, 0.25)` }} />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Holiday</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Has notes</span>
                </div>
                <span className="ml-auto opacity-60">← → keys to navigate</span>
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl p-5 sm:p-6 backdrop-blur-sm flex-1 min-h-[280px]"
              style={cardStyle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <NotesPanel
                notes={notes} dateRange={dateRange}
                onAddNote={addNote} onDeleteNote={deleteNote}
                accentColor={accentColor} isDark={isDark}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
