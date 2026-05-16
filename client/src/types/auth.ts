export type UserRole = "admin" | "technician";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}