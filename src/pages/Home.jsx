import React, { Suspense, lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Lightbulb,
  Fan,
  Thermometer,
  Zap,
  PieChart as PieIcon,
  Wind,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useClassroom } from '../hooks/useClassroom';
import { getAqiMeta } from '../utils/exportCsv';
import { APPLE_SPRING } from '../utils/motionConfig';
import StatCard from '../components/StatCard';
import ChartCard, { CustomChartTooltip } from '../components/ChartCard';
import Magnetic from '../components/Magnetic';
import AppleImage from '../components/AppleImage';
import AppleFeatures from '../components/AppleFeatures';
import LiveRoomIso from '../components/LiveRoomIso';
import HorizontalFeatures from '../components/HorizontalFeatures';
import { SkeletonGrid, ErrorState } from '../components/FeedbackStates';

const Scene3D = lazy(() => import('../components/Scene3D'));

/**
 * Home — Apple Product-Page Hero + Lusion Interactive 3D + Calm Telemetry Dashboard
 */
export default function Home() {
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
    <div className="space-y-10 md:space-y-16">
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
              <Link to="/control" className="btn-primary min-h-[44px] md:min-h-0">
                Open Room Controls
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/attendance" className="btn-secondary min-h-[44px] md:min-h-0">
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
                  className={`min-h-[44px] rounded-full px-4 py-1 text-xs font-medium transition md:min-h-0 md:px-3.5 ${
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
                  className={`min-h-[44px] rounded-full px-4 py-1 text-xs font-medium transition md:min-h-0 md:px-3.5 ${
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
          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
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
            <div className="h-52 w-full md:h-64">
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
