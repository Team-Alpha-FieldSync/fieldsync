import React from "react";

// 1. Strictly type the statuses based on the project brief
export type JobStatus = "success" | "pending" | "error" | "in-progress"| "available" | "unavailable" | "completed";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: JobStatus;
}

export default function StatusBadge({ 
  status, 
  className = "", 
  ...props 
}: StatusBadgeProps) {
  
  const variants = {
    "success": "bg-success text-bg-light",
    "pending": "bg-warning text-fg",
    "error": "bg-danger text-bg-light",
    "in-progress": "bg-info text-bg-light",
    "available": "bg-success text-bg-light",
    "unavailable": "bg-danger text-bg-light",
    "completed": "bg-gray-400 text-bg-light"
  };

  // 3. Helper function to format the text dynamically
  // Turns "in-progress" into "In Progress", and "pending" into "Pending"
  const formatLabel = (str: string) => {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase border border-transparent";
  
  // Safely grab the color, defaulting to a gray fallback just in case bad data comes in
  const colorClass = variants[status] || "bg-bg-dark text-fg-muted";
  
  const combinedClasses = `${baseStyles} ${colorClass} ${className}`.trim();

  return (
    <span className={combinedClasses} {...props}>
      {formatLabel(status)}
    </span>
  );
}