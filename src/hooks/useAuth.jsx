import React, { createContext, useContext, useState } from 'react';
import { DEMO_TEACHER } from '../data/mockData';

const AuthContext = createContext(null);
const STORAGE_KEY = 'smart_classroom_teacher_auth';

/**
 * AuthProvider manages Teacher-only authentication state.
 * Students are strictly blocked from logging in.
 */
export function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // Block student email domains explicitly
    if (cleanEmail.includes('student') || cleanEmail.endsWith('@students.college.edu')) {
      return {
        ok: false,
        error: 'Access Denied: Student accounts are not permitted on the Faculty Portal.',
      };
    }

    // TODO: replace with real API/JWT auth
    // Example later:
    // const res = await fetch('/api/v1/auth/teacher-login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: cleanEmail, password }),
    // });
    // const { token, teacherProfile } = await res.json();

    await new Promise((resolve) => setTimeout(resolve, 400));

    if (
      cleanEmail === DEMO_TEACHER.email.toLowerCase() &&
      password === DEMO_TEACHER.password
    ) {
      const sessionUser = {
        id: DEMO_TEACHER.id,
        name: DEMO_TEACHER.name,
        email: DEMO_TEACHER.email,
        role: DEMO_TEACHER.role,
        department: DEMO_TEACHER.department,
        avatarInitials: DEMO_TEACHER.avatarInitials,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
      setTeacher(sessionUser);
      return { ok: true };
    }

    return {
      ok: false,
      error: 'Invalid faculty credentials. Use the demo teacher account shown below.',
    };
  };

  const updateTeacherProfile = (updates) => {
    // TODO: replace with real API/JWT auth PATCH /api/v1/teachers/me
    setTeacher((prev) => {
      if (!prev) return prev;
      const initials = (updates.name || prev.name)
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
      const updated = { ...prev, ...updates, avatarInitials: initials || 'TC' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    // TODO: replace with real API/JWT auth token revocation / logout endpoint
    localStorage.removeItem(STORAGE_KEY);
    setTeacher(null);
  };

  return (
    <AuthContext.Provider
      value={{
        teacher,
        isAuthenticated: Boolean(teacher && teacher.role === 'TEACHER'),
        login,
        logout,
        updateTeacherProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
