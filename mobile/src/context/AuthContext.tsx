import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { authApi, isAuthError, setToken } from '@/api/client';
import { clearNotificationPrefsCache } from '@/notifications/notificationPrefs';
import { unregisterStoredPushToken } from '@/notifications/syncExpoPushToken';

interface User {
  id: string;
  email?: string | null;
  phone?: string | null;
  displayName?: string;
  role?: string;
  avatar?: string;
  [key: string]: unknown;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setAuth: (token: string | null, userData?: User | null) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuth = useCallback(async (token: string | null, userData: User | null = null) => {
    await setToken(token);
    setUser(token ? userData : null);
  }, []);

  const logout = useCallback(async () => {
    await unregisterStoredPushToken();
    clearNotificationPrefsCache();
    await setAuth(null);
  }, [setAuth]);

  const loadUser = useCallback(async () => {
    try {
      const data = await authApi.me();
      setUser(data as User);
    } catch {
      await setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authApi.me();
      setUser(data as User);
      return data as User;
    } catch (err) {
      if (isAuthError(err)) {
        setUser(null);
      }
      return null;
    }
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    setAuth,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
