import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Sun, Moon, Bug } from 'lucide-react';
import { useClassroom } from '../hooks/useClassroom';
import { useAuth } from '../hooks/useAuth';
import { DEFAULT_SETTINGS } from '../data/mockData';
import Magnetic from '../components/Magnetic';

/**
 * Settings Page (Light-touch staggered card fade-ins + Magnetic Save/Reset buttons)
 */
export default function Settings() {
  const {
    theme,
    setTheme,
    settings,
    updateSettings,
    resetSettings,
    setSensorError,
    addToast,
  } = useClassroom();
  const { updateTeacherProfile } = useAuth();

  const [form, setForm] = useState(settings);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!form.classroomName.trim()) {
      nextErrors.classroomName = 'Classroom name cannot be empty.';
    }
    if (form.tempLimit < 18 || form.tempLimit > 35) {
      nextErrors.tempLimit = 'Temperature threshold must be between 18°C and 35°C.';
    }
    if (form.aqiLimit < 30 || form.aqiLimit > 300) {
      nextErrors.aqiLimit = 'AQI alert limit must be between 30 and 300.';
    }
    if (form.maxOccupancy < 10 || form.maxOccupancy > 300) {
      nextErrors.maxOccupancy = 'Max occupancy must be between 10 and 300 seats.';
    }
    if (form.autoOffDelay < 1 || form.autoOffDelay > 60) {
      nextErrors.autoOffDelay = 'Auto-off delay must be between 1 and 60 minutes.';
    }
    if (!form.teacherName.trim() || !form.teacherEmail.includes('@')) {
      nextErrors.teacherProfile = 'Please provide a valid faculty name and college email.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    updateSettings(form);
    updateTeacherProfile({
      name: form.teacherName,
      department: form.teacherDepartment,
      email: form.teacherEmail,
    });
  };

  const handleReset = () => {
    setForm(DEFAULT_SETTINGS);
    setErrors({});
    resetSettings();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Portal & Sensor Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure classroom automation limits, faculty profile, and display preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6" noValidate>
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass-card p-6"
        >
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            1. Sensor & Automation Thresholds
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Alerts trigger when live classroom readings cross these boundaries
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="set-room" className="mb-1 block text-xs font-semibold">
                Primary Classroom Name
              </label>
              <input
                id="set-room"
                type="text"
                value={form.classroomName}
                onChange={(e) => setForm({ ...form, classroomName: e.target.value })}
                className="input-field"
              />
              {errors.classroomName && (
                <p className="mt-1 text-xs text-rose-500">{errors.classroomName}</p>
              )}
            </div>

            <div>
              <label htmlFor="set-occupancy" className="mb-1 block text-xs font-semibold">
                Maximum Occupancy (Seats)
              </label>
              <input
                id="set-occupancy"
                type="number"
                value={form.maxOccupancy}
                onChange={(e) => setForm({ ...form, maxOccupancy: Number(e.target.value) })}
                className="input-field"
              />
              {errors.maxOccupancy && (
                <p className="mt-1 text-xs text-rose-500">{errors.maxOccupancy}</p>
              )}
            </div>

            <div>
              <label htmlFor="set-temp" className="mb-1 block text-xs font-semibold">
                Temperature Alert Limit (°C)
              </label>
              <input
                id="set-temp"
                type="number"
                value={form.tempLimit}
                onChange={(e) => setForm({ ...form, tempLimit: Number(e.target.value) })}
                className="input-field"
              />
              {errors.tempLimit && (
                <p className="mt-1 text-xs text-rose-500">{errors.tempLimit}</p>
              )}
            </div>

            <div>
              <label htmlFor="set-aqi" className="mb-1 block text-xs font-semibold">
                Air Quality Alert Limit (AQI)
              </label>
              <input
                id="set-aqi"
                type="number"
                value={form.aqiLimit}
                onChange={(e) => setForm({ ...form, aqiLimit: Number(e.target.value) })}
                className="input-field"
              />
              {errors.aqiLimit && (
                <p className="mt-1 text-xs text-rose-500">{errors.aqiLimit}</p>
              )}
            </div>

            <div>
              <label htmlFor="set-delay" className="mb-1 block text-xs font-semibold">
                Empty-Room Auto-Off Delay (Minutes)
              </label>
              <input
                id="set-delay"
                type="number"
                value={form.autoOffDelay}
                onChange={(e) => setForm({ ...form, autoOffDelay: Number(e.target.value) })}
                className="input-field"
              />
              {errors.autoOffDelay && (
                <p className="mt-1 text-xs text-rose-500">{errors.autoOffDelay}</p>
              )}
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.06 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              2. Notification Preferences
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { key: 'emailAlerts', label: 'Daily energy & attendance summary emails' },
                { key: 'aqiPushAlerts', label: 'Instant alert when classroom AQI exceeds limit' },
                { key: 'occupancyAlerts', label: 'Notify when classroom exceeds seat capacity' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/70 p-3 dark:border-slate-800"
                >
                  <span className="text-xs font-medium">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={form[item.key]}
                    onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                    className="h-4 w-4 rounded accent-sky-500"
                  />
                </label>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              3. Teacher Profile & Appearance
            </h2>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="prof-name" className="mb-1 block text-xs font-semibold">
                  Teacher Full Name
                </label>
                <input
                  id="prof-name"
                  type="text"
                  value={form.teacherName}
                  onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="prof-dept" className="mb-1 block text-xs font-semibold">
                  Department
                </label>
                <input
                  id="prof-dept"
                  type="text"
                  value={form.teacherDepartment}
                  onChange={(e) => setForm({ ...form, teacherDepartment: e.target.value })}
                  className="input-field"
                />
              </div>

              {errors.teacherProfile && (
                <p className="text-xs text-rose-500">{errors.teacherProfile}</p>
              )}

              <div className="pt-2">
                <span className="mb-2 block text-xs font-semibold">Interface Theme</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition md:min-h-0 ${
                      theme === 'dark'
                        ? 'border-sky-500 bg-sky-500/15 text-sky-400'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    Deep Navy Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition md:min-h-0 ${
                      theme === 'light'
                        ? 'border-sky-500 bg-sky-500/15 text-sky-600'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    Daylight Crisp
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setSensorError('Simulated MQTT broker timeout on ws://campus-iot.local:8883');
              addToast('Simulated gateway error on Home page', 'error');
            }}
            className="btn-secondary min-h-[44px] w-full text-xs sm:w-auto md:min-h-0"
          >
            <Bug className="h-3.5 w-3.5" />
            Test Home Error State
          </button>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Magnetic>
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary min-h-[44px] w-full sm:w-auto md:min-h-0"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Defaults
              </button>
            </Magnetic>
            <Magnetic>
              <button
                type="submit"
                className="btn-primary min-h-[44px] w-full sm:w-auto md:min-h-0"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </button>
            </Magnetic>
          </div>
        </div>
      </form>
    </div>
  );
}
