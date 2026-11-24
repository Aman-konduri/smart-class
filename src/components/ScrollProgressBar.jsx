import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Minimal single-accent Apple Blue scroll progress bar pinned to the top edge.
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setProgress(pct);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2.5px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-[var(--accent)]"
        style={{
          transform: `scaleX(${progress})`,
          transition: reducedMotion ? 'none' : 'transform 80ms linear',
        }}
      />
    </div>
  );
}
