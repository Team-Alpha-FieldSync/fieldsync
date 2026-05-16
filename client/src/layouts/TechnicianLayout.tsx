import { Outlet } from "react-router-dom";

export default function TechnicianLayout(){
  return (
    <div>
      <h1>Technician Layout</h1>

      <Outlet />
    </div>
  );
}