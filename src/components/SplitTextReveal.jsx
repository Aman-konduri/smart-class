import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Splits a heading string into words and slides each word up from a clipped mask
 * when it scrolls into view. Preserves full screen-reader accessibility via aria-label.
 */
export default function SplitTextReveal({
  text,
  as: Tag = 'h2',
  className = '',
  highlightWord = '',
}) {
  const reducedMotion = useReducedMotion();
  const words = String(text).split(' ');

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag aria-label={text} className={className}>
      {words.map((word, idx) => {
        const isHighlighted =
          highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
        return (
          <span
            key={`${word}-${idx}`}
            aria-hidden="true"
            className="mr-[0.26em] inline-block overflow-hidden align-bottom pb-0.5"
          >
            <motion.span
              initial={{ y: '110%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.52,
                delay: idx * 0.045,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`inline-block ${
                isHighlighted
                  ? 'bg-gradient-to-r from-electric-400 to-tealaccent-400 bg-clip-text text-transparent'
                  : ''
              }`}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
