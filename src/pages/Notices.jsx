import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pin, Pencil, Trash2, Calendar } from 'lucide-react';
import { useClassroom } from '../hooks/useClassroom';
import Modal from '../components/Modal';
import Magnetic from '../components/Magnetic';
import { EmptyState } from '../components/FeedbackStates';

const EMPTY_FORM = {
  id: null,
  title: '',
  message: '',
  priority: 'Medium',
  date: new Date().toISOString().slice(0, 10),
  pinned: false,
};

/**
 * Notices Page (Staggered card fade-in + Magnetic New Notice action)
 */
export default function Notices() {
  const { notices, saveNotice, deleteNotice, togglePinNotice } = useClassroom();

  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const sortedNotices = useMemo(() => {
    return notices
      .filter((n) => priorityFilter === 'ALL' || n.priority === priorityFilter)
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.date.localeCompare(a.date);
      });
  }, [notices, priorityFilter]);

  const openCreateModal = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (notice) => {
    setForm({ ...notice });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setFormError('Both title and announcement message are required.');
      return;
    }
    saveNotice(form);
    setModalOpen(false);
  };

  const priorityBadge = {
    High: 'bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-300',
    Medium: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-300',
    Low: 'bg-sky-500/15 text-sky-600 border-sky-500/30 dark:text-sky-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Classroom Notices
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Broadcast schedules, lab advisories, and smart-board announcements
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <label htmlFor="priority-filter" className="sr-only">
            Filter by priority
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field min-h-[44px] w-full py-2 sm:w-auto md:min-h-0"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <Magnetic>
            <button
              type="button"
              onClick={openCreateModal}
              className="btn-primary min-h-[44px] w-full shrink-0 sm:w-auto md:min-h-0"
            >
              <Plus className="h-4 w-4" />
              New Notice
            </button>
          </Magnetic>
        </div>
      </div>

      {sortedNotices.length === 0 ? (
        <EmptyState
          title="No announcements yet"
          description="Create your first classroom announcement or clear the priority filter."
          action={
            <button type="button" onClick={openCreateModal} className="btn-primary">
              <Plus className="h-4 w-4" />
              Create Notice
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sortedNotices.map((notice, idx) => (
            <motion.article
              key={notice.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className={`glass-card flex flex-col justify-between p-5 transition ${
                notice.pinned ? 'border-sky-500/40 dark:border-tealaccent-400/40 shadow-glow' : ''
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        priorityBadge[notice.priority]
                      }`}
                    >
                      {notice.priority}
                    </span>
                    {notice.pinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-600 dark:text-tealaccent-400">
                        <Pin className="h-3 w-3" />
                        Pinned
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {notice.date}
                  </span>
                </div>

                <h2 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">
                  {notice.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {notice.message}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200/70 pt-3 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => togglePinNotice(notice.id)}
                  aria-label={notice.pinned ? 'Unpin notice' : 'Pin notice'}
                  className="btn-secondary min-h-[44px] px-3.5 py-1.5 text-xs md:min-h-0 md:px-3"
                >
                  <Pin className="h-3.5 w-3.5" />
                  {notice.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(notice)}
                  aria-label={`Edit ${notice.title}`}
                  className="btn-secondary min-h-[44px] px-3.5 py-1.5 text-xs md:min-h-0 md:px-3"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteNotice(notice.id)}
                  aria-label={`Delete ${notice.title}`}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 dark:text-rose-300 md:min-h-0 md:px-3"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={form.id ? 'Edit Announcement' : 'Create New Announcement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <p role="alert" className="rounded-xl bg-rose-500/15 p-3 text-xs font-medium text-rose-400">
              {formError}
            </p>
          )}

          <div>
            <label htmlFor="notice-title" className="mb-1 block text-xs font-semibold">
              Announcement Title
            </label>
            <input
              id="notice-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Lab Submission Deadline Extended"
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="notice-priority" className="mb-1 block text-xs font-semibold">
                Priority
              </label>
              <select
                id="notice-priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="input-field"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label htmlFor="notice-date" className="mb-1 block text-xs font-semibold">
                Date
              </label>
              <input
                id="notice-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notice-message" className="mb-1 block text-xs font-semibold">
              Message Details
            </label>
            <textarea
              id="notice-message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write clear instructions for faculty or classroom smart-board display..."
              className="input-field resize-none"
              required
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="h-4 w-4 rounded accent-sky-500"
            />
            Pin this announcement to the top of the board
          </label>

          <div className="flex justify-end gap-2.5 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {form.id ? 'Update Notice' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
