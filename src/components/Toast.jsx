import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useClassroom } from '../hooks/useClassroom';
import { APPLE_SPRING } from '../utils/motionConfig';

/**
 * Calm Apple-Style Floating Toast Stack with Spring Entrance.
 */
export default function ToastContainer() {
  const { toasts, dismissToast } = useClassroom();

  const iconByVariant = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0 text-[#30d158]" />,
    info: <Info className="h-4 w-4 shrink-0 text-[var(--accent)]" />,
    error: <AlertTriangle className="h-4 w-4 shrink-0 text-[#ff453a]" />,
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-5 right-5 z-[80] flex flex-col gap-2.5"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94, transition: { duration: 0.16 } }}
            transition={APPLE_SPRING}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 px-4 py-3 text-sm font-medium text-[var(--text)] shadow-2xl backdrop-blur-xl"
          >
            {iconByVariant[toast.variant] || iconByVariant.success}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="ml-2 rounded-full p-1 text-[var(--muted)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
