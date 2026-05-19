import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type Props = {
  children: ReactNode;
};

export default function AdminRoute({ children }: Props){
  const { user } = useAuth();
  
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}