import { Holiday } from '@/types/calendar';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HOLIDAYS: Holiday[] = [
  { date: '01-01', name: "New Year's Day" },
  { date: '01-26', name: 'Republic Day' },
  { date: '02-14', name: "Valentine's Day" },
  { date: '03-17', name: "St. Patrick's Day" },
  { date: '05-01', name: 'May Day' },
  { date: '07-04', name: 'Independence Day (US)' },
  { date: '08-15', name: 'Independence Day (IN)' },
  { date: '10-02', name: 'Gandhi Jayanti' },
  { date: '10-31', name: 'Halloween' },
  { date: '11-14', name: "Children's Day" },
  { date: '12-25', name: 'Christmas Day' },
  { date: '12-31', name: "New Year's Eve" },
];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Builds a 6×7 grid padded with overflow days from adjacent months
 * so the calendar always renders a consistent rectangle.
 */
export function generateCalendarDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = getFirstDayOfMonth(year, month);
  const totalDays = getDaysInMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  // Previous month overflow
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthDays - i));
  }

  // Current month
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }

  // Next month overflow (fill to 42 cells)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDateShort(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  return `${MONTH_NAMES[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
}

export function getHoliday(date: Date): Holiday | undefined {
  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return HOLIDAYS.find(h => h.date === key);
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const t = date.getTime();
  return t >= Math.min(start.getTime(), end.getTime())
    && t <= Math.max(start.getTime(), end.getTime());
}
