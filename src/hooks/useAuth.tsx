import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "@/services/api";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  userRole: string | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  phone?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get("/me")
        .then((res) => setUser(res.data.data))
        .catch(() => { setToken(null); localStorage.removeItem("token"); })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/login", { email, password });
    const { user: u, token: t } = res.data.data;
    localStorage.setItem("token", t);
    setToken(t);
    setUser(u);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post("/register", data);
    const { user: u, token: t } = res.data.data;
    localStorage.setItem("token", t);
    setToken(t);
    setUser(u);
  };

  const logout = async () => {
    try { await api.post("/logout"); } catch {}
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const userRole = user?.roles?.[0]?.name ?? null;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, userRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
