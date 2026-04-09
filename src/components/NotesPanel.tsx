'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarNote, DateRange, DominantColor } from '@/types/calendar';
import { formatDateShort, formatDateISO } from '@/utils/calendarHelpers';

interface NotesPanelProps {
  notes: CalendarNote[];
  dateRange: DateRange;
  onAddNote: (note: CalendarNote) => void;
  onDeleteNote: (id: string) => void;
  accentColor: DominantColor;
  isDark: boolean;
}

export default function NotesPanel({
  notes, dateRange, onAddNote, onDeleteNote, accentColor, isDark,
}: NotesPanelProps) {
  const [title, setTitle] = useState('');
  const hasStart = dateRange.start !== null;
  const hasFullRange = hasStart && dateRange.end !== null;

  const { h, s, l } = accentColor.hsl;
  const accent = `hsl(${h}, ${s}%, ${l}%)`;

  const handleAdd = () => {
    if (!title.trim() || !dateRange.start) return;

    const start = formatDateISO(dateRange.start);
    const end = dateRange.end ? formatDateISO(dateRange.end) : start;

    onAddNote({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: title.trim(),
      startDate: start,
      endDate: end,
      createdAt: Date.now(),
    });
    setTitle('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  const sorted = [...notes].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 rounded-full" style={{ backgroundColor: accent }} />
        <h3 className="text-lg font-bold" style={{ color: isDark ? '#fff' : '#111' }}>Notes</h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full ml-auto"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
          }}
        >
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>

      {/* Active range indicator */}
      <AnimatePresence>
        {hasStart && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div
              className="text-xs font-medium px-3 py-2 rounded-xl"
              style={{
                backgroundColor: `hsla(${h}, ${s}%, ${l}%, 0.1)`,
                color: accent,
                border: `1px solid hsla(${h}, ${s}%, ${l}%, 0.2)`,
              }}
            >
              📅 {dateRange.start && formatDateShort(formatDateISO(dateRange.start))}
              {hasFullRange && dateRange.end && <> → {formatDateShort(formatDateISO(dateRange.end))}</>}
              {!hasFullRange && <span className="opacity-60"> — click another date for range</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="mb-4">
        <textarea
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={hasStart ? 'Add a note for selected dates...' : 'Select a date first...'}
          disabled={!hasStart}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl text-sm resize-none transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            color: isDark ? '#fff' : '#111',
            minHeight: 80,
            // @ts-expect-error -- CSS custom property for focus ring
            '--tw-ring-color': `hsla(${h}, ${s}%, ${l}%, 0.4)`,
          }}
          id="note-input"
        />
        <motion.button
          onClick={handleAdd}
          disabled={!title.trim() || !hasStart}
          className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ backgroundColor: accent }}
          whileHover={title.trim() && hasStart ? { scale: 1.02 } : undefined}
          whileTap={title.trim() && hasStart ? { scale: 0.98 } : undefined}
          id="add-note-btn"
        >
          + Add Note
        </motion.button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2 notes-scroll">
        <AnimatePresence mode="popLayout">
          {sorted.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                No notes yet. Select a date range<br />and add your first note!
              </p>
            </motion.div>
          ) : (
            sorted.map(note => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="group relative p-3 rounded-2xl"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              >
                <p className="text-sm font-medium pr-8 leading-relaxed" style={{ color: isDark ? '#fff' : '#111' }}>
                  {note.title}
                </p>
                <p className="text-xs mt-1.5 font-medium" style={{ color: accent }}>
                  {formatDateShort(note.startDate)}
                  {note.startDate !== note.endDate && <> → {formatDateShort(note.endDate)}</>}
                </p>

                <motion.button
                  onClick={() => onDeleteNote(note.id)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Delete note: ${note.title}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
