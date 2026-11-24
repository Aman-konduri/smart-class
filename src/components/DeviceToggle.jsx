import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Lightbulb, Fan } from 'lucide-react';
import { APPLE_SPRING } from '../utils/motionConfig';

/**
 * Calm Apple-Style IoT Device Toggle Card
 * Uses iOS green (#30d158) active switches, single blue accent sliders,
 * spring physics thumb motion, glowing bulb icon, and speed-matched fan rotation.
 */
export default function DeviceToggle({
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

        {/* Apple iOS-Style Spring Switch (44x44px minimum touch hit area on mobile) */}
        <button
          type="button"
          role="switch"
          aria-checked={device.isOn}
          aria-label={`Toggle ${device.name}`}
          onClick={() => onToggle(device.id)}
          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 active:scale-95 after:absolute after:-inset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:h-7 md:w-12 md:after:hidden ${
            device.isOn ? 'bg-[#30d158]' : 'bg-[var(--surface-subtle)]'
          }`}
        >
          <motion.span
            layout
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className={`pointer-events-none block h-7 w-7 rounded-full bg-white shadow-sm md:h-6 md:w-6 ${
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
