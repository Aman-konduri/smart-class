import React, { Component, Suspense, createContext, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter, Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity, AlertCircle, AlertOctagon, AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown,
  ArrowUpRight, Bell, Bug, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock,
  Cpu, Download, Fan, Fingerprint, Inbox, IndianRupee, Info, LayoutDashboard, Lightbulb,
  Lock, LogOut, Mail, Megaphone, Menu, Moon, Pencil, PieChart as PieIcon, Pin, Plus,
  Power, Radar, Radio, RefreshCw, RotateCcw, Save, Search, Settings as SettingsIcon,
  ShieldAlert, ShieldCheck, Sliders, Sparkles, Sun, SunMedium, Thermometer, Trash2,
  TrendingDown, UserCheck, UserX, Users, Wind, X, Zap
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

// --- data/mockData.js ---
/**
 * Central Mock Data Store
 * -----------------------
 * All front-end placeholder data lives in this single file so your team can
 * easily replace each section with fetch/axios API calls or WebSocket/MQTT streams later.
 *
 * // TODO: Replace mock exports below with REST API / WebSocket endpoints when backend is ready.
 */

const DEMO_TEACHER = {
  id: 'TCH-104',
  name: 'Dr. Ananya Sharma',
  email: 'prof.sharma@college.edu',
  password: 'teacher123', // Demo-only password (never store plain passwords in production!)
  role: 'TEACHER',
  department: 'Computer Science & Engineering',
  avatarInitials: 'AS',
};

const CLASSROOMS = [
  {
    id: 'CS-301',
    name: 'CS-301 • Smart Lecture Hall',
    capacity: 60,
    occupancy: 46,
    presentCount: 46,
    absentCount: 9,
    lateCount: 5,
    temperature: 23.6,
    kwhToday: 14.8,
    aqi: 42,
    autoMode: true,
  },
  {
    id: 'EE-204',
    name: 'EE-204 • Embedded IoT Lab',
    capacity: 40,
    occupancy: 31,
    presentCount: 31,
    absentCount: 6,
    lateCount: 3,
    temperature: 25.4,
    kwhToday: 19.2,
    aqi: 68,
    autoMode: true,
  },
  {
    id: 'ME-102',
    name: 'ME-102 • CAD & Robotics Studio',
    capacity: 50,
    occupancy: 0,
    presentCount: 0,
    absentCount: 48,
    lateCount: 2,
    temperature: 27.9,
    kwhToday: 8.4,
    aqi: 112,
    autoMode: false,
  },
];

const INITIAL_LIGHTS = [
  { id: 'L1', name: 'Podium Spotlight', zone: 'Front Stage', isOn: true, watts: 24 },
  { id: 'L2', name: 'Whiteboard Array', zone: 'Front Stage', isOn: true, watts: 36 },
  { id: 'L3', name: 'Row 1–2 LED Panel', zone: 'Front Seating', isOn: true, watts: 40 },
  { id: 'L4', name: 'Row 3–4 LED Panel', zone: 'Mid Seating', isOn: true, watts: 40 },
  { id: 'L5', name: 'Row 5–6 LED Panel', zone: 'Rear Seating', isOn: true, watts: 40 },
  { id: 'L6', name: 'Window Bay Strip', zone: 'East Wall', isOn: false, watts: 28 },
  { id: 'L7', name: 'Aisle Guide Lights', zone: 'Walkway', isOn: true, watts: 18 },
  { id: 'L8', name: 'Exit & Back Alcove', zone: 'Rear Door', isOn: false, watts: 20 },
];

const INITIAL_FANS = [
  { id: 'F1', name: 'Ceiling Fan 01', zone: 'Front Left', isOn: true, speed: 3 },
  { id: 'F2', name: 'Ceiling Fan 02', zone: 'Front Right', isOn: true, speed: 3 },
  { id: 'F3', name: 'Ceiling Fan 03', zone: 'Center Left', isOn: true, speed: 4 },
  { id: 'F4', name: 'Ceiling Fan 04', zone: 'Center Right', isOn: true, speed: 4 },
  { id: 'F5', name: 'Ceiling Fan 05', zone: 'Rear Left', isOn: false, speed: 2 },
  { id: 'F6', name: 'Ceiling Fan 06', zone: 'Rear Right', isOn: false, speed: 2 },
];

const INITIAL_LIVE_TREND = [
  { time: '09:30', temp: 22.8, kwh: 11.2, occupancy: 38 },
  { time: '09:45', temp: 23.1, kwh: 11.9, occupancy: 42 },
  { time: '10:00', temp: 23.4, kwh: 12.6, occupancy: 45 },
  { time: '10:15', temp: 23.5, kwh: 13.3, occupancy: 46 },
  { time: '10:30', temp: 23.8, kwh: 14.1, occupancy: 47 },
  { time: '10:45', temp: 23.6, kwh: 14.8, occupancy: 46 },
];

const INITIAL_ACTIVITY_FEED = [
  { id: 'act-1', time: 'Just now', text: 'RFID Gate synced 46 active student badges in CS-301', type: 'info' },
  { id: 'act-2', time: '3 mins ago', text: 'Window Bay Strip (L6) dimmed OFF due to high daylight lux', type: 'eco' },
  { id: 'act-3', time: '11 mins ago', text: 'CO2 & PM2.5 within safe threshold (AQI 42 • Good)', type: 'good' },
  { id: 'act-4', time: '24 mins ago', text: 'Dr. Ananya Sharma started session: CS301 Data Structures', type: 'info' },
];

const ATTENDANCE_RECORDS = [
  { id: 1, rollNo: '24CS001', name: 'Aarav Mehta', subject: 'CS301 - Data Structures', status: 'Present', timeIn: '08:56 AM', date: '2026-11-24' },
  { id: 2, rollNo: '24CS002', name: 'Diya Nair', subject: 'CS301 - Data Structures', status: 'Present', timeIn: '08:58 AM', date: '2026-11-24' },
  { id: 3, rollNo: '24CS003', name: 'Rohan Kulkarni', subject: 'CS301 - Data Structures', status: 'Late', timeIn: '09:14 AM', date: '2026-11-24' },
  { id: 4, rollNo: '24CS004', name: 'Sneha Iyer', subject: 'CS301 - Data Structures', status: 'Present', timeIn: '08:53 AM', date: '2026-11-24' },
  { id: 5, rollNo: '24CS005', name: 'Kabir Verma', subject: 'CS301 - Data Structures', status: 'Absent', timeIn: '—', date: '2026-11-24' },
  { id: 6, rollNo: '24CS006', name: 'Meera Krishnan', subject: 'CS301 - Data Structures', status: 'Present', timeIn: '08:59 AM', date: '2026-11-24' },
  { id: 7, rollNo: '24CS007', name: 'Vikram Aditya', subject: 'CS301 - Data Structures', status: 'Late', timeIn: '09:19 AM', date: '2026-11-24' },
  { id: 8, rollNo: '24CS008', name: 'Ishita Bose', subject: 'CS301 - Data Structures', status: 'Present', timeIn: '08:55 AM', date: '2026-11-24' },
  { id: 9, rollNo: '24CS009', name: 'Pranav Reddy', subject: 'EE204 - Microcontrollers', status: 'Present', timeIn: '10:57 AM', date: '2026-11-24' },
  { id: 10, rollNo: '24CS010', name: 'Neha Deshmukh', subject: 'EE204 - Microcontrollers', status: 'Absent', timeIn: '—', date: '2026-11-24' },
  { id: 11, rollNo: '24CS011', name: 'Arjun Malhotra', subject: 'EE204 - Microcontrollers', status: 'Present', timeIn: '10:54 AM', date: '2026-11-24' },
  { id: 12, rollNo: '24CS012', name: 'Tanvi Joshi', subject: 'EE204 - Microcontrollers', status: 'Present', timeIn: '10:58 AM', date: '2026-11-24' },
  { id: 13, rollNo: '24CS001', name: 'Aarav Mehta', subject: 'CS305 - Operating Systems', status: 'Present', timeIn: '09:00 AM', date: '2026-11-23' },
  { id: 14, rollNo: '24CS002', name: 'Diya Nair', subject: 'CS305 - Operating Systems', status: 'Late', timeIn: '09:12 AM', date: '2026-11-23' },
  { id: 15, rollNo: '24CS003', name: 'Rohan Kulkarni', subject: 'CS305 - Operating Systems', status: 'Present', timeIn: '08:57 AM', date: '2026-11-23' },
  { id: 16, rollNo: '24CS005', name: 'Kabir Verma', subject: 'CS305 - Operating Systems', status: 'Absent', timeIn: '—', date: '2026-11-23' },
];

const ENERGY_DATASETS = {
  day: {
    summary: { totalKwh: 14.8, estimatedCost: 125.8, savingsPercent: 14.2 },
    hourly: [
      { label: '08 AM', kwh: 1.2 },
      { label: '09 AM', kwh: 2.4 },
      { label: '10 AM', kwh: 2.9 },
      { label: '11 AM', kwh: 3.1 },
      { label: '12 PM', kwh: 2.0 },
      { label: '01 PM', kwh: 1.4 },
      { label: '02 PM', kwh: 1.8 },
    ],
    comparison: [
      { label: 'Mon', current: 16.2, baseline: 19.0 },
      { label: 'Tue', current: 14.8, baseline: 17.3 },
      { label: 'Wed', current: 15.4, baseline: 18.1 },
      { label: 'Thu', current: 13.9, baseline: 16.8 },
      { label: 'Fri', current: 14.5, baseline: 17.9 },
    ],
    breakdown: [
      { name: 'LED Lighting', value: 38, color: '#38bdf8' },
      { name: 'Ceiling Fans', value: 34, color: '#2dd4bf' },
      { name: 'Smart Board & AV', value: 18, color: '#6366f1' },
      { name: 'IoT & Sensors', value: 10, color: '#f59e0b' },
    ],
  },
  week: {
    summary: { totalKwh: 86.4, estimatedCost: 734.4, savingsPercent: 16.8 },
    hourly: [
      { label: '08 AM', kwh: 7.5 },
      { label: '10 AM', kwh: 18.2 },
      { label: '12 PM', kwh: 21.6 },
      { label: '02 PM', kwh: 19.4 },
      { label: '04 PM', kwh: 14.1 },
      { label: '06 PM', kwh: 5.6 },
    ],
    comparison: [
      { label: 'Week 1', current: 98.0, baseline: 112.0 },
      { label: 'Week 2', current: 92.5, baseline: 110.0 },
      { label: 'Week 3', current: 89.1, baseline: 106.0 },
      { label: 'This Week', current: 86.4, baseline: 103.8 },
    ],
    breakdown: [
      { name: 'LED Lighting', value: 36, color: '#38bdf8' },
      { name: 'Ceiling Fans', value: 37, color: '#2dd4bf' },
      { name: 'Smart Board & AV', value: 19, color: '#6366f1' },
      { name: 'IoT & Sensors', value: 8, color: '#f59e0b' },
    ],
  },
  month: {
    summary: { totalKwh: 342.0, estimatedCost: 2907.0, savingsPercent: 19.4 },
    hourly: [
      { label: '08 AM', kwh: 31 },
      { label: '10 AM', kwh: 74 },
      { label: '12 PM', kwh: 88 },
      { label: '02 PM', kwh: 79 },
      { label: '04 PM', kwh: 52 },
      { label: '06 PM', kwh: 18 },
    ],
    comparison: [
      { label: 'Aug', current: 410, baseline: 465 },
      { label: 'Sep', current: 388, baseline: 452 },
      { label: 'Oct', current: 365, baseline: 440 },
      { label: 'Nov', current: 342, baseline: 424 },
    ],
    breakdown: [
      { name: 'LED Lighting', value: 35, color: '#38bdf8' },
      { name: 'Ceiling Fans', value: 39, color: '#2dd4bf' },
      { name: 'Smart Board & AV', value: 17, color: '#6366f1' },
      { name: 'IoT & Sensors', value: 9, color: '#f59e0b' },
    ],
  },
};

const INITIAL_NOTICES = [
  {
    id: 'ntc-1',
    title: 'Mid-Semester Lab Viva Schedule — CS-301',
    message: 'Batch A and Batch B students will present their Data Structures mini-projects this Thursday between 2:00 PM and 4:30 PM. Ensure smart-board HDMI adapters are tested beforehand.',
    priority: 'High',
    date: '2026-11-24',
    pinned: true,
  },
  {
    id: 'ntc-2',
    title: 'Scheduled IoT Firmware Calibration',
    message: 'Campus maintenance will calibrate CO2 and occupancy millimeter-wave sensors in Block C on Friday at 5:30 PM after lecture hours.',
    priority: 'Medium',
    date: '2026-11-23',
    pinned: true,
  },
  {
    id: 'ntc-3',
    title: 'Energy Conservation Milestone Reached',
    message: 'CS-301 reduced idle electricity wastage by 16.8% this week using Smart Eco Auto-Off mode.',
    priority: 'Low',
    date: '2026-11-21',
    pinned: false,
  },
];

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'ME-102 Air Quality Alert', detail: 'AQI reached 112 (Moderate). Ventilation recommended.', unread: true },
  { id: 'n2', title: 'Eco Auto-Off Active', detail: '2 unoccupied zone lights turned off automatically.', unread: true },
  { id: 'n3', title: 'Attendance Synced', detail: 'CS301 morning batch RFID log completed.', unread: false },
];

const DEFAULT_SETTINGS = {
  classroomName: 'CS-301 • Smart Lecture Hall',
  tempLimit: 26,
  aqiLimit: 100,
  maxOccupancy: 60,
  autoOffDelay: 10,
  emailAlerts: true,
  aqiPushAlerts: true,
  occupancyAlerts: false,
  teacherName: DEMO_TEACHER.name,
  teacherDepartment: DEMO_TEACHER.department,
  teacherEmail: DEMO_TEACHER.email,
};

// --- utils/exportCsv.js ---
/**
 * Utility helpers for CSV export and Apple Status Colour badges
 */

function exportRowsToCsv(filename, rows) {
  if (!rows || rows.length === 0) return;

  const headers = ['Roll No', 'Student Name', 'Subject', 'Status', 'Time In', 'Date'];
  const escapeCell = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const csvLines = [
    headers.join(','),
    ...rows.map((r) =>
      [r.rollNo, r.name, r.subject, r.status, r.timeIn, r.date].map(escapeCell).join(',')
    ),
  ];

  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Returns Air Quality label and Apple status colour classes (#30d158, #ff9f0a, #ff453a).
 */
function getAqiMeta(aqi) {
  if (aqi <= 50) {
    return {
      label: 'Good',
      badgeClass: 'bg-[#30d158]/12 text-[#30d158] border-[#30d158]/25',
      dotClass: 'bg-[#30d158]',
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate',
      badgeClass: 'bg-[#ff9f0a]/12 text-[#ff9f0a] border-[#ff9f0a]/25',
      dotClass: 'bg-[#ff9f0a]',
    };
  }
  return {
    label: 'Poor',
    badgeClass: 'bg-[#ff453a]/12 text-[#ff453a] border-[#ff453a]/25',
    dotClass: 'bg-[#ff453a]',
  };
}

// --- utils/motionConfig.js ---
/**
 * Central Motion & Apple Design Tuning Config
 * -------------------------------------------
 * Uses Apple-style fluid springs (stiffness ~120, damping ~20) and a single blue accent.
 */
const APPLE_SPRING = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 0.85,
};

const MOTION_TUNING = {
  // 1. Single Apple Accent + Status Colours
  COLORS: {
    primaryBlue: '#0071e3',
    darkAccentBlue: '#2997ff',
    warmBulb: '#ff9f0a',
    thermoCoral: '#ff453a',
    statusGreen: '#30d158',
  },

  // 2. Preloader Timing
  PRELOADER_DURATION_MS: 1200,

  // 3. Smooth Scroll (Lenis)
  LENIS_LERP: 0.09,

  // 4. Custom Cursor & Magnetic Pull
  CURSOR_RING_LERP: 0.18,
  MAGNETIC_RADIUS_PX: 60,
  MAGNETIC_STRENGTH: 0.24,

  // 5. StatCard Subtle Hover Lift & Count-Up
  CARD_MAX_TILT_DEG: 5,
  COUNT_UP_DURATION_MS: 850,

  // 6. WebGL 3D Scene & Physics (Login + Home Hero Only)
  MAX_DPR: 2,
  PARTICLE_COUNT_DESKTOP: 180,
  PARTICLE_COUNT_MOBILE: 60,
  PHYSICS_REPULSION_FORCE: 7.0,
  PHYSICS_SPRING_RETURN: 3.0,
  BLOOM_HALO_OPACITY: 0.18,
};

const scrollTelemetry = {
  velocity: 0,
  progress: 0,
};

// --- hooks/useAuth.jsx ---
const AuthContext = createContext(null);
const STORAGE_KEY = 'smart_classroom_teacher_auth';

/**
 * AuthProvider manages Teacher-only authentication state.
 * Students are strictly blocked from logging in.
 */
function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // Block student email domains explicitly
    if (cleanEmail.includes('student') || cleanEmail.endsWith('@students.college.edu')) {
      return {
        ok: false,
        error: 'Access Denied: Student accounts are not permitted on the Faculty Portal.',
      };
    }

    // TODO: replace with real API/JWT auth
    // Example later:
    // const res = await fetch('/api/v1/auth/teacher-login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: cleanEmail, password }),
    // });
    // const { token, teacherProfile } = await res.json();

    await new Promise((resolve) => setTimeout(resolve, 400));

    if (
      cleanEmail === DEMO_TEACHER.email.toLowerCase() &&
      password === DEMO_TEACHER.password
    ) {
      const sessionUser = {
        id: DEMO_TEACHER.id,
        name: DEMO_TEACHER.name,
        email: DEMO_TEACHER.email,
        role: DEMO_TEACHER.role,
        department: DEMO_TEACHER.department,
        avatarInitials: DEMO_TEACHER.avatarInitials,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
      setTeacher(sessionUser);
      return { ok: true };
    }

    return {
      ok: false,
      error: 'Invalid faculty credentials. Use the demo teacher account shown below.',
    };
  };

  const updateTeacherProfile = (updates) => {
    // TODO: replace with real API/JWT auth PATCH /api/v1/teachers/me
    setTeacher((prev) => {
      if (!prev) return prev;
      const initials = (updates.name || prev.name)
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
      const updated = { ...prev, ...updates, avatarInitials: initials || 'TC' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    // TODO: replace with real API/JWT auth token revocation / logout endpoint
    localStorage.removeItem(STORAGE_KEY);
    setTeacher(null);
  };

  return (
    <AuthContext.Provider
      value={{
        teacher,
        isAuthenticated: Boolean(teacher && teacher.role === 'TEACHER'),
        login,
        logout,
        updateTeacherProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// --- hooks/useClassroom.jsx ---
const ClassroomContext = createContext(null);

/**
 * Shared state provider for classroom sensors, IoT device controls, notices,
 * settings, theme (Dark/Light), and toast alerts.
 */
function ClassroomProvider({ children }) {
  // Theme state ('dark' by default for Lusion-inspired look)
  const [theme, setTheme] = useState(() => localStorage.getItem('sc_theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('sc_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // Active classroom & brief skeleton loading state when switching rooms
  const [classrooms, setClassrooms] = useState(CLASSROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState(CLASSROOMS[0].id);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const [sensorError, setSensorError] = useState(null);

  // IoT Devices (Lights & Fans)
  const [lights, setLights] = useState(INITIAL_LIGHTS);
  const [fans, setFans] = useState(INITIAL_FANS);
  const [autoMode, setAutoMode] = useState(true);

  // Live Trend & Activity Feed
  const [liveTrend, setLiveTrend] = useState(INITIAL_LIVE_TREND);
  const [activities, setActivities] = useState(INITIAL_ACTIVITY_FEED);

  // Notices, Notifications & Settings
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Toast queue
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, variant = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const currentRoom =
    classrooms.find((r) => r.id === selectedRoomId) || classrooms[0];

  const selectClassroom = (roomId) => {
    setSelectedRoomId(roomId);
    setSensorError(null);
    setIsLoadingRoom(true);
    // TODO: Fetch selected classroom telemetry from GET /api/v1/classrooms/:id/telemetry
    setTimeout(() => setIsLoadingRoom(false), 360);
  };

  // Simulate live IoT sensor ticks every 4 seconds
  useEffect(() => {
    // TODO: Replace setInterval simulation with WebSocket / MQTT subscription
    const timer = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setClassrooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id !== selectedRoomId) return room;
          const tempDelta = (Math.random() - 0.48) * 0.4;
          const nextTemp = Number(Math.max(19, Math.min(34, room.temperature + tempDelta)).toFixed(1));
          const aqiDelta = Math.round((Math.random() - 0.48) * 4);
          const nextAqi = Math.max(22, Math.min(165, room.aqi + aqiDelta));
          const nextKwh = Number((room.kwhToday + 0.03).toFixed(2));

          setLiveTrend((prevTrend) => [
            ...prevTrend.slice(-7),
            { time: timeLabel, temp: nextTemp, kwh: nextKwh, occupancy: room.occupancy },
          ]);

          return {
            ...room,
            temperature: nextTemp,
            aqi: nextAqi,
            kwhToday: nextKwh,
          };
        })
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [selectedRoomId]);

  // Device Control Handlers
  const toggleLight = (id) => {
    // TODO: Publish MQTT command e.g. client.publish(`classroom/${selectedRoomId}/lights/${id}`, payload)
    setLights((prev) =>
      prev.map((light) => {
        if (light.id !== id) return light;
        const nextState = !light.isOn;
        addToast(`${light.name} turned ${nextState ? 'ON' : 'OFF'}`, 'info');
        setActivities((acts) => [
          { id: `act-${Date.now()}`, time: 'Just now', text: `${light.name} switched ${nextState ? 'ON' : 'OFF'}`, type: 'info' },
          ...acts.slice(0, 5),
        ]);
        return { ...light, isOn: nextState };
      })
    );
  };

  const setAllLights = (turnOn) => {
    // TODO: Send bulk REST/MQTT command POST /api/v1/devices/lights/bulk
    setLights((prev) => prev.map((l) => ({ ...l, isOn: turnOn })));
    addToast(`All classroom lights turned ${turnOn ? 'ON' : 'OFF'}`, turnOn ? 'success' : 'info');
  };

  const toggleFan = (id) => {
    // TODO: Publish MQTT command for individual fan relay
    setFans((prev) =>
      prev.map((fan) => {
        if (fan.id !== id) return fan;
        const nextState = !fan.isOn;
        addToast(`${fan.name} turned ${nextState ? 'ON' : 'OFF'}`, 'info');
        return { ...fan, isOn: nextState };
      })
    );
  };

  const changeFanSpeed = (id, speed) => {
    // TODO: Publish MQTT PWM speed level (1-5) to fan controller
    const numericSpeed = Number(speed);
    setFans((prev) =>
      prev.map((fan) => (fan.id === id ? { ...fan, speed: numericSpeed, isOn: true } : fan))
    );
    const target = fans.find((f) => f.id === id);
    if (target) {
      addToast(`${target.name} speed set to Level ${numericSpeed}`, 'success');
    }
  };

  const setAllFans = (turnOn) => {
    // TODO: Send bulk REST/MQTT command POST /api/v1/devices/fans/bulk
    setFans((prev) => prev.map((f) => ({ ...f, isOn: turnOn })));
    addToast(`All ceiling fans turned ${turnOn ? 'ON' : 'OFF'}`, turnOn ? 'success' : 'info');
  };

  const toggleAutoMode = () => {
    // TODO: Update edge controller occupancy automation flag via API
    setAutoMode((prev) => {
      const next = !prev;
      if (next && currentRoom.occupancy === 0) {
        setLights((l) => l.map((item) => ({ ...item, isOn: false })));
        setFans((f) => f.map((item) => ({ ...item, isOn: false })));
        addToast('Auto Mode enabled: Room is empty, powered down idle devices.', 'success');
      } else {
        addToast(`Smart Eco Auto-Mode ${next ? 'enabled' : 'disabled'}`, 'success');
      }
      return next;
    });
  };

  // Notices CRUD
  const saveNotice = (noticeData) => {
    // TODO: POST or PUT /api/v1/notices
    if (noticeData.id) {
      setNotices((prev) => prev.map((n) => (n.id === noticeData.id ? { ...n, ...noticeData } : n)));
      addToast('Announcement updated successfully');
    } else {
      const created = {
        ...noticeData,
        id: `ntc-${Date.now()}`,
        date: noticeData.date || new Date().toISOString().slice(0, 10),
        pinned: Boolean(noticeData.pinned),
      };
      setNotices((prev) => [created, ...prev]);
      addToast('New announcement published');
    }
  };

  const deleteNotice = (id) => {
    // TODO: DELETE /api/v1/notices/:id
    setNotices((prev) => prev.filter((n) => n.id !== id));
    addToast('Announcement deleted', 'info');
  };

  const togglePinNotice = (id) => {
    // TODO: PATCH /api/v1/notices/:id/pin
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const updateSettings = (nextSettings) => {
    // TODO: PUT /api/v1/classrooms/:id/settings
    setSettings(nextSettings);
    setClassrooms((prev) =>
      prev.map((room, idx) =>
        idx === 0
          ? { ...room, name: nextSettings.classroomName, capacity: Number(nextSettings.maxOccupancy) }
          : room
      )
    );
    addToast('System settings & thresholds saved!', 'success');
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    addToast('Settings restored to factory defaults', 'info');
  };

  return (
    <ClassroomContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        classrooms,
        currentRoom,
        selectedRoomId,
        selectClassroom,
        isLoadingRoom,
        sensorError,
        setSensorError,
        lights,
        fans,
        autoMode,
        toggleLight,
        setAllLights,
        toggleFan,
        changeFanSpeed,
        setAllFans,
        toggleAutoMode,
        liveTrend,
        activities,
        notices,
        saveNotice,
        deleteNotice,
        togglePinNotice,
        notifications,
        markAllNotificationsRead,
        settings,
        updateSettings,
        resetSettings,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
}

function useClassroom() {
  const ctx = useContext(ClassroomContext);
  if (!ctx) throw new Error('useClassroom must be used inside <ClassroomProvider>');
  return ctx;
}

// --- hooks/useSmoothScroll.js ---
gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scrolling and keeps it locked in sync with GSAP ScrollTrigger.
 * Automatically disables itself if the user prefers reduced motion.
 */
function useSmoothScroll(disabled = false) {
  useEffect(() => {
    const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (disabled || mediaReduce) {
      scrollTelemetry.velocity = 0;
      return;
    }

    const lenis = new Lenis({
      lerp: MOTION_TUNING.LENIS_LERP,
      smoothWheel: true,
      syncTouch: false,
    });

    // Update GSAP ScrollTrigger and shared scroll telemetry on every Lenis scroll frame
    lenis.on('scroll', (e) => {
      scrollTelemetry.velocity = e.velocity || 0;
      scrollTelemetry.progress = e.progress || 0;
      ScrollTrigger.update();
    });

    // Drive Lenis from GSAP's unified requestAnimationFrame ticker
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, [disabled]);
}

// --- components/FeedbackStates.jsx ---
/**
 * Loading Skeleton Grid shown while classroom sensor telemetry is syncing.
 */
function SkeletonGrid({ count = 8 }) {
  return (
    <div
      role="status"
      aria-label="Loading classroom data"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card animate-pulse p-5">
          <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 h-8 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 h-2.5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

/**
 * Empty State card when a list or table has zero matching items.
 */
function EmptyState({ title, description, action }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/25 bg-sky-500/10 text-sky-500 dark:text-tealaccent-400">
        <Inbox className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/**
 * Error State card with retry button if a sensor gateway or API call fails.
 */
function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="glass-card border-rose-500/30 bg-rose-500/5 p-6 text-center"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
        <AlertOctagon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-3 font-display text-base font-bold text-slate-900 dark:text-white">
        Telemetry Connection Interrupted
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {message || 'Unable to reach classroom IoT gateway. Please retry.'}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-primary mt-4">
          <RefreshCw className="h-4 w-4" />
          Reconnect Gateway
        </button>
      )}
    </div>
  );
}

// --- components/ProtectedRoute.jsx ---
/**
 * ProtectedRoute ensures only authenticated TEACHERS can view dashboard pages.
 * Unauthenticated users (or students) are redirected to /login.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// --- components/ScrollProgressBar.jsx ---
/**
 * Minimal single-accent Apple Blue scroll progress bar pinned to the top edge.
 */
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setProgress(pct);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2.5px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-[var(--accent)]"
        style={{
          transform: `scaleX(${progress})`,
          transition: reducedMotion ? 'none' : 'transform 80ms linear',
        }}
      />
    </div>
  );
}

// --- components/Preloader.jsx ---
/**
 * Minimal Apple-inspired Preloader (Pure #000000 stage + single #2997ff accent)
 * Counts 0–100% smoothly then reveals the app with a fluid circular iris.
 */
function Preloader({ onFinish }) {
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reducedMotion) {
      setCount(100);
      setVisible(false);
      onFinish?.();
      return;
    }

    const duration = MOTION_TUNING.PRELOADER_DURATION_MS;
    const start = performance.now();
    let rafId;

    const tick = (now) => {
      const elapsed = now - start;
      const raw = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - raw, 3);
      setCount(Math.round(eased * 100));

      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          onFinish?.();
        }, 160);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion, onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{
            clipPath: 'circle(0% at 50% 50%)',
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-live="polite"
          aria-label={`Loading Smart Classroom Portal ${count}%`}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-[#f5f5f7]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1c1c1e] border border-white/10 text-[#2997ff]">
            <Cpu className="h-8 w-8" />
          </div>

          <p className="mt-5 font-display text-xs font-medium uppercase tracking-[0.26em] text-[#a1a1a6]">
            AetherRoom
          </p>

          <div className="mt-4 flex w-56 flex-col items-center">
            <span className="font-display text-4xl font-semibold tracking-tight tabular-nums">
              {count}%
            </span>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#2997ff] transition-all duration-75"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- components/CustomCursor.jsx ---
/**
 * Refined Apple-Blue Custom Cursor (Dot + Trailing Ring)
 * Hidden automatically on touch devices and under prefers-reduced-motion.
 */
function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');

  useEffect(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarsePointer || reducedMotion) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let rafId;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }

      const target = e.target;
      if (target && target.closest) {
        const labeledEl = target.closest('[data-cursor]');
        const interactiveEl = target.closest(
          'a, button, select, input, textarea, [role="switch"], [role="button"]'
        );
        setCursorLabel(labeledEl ? labeledEl.getAttribute('data-cursor') || '' : '');
        setHovered(Boolean(labeledEl || interactiveEl));
      }
    };

    const animateRing = () => {
      ring.x += (mouse.x - ring.x) * MOTION_TUNING.CURSOR_RING_LERP;
      ring.y += (mouse.y - ring.y) * MOTION_TUNING.CURSOR_RING_LERP;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  const hasLabel = Boolean(cursorLabel);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[var(--accent)]"
      />

      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-200 ${
            hasLabel
              ? 'h-14 w-14 border-[var(--accent)] bg-[var(--card)]/90 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] shadow-lg backdrop-blur-md'
              : hovered
              ? 'h-10 w-10 border-[var(--accent)] bg-[var(--accent-soft)]'
              : 'h-7 w-7 border-[var(--accent)]/45 bg-transparent'
          }`}
        >
          {hasLabel && <span>{cursorLabel}</span>}
        </div>
      </div>
    </div>
  );
}

// --- components/Magnetic.jsx ---
/**
 * Magnetic Wrapper Component
 * Gently pulls child buttons or sidebar icons toward the mouse cursor
 * whenever the pointer comes within ~60px of the element's center.
 */
function Magnetic({
  children,
  strength = MOTION_TUNING.MAGNETIC_STRENGTH,
  radius = MOTION_TUNING.MAGNETIC_RADIUS_PX,
  className = 'inline-block',
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (reducedMotion || !ref.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.hypot(dx, dy);

    if (distance < radius + Math.max(rect.width, rect.height) / 2) {
      setOffset({ x: dx * strength, y: dy * strength });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 18, mass: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- components/SplitTextReveal.jsx ---
/**
 * Splits a heading string into words and slides each word up from a clipped mask
 * when it scrolls into view. Preserves full screen-reader accessibility via aria-label.
 */
function SplitTextReveal({
  text,
  as: Tag = 'h2',
  className = '',
  highlightWord = '',
}) {
  const reducedMotion = useReducedMotion();
  const words = String(text).split(' ');

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag aria-label={text} className={className}>
      {words.map((word, idx) => {
        const isHighlighted =
          highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
        return (
          <span
            key={`${word}-${idx}`}
            aria-hidden="true"
            className="mr-[0.26em] inline-block overflow-hidden align-bottom pb-0.5"
          >
            <motion.span
              initial={{ y: '110%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.52,
                delay: idx * 0.045,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`inline-block ${
                isHighlighted
                  ? 'bg-gradient-to-r from-electric-400 to-tealaccent-400 bg-clip-text text-transparent'
                  : ''
              }`}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}

// --- components/AppleImage.jsx ---
/**
 * Apple-Style Product Image Card
 * - Rounded 24px corners (`rounded-3xl`)
 * - Native lazy loading (`loading="lazy"`) with smooth blur-up reveal
 * - Subtle scroll parallax (disabled when prefers-reduced-motion is active)
 * - Descriptive alt text and automatic fallback URL
 */
function AppleImage({
  src,
  fallbackSrc,
  alt,
  className = 'aspect-[4/3] w-full',
  parallax = true,
  priority = false,
}) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallax && !reducedMotion ? [-18, 18] : [0, 0]
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={APPLE_SPRING}
      className={`relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-subtle)] shadow-apple dark:shadow-apple-dark ${className}`}
    >
      {/* Blur-up shimmer placeholder while image loads */}
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-black/5 via-black/10 to-black/5 dark:from-white/5 dark:via-white/10 dark:to-white/5"
        />
      )}

      <motion.img
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ y }}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          } else {
            setLoaded(true);
          }
        }}
        className={`h-[112%] w-full -mt-[6%] object-cover transition-all duration-700 ${
          loaded ? 'scale-100 blur-0 opacity-100' : 'scale-105 blur-xl opacity-0'
        }`}
      />
    </motion.div>
  );
}

// --- components/AppleFeatures.jsx ---
const EDITORIAL_FEATURES = [
  {
    eyebrow: 'Millimeter-Wave Sensing',
    title: 'Presence, measured without cameras.',
    description:
      'A single ceiling-mounted 60GHz radar and air-quality pod tracks room occupancy, CO2, and PM2.5 in real time—respecting student privacy while keeping classrooms fresh and comfortable.',
    image: '/images/feature-occupancy-sensor.png',
    fallback:
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    alt: 'Minimalist matte-white and brushed-aluminum ceiling occupancy and air-quality sensor pod',
    ctaLabel: 'Explore Live Telemetry',
    ctaTo: '/settings',
  },
  {
    eyebrow: 'Daylight-Adaptive Lighting',
    title: 'Brilliant light. Effortless efficiency.',
    description:
      'Ambient lux photodiodes balance natural window sunlight with overhead LED zones automatically—cutting idle lecture-hall electricity waste by up to 24% every week.',
    image: '/images/feature-smart-lighting.png',
    fallback:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
    alt: 'Modern minimalist engineering college smart lecture hall with linear daylight-adaptive LED lighting',
    ctaLabel: 'Inspect Energy Analytics',
    ctaTo: '/energy',
  },
  {
    eyebrow: 'Instant RFID Check-In',
    title: 'Attendance taken in a fraction of a second.',
    description:
      'Dual-antenna doorway terminals verify student badges as they walk in, automatically logging arrival timestamps, flagging late entries, and preparing one-click CSV sheets for faculty.',
    image: '/images/feature-rfid-hub.png',
    fallback:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
    alt: 'Anodized space-black glass RFID smart classroom attendance reader with a glowing blue confirmation ring',
    ctaLabel: 'Open Attendance Log',
    ctaTo: '/attendance',
  },
];

/**
 * Apple.com-style alternating Image + Text editorial feature blocks.
 * Uses generous whitespace, 24px rounded parallax imagery, and calm spring reveals.
 */
function AppleFeatures() {
  return (
    <section aria-label="Smart Classroom Product Features" className="space-y-20 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Engineered for Faculty
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-[var(--text)] sm:text-5xl">
          Every sensor works in quiet harmony.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
          Designed to fade into the background of your lecture while giving you complete visibility and instant control.
        </p>
      </div>

      <div className="space-y-20">
        {EDITORIAL_FEATURES.map((item, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <div
              key={item.title}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
            >
              <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                <AppleImage
                  src={item.image}
                  fallbackSrc={item.fallback}
                  alt={item.alt}
                  className="aspect-[4/3] w-full"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...APPLE_SPRING, delay: 0.08 }}
                className={`space-y-4 lg:col-span-5 ${isReversed ? 'lg:order-1' : ''}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {item.eyebrow}
                </p>
                <h3 className="font-display text-2xl font-bold leading-tight tracking-[-0.025em] text-[var(--text)] sm:text-4xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  {item.description}
                </p>
                <div className="pt-2">
                  <Link
                    to={item.ctaTo}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    {item.ctaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// --- components/Scene3D.jsx ---
/**
 * Subtle scroll-reactive particle field in Apple Blue (#2997ff).
 */
function ClassroomParticles({ count }) {
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 11;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = -1.5 - Math.random() * 4.5;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const speedBoost = 1 + Math.min(7, Math.abs(scrollTelemetry.velocity) * 0.16);
    pointsRef.current.rotation.y += delta * 0.035 * speedBoost;
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      Math.max(-0.7, Math.min(0.7, scrollTelemetry.velocity * 0.018)),
      0.1
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={MOTION_TUNING.COLORS.darkAccentBlue}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Apple Industrial-Design 3D Smart Classroom Objects with Cannon-es Physics:
 * 1. Matte-Glass Smart Lightbulb
 * 2. Brushed-Aluminum Ceiling Fan Rotor
 * 3. Precision Classroom Thermometer
 * 4. Frosted-Glass Environmental Sensor Orb with #2997ff LED Ring
 */
function PhysicsClassroomObjects({ lowPower }) {
  const { viewport, pointer } = useThree();

  const [lightLit, setLightLit] = useState(true);
  const lightBoostRef = useRef(1);
  const fanSpeedRef = useRef(2.2);
  const pulseScaleRef = useRef({ thermo: 1, sensor: 1 });

  const bulbGroup = useRef(null);
  const fanGroup = useRef(null);
  const fanBladesRef = useRef(null);
  const thermoGroup = useRef(null);
  const sensorGroup = useRef(null);

  const physics = useMemo(() => {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
    const anchors = [
      new CANNON.Vec3(-1.45, 0.72, 0),
      new CANNON.Vec3(1.45, 0.68, 0),
      new CANNON.Vec3(-1.3, -0.76, 0),
      new CANNON.Vec3(1.35, -0.7, 0),
    ];

    const bodies = anchors.map((pos) => {
      const body = new CANNON.Body({
        mass: 1,
        position: pos.clone(),
        linearDamping: 0.85,
        shape: new CANNON.Sphere(0.65),
      });
      world.addBody(body);
      return body;
    });

    return { world, anchors, bodies };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const cursorX = (pointer.x * viewport.width) / 2;
    const cursorY = (pointer.y * viewport.height) / 2;
    const cursorVec = new CANNON.Vec3(cursorX, cursorY, 0);
    const t = state.clock.elapsedTime;

    physics.bodies.forEach((body, idx) => {
      const anchor = physics.anchors[idx];
      const floatY = Math.sin(t * 1.25 + idx * 1.6) * 0.1;

      body.applyForce(
        new CANNON.Vec3(
          (anchor.x - body.position.x) * MOTION_TUNING.PHYSICS_SPRING_RETURN,
          (anchor.y + floatY - body.position.y) * MOTION_TUNING.PHYSICS_SPRING_RETURN,
          (anchor.z - body.position.z) * MOTION_TUNING.PHYSICS_SPRING_RETURN
        )
      );

      const diff = body.position.vsub(cursorVec);
      diff.z = 0;
      const dist = diff.length();
      if (dist < 1.25 && dist > 0.001) {
        diff.normalize();
        const pushStrength = (1 - dist / 1.25) * MOTION_TUNING.PHYSICS_REPULSION_FORCE;
        body.applyForce(diff.scale(pushStrength));
      }
    });

    physics.world.step(1 / 60, dt, 2);

    const groups = [bulbGroup, fanGroup, thermoGroup, sensorGroup];
    groups.forEach((gRef, idx) => {
      if (!gRef.current) return;
      const b = physics.bodies[idx];
      gRef.current.position.set(b.position.x, b.position.y, b.position.z);
      gRef.current.rotation.x = THREE.MathUtils.lerp(
        gRef.current.rotation.x,
        -pointer.y * 0.3,
        0.08
      );
      gRef.current.rotation.y = THREE.MathUtils.lerp(
        gRef.current.rotation.y,
        pointer.x * 0.4 + Math.sin(t * 0.55 + idx) * 0.18,
        0.08
      );
    });

    if (fanBladesRef.current) {
      fanBladesRef.current.rotation.z -= dt * fanSpeedRef.current;
      fanSpeedRef.current = THREE.MathUtils.lerp(fanSpeedRef.current, 2.2, 0.03);
    }

    lightBoostRef.current = THREE.MathUtils.lerp(
      lightBoostRef.current,
      lightLit ? 1.0 : 0.18,
      0.06
    );
    pulseScaleRef.current.thermo = THREE.MathUtils.lerp(pulseScaleRef.current.thermo, 1, 0.1);
    pulseScaleRef.current.sensor = THREE.MathUtils.lerp(pulseScaleRef.current.sensor, 1, 0.1);

    if (thermoGroup.current) thermoGroup.current.scale.setScalar(pulseScaleRef.current.thermo);
    if (sensorGroup.current) sensorGroup.current.scale.setScalar(pulseScaleRef.current.sensor);
  });

  const seg = lowPower ? 14 : 26;

  return (
    <group>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} color="#ffffff" />
      <pointLight
        position={[-1.4, 0.8, 1.5]}
        intensity={1.6 * lightBoostRef.current}
        color={MOTION_TUNING.COLORS.warmBulb}
      />
      <pointLight
        position={[1.4, -0.6, 1.8]}
        intensity={1.5}
        color={MOTION_TUNING.COLORS.darkAccentBlue}
      />

      {/* 1. SMART LIGHTBULB */}
      <group
        ref={bulbGroup}
        onClick={(e) => {
          e.stopPropagation();
          setLightLit((v) => !v);
          lightBoostRef.current = 3.0;
        }}
      >
        <mesh position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.42, seg, seg]} />
          <meshStandardMaterial
            color={lightLit ? '#fef3c7' : '#3a3a3c'}
            emissive={MOTION_TUNING.COLORS.warmBulb}
            emissiveIntensity={lightLit ? 0.72 : 0.05}
            roughness={0.2}
            metalness={0.08}
          />
        </mesh>
        {lightLit && (
          <mesh position={[0, 0.16, 0]} scale={1.42}>
            <sphereGeometry args={[0.42, 16, 16]} />
            <meshBasicMaterial
              color={MOTION_TUNING.COLORS.warmBulb}
              transparent
              opacity={MOTION_TUNING.BLOOM_HALO_OPACITY}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
              depthWrite={false}
            />
          </mesh>
        )}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.2, 0.16, 0.3, 16]} />
          <meshStandardMaterial color="#aeaeb2" metalness={0.85} roughness={0.22} />
        </mesh>
      </group>

      {/* 2. BRUSHED-ALUMINUM CEILING FAN */}
      <group
        ref={fanGroup}
        onClick={(e) => {
          e.stopPropagation();
          fanSpeedRef.current = 15.0;
        }}
      >
        <group ref={fanBladesRef}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.22, 0.14, seg]} />
            <meshStandardMaterial
              color="#d1d1d6"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>
          {[0, 1, 2, 3].map((idx) => (
            <group key={idx} rotation={[0, (Math.PI / 2) * idx, 0]}>
              <mesh position={[0.46, 0, 0]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.56, 0.032, 0.17]} />
                <meshStandardMaterial
                  color="#2997ff"
                  emissive="#0071e3"
                  emissiveIntensity={0.25}
                  metalness={0.55}
                  roughness={0.25}
                />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 3. PRECISION THERMOMETER */}
      <group
        ref={thermoGroup}
        onClick={(e) => {
          e.stopPropagation();
          pulseScaleRef.current.thermo = 1.3;
        }}
      >
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.24, seg, seg]} />
          <meshStandardMaterial
            color={MOTION_TUNING.COLORS.thermoCoral}
            emissive={MOTION_TUNING.COLORS.thermoCoral}
            emissiveIntensity={0.5}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.78, 16]} />
          <meshStandardMaterial color="#f5f5f7" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.55, 12]} />
          <meshStandardMaterial
            color={MOTION_TUNING.COLORS.thermoCoral}
            emissive={MOTION_TUNING.COLORS.thermoCoral}
            emissiveIntensity={0.65}
          />
        </mesh>
      </group>

      {/* 4. FROSTED-GLASS SENSOR ORB WITH APPLE BLUE RING */}
      <group
        ref={sensorGroup}
        onClick={(e) => {
          e.stopPropagation();
          pulseScaleRef.current.sensor = 1.3;
        }}
      >
        <mesh>
          <sphereGeometry args={[0.32, seg, seg]} />
          <meshStandardMaterial
            color="#e5e5ea"
            emissive="#2997ff"
            emissiveIntensity={0.35}
            roughness={0.18}
            metalness={0.4}
          />
        </mesh>
        <mesh scale={1.5}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshBasicMaterial
            color="#2997ff"
            transparent
            opacity={MOTION_TUNING.BLOOM_HALO_OPACITY}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0.3, 0]}>
          <torusGeometry args={[0.52, 0.02, 12, 48]} />
          <meshBasicMaterial color="#2997ff" transparent opacity={0.85} />
        </mesh>
      </group>
    </group>
  );
}

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-3xl bg-[#1c1c1e] p-6 text-xs text-[#a1a1a6]">
          Interactive Classroom Hardware Ready
        </div>
      );
    }
    return this.props.children;
  }
}

function Scene3D({ className = 'h-72 w-full' }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const isSmallOrLowCpu =
      window.innerWidth < 768 ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    setLowPower(Boolean(isSmallOrLowCpu));

    const onVisibility = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, []);

  if (prefersReducedMotion) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#1c1c1e] p-6 text-center`}
      >
        <Cpu className="h-10 w-10 text-[#2997ff]" />
        <p className="mt-2 text-xs font-medium text-[#a1a1a6]">
          Smart Classroom Hardware Core (Reduced Motion)
        </p>
      </div>
    );
  }

  const isPaused = !inView || !tabVisible;
  const particleCount = lowPower
    ? MOTION_TUNING.PARTICLE_COUNT_MOBILE
    : MOTION_TUNING.PARTICLE_COUNT_DESKTOP;

  return (
    <div
      ref={containerRef}
      data-cursor="Drag"
      className={`relative overflow-hidden rounded-3xl ${className}`}
      title="Move cursor to push classroom objects, or click the lightbulb & fan"
    >
      {/* Subtle Apple studio radial spotlight behind floating hardware */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_48%,rgba(41,151,255,0.14),transparent_68%)] mix-blend-screen"
      />

      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 46 }}
          dpr={[1, MOTION_TUNING.MAX_DPR]}
          frameloop={isPaused ? 'never' : 'always'}
          gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
        >
          <ClassroomParticles count={particleCount} />
          <PhysicsClassroomObjects lowPower={lowPower} />
        </Canvas>
      </WebGLErrorBoundary>

      <span className="pointer-events-none absolute bottom-3 right-4 z-20 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-[#a1a1a6] backdrop-blur-md">
        Push with cursor • Click bulb or fan
      </span>
    </div>
  );
}

// --- components/LiveRoomIso.jsx ---
/**
 * Live Isometric 3D-Perspective Classroom Twin
 * Reflects the real-time ON/OFF state and fan speeds from the Control page.
 * Teachers can also click any fixture directly inside the room to switch it live!
 */
function LiveRoomIso() {
  const { currentRoom, lights, fans, toggleLight, toggleFan } = useClassroom();

  const lightsOn = lights.filter((l) => l.isOn).length;
  const fansOn = fans.filter((f) => f.isOn).length;

  // Map 8 lights and 6 fans to coordinates (%) on the isometric classroom ceiling/floor
  const lightPositions = [
    { left: '25%', top: '16%' },
    { left: '72%', top: '16%' },
    { left: '24%', top: '38%' },
    { left: '72%', top: '38%' },
    { left: '24%', top: '62%' },
    { left: '88%', top: '48%' },
    { left: '50%', top: '52%' },
    { left: '50%', top: '82%' },
  ];

  const fanPositions = [
    { left: '34%', top: '28%' },
    { left: '64%', top: '28%' },
    { left: '34%', top: '52%' },
    { left: '64%', top: '52%' },
    { left: '34%', top: '75%' },
    { left: '64%', top: '75%' },
  ];

  return (
    <section className="glass-card overflow-hidden p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-500 dark:text-tealaccent-400">
            <Sparkles className="h-3.5 w-3.5" />
            Real-Time Digital Twin
          </div>
          <h2 className="mt-0.5 font-display text-lg font-bold text-slate-900 dark:text-white">
            Live Classroom Floorplan ({currentRoom.id})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Synced with Control relays — click any light zone or fan below to toggle it live
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-600 dark:text-amber-300">
            Lights: {lightsOn}/{lights.length} ON
          </span>
          <span className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-teal-600 dark:text-teal-300">
            Fans: {fansOn}/{fans.length} ON
          </span>
        </div>
      </div>

      {/* Isometric 3D Perspective Stage */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900/95 py-8 dark:border-sky-500/15 dark:bg-navy-950/90">
        {/* Ambient room illumination based on how many lights are ON */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: lightsOn / Math.max(1, lights.length),
            background:
              'radial-gradient(circle at 50% 45%, rgba(56,189,248,0.22), rgba(251,191,36,0.08), transparent 72%)',
          }}
        />

        {/* Tilted Isometric Floor Plate */}
        <div
          className="relative h-72 w-[90%] max-w-xl rounded-2xl border-2 border-sky-400/30 bg-navy-900/90 shadow-[0_28px_60px_rgba(0,0,0,0.65)] transition-transform duration-500 sm:h-80"
          style={{
            transform: 'perspective(900px) rotateX(46deg) rotateZ(-14deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front Smart Board & Teacher Podium */}
          <div className="absolute inset-x-10 top-2.5 flex h-6 items-center justify-center rounded-md border border-sky-400/50 bg-sky-500/20 text-[10px] font-bold uppercase tracking-widest text-sky-200 shadow-glow">
            Smart Board & Podium
          </div>

          {/* Student Desk Grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 bottom-7 top-12 grid grid-cols-4 gap-3 opacity-35"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded border border-slate-600 bg-slate-800/80"
              />
            ))}
          </div>

          {/* 8 Interactive LED Light Nodes */}
          {lights.map((light, idx) => {
            const pos = lightPositions[idx] || { left: '50%', top: '50%' };
            return (
              <button
                key={light.id}
                type="button"
                data-cursor="View"
                onClick={() => toggleLight(light.id)}
                aria-label={`${light.name}: ${light.isOn ? 'ON' : 'OFF'}. Click to toggle.`}
                title={`${light.name} (${light.isOn ? 'ON' : 'OFF'})`}
                style={{ left: pos.left, top: pos.top }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                  light.isOn
                    ? 'border-amber-300 bg-amber-400/30 text-amber-200 shadow-[0_0_26px_8px_rgba(251,191,36,0.45)] scale-110'
                    : 'border-slate-700 bg-navy-950/90 text-slate-500 hover:border-slate-500'
                }`}
              >
                <Lightbulb className="h-4 w-4" />
              </button>
            );
          })}

          {/* 6 Interactive Ceiling Fan Nodes */}
          {fans.map((fan, idx) => {
            const pos = fanPositions[idx] || { left: '50%', top: '50%' };
            return (
              <button
                key={fan.id}
                type="button"
                data-cursor="View"
                onClick={() => toggleFan(fan.id)}
                aria-label={`${fan.name}: ${fan.isOn ? `ON speed ${fan.speed}` : 'OFF'}. Click to toggle.`}
                title={`${fan.name} — Speed ${fan.speed}/5`}
                style={{ left: pos.left, top: pos.top }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 ${
                  fan.isOn
                    ? 'border-tealaccent-400 bg-tealaccent-500/25 text-tealaccent-400 shadow-[0_0_20px_rgba(45,212,191,0.4)]'
                    : 'border-slate-700 bg-navy-950/90 text-slate-600 hover:border-slate-500'
                }`}
              >
                <Fan
                  className={`h-4 w-4 ${fan.isOn ? 'animate-spin' : ''}`}
                  style={
                    fan.isOn
                      ? { animationDuration: `${Math.max(0.35, 2.1 - fan.speed * 0.32)}s` }
                      : undefined
                  }
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- components/HorizontalFeatures.jsx ---
gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    step: '01',
    title: '60GHz Radar Occupancy',
    description:
      'Millimeter-wave presence sensors count seated students accurately without cameras — protecting privacy while driving live capacity rings.',
    metric: '99.2% Detection Accuracy',
    icon: Radar,
    accent: 'from-electric-600/25 to-sky-500/5 border-sky-500/30',
  },
  {
    step: '02',
    title: 'Daylight-Harvesting LEDs',
    description:
      'Photodiode lux meters near window bays dim east-wall strips automatically whenever natural sunlight exceeds 450 lux.',
    metric: '-24% Lighting kWh',
    icon: SunMedium,
    accent: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
  },
  {
    step: '03',
    title: 'Zero-Queue RFID Attendance',
    description:
      'Dual-antenna doorway readers log student roll numbers in under 120ms and flag late entries automatically for faculty CSV export.',
    metric: '< 0.12s Badge Scan',
    icon: Fingerprint,
    accent: 'from-tealaccent-500/25 to-teal-500/5 border-tealaccent-400/30',
  },
  {
    step: '04',
    title: 'Predictive AQI & Thermal Guard',
    description:
      'CO2, PM2.5, and thermistor nodes ramp ceiling fan PWM speeds proactively before stuffy lecture air impacts student concentration.',
    metric: 'Auto PWM Speed 1–5',
    icon: ShieldAlert,
    accent: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
  },
];

/**
 * GSAP ScrollTrigger Pinned Horizontal Scroll Section
 * On desktop, vertical scrolling pins this container and glides the 4 engineering cards
 * horizontally across the screen. On mobile or reduced-motion, falls back to a clean grid.
 */
function HorizontalFeatures() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (window.innerWidth < 1024) return; // Keep touch/mobile native & fast

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - section.clientWidth + 32);

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 14%',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Smart Classroom Engineering Features"
      className="overflow-hidden py-6"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-500 dark:text-tealaccent-400">
            Campus IoT Architecture
          </span>
          <SplitTextReveal
            text="Smart Classroom Subsystems"
            highlightWord="Subsystems"
            className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
          />
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Scroll down to inspect each hardware layer →
        </p>
      </div>

      <div
        ref={trackRef}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:flex lg:w-max lg:gap-6"
      >
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.step}
              data-cursor="View"
              className={`glass-card relative flex flex-col justify-between bg-gradient-to-br p-6 lg:w-[390px] lg:shrink-0 ${item.accent}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-widest text-sky-500 dark:text-tealaccent-400">
                    MODULE {item.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-navy-950/40 text-sky-400">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-5 font-display text-xl font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-800/80">
                <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  {item.metric}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Active Node
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// --- components/StatCard.jsx ---
function AnimatedMetricValue({ value, reducedMotion }) {
  const spanRef = useRef(null);
  const isInView = useInView(spanRef, { once: true, margin: '-20px' });
  const rawString = String(value ?? '');

  const match = rawString.match(/^([₹$-]?)(\d+(?:\.\d+)?)(.*)$/);
  const [displayNum, setDisplayNum] = useState(match ? Number(match[2]) : 0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!match) return;
    const target = Number(match[2]);

    if (reducedMotion) {
      setDisplayNum(target);
      return;
    }
    if (!isInView) return;

    const startVal = hasAnimatedRef.current ? displayNum : 0;
    const duration = hasAnimatedRef.current ? 300 : MOTION_TUNING.COUNT_UP_DURATION_MS;
    hasAnimatedRef.current = true;

    const startTime = performance.now();
    let rafId;

    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayNum(startVal + (target - startVal) * eased);
      if (progress < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [rawString, isInView, reducedMotion]);

  if (!match) return <span>{rawString}</span>;

  const [, prefix, numPart, suffix] = match;
  const decimals = numPart.includes('.') ? numPart.split('.')[1].length : 0;

  return (
    <span ref={spanRef}>
      {prefix}
      {displayNum.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/**
 * Calm Apple-Style StatCard
 * - Pure white (#ffffff) in light mode, elevated graphite (#1c1c1e) in dark mode
 * - Large tabular numbers, small muted labels, generous padding
 * - Spring scroll-reveal, gentle hover lift & scale, count-up numbers
 * - Optional subtle glare highlight on Home
 */
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'blue',
  badge,
  ringPercent,
  gaugeTemp,
  enableTilt = false,
  index = 0,
  children,
}) {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, active: false });

  // Single Apple accent + Apple status colours
  const iconToneMap = {
    blue: 'text-[var(--accent)] bg-[var(--accent-soft)]',
    sky: 'text-[var(--accent)] bg-[var(--accent-soft)]',
    teal: 'text-[var(--accent)] bg-[var(--accent-soft)]',
    emerald: 'text-[#30d158] bg-[#30d158]/12',
    amber: 'text-[#ff9f0a] bg-[#ff9f0a]/12',
    rose: 'text-[#ff453a] bg-[#ff453a]/12',
  };

  const handleMouseMove = (e) => {
    if (!enableTilt || reducedMotion || !cardRef.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    setGlare({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
      active: true,
    });
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const clampedRing = Math.max(0, Math.min(100, ringPercent ?? 0));
  const strokeDashoffset = circumference - (clampedRing / 100) * circumference;

  const tempRatio =
    typeof gaugeTemp === 'number'
      ? Math.max(0, Math.min(1, (gaugeTemp - 16) / 20))
      : null;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setGlare((g) => ({ ...g, active: false }))}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      whileHover={reducedMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={{ ...APPLE_SPRING, delay: Math.min(index * 0.04, 0.24) }}
      className="glass-card relative overflow-hidden p-6 hover:shadow-apple-hover"
    >
      {/* Subtle Apple-like specular sheen on Home cards */}
      {enableTilt && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: glare.active ? 1 : 0,
            background: `radial-gradient(240px circle at ${glare.x}% ${glare.y}%, rgba(41, 151, 255, 0.11), transparent 72%)`,
          }}
        />
      )}

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-[var(--muted)]">
            {title}
          </p>
          <div className="mt-2.5 flex flex-wrap items-baseline gap-2.5">
            <span className="font-display text-3xl font-semibold tracking-[-0.025em] text-[var(--text)] sm:text-4xl tabular-nums">
              <AnimatedMetricValue value={value} reducedMotion={Boolean(reducedMotion)} />
            </span>
            {badge && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.className}`}
              >
                {badge.dotClass && (
                  <span className={`h-1.5 w-1.5 rounded-full ${badge.dotClass}`} />
                )}
                {badge.label}
              </span>
            )}
          </div>
        </div>

        {typeof ringPercent === 'number' ? (
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="var(--surface-subtle)"
                strokeWidth="5"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[11px] font-semibold text-[var(--text)] tabular-nums">
              {Math.round(clampedRing)}%
            </span>
          </div>
        ) : (
          Icon && (
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                iconToneMap[accent] || iconToneMap.blue
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          )
        )}
      </div>

      {tempRatio !== null && (
        <div className="relative z-10 mt-4" aria-label={`Temperature gauge at ${gaugeTemp} degrees Celsius`}>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-subtle)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${Math.round(tempRatio * 100)}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-medium text-[var(--muted)]">
            <span>16°C</span>
            <span>24°C Ideal</span>
            <span>36°C</span>
          </div>
        </div>
      )}

      <div className="relative z-10">{children}</div>

      {subtitle && (
        <p className="relative z-10 mt-3.5 text-xs text-[var(--muted)]">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// --- components/DeviceToggle.jsx ---
/**
 * Calm Apple-Style IoT Device Toggle Card
 * Uses iOS green (#30d158) active switches, single blue accent sliders,
 * spring physics thumb motion, glowing bulb icon, and speed-matched fan rotation.
 */
function DeviceToggle({
  device,
  type = 'light',
  onToggle,
  onSpeedChange,
}) {
  const isFan = type === 'fan';
  const Icon = isFan ? Fan : Lightbulb;
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={reducedMotion ? undefined : { y: -3, scale: 1.01 }}
      transition={APPLE_SPRING}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
              device.isOn
                ? isFan
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                  : 'bg-[#ff9f0a]/15 text-[#ff9f0a] shadow-[0_0_20px_rgba(255,159,10,0.35)]'
                : 'bg-[var(--surface-subtle)] text-[var(--muted)]'
            }`}
          >
            <Icon
              className={`h-5 w-5 transition-transform ${
                isFan && device.isOn ? 'animate-spin' : ''
              } ${!isFan && device.isOn ? 'scale-110' : ''}`}
              style={
                isFan && device.isOn
                  ? { animationDuration: `${Math.max(0.35, 2.15 - device.speed * 0.34)}s` }
                  : undefined
              }
              aria-hidden="true"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--text)]">
              {device.name}
            </h3>
            <p className="text-xs text-[var(--muted)]">
              {device.zone} {!isFan && device.watts ? `• ${device.watts}W` : ''}
            </p>
          </div>
        </div>

        {/* Apple iOS-Style Spring Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={device.isOn}
          aria-label={`Toggle ${device.name}`}
          onClick={() => onToggle(device.id)}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
            device.isOn ? 'bg-[#30d158]' : 'bg-[var(--surface-subtle)]'
          }`}
        >
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className={`pointer-events-none block h-6 w-6 rounded-full bg-white shadow-sm ${
              device.isOn ? 'ml-auto' : 'mr-auto'
            }`}
          />
        </button>
      </div>

      {isFan && (
        <div className="mt-4 border-t border-[var(--border)] pt-3.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor={`fan-speed-${device.id}`} className="font-medium text-[var(--muted)]">
              Fan Speed
            </label>
            <span className="font-mono font-semibold text-[var(--accent)]">
              Level {device.speed} / 5
            </span>
          </div>
          <input
            id={`fan-speed-${device.id}`}
            type="range"
            min="1"
            max="5"
            step="1"
            value={device.speed}
            onChange={(e) => onSpeedChange(device.id, e.target.value)}
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[var(--surface-subtle)] accent-[var(--accent)]"
          />
          <div className="mt-1 flex justify-between text-[10px] font-mono text-[var(--muted)]">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// --- components/ChartCard.jsx ---
/**
 * Calm Apple-style frosted tooltip for Recharts graphs.
 */
function CustomChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.14 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur-md"
    >
      {label && (
        <p className="mb-1.5 font-mono text-[11px] font-medium text-[var(--muted)]">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[var(--muted)]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill || 'var(--accent)' }}
              />
              {entry.name}:
            </span>
            <span className="font-mono font-semibold text-[var(--text)] tabular-nums">
              {entry.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Calm Apple-style ChartCard container with spring scroll-reveal.
 */
function ChartCard({ title, subtitle, action, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={APPLE_SPRING}
      className="glass-card flex flex-col p-6"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--text)]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-[var(--muted)]">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full flex-1">{children}</div>
    </motion.section>
  );
}

// --- components/DataTable.jsx ---
/**
 * Reusable accessible DataTable with sortable column headers and
 * light staggered fade-in on table rows so numbers stay fast & readable.
 */
function DataTable({
  columns,
  rows,
  sortKey,
  sortDir,
  onSort,
  emptyTitle = 'No matching records',
  emptyDescription = 'Try adjusting your search query or filter criteria.',
}) {
  if (!rows || rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/80 dark:border-slate-800 dark:bg-navy-950/60">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                    }
                    className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key)}
                        className="inline-flex items-center gap-1.5 rounded hover:text-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                      >
                        <span>{col.label}</span>
                        {isSorted ? (
                          sortDir === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-sky-500" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-sky-500" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                        )}
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
            {rows.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.025, 0.25) }}
                className="transition-colors hover:bg-sky-500/[0.04] dark:hover:bg-sky-400/[0.05]"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-200"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- components/Modal.jsx ---
/**
 * Reusable accessible Modal dialog.
 * Supports Escape key dismissal, backdrop click, and ARIA dialog attributes.
 */
function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18 }}
            className="glass-card relative z-10 w-full max-w-lg p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <h2
                id="modal-heading"
                className="font-display text-lg font-bold text-slate-900 dark:text-white"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- components/Toast.jsx ---
/**
 * Calm Apple-Style Floating Toast Stack with Spring Entrance.
 */
function ToastContainer() {
  const { toasts, dismissToast } = useClassroom();

  const iconByVariant = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0 text-[#30d158]" />,
    info: <Info className="h-4 w-4 shrink-0 text-[var(--accent)]" />,
    error: <AlertTriangle className="h-4 w-4 shrink-0 text-[#ff453a]" />,
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col gap-2.5"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94, transition: { duration: 0.16 } }}
            transition={APPLE_SPRING}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 px-4 py-3 text-sm font-medium text-[var(--text)] shadow-2xl backdrop-blur-xl"
          >
            {iconByVariant[toast.variant] || iconByVariant.success}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="ml-2 rounded-full p-1 text-[var(--muted)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- components/Layout.jsx ---
const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/attendance', label: 'Attendance', icon: Users },
  { to: '/energy', label: 'Energy', icon: Zap },
  { to: '/notices', label: 'Notices', icon: Megaphone },
  { to: '/control', label: 'Control', icon: Sliders },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

/**
 * Main Dashboard Shell — Apple Calm Design + Sticky Frosted-Glass Navbar
 * Smooth fade + slight slide spring route transitions, single blue accent, generous spacing.
 */
function Layout() {
  const { teacher, logout } = useAuth();
  const {
    theme,
    toggleTheme,
    classrooms,
    selectedRoomId,
    selectClassroom,
    notifications,
    markAllNotificationsRead,
  } = useClassroom();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  const location = useLocation();
  const navigate = useNavigate();
  const currentOutlet = useOutlet();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Calm Monochrome Apple Sidebar */}
      <aside
        aria-label="Primary Sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--border)] bg-[var(--card)] transition-all duration-300 lg:static ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Magnetic strength={0.2}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
                <Cpu className="h-5 w-5" />
              </div>
            </Magnetic>
            {!collapsed && (
              <div className="truncate">
                <span className="font-display text-base font-semibold tracking-tight text-[var(--text)]">
                  AetherRoom
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">
                  Teacher Portal
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--surface-subtle)] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className="group relative block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {({ isActive }) => (
                <div
                  className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      transition={APPLE_SPRING}
                      className="absolute inset-0 rounded-xl bg-[var(--accent-soft)]"
                    />
                  )}

                  <Magnetic strength={0.18} className="relative z-10 flex items-center">
                    <Icon
                      className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105"
                      aria-hidden="true"
                    />
                  </Magnetic>

                  {!collapsed && (
                    <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">
                      {label}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-[var(--border)] p-3 lg:block">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-[var(--muted)] transition hover:bg-[var(--surface-subtle)] hover:text-[var(--text)]"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Sticky Frosted-Glass Apple Top Navbar */}
        <header className="apple-frosted-nav sticky top-0 z-30 flex h-16 items-center justify-between gap-3 px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-xl border border-[var(--border)] p-2 text-[var(--text)] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <label htmlFor="classroom-select" className="sr-only">
                Select Classroom
              </label>
              <select
                id="classroom-select"
                value={selectedRoomId}
                onChange={(e) => selectClassroom(e.target.value)}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-xs font-medium text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] sm:text-sm"
              >
                {classrooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right md:block">
              <p className="font-mono text-xs font-medium text-[var(--text)] tabular-nums">
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                {now.toLocaleDateString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>

            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text)] transition active:scale-95 hover:border-[var(--accent)]"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </Magnetic>

            <div className="relative">
              <Magnetic strength={0.2}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((o) => !o)}
                  aria-label="Notifications"
                  aria-expanded={notifOpen}
                  className="relative rounded-full border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text)] transition active:scale-95 hover:border-[var(--accent)]"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </Magnetic>

              {notifOpen && (
                <div className="glass-card absolute right-0 mt-2 w-80 p-4 shadow-2xl">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="font-display text-sm font-semibold">Notifications</span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-xs font-medium text-[var(--accent)] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`rounded-2xl border p-3 text-xs ${
                          n.unread
                            ? 'border-[var(--accent)]/30 bg-[var(--accent-soft)]'
                            : 'border-[var(--border)]'
                        }`}
                      >
                        <p className="font-semibold text-[var(--text)]">{n.title}</p>
                        <p className="mt-0.5 text-[var(--muted)]">{n.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--card)] py-1 pl-1.5 pr-3">
              <div
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white"
              >
                {teacher?.avatarInitials || 'TC'}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-tight text-[var(--text)]">
                  {teacher?.name}
                </p>
                <p className="text-[10px] text-[var(--muted)]">Faculty</p>
              </div>
            </div>

            <Magnetic strength={0.2}>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out of Teacher Portal"
                title="Logout"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#ff453a]/25 bg-[#ff453a]/10 px-3.5 py-1.5 text-xs font-medium text-[#ff453a] transition active:scale-95 hover:bg-[#ff453a]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff453a]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </Magnetic>
          </div>
        </header>

        {/* Smooth Apple Spring Route Transition (Fade + Slight Slide) */}
        <main className="relative flex-1 px-4 py-8 sm:px-8 lg:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={APPLE_SPRING}
              className="mx-auto max-w-6xl"
            >
              {currentOutlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// --- pages/Login.jsx ---
/**
 * Teacher Login Page — Apple Pro Dark Stage (#000000) + Lusion 3D Physics Hero
 * Single accent (#2997ff), huge display typography, clean #1c1c1e sign-in card.
 */
function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(DEMO_TEACHER.email);
  const [password, setPassword] = useState(DEMO_TEACHER.password);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your faculty email and password.');
      return;
    }

    setSubmitting(true);
    // TODO: replace with real API/JWT auth
    const result = await login(email, password);
    setSubmitting(false);

    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_TEACHER.email);
    setPassword(DEMO_TEACHER.password);
    setError('');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 text-[#f5f5f7]">
      {/* Subtle Apple-style soft radial halo behind hero only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_45%,rgba(41,151,255,0.14),transparent_60%)]"
      />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Hero Column with Huge Apple Typography + Lusion Physics 3D */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={APPLE_SPRING}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1c1c1e] px-3.5 py-1.5 text-xs font-medium text-[#a1a1a6]">
            <ShieldCheck className="h-4 w-4 text-[#2997ff]" />
            Faculty-Only Smart Campus Portal
          </div>

          <h1 className="hero-headline mt-6 font-display text-[#f5f5f7]">
            Classroom.{' '}
            <span className="bg-gradient-to-b from-white to-[#2997ff] bg-clip-text text-transparent">
              Reimagined.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#a1a1a6]">
            Real-time occupancy sensing, effortless climate and lighting control,
            and instant RFID attendance—crafted exclusively for teaching faculty.
          </p>

          {/* Floating 3D Hardware Stage with Soft Studio Shadow */}
          <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-b from-[#1c1c1e] to-black p-2 shadow-[0_32px_80px_rgba(0,0,0,0.9)]">
            <Suspense
              fallback={
                <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-2xl bg-[#1c1c1e] text-xs font-medium text-[#a1a1a6] sm:h-72">
                  Preparing 3D Classroom Hardware...
                </div>
              }
            >
              <Scene3D className="h-64 w-full sm:h-72" />
            </Suspense>
          </div>
        </motion.div>

        {/* Right Calm Apple Sign-In Card (#1c1c1e) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...APPLE_SPRING, delay: 0.08 }}
          className="lg:col-span-5"
        >
          <div className="rounded-3xl border border-white/10 bg-[#1c1c1e] p-8 shadow-2xl sm:p-10">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2997ff] text-white">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight text-white">
                  Teacher Portal
                </h2>
                <p className="text-xs text-[#a1a1a6]">
                  Authorized Faculty Sign-In Only
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-[#ff453a]/30 bg-[#ff453a]/10 p-3.5 text-xs font-medium text-[#ff453a]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="teacher-email"
                  className="mb-1.5 block text-xs font-medium text-[#a1a1a6]"
                >
                  Faculty Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#6e6e73]" />
                  <input
                    id="teacher-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="prof.sharma@college.edu"
                    className="w-full rounded-xl border border-white/10 bg-black/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6e6e73] outline-none transition focus:border-[#2997ff] focus:ring-2 focus:ring-[#2997ff]/25"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="teacher-password"
                  className="mb-1.5 block text-xs font-medium text-[#a1a1a6]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#6e6e73]" />
                  <input
                    id="teacher-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-black/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6e6e73] outline-none transition focus:border-[#2997ff] focus:ring-2 focus:ring-[#2997ff]/25"
                  />
                </div>
              </div>

              <Magnetic strength={0.16} className="block w-full pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#2997ff] py-3 text-sm font-medium text-white transition hover:bg-[#47a6ff] active:scale-[0.97] disabled:opacity-50"
                >
                  {submitting ? 'Verifying Faculty Credentials...' : 'Sign In'}
                </button>
              </Magnetic>
            </form>

            <div className="mt-7 rounded-2xl border border-white/10 bg-black/50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2997ff]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Demo Faculty Account
                </span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs font-medium text-[#2997ff] hover:underline"
                >
                  Auto-fill
                </button>
              </div>
              <p className="mt-2 font-mono text-xs text-[#f5f5f7]">
                {DEMO_TEACHER.email}
              </p>
              <p className="font-mono text-xs text-[#a1a1a6]">
                Password: {DEMO_TEACHER.password}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- pages/Home.jsx ---
/**
 * Home — Apple Product-Page Hero + Lusion Interactive 3D + Calm Telemetry Dashboard
 */
function Home() {
  const {
    theme,
    currentRoom,
    isLoadingRoom,
    sensorError,
    setSensorError,
    lights,
    fans,
    autoMode,
    liveTrend,
    activities,
  } = useClassroom();

  const [heroMode, setHeroMode] = useState('3d');

  if (sensorError) {
    return <ErrorState message={sensorError} onRetry={() => setSensorError(null)} />;
  }

  const lightsOn = lights.filter((l) => l.isOn).length;
  const fansOn = fans.filter((f) => f.isOn).length;

  const occupancyPct = Math.round(
    (currentRoom.occupancy / Math.max(1, currentRoom.capacity)) * 100
  );

  const totalStudents =
    currentRoom.presentCount + currentRoom.absentCount + currentRoom.lateCount || 1;
  const presentPct = Math.round((currentRoom.presentCount / totalStudents) * 100);
  const latePct = Math.round((currentRoom.lateCount / totalStudents) * 100);
  const absentPct = Math.max(0, 100 - presentPct - latePct);

  const aqiMeta = getAqiMeta(currentRoom.aqi);
  const accentColor = theme === 'dark' ? '#2997ff' : '#0071e3';
  const axisColor = theme === 'dark' ? '#a1a1a6' : '#6e6e73';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(29,29,31,0.08)';

  return (
    <div className="space-y-16">
      {/* Apple-Style Centered Hero with Huge Typography & Product Visual Stage */}
      <section className="pt-4 text-center sm:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={APPLE_SPRING}
          className="mx-auto max-w-4xl"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1 text-xs font-medium text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[#30d158]" />
            Live Telemetry • {currentRoom.id} • Eco Auto-Mode {autoMode ? 'On' : 'Manual'}
          </p>

          <h1 className="hero-headline hero-headline-gradient mt-5 font-display">
            {currentRoom.name.split('•')[1]?.trim() || currentRoom.name}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Precision classroom sensing, effortless device control, and live attendance—brought together in one calm space for faculty.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Link to="/control" className="btn-primary">
                Open Room Controls
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/attendance" className="btn-secondary">
                Attendance Log
              </Link>
            </Magnetic>
          </div>
        </motion.div>

        {/* Large Centered Product-Style Visual Stage (Soft Gradient + Subtle Glow + Contact Shadow) */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...APPLE_SPRING, delay: 0.1 }}
          className="relative mx-auto mt-10 max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-b from-[#0b1320] via-[#060910] to-black p-3 shadow-[0_32px_70px_-20px_rgba(0,0,0,0.45)] sm:p-5">
            {/* Soft radial studio glow behind centered hardware */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(41,151,255,0.18),transparent_65%)]"
            />

            {/* Segmented Mode Switcher: Interactive 3D vs Studio Visual */}
            <div className="relative z-20 mb-3 flex justify-center">
              <div className="inline-flex rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setHeroMode('3d')}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
                    heroMode === '3d'
                      ? 'bg-[#2997ff] text-white'
                      : 'text-[#a1a1a6] hover:text-white'
                  }`}
                >
                  Interactive 3D
                </button>
                <button
                  type="button"
                  onClick={() => setHeroMode('studio')}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
                    heroMode === 'studio'
                      ? 'bg-[#2997ff] text-white'
                      : 'text-[#a1a1a6] hover:text-white'
                  }`}
                >
                  Studio Visual
                </button>
              </div>
            </div>

            {heroMode === '3d' ? (
              <Suspense
                fallback={
                  <div className="flex h-72 w-full animate-pulse items-center justify-center rounded-2xl bg-[#1c1c1e] text-xs text-[#a1a1a6] sm:h-80">
                    Loading Interactive Smart Classroom Hardware...
                  </div>
                }
              >
                <Scene3D className="h-72 w-full sm:h-80" />
              </Suspense>
            ) : (
              <AppleImage
                src="/images/hero-smart-classroom.png"
                fallbackSrc="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=85"
                alt="Floating smart classroom glass sensor pod, matte LED bulb, and brushed-aluminum fan hub"
                className="aspect-[16/9] max-h-80 w-full"
                parallax={false}
                priority
              />
            )}
          </div>

          {/* Subtle floating studio shadow underneath hero frame */}
          <div
            aria-hidden="true"
            className="mx-auto mt-3 h-4 w-3/4 rounded-full bg-black/20 blur-xl dark:bg-[#2997ff]/15"
          />
        </motion.div>
      </section>

      {/* 8 Calm Apple Stat Cards */}
      <section aria-label="Classroom key metrics">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Live Overview
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.025em] text-[var(--text)] sm:text-3xl">
              Room Telemetry at a Glance
            </h2>
          </div>
          <span className="text-xs text-[var(--muted)]">Updates every 4 seconds</span>
        </div>

        {isLoadingRoom ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              index={0}
              enableTilt
              title="Classroom Occupancy"
              value={`${currentRoom.occupancy}/${currentRoom.capacity}`}
              ringPercent={occupancyPct}
              subtitle={`${currentRoom.capacity - currentRoom.occupancy} seats open`}
            />

            <StatCard
              index={1}
              enableTilt
              title="Students Present"
              value={currentRoom.presentCount}
              icon={UserCheck}
              accent="emerald"
              badge={{
                label: `${presentPct}%`,
                className: 'bg-[#30d158]/12 text-[#30d158] border-[#30d158]/25',
              }}
              subtitle={`${currentRoom.lateCount} late • ${currentRoom.absentCount} absent`}
            />

            <StatCard
              index={2}
              enableTilt
              title="Lighting Zones"
              value={`${lightsOn} of ${lights.length}`}
              icon={Lightbulb}
              accent="blue"
              badge={{
                label: lightsOn > 0 ? 'ON' : 'OFF',
                className:
                  lightsOn > 0
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/25'
                    : 'bg-[var(--surface-subtle)] text-[var(--muted)] border-transparent',
              }}
              subtitle={`${lights.length - lightsOn} daylight-idle zones off`}
            />

            <StatCard
              index={3}
              enableTilt
              title="Ceiling Fans"
              value={`${fansOn} of ${fans.length}`}
              icon={Fan}
              accent="blue"
              badge={{
                label: fansOn > 0 ? 'ON' : 'OFF',
                className:
                  fansOn > 0
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/25'
                    : 'bg-[var(--surface-subtle)] text-[var(--muted)] border-transparent',
              }}
              subtitle={
                fansOn > 0
                  ? `Avg speed ${Math.round(
                      fans.filter((f) => f.isOn).reduce((s, f) => s + f.speed, 0) / fansOn
                    )}/5`
                  : 'All fans idle'
              }
            />

            <StatCard
              index={4}
              enableTilt
              title="Temperature"
              value={`${currentRoom.temperature}°C`}
              icon={Thermometer}
              accent={currentRoom.temperature > 26 ? 'amber' : 'blue'}
              gaugeTemp={currentRoom.temperature}
            />

            <StatCard
              index={5}
              enableTilt
              title="Energy Today"
              value={`${currentRoom.kwhToday} kWh`}
              icon={Zap}
              accent="amber"
              subtitle={`Est. ₹${(currentRoom.kwhToday * 8.5).toFixed(0)} (@ ₹8.5/kWh)`}
            />

            <StatCard
              index={6}
              enableTilt
              title="Attendance Split"
              value={`${presentPct}%`}
              icon={PieIcon}
              accent="emerald"
              subtitle={`Present ${presentPct}% • Late ${latePct}% • Absent ${absentPct}%`}
            >
              <div
                className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-subtle)]"
                aria-label="Attendance distribution bar"
              >
                <div style={{ width: `${presentPct}%` }} className="bg-[#30d158]" />
                <div style={{ width: `${latePct}%` }} className="bg-[#ff9f0a]" />
                <div style={{ width: `${absentPct}%` }} className="bg-[#ff453a]" />
              </div>
            </StatCard>

            <StatCard
              index={7}
              enableTilt
              title="Air Quality (AQI)"
              value={currentRoom.aqi}
              icon={Wind}
              accent={currentRoom.aqi <= 50 ? 'emerald' : currentRoom.aqi <= 100 ? 'amber' : 'rose'}
              badge={{
                label: aqiMeta.label,
                className: aqiMeta.badgeClass,
                dotClass: aqiMeta.dotClass,
              }}
              subtitle="CO2 & PM2.5 environmental sensor"
            />
          </div>
        )}
      </section>

      {/* Live Isometric Classroom Digital Twin */}
      <LiveRoomIso />

      {/* Live Trend Chart + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ChartCard
            title="Live Temperature & Power Trend"
            subtitle="Real-time sensor telemetry (°C vs kWh)"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveTrend} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accentColor} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="kwhFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#30d158" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#30d158" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="time" stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    name="Temp (°C)"
                    stroke={accentColor}
                    strokeWidth={2.5}
                    fill="url(#tempFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="kwh"
                    name="Energy (kWh)"
                    stroke="#30d158"
                    strokeWidth={2.5}
                    fill="url(#kwhFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="lg:col-span-5">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={APPLE_SPRING}
            className="glass-card flex h-full flex-col p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold tracking-tight text-[var(--text)]">
                  Recent Activity
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  Automated events & faculty actions
                </p>
              </div>
              <Activity className="h-5 w-5 text-[var(--accent)]" />
            </div>

            <ul className="space-y-3">
              {activities.map((item, idx) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...APPLE_SPRING, delay: idx * 0.04 }}
                  className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/60 p-3.5 text-xs"
                >
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      item.type === 'good'
                        ? 'bg-[#30d158]'
                        : item.type === 'eco'
                        ? 'bg-[#ff9f0a]'
                        : 'bg-[var(--accent)]'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text)]">{item.text}</p>
                    <span className="mt-0.5 block text-[11px] text-[var(--muted)]">{item.time}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        </div>
      </div>

      {/* Apple.com-Style Alternating Image + Text Features Section */}
      <AppleFeatures />

      {/* Pinned GSAP Horizontal Subsystems Showcase */}
      <HorizontalFeatures />
    </div>
  );
}

// --- pages/Attendance.jsx ---
/**
 * Attendance Page (Light-touch motion for fast table readability)
 */
function Attendance() {
  const { addToast } = useClassroom();

  const [query, setQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-11-24');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortKey, setSortKey] = useState('rollNo');
  const [sortDir, setSortDir] = useState('asc');

  const subjects = useMemo(
    () => ['ALL', ...new Set(ATTENDANCE_RECORDS.map((r) => r.subject))],
    []
  );

  const filteredRows = useMemo(() => {
    // TODO: Replace client-side filtering with GET /api/v1/attendance?date=...&subject=...
    return ATTENDANCE_RECORDS.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(query.toLowerCase()) ||
        row.rollNo.toLowerCase().includes(query.toLowerCase());
      const matchesDate = !selectedDate || row.date === selectedDate;
      const matchesSubject = selectedSubject === 'ALL' || row.subject === selectedSubject;
      const matchesStatus = selectedStatus === 'ALL' || row.status === selectedStatus;
      return matchesSearch && matchesDate && matchesSubject && matchesStatus;
    }).sort((a, b) => {
      const valA = String(a[sortKey] ?? '');
      const valB = String(b[sortKey] ?? '');
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [query, selectedDate, selectedSubject, selectedStatus, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedDate('');
    setSelectedSubject('ALL');
    setSelectedStatus('ALL');
  };

  const presentCount = filteredRows.filter((r) => r.status === 'Present').length;
  const lateCount = filteredRows.filter((r) => r.status === 'Late').length;
  const absentCount = filteredRows.filter((r) => r.status === 'Absent').length;
  const total = filteredRows.length || 1;

  const pieData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Late', value: lateCount, color: '#f59e0b' },
    { name: 'Absent', value: absentCount, color: '#ef4444' },
  ];

  const statusStyles = {
    Present: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-300',
    Late: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-300',
    Absent: 'bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-300',
  };

  const columns = [
    {
      key: 'rollNo',
      label: 'Roll No',
      sortable: true,
      render: (r) => <span className="font-mono font-semibold">{r.rollNo}</span>,
    },
    {
      key: 'name',
      label: 'Student Name',
      sortable: true,
      render: (r) => <span className="font-semibold text-slate-900 dark:text-white">{r.name}</span>,
    },
    { key: 'subject', label: 'Subject / Class', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (r) => (
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            statusStyles[r.status]
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'timeIn',
      label: 'Time In',
      sortable: true,
      render: (r) => <span className="font-mono text-xs">{r.timeIn}</span>,
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (r) => <span className="font-mono text-xs">{r.date}</span>,
    },
  ];

  const handleExport = () => {
    exportRowsToCsv(`attendance-${selectedDate || 'all'}.csv`, filteredRows);
    addToast(`Exported ${filteredRows.length} attendance rows to CSV`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Classroom Attendance
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            RFID badge check-ins, subject filters, and instant CSV sheet export
          </p>
        </div>

        <Magnetic>
          <button
            type="button"
            onClick={handleExport}
            disabled={filteredRows.length === 0}
            className="btn-primary"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </Magnetic>
      </div>

      {/* Light-touch Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          enableTilt={false}
          title="Filtered Records"
          value={filteredRows.length}
          icon={Users}
          accent="sky"
          subtitle="Total students in current view"
        />
        <StatCard
          enableTilt={false}
          title="Present"
          value={presentCount}
          icon={UserCheck}
          accent="emerald"
          subtitle={`${Math.round((presentCount / total) * 100)}% of filtered list`}
        />
        <StatCard
          enableTilt={false}
          title="Late Arrivals"
          value={lateCount}
          icon={Clock}
          accent="amber"
          subtitle={`${Math.round((lateCount / total) * 100)}% arrived after grace window`}
        />
        <StatCard
          enableTilt={false}
          title="Absent"
          value={absentCount}
          icon={UserX}
          accent="rose"
          subtitle={`${Math.round((absentCount / total) * 100)}% unrecorded`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="glass-card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <label htmlFor="att-search" className="mb-1 block text-xs font-medium text-slate-500">
                Search Student / Roll
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="att-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Aarav or 24CS001"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label htmlFor="att-date" className="mb-1 block text-xs font-medium text-slate-500">
                Lecture Date
              </label>
              <input
                id="att-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="att-subject" className="mb-1 block text-xs font-medium text-slate-500">
                Subject / Class
              </label>
              <select
                id="att-subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input-field"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub === 'ALL' ? 'All Subjects' : sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="att-status" className="text-xs font-medium text-slate-500">
                  Status
                </label>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-500 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
              <select
                id="att-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          <DataTable
            columns={columns}
            rows={filteredRows}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            emptyTitle="No attendance records found"
            emptyDescription="No students match the selected date, subject, or search query."
          />
        </div>

        <div className="lg:col-span-4">
          <ChartCard
            title="Attendance Breakdown"
            subtitle="Percentage split for current filter"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={4}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip unit=" students" />} />
                  <Legend verticalAlign="bottom" height={32} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

// --- pages/Energy.jsx ---
const PERIODS = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

/**
 * Energy Analytics Page (Light-touch motion + smooth animated tooltips)
 */
function Energy() {
  const { theme } = useClassroom();
  const [period, setPeriod] = useState('day');

  // TODO: Fetch from GET /api/v1/energy?range=${period}
  const activeData = ENERGY_DATASETS[period];
  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.15)';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Energy Consumption
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Smart sub-meter monitoring across lighting, HVAC fans, and AV equipment
          </p>
        </div>

        <div
          role="group"
          aria-label="Select energy reporting period"
          className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-navy-900"
        >
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              aria-pressed={period === p.id}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                period === p.id
                  ? 'bg-gradient-to-r from-electric-600 to-tealaccent-500 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          enableTilt={false}
          title={`Total Usage (${period.toUpperCase()})`}
          value={`${activeData.summary.totalKwh} kWh`}
          icon={Zap}
          accent="sky"
          subtitle="Measured via classroom smart CT clamp"
        />
        <StatCard
          enableTilt={false}
          title="Estimated Cost"
          value={`₹${activeData.summary.estimatedCost.toFixed(2)}`}
          icon={IndianRupee}
          accent="teal"
          subtitle="Calculated at institutional tariff ₹8.50/kWh"
        />
        <StatCard
          enableTilt={false}
          title="Savings vs Prior Period"
          value={`-${activeData.summary.savingsPercent}%`}
          icon={TrendingDown}
          accent="emerald"
          badge={{
            label: 'Eco Gain',
            className:
              'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-300',
          }}
          subtitle="Saved via Smart Occupancy Auto-Off"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ChartCard
            title="Hourly Load Curve (kWh)"
            subtitle="Peak lecture hours vs afternoon taper"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData.hourly} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <Tooltip content={<CustomChartTooltip unit=" kWh" />} />
                  <Line
                    type="monotone"
                    dataKey="kwh"
                    name="Usage"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2dd4bf' }}
                    activeDot={{ r: 6 }}
                    animationDuration={650}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="lg:col-span-5">
          <ChartCard
            title="Load Split by Category"
            subtitle="Lights vs Ceiling Fans vs Others (%)"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeData.breakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="46%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {activeData.breakdown.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip unit="%" />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      <ChartCard
        title="Smart Eco Usage vs Manual Baseline (kWh)"
        subtitle="Comparison showing electricity saved by automated classroom controls"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData.comparison} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip content={<CustomChartTooltip unit=" kWh" />} />
              <Legend />
              <Bar
                dataKey="current"
                name="Actual Smart Usage"
                fill="#2dd4bf"
                radius={[6, 6, 0, 0]}
                animationDuration={650}
              />
              <Bar
                dataKey="baseline"
                name="Manual Baseline"
                fill="#3b82f6"
                opacity={0.45}
                radius={[6, 6, 0, 0]}
                animationDuration={650}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}

// --- pages/Notices.jsx ---
const EMPTY_FORM = {
  id: null,
  title: '',
  message: '',
  priority: 'Medium',
  date: new Date().toISOString().slice(0, 10),
  pinned: false,
};

/**
 * Notices Page (Staggered card fade-in + Magnetic New Notice action)
 */
function Notices() {
  const { notices, saveNotice, deleteNotice, togglePinNotice } = useClassroom();

  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const sortedNotices = useMemo(() => {
    return notices
      .filter((n) => priorityFilter === 'ALL' || n.priority === priorityFilter)
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.date.localeCompare(a.date);
      });
  }, [notices, priorityFilter]);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (notice) => {
    setForm({ ...notice });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setFormError('Both title and announcement message are required.');
      return;
    }
    saveNotice(form);
    setModalOpen(false);
  };

  const priorityBadge = {
    High: 'bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-300',
    Medium: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-300',
    Low: 'bg-sky-500/15 text-sky-600 border-sky-500/30 dark:text-sky-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Classroom Notices
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Broadcast schedules, lab advisories, and smart-board announcements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="priority-filter" className="sr-only">
            Filter by priority
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field w-auto py-2"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <Magnetic>
            <button type="button" onClick={openCreateModal} className="btn-primary shrink-0">
              <Plus className="h-4 w-4" />
              New Notice
            </button>
          </Magnetic>
        </div>
      </div>

      {sortedNotices.length === 0 ? (
        <EmptyState
          title="No announcements yet"
          description="Create your first classroom announcement or clear the priority filter."
          action={
            <button type="button" onClick={openCreateModal} className="btn-primary">
              <Plus className="h-4 w-4" />
              Create Notice
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sortedNotices.map((notice, idx) => (
            <motion.article
              key={notice.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className={`glass-card flex flex-col justify-between p-5 transition ${
                notice.pinned ? 'border-sky-500/40 dark:border-tealaccent-400/40 shadow-glow' : ''
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        priorityBadge[notice.priority]
                      }`}
                    >
                      {notice.priority}
                    </span>
                    {notice.pinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-600 dark:text-tealaccent-400">
                        <Pin className="h-3 w-3" />
                        Pinned
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {notice.date}
                  </span>
                </div>

                <h2 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">
                  {notice.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {notice.message}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-200/70 pt-3 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => togglePinNotice(notice.id)}
                  aria-label={notice.pinned ? 'Unpin notice' : 'Pin notice'}
                  className="btn-secondary px-3 py-1.5 text-xs"
                >
                  <Pin className="h-3.5 w-3.5" />
                  {notice.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(notice)}
                  aria-label={`Edit ${notice.title}`}
                  className="btn-secondary px-3 py-1.5 text-xs"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteNotice(notice.id)}
                  aria-label={`Delete ${notice.title}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id ? 'Edit Announcement' : 'Create New Announcement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <p role="alert" className="rounded-xl bg-rose-500/15 p-3 text-xs font-medium text-rose-400">
              {formError}
            </p>
          )}

          <div>
            <label htmlFor="notice-title" className="mb-1 block text-xs font-semibold">
              Announcement Title
            </label>
            <input
              id="notice-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Lab Submission Deadline Extended"
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="notice-priority" className="mb-1 block text-xs font-semibold">
                Priority
              </label>
              <select
                id="notice-priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="input-field"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label htmlFor="notice-date" className="mb-1 block text-xs font-semibold">
                Date
              </label>
              <input
                id="notice-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notice-message" className="mb-1 block text-xs font-semibold">
              Message Details
            </label>
            <textarea
              id="notice-message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write clear instructions for faculty or classroom smart-board display..."
              className="input-field resize-none"
              required
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="h-4 w-4 rounded accent-sky-500"
            />
            Pin this announcement to the top of the board
          </label>

          <div className="flex justify-end gap-2.5 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {form.id ? 'Update Notice' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// --- pages/Control.jsx ---
/**
 * Classroom Hardware Control Page — Calm Apple Aesthetics + Spring Switches
 */
function Control() {
  const {
    currentRoom,
    lights,
    fans,
    autoMode,
    toggleLight,
    setAllLights,
    toggleFan,
    changeFanSpeed,
    setAllFans,
    toggleAutoMode,
  } = useClassroom();

  const lightsOnCount = lights.filter((l) => l.isOn).length;
  const fansOnCount = fans.filter((f) => f.isOn).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-[-0.025em] text-[var(--text)]">
          Hardware & Relay Control
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Direct control over {currentRoom.name} lighting zones and ceiling fan speeds
        </p>
      </div>

      <section className="glass-card flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-[var(--text)]">
              Smart Eco Auto-Off Mode
            </h2>
            <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-[var(--muted)]">
              Automatically powers down classroom lights and fans when millimeter-wave
              occupancy sensors detect 0 people for the configured delay window.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={autoMode}
          aria-label="Toggle Smart Eco Auto-Off Mode"
          onClick={toggleAutoMode}
          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
            autoMode ? 'bg-[#30d158]' : 'bg-[var(--surface-subtle)]'
          }`}
        >
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className={`pointer-events-none block h-7 w-7 rounded-full bg-white shadow ${
              autoMode ? 'ml-auto' : 'mr-auto'
            }`}
          />
        </button>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="h-5 w-5 text-[#ff9f0a]" />
            <h2 className="font-display text-lg font-semibold text-[var(--text)]">
              LED Lighting Zones ({lightsOnCount}/{lights.length} ON)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* TODO: Trigger MQTT bulk topic classroom/{id}/lights/all */}
            <Magnetic>
              <button
                type="button"
                onClick={() => setAllLights(true)}
                className="btn-primary px-4 py-2 text-xs"
              >
                <Power className="h-3.5 w-3.5" />
                All Lights ON
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => setAllLights(false)}
                className="btn-secondary px-4 py-2 text-xs"
              >
                All Lights OFF
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {lights.map((light) => (
            <DeviceToggle
              key={light.id}
              device={light}
              type="light"
              onToggle={toggleLight}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Fan className="h-5 w-5 text-[var(--accent)]" />
            <h2 className="font-display text-lg font-semibold text-[var(--text)]">
              Ceiling Fans & Speed Control ({fansOnCount}/{fans.length} ON)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* TODO: Trigger MQTT bulk topic classroom/{id}/fans/all */}
            <Magnetic>
              <button
                type="button"
                onClick={() => setAllFans(true)}
                className="btn-primary px-4 py-2 text-xs"
              >
                <Power className="h-3.5 w-3.5" />
                All Fans ON
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="button"
                onClick={() => setAllFans(false)}
                className="btn-secondary px-4 py-2 text-xs"
              >
                All Fans OFF
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fans.map((fan) => (
            <DeviceToggle
              key={fan.id}
              device={fan}
              type="fan"
              onToggle={toggleFan}
              onSpeedChange={changeFanSpeed}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// --- pages/Settings.jsx ---
/**
 * Settings Page (Light-touch staggered card fade-ins + Magnetic Save/Reset buttons)
 */
function Settings() {
  const {
    theme,
    setTheme,
    settings,
    updateSettings,
    resetSettings,
    setSensorError,
    addToast,
  } = useClassroom();
  const { updateTeacherProfile } = useAuth();

  const [form, setForm] = useState(settings);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.classroomName.trim()) {
      nextErrors.classroomName = 'Classroom name cannot be empty.';
    }
    if (form.tempLimit < 18 || form.tempLimit > 35) {
      nextErrors.tempLimit = 'Temperature threshold must be between 18°C and 35°C.';
    }
    if (form.aqiLimit < 30 || form.aqiLimit > 300) {
      nextErrors.aqiLimit = 'AQI alert limit must be between 30 and 300.';
    }
    if (form.maxOccupancy < 10 || form.maxOccupancy > 300) {
      nextErrors.maxOccupancy = 'Max occupancy must be between 10 and 300 seats.';
    }
    if (form.autoOffDelay < 1 || form.autoOffDelay > 60) {
      nextErrors.autoOffDelay = 'Auto-off delay must be between 1 and 60 minutes.';
    }
    if (!form.teacherName.trim() || !form.teacherEmail.includes('@')) {
      nextErrors.teacherProfile = 'Please provide a valid faculty name and college email.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateSettings(form);
    updateTeacherProfile({
      name: form.teacherName,
      department: form.teacherDepartment,
      email: form.teacherEmail,
    });
  };

  const handleReset = () => {
    setForm(DEFAULT_SETTINGS);
    setErrors({});
    resetSettings();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Portal & Sensor Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure classroom automation limits, faculty profile, and display preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6" noValidate>
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            1. Sensor & Automation Thresholds
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Alerts trigger when live classroom readings cross these boundaries
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="set-room" className="mb-1 block text-xs font-semibold">
                Primary Classroom Name
              </label>
              <input
                id="set-room"
                type="text"
                value={form.classroomName}
                onChange={(e) => setForm({ ...form, classroomName: e.target.value })}
                className="input-field"
              />
              {errors.classroomName && (
                <p className="mt-1 text-xs text-rose-500">{errors.classroomName}</p>
              )}
            </div>

            <div>
              <label htmlFor="set-occupancy" className="mb-1 block text-xs font-semibold">
                Maximum Occupancy (Seats)
              </label>
              <input
                id="set-occupancy"
                type="number"
                value={form.maxOccupancy}
                onChange={(e) => setForm({ ...form, maxOccupancy: Number(e.target.value) })}
                className="input-field"
              />
              {errors.maxOccupancy && (
                <p className="mt-1 text-xs text-rose-500">{errors.maxOccupancy}</p>
              )}
            </div>

            <div>
              <label htmlFor="set-temp" className="mb-1 block text-xs font-semibold">
                Temperature Alert Limit (°C)
              </label>
              <input
                id="set-temp"
                type="number"
                value={form.tempLimit}
                onChange={(e) => setForm({ ...form, tempLimit: Number(e.target.value) })}
                className="input-field"
              />
              {errors.tempLimit && (
                <p className="mt-1 text-xs text-rose-500">{errors.tempLimit}</p>
              )}
            </div>

            <div>
              <label htmlFor="set-aqi" className="mb-1 block text-xs font-semibold">
                Air Quality Alert Limit (AQI)
              </label>
              <input
                id="set-aqi"
                type="number"
                value={form.aqiLimit}
                onChange={(e) => setForm({ ...form, aqiLimit: Number(e.target.value) })}
                className="input-field"
              />
              {errors.aqiLimit && (
                <p className="mt-1 text-xs text-rose-500">{errors.aqiLimit}</p>
              )}
            </div>

            <div>
              <label htmlFor="set-delay" className="mb-1 block text-xs font-semibold">
                Empty-Room Auto-Off Delay (Minutes)
              </label>
              <input
                id="set-delay"
                type="number"
                value={form.autoOffDelay}
                onChange={(e) => setForm({ ...form, autoOffDelay: Number(e.target.value) })}
                className="input-field"
              />
              {errors.autoOffDelay && (
                <p className="mt-1 text-xs text-rose-500">{errors.autoOffDelay}</p>
              )}
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.06 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              2. Notification Preferences
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { key: 'emailAlerts', label: 'Daily energy & attendance summary emails' },
                { key: 'aqiPushAlerts', label: 'Instant alert when classroom AQI exceeds limit' },
                { key: 'occupancyAlerts', label: 'Notify when classroom exceeds seat capacity' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/70 p-3 dark:border-slate-800"
                >
                  <span className="text-xs font-medium">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={form[item.key]}
                    onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                    className="h-4 w-4 rounded accent-sky-500"
                  />
                </label>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              3. Teacher Profile & Appearance
            </h2>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="prof-name" className="mb-1 block text-xs font-semibold">
                  Teacher Full Name
                </label>
                <input
                  id="prof-name"
                  type="text"
                  value={form.teacherName}
                  onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="prof-dept" className="mb-1 block text-xs font-semibold">
                  Department
                </label>
                <input
                  id="prof-dept"
                  type="text"
                  value={form.teacherDepartment}
                  onChange={(e) => setForm({ ...form, teacherDepartment: e.target.value })}
                  className="input-field"
                />
              </div>

              {errors.teacherProfile && (
                <p className="text-xs text-rose-500">{errors.teacherProfile}</p>
              )}

              <div className="pt-2">
                <span className="mb-2 block text-xs font-semibold">Interface Theme</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                      theme === 'dark'
                        ? 'border-sky-500 bg-sky-500/15 text-sky-400'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    Deep Navy Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                      theme === 'light'
                        ? 'border-sky-500 bg-sky-500/15 text-sky-600'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    Daylight Crisp
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSensorError('Simulated MQTT broker timeout on ws://campus-iot.local:8883');
              addToast('Simulated gateway error on Home page', 'error');
            }}
            className="btn-secondary text-xs"
          >
            <Bug className="h-3.5 w-3.5" />
            Test Home Error State
          </button>

          <div className="flex items-center gap-3">
            <Magnetic>
              <button type="button" onClick={handleReset} className="btn-secondary">
                <RotateCcw className="h-4 w-4" />
                Reset Defaults
              </button>
            </Magnetic>
            <Magnetic>
              <button type="submit" className="btn-primary">
                <Save className="h-4 w-4" />
                Save Settings
              </button>
            </Magnetic>
          </div>
        </div>
      </form>
    </div>
  );
}

// --- App.jsx ---
/**
 * Root Application Shell
 * Connects Lenis smooth scrolling, top scroll progress bar, custom cursor,
 * 0–100% preloader, and reduced-motion accessibility wrapper.
 */
function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Start Lenis smooth scroll synced with GSAP ScrollTrigger once preloader finishes
  useSmoothScroll(!preloaderDone);

  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <ClassroomProvider>
          <Preloader onFinish={() => setPreloaderDone(true)} />
          <ScrollProgressBar />
          <CustomCursor />

          <Router>
            <Routes>
              {/* Public Faculty Login Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Teacher-Only Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="energy" element={<Energy />} />
                <Route path="notices" element={<Notices />} />
                <Route path="control" element={<Control />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <ToastContainer />
          </Router>
        </ClassroomProvider>
      </AuthProvider>
    </MotionConfig>
  );
}

// --- main.jsx ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
