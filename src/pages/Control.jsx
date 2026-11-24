import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Power, Lightbulb, Fan } from 'lucide-react';
import { useClassroom } from '../hooks/useClassroom';
import DeviceToggle from '../components/DeviceToggle';
import Magnetic from '../components/Magnetic';

/**
 * Classroom Hardware Control Page — Calm Apple Aesthetics + Spring Switches
 */
export default function Control() {
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
