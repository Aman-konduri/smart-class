# Smart Classroom Dashboard (AetherRoom)

A modern, high-performance Front-End Web Application for an engineering college Smart Classroom IoT & Attendance Management System. Built with **React 18**, **Vite**, **Tailwind CSS**, **Framer Motion**, **React Three Fiber (Three.js)**, **Recharts**, and **Lucide Icons**.

Inspired by **Apple.com**'s calm, premium design system (clean typography, frosted glass, refined spacing, high data readability) combined with **Lusion.co**'s interactive 3D hero physics and fluid page transitions.

---

## 🚀 Quick Start

### Option 1: Instant Standalone (No Node.js / zero setup required)
The repository includes a self-contained browser bundle that can be served immediately with Python 3:
```bash
python3 serve.py
```
Open **`http://localhost:8090`** in any modern web browser.

### Option 2: Standard Vite Development Server (Node.js)
```bash
npm install
npm run dev
```
Open **`http://localhost:5173`**.

---

## 🔐 Teacher Authentication (Demo Credentials)

Only faculty members have access to the dashboard. The application is protected by a client-side `ProtectedRoute` wrapper.

- **Teacher Email:** `prof.sharma@college.edu`
- **Password:** `teacher123`

*(Mock authentication with dedicated `// TODO: Replace with real API / JWT auth` markers for backend integration).*

---

## 🌟 Key Features

1. **Classroom Overview (Home):**
   - 3D interactive physics sculpture (reacts to mouse movement, hovering, and physics drag).
   - Real-time simulated IoT sensor cards: occupancy (with circular progress gauge), lights count, fans count, temperature gauge, power consumption, AQI status with color badges, and live telemetry area chart.
   - Live activity log feed and quick-action triggers.

2. **Attendance Management:**
   - Searchable, sortable, and filterable student roster (Roll No, Name, Status, Time-in, Subject).
   - Date picker, subject filtering, summary metric cards, and donut distribution chart.
   - Front-end **Export CSV** feature.

3. **Energy & IoT Analytics:**
   - Day / Week / Month timeline toggles.
   - Hourly power consumption (Recharts Area/Line chart), daily breakdown (Bar chart), and appliance distribution (Donut chart).
   - Estimated cost calculations and week-over-week energy savings metrics.

4. **Notices & Bulletins:**
   - Announcement management with priority tagging (Urgent, High, Normal, Info).
   - Modal form for creating and pinning announcements.

5. **Device Control & Automation:**
   - Individual & master ON/OFF controls for lights and fans with realistic spring animations.
   - Fan speed regulator slider (levels 1–5).
   - Smart Eco Auto-Mode (automatically schedules shutdowns when room occupancy drops to zero).
   - Toast feedback notifications for every device change.

6. **Classroom Settings:**
   - Threshold controls: temperature limit, AQI alert limit, max capacity, auto-off delay.
   - Notification preferences, classroom profile, and Light / Dark theme selector.

---

## 🎨 Visual System & Architecture

- **Apple Palette (CSS Variables):**
  - Light mode: Background `#f5f5f7`, Cards `#ffffff`, Text `#1d1d1f`, Accent `#0071e3`.
  - Dark mode: Background `#000000`, Cards `#1c1c1e`, Text `#f5f5f7`, Accent `#2997ff`.
  - Status indicators: Green `#30d158`, Amber `#ff9f0a`, Red `#ff453a`.
- **Accessibility:**
  - Full support for `prefers-reduced-motion` (disables 3D physics and intense transitions for users who prefer reduced motion).
  - High contrast data labels, ARIA landmarks, and keyboard navigable controls.

---

## 📂 Project Structure

```text
smart-classroom-dashboard/
├── dist/                      # Standalone build bundle
│   ├── bundle.jsx
│   └── index.html
├── src/
│   ├── components/            # UI components (Navbar, Sidebar, StatCard, 3D Hero, etc.)
│   ├── context/               # AuthContext, ThemeContext, DeviceContext
│   ├── data/                  # Mock data for attendance, energy, devices, notices
│   ├── hooks/                 # Custom hooks (e.g. useReducedMotion, useWindowSize)
│   ├── pages/                 # Home, Login, Attendance, Energy, Control, Notices, Settings
│   ├── App.jsx                # Router & layout shell
│   ├── index.css              # Apple design tokens & Tailwind utilities
│   └── main.jsx               # Entry point
├── build_preview.py           # Standalone bundle generator
├── serve.py                   # Lightweight Python HTTP server
├── tailwind.config.js         # Theme & styling configuration
├── vite.config.js             # Vite build configuration
└── package.json               # Dependencies and scripts
```
