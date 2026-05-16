import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type Props = {
  children: ReactNode;
};

export default function TechnicianRoute({ children }: Props) {
  const { user } = useAuth();

  if (!user || user.role !== "technician") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}