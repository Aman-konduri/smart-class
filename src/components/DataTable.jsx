import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { EmptyState } from './FeedbackStates';

/**
 * Reusable accessible DataTable with sortable column headers and
 * light staggered fade-in on table rows so numbers stay fast & readable.
 */
export default function DataTable({
  columns,
  rows,
  sortKey,
  sortDir,
  onSort,
  emptyTitle = 'No matching records',
  emptyDescription = 'Try adjusting your search query or filter criteria.',
}) {
  if (!rows || rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <>
      {/* Mobile Stacked Student Cards (<= 767px, zero horizontal scroll) */}
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={row.id} className="glass-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {columns.slice(0, 2).map((col) => (
                  <div key={col.key} className="truncate">
                    {col.render ? col.render(row) : row[col.key]}
                  </div>
                ))}
              </div>
              {columns[3] && (
                <div className="shrink-0">
                  {columns[3].render ? columns[3].render(row) : row[columns[3].key]}
                </div>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-3 text-sm">
              {columns.slice(2).map((col, idx) => {
                if (idx === 1) return null; // status already shown top-right
                return (
                  <div key={col.key}>
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
                      {col.label}
                    </span>
                    <div className="mt-0.5 text-[var(--text)]">
                      {col.render ? col.render(row) : row[col.key]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop & Tablet Data Table (768px+ unchanged) */}
      <div className="glass-card hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/80 dark:border-slate-800 dark:bg-navy-950/60">
                {columns.map((col) => {
                  const isSorted = sortKey === col.key;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={
                        isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                      }
                      className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          onClick={() => onSort(col.key)}
                          className="inline-flex items-center gap-1.5 rounded hover:text-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                        >
                          <span>{col.label}</span>
                          {isSorted ? (
                            sortDir === 'asc' ? (
                              <ArrowUp className="h-3.5 w-3.5 text-sky-500" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-sky-500" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              {rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.025, 0.25) }}
                  className="transition-colors hover:bg-sky-500/[0.04] dark:hover:bg-sky-400/[0.05]"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="whitespace-nowrap px-4 py-3.5 text-slate-700 dark:text-slate-200"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
