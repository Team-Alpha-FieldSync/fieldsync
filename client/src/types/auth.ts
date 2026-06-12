export type UserRole = "ADMIN" | "TECHNICIAN" | "CLIENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}