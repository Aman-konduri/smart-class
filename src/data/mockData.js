/**
 * Central Mock Data Store
 * -----------------------
 * All front-end placeholder data lives in this single file so your team can
 * easily replace each section with fetch/axios API calls or WebSocket/MQTT streams later.
 *
 * // TODO: Replace mock exports below with REST API / WebSocket endpoints when backend is ready.
 */

export const DEMO_TEACHER = {
  id: 'TCH-104',
  name: 'Dr. Ananya Sharma',
  email: 'prof.sharma@college.edu',
  password: 'teacher123', // Demo-only password (never store plain passwords in production!)
  role: 'TEACHER',
  department: 'Computer Science & Engineering',
  avatarInitials: 'AS',
};

export const CLASSROOMS = [
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

export const INITIAL_LIGHTS = [
  { id: 'L1', name: 'Podium Spotlight', zone: 'Front Stage', isOn: true, watts: 24 },
  { id: 'L2', name: 'Whiteboard Array', zone: 'Front Stage', isOn: true, watts: 36 },
  { id: 'L3', name: 'Row 1–2 LED Panel', zone: 'Front Seating', isOn: true, watts: 40 },
  { id: 'L4', name: 'Row 3–4 LED Panel', zone: 'Mid Seating', isOn: true, watts: 40 },
  { id: 'L5', name: 'Row 5–6 LED Panel', zone: 'Rear Seating', isOn: true, watts: 40 },
  { id: 'L6', name: 'Window Bay Strip', zone: 'East Wall', isOn: false, watts: 28 },
  { id: 'L7', name: 'Aisle Guide Lights', zone: 'Walkway', isOn: true, watts: 18 },
  { id: 'L8', name: 'Exit & Back Alcove', zone: 'Rear Door', isOn: false, watts: 20 },
];

export const INITIAL_FANS = [
  { id: 'F1', name: 'Ceiling Fan 01', zone: 'Front Left', isOn: true, speed: 3 },
  { id: 'F2', name: 'Ceiling Fan 02', zone: 'Front Right', isOn: true, speed: 3 },
  { id: 'F3', name: 'Ceiling Fan 03', zone: 'Center Left', isOn: true, speed: 4 },
  { id: 'F4', name: 'Ceiling Fan 04', zone: 'Center Right', isOn: true, speed: 4 },
  { id: 'F5', name: 'Ceiling Fan 05', zone: 'Rear Left', isOn: false, speed: 2 },
  { id: 'F6', name: 'Ceiling Fan 06', zone: 'Rear Right', isOn: false, speed: 2 },
];

export const INITIAL_LIVE_TREND = [
  { time: '09:30', temp: 22.8, kwh: 11.2, occupancy: 38 },
  { time: '09:45', temp: 23.1, kwh: 11.9, occupancy: 42 },
  { time: '10:00', temp: 23.4, kwh: 12.6, occupancy: 45 },
  { time: '10:15', temp: 23.5, kwh: 13.3, occupancy: 46 },
  { time: '10:30', temp: 23.8, kwh: 14.1, occupancy: 47 },
  { time: '10:45', temp: 23.6, kwh: 14.8, occupancy: 46 },
];

export const INITIAL_ACTIVITY_FEED = [
  { id: 'act-1', time: 'Just now', text: 'RFID Gate synced 46 active student badges in CS-301', type: 'info' },
  { id: 'act-2', time: '3 mins ago', text: 'Window Bay Strip (L6) dimmed OFF due to high daylight lux', type: 'eco' },
  { id: 'act-3', time: '11 mins ago', text: 'CO2 & PM2.5 within safe threshold (AQI 42 • Good)', type: 'good' },
  { id: 'act-4', time: '24 mins ago', text: 'Dr. Ananya Sharma started session: CS301 Data Structures', type: 'info' },
];

export const ATTENDANCE_RECORDS = [
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

export const ENERGY_DATASETS = {
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

export const INITIAL_NOTICES = [
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

export const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'ME-102 Air Quality Alert', detail: 'AQI reached 112 (Moderate). Ventilation recommended.', unread: true },
  { id: 'n2', title: 'Eco Auto-Off Active', detail: '2 unoccupied zone lights turned off automatically.', unread: true },
  { id: 'n3', title: 'Attendance Synced', detail: 'CS301 morning batch RFID log completed.', unread: false },
];

export const DEFAULT_SETTINGS = {
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
