import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { APPLE_SPRING, MOTION_TUNING } from '../utils/motionConfig';

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
export default function StatCard({
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
