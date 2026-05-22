import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-bg-base">
      
      {/* 1. The Fixed Sidebar (Stays pinned to the left) */}
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      {/* 2. Main Content Wrapper (Pushed right by ml-64) */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* 3. The Navbar goes right here! 
             Because this wrapper is a flex-col, it sits perfectly at the top */}
        <Navbar />
      
        {/* 4. The Dynamic Page Content sits directly below the Navbar */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}