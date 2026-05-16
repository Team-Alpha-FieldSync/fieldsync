/**
 * Centralized route definitions
 * Helps avoid hardcoding strings across the app
 */
export const ROUTES = {
  LOGIN: "/login",

  ADMIN: {
    DASHBOARD: "/admin",
    JOBS: "/admin/jobs",
    JOB_DETAIL: "/admin/jobs/:id",
    TECHNICIANS: "/admin/technicians",
    CLIENTS: "/admin/clients",
  },

  TECHNICIAN: {
    DASHBOARD: "/technician",
    JOB_DETAIL: "/technician/jobs/:id",
  },
} as const;