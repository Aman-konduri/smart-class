import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'framer-motion';
import { Radar, SunMedium, Fingerprint, ShieldAlert } from 'lucide-react';
import SplitTextReveal from './SplitTextReveal';

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
export default function HorizontalFeatures() {
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
