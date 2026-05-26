import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, User, Menu, LogOut } from "lucide-react";
import NotificationsModal from "./NotificationsModel";
import useAuth from "../hooks/useAuth";

export default function TechNavbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // 1. Add state for the Notifications Modal
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const pageConfig: Record<
    string,
    { title: string; subtitle: string; actionText: string | null }
  > = {
    "/technician": {
      title: "Dashboard",
      subtitle: "Overview of your field operations",
      actionText: null,
    },
    "/technician/jobs": {
      title: "Jobs",
      subtitle: "Manage and monitor your service requests",
      actionText: null,
    },
  };

  const currentConfig = pageConfig[location.pathname] || {
    title: "Technician Panel",
    subtitle: "Manage your system settings",
    actionText: null,
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel =
    user?.role === "TECHNICIAN" ? "Technician" : user?.role ?? "User";

  return (
    <>
      <header className="h-16 px-4 md:px-8 bg-bg-base border-b border-border-muted flex items-center justify-between sticky top-0 z-30">
        {/* Left Side: Branding, Mobile Menu & Dynamic Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/technician"
            className="hidden sm:flex items-center gap-2 shrink-0 mr-1"
          >
            <div className="w-7 h-7 bg-bg-light border border-border-muted rounded-full shrink-0" />
            <span className="font-bold text-fg hidden lg:inline">FieldSync</span>
          </Link>
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-fg-muted hover:text-fg transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-fg tracking-tight">
              {currentConfig.title}
            </h1>
            <p className="text-xs md:text-sm text-fg-muted mt-0.5 md:mt-1 hidden sm:block">
              {currentConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Actions, Search, and Profile */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Vertical Divider */}
          <div className="h-8 w-px bg-border-muted mx-1 hidden md:block"></div>

          {/* Icons */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative text-fg-muted hover:text-primary transition-colors bg-bg-light p-2 md:p-2.5 rounded-full border border-border-muted"
          >
            <Bell size={18} className="md:w-5 md:h-5" />
            {/* Red unread indicator dot */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full border-2 border-bg-base"></span>
          </button>

          <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center border border-primary/30 shrink-0">
              <User size={18} className="md:w-5 md:h-5" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-fg leading-tight">
                {roleLabel}
              </p>
              <p className="text-xs text-fg-muted">
                {user?.email ?? "technician@fieldsync.com"}
              </p>
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

      {/* 3. Render the Notifications Modal outside the header flow */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
