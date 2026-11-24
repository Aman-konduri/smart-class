import React from 'react';
import { motion } from 'framer-motion';
import { APPLE_SPRING } from '../utils/motionConfig';

/**
 * Calm Apple-style frosted tooltip for Recharts graphs.
 */
export function CustomChartTooltip({ active, payload, label, unit = '' }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.14 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 px-4 py-3 text-sm shadow-xl backdrop-blur-md md:px-3.5 md:py-2.5 md:text-xs"
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
export default function ChartCard({ title, subtitle, action, children }) {
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
