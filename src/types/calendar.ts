export interface CalendarNote {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  createdAt: number;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface DominantColor {
  r: number;
  g: number;
  b: number;
  hex: string;
  hsl: HSL;
}

export interface DayCellProps {
  date: Date;
  currentMonth: number;
  isToday: boolean;
  isWeekend: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  accentColor: DominantColor;
  onClick: (date: Date) => void;
  hasNote: boolean;
}

export interface Holiday {
  date: string; // MM-DD
  name: string;
}
