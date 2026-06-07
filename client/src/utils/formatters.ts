const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

/**
 * Converts an ISO date string or Date object into a readable locale string.
 */
export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString(undefined, options);
}

/**
 * Truncates text to a maximum length, appending an ellipsis when trimmed.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/**
 * Formats a status value for display (e.g. "IN_PROGRESS" → "In Progress").
 */
export function formatStatus(status?: string | null): string {
  if (!status) return "—";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Returns the uppercased first letter of a name, for avatar placeholders.
 */
export function getInitial(name?: string | null): string {
  return name?.trim().charAt(0).toUpperCase() || "?";
}

/**
 * Formats a priority value for display (e.g. "HIGH" → "High").
 */
export function formatPriority(priority?: string | null): string {
  if (!priority) return "—";
  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
}

/**
 * Formats an ISO timestamp as a short relative time (e.g. "5m ago").
 */
export function formatTimeAgo(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return formatDate(value);
}
