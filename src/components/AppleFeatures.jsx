import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppleImage from './AppleImage';
import { APPLE_SPRING } from '../utils/motionConfig';

const EDITORIAL_FEATURES = [
  {
    eyebrow: 'Millimeter-Wave Sensing',
    title: 'Presence, measured without cameras.',
    description:
      'A single ceiling-mounted 60GHz radar and air-quality pod tracks room occupancy, CO2, and PM2.5 in real time—respecting student privacy while keeping classrooms fresh and comfortable.',
    image: '/images/feature-occupancy-sensor.png',
    fallback:
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    alt: 'Minimalist matte-white and brushed-aluminum ceiling occupancy and air-quality sensor pod',
    ctaLabel: 'Explore Live Telemetry',
    ctaTo: '/settings',
  },
  {
    eyebrow: 'Daylight-Adaptive Lighting',
    title: 'Brilliant light. Effortless efficiency.',
    description:
      'Ambient lux photodiodes balance natural window sunlight with overhead LED zones automatically—cutting idle lecture-hall electricity waste by up to 24% every week.',
    image: '/images/feature-smart-lighting.png',
    fallback:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85',
    alt: 'Modern minimalist engineering college smart lecture hall with linear daylight-adaptive LED lighting',
    ctaLabel: 'Inspect Energy Analytics',
    ctaTo: '/energy',
  },
  {
    eyebrow: 'Instant RFID Check-In',
    title: 'Attendance taken in a fraction of a second.',
    description:
      'Dual-antenna doorway terminals verify student badges as they walk in, automatically logging arrival timestamps, flagging late entries, and preparing one-click CSV sheets for faculty.',
    image: '/images/feature-rfid-hub.png',
    fallback:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
    alt: 'Anodized space-black glass RFID smart classroom attendance reader with a glowing blue confirmation ring',
    ctaLabel: 'Open Attendance Log',
    ctaTo: '/attendance',
  },
];

/**
 * Apple.com-style alternating Image + Text editorial feature blocks.
 * Uses generous whitespace, 24px rounded parallax imagery, and calm spring reveals.
 */
export default function AppleFeatures() {
  return (
    <section aria-label="Smart Classroom Product Features" className="space-y-20 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Engineered for Faculty
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-[var(--text)] sm:text-5xl">
          Every sensor works in quiet harmony.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
          Designed to fade into the background of your lecture while giving you complete visibility and instant control.
        </p>
      </div>

      <div className="space-y-20">
        {EDITORIAL_FEATURES.map((item, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <div
              key={item.title}
              className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
            >
              <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : ''}`}>
                <AppleImage
                  src={item.image}
                  fallbackSrc={item.fallback}
                  alt={item.alt}
                  className="aspect-[4/3] w-full"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...APPLE_SPRING, delay: 0.08 }}
                className={`space-y-4 lg:col-span-5 ${isReversed ? 'lg:order-1' : ''}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  {item.eyebrow}
                </p>
                <h3 className="font-display text-2xl font-bold leading-tight tracking-[-0.025em] text-[var(--text)] sm:text-4xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  {item.description}
                </p>
                <div className="pt-2">
                  <Link
                    to={item.ctaTo}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    {item.ctaLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
