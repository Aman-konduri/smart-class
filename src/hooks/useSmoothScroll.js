import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_TUNING, scrollTelemetry } from '../utils/motionConfig';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scrolling and keeps it locked in sync with GSAP ScrollTrigger.
 * Automatically disables itself if the user prefers reduced motion.
 */
export function useSmoothScroll(disabled = false) {
  useEffect(() => {
    const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (disabled || mediaReduce) {
      scrollTelemetry.velocity = 0;
      return;
    }

    const lenis = new Lenis({
      lerp: MOTION_TUNING.LENIS_LERP,
      smoothWheel: true,
      syncTouch: false,
    });

    // Update GSAP ScrollTrigger and shared scroll telemetry on every Lenis scroll frame
    lenis.on('scroll', (e) => {
      scrollTelemetry.velocity = e.velocity || 0;
      scrollTelemetry.progress = e.progress || 0;
      ScrollTrigger.update();
    });

    // Drive Lenis from GSAP's unified requestAnimationFrame ticker
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, [disabled]);
}
