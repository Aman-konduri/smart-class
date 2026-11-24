import React, { Suspense, lazy, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, Sparkles, Cpu, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DEMO_TEACHER } from '../data/mockData';
import { APPLE_SPRING } from '../utils/motionConfig';
import Magnetic from '../components/Magnetic';

const Scene3D = lazy(() => import('../components/Scene3D'));

/**
 * Teacher Login Page — Apple Pro Dark Stage (#000000) + Lusion 3D Physics Hero
 * Single accent (#2997ff), huge display typography, clean #1c1c1e sign-in card.
 */
export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(DEMO_TEACHER.email);
  const [password, setPassword] = useState(DEMO_TEACHER.password);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your faculty email and password.');
      return;
    }

    setSubmitting(true);
    // TODO: replace with real API/JWT auth
    const result = await login(email, password);
    setSubmitting(false);

    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_TEACHER.email);
    setPassword(DEMO_TEACHER.password);
    setError('');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 text-[#f5f5f7]">
      {/* Subtle Apple-style soft radial halo behind hero only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_45%,rgba(41,151,255,0.14),transparent_60%)]"
      />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left Hero Column with Huge Apple Typography + Lusion Physics 3D */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={APPLE_SPRING}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#1c1c1e] px-3.5 py-1.5 text-xs font-medium text-[#a1a1a6]">
            <ShieldCheck className="h-4 w-4 text-[#2997ff]" />
            Faculty-Only Smart Campus Portal
          </div>

          <h1 className="hero-headline mt-6 font-display text-[#f5f5f7]">
            Classroom.{' '}
            <span className="bg-gradient-to-b from-white to-[#2997ff] bg-clip-text text-transparent">
              Reimagined.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#a1a1a6]">
            Real-time occupancy sensing, effortless climate and lighting control,
            and instant RFID attendance—crafted exclusively for teaching faculty.
          </p>

          {/* Floating 3D Hardware Stage with Soft Studio Shadow */}
          <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-b from-[#1c1c1e] to-black p-2 shadow-[0_32px_80px_rgba(0,0,0,0.9)]">
            <Suspense
              fallback={
                <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-2xl bg-[#1c1c1e] text-xs font-medium text-[#a1a1a6] sm:h-72">
                  Preparing 3D Classroom Hardware...
                </div>
              }
            >
              <Scene3D className="h-64 w-full sm:h-72" />
            </Suspense>
          </div>
        </motion.div>

        {/* Right Calm Apple Sign-In Card (#1c1c1e) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...APPLE_SPRING, delay: 0.08 }}
          className="lg:col-span-5"
        >
          <div className="rounded-3xl border border-white/10 bg-[#1c1c1e] p-8 shadow-2xl sm:p-10">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2997ff] text-white">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight text-white">
                  Teacher Portal
                </h2>
                <p className="text-xs text-[#a1a1a6]">
                  Authorized Faculty Sign-In Only
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2.5 rounded-2xl border border-[#ff453a]/30 bg-[#ff453a]/10 p-3.5 text-xs font-medium text-[#ff453a]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
              <div>
                <label
                  htmlFor="teacher-email"
                  className="mb-1.5 block text-xs font-medium text-[#a1a1a6]"
                >
                  Faculty Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#6e6e73]" />
                  <input
                    id="teacher-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="prof.sharma@college.edu"
                    className="w-full rounded-xl border border-white/10 bg-black/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6e6e73] outline-none transition focus:border-[#2997ff] focus:ring-2 focus:ring-[#2997ff]/25"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="teacher-password"
                  className="mb-1.5 block text-xs font-medium text-[#a1a1a6]"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#6e6e73]" />
                  <input
                    id="teacher-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-black/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6e6e73] outline-none transition focus:border-[#2997ff] focus:ring-2 focus:ring-[#2997ff]/25"
                  />
                </div>
              </div>

              <Magnetic strength={0.16} className="block w-full pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#2997ff] py-3 text-sm font-medium text-white transition hover:bg-[#47a6ff] active:scale-[0.97] disabled:opacity-50"
                >
                  {submitting ? 'Verifying Faculty Credentials...' : 'Sign In'}
                </button>
              </Magnetic>
            </form>

            <div className="mt-7 rounded-2xl border border-white/10 bg-black/50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2997ff]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Demo Faculty Account
                </span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs font-medium text-[#2997ff] hover:underline"
                >
                  Auto-fill
                </button>
              </div>
              <p className="mt-2 font-mono text-xs text-[#f5f5f7]">
                {DEMO_TEACHER.email}
              </p>
              <p className="font-mono text-xs text-[#a1a1a6]">
                Password: {DEMO_TEACHER.password}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
