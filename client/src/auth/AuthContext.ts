import { createContext } from "react";
import type { User } from "../types/auth";

export type AuthContextType = {
  user: User | null;
  token: string | null; //  Include token if needed for API calls
  loading: boolean; //  Track loading state during authentication processes
  isAuthenticated: boolean; // Derived state for convenience

  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;