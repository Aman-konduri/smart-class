import React from 'react';
import { Inbox, AlertOctagon, RefreshCw } from 'lucide-react';

/**
 * Loading Skeleton Grid shown while classroom sensor telemetry is syncing.
 */
export function SkeletonGrid({ count = 8 }) {
  return (
    <div
      role="status"
      aria-label="Loading classroom data"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card animate-pulse p-5">
          <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 h-8 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 h-2.5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

/**
 * Empty State card when a list or table has zero matching items.
 */
export function EmptyState({ title, description, action }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/25 bg-sky-500/10 text-sky-500 dark:text-tealaccent-400">
        <Inbox className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/**
 * Error State card with retry button if a sensor gateway or API call fails.
 */
export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="glass-card border-rose-500/30 bg-rose-500/5 p-6 text-center"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
        <AlertOctagon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-3 font-display text-base font-bold text-slate-900 dark:text-white">
        Telemetry Connection Interrupted
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {message || 'Unable to reach classroom IoT gateway. Please retry.'}
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-primary mt-4">
          <RefreshCw className="h-4 w-4" />
          Reconnect Gateway
        </button>
      )}
    </div>
  );
}
