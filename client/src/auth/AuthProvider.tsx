import { useState, type ReactNode } from "react";
import type { User } from "../types/auth";
import AuthContext from "../auth/AuthContext";
import {
  clearSession,
  getStoredUser,
  getToken,
  persistSession,
} from "./session";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getToken());
  const [loading] = useState(false);

  const isAuthenticated = !!token;

  const login = (newToken: string, newUser: User) => {
    persistSession(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}