"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface SessionUser { id: number; name: string; email: string; }

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: RegisterData) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

interface RegisterData {
  name: string; email: string; password: string;
  phone?: string; city?: string; state?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("asd_user");
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setUser(data.customer);
    localStorage.setItem("asd_user", JSON.stringify(data.customer));
    return {};
  }, []);

  const register = useCallback(async (formData: RegisterData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setUser(data.customer);
    localStorage.setItem("asd_user", JSON.stringify(data.customer));
    return {};
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    localStorage.removeItem("asd_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
