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
    <div className="glass-card overflow-hidden">
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
  );
}
