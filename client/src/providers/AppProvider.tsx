import type { ReactNode } from "react";
import AuthProvider from "../auth/AuthContext";

type Props = {
  children: ReactNode;
};

export default function AppProvider({ children }: Props) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}