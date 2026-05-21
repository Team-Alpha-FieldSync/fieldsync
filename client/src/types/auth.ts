export type UserRole = "ADMIN" | "TECHNICIAN" | "CLIENT";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}