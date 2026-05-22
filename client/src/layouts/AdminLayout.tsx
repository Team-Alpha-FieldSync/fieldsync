import { Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import StatusBadge from "../components/StatusBadge";
import Navbar from "../components/Navbar";

export default function AdminLayout(){
  return (
    <div>
      
      <Navbar/>

      {/* Sidebar + Navbar will go here */}

     
        <StatusBadge status="pending" />
      

      <Outlet />
      <LogoutButton/>
    </div>
  );
}