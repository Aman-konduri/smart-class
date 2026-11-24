import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { APPLE_SPRING } from '../utils/motionConfig';

/**
 * Apple-Style Product Image Card
 * - Rounded 24px corners (`rounded-3xl`)
 * - Native lazy loading (`loading="lazy"`) with smooth blur-up reveal
 * - Subtle scroll parallax (disabled when prefers-reduced-motion is active)
 * - Descriptive alt text and automatic fallback URL
 */
export default function AppleImage({
  src,
  fallbackSrc,
  alt,
  className = 'aspect-[4/3] w-full',
  parallax = true,
  priority = false,
}) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    parallax && !reducedMotion ? [-18, 18] : [0, 0]
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={APPLE_SPRING}
      className={`relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-subtle)] shadow-apple dark:shadow-apple-dark ${className}`}
    >
      {/* Blur-up shimmer placeholder while image loads */}
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-black/5 via-black/10 to-black/5 dark:from-white/5 dark:via-white/10 dark:to-white/5"
        />
      )}

      <motion.img
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ y }}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          } else {
            setLoaded(true);
          }
        }}
        className={`h-[112%] w-full -mt-[6%] object-cover transition-all duration-700 ${
          loaded ? 'scale-100 blur-0 opacity-100' : 'scale-105 blur-xl opacity-0'
        }`}
      />
    </motion.div>
  );
}
