import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Zap,
  Megaphone,
  Sliders,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  LogOut,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useClassroom } from '../hooks/useClassroom';
import { APPLE_SPRING } from '../utils/motionConfig';
import Magnetic from './Magnetic';

const NAV_ITEMS = [
  { to: '/', label: 'Home', shortLabel: 'Home', icon: LayoutDashboard, end: true },
  { to: '/attendance', label: 'Attendance', shortLabel: 'Attend', icon: Users },
  { to: '/energy', label: 'Energy', shortLabel: 'Energy', icon: Zap },
  { to: '/notices', label: 'Notices', shortLabel: 'Notices', icon: Megaphone },
  { to: '/control', label: 'Control', shortLabel: 'Control', icon: Sliders },
  { to: '/settings', label: 'Settings', shortLabel: 'Settings', icon: Settings },
];

/**
 * Main Dashboard Shell — Apple Calm Design + Sticky Frosted-Glass Navbar
 * Smooth fade + slight slide spring route transitions, single blue accent, generous spacing.
 */
export default function Layout() {
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
    <div className="relative flex min-h-[100dvh] bg-[var(--bg)] text-[var(--text)]">
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
        <header className="apple-frosted-nav sticky top-0 z-30 flex min-h-[3.5rem] items-center justify-between gap-2 px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:h-16 sm:gap-3 sm:px-8 sm:py-0">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-[var(--border)] p-2 text-[var(--text)] md:inline-flex lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <label htmlFor="classroom-select" className="sr-only">
                Select Classroom
              </label>
              <select
                id="classroom-select"
                value={selectedRoomId}
                onChange={(e) => selectClassroom(e.target.value)}
                className="min-h-[44px] max-w-[175px] truncate rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-base font-medium text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] md:min-h-0 md:max-w-none md:px-4 md:text-sm"
              >
                {classrooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text)] transition active:scale-95 hover:border-[var(--accent)] md:min-h-0 md:min-w-0"
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
                  className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--text)] transition active:scale-95 hover:border-[var(--accent)] md:min-h-0 md:min-w-0"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-semibold text-white md:-right-0.5 md:-top-0.5">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </Magnetic>

              {notifOpen && (
                <div className="glass-card fixed inset-x-4 top-[calc(4.25rem+env(safe-area-inset-top))] z-50 p-4 shadow-2xl md:absolute md:inset-x-auto md:right-0 md:top-auto md:mt-2 md:w-80">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="font-display text-sm font-semibold">Notifications</span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="min-h-[44px] px-2 text-xs font-medium text-[var(--accent)] hover:underline md:min-h-0 md:px-0"
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

            <div className="hidden items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--card)] py-1 pl-1.5 pr-3 md:flex">
              <div
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-white"
              >
                {teacher?.avatarInitials || 'TC'}
              </div>
              <div className="text-left">
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
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border border-[#ff453a]/25 bg-[#ff453a]/10 px-3 py-1.5 text-xs font-medium text-[#ff453a] transition active:scale-95 hover:bg-[#ff453a]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff453a] md:min-h-0 md:min-w-0 md:px-3.5"
              >
                <LogOut className="h-4 w-4 md:h-3.5 md:w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </Magnetic>
          </div>
        </header>

        {/* Smooth Apple Spring Route Transition (Fade + Slight Slide) */}
        <main className="relative flex-1 px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-8 md:py-8 md:pb-8 lg:px-10">
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

        {/* Mobile Bottom Tab Bar (<= 767px) with iPhone Notch/Home-Bar Safe Area */}
        <nav
          aria-label="Mobile bottom navigation"
          className="apple-frosted-nav fixed inset-x-0 bottom-0 z-40 border-b-0 border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <div className="grid grid-cols-6 items-center px-1 py-1">
            {NAV_ITEMS.map(({ to, shortLabel, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-[48px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition-colors ${
                    isActive
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="truncate">{shortLabel}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
