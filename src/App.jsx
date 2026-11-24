import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './hooks/useAuth';
import { ClassroomProvider } from './hooks/useClassroom';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ToastContainer from './components/Toast';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import ScrollProgressBar from './components/ScrollProgressBar';

import Login from './pages/Login';
import Home from './pages/Home';
import Attendance from './pages/Attendance';
import Energy from './pages/Energy';
import Notices from './pages/Notices';
import Control from './pages/Control';
import Settings from './pages/Settings';

/**
 * Root Application Shell
 * Connects Lenis smooth scrolling, top scroll progress bar, custom cursor,
 * 0–100% preloader, and reduced-motion accessibility wrapper.
 */
export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Start Lenis smooth scroll synced with GSAP ScrollTrigger once preloader finishes
  useSmoothScroll(!preloaderDone);

  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <ClassroomProvider>
          <Preloader onFinish={() => setPreloaderDone(true)} />
          <ScrollProgressBar />
          <CustomCursor />

          <BrowserRouter>
            <Routes>
              {/* Public Faculty Login Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Teacher-Only Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="energy" element={<Energy />} />
                <Route path="notices" element={<Notices />} />
                <Route path="control" element={<Control />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <ToastContainer />
          </BrowserRouter>
        </ClassroomProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
