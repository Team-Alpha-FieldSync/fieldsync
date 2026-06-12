import { useState } from "react";
import { Outlet } from "react-router-dom";
import TechSidebar from "../components/TechSidebar";
import TechNavbar from "../components/TechNavbar";
export default function TechnicianLayout() {
  // State to control mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-base overflow-hidden">
      
      {/* Mobile Dark Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. The Responsive Sidebar */}
      {/* On desktop (md): always visible (translate-x-0). On mobile: hidden (-translate-x-full) until open */}
      <div className={`fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      }`}>
        <TechSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* 2. Main Content Wrapper */}
      {/* On desktop (md): margin-left pushes it past sidebar. On mobile: full width */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen w-full transition-all">
        
        {/* 3. The Navbar (Pass the function to open the sidebar) */}
        <TechNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      
        {/* 4. The Dynamic Page Content */}
        {/* Added overflow-x-hidden to prevent horizontal scrolling issues on mobile */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>

      </div>
    </div>
  );
}