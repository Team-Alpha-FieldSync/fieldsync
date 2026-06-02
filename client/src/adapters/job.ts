import { formatStatus, formatDate } from "../utils/formatters";

export type JobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED" | "CANCELLED";
export type JobPriority = "HIGH" | "MEDIUM" | "LOW";

export type JobNode = {
  id: string;
  code: string;
  title: string;
  description: string;
  location: string;
  status: JobStatus;
  priority: JobPriority;
  category: string;
  deadline: string;
  createdAt: string;
  technician: { id: string; name: string; techCode?: string | null; phone?: string | null };
  client: { id: string; name: string; phone?: string | null };
};

export type JobView = {
  rawId: string;            // Mongo _id — used by action mutations (Phase 5)
  id: string;               // friendly code, e.g. "JOB-1475"
  title: string;
  description: string;
  category: string;
  client: { name: string; phone: string; address: string };
  assignedTech: { name: string; id: string };
  status: JobStatus;
  priority: JobPriority;
  dateCreated: string;
  deadline: string;
};

export function mapJob(node: JobNode): JobView {
  return {
    rawId: node.id,
    id: node.code,
    title: node.title,
    description: node.description,
    category: formatStatus(node.category),
    client: {
      name: node.client.name,
      phone: node.client.phone ?? "",
      address: node.location,
    },
    assignedTech: {
      name: node.technician.name,
      id: node.technician.techCode ?? node.technician.id,
    },
    status: node.status,
    priority: node.priority,
    dateCreated: formatDate(node.createdAt),
    deadline: formatDate(node.deadline),
  };
}