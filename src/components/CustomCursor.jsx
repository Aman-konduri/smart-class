import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { MOTION_TUNING } from '../utils/motionConfig';

/**
 * Refined Apple-Blue Custom Cursor (Dot + Trailing Ring)
 * Hidden automatically on touch devices and under prefers-reduced-motion.
 */
export default function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');

  useEffect(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarsePointer || reducedMotion) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let rafId;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }

      const target = e.target;
      if (target && target.closest) {
        const labeledEl = target.closest('[data-cursor]');
        const interactiveEl = target.closest(
          'a, button, select, input, textarea, [role="switch"], [role="button"]'
        );
        setCursorLabel(labeledEl ? labeledEl.getAttribute('data-cursor') || '' : '');
        setHovered(Boolean(labeledEl || interactiveEl));
      }
    };

    const animateRing = () => {
      ring.x += (mouse.x - ring.x) * MOTION_TUNING.CURSOR_RING_LERP;
      ring.y += (mouse.y - ring.y) * MOTION_TUNING.CURSOR_RING_LERP;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  const hasLabel = Boolean(cursorLabel);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[var(--accent)]"
      />

      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-200 ${
            hasLabel
              ? 'h-14 w-14 border-[var(--accent)] bg-[var(--card)]/90 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] shadow-lg backdrop-blur-md'
              : hovered
              ? 'h-10 w-10 border-[var(--accent)] bg-[var(--accent-soft)]'
              : 'h-7 w-7 border-[var(--accent)]/45 bg-transparent'
          }`}
        >
          {hasLabel && <span>{cursorLabel}</span>}
        </div>
      </div>
    </div>
  );
}
