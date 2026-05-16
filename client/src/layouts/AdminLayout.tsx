import { Outlet } from "react-router-dom";

export default function AdminLayout(){
  return (
    <div>
      <h1>Admin Layout</h1>

      {/* Sidebar + Navbar will go here */}

      <Outlet />
    </div>
  );
}