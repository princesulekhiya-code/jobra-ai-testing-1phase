"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { getSession, logout as apiLogout, refreshToken, type SessionResponse } from "@/lib/auth-api";

const TOKEN_REFRESH_MS = 12 * 60 * 1000; // refresh 3 min before 15-min expiry

interface AuthState {
  user: SessionResponse | null;
  loading: boolean;
  authenticated: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  authenticated: false,
  refresh: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const session = await getSession();
      setUser(session.authenticated ? session : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const silentRefresh = useCallback(async () => {
    try {
      const ok = await refreshToken();
      if (ok) {
        const session = await getSession();
        setUser(session.authenticated ? session : null);
      }
    } catch {
      // keep current user state on network errors - don't logout on transient failures
    }
  }, []);

  const logout = useCallback(async () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    await apiLogout();
    setUser(null);
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (user?.authenticated) {
      refreshTimerRef.current = setInterval(silentRefresh, TOKEN_REFRESH_MS);
    } else if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [user?.authenticated, silentRefresh]);

  const value = useMemo(
    () => ({
      user,
      loading,
      authenticated: !!user?.authenticated,
      refresh,
      logout,
    }),
    [user, loading, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
