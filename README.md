# 🗓 Wall Calendar

A responsive and interactive wall calendar built with Next.js.  
Inspired by a physical wall calendar layout, this project combines a hero image, calendar grid, and notes panel into a clean and intuitive user interface.

---

## 🔗 Live Links

- 🌐 **Live Preview**: https://wall-calender-lac.vercel.app/
- 🌐 **Desktop Demo Video**: https://drive.google.com/file/d/1rL8FwQlrLv_rz_TMCZMEcsMqrHVizfVy/view?usp=drivesdk
- 🌐 **Mobile Demo Video**: https://drive.google.com/file/d/1YF6co7zOGNzMbtSvniDUyv3PaxqNDFPR/view?usp=drivesdk
- 💻 **GitHub Repository**: https://github.com/SowmyaKurapati26/Wall-Calender  

---

## ✨ Features

### 📅 Date Range Selection
- Select start and end dates with simple clicks  
- Automatically swaps dates if selected in reverse order  
- Reset selection by clicking the same date  
- Smooth visual highlighting for selected range  

### 📝 Notes System
- Add notes linked to selected date ranges  
- Notes persist using localStorage  
- Delete notes easily with instant UI updates  

### 🎨 Dynamic Theming
- Accent color is extracted from the hero image  
- UI automatically adapts to match the image theme  

### 🌙 Dark Mode
- Toggle between light and dark themes  
- User preference is saved across sessions  

### 🔄 Calendar Navigation
- Navigate months using buttons or keyboard (`←` / `→`)  
- Smooth page-flip animation enhances experience  

### 🎯 Holiday Indicators
- Important holidays marked with indicators  
- Tooltip on hover for quick details  

### 📱 Responsive Design
- Desktop: side-by-side layout (image + calendar + notes)  
- Mobile: stacked layout with touch-friendly UI  

---

## 🛠 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **localStorage** (client-side persistence)

---

## 🚀 Getting Started

```bash
npm install
npm run dev
````

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CalendarContainer.tsx   # main wrapper and state management
│   ├── CalendarHeader.tsx      # month navigation and header
│   ├── CalendarGrid.tsx        # calendar layout
│   ├── DayCell.tsx             # individual date cell
│   ├── NotesPanel.tsx          # notes functionality
│   └── ThemeToggle.tsx         # dark mode toggle
├── hooks/
│   └── useLocalStorage.ts
├── types/
│   └── calendar.ts
└── utils/
    ├── calendarHelpers.ts
    └── colorExtractor.ts
```

---

## 🧠 Design Decisions

* **Dynamic Color Extraction**
  The accent color is derived from the hero image using canvas-based sampling, allowing the UI to adapt automatically.

* **Improved Range Selection UX**
  Selected dates are visually connected, making the range easy to understand.

* **Lightweight Data Handling**
  Notes are stored in localStorage to avoid backend complexity.

* **Modular Architecture**
  Components are structured for clarity, reusability, and maintainability.

---

## 🔮 Future Improvements

* Drag-to-select date ranges
* Multiple hero images (carousel support)
* Export notes as calendar events (.ics)
* Multi-month or yearly view

---


