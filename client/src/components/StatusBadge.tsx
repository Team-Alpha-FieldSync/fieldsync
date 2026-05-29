import React from "react";
import { formatStatus } from "../utils/formatters";

export type BadgeStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "VERIFIED"
  | "CANCELLED"
  | "AVAILABLE"
  | "UNAVAILABLE";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
}

export default function StatusBadge({ status, className = "", ...props }: StatusBadgeProps) {
  const variants: Record<BadgeStatus, string> = {
    PENDING: "bg-warning text-fg",
    IN_PROGRESS: "bg-info text-bg-light",
    COMPLETED: "bg-success text-bg-light",
    VERIFIED: "bg-gray-400 text-bg-light",
    CANCELLED: "bg-danger text-bg-light",
    AVAILABLE: "bg-success text-bg-light",
    UNAVAILABLE: "bg-danger text-bg-light",
  };
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase border border-transparent";
  const colorClass = variants[status] || "bg-bg-dark text-fg-muted";
  return (
    <span className={`${baseStyles} ${colorClass} ${className}`.trim()} {...props}>
      {formatStatus(status)}
    </span>
  );
}