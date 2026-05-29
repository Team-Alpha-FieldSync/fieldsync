export const USER_ROLES = {
  ADMIN: "ADMIN",
  TECHNICIAN: "TECHNICIAN",
  CLIENT: "CLIENT",
} as const;

export const JOB_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  VERIFIED: "VERIFIED",
  CANCELLED: "CANCELLED",
} as const;

export const JOB_PRIORITY = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;

export const JOB_CATEGORY = {
  NETWORKING: "NETWORKING",
  ELECTRICAL: "ELECTRICAL",
  HVAC: "HVAC",
  PLUMBING: "PLUMBING",
  OTHER: "OTHER",
} as const;

export const AVAILABILITY = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;

export type UserRoleConstant = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const API = {
  GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL as string,
} as const;


