/**
 * Central Motion & Apple Design Tuning Config
 * -------------------------------------------
 * Uses Apple-style fluid springs (stiffness ~120, damping ~20) and a single blue accent.
 */
export const APPLE_SPRING = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 0.85,
};

export const MOTION_TUNING = {
  // 1. Single Apple Accent + Status Colours
  COLORS: {
    primaryBlue: '#0071e3',
    darkAccentBlue: '#2997ff',
    warmBulb: '#ff9f0a',
    thermoCoral: '#ff453a',
    statusGreen: '#30d158',
  },

  // 2. Preloader Timing
  PRELOADER_DURATION_MS: 1200,

  // 3. Smooth Scroll (Lenis)
  LENIS_LERP: 0.09,

  // 4. Custom Cursor & Magnetic Pull
  CURSOR_RING_LERP: 0.18,
  MAGNETIC_RADIUS_PX: 60,
  MAGNETIC_STRENGTH: 0.24,

  // 5. StatCard Subtle Hover Lift & Count-Up
  CARD_MAX_TILT_DEG: 5,
  COUNT_UP_DURATION_MS: 850,

  // 6. WebGL 3D Scene & Physics (Login + Home Hero Only)
  MAX_DPR: 2,
  PARTICLE_COUNT_DESKTOP: 180,
  PARTICLE_COUNT_MOBILE: 60,
  PHYSICS_REPULSION_FORCE: 7.0,
  PHYSICS_SPRING_RETURN: 3.0,
  BLOOM_HALO_OPACITY: 0.18,
};

export const scrollTelemetry = {
  velocity: 0,
  progress: 0,
};
