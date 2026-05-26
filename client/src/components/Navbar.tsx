import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, User, Menu, LogOut } from "lucide-react";
import Button from "./ui/Button";
import AddJobModal from "./AddJobModal";
import NotificationsModal from "./NotificationsModel";
import useAuth from "../hooks/useAuth";

export default function AdminNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // 3. State to control the modals
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  // 2. Add state for the Notifications Modal
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const pageConfig: Record<string, { title: string; subtitle: string; actionText: string | null }> = {
    "/admin": { title: "Dashboard", subtitle: "Overview of your field operations", actionText: null },
    "/admin/jobs": { title: "Jobs", subtitle: "Manage and monitor all jobs and service requests", actionText: "+ Add Job" },
    "/admin/technicians": { title: "Technicians", subtitle: "Manage your field technician team", actionText: "+ Add Technician" },
  };

  const currentConfig = pageConfig[location.pathname] || {
    title: "Admin Panel",
    subtitle: "Manage your system settings",
    actionText: null,
  };

  // 4. Handle dynamic button clicks
  const handleActionClick = () => {
    if (currentConfig.actionText === "+ Add Job") {
      setIsAddJobModalOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel = user?.role === "ADMIN" ? "Admin" : user?.role ?? "User";

  return (
    <>
      <header className="h-16 px-4 xl:px-8 bg-bg-base border-b border-border-muted flex items-center justify-between sticky top-0 z-30">
        
        {/* Left Side: Branding, Mobile Menu & Dynamic Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/admin"
            className="hidden sm:flex items-center gap-2 shrink-0 mr-1"
          >
            <div className="w-7 h-7 bg-bg-light border border-border-muted rounded-full shrink-0" />
            <span className="font-bold text-fg hidden lg:inline">FieldSync</span>
          </Link>
          <button
            onClick={onMenuClick}
            className="xl:hidden p-2 -ml-2 text-fg-muted hover:text-fg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl xl:text-2xl font-bold text-fg tracking-tight">
              {currentConfig.title}
            </h1>
            <p className="text-xs xl:text-sm text-fg-muted mt-0.5 xl:mt-1 hidden sm:block">
              {currentConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Actions, Search, and Profile */}
        <div className="flex items-center gap-2 xl:gap-6">
          
          {/* Wire the click handler to the button */}
          {currentConfig.actionText && (
            <Button 
              variant="primary" 
              className="py-1.5 px-3 xl:py-2 xl:px-4 text-xs xl:text-sm"
              onClick={handleActionClick}
            >
              {currentConfig.actionText}
            </Button>
          )}

          <div className="h-8 w-px bg-border-muted mx-1 hidden xl:block"></div>
           
          {/* 3. Upgraded Bell Button with onClick and red dot indicator */}
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="relative text-fg-muted hover:text-primary transition-colors bg-bg-light p-2 xl:p-2.5 rounded-full border border-border-muted"
          >
            <Bell size={18} className="xl:w-5 xl:h-5" />
            {/* Red unread indicator dot */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full border-2 border-bg-base"></span>
          </button>

          <div className="flex items-center gap-2 xl:gap-3 pl-1 xl:pl-2">
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center border border-primary/30 shrink-0">
              <User size={18} className="xl:w-5 xl:h-5" />
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-bold text-fg leading-tight">{roleLabel}</p>
              <p className="text-xs text-fg-muted">{user?.email ?? "admin@fieldsync.com"}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="text-fg-muted hover:text-danger transition-colors bg-bg-light p-2 rounded-full border border-border-muted"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Render the Modals outside of the header flow */}
      <AddJobModal 
        isOpen={isAddJobModalOpen} 
        onClose={() => setIsAddJobModalOpen(false)} 
      />
      
      {/* 4. Render the Notifications Modal */}
      <NotificationsModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </>
  );
}