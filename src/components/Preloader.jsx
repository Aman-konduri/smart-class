import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { MOTION_TUNING } from '../utils/motionConfig';

/**
 * Minimal Apple-inspired Preloader (Pure #000000 stage + single #2997ff accent)
 * Counts 0–100% smoothly then reveals the app with a fluid circular iris.
 */
export default function Preloader({ onFinish }) {
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reducedMotion) {
      setCount(100);
      setVisible(false);
      onFinish?.();
      return;
    }

    const duration = MOTION_TUNING.PRELOADER_DURATION_MS;
    const start = performance.now();
    let rafId;

    const tick = (now) => {
      const elapsed = now - start;
      const raw = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - raw, 3);
      setCount(Math.round(eased * 100));

      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          onFinish?.();
        }, 160);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion, onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{
            clipPath: 'circle(0% at 50% 50%)',
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-live="polite"
          aria-label={`Loading Smart Classroom Portal ${count}%`}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-[#f5f5f7]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1c1c1e] border border-white/10 text-[#2997ff]">
            <Cpu className="h-8 w-8" />
          </div>

          <p className="mt-5 font-display text-xs font-medium uppercase tracking-[0.26em] text-[#a1a1a6]">
            AetherRoom
          </p>

          <div className="mt-4 flex w-56 flex-col items-center">
            <span className="font-display text-4xl font-semibold tracking-tight tabular-nums">
              {count}%
            </span>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#2997ff] transition-all duration-75"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
