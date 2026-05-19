import useAuth from "./useAuth";

export default function useRole() {
  const { user } = useAuth();

  const role = user?.role;

  // =========================
  // ROLE CHECKERS
  // =========================
  const isAdmin = () => role === "ADMIN";
  const isTechnician = () => role === "TECHNICIAN";
  const isClient = () => role === "CLIENT";

  return {
    role,
    isAdmin,
    isTechnician,
    isClient,
  };
}