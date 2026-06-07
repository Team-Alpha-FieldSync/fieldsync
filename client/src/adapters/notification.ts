import type { LucideIcon } from "lucide-react";
import { AlertCircle, Briefcase, CheckCircle, Bell } from "lucide-react";
import { formatTimeAgo } from "../utils/formatters";

export type NotificationType =
  | "JOB_ASSIGNED"
  | "JOB_UPDATED"
  | "JOB_COMPLETED"
  | "JOB_VERIFIED"
  | "SYSTEM_ALERT";

export type NotificationNode = {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
  job?: { id: string; title: string; status: string } | null;
};

export type NotificationView = {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  icon: LucideIcon;
  color: string;
  bg: string;
};

const TYPE_META: Record<
  NotificationType,
  { title: string; icon: LucideIcon; color: string; bg: string }
> = {
  JOB_ASSIGNED: {
    title: "Job Assigned",
    icon: Briefcase,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  JOB_UPDATED: {
    title: "Job Updated",
    icon: Bell,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  JOB_COMPLETED: {
    title: "Job Completed",
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  JOB_VERIFIED: {
    title: "Job Verified",
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
  SYSTEM_ALERT: {
    title: "System Alert",
    icon: AlertCircle,
    color: "text-danger",
    bg: "bg-danger/10",
  },
};

export function mapNotification(node: NotificationNode): NotificationView {
  const meta = TYPE_META[node.type] ?? TYPE_META.SYSTEM_ALERT;
  return {
    id: node.id,
    title: meta.title,
    desc: node.message,
    time: formatTimeAgo(node.createdAt),
    unread: !node.read,
    icon: meta.icon,
    color: meta.color,
    bg: meta.bg,
  };
}
