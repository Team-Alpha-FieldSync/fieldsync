import { Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import StatusBadge from "../components/StatusBadge";

export default function AdminLayout(){
  return (
    <div>
      <header className="flex items-center justify-between mb-4">
        <h1>Admin Layout</h1>
        <LogoutButton className="bg-red-500 text-white px-4 py-2 rounded" />
      </header>

      {/* Sidebar + Navbar will go here */}

     
        <StatusBadge status="pending" />
      

      <Outlet />
    </div>
  );
}