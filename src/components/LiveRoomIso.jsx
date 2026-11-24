import React from 'react';
import { Lightbulb, Fan, Sparkles } from 'lucide-react';
import { useClassroom } from '../hooks/useClassroom';

/**
 * Live Isometric 3D-Perspective Classroom Twin
 * Reflects the real-time ON/OFF state and fan speeds from the Control page.
 * Teachers can also click any fixture directly inside the room to switch it live!
 */
export default function LiveRoomIso() {
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
