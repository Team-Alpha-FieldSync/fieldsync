import { useContext } from "react";
import AuthContext from "../auth/AuthContext";

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return {
    user: context.user,
    token: context.token,
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    logout: context.logout,
  };
}