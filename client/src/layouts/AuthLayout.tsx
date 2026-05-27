import { Outlet } from "react-router-dom";

/**
 * Minimal layout for unauthenticated pages (login, signup).
 * No navbar or sidebar — child pages own their content layout.
 */
export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-bg">
      <Outlet />
    </main>
  );
}
