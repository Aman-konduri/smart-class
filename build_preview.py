#!/usr/bin/env python3
"""
Builds a browser-runnable dist/ folder directly from the modular Vite src/ files
so the Apple + Lusion Smart Classroom Dashboard runs live at http://localhost:8090.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
DIST = os.path.join(ROOT, "dist")

ORDERED_FILES = [
    "data/mockData.js",
    "utils/exportCsv.js",
    "utils/motionConfig.js",
    "hooks/useAuth.jsx",
    "hooks/useClassroom.jsx",
    "hooks/useSmoothScroll.js",
    "components/FeedbackStates.jsx",
    "components/ProtectedRoute.jsx",
    "components/ScrollProgressBar.jsx",
    "components/Preloader.jsx",
    "components/CustomCursor.jsx",
    "components/Magnetic.jsx",
    "components/SplitTextReveal.jsx",
    "components/AppleImage.jsx",
    "components/AppleFeatures.jsx",
    "components/Scene3D.jsx",
    "components/LiveRoomIso.jsx",
    "components/HorizontalFeatures.jsx",
    "components/StatCard.jsx",
    "components/DeviceToggle.jsx",
    "components/ChartCard.jsx",
    "components/DataTable.jsx",
    "components/Modal.jsx",
    "components/Toast.jsx",
    "components/Layout.jsx",
    "pages/Login.jsx",
    "pages/Home.jsx",
    "pages/Attendance.jsx",
    "pages/Energy.jsx",
    "pages/Notices.jsx",
    "pages/Control.jsx",
    "pages/Settings.jsx",
    "App.jsx",
    "main.jsx",
]

HEADER_IMPORTS = """import React, { Component, Suspense, createContext, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutlet } from 'react-router-dom';
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
"""

def strip_module_syntax(code, rel_path):
    code = re.sub(r"^import\s+[\s\S]*?from\s+['\"][^'\"]+['\"];?\s*$", "", code, flags=re.M)
    code = re.sub(r"^import\s+['\"][^'\"]+['\"];?\s*$", "", code, flags=re.M)
    code = re.sub(r"^const\s+Scene3D\s*=\s*lazy\([^\n]+\);\s*$", "", code, flags=re.M)
    if rel_path == "components/Layout.jsx":
        code = re.sub(r"\bicon:\s*Settings\b", "icon: SettingsIcon", code)
    code = re.sub(r"^export\s+default\s+", "", code, flags=re.M)
    code = re.sub(r"^export\s+(const|let|var|function|class)\s+", r"\1 ", code, flags=re.M)
    return f"// --- {rel_path} ---\n" + code.strip() + "\n"

def main():
    os.makedirs(DIST, exist_ok=True)
    chunks = [HEADER_IMPORTS]
    for rel in ORDERED_FILES:
        full = os.path.join(SRC, rel)
        with open(full, "r", encoding="utf-8") as f:
            chunks.append(strip_module_syntax(f.read(), rel))

    with open(os.path.join(DIST, "bundle.jsx"), "w", encoding="utf-8") as f:
        f.write("\n".join(chunks))

    with open(os.path.join(SRC, "index.css"), "r", encoding="utf-8") as f:
        css_content = f.read()

    index_html = f"""<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AetherRoom — Smart Classroom Teacher Portal</title>
    <script type="importmap">
      {{
        "imports": {{
          "react": "https://esm.sh/react@18.3.1",
          "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
          "react-dom": "https://esm.sh/react-dom@18.3.1?deps=react@18.3.1",
          "react-dom/client": "https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1",
          "react-router-dom": "https://esm.sh/react-router-dom@6.28.0?deps=react@18.3.1,react-dom@18.3.1",
          "framer-motion": "https://esm.sh/framer-motion@11.11.17?deps=react@18.3.1,react-dom@18.3.1",
          "lucide-react": "https://esm.sh/lucide-react@0.460.0?deps=react@18.3.1",
          "recharts": "https://esm.sh/recharts@2.13.3?deps=react@18.3.1,react-dom@18.3.1",
          "three": "https://esm.sh/three@0.169.0",
          "cannon-es": "https://esm.sh/cannon-es@0.20.0",
          "lenis": "https://esm.sh/lenis@1.1.16",
          "gsap": "https://esm.sh/gsap@3.12.5",
          "gsap/ScrollTrigger": "https://esm.sh/gsap@3.12.5/ScrollTrigger",
          "@react-three/fiber": "https://esm.sh/@react-three/fiber@8.17.10?deps=react@18.3.1,react-dom@18.3.1,three@0.169.0"
        }}
      }}
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap"
      rel="stylesheet"
    />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {{
        darkMode: 'class',
        theme: {{
          extend: {{
            fontFamily: {{
              display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
              sans: ['"SF Pro Text"', '"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
              mono: ['"SF Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
            }},
            colors: {{
              navy: {{ 950: '#000000', 900: '#1c1c1e', 800: '#2c2c2e', 700: '#3a3a3c' }},
              electric: {{ 400: '#2997ff', 500: '#0071e3', 600: '#0071e3' }},
              tealaccent: {{ 400: '#2997ff', 500: '#0071e3' }},
            }},
            borderRadius: {{
              '3xl': '1.5rem',
            }},
            boxShadow: {{
              apple: '0 4px 24px -2px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
              'apple-dark': '0 12px 40px -8px rgba(0, 0, 0, 0.65)',
              'apple-hover': '0 16px 40px -10px rgba(0, 0, 0, 0.14)',
            }},
          }},
        }},
      }};
    </script>
    <style type="text/tailwindcss">
{css_content}
    </style>
  </head>
  <body class="antialiased selection:bg-[#0071e3]/20 dark:selection:bg-[#2997ff]/30">
    <div id="root"></div>
    <script src="https://unpkg.com/@babel/standalone@7.26.2/babel.min.js"></script>
    <script type="text/babel" data-type="module" data-presets="react" src="/bundle.jsx"></script>
  </body>
</html>
"""
    with open(os.path.join(DIST, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_html)
    print("Rebuilt Apple + Lusion dist/index.html and dist/bundle.jsx successfully.")

if __name__ == "__main__":
    main()
