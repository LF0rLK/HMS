'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginApi, logout as logoutApi, getMe } from '@/lib/api/auth';
import { register as registerApi } from '@/lib/api/auth';
import { getDashboardRoute } from '@/lib/utils/permissions';
import { safeJsonParse } from '@/lib/utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (token && stored) {
      setUser(safeJsonParse(stored));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginApi(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    router.push(getDashboardRoute(data.user.role));
    return data;
  }, [router]);

  const register = useCallback(async (userData) => {
    const data = await registerApi(userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    router.push(getDashboardRoute(data.user.role));
    return data;
  }, [router]);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
    setProfile(null);
    router.push('/login');
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const data = await getMe();
      setUser(data.user);
      setProfile(data.profile);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch {
      // Token expired — clear session
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
