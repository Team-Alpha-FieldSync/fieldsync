export const USER_ROLES = {
  ADMIN: "ADMIN",
  TECHNICIAN: "TECHNICIAN",
  CLIENT: "CLIENT",
} as const;

export type UserRoleConstant = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;

export const API = {
  GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL as string,
} as const;

export const JOB_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  VERIFIED: "VERIFIED",
  CANCELLED: "CANCELLED",
} as const;
