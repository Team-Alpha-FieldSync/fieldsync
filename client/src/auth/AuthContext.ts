import { createContext } from "react";
import type { User } from "../types/auth";

export type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export default createContext<AuthContextType | null>(null);