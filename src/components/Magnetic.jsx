import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MOTION_TUNING } from '../utils/motionConfig';

/**
 * Magnetic Wrapper Component
 * Gently pulls child buttons or sidebar icons toward the mouse cursor
 * whenever the pointer comes within ~60px of the element's center.
 * Disabled automatically on touch devices.
 */
export default function Magnetic({
  children,
  strength = MOTION_TUNING.MAGNETIC_STRENGTH,
  radius = MOTION_TUNING.MAGNETIC_RADIUS_PX,
  className = 'inline-block',
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
    );
  }, []);

  if (isTouch || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.hypot(dx, dy);

    if (distance < radius + Math.max(rect.width, rect.height) / 2) {
      setOffset({ x: dx * strength, y: dy * strength });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 18, mass: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
