import React, { useMemo, useState } from 'react';
import {
  Search,
  Download,
  Users,
  UserCheck,
  Clock,
  UserX,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { ATTENDANCE_RECORDS } from '../data/mockData';
import { exportRowsToCsv } from '../utils/exportCsv';
import { useClassroom } from '../hooks/useClassroom';
import StatCard from '../components/StatCard';
import ChartCard, { CustomChartTooltip } from '../components/ChartCard';
import DataTable from '../components/DataTable';
import Magnetic from '../components/Magnetic';

/**
 * Attendance Page (Light-touch motion for fast table readability)
 */
export default function Attendance() {
  const { addToast } = useClassroom();

  const [query, setQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-11-24');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortKey, setSortKey] = useState('rollNo');
  const [sortDir, setSortDir] = useState('asc');

  const subjects = useMemo(
    () => ['ALL', ...new Set(ATTENDANCE_RECORDS.map((r) => r.subject))],
    []
  );

  const filteredRows = useMemo(() => {
    // TODO: Replace client-side filtering with GET /api/v1/attendance?date=...&subject=...
    return ATTENDANCE_RECORDS.filter((row) => {
      const matchesSearch =
        row.name.toLowerCase().includes(query.toLowerCase()) ||
        row.rollNo.toLowerCase().includes(query.toLowerCase());
      const matchesDate = !selectedDate || row.date === selectedDate;
      const matchesSubject = selectedSubject === 'ALL' || row.subject === selectedSubject;
      const matchesStatus = selectedStatus === 'ALL' || row.status === selectedStatus;
      return matchesSearch && matchesDate && matchesSubject && matchesStatus;
    }).sort((a, b) => {
      const valA = String(a[sortKey] ?? '');
      const valB = String(b[sortKey] ?? '');
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }, [query, selectedDate, selectedSubject, selectedStatus, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedDate('');
    setSelectedSubject('ALL');
    setSelectedStatus('ALL');
  };

  const presentCount = filteredRows.filter((r) => r.status === 'Present').length;
  const lateCount = filteredRows.filter((r) => r.status === 'Late').length;
  const absentCount = filteredRows.filter((r) => r.status === 'Absent').length;
  const total = filteredRows.length || 1;

  const pieData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Late', value: lateCount, color: '#f59e0b' },
    { name: 'Absent', value: absentCount, color: '#ef4444' },
  ];

  const statusStyles = {
    Present: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-300',
    Late: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-300',
    Absent: 'bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-300',
  };

  const columns = [
    {
      key: 'rollNo',
      label: 'Roll No',
      sortable: true,
      render: (r) => <span className="font-mono font-semibold">{r.rollNo}</span>,
    },
    {
      key: 'name',
      label: 'Student Name',
      sortable: true,
      render: (r) => <span className="font-semibold text-slate-900 dark:text-white">{r.name}</span>,
    },
    { key: 'subject', label: 'Subject / Class', sortable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (r) => (
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            statusStyles[r.status]
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: 'timeIn',
      label: 'Time In',
      sortable: true,
      render: (r) => <span className="font-mono text-xs">{r.timeIn}</span>,
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (r) => <span className="font-mono text-xs">{r.date}</span>,
    },
  ];

  const handleExport = () => {
    exportRowsToCsv(`attendance-${selectedDate || 'all'}.csv`, filteredRows);
    addToast(`Exported ${filteredRows.length} attendance rows to CSV`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Classroom Attendance
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            RFID badge check-ins, subject filters, and instant CSV sheet export
          </p>
        </div>

        <Magnetic>
          <button
            type="button"
            onClick={handleExport}
            disabled={filteredRows.length === 0}
            className="btn-primary"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </Magnetic>
      </div>

      {/* Light-touch Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          enableTilt={false}
          title="Filtered Records"
          value={filteredRows.length}
          icon={Users}
          accent="sky"
          subtitle="Total students in current view"
        />
        <StatCard
          enableTilt={false}
          title="Present"
          value={presentCount}
          icon={UserCheck}
          accent="emerald"
          subtitle={`${Math.round((presentCount / total) * 100)}% of filtered list`}
        />
        <StatCard
          enableTilt={false}
          title="Late Arrivals"
          value={lateCount}
          icon={Clock}
          accent="amber"
          subtitle={`${Math.round((lateCount / total) * 100)}% arrived after grace window`}
        />
        <StatCard
          enableTilt={false}
          title="Absent"
          value={absentCount}
          icon={UserX}
          accent="rose"
          subtitle={`${Math.round((absentCount / total) * 100)}% unrecorded`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="glass-card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <label htmlFor="att-search" className="mb-1 block text-xs font-medium text-slate-500">
                Search Student / Roll
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="att-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Aarav or 24CS001"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label htmlFor="att-date" className="mb-1 block text-xs font-medium text-slate-500">
                Lecture Date
              </label>
              <input
                id="att-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="att-subject" className="mb-1 block text-xs font-medium text-slate-500">
                Subject / Class
              </label>
              <select
                id="att-subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input-field"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub === 'ALL' ? 'All Subjects' : sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="att-status" className="text-xs font-medium text-slate-500">
                  Status
                </label>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-500 hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
              <select
                id="att-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                <option value="ALL">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          <DataTable
            columns={columns}
            rows={filteredRows}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            emptyTitle="No attendance records found"
            emptyDescription="No students match the selected date, subject, or search query."
          />
        </div>

        <div className="lg:col-span-4">
          <ChartCard
            title="Attendance Breakdown"
            subtitle="Percentage split for current filter"
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={4}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip unit=" students" />} />
                  <Legend verticalAlign="bottom" height={32} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
