# Wall Calendar

A responsive, interactive wall calendar built with Next.js. Designed to feel like a real physical calendar — hero image on one side, date grid and notes panel on the other.

## Features

- **Date range selection** — click a start date, then an end date. Handles auto-swap, reset, and re-selection.
- **Notes** — add notes tied to a selected date range, persisted in localStorage.
- **Dark mode** — toggleable, also persisted across sessions.
- **Dynamic accent color** — the dominant color is extracted from the hero image at runtime and used as the global accent.
- **Month navigation** — arrow buttons or keyboard `←` / `→` keys, with a page-flip animation.
- **Holiday markers** — common holidays are marked with a red dot and show a tooltip on hover.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- localStorage for persistence (no backend)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CalendarContainer.tsx   # main wrapper, state management
│   ├── CalendarHeader.tsx      # month/year display + nav arrows
│   ├── CalendarGrid.tsx        # 7×6 date grid
│   ├── DayCell.tsx             # individual date cell
│   ├── NotesPanel.tsx          # notes input + list
│   └── ThemeToggle.tsx         # dark/light mode switch
├── hooks/
│   └── useLocalStorage.ts      # SSR-safe localStorage hook
├── types/
│   └── calendar.ts             # shared TypeScript interfaces
└── utils/
    ├── calendarHelpers.ts      # date math, holidays, formatting
    └── colorExtractor.ts       # canvas-based color sampling
```

## Design Decisions

- **Color extraction over hardcoded themes** — the accent color is sampled from the hero image using a downscaled canvas and a saturation-weighted average. Swapping the image automatically updates the entire color scheme.
- **Connected range styling** — selected date ranges use variable border-radius (round on edges, flat in the middle) to look like a continuous band rather than disconnected cells.
- **SSR-safe localStorage** — the hook initializes with defaults during server rendering and hydrates from localStorage on the client to prevent mismatches.
- **Module-scoped animation variants** — Framer Motion variants are defined outside components to avoid recreating objects on each render.

## Future Improvements

- Drag-to-select date ranges
- Multiple hero images with a carousel
- Export notes as `.ics` calendar events
- Multi-month view
