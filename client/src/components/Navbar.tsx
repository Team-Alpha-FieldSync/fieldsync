import { useLocation } from "react-router-dom";
import { Search, Bell, User } from "lucide-react";
import Button from "./ui/Button";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  // 1. Grab the current URL path
  const location = useLocation();

  // 2. A "dictionary" that maps the current URL to the correct text and buttons
  const pageConfig: Record<string, { title: string; subtitle: string; actionText: string | null }> = {
    "/admin": {
      title: "Dashboard",
      subtitle: "Overview of your field operations",
      actionText: null, // No button on the main dashboard
    },
    "/admin/jobs": {
      title: "Jobs",
      subtitle: "Manage and monitor all jobs and service requests",
      actionText: "+ Add Job",
    },
    "/admin/technicians": {
      title: "Technicians",
      subtitle: "Manage your field technician team",
      actionText: "+ Add Technician",
    },
    "/admin/clients": {
      title: "Clients",
      subtitle: "Manage customer accounts",
      actionText: "+ Add Client",
    },
  };

  // 3. Look up the current page config, with a safe fallback if the URL isn't in our dictionary
  const currentConfig = pageConfig[location.pathname] || {
    title: "Admin Panel",
    subtitle: "Manage your system settings",
    actionText: null,
  };

  return (
    <header className="h-16 px-8 bg-bg-base border-b border-border-muted flex items-center justify-between sticky top-0 z-40">
      
      {/* Left Side: Dynamic Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-fg tracking-tight">
          {currentConfig.title}
        </h1>
        <p className="text-sm text-fg-muted mt-1">
          {currentConfig.subtitle}
        </p>
      </div>

      {/* Right Side: Actions, Search, and Profile */}
      <div className="flex items-center gap-6">
        
        {/* Dynamic Action Button (Only renders if actionText exists for this page) */}
        {currentConfig.actionText && (
          <Button variant="primary" className="py-2">
            {currentConfig.actionText}
          </Button>
        )}

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-border-muted mx-2"></div>
         
         <LogoutButton/>

        {/* Search Icon / Button */}
        <button className="text-fg-muted hover:text-primary transition-colors bg-bg-light p-2.5 rounded-full border border-border-muted">
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button className="text-fg-muted hover:text-primary transition-colors bg-bg-light p-2.5 rounded-full border border-border-muted">
          <Bell size={20} />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center border border-primary/30">
            <User size={20} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-fg leading-tight">Admin</p>
            <p className="text-xs text-fg-muted">admin@fieldsync.com</p>
          </div>
        </div>

      </div>
    </header>
  );
}