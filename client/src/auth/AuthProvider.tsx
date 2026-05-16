import { useState, type ReactNode } from "react";
import type { User } from "../types/auth";
import AuthContext from "../auth/AuthContext";

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(
      // ⚠️ DEVELOPMENT ONLY: Simulated logged-in user for testing UI
  // Replace the code with `null` in production and use real authentication flow
    {   
    id: "1",
    email: "admin@test.com",
    role: "admin",
    });

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);
   
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}