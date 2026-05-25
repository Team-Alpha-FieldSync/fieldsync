import { useLocation } from "react-router-dom";
import { Search, Bell, User, Menu } from "lucide-react";
import Button from "./ui/Button";

// Accept the new prop from Layout
export default function AdminNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const location = useLocation();

  const pageConfig: Record<string, { title: string; subtitle: string; actionText: string | null }> = {
    "/admin": { title: "Dashboard", subtitle: "Overview of your field operations", actionText: null },
    "/admin/jobs": { title: "Jobs", subtitle: "Manage and monitor all jobs and service requests", actionText: "+ Add Job" },
  };

  const currentConfig = pageConfig[location.pathname] || {
    title: "Admin Panel",
    subtitle: "Manage your system settings",
    actionText: null,
  };

  return (
    <header className="h-16 px-4 xl:px-8 bg-bg-base border-b border-border-muted flex items-center justify-between sticky top-0 z-30">
      
      {/* Left Side: Mobile Menu & Dynamic Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu (Hidden on Desktop) */}
        <button 
          onClick={onMenuClick}
          className="xl:hidden p-2 -ml-2 text-fg-muted hover:text-fg transition-colors"
        >
          <Menu size={24} />
        </button>

        <div>
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
        
        {currentConfig.actionText && (
          <Button variant="primary" className="py-1.5 px-3 xl:py-2 xl:px-4 text-xs xl:text-sm">
            {currentConfig.actionText}
          </Button>
        )}

        <div className="hidden sm:block">
        </div>

        <div className="h-8 w-px bg-border-muted mx-1 hidden xl:block"></div>
         
        <div className="flex items-center gap-2">
          <button className="text-fg-muted hover:text-primary transition-colors bg-bg-light p-2 xl:p-2.5 rounded-full border border-border-muted">
            <Search size={18} className="xl:w-5 xl:h-5" />
          </button>
          <button className="text-fg-muted hover:text-primary transition-colors bg-bg-light p-2 xl:p-2.5 rounded-full border border-border-muted">
            <Bell size={18} className="xl:w-5 xl:h-5" />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-1 xl:pl-2">
          <div className="w-8 h-8 xl:w-10 xl:h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center border border-primary/30 shrink-0">
            <User size={18} className="xl:w-5 xl:h-5" />
          </div>
          <div className="hidden xl:block">
            <p className="text-sm font-bold text-fg leading-tight">Admin</p>
            <p className="text-xs text-fg-muted">admin@fieldsync.com</p>
          </div>
        </div>

      </div>
    </header>
  );
}