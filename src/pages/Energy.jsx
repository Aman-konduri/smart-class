import React, { useState } from 'react';
import { Zap, IndianRupee, TrendingDown } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ENERGY_DATASETS } from '../data/mockData';
import { useClassroom } from '../hooks/useClassroom';
import StatCard from '../components/StatCard';
import ChartCard, { CustomChartTooltip } from '../components/ChartCard';

const PERIODS = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

/**
 * Energy Analytics Page (Light-touch motion + smooth animated tooltips)
 */
export default function Energy() {
  const { theme } = useClassroom();
  const [period, setPeriod] = useState('day');

  // TODO: Fetch from GET /api/v1/energy?range=${period}
  const activeData = ENERGY_DATASETS[period];
  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.15)';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Energy Consumption
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Smart sub-meter monitoring across lighting, HVAC fans, and AV equipment
          </p>
        </div>

        <div
          role="group"
          aria-label="Select energy reporting period"
          className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-navy-900"
        >
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              aria-pressed={period === p.id}
              className={`min-h-[44px] rounded-lg px-4 py-1.5 text-xs font-semibold transition md:min-h-0 ${
                period === p.id
                  ? 'bg-gradient-to-r from-electric-600 to-tealaccent-500 text-white shadow'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <StatCard
          enableTilt={false}
          title={`Total Usage (${period.toUpperCase()})`}
          value={`${activeData.summary.totalKwh} kWh`}
          icon={Zap}
          accent="sky"
          subtitle="Measured via classroom smart CT clamp"
        />
        <StatCard
          enableTilt={false}
          title="Estimated Cost"
          value={`₹${activeData.summary.estimatedCost.toFixed(2)}`}
          icon={IndianRupee}
          accent="teal"
          subtitle="Calculated at institutional tariff ₹8.50/kWh"
        />
        <div className="col-span-2 md:col-span-1">
          <StatCard
            enableTilt={false}
            title="Savings vs Prior Period"
            value={`-${activeData.summary.savingsPercent}%`}
            icon={TrendingDown}
            accent="emerald"
            badge={{
              label: 'Eco Gain',
              className:
                'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-300',
            }}
            subtitle="Saved via Smart Occupancy Auto-Off"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ChartCard
            title="Hourly Load Curve (kWh)"
            subtitle="Peak lecture hours vs afternoon taper"
          >
            <div className="h-52 w-full md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeData.hourly} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <Tooltip content={<CustomChartTooltip unit=" kWh" />} />
                  <Line
                    type="monotone"
                    dataKey="kwh"
                    name="Usage"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2dd4bf' }}
                    activeDot={{ r: 6 }}
                    animationDuration={650}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="lg:col-span-5">
          <ChartCard
            title="Load Split by Category"
            subtitle="Lights vs Ceiling Fans vs Others (%)"
          >
            <div className="h-56 w-full md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeData.breakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="46%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {activeData.breakdown.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip unit="%" />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      <ChartCard
        title="Smart Eco Usage vs Manual Baseline (kWh)"
        subtitle="Comparison showing electricity saved by automated classroom controls"
      >
        <div className="h-52 w-full md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData.comparison} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="label" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip content={<CustomChartTooltip unit=" kWh" />} />
              <Legend />
              <Bar
                dataKey="current"
                name="Actual Smart Usage"
                fill="#2dd4bf"
                radius={[6, 6, 0, 0]}
                animationDuration={650}
              />
              <Bar
                dataKey="baseline"
                name="Manual Baseline"
                fill="#3b82f6"
                opacity={0.45}
                radius={[6, 6, 0, 0]}
                animationDuration={650}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
