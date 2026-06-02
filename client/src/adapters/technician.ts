import { formatStatus } from "../utils/formatters";

export type TechAvailability = "AVAILABLE" | "UNAVAILABLE";

export type TechNode = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  specialization: string;
  availability: TechAvailability;
  isActive: boolean;
  techCode?: string | null;
  currentJob?: { id: string; code: string; title: string } | null;
};

export type TechView = {
  rawId: string;            // Mongo _id — used by mutations (e.g. deactivate, assign)
  id: string;               // friendly "TCH ####"
  name: string;
  email: string;
  specialization: string;
  assignment: { title: string; jobId: string } | null;
  status: TechAvailability;
  statusLabel: string;
  phone: string;
  isActive: boolean;
};

export function mapTechnician(node: TechNode): TechView {
  return {
    rawId: node.id,
    id: node.techCode ?? node.id,
    name: node.name,
    email: node.email,
    specialization: formatStatus(node.specialization),
    assignment: node.currentJob
      ? { title: node.currentJob.title, jobId: `#${node.currentJob.code}` }
      : null,
    status: node.availability,
    statusLabel: node.availability === "AVAILABLE" ? "Available" : "Offline",
    phone: node.phone ?? "—",
    isActive: node.isActive,
  };
}