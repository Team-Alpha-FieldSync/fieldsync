import { Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function TechnicianLayout() {
  return (
    <div>
      <header className="flex items-center justify-between mb-4">
        <h1>Technician Layout</h1>
        <LogoutButton className="bg-red-500 text-white px-4 py-2 rounded" />
      </header>
      <Outlet />
    </div>
  );
}